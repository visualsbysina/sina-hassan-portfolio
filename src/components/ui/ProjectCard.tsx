import Link from "next/link";
import type { Project } from "@/types";
import ProjectPlaceholder from "@/components/ui/ProjectPlaceholder";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="h-full">
      <Link href={`/work/${project.slug}`} className="project-card-link group">
        <div className="relative aspect-[8/5] overflow-hidden border border-rule transition-colors duration-300 group-hover:border-accent/40">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
            <ProjectPlaceholder
              title={project.title}
              slug={project.slug}
              imageSrc={project.image.src}
              imageAlt={project.image.alt}
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className="label-mono mb-2">{project.number}</p>
          <h3 className="heading-serif text-xl text-ink transition-colors duration-300 group-hover:text-accent md:text-2xl">
            {project.title}
          </h3>
          {project.organization && (
            <p className="mt-1 text-[15px] text-ink-muted">{project.organization}</p>
          )}
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted md:text-base">
            {project.contribution}
          </p>
          <p className="mt-2 text-sm text-ink-faint">{project.role}</p>
          <p className="mt-4 font-mono text-xs leading-relaxed text-accent">
            {project.stack.join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
}
