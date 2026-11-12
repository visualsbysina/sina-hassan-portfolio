"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const WIDTH = 420;
const HEIGHT = 263;

const VERTEX = /* glsl */ `
uniform vec2 uVelocity;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  float bend = sin(uv.y * 3.14159);
  p.x -= bend * uVelocity.x * 0.9;
  p.y += sin(uv.x * 3.14159) * uVelocity.y * 0.9;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uMix;
uniform float uAlpha;
uniform vec2 uVelocity;
uniform vec2 uCover;
varying vec2 vUv;

vec3 sampleShifted(sampler2D tex, vec2 uv) {
  vec2 shift = uVelocity * 0.0009;
  return vec3(texture2D(tex, uv + shift).r, texture2D(tex, uv).g, texture2D(tex, uv - shift).b);
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - (1.0 - vUv.y) * uCover.y);
  uv.x = (uv.x - 0.5) * uCover.x + 0.5;
  vec3 col = mix(sampleShifted(uFrom, uv), sampleShifted(uTo, uv), clamp(uMix * 1.4 - (1.0 - vUv.y) * 0.4, 0.0, 1.0));
  gl_FragColor = vec4(col, uAlpha);
  #include <colorspace_fragment>
}
`;

export interface PreviewState {
  index: number;
  visible: boolean;
  x: number;
  y: number;
}

function Plane({ images, state }: { images: string[]; state: PreviewState }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return images.map((src) => {
      const t = loader.load(src);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      return t;
    });
  }, [images]);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  const uniforms = useMemo(
    () => ({
      uFrom: { value: textures[0] },
      uTo: { value: textures[0] },
      uMix: { value: 1 },
      uAlpha: { value: 0 },
      uVelocity: { value: new THREE.Vector2() },
      uCover: { value: new THREE.Vector2(1, 1) },
    }),
    [textures],
  );
  const current = useRef(-1);
  const pos = useRef(new THREE.Vector2(state.x, state.y));
  const last = useRef(new THREE.Vector2(state.x, state.y));
  const target = useMemo(() => new THREE.Vector2(), []);
  const step = useMemo(() => new THREE.Vector2(), []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (state.index !== current.current && state.index >= 0) {
      uniforms.uFrom.value = current.current >= 0 ? uniforms.uTo.value : textures[state.index];
      uniforms.uTo.value = textures[state.index];
      uniforms.uMix.value = current.current >= 0 ? 0 : 1;
      current.current = state.index;
    }
    uniforms.uMix.value = Math.min(1, uniforms.uMix.value + delta * 2.6);

    const img = uniforms.uTo.value.image as HTMLImageElement | undefined;
    if (img?.width) {
      const ratio = img.width / img.height / (WIDTH / HEIGHT);
      uniforms.uCover.value.set(ratio > 1 ? 1 / ratio : 1, ratio > 1 ? 1 : ratio);
    }

    if (uniforms.uAlpha.value === 0 && state.visible) pos.current.set(state.x, state.y);
    pos.current.lerp(target.set(state.x, state.y), 1 - Math.exp(-delta * 9));
    step.copy(pos.current).sub(last.current).clampScalar(-60, 60);
    last.current.copy(pos.current);
    uniforms.uVelocity.value.lerp(step, 0.25);
    uniforms.uAlpha.value = THREE.MathUtils.damp(uniforms.uAlpha.value, state.visible ? 1 : 0, 10, delta);
    if (uniforms.uAlpha.value < 0.01 && !state.visible) uniforms.uAlpha.value = 0;

    const left = Math.min(pos.current.x + 40, size.width - WIDTH - 24);
    const top = THREE.MathUtils.clamp(pos.current.y, HEIGHT / 2 + 16, size.height - HEIGHT / 2 - 16);
    m.position.set(left - size.width / 2 + WIDTH / 2, size.height / 2 - top, 0);
    m.scale.setScalar(0.85 + uniforms.uAlpha.value * 0.15);
    m.rotation.z = THREE.MathUtils.clamp(-uniforms.uVelocity.value.x * 0.004, -0.12, 0.12);
    m.visible = uniforms.uAlpha.value > 0;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <planeGeometry args={[WIDTH, HEIGHT, 24, 24]} />
      <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} transparent depthTest={false} />
    </mesh>
  );
}

/** Fixed full-viewport overlay that draws a distorting image plane beside the cursor. */
export default function HoverPreview({ images, state, active }: { images: string[]; state: PreviewState; active: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <Canvas
        orthographic
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Plane images={images} state={state} />
      </Canvas>
    </div>
  );
}
