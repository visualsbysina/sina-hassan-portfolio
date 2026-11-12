// Reads the browser copy of a Planet Rounds map written by
// scripts/bake-planet.mjs. It mirrors VoxelMapFile.Read in the game: a
// palette, then (value u16, run varint) pairs, raw-deflated.

export const SOLID = 0x8000;
export const COLOR = 0x7fff;
const MAGIC = 0x56504853; // "SHPV"

export const enum CellKind {
  Plain = 0,
  Crystal = 1,
  Glow = 2,
}

export interface VoxelGrid {
  size: number;
  cells: Uint16Array;
  /** rgb triplets, indexed by a cell's color bits */
  palette: Uint8Array;
  /** kind bits per palette entry, or null when every cell is plain */
  kinds: Uint8Array | null;
}

export async function decodeMap(buffer: ArrayBuffer): Promise<VoxelGrid> {
  const view = new DataView(buffer);
  let o = 0;
  const u32 = () => ((o += 4), view.getUint32(o - 4, true));
  const i32 = () => ((o += 4), view.getInt32(o - 4, true));
  if (u32() !== MAGIC) throw new Error("Not a planet map.");
  i32(); // version
  const size = i32();
  o += 4 * 4; // cell size and origin; the browser recenters the grid
  const colors = i32();
  const palette = new Uint8Array(buffer, o, colors * 3).slice();
  o += colors * 3;
  let kinds: Uint8Array | null = null;
  if (view.getUint8(o++) === 1) {
    kinds = new Uint8Array(buffer, o, colors).slice();
    o += colors;
  }

  const stream = new Blob([new Uint8Array(buffer, o)])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const raw = new Uint8Array(await new Response(stream).arrayBuffer());

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
    if (run <= 0 || run > n - pos) throw new Error("Corrupt planet map.");
    if (value !== 0) cells.fill(value, pos, pos + run);
    pos += run;
  }
  return { size, cells, palette, kinds };
}
