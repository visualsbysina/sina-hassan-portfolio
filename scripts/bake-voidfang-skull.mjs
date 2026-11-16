#!/usr/bin/env node
// Meshes the game's voidfang-skull.bytes into a compact web binary so the
// cursed-orb lab map can show the skull trapped in the glass without shipping
// the dense 96³ grid or meshing it on the client.
//
// Layout (little endian):
//   u32 magic "SHSK", u32 version, u32 verts, u32 indices
//   f32 extent (max AABB axis, for FitGroundShare scaling)
//   f32 eyeL xyz, f32 eyeR xyz  (Unity mesh space, cellSize 1)
//   deflate-raw body:
//     verts × i16 xyz   position, normalized to [-extent/2, extent/2]
//     verts × i8  xyz   normal
//     verts × u8  rgb   color
//     indices × u32
//
// Coordinates match VoxelModel.BuildMesh: grid (x,y,z) → Unity (x,z,y).
//
// usage: node scripts/bake-voidfang-skull.mjs <in.bytes> <out.bin>

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node scripts/bake-voidfang-skull.mjs <in.bytes> <out.bin>");
  process.exit(1);
}

const MAGIC = 0x4b534853; // "SHSK"
const FACES = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const toUnity = (x, y, z) => [x, z, y];

// From MapSources/cursed-orb/raw/voidfang-skull-eyes.json — Unity mesh locals.
const EYE_L = [12.642022290291836, -2.5534465856861335, -28.068803942223038];
const EYE_R = [-12.832152797984378, -2.5534465856861335, -28.068803942223038];

const buf = fs.readFileSync(inPath);
const size = buf.readInt32LE(0);
const solid = buf.subarray(20, 20 + size ** 3);
const rgb = buf.subarray(20 + size ** 3);
const at = (x, y, z) =>
  x >= 0 && y >= 0 && z >= 0 && x < size && y < size && z < size && solid[x + size * (y + size * z)] !== 0;

const positions = [];
const normals = [];
const colors = [];
const indices = [];
const half = size * 0.5;

for (let z = 0; z < size; z++)
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      if (!at(x, y, z)) continue;
      const i = x + size * (y + size * z);
      const cr = rgb[i * 3],
        cg = rgb[i * 3 + 1],
        cb = rgb[i * 3 + 2];
      const [cx, cy, cz] = toUnity(x + 0.5 - half, y + 0.5 - half, z + 0.5 - half);

      for (const [dx, dy, dz] of FACES) {
        if (at(x + dx, y + dy, z + dz)) continue;
        const [nx, ny, nz] = toUnity(dx, dy, dz);

        // Face tangent frame in Unity space (same idea as VoxelMap.FaceAxes).
        let ax, ay, az, bx, by, bz;
        if (Math.abs(ny) > 0.5) {
          [ax, ay, az] = [1, 0, 0];
          [bx, by, bz] = [0, 0, 1];
        } else {
          [ax, ay, az] = [0, 1, 0];
          [bx, by, bz] = [nz, 0, -nx];
          const len = Math.hypot(bx, bz) || 1;
          bx /= len;
          bz /= len;
        }
        const cxn = ay * bz - az * by;
        const cyn = az * bx - ax * bz;
        const czn = ax * by - ay * bx;
        if (cxn * nx + cyn * ny + czn * nz < 0) {
          ax = -ax;
          ay = -ay;
          az = -az;
        }

        const corners = [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ];
        const base = positions.length / 3;
        for (const [su, sv] of corners) {
          positions.push(
            cx + (ax * su + bx * sv) * 0.5,
            cy + (ay * su + by * sv) * 0.5,
            cz + (az * su + bz * sv) * 0.5,
          );
          normals.push(Math.round(nx * 127), Math.round(ny * 127), Math.round(nz * 127));
          colors.push(cr, cg, cb);
        }
        indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
    }

let minX = Infinity,
  minY = Infinity,
  minZ = Infinity,
  maxX = -Infinity,
  maxY = -Infinity,
  maxZ = -Infinity;
for (let i = 0; i < positions.length; i += 3) {
  minX = Math.min(minX, positions[i]);
  minY = Math.min(minY, positions[i + 1]);
  minZ = Math.min(minZ, positions[i + 2]);
  maxX = Math.max(maxX, positions[i]);
  maxY = Math.max(maxY, positions[i + 1]);
  maxZ = Math.max(maxZ, positions[i + 2]);
}
const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
const halfExt = extent * 0.5;
const midX = (minX + maxX) * 0.5;
const midY = (minY + maxY) * 0.5;
const midZ = (minZ + maxZ) * 0.5;

const vertCount = positions.length / 3;
const indexCount = indices.length;
const body = Buffer.alloc(vertCount * 12 + indexCount * 4);
let o = 0;
for (let i = 0; i < vertCount; i++) {
  body.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(((positions[i * 3] - midX) / halfExt) * 32767))), o);
  o += 2;
  body.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(((positions[i * 3 + 1] - midY) / halfExt) * 32767))), o);
  o += 2;
  body.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(((positions[i * 3 + 2] - midZ) / halfExt) * 32767))), o);
  o += 2;
}
for (let i = 0; i < vertCount; i++) {
  body.writeInt8(normals[i * 3], o++);
  body.writeInt8(normals[i * 3 + 1], o++);
  body.writeInt8(normals[i * 3 + 2], o++);
}
for (let i = 0; i < vertCount; i++) {
  body[o++] = colors[i * 3];
  body[o++] = colors[i * 3 + 1];
  body[o++] = colors[i * 3 + 2];
}
for (let i = 0; i < indexCount; i++) {
  body.writeUInt32LE(indices[i], o);
  o += 4;
}

const packed = zlib.deflateRawSync(body, { level: 9 });
const header = Buffer.alloc(4 * 4 + 4 + 4 * 6);
let h = 0;
header.writeUInt32LE(MAGIC, h);
h += 4;
header.writeUInt32LE(1, h);
h += 4;
header.writeUInt32LE(vertCount, h);
h += 4;
header.writeUInt32LE(indexCount, h);
h += 4;
header.writeFloatLE(extent, h);
h += 4;
for (const v of [...EYE_L, ...EYE_R]) {
  header.writeFloatLE(v, h);
  h += 4;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.concat([header, packed]));
console.log(
  JSON.stringify({
    in: inPath,
    out: outPath,
    size,
    verts: vertCount,
    tris: indexCount / 3,
    extent: +extent.toFixed(2),
    kb: Math.round((header.length + packed.length) / 1024),
  }),
);
