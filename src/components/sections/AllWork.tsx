import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import SectionIntro from "@/components/ui/SectionIntro";
import { ArrowUpRight } from "@/components/ui/Icons";

export default function AllWork({ projects }: { projects: Project[] }) {
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

        <ol className="border-t border-void-line">
          {projects.map((project) => (
            <li key={project.slug} className="border-b border-void-line">
              <Link
                href={`/work/${project.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-5 transition-colors duration-300 hover:text-paper md:grid-cols-12 md:gap-x-6 md:py-7"
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
    </section>
  );
}
