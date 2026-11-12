import Link from "next/link";
import type { Project } from "@/types";
import ProjectPlaceholder from "@/components/ui/ProjectPlaceholder";

interface CaseStudyProps {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function CaseStudyLayout({ project, prev, next }: CaseStudyProps) {
  const { caseStudy } = project;

  return (
    <article className="pb-section">
      {/* Hero */}
      <header className="section-rule py-section">
        <div className="editorial-grid">
          <Link
            href="/#work"
            className="label-mono mb-8 inline-flex items-center gap-2 transition-colors hover:text-accent-hover"
          >
            ← Back to Work
          </Link>

          <p className="label-mono mb-4">{project.number}</p>

          <h1 className="heading-serif text-display-lg text-ink">
            {project.title}
          </h1>

          {project.organization && (
            <p className="mt-3 text-lg text-ink-muted">
              {project.organization}
            </p>
          )}

          <p className="mb-6 mt-2 font-mono text-sm text-accent">{project.role}</p>

          {project.caseStudy.headline && (
            <p className="mb-4 max-w-prose font-serif text-xl italic leading-snug text-ink md:text-2xl">
              {project.caseStudy.headline}
            </p>
          )}

          {project.subtitle && !project.caseStudy.headline && (
            <p className="mb-4 max-w-prose text-lg text-ink-muted">
              {project.subtitle}
            </p>
          )}

          <p className="max-w-prose text-lg leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="border border-rule px-3 py-1 font-mono text-xs text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Primary screenshot */}
      <div className="editorial-grid mb-section">
        <div className="relative aspect-[16/9] overflow-hidden border border-rule">
          <ProjectPlaceholder
            title={project.title}
            slug={project.slug}
            imageSrc={project.image.src}
            imageAlt={project.image.alt}
          />
        </div>
      </div>

      {/* Content sections */}
      <div className="editorial-grid">
        <div className="grid gap-section lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="space-y-section">
            <CaseStudySection title="Project Overview" content={caseStudy.overview} />
            <CaseStudySection title="Organization and Audience" content={caseStudy.context} />
            <CaseStudySection
              title="Sina's Role"
              content={`${project.role}${project.organization ? ` — ${project.organization}` : ""}`}
            />
          </div>

          <div className="space-y-section">
            <CaseStudySection title="Challenge" content={caseStudy.challenge} />
            <CaseStudyList title="What He Built" items={caseStudy.built} />
            <CaseStudyList title="Technical Approach" items={caseStudy.approach} />
            <CaseStudyList title="Accessibility and Design Systems" items={caseStudy.accessibility} />
            <CaseStudyList title="Verified Outcomes" items={caseStudy.outcomes} />
          </div>
        </div>

        {/* Additional screenshots */}
        {caseStudy.screenshots.length > 1 && (
          <div className="mt-section space-y-8">
            <h2 className="label-mono">Screenshots</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {caseStudy.screenshots.slice(1).map((screenshot, i) => (
                <figure key={i}>
                  <div className="relative aspect-[16/10] overflow-hidden border border-rule">
                    <ProjectPlaceholder
                      title={project.title}
                      slug={`${project.slug}-${i}`}
                      imageSrc={screenshot.src}
                      imageAlt={screenshot.alt}
                    />
                  </div>
                  {screenshot.caption && (
                    <figcaption className="mt-2 text-sm text-ink-muted">
                      {screenshot.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className="mt-section grid gap-4 border-t border-rule pt-8 md:grid-cols-2"
          aria-label="Project navigation"
        >
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="group border border-rule p-6 transition-colors duration-300 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="label-mono">Previous Project</span>
              <p className="heading-serif mt-2 text-lg group-hover:text-accent">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="group border border-rule p-6 text-right transition-colors duration-300 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:col-start-2"
            >
              <span className="label-mono">Next Project</span>
              <p className="heading-serif mt-2 text-lg group-hover:text-accent">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </article>
  );
}

function CaseStudySection({ title, content }: { title: string; content: string }) {
  return (
    <section>
      <h2 className="label-mono mb-4">{title}</h2>
      <p className="text-[17px] leading-relaxed text-ink-muted md:text-lg">
        {content}
      </p>
    </section>
  );
}

function CaseStudyList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="label-mono mb-4">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-[17px] leading-relaxed text-ink-muted md:text-lg"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
