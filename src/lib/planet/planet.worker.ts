import { COLOR, SOLID, decodeMap } from "./format";
import { CHUNK, buildChunk, chunkCount, type ChunkMesh, type MeshState } from "./mesher";

export type PlanetRequest =
  | { type: "load"; url: string }
  | { type: "carve"; center: [number, number, number]; radius: number }
  | { type: "reset" };

export type PlanetResponse =
  | {
      type: "loaded";
      size: number;
      solid: number;
      colors: number;
      chunks: ChunkMesh[];
      faces: number;
      decodeMs: number;
      meshMs: number;
    }
  | { type: "chunks"; chunks: ChunkMesh[]; faces: number; removed: number; meshMs: number; replaceAll?: boolean }
  | { type: "debris"; positions: Float32Array; colors: Uint8Array }
  | { type: "error"; message: string };

const MAX_DEBRIS = 900;

let state: MeshState | null = null;
let original: Uint16Array | null = null;
const faceCounts = new Map<number, number>();

function send(message: PlanetResponse, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer });
}

function transfers(chunks: ChunkMesh[]) {
  return chunks.flatMap((c) => [c.positions.buffer, c.normals.buffer, c.colors.buffer, c.glow.buffer, c.indices.buffer]);
}

function remember(chunk: ChunkMesh) {
  faceCounts.set(chunk.key, chunk.indices.length / 6);
}

function totalFaces() {
  let total = 0;
  for (const n of faceCounts.values()) total += n;
  return total;
}

function meshAll(s: MeshState) {
  const out: ChunkMesh[] = [];
  faceCounts.clear();
  for (let z = 0; z < s.chunks; z++)
    for (let y = 0; y < s.chunks; y++)
      for (let x = 0; x < s.chunks; x++) {
        const chunk = buildChunk(s, x, y, z);
        remember(chunk);
        if (chunk.indices.length) out.push(chunk);
      }
  return out;
}

async function load(url: string) {
  const t0 = performance.now();
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status}).`);
  const grid = await decodeMap(await response.arrayBuffer());
  const t1 = performance.now();
  state = { ...grid, scorch: new Uint8Array(grid.cells.length), chunks: chunkCount(grid.size) };
  original = grid.cells.slice();
  let solid = 0;
  for (let i = 0; i < grid.cells.length; i++) if (grid.cells[i] & SOLID) solid++;
  const chunks = meshAll(state);
  const t2 = performance.now();
  send(
    {
      type: "loaded",
      size: grid.size,
      solid,
      colors: grid.palette.length / 3,
      chunks,
      faces: totalFaces(),
      decodeMs: Math.round(t1 - t0),
      meshMs: Math.round(t2 - t1),
    },
    transfers(chunks),
  );
}

function carve([cx, cy, cz]: [number, number, number], radius: number) {
  const s = state;
  if (!s) return;
  const t0 = performance.now();
  const { size, cells, palette, scorch } = s;
  const reach = radius + 3;
  const lo = (v: number) => Math.max(0, Math.floor(v - reach));
  const hi = (v: number) => Math.min(size - 1, Math.ceil(v + reach));
  const removed: number[] = [];
  const removedColors: number[] = [];
  let removedCount = 0;

  for (let z = lo(cz); z <= hi(cz); z++)
    for (let y = lo(cy); y <= hi(cy); y++)
      for (let x = lo(cx); x <= hi(cx); x++) {
        const i = x + size * (y + size * z);
        if (!(cells[i] & SOLID)) continue;
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy, dz = z + 0.5 - cz;
        // A little noise on the rim keeps craters from looking stamped.
        const jitter = ((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) & 255;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) - (jitter / 255) * 0.9;
        if (d <= radius) {
          const color = cells[i] & COLOR;
          cells[i] &= ~SOLID;
          removedCount++;
          if (removed.length / 3 < MAX_DEBRIS * 4) {
            removed.push(x + 0.5 - size / 2, y + 0.5 - size / 2, z + 0.5 - size / 2);
            removedColors.push(palette[color * 3], palette[color * 3 + 1], palette[color * 3 + 2]);
          }
        } else if (d <= radius + 2.5) {
          const burn = Math.round(255 * (1 - (d - radius) / 2.5));
          if (burn > scorch[i]) scorch[i] = burn;
        }
      }

  const k0 = (v: number) => Math.max(0, Math.floor((v - reach - 1) / CHUNK));
  const k1 = (v: number) => Math.min(s.chunks - 1, Math.floor((v + reach + 1) / CHUNK));
  const chunks: ChunkMesh[] = [];
  for (let z = k0(cz); z <= k1(cz); z++)
    for (let y = k0(cy); y <= k1(cy); y++)
      for (let x = k0(cx); x <= k1(cx); x++) {
        const chunk = buildChunk(s, x, y, z);
        remember(chunk);
        chunks.push(chunk);
      }

  send(
    { type: "chunks", chunks, faces: totalFaces(), removed: removedCount, meshMs: Math.round(performance.now() - t0) },
    transfers(chunks),
  );

  // Only a sample of the removed cells fly off as debris.
  const total = removed.length / 3;
  const keep = Math.min(MAX_DEBRIS, total);
  const positions = new Float32Array(keep * 3);
  const colors = new Uint8Array(keep * 3);
  for (let n = 0; n < keep; n++) {
    const src = Math.floor((n / keep) * total);
    for (let k = 0; k < 3; k++) {
      positions[n * 3 + k] = removed[src * 3 + k];
      colors[n * 3 + k] = removedColors[src * 3 + k];
    }
  }
  send({ type: "debris", positions, colors }, [positions.buffer, colors.buffer]);
}

function reset() {
  if (!state || !original) return;
  state.cells.set(original);
  state.scorch.fill(0);
  const t0 = performance.now();
  const chunks = meshAll(state);
  send(
    { type: "chunks", chunks, faces: totalFaces(), removed: 0, meshMs: Math.round(performance.now() - t0), replaceAll: true },
    transfers(chunks),
  );
}

self.onmessage = async (event: MessageEvent<PlanetRequest>) => {
  try {
    const message = event.data;
    if (message.type === "load") await load(message.url);
    else if (message.type === "carve") carve(message.center, message.radius);
    else if (message.type === "reset") reset();
  } catch (error) {
    send({ type: "error", message: error instanceof Error ? error.message : String(error) });
  }
};
