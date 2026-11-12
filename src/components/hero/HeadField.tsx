"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { loadPoints, type PointCloud } from "@/lib/points";
import { useInView, useReducedMotion } from "@/lib/webgl";

const INTRO_SECONDS = 2.8;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uScroll;
uniform float uSize;
uniform vec3 uPointer;
uniform float uPointerActive;
uniform float uFadeFloor;
attribute vec3 aScatter;
attribute float aLum;
attribute float aRand;
attribute vec3 aColor;
varying float vLum;
varying float vRim;
varying float vReveal;
varying vec3 vColor;
varying float vFacing;
varying float vAlpha;

void main() {
  float t = clamp(uIntro * 1.6 - aRand * 0.6, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);
  vec3 p = mix(aScatter, position, e);
  float swirl = (1.0 - e) * 2.4;
  float c = cos(swirl), s = sin(swirl);
  p.xz = mat2(c, -s, s, c) * p.xz;

  p += normal * sin(uTime * 1.3 + position.y * 7.0 + aRand * 6.2831) * 0.006;

  float reveal = smoothstep(0.55, 0.15, length(p.xy - uPointer.xy)) * uPointerActive * e;

  float dissolve = smoothstep(aRand * 0.55, aRand * 0.55 + 0.45, uScroll);
  p += (normal * 0.8 + vec3(0.0, 0.7, 0.0) + aScatter * 0.2) * dissolve;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize / -mv.z;

  vec3 vn = normalize(normalMatrix * normal);
  float facing = dot(vn, normalize(-mv.xyz));
  vRim = pow(1.0 - abs(facing), 2.0);
  vLum = aLum;
  vReveal = reveal;
  vFacing = smoothstep(0.0, 0.35, facing);
  vColor = aColor;
  float chest = smoothstep(uFadeFloor, uFadeFloor + 0.75, position.y + (aRand - 0.5) * 0.25);
  vAlpha = e * (1.0 - dissolve) * chest;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uPaper;
uniform vec3 uSignal;
varying float vLum;
varying float vRim;
varying float vReveal;
varying vec3 vColor;
varying float vFacing;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r = dot(c, c);
  if (r > 1.0) discard;
  vec3 mono = uPaper * (0.22 + vLum * 0.78);
  mono = mix(mono, uSignal, clamp(vRim * 1.15, 0.0, 1.0));
  vec3 col = mix(mono, vColor * 1.2, vReveal);
  // additive points stack, so revealed color needs low alpha and no back faces to stay true
  float a = (1.0 - r) * vAlpha * mix(0.3 + vLum * 0.4 + vRim * 0.55, 0.55 * vFacing, vReveal);
  gl_FragColor = vec4(col, a);
}
`;

function buildGeometry(cloud: PointCloud) {
  const { count } = cloud;
  const scatter = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const r = 2.2 + Math.random() * 2.4;
    const s = Math.sqrt(1 - u * u);
    scatter.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    // brighter points settle first so the face reads early
    rand[i] = Math.min(1, Math.random() * 0.75 + (1 - cloud.luminance[i]) * 0.25);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(cloud.positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(cloud.normals, 3));
  g.setAttribute("aLum", new THREE.BufferAttribute(cloud.luminance, 1));
  g.setAttribute("aColor", new THREE.BufferAttribute(cloud.colors, 3));
  g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
  return g;
}

interface PointerState {
  ndc: THREE.Vector2;
  lastMove: number;
}

function Head({
  cloud,
  container,
  pointer,
  reducedMotion,
}: {
  cloud: PointCloud;
  container: React.RefObject<HTMLDivElement | null>;
  pointer: PointerState;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { size, viewport, camera, gl, invalidate } = useThree();
  const geometry = useMemo(() => buildGeometry(cloud), [cloud]);
  const start = useRef<number | null>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: reducedMotion ? 1 : 0 },
      uScroll: { value: 0 },
      uSize: { value: 10 },
      uPointer: { value: new THREE.Vector3(9, 9, 0) },
      uPointerActive: { value: 0 },
      uFadeFloor: { value: -cloud.extent[1] },
      uPaper: { value: new THREE.Color("#EDEAE3") },
      uSignal: { value: new THREE.Color("#4DA3FF") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const wide = size.width / size.height > 1.05;
  const [ex, ey] = cloud.extent;
  const scale = wide
    ? Math.min((viewport.height * 0.76) / (ey * 2), (viewport.width * 0.46) / (ex * 2))
    : Math.min((viewport.height * 0.5) / (ey * 2), (viewport.width * 0.96) / (ex * 2));
  const x = wide ? viewport.width * 0.23 : 0;
  const y = wide ? -viewport.height * 0.03 : viewport.height * 0.2;

  useEffect(() => {
    uniforms.uSize.value = size.height * gl.getPixelRatio() * 0.0125;
    if (reducedMotion) invalidate();
  }, [gl, invalidate, reducedMotion, size.height, uniforms]);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(9, 9, 0), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const el = container.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      uniforms.uScroll.value = reducedMotion ? 0 : THREE.MathUtils.clamp(-rect.top / (rect.height * 0.85), 0, 1);
    }
    if (reducedMotion) return;

    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    uniforms.uTime.value = t;
    uniforms.uIntro.value = Math.min(1, t / INTRO_SECONDS);

    const active = performance.now() - pointer.lastMove < 2500 ? 1 : 0;
    uniforms.uPointerActive.value = THREE.MathUtils.damp(uniforms.uPointerActive.value, active, 3, delta);
    ray.setFromCamera(pointer.ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      g.worldToLocal(target.copy(hit));
      uniforms.uPointer.value.lerp(target, 1 - Math.exp(-delta * 10));
    }

    const yaw = pointer.ndc.x * 0.35 + Math.sin(t * 0.25) * 0.08;
    const pitch = -pointer.ndc.y * 0.12;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, 2.2, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pitch, 2.2, delta);
  });

  return (
    <group position={[x, y, 0]} scale={scale}>
      <group ref={group}>
        <points geometry={geometry} frustumCulled={false}>
          <shaderMaterial
            vertexShader={VERTEX}
            fragmentShader={FRAGMENT}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

/** The hero's point-cloud portrait. Decorative: hidden from assistive tech. */
export default function HeadField({ className, onReady }: { className?: string; onReady?: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container, "0px");
  const reducedMotion = useReducedMotion();
  const [cloud, setCloud] = useState<PointCloud | null>(null);
  const pointer = useRef<PointerState>({ ndc: new THREE.Vector2(0, 0), lastMove: 0 }).current;

  useEffect(() => {
    let cancelled = false;
    loadPoints("/models/hero-portrait-rgb.points.bin")
      .then((c) => {
        if (cancelled) return;
        setCloud(c);
        onReady?.();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [onReady]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = container.current;
      if (!el || e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      pointer.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      pointer.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  return (
    <div ref={container} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={reducedMotion ? "demand" : inView ? "always" : "never"}
        camera={{ position: [0, 0, 5.2], fov: 30 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        {cloud && <Head cloud={cloud} container={container} pointer={pointer} reducedMotion={reducedMotion} />}
      </Canvas>
    </div>
  );
}
