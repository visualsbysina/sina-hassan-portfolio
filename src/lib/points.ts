/**
 * Decoder for the baked point clouds written by scripts/bake-head.mjs.
 *
 *   u32 magic "SHPT", u32 count, f32 min xyz, f32 max xyz
 *   count × u16 xyz position (normalized to the bounds)
 *   count × i8  xyz normal
 *   count × u8      luminance
 */
const MAGIC = 0x54504853;

export interface PointCloud {
  count: number;
  positions: Float32Array;
  normals: Float32Array;
  luminance: Float32Array;
  /** half extents after centering */
  extent: [number, number, number];
}

export function decodePoints(buffer: ArrayBuffer): PointCloud {
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== MAGIC) throw new Error("Not a baked point cloud");
  const count = view.getUint32(4, true);
  const min = [0, 1, 2].map((k) => view.getFloat32(8 + k * 4, true));
  const max = [0, 1, 2].map((k) => view.getFloat32(20 + k * 4, true));
  const center = [0, 1, 2].map((k) => (min[k] + max[k]) / 2);
  const span = [0, 1, 2].map((k) => max[k] - min[k]);

  const q = new Uint16Array(buffer, 32, count * 3);
  const n = new Int8Array(buffer, 32 + count * 6, count * 3);
  const l = new Uint8Array(buffer, 32 + count * 9, count);

  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const luminance = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < 3; k++) {
      positions[i * 3 + k] = min[k] + (q[i * 3 + k] / 65535) * span[k] - center[k];
      normals[i * 3 + k] = n[i * 3 + k] / 127;
    }
    luminance[i] = l[i] / 255;
  }
  return { count, positions, normals, luminance, extent: [span[0] / 2, span[1] / 2, span[2] / 2] };
}

export async function loadPoints(url: string): Promise<PointCloud> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return decodePoints(await res.arrayBuffer());
}
