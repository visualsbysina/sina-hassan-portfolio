#!/usr/bin/env node
// Bakes the city HDR the sunglasses reflect into a small LDR band for CSS.
// The band runs from just below the horizon up into the towers, matching the
// slice of the panorama that fills the lenses, and is tone mapped with ACES.
// A raised floor keeps the darkest towers bright enough to read as type on the
// near-black page (≥ 3:1 for display sizes).
//
// usage: node scripts/bake-reflection.mjs <in.hdr> <out.webp> [width] [exposure] [floor]

import fs from "node:fs";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import sharp from "sharp";

const [, , inPath, outPath, widthArg, exposureArg, floorArg] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node scripts/bake-reflection.mjs <in.hdr> <out.webp> [width] [exposure] [floor]");
  process.exit(1);
}
const OUT_WIDTH = Number(widthArg ?? 1024);
const EXPOSURE = Number(exposureArg ?? 0.55);
const FLOOR = Number(floorArg ?? 0.4);
// Elevation range in degrees: horizon is 0, zenith is 90.
const TOP_DEG = 62;
const BOTTOM_DEG = -14;

const file = fs.readFileSync(inPath);
const loader = new HDRLoader().setDataType(THREE.FloatType);
const hdr = loader.parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
const { width, height, data } = hdr;

const rowFor = (deg) => Math.round(((90 - deg) / 180) * height);
const y0 = rowFor(TOP_DEG);
const y1 = rowFor(BOTTOM_DEG);
const bandH = y1 - y0;

// Narkowicz ACES fit.
const aces = (x) => Math.min(1, Math.max(0, (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14)));
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

const out = Buffer.alloc(width * bandH * 3);
for (let y = 0; y < bandH; y++) {
  for (let x = 0; x < width; x++) {
    const i = ((y0 + y) * width + x) * 4;
    const o = (y * width + x) * 3;
    for (let k = 0; k < 3; k++) {
      const linear = aces(data[i + k] * EXPOSURE);
      out[o + k] = Math.round((FLOOR + (1 - FLOOR) * toSrgb(linear)) * 255);
    }
  }
}

const outHeight = Math.round((OUT_WIDTH / width) * bandH);
await sharp(out, { raw: { width, height: bandH, channels: 3 } })
  .resize(OUT_WIDTH, outHeight)
  .webp({ quality: 78 })
  .toFile(outPath);

console.log(
  JSON.stringify({
    in: inPath,
    out: outPath,
    outKb: Math.round(fs.statSync(outPath).size / 1024),
    size: [OUT_WIDTH, outHeight],
    band: [TOP_DEG, BOTTOM_DEG],
  }),
);
