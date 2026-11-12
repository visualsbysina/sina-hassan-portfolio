import Link from "next/link";
import PlanetDemo from "@/components/planet/PlanetDemo";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";

const pipeline = [
  ["Data", "The game's own map files, downsampled to a 170³ grid and deflated, 147 KB to 1.5 MB each"],
  ["Meshing", "A Web Worker builds visible faces with per-vertex ambient occlusion in 24³ chunks"],
  ["Destruction", "Craters carve the grid, scorch the rim, and remesh only the chunks they touch"],
  ["Rendering", "Three.js and React Three Fiber, a patched standard material for glow, bloom, instanced debris"],
];

export default function PlanetFeature() {
  return (
    <section id="lab" className="section-rule scroll-mt-20 py-24 md:py-36" aria-labelledby="lab-heading">
      <div className="editorial-grid">
        <SectionIntro
          index="02"
          label="Lab — Playable demo"
          id="lab-heading"
          title={
            <>
              Planet <span className="font-serif font-normal italic tracking-[-0.02em] text-ember">Rounds</span>
            </>
          }
          aside={
            <p>
              Planet Rounds is a networked tank game I&apos;m building in Unity, fought on small voxel planets where every
              shell carves the terrain. This is its planet renderer rebuilt for the browser, loading the game&apos;s real
              map data. Click or tap the surface to blast a crater.
            </p>
          }
        />
      </div>

      <div className="editorial-grid">
        <div className="relative h-[78svh] min-h-[480px] border border-void-line">
          <PlanetDemo mode="embed" />
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <ol className="grid gap-px border border-void-line bg-void-line sm:grid-cols-2 md:col-span-9">
            {pipeline.map(([title, body], i) => (
              <Reveal as="li" key={title} delay={i * 80} className="bg-void p-6">
                <p className="hud-label text-paper-faint">
                  <span className="text-ember">{`0${i + 1}`}</span> {title}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-paper-muted">{body}</p>
              </Reveal>
            ))}
          </ol>
          <div className="flex items-end md:col-span-3">
            <Link href="/lab/planet-rounds" className="btn-secondary w-full justify-between">
              Open full demo <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
