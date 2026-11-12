"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { ChunkMesh } from "@/lib/planet/mesher";
import type { PlanetRequest, PlanetResponse } from "@/lib/planet/planet.worker";
import { planetMaps } from "@/data/planet-maps";
import { useInView, useReducedMotion } from "@/lib/webgl";
import { cn } from "@/lib/utils";

const CRATER_RADIUS = 7;
const MAX_DEBRIS = 2400;
const PLANET_SPAN = 2.3;

interface Stats {
  size: number;
  solid: number;
  colors: number;
  faces: number;
  decodeMs: number;
  meshMs: number;
  remeshMs: number | null;
  craters: number;
  removed: number;
}

interface Burst {
  positions: Float32Array;
  colors: Uint8Array;
}

interface Shock {
  at: THREE.Vector3;
  born: number;
}

interface Fx {
  bursts: Burst[];
  shocks: Shock[];
  center: THREE.Vector3;
  shake: number;
}

function toGeometry(chunk: ChunkMesh) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(chunk.positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(chunk.normals, 3, true));
  geometry.setAttribute("color", new THREE.BufferAttribute(chunk.colors, 3, true));
  geometry.setAttribute("aGlow", new THREE.BufferAttribute(chunk.glow, 1, true));
  geometry.setIndex(new THREE.BufferAttribute(chunk.indices, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

function useVoxelMaterial() {
  const time = useRef({ value: 0 });
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0.02 });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = time.current;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aGlow;\nvarying float vGlow;")
        .replace("#include <color_vertex>", "vColor = pow(color.rgb, vec3(2.2));\nvGlow = aGlow;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vGlow;\nuniform float uTime;")
        .replace(
          "#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor * vGlow * (2.2 + 0.8 * sin(uTime * 1.7 + vViewPosition.y * 0.35));",
        );
    };
    return m;
  }, []);
  useFrame((_, delta) => {
    time.current.value += delta;
  });
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

function Planet({
  geometries,
  onBlast,
  planetRef,
}: {
  geometries: Map<number, THREE.BufferGeometry>;
  /** bumped whenever geometries change, to re-render */
  version: number;
  onBlast: (local: THREE.Vector3, normal: THREE.Vector3) => void;
  planetRef: React.RefObject<THREE.Group | null>;
}) {
  const material = useVoxelMaterial();
  const down = useRef<{ x: number; y: number } | null>(null);
  const entries = Array.from(geometries.entries());

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    down.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
  };
  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    const start = down.current;
    down.current = null;
    if (!start || !e.face || !planetRef.current) return;
    if (Math.hypot(e.nativeEvent.clientX - start.x, e.nativeEvent.clientY - start.y) > 6) return;
    e.stopPropagation();
    onBlast(planetRef.current.worldToLocal(e.point.clone()), e.face.normal.clone());
  };

  return (
    <group ref={planetRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      {entries.map(([key, geometry]) => (
        <mesh key={key} geometry={geometry} material={material} />
      ))}
    </group>
  );
}

function Debris({ fx, reducedMotion }: { fx: Fx; reducedMotion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const sim = useMemo(
    () => ({
      p: new Float32Array(MAX_DEBRIS * 3),
      v: new Float32Array(MAX_DEBRIS * 3),
      life: new Float32Array(MAX_DEBRIS),
      max: new Float32Array(MAX_DEBRIS),
      next: 0,
    }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    m.count = MAX_DEBRIS;
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = 0; i < MAX_DEBRIS; i++) {
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, color.set(0xffffff));
    }
    m.instanceMatrix.needsUpdate = true;
  }, [color, dummy]);

  useFrame((_, rawDelta) => {
    const m = mesh.current;
    if (!m) return;
    const delta = Math.min(rawDelta, 1 / 30);

    for (const burst of fx.bursts.splice(0)) {
      const count = burst.positions.length / 3;
      for (let n = 0; n < count; n++) {
        const i = sim.next;
        sim.next = (sim.next + 1) % MAX_DEBRIS;
        const px = burst.positions[n * 3], py = burst.positions[n * 3 + 1], pz = burst.positions[n * 3 + 2];
        sim.p[i * 3] = px;
        sim.p[i * 3 + 1] = py;
        sim.p[i * 3 + 2] = pz;
        const ox = px - fx.center.x, oy = py - fx.center.y, oz = pz - fx.center.z;
        const len = Math.hypot(ox, oy, oz) || 1;
        const r = Math.hypot(px, py, pz) || 1;
        const speed = (reducedMotion ? 6 : 14) + Math.random() * (reducedMotion ? 6 : 26);
        const lift = (reducedMotion ? 4 : 10) + Math.random() * 18;
        sim.v[i * 3] = (ox / len) * speed + (px / r) * lift + (Math.random() - 0.5) * 8;
        sim.v[i * 3 + 1] = (oy / len) * speed + (py / r) * lift + (Math.random() - 0.5) * 8;
        sim.v[i * 3 + 2] = (oz / len) * speed + (pz / r) * lift + (Math.random() - 0.5) * 8;
        sim.max[i] = sim.life[i] = 1.6 + Math.random() * 1.6;
        color.setRGB(
          (burst.colors[n * 3] / 255) ** 2.2,
          (burst.colors[n * 3 + 1] / 255) ** 2.2,
          (burst.colors[n * 3 + 2] / 255) ** 2.2,
        );
        m.setColorAt(i, color);
      }
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }

    let any = false;
    for (let i = 0; i < MAX_DEBRIS; i++) {
      if (sim.life[i] <= 0) continue;
      any = true;
      sim.life[i] -= delta;
      const x = sim.p[i * 3], y = sim.p[i * 3 + 1], z = sim.p[i * 3 + 2];
      const r = Math.hypot(x, y, z) || 1;
      const g = 70 * delta;
      sim.v[i * 3] -= (x / r) * g;
      sim.v[i * 3 + 1] -= (y / r) * g;
      sim.v[i * 3 + 2] -= (z / r) * g;
      sim.p[i * 3] += sim.v[i * 3] * delta;
      sim.p[i * 3 + 1] += sim.v[i * 3 + 1] * delta;
      sim.p[i * 3 + 2] += sim.v[i * 3 + 2] * delta;
      const t = Math.max(0, sim.life[i] / sim.max[i]);
      dummy.position.set(sim.p[i * 3], sim.p[i * 3 + 1], sim.p[i * 3 + 2]);
      dummy.rotation.set(sim.life[i] * 3.1 + i, sim.life[i] * 2.3, i * 0.7);
      dummy.scale.setScalar(sim.life[i] > 0 ? Math.min(1, t * 2.2) * 0.9 : 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    if (any) m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, MAX_DEBRIS]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.7} />
    </instancedMesh>
  );
}

function Shocks({ fx }: { fx: Fx }) {
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  const light = useRef<THREE.PointLight>(null);
  const slots = 4;

  useFrame(() => {
    const now = performance.now() / 1000;
    fx.shocks = fx.shocks.filter((s) => now - s.born < 0.7).slice(-slots);
    for (let i = 0; i < slots; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const shock = fx.shocks[i];
      if (!shock) {
        mesh.visible = false;
        continue;
      }
      const t = (now - shock.born) / 0.7;
      mesh.visible = true;
      mesh.position.copy(shock.at);
      mesh.scale.setScalar(CRATER_RADIUS * (0.4 + t * 2.6));
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - t) ** 2;
    }
    const latest = fx.shocks[fx.shocks.length - 1];
    if (light.current) {
      const t = latest ? (now - latest.born) / 0.7 : 1;
      light.current.intensity = latest ? 60 * (1 - t) ** 3 : 0;
      if (latest) light.current.position.copy(latest.at).multiplyScalar(1.06);
    }
  });

  return (
    <>
      {Array.from({ length: slots }, (_, i) => (
        <mesh key={i} ref={(m) => void (meshes.current[i] = m)} visible={false}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshBasicMaterial color={[4, 2.1, 0.9]} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      ))}
      <pointLight ref={light} color="#ffb070" distance={2.5} decay={1.2} intensity={0} />
    </>
  );
}

const ATMOSPHERE_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const ATMOSPHERE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
  gl_FragColor = vec4(uColor * rim * 1.6, rim);
}
`;

function Atmosphere({ radius }: { radius: number }) {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#3d9bff") } }), []);
  return (
    <mesh scale={radius * 1.12}>
      <sphereGeometry args={[1, 64, 48]} />
      <shaderMaterial
        vertexShader={ATMOSPHERE_VERTEX}
        fragmentShader={ATMOSPHERE_FRAGMENT}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Stars() {
  const geometry = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 14;
      const s = Math.sqrt(1 - u * u);
      positions.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <points geometry={geometry}>
      <pointsMaterial size={0.045} sizeAttenuation color="#cfd8e6" transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

function CameraShake({ fx, enabled }: { fx: Fx; enabled: boolean }) {
  const camera = useThree((s) => s.camera);
  const offset = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    camera.position.sub(offset.current);
    if (!enabled || fx.shake <= 0.001) {
      offset.current.set(0, 0, 0);
      return;
    }
    fx.shake = Math.max(0, fx.shake - delta * 2.4);
    const a = fx.shake * fx.shake * 0.05;
    offset.current.set((Math.random() - 0.5) * a, (Math.random() - 0.5) * a, (Math.random() - 0.5) * a);
    camera.position.add(offset.current);
  });
  return null;
}

/** Lets buttons outside the canvas blast a point on screen. */
function ScreenPicker({
  planetRef,
  register,
  onBlast,
}: {
  planetRef: React.RefObject<THREE.Group | null>;
  register: (pick: (x: number, y: number) => boolean) => void;
  onBlast: (local: THREE.Vector3, normal: THREE.Vector3) => void;
}) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    register((x, y) => {
      const group = planetRef.current;
      if (!group) return false;
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const hit = raycaster.intersectObject(group, true)[0];
      if (!hit || !hit.face) return false;
      onBlast(group.worldToLocal(hit.point.clone()), hit.face.normal.clone());
      return true;
    });
  }, [camera, onBlast, planetRef, register]);
  return null;
}

function AutoSpin({ target, enabled }: { target: React.RefObject<THREE.Group | null>; enabled: boolean }) {
  useFrame((_, delta) => {
    if (enabled && target.current) target.current.rotation.y += delta * 0.08;
  });
  return null;
}

export interface PlanetExperienceProps {
  /** "embed" sits inside a page section; "full" is the dedicated lab page */
  mode?: "embed" | "full";
  initialMap?: string;
  className?: string;
}

export default function PlanetExperience({ mode = "embed", initialMap = "coral-reef", className }: PlanetExperienceProps) {
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container);
  const reducedMotion = useReducedMotion();
  const [mapId, setMapId] = useState(initialMap);
  const map = planetMaps.find((m) => m.id === mapId) ?? planetMaps[0];

  const worker = useRef<Worker | null>(null);
  const geometries = useRef(new Map<number, THREE.BufferGeometry>());
  const [version, setVersion] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [radius, setRadius] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const [coarse, setCoarse] = useState(false);
  const planetRef = useRef<THREE.Group | null>(null);
  const worldRef = useRef<THREE.Group | null>(null);
  const pick = useRef<((x: number, y: number) => boolean) | null>(null);
  const registerPick = useCallback((f: (x: number, y: number) => boolean) => {
    pick.current = f;
  }, []);
  const fx = useRef<Fx>({ bursts: [], shocks: [], center: new THREE.Vector3(), shake: 0 }).current;
  const sizeRef = useRef(170);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const store = geometries.current;
    const w = new Worker(new URL("../../lib/planet/planet.worker.ts", import.meta.url), { type: "module" });
    worker.current = w;
    setStatus("loading");
    setError(null);

    const apply = (chunks: ChunkMesh[], replaceAll = false) => {
      if (replaceAll) {
        for (const g of store.values()) g.dispose();
        store.clear();
      }
      for (const chunk of chunks) {
        store.get(chunk.key)?.dispose();
        if (chunk.indices.length) store.set(chunk.key, toGeometry(chunk));
        else store.delete(chunk.key);
      }
      setVersion((v) => v + 1);
    };

    w.onmessage = (event: MessageEvent<PlanetResponse>) => {
      const msg = event.data;
      if (msg.type === "loaded") {
        sizeRef.current = msg.size;
        const dist: number[] = [];
        for (const c of msg.chunks)
          for (let i = 0; i < c.positions.length; i += 3 * 16)
            dist.push(c.positions[i] ** 2 + c.positions[i + 1] ** 2 + c.positions[i + 2] ** 2);
        dist.sort((a, b) => a - b);
        const body = Math.sqrt(dist[Math.floor(dist.length * 0.92)] ?? (msg.size / 2) ** 2);
        setRadius((body / msg.size) * PLANET_SPAN);
        apply(msg.chunks, true);
        setStats({
          size: msg.size,
          solid: msg.solid,
          colors: msg.colors,
          faces: msg.faces,
          decodeMs: msg.decodeMs,
          meshMs: msg.meshMs,
          remeshMs: null,
          craters: 0,
          removed: 0,
        });
        setStatus("ready");
        setAnnounce(`${map.name} loaded. Activate the planet or use the blast button to carve a crater.`);
      } else if (msg.type === "chunks") {
        apply(msg.chunks, msg.replaceAll);
        setStats((s) =>
          s && {
            ...s,
            faces: msg.faces,
            remeshMs: msg.meshMs,
            craters: msg.replaceAll ? 0 : s.craters + 1,
            removed: msg.replaceAll ? 0 : s.removed + msg.removed,
          },
        );
      } else if (msg.type === "debris") {
        fx.bursts.push({ positions: msg.positions, colors: msg.colors });
      } else if (msg.type === "error") {
        setStatus("error");
        setError(msg.message);
      }
    };
    w.postMessage({ type: "load", url: map.file } satisfies PlanetRequest);

    return () => {
      w.terminate();
      for (const g of store.values()) g.dispose();
      store.clear();
    };
  }, [fx, map.file, map.name]);

  const blast = useCallback(
    (local: THREE.Vector3, normal: THREE.Vector3) => {
      const size = sizeRef.current;
      const center = local.clone().addScaledVector(normal, -CRATER_RADIUS * 0.35);
      fx.center.copy(center);
      fx.shocks.push({ at: center.clone(), born: performance.now() / 1000 });
      fx.shake = 1;
      worker.current?.postMessage({
        type: "carve",
        center: [center.x + size / 2, center.y + size / 2, center.z + size / 2],
        radius: CRATER_RADIUS,
      } satisfies PlanetRequest);
    },
    [fx],
  );

  const blastRandom = () => {
    for (let tries = 0; tries < 12; tries++) {
      if (pick.current?.((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5)) {
        setAnnounce("Crater carved.");
        return;
      }
    }
  };

  const reset = () => {
    worker.current?.postMessage({ type: "reset" } satisfies PlanetRequest);
    setAnnounce("Planet restored.");
  };

  const scale = PLANET_SPAN / (stats?.size ?? 170);
  const touchEmbed = mode === "embed" && coarse;
  const cameraDistance = mode === "full" ? 4.2 : 3.7;

  return (
    <div ref={container} className={cn("relative h-full w-full overflow-hidden bg-void", className)}>
      <div
        className="absolute inset-0"
        role="img"
        aria-label={`Interactive voxel planet "${map.name}" from the game Planet Rounds. Click or tap the surface to blast a crater.`}
        style={touchEmbed ? { touchAction: "pan-y" } : undefined}
      >
        <Canvas
          dpr={dpr}
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0.6, cameraDistance], fov: 38, near: 0.05, far: 100 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => gl.setClearColor("#07080a")}
        >
          <PerformanceMonitor onDecline={() => setDpr([1, 1])} />
          <hemisphereLight args={["#bcd6ff", "#1a1410", 0.9]} />
          <directionalLight position={[4, 3, 2]} intensity={2.4} color="#fff2e0" />
          <directionalLight position={[-3, -1, -3]} intensity={0.5} color="#4d7dff" />
          <Stars />
          <group ref={worldRef} scale={scale}>
            <Planet geometries={geometries.current} version={version} onBlast={blast} planetRef={planetRef} />
            <Debris fx={fx} reducedMotion={reducedMotion} />
            <Shocks fx={fx} />
          </group>
          {status === "ready" && <Atmosphere radius={radius} />}
          <ScreenPicker planetRef={planetRef} register={registerPick} onBlast={blast} />
          <CameraShake fx={fx} enabled={!reducedMotion} />
          {touchEmbed ? (
            <AutoSpin target={worldRef} enabled={!reducedMotion} />
          ) : (
            <OrbitControls
              enablePan={false}
              enableZoom={mode === "full"}
              minDistance={2.2}
              maxDistance={7}
              enableDamping
              autoRotate={!reducedMotion}
              autoRotateSpeed={0.45}
            />
          )}
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={1.15} />
            <Vignette offset={0.25} darkness={0.75} />
          </EffectComposer>
        </Canvas>
      </div>

      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="hud-label text-paper/70">
            {status === "error" ? `Could not load the planet: ${error}` : `Decoding ${map.name} voxel grid…`}
          </p>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between md:p-6">
        <dl className="hud-panel grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
          <HudStat label="Map" value={map.name} />
          <HudStat label="Grid" value={stats ? `${stats.size}³` : "—"} />
          <HudStat label="Voxels" value={stats ? stats.solid.toLocaleString() : "—"} />
          <HudStat label="Triangles" value={stats ? (stats.faces * 2).toLocaleString() : "—"} />
          <HudStat label="Decode / mesh" value={stats ? `${stats.decodeMs} / ${stats.meshMs} ms` : "—"} />
          <HudStat
            label="Craters"
            value={stats ? `${stats.craters}${stats.remeshMs !== null ? ` · ${stats.remeshMs} ms` : ""}` : "—"}
          />
        </dl>

        <div className="pointer-events-auto flex flex-wrap gap-2">
          {mode === "full" && (
            <label className="hud-button">
              <span className="sr-only">Planet map</span>
              <select
                value={mapId}
                onChange={(e) => setMapId(e.target.value)}
                className="bg-transparent outline-none"
              >
                {planetMaps.map((m) => (
                  <option key={m.id} value={m.id} className="bg-void text-paper">
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="button" className="hud-button hud-button--hot" onClick={blastRandom} disabled={status !== "ready"}>
            Blast a crater
          </button>
          <button type="button" className="hud-button" onClick={reset} disabled={status !== "ready" || !stats?.craters}>
            Restore planet
          </button>
        </div>
      </div>
    </div>
  );
}

function HudStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="hud-label text-paper/45">{label}</dt>
      <dd className="truncate font-mono text-xs text-paper/90 tabular-nums">{value}</dd>
    </div>
  );
}
