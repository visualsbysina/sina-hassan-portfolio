#!/usr/bin/env node
// Bakes the hero head GLB into a compact point buffer. Points are sampled
// evenly over the surface (area weighted), so density no longer depends on
// how the mesh was triangulated, and each point keeps the brightness of the
// baked base color under it. The textures themselves are not shipped.
//
// Layout (little endian):
//   u32 magic "SHPT", u32 count, f32 min xyz, f32 max xyz
//   count × u16 xyz   position, normalized to the bounds
//   count × i8  xyz   normal
//   count × u8        luminance
//
// topWeight multiplies sampling density above splitY (0 = bottom of the
// model, 1 = top), so a bust can spend its points on the face instead of
// the shoulders.
//
// usage: node scripts/bake-head.mjs <in.glb> <out.bin> [count] [topWeight] [splitY]

import fs from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import sharp from "sharp";

const [, , inPath, outPath, countArg, topWeightArg, splitArg] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node scripts/bake-head.mjs <in.glb> <out.bin> [count] [topWeight] [splitY]");
  process.exit(1);
}
const COUNT = Number(countArg ?? 72000);
const TOP_WEIGHT = Number(topWeightArg ?? 1);
const SPLIT_Y = Number(splitArg ?? 0.5);
const MAGIC = 0x54504853; // "SHPT"

const doc = await new NodeIO().read(inPath);
const prim = doc.getRoot().listMeshes()[0].listPrimitives()[0];
const pos = prim.getAttribute("POSITION").getArray();
const nrm = prim.getAttribute("NORMAL").getArray();
const uv = prim.getAttribute("TEXCOORD_0").getArray();
const idx = prim.getIndices().getArray();

const tex = prim.getMaterial().getBaseColorTexture();
const { data: pixels, info } = await sharp(Buffer.from(tex.getImage()))
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

function luminanceAt(u, v) {
  const x = Math.min(info.width - 1, Math.max(0, Math.floor((u - Math.floor(u)) * info.width)));
  const y = Math.min(info.height - 1, Math.max(0, Math.floor((v - Math.floor(v)) * info.height)));
  const i = (y * info.width + x) * info.channels;
  return 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
}

let yMin = Infinity, yMax = -Infinity;
for (let i = 1; i < pos.length; i += 3) (yMin = Math.min(yMin, pos[i])), (yMax = Math.max(yMax, pos[i]));
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const tris = idx.length / 3;
const cumulative = new Float64Array(tris);
let total = 0;
for (let t = 0; t < tris; t++) {
  const a = idx[t * 3] * 3, b = idx[t * 3 + 1] * 3, c = idx[t * 3 + 2] * 3;
  const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
  const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
  const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
  const h = ((pos[a + 1] + pos[b + 1] + pos[c + 1]) / 3 - yMin) / (yMax - yMin);
  const weight = 1 + (TOP_WEIGHT - 1) * smoothstep(SPLIT_Y - 0.05, SPLIT_Y + 0.05, h);
  total += 0.5 * Math.hypot(cx, cy, cz) * weight;
  cumulative[t] = total;
}

let seed = 1337;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
function pickTriangle(r) {
  let lo = 0, hi = tris - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumulative[mid] < r) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const P = new Float32Array(COUNT * 3);
const N = new Int8Array(COUNT * 3);
const L = new Uint8Array(COUNT);
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
let lumMin = 255, lumMax = 0;
const lum = new Float32Array(COUNT);

for (let i = 0; i < COUNT; i++) {
  const t = pickTriangle(rand() * total);
  let r1 = rand(), r2 = rand();
  if (r1 + r2 > 1) (r1 = 1 - r1), (r2 = 1 - r2);
  const w0 = 1 - r1 - r2;
  const ia = idx[t * 3], ib = idx[t * 3 + 1], ic = idx[t * 3 + 2];
  let nx = 0, ny = 0, nz = 0;
  for (let k = 0; k < 3; k++) {
    const v = w0 * pos[ia * 3 + k] + r1 * pos[ib * 3 + k] + r2 * pos[ic * 3 + k];
    P[i * 3 + k] = v;
    min[k] = Math.min(min[k], v);
    max[k] = Math.max(max[k], v);
  }
  nx = w0 * nrm[ia * 3] + r1 * nrm[ib * 3] + r2 * nrm[ic * 3];
  ny = w0 * nrm[ia * 3 + 1] + r1 * nrm[ib * 3 + 1] + r2 * nrm[ic * 3 + 1];
  nz = w0 * nrm[ia * 3 + 2] + r1 * nrm[ib * 3 + 2] + r2 * nrm[ic * 3 + 2];
  const len = Math.hypot(nx, ny, nz) || 1;
  N[i * 3] = Math.round((nx / len) * 127);
  N[i * 3 + 1] = Math.round((ny / len) * 127);
  N[i * 3 + 2] = Math.round((nz / len) * 127);
  const u = w0 * uv[ia * 2] + r1 * uv[ib * 2] + r2 * uv[ic * 2];
  const v = w0 * uv[ia * 2 + 1] + r1 * uv[ib * 2 + 1] + r2 * uv[ic * 2 + 1];
  lum[i] = luminanceAt(u, v);
  lumMin = Math.min(lumMin, lum[i]);
  lumMax = Math.max(lumMax, lum[i]);
}
for (let i = 0; i < COUNT; i++) L[i] = Math.round(((lum[i] - lumMin) / Math.max(1, lumMax - lumMin)) * 255);

const header = Buffer.alloc(8 + 24);
header.writeUInt32LE(MAGIC, 0);
header.writeUInt32LE(COUNT, 4);
for (let k = 0; k < 3; k++) {
  header.writeFloatLE(min[k], 8 + k * 4);
  header.writeFloatLE(max[k], 20 + k * 4);
}
const Q = new Uint16Array(COUNT * 3);
for (let i = 0; i < COUNT; i++)
  for (let k = 0; k < 3; k++)
    Q[i * 3 + k] = Math.round(((P[i * 3 + k] - min[k]) / (max[k] - min[k])) * 65535);

const out = Buffer.concat([header, Buffer.from(Q.buffer), Buffer.from(N.buffer), Buffer.from(L.buffer)]);
fs.writeFileSync(outPath, out);
console.log(
  JSON.stringify({
    in: inPath,
    inKb: Math.round(fs.statSync(inPath).size / 1024),
    out: outPath,
    outKb: Math.round(out.length / 1024),
    points: COUNT,
    sourceVertices: pos.length / 3,
    sourceTriangles: tris,
  }),
);
