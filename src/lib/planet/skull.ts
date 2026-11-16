// Decodes the voidfang skull mesh written by scripts/bake-voidfang-skull.mjs.

const MAGIC = 0x4b534853; // "SHSK"

export interface SkullMesh {
  positions: Float32Array;
  normals: Int8Array;
  colors: Uint8Array;
  indices: Uint32Array;
  /** Max AABB axis in cell units — scale = (groundRadius * 1.55) / extent */
  extent: number;
  eyeLeft: [number, number, number];
  eyeRight: [number, number, number];
}

export async function decodeSkull(buffer: ArrayBuffer): Promise<SkullMesh> {
  const view = new DataView(buffer);
  let o = 0;
  const u32 = () => ((o += 4), view.getUint32(o - 4, true));
  const f32 = () => ((o += 4), view.getFloat32(o - 4, true));
  if (u32() !== MAGIC) throw new Error("Not a voidfang skull mesh.");
  u32(); // version
  const verts = u32();
  const indexCount = u32();
  const extent = f32();
  const eyeLeft: [number, number, number] = [f32(), f32(), f32()];
  const eyeRight: [number, number, number] = [f32(), f32(), f32()];

  const stream = new Blob([new Uint8Array(buffer, o)])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const raw = new Uint8Array(await new Response(stream).arrayBuffer());
  const data = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);

  const half = extent * 0.5;
  const positions = new Float32Array(verts * 3);
  let p = 0;
  for (let i = 0; i < verts; i++) {
    positions[i * 3] = (data.getInt16(p, true) / 32767) * half;
    p += 2;
    positions[i * 3 + 1] = (data.getInt16(p, true) / 32767) * half;
    p += 2;
    positions[i * 3 + 2] = (data.getInt16(p, true) / 32767) * half;
    p += 2;
  }
  const normals = new Int8Array(raw.subarray(p, p + verts * 3));
  p += verts * 3;
  const colors = new Uint8Array(raw.subarray(p, p + verts * 3));
  p += verts * 3;
  const indices = new Uint32Array(indexCount);
  for (let i = 0; i < indexCount; i++) {
    indices[i] = data.getUint32(p, true);
    p += 4;
  }

  return { positions, normals, colors, indices, extent, eyeLeft, eyeRight };
}

export async function loadSkull(url: string): Promise<SkullMesh> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load skull (${res.status})`);
  return decodeSkull(await res.arrayBuffer());
}
