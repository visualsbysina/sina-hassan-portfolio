"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/types";
import SectionIntro from "@/components/ui/SectionIntro";
import { ArrowUpRight } from "@/components/ui/Icons";

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork({ projects }: { projects: Project[] }) {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (next) {
          gsap.to(card.querySelector("[data-card-inner]"), {
            scale: 0.92,
            filter: "brightness(0.35)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 96px", scrub: true },
          });
        }
        gsap.fromTo(
          card.querySelector("[data-card-image]"),
          { clipPath: "inset(18% 12% 18% 12%)", scale: 1.2 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 30%", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" className="scroll-mt-20 pt-24 md:pt-36" aria-labelledby="work-heading">
      <div className="editorial-grid">
        <SectionIntro
          index="01"
          label="Selected Work"
          id="work-heading"
          title={
            <>
              Selected <span className="font-serif font-normal italic tracking-[-0.02em]">work</span>
            </>
          }
        />
      </div>

      <ol ref={list} className="editorial-grid">
        {projects.map((project, i) => (
          <li key={project.slug} data-card className="pb-6 md:sticky md:top-24 md:pb-10" style={{ zIndex: i + 1 }}>
            <article
              data-card-inner
              className="group relative grid origin-top overflow-hidden border border-void-line bg-void-raised md:min-h-[78svh] md:grid-cols-12"
            >
              <div className="relative flex flex-col justify-between gap-10 p-6 md:col-span-5 md:p-10">
                <div>
                  <p className="hud-label flex items-center justify-between text-paper-faint">
                    <span>
                      <span className="text-signal">{project.number}</span> / {String(projects.length).padStart(2, "0")}
                    </span>
                    <span>{project.role}</span>
                  </p>
                  <h3 className="heading-display mt-8 text-[clamp(2.25rem,4.4vw,4.5rem)] text-paper">
                    <Link
                      href={`/work/${project.slug}`}
                      className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none after:focus-visible:outline after:focus-visible:outline-2 after:focus-visible:-outline-offset-4 after:focus-visible:outline-signal"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  {project.organization && project.organization !== project.title && (
                    <p className="mt-4 font-serif text-xl italic text-paper-muted md:text-2xl">{project.organization}</p>
                  )}
                </div>
                <div>
                  <p className="text-body max-w-md">{project.contribution}</p>
                  <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {project.stack.slice(0, 6).map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <p className="hud-label mt-8 inline-flex items-center gap-2 text-paper transition-colors group-hover:text-signal" aria-hidden="true">
                    Read case study <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden md:col-span-7 md:aspect-auto">
                <div data-card-image className="absolute inset-0">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent md:bg-gradient-to-r md:from-void-raised md:via-transparent" />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
