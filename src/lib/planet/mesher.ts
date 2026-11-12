import { COLOR, SOLID, type VoxelGrid } from "./format";

export const CHUNK = 24;

export interface ChunkMesh {
  key: number;
  positions: Float32Array;
  normals: Int8Array;
  colors: Uint8Array;
  glow: Uint8Array;
  indices: Uint32Array;
}

// Brightness for 0..3 occluding neighbours around a vertex.
const AO = [1, 0.78, 0.6, 0.42];

// One entry per face direction: the axis it faces along, its sign, and the
// two in-plane axes in cyclic order so u × v points along the normal.
const FACES = [0, 1, 2].flatMap((d) =>
  [1, -1].map((s) => ({ d, s, u: (d + 1) % 3, v: (d + 2) % 3 })),
);
const CORNERS: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

export interface MeshState extends VoxelGrid {
  /** 0..255 darkening applied around craters */
  scorch: Uint8Array;
  chunks: number;
}

export function chunkCount(size: number) {
  return Math.ceil(size / CHUNK);
}

export function buildChunk(state: MeshState, cx: number, cy: number, cz: number): ChunkMesh {
  const { size, cells, palette, kinds, scorch, chunks } = state;
  const half = size / 2;
  const solidAt = (x: number, y: number, z: number) =>
    x >= 0 && y >= 0 && z >= 0 && x < size && y < size && z < size && (cells[x + size * (y + size * z)] & SOLID) !== 0;

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const glow: number[] = [];
  const indices: number[] = [];
  const p = [0, 0, 0];
  const q = [0, 0, 0];
  const ao = [0, 0, 0, 0];

  const x0 = cx * CHUNK, y0 = cy * CHUNK, z0 = cz * CHUNK;
  const x1 = Math.min(size, x0 + CHUNK), y1 = Math.min(size, y0 + CHUNK), z1 = Math.min(size, z0 + CHUNK);

  for (let z = z0; z < z1; z++)
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        const i = x + size * (y + size * z);
        const cell = cells[i];
        if (!(cell & SOLID)) continue;
        const color = cell & COLOR;
        const kind = kinds ? kinds[color] & 3 : 0;
        const dim = 1 - (scorch[i] / 255) * 0.82;
        const r = palette[color * 3], g = palette[color * 3 + 1], b = palette[color * 3 + 2];

        for (const { d, s, u, v } of FACES) {
          p[0] = x; p[1] = y; p[2] = z;
          p[d] += s;
          if (solidAt(p[0], p[1], p[2])) continue;

          for (let c = 0; c < 4; c++) {
            const du = CORNERS[c][0] ? 1 : -1;
            const dv = CORNERS[c][1] ? 1 : -1;
            q[0] = p[0]; q[1] = p[1]; q[2] = p[2];
            q[u] += du;
            const side1 = solidAt(q[0], q[1], q[2]) ? 1 : 0;
            q[v] += dv;
            const corner = solidAt(q[0], q[1], q[2]) ? 1 : 0;
            q[u] -= du;
            const side2 = solidAt(q[0], q[1], q[2]) ? 1 : 0;
            ao[c] = side1 && side2 ? 3 : side1 + side2 + corner;
          }

          const base = positions.length / 3;
          const order = s > 0 ? [0, 1, 2, 3] : [0, 3, 2, 1];
          for (const c of order) {
            q[0] = x; q[1] = y; q[2] = z;
            q[d] += s > 0 ? 1 : 0;
            q[u] += CORNERS[c][0];
            q[v] += CORNERS[c][1];
            positions.push(q[0] - half, q[1] - half, q[2] - half);
            const n = [0, 0, 0];
            n[d] = s * 127;
            normals.push(n[0], n[1], n[2]);
            const shade = AO[ao[c]] * dim;
            colors.push(r * shade, g * shade, b * shade);
            glow.push(kind === 0 ? 0 : kind === 2 ? 255 : 150);
          }
          const a0 = ao[order[0]], a1 = ao[order[1]], a2 = ao[order[2]], a3 = ao[order[3]];
          if (a0 + a2 > a1 + a3) {
            indices.push(base + 1, base + 2, base + 3, base + 1, base + 3, base);
          } else {
            indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
          }
        }
      }

  return {
    key: cx + chunks * (cy + chunks * cz),
    positions: new Float32Array(positions),
    normals: new Int8Array(normals),
    colors: new Uint8Array(colors),
    glow: new Uint8Array(glow),
    indices: new Uint32Array(indices),
  };
}
