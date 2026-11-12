import Link from "next/link";
import type { Project } from "@/types";
import SectionHeading from "@/components/ui/SectionHeading";

interface AllWorkProps {
  projects: Project[];
}

export default function AllWork({ projects }: AllWorkProps) {
  const remaining = projects.filter((p) => !p.featured);

  if (remaining.length === 0) return null;

  return (
    <section
      id="additional-work"
      className="section-rule scroll-mt-24 py-section"
      aria-labelledby="additional-work-heading"
    >
      <div className="editorial-grid">
        <SectionHeading label="Additional Work" id="additional-work-heading" />

        <ul className="border-t border-[rgba(21,21,21,0.22)]">
          {remaining.map((project) => (
            <li key={project.slug} className="border-b border-[rgba(21,21,21,0.22)]">
              <Link
                href={`/work/${project.slug}`}
                className="group grid gap-2 py-5 outline-none transition-colors duration-300 hover:bg-accent/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:grid-cols-[3.5rem_1fr_auto] md:items-baseline md:gap-6 md:py-6"
              >
                <span className="label-mono">{project.number}</span>
                <div>
                  <h3 className="heading-serif text-xl text-ink transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-[15px] text-ink-muted md:text-base">
                    {project.organization ? `${project.organization} · ` : ""}
                    {project.role}
                  </p>
                </div>
                <p className="font-mono text-xs leading-relaxed text-accent md:max-w-xs md:text-right">
                  {project.stack.slice(0, 4).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
