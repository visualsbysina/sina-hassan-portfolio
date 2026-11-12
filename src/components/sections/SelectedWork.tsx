import Link from "next/link";
import type { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";

interface SelectedWorkProps {
  projects: Project[];
}

export default function SelectedWork({ projects }: SelectedWorkProps) {
  if (projects.length === 0) return null;

  return (
    <section
      id="work"
      className="section-rule scroll-mt-24 py-section"
      aria-labelledby="work-heading"
    >
      <div className="editorial-grid">
        <SectionHeading label="Selected Work" id="work-heading" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="#additional-work"
            className="label-mono inline-flex items-center gap-2 transition-colors hover:text-accent-hover"
          >
            View additional work
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
