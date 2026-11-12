#!/usr/bin/env node
// Converts a Planet Rounds .vmap (see VoxelMapFile.cs in the game) into a
// smaller grid for the browser. The output keeps the game's encoding: a
// palette, then (value u16, run varint) pairs, raw-deflated.
//
// usage: node scripts/bake-planet.mjs <in.vmap> <out.pvm> [targetSize]

import fs from "node:fs";
import zlib from "node:zlib";

const SOLID = 0x8000;
const COLOR = 0x7fff;
const IN_MAGIC = 0x4d565250; // "PRVM"
const OUT_MAGIC = 0x56504853; // "SHPV"

const [, , inPath, outPath, targetArg] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node scripts/bake-planet.mjs <in.vmap> <out.pvm> [targetSize]");
  process.exit(1);
}
const target = Number(targetArg ?? 192);

function readVmap(path) {
  const buf = fs.readFileSync(path);
  let o = 0;
  const u32 = () => ((o += 4), buf.readUInt32LE(o - 4));
  const i32 = () => ((o += 4), buf.readInt32LE(o - 4));
  const f32 = () => ((o += 4), buf.readFloatLE(o - 4));
  if (u32() !== IN_MAGIC) throw new Error(`${path} is not a .vmap`);
  const version = i32();
  const size = i32();
  const cell = f32();
  const origin = [f32(), f32(), f32()];
  const colors = i32();
  const palette = buf.subarray(o, o + colors * 3);
  o += colors * 3;
  let kinds = null;
  if (version >= 2 && buf[o++] === 1) {
    kinds = buf.subarray(o, o + colors);
    o += colors;
  }
  const raw = zlib.inflateRawSync(buf.subarray(o), { maxOutputLength: 2 ** 31 - 1 });
  const n = size * size * size;
  const cells = new Uint16Array(n);
  let p = 0;
  let pos = 0;
  while (pos < n) {
    const value = raw[p] | (raw[p + 1] << 8);
    p += 2;
    let run = 0;
    for (let shift = 0; ; shift += 7) {
      const b = raw[p++];
      run |= (b & 0x7f) << shift;
      if (b < 0x80) break;
    }
    if (value !== 0) cells.fill(value, pos, pos + run);
    pos += run;
  }
  return { size, cell, origin, palette, kinds, cells };
}

// Majority downsample: a coarse cell is solid when at least half its fine
// cells are, and takes the most common color among them.
function downsample(grid, factor) {
  const { size, cells } = grid;
  const out = Math.floor(size / factor);
  const res = new Uint16Array(out * out * out);
  const need = Math.ceil((factor * factor * factor) / 2);
  const counts = new Map();
  for (let z = 0; z < out; z++)
    for (let y = 0; y < out; y++)
      for (let x = 0; x < out; x++) {
        counts.clear();
        let solid = 0;
        for (let dz = 0; dz < factor; dz++)
          for (let dy = 0; dy < factor; dy++)
            for (let dx = 0; dx < factor; dx++) {
              const v = cells[(x * factor + dx) + size * ((y * factor + dy) + size * (z * factor + dz))];
              if (!(v & SOLID)) continue;
              solid++;
              counts.set(v, (counts.get(v) ?? 0) + 1);
            }
        if (solid < need) continue;
        let best = 0;
        let bestCount = -1;
        for (const [v, c] of counts) if (c > bestCount) (best = v), (bestCount = c);
        res[x + out * (y + out * z)] = best;
      }
  return { ...grid, size: out, cell: grid.cell * factor, cells: res };
}

function surfaceCount({ size, cells }) {
  let surface = 0;
  let solid = 0;
  const at = (x, y, z) =>
    x < 0 || y < 0 || z < 0 || x >= size || y >= size || z >= size ? 0 : cells[x + size * (y + size * z)] & SOLID;
  for (let z = 0; z < size; z++)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if (!at(x, y, z)) continue;
        solid++;
        if (!at(x + 1, y, z) || !at(x - 1, y, z) || !at(x, y + 1, z) || !at(x, y - 1, z) || !at(x, y, z + 1) || !at(x, y, z - 1))
          surface++;
      }
  return { solid, surface };
}

function write(path, grid) {
  const { size, cell, origin, palette, kinds, cells } = grid;
  const colors = palette.length / 3;
  const header = Buffer.alloc(4 * 7 + 4 + palette.length + 1 + (kinds ? colors : 0));
  let o = 0;
  header.writeUInt32LE(OUT_MAGIC, o); o += 4;
  header.writeInt32LE(1, o); o += 4;
  header.writeInt32LE(size, o); o += 4;
  header.writeFloatLE(cell, o); o += 4;
  for (const v of origin) (header.writeFloatLE(v, o), (o += 4));
  header.writeInt32LE(colors, o); o += 4;
  Buffer.from(palette).copy(header, o); o += palette.length;
  header[o++] = kinds ? 1 : 0;
  if (kinds) Buffer.from(kinds).copy(header, o);

  const chunks = [];
  const tmp = Buffer.alloc(8);
  let i = 0;
  while (i < cells.length) {
    const value = cells[i];
    let j = i + 1;
    while (j < cells.length && cells[j] === value) j++;
    let n = 0;
    tmp[n++] = value & 0xff;
    tmp[n++] = value >> 8;
    for (let run = j - i; ; run >>>= 7) {
      if (run < 0x80) { tmp[n++] = run; break; }
      tmp[n++] = (run & 0x7f) | 0x80;
    }
    chunks.push(Buffer.from(tmp.subarray(0, n)));
    i = j;
  }
  const body = zlib.deflateRawSync(Buffer.concat(chunks), { level: 9 });
  fs.writeFileSync(path, Buffer.concat([header, body]));
  return header.length + body.length;
}

const t0 = Date.now();
const src = readVmap(inPath);
const factor = Math.max(1, Math.round(src.size / target));
const grid = factor > 1 ? downsample(src, factor) : src;
const stats = surfaceCount(grid);
const bytes = write(outPath, grid);
console.log(
  JSON.stringify({
    in: inPath,
    out: outPath,
    sourceSize: src.size,
    size: grid.size,
    colors: grid.palette.length / 3,
    kinds: Boolean(grid.kinds),
    ...stats,
    kb: Math.round(bytes / 1024),
    ms: Date.now() - t0,
  }),
);
