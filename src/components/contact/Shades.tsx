"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useInView, useReducedMotion } from "@/lib/webgl";

const MODEL = "/models/oakleys.glb";
const CITY = "/models/potsdamer-platz-1k.hdr";

function Glasses({ pointer, reducedMotion }: { pointer: THREE.Vector2; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL);

  // Polished almost to a mirror so the city reads in the lenses; the baked colours tint it
  // like an iridium coating, and the rubber parts stay matte through the roughness map.
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial;
      mesh.material = new THREE.MeshPhysicalMaterial({
        map: src.map,
        normalMap: src.normalMap,
        metalnessMap: src.metalnessMap,
        roughnessMap: src.roughnessMap,
        metalness: 1,
        roughness: 0.18,
        side: THREE.DoubleSide,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        iridescence: 0.35,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [120, 780],
        envMapIntensity: 1.4,
      });
    });
    return root;
  }, [scene]);

  useEffect(
    () => () =>
      model.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) (mesh.material as THREE.Material).dispose();
      }),
    [model],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reducedMotion) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.55 + Math.sin(t * 0.35) * 0.18 + pointer.x * 0.35, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 - pointer.y * 0.2, 2.5, delta);
    g.rotation.z = Math.sin(t * 0.5) * 0.04;
    g.position.y = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group} position={[0.15, 0, 0]} rotation={[0.12, -0.55, 0]}>
      <primitive object={model} />
    </group>
  );
}

/** Floating sunglasses beside the contact heading. Decorative: hidden from assistive tech. */
export default function Shades({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container);
  const reducedMotion = useReducedMotion();
  const pointer = useRef(new THREE.Vector2()).current;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  return (
    <div ref={container} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={reducedMotion ? "demand" : inView ? "always" : "never"}
        camera={{ position: [0, 0, 3.4], fov: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        {/* Without a boundary here the model's loading suspends the page and tears down the canvas. */}
        <Suspense fallback={null}>
          <Glasses pointer={pointer} reducedMotion={reducedMotion} />
          {/* Tipped back so the towers, rather than the street, fill the lenses. */}
          <Environment files={CITY} environmentRotation={[0.35, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
