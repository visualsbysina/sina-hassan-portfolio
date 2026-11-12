import type { Metadata } from "next";
import Link from "next/link";
import PlanetDemo from "@/components/planet/PlanetDemo";
import Reveal from "@/components/motion/Reveal";
import { ArrowRight } from "@/components/ui/Icons";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Planet Rounds — Playable Voxel Planet",
  description:
    "A planet from Sina Hassan's Unity game Planet Rounds, decoded and meshed in a Web Worker and rendered with Three.js and React Three Fiber. Click to carve craters.",
  path: "/lab/planet-rounds",
});

const maps = [
  { name: "Coral Reef", size: "783 KB", surface: "91,885" },
  { name: "Spiky Orb", size: "457 KB", surface: "67,148" },
  { name: "Tiny Terra Haven", size: "1.5 MB", surface: "64,642" },
  { name: "Circular Cityscape", size: "1.45 MB", surface: "69,782" },
  { name: "Oasis", size: "147 KB", surface: "80,223" },
];

const steps = [
  {
    title: "Reading the game's maps",
    body: [
      "Planet Rounds stores each planet as a .vmap file: a palette, optional material kinds per color (glowing, crystal, brittle), and a run-length encoded grid of 16-bit cells, deflated.",
      "A Node bake script downsamples each map to a 170³ grid by majority vote, so thin features survive and colors stay true, then writes a compact web format. The browser inflates it with the native DecompressionStream, so no compression library ships to the client.",
    ],
  },
  {
    title: "Meshing off the main thread",
    body: [
      "A Web Worker turns the grid into geometry, emitting only faces that touch empty space. Every vertex gets four-level ambient occlusion from its neighboring cells, and quads flip their diagonal where needed so the shading never streaks.",
      "The planet is split into 24³ chunks. Buffers move back to the page as transferables, so nothing is copied, and the interface stays responsive while a planet loads.",
    ],
  },
  {
    title: "Destruction",
    body: [
      "A click raycasts the surface, and the worker clears a jittered sphere of cells, scorches the rim, and rebuilds only the chunks the crater touched.",
      "The removed cells come back as debris: up to 900 sampled voxels per blast feed an instanced pool that falls back toward the planet's center, alongside an additive shockwave, a flash light, and camera shake.",
    ],
  },
  {
    title: "Rendering",
    body: [
      "React Three Fiber renders a standard PBR material patched in onBeforeCompile with a per-vertex glow attribute, so the game's glowing and crystal materials pulse and catch the bloom pass while ordinary terrain doesn't.",
      "A fresnel shell draws the atmosphere. A performance monitor lowers the pixel ratio on slower devices, and the render loop stops entirely while the planet is off screen.",
    ],
  },
  {
    title: "Accessibility",
    body: [
      "The canvas is labeled for screen readers, and a real button blasts a crater near the center of the view, so the demo works from the keyboard. Results are announced through a live region.",
      "With reduced motion, the planet stops auto-rotating, the camera no longer shakes, and debris moves more gently. On touch screens, the embedded demo doesn't trap page scrolling.",
    ],
  },
];

export default function PlanetRoundsPage() {
  return (
    <>
      <section className="relative h-[100svh] min-h-[560px]" aria-labelledby="planet-heading">
        <PlanetDemo mode="full" />
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-void/90 to-transparent pb-24 pt-24 md:pt-28">
          <div className="editorial-grid">
            <p className="label-mono">
              <span className="text-ember">Lab</span> · Playable demo
            </p>
            <h1 id="planet-heading" className="heading-display mt-4 text-[clamp(2.75rem,7vw,6.5rem)] text-paper">
              Planet <span className="font-serif font-normal italic tracking-[-0.02em] text-ember">Rounds</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper-muted">
              Click or tap the surface to blast a crater. Drag to orbit, scroll to zoom, and switch maps from the panel.
            </p>
          </div>
        </div>
      </section>

      <section className="section-rule py-24 md:py-36" aria-labelledby="built-heading">
        <div className="editorial-grid">
          <div className="grid gap-8 md:grid-cols-12">
            <p className="label-mono md:col-span-3">How it&apos;s built</p>
            <div className="md:col-span-9">
              <h2 id="built-heading" className="heading-display text-[clamp(2.25rem,5vw,4.5rem)] text-paper">
                A Unity game&apos;s planets, <span className="font-serif font-normal italic tracking-[-0.02em]">in the browser</span>
              </h2>
              <p className="text-body mt-6 max-w-2xl">
                Planet Rounds is a networked tank game I&apos;m building in Unity, fought on small voxel planets where every
                shell carves the terrain. Rather than ship a heavy engine build, I rebuilt the planet renderer and crater
                system for the web in TypeScript, Three.js, and React Three Fiber, using the game&apos;s real map data.
              </p>
            </div>
          </div>

          <ol className="mt-20 space-y-px border border-void-line bg-void-line">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} className="grid gap-6 bg-void p-6 md:grid-cols-12 md:p-10">
                <h3 className="text-2xl font-medium tracking-[-0.03em] text-paper md:col-span-4">
                  <span className="hud-label mb-3 block text-ember">{`0${i + 1}`}</span>
                  {step.title}
                </h3>
                <div className="space-y-4 md:col-span-8">
                  {step.body.map((p, j) => (
                    <p key={j} className="text-body">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-20 grid gap-8 md:grid-cols-12">
            <h3 className="label-mono md:col-span-3">Baked maps</h3>
            <div className="overflow-x-auto md:col-span-9">
              <table className="w-full min-w-[480px] text-left">
                <caption className="sr-only">Size and visible surface voxels of each baked 170³ map</caption>
                <thead>
                  <tr className="hud-label border-b border-void-line text-paper-faint">
                    <th scope="col" className="py-3 font-medium">Map</th>
                    <th scope="col" className="py-3 font-medium">Download</th>
                    <th scope="col" className="py-3 text-right font-medium">Surface voxels</th>
                  </tr>
                </thead>
                <tbody>
                  {maps.map((map) => (
                    <tr key={map.name} className="border-b border-void-line text-[15px]">
                      <th scope="row" className="py-4 font-normal text-paper">{map.name}</th>
                      <td className="py-4 font-mono text-paper-muted">{map.size}</td>
                      <td className="py-4 text-right font-mono text-paper-muted">{map.surface}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-20 grid gap-8 border border-void-line p-6 md:grid-cols-12 md:p-10">
            <h3 className="label-mono md:col-span-3">Also on this site</h3>
            <div className="md:col-span-9">
              <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.015em] text-paper">
                The portrait on the home page started as a 77 MB GLB. A second bake script samples 72,000 points across
                its surface, weighted toward the face, keeps the brightness of the texture under each one, and quantizes
                everything into a 703 KB buffer that a custom shader assembles, pushes around, and dissolves.
              </p>
              <Link href="/" className="hud-label mt-8 inline-flex items-center gap-2 text-paper hover:text-signal">
                Back to the home page <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
