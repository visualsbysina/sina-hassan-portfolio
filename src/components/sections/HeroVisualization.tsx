"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  NormalBlending,
  PerspectiveCamera as ThreePerspectiveCamera,
  Vector2,
  Vector3,
} from "three";

const COLORS = {
  ink: "#151515",
  accent: "#0A78B5",
} as const;

const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uScale;
uniform float uAttenuate;
uniform vec2 uBoundsY;
varying float vFresnel;
varying float vScan;
varying float vSpark;

void main() {
  float y01 = (position.y - uBoundsY.x) / max(0.0001, uBoundsY.y - uBoundsY.x);
  vec3 pos = position + normal * (0.01 * sin(uTime * 1.4 + y01 * 6.28318));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = uSize;
  if (uAttenuate > 0.5) {
    size *= uScale / max(0.12, -mvPosition.z);
  } else {
    size *= uScale * 0.4;
  }
  gl_PointSize = clamp(size, 1.2, 28.0);

  vec3 viewNormal = normalize(normalMatrix * normal);
  vec3 viewDir = normalize(-mvPosition.xyz);
  vFresnel = pow(1.0 - abs(dot(viewNormal, viewDir)), 2.4);

  float band = abs(y01 - fract(uTime * 0.12));
  vScan = exp(-band * band * 220.0);
  vSpark = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uTime;
varying float vFresnel;
varying float vScan;
varying float vSpark;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;

  float core = smoothstep(1.0, 0.12, r);
  float halo = exp(-r * 2.6);
  float twinkle = 0.78 + 0.22 * sin(uTime * 3.6 + vSpark * 6.28318);

  vec3 col = mix(uColor, uAccent, clamp(vFresnel * 1.2 + vScan, 0.0, 1.0));
  col += uAccent * vScan * 0.7;
  col *= twinkle;

  float alpha = (core * 0.9 + halo * 0.35) * uOpacity;
  alpha *= 0.42 + vFresnel * 0.8 + vScan * 0.55;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

function PointShader({
  pointSize,
  color,
  opacity,
  seeThrough,
  additive,
  attenuate,
  boundsY,
}: {
  pointSize: number;
  color: string;
  opacity: number;
  seeThrough: boolean;
  additive: boolean;
  attenuate: boolean;
  boundsY: [number, number];
}) {
  const { size, gl } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 0.01 },
      uScale: { value: 1 },
      uColor: { value: new Color() },
      uAccent: { value: new Color(COLORS.accent) },
      uOpacity: { value: 1 },
      uAttenuate: { value: 1 },
      uBoundsY: { value: new Vector2(-1, 1) },
    }),
    [],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  useEffect(() => {
    uniforms.uSize.value = pointSize;
    uniforms.uColor.value.set(color);
    uniforms.uOpacity.value = opacity;
    uniforms.uAttenuate.value = attenuate ? 1 : 0;
    uniforms.uScale.value = size.height * 0.5 * gl.getPixelRatio();
    uniforms.uBoundsY.value.set(boundsY[0], boundsY[1]);
  }, [attenuate, boundsY, color, gl, opacity, pointSize, size.height, uniforms]);

  return (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={VERTEX_SHADER}
      fragmentShader={FRAGMENT_SHADER}
      transparent
      depthTest={!seeThrough}
      depthWrite={false}
      blending={additive ? AdditiveBlending : NormalBlending}
      toneMapped={false}
    />
  );
}

function Head({
  density,
  pointSize,
  color,
  opacity,
  seeThrough,
  additive,
  attenuate,
}: {
  density: number;
  pointSize: number;
  color: string;
  opacity: number;
  seeThrough: boolean;
  additive: boolean;
  attenuate: boolean;
}) {
  const { scene } = useGLTF("/models/hero-head.glb");

  const { geometry, boundsY } = useMemo(() => {
    const positions: number[] = [];
    const normals: number[] = [];
    const vertex = new Vector3();
    const normal = new Vector3();
    scene.updateMatrixWorld(true);
    scene.traverse((child) => {
      if (!(child as Mesh).isMesh) {
        return;
      }
      const mesh = child as Mesh;
      const position = mesh.geometry.getAttribute("position");
      if (!position) {
        return;
      }
      if (!mesh.geometry.getAttribute("normal")) {
        mesh.geometry.computeVertexNormals();
      }
      const normalAttr = mesh.geometry.getAttribute("normal");
      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld);
        positions.push(vertex.x, vertex.y, vertex.z);
        if (normalAttr) {
          normal.fromBufferAttribute(normalAttr, i).transformDirection(mesh.matrixWorld);
          normals.push(normal.x, normal.y, normal.z);
        } else {
          normals.push(0, 1, 0);
        }
      }
    });

    const count = positions.length / 3;
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      for (let k = 0; k < 3; k++) {
        const pa = i * 3 + k;
        const pb = j * 3 + k;
        const pTmp = positions[pa];
        positions[pa] = positions[pb];
        positions[pb] = pTmp;
        const nTmp = normals[pa];
        normals[pa] = normals[pb];
        normals[pb] = nTmp;
      }
    }

    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 1; i < positions.length; i += 3) {
      yMin = Math.min(yMin, positions[i]);
      yMax = Math.max(yMax, positions[i]);
    }

    const next = new BufferGeometry();
    next.setAttribute("position", new Float32BufferAttribute(positions, 3));
    next.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    return { geometry: next, boundsY: [yMin, yMax] as [number, number] };
  }, [scene]);

  const total = geometry.getAttribute("position").count;

  useEffect(() => {
    geometry.setDrawRange(0, Math.max(1, Math.floor(total * density)));
  }, [density, geometry, total]);

  return (
    <Center>
      <points geometry={geometry}>
        <PointShader
          pointSize={pointSize}
          color={color}
          opacity={opacity}
          seeThrough={seeThrough}
          additive={additive}
          attenuate={attenuate}
          boundsY={boundsY}
        />
      </points>
    </Center>
  );
}

function CameraFov({ fov }: { fov: number }) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const perspective = camera as ThreePerspectiveCamera;
    if (perspective.isPerspectiveCamera) {
      perspective.fov = fov;
      perspective.updateProjectionMatrix();
    }
  }, [camera, fov]);

  return null;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
        <span>{label}</span>
        <span className="text-ink-muted">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1.5 h-1 w-full cursor-pointer appearance-none bg-rule accent-accent"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-accent"
      />
    </label>
  );
}

useGLTF.preload("/models/hero-head.glb");

export default function HeroVisualization({ className }: { className?: string }) {
  const [fov, setFov] = useState(35);
  const [density, setDensity] = useState(0.45);
  const [pointSize, setPointSize] = useState(0.01);
  const [opacity, setOpacity] = useState(1);
  const [color, setColor] = useState<keyof typeof COLORS>("ink");
  const [seeThrough, setSeeThrough] = useState(false);
  const [additive, setAdditive] = useState(false);
  const [attenuate, setAttenuate] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className={className}>
      <div className="absolute inset-0" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 2.5], fov }}>
          <CameraFov fov={fov} />
          <Head
            density={density}
            pointSize={pointSize}
            color={COLORS[color]}
            opacity={opacity}
            seeThrough={seeThrough}
            additive={additive}
            attenuate={attenuate}
          />
          <OrbitControls enableDamping makeDefault />
        </Canvas>
      </div>
      {panelOpen ? (
      <div
        className="absolute bottom-3 left-3 z-10 w-[15.5rem] space-y-2.5 border border-rule bg-cream/90 p-3 backdrop-blur-sm"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Tune</span>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
          >
            Hide
          </button>
        </div>
        <Slider
          label="FOV"
          value={fov}
          min={18}
          max={75}
          step={1}
          display={`${fov}°`}
          onChange={setFov}
        />
        <Slider
          label="Density"
          value={density}
          min={0.05}
          max={1}
          step={0.01}
          display={`${Math.round(density * 100)}%`}
          onChange={setDensity}
        />
        <Slider
          label="Point size"
          value={pointSize}
          min={0.002}
          max={0.04}
          step={0.001}
          display={pointSize.toFixed(3)}
          onChange={setPointSize}
        />
        <Slider
          label="Opacity"
          value={opacity}
          min={0.08}
          max={1}
          step={0.01}
          display={`${Math.round(opacity * 100)}%`}
          onChange={setOpacity}
        />
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          <span>Color</span>
          <div className="flex gap-1">
            {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((name) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                onClick={() => setColor(name)}
                className={`h-4 w-4 border ${color === name ? "border-ink" : "border-rule"}`}
                style={{ backgroundColor: COLORS[name] }}
              />
            ))}
          </div>
        </div>
        <Toggle label="See through" checked={seeThrough} onChange={setSeeThrough} />
        <Toggle label="Additive" checked={additive} onChange={setAdditive} />
        <Toggle label="Size attenuation" checked={attenuate} onChange={setAttenuate} />
      </div>
      ) : (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          onPointerDown={(event) => event.stopPropagation()}
          className="absolute bottom-3 left-3 z-10 border border-rule bg-cream/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent backdrop-blur-sm transition-colors hover:text-ink"
        >
          Tune
        </button>
      )}
    </div>
  );
}
