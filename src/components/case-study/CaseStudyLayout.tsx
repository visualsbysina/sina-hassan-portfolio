import Link from "next/link";
import type { Project } from "@/types";
import ProjectPlaceholder from "@/components/ui/ProjectPlaceholder";
import Reveal from "@/components/motion/Reveal";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

interface CaseStudyProps {
  project: Project;
  prev: Project | null;
  next: Project | null;
}

export default function CaseStudyLayout({ project, prev, next }: CaseStudyProps) {
  const { caseStudy } = project;
  const lede = caseStudy.headline ?? project.subtitle;

  return (
    <article>
      <header className="editorial-grid pb-12 pt-32 md:pb-16 md:pt-44">
        <Link href="/#work" className="hud-label inline-flex items-center gap-2 text-paper-muted transition-colors hover:text-paper">
          <ArrowRight className="rotate-180" /> All work
        </Link>

        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <p className="label-mono md:col-span-3">
            <span className="text-signal">{`(${project.number})`}</span> Case study
          </p>
          <div className="md:col-span-9">
            <h1 className="heading-display fade-up text-[clamp(2.75rem,7vw,7rem)] text-paper">{project.title}</h1>
            {lede && (
              <p className="fade-up mt-6 max-w-3xl font-serif text-[clamp(1.375rem,2.4vw,2rem)] italic leading-snug text-paper-muted" style={{ "--delay": "120ms" } as React.CSSProperties}>
                {lede}
              </p>
            )}
          </div>
        </div>

        <dl className="fade-up mt-14 grid gap-px border border-void-line bg-void-line sm:grid-cols-3" style={{ "--delay": "220ms" } as React.CSSProperties}>
          {project.organization && <Meta label="Organization" value={project.organization} />}
          <Meta label="Role" value={project.role} />
          <Meta label="Stack" value={project.stack.join(" · ")} />
        </dl>
      </header>

      <div className="editorial-grid">
        <div className="relative aspect-[16/9] overflow-hidden border border-void-line">
          <ProjectPlaceholder
            title={project.title}
            slug={project.slug}
            imageSrc={project.image.src}
            imageAlt={project.image.alt}
            sizes="(min-width: 1360px) 1360px, 100vw"
            priority
          />
        </div>
      </div>

      <div className="editorial-grid py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="label-mono md:col-span-3">Overview</p>
          <Reveal className="md:col-span-9">
            <p className="text-[clamp(1.25rem,2.1vw,1.875rem)] leading-[1.35] tracking-[-0.015em] text-paper">{project.summary}</p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-px border border-void-line bg-void-line md:grid-cols-2">
          <TextBlock title="Organization and Audience" content={caseStudy.context} />
          <TextBlock title="Challenge" content={caseStudy.challenge} />
        </div>

        <div className="mt-20 space-y-16 md:mt-28 md:space-y-20">
          <ListBlock index="01" title="What He Built" items={caseStudy.built} />
          <ListBlock index="02" title="Technical Approach" items={caseStudy.approach} />
          <ListBlock index="03" title="Accessibility and Design Systems" items={caseStudy.accessibility} />
          <ListBlock index="04" title="Verified Outcomes" items={caseStudy.outcomes} />
        </div>

        {caseStudy.screenshots.length > 1 && (
          <div className="mt-24">
            <h2 className="label-mono mb-6">Screenshots</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {caseStudy.screenshots.slice(1).map((screenshot, i) => (
                <figure key={i}>
                  <div className="relative aspect-[16/10] overflow-hidden border border-void-line">
                    <ProjectPlaceholder
                      title={project.title}
                      slug={`${project.slug}-${i}`}
                      imageSrc={screenshot.src}
                      imageAlt={screenshot.alt}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  {screenshot.caption && <figcaption className="hud-label mt-3 text-paper-faint">{screenshot.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav aria-label="Project navigation" className="section-rule">
        {next && (
          <Link href={`/work/${next.slug}`} className="group block overflow-hidden py-16 md:py-24">
            <span className="editorial-grid block">
              <span className="hud-label text-paper-faint">Next project · {next.number}</span>
              <span className="heading-display mt-6 flex items-center justify-between gap-6 text-[clamp(2.5rem,8vw,8.5rem)] text-paper transition-colors duration-500 group-hover:text-signal">
                <span className="transition-transform duration-700 ease-out group-hover:translate-x-4">{next.title}</span>
                <ArrowUpRight className="h-[0.5em] w-[0.5em] shrink-0 transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" />
              </span>
            </span>
          </Link>
        )}
        {prev && (
          <div className="section-rule">
            <Link href={`/work/${prev.slug}`} className="editorial-grid hud-label flex items-center gap-3 py-6 text-paper-muted transition-colors hover:text-paper">
              <ArrowRight className="rotate-180" /> Previous · {prev.title}
            </Link>
          </div>
        )}
      </nav>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-void p-5 md:p-6">
      <dt className="hud-label text-paper-faint">{label}</dt>
      <dd className="mt-2 text-[15px] leading-snug text-paper">{value}</dd>
    </div>
  );
}

function TextBlock({ title, content }: { title: string; content: string }) {
  return (
    <Reveal as="section" className="bg-void p-6 md:p-10">
      <h2 className="label-mono">{title}</h2>
      <p className="text-body mt-5">{content}</p>
    </Reveal>
  );
}

function ListBlock({ index, title, items }: { index: string; title: string; items: string[] }) {
  return (
    <section className="grid gap-6 md:grid-cols-12">
      <h2 className="label-mono md:col-span-3">
        <span className="text-signal">{`(${index})`}</span> {title}
      </h2>
      <ol className="border-t border-void-line md:col-span-9">
        {items.map((item, i) => (
          <li key={i} className="flex gap-6 border-b border-void-line py-4 text-[16px] leading-relaxed text-paper-muted md:text-[17px]">
            <span className="hud-label w-6 shrink-0 pt-1.5 text-paper-faint" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-paper">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
