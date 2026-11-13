"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import type { PreviewState } from "@/components/work/HoverPreview";
import SectionIntro from "@/components/ui/SectionIntro";
import { ArrowUpRight } from "@/components/ui/Icons";
import { hasWebGL2 } from "@/lib/webgl";

const HoverPreview = dynamic(() => import("@/components/work/HoverPreview"), { ssr: false });

export default function AllWork({ projects }: { projects: Project[] }) {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const preview = useRef<PreviewState>({ index: -1, visible: false, x: 0, y: 0 }).current;
  const idle = useRef<number | undefined>(undefined);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !calm && hasWebGL2());
  }, []);

  const show = (index: number) => {
    if (!enabled) return;
    window.clearTimeout(idle.current);
    preview.index = index;
    preview.visible = true;
    setActive(true);
  };
  const hide = () => {
    preview.visible = false;
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setActive(false), 700);
  };
  const move = (e: React.PointerEvent) => {
    preview.x = e.clientX;
    preview.y = e.clientY;
  };

  return (
    <section className="section-rule scroll-mt-20 py-24 md:py-36" aria-labelledby="index-heading">
      <div className="editorial-grid">
        <SectionIntro
          index="03"
          label="Index"
          id="index-heading"
          title={
            <>
              All <span className="font-serif font-normal italic tracking-[-0.02em] chrome-text">projects</span>
            </>
          }
        />

        <ol className="border-t border-void-line" onPointerMove={move} onPointerLeave={hide}>
          {projects.map((project, i) => (
            <li key={project.slug} className="border-b border-void-line">
              <Link
                href={`/work/${project.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-5 transition-colors duration-300 hover:text-paper md:grid-cols-12 md:gap-x-6 md:py-7"
                onPointerEnter={() => show(i)}
              >
                <span className="hud-label text-paper-faint transition-colors group-hover:text-signal md:col-span-1">{project.number}</span>
                <span className="md:col-span-6">
                  <span className="block text-[clamp(1.5rem,3.4vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em] text-paper transition-transform duration-500 ease-out group-hover:translate-x-3">
                    {project.title}
                  </span>
                  <span className="mt-1 block text-[14px] text-paper-faint md:hidden">{project.role}</span>
                </span>
                <span className="hidden md:col-span-4 md:block">
                  {project.organization && project.organization !== project.title && (
                    <span className="block text-[15px] leading-snug text-paper-muted">{project.organization}</span>
                  )}
                  <span className="hud-label mt-1.5 block text-paper-faint">{project.role}</span>
                </span>
                <span className="relative h-12 w-[4.5rem] overflow-hidden border border-void-line md:hidden">
                  <Image src={project.image.src} alt="" fill sizes="72px" className="object-cover object-top" />
                </span>
                <span className="hidden justify-self-end text-paper-faint transition-colors group-hover:text-paper md:col-span-1 md:block" aria-hidden="true">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      {enabled && <HoverPreview images={projects.map((p) => p.image.src)} state={preview} active={active} />}
    </section>
  );
}
