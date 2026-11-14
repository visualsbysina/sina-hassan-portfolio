import Link from "next/link";
import { experiments } from "@/data/experiments";
import Reveal from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";

export default function ExperimentsSection() {
  return (
    <section className="pb-24 md:pb-36" aria-labelledby="experiments-heading">
      <div className="editorial-grid">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="experiments-heading" className="label-mono">
            Interactive Experiments
          </h2>
          <p className="max-w-md text-[15px] text-paper-faint md:text-right">
            Creative laboratory exploring generative systems, WebGL, and browser-based interactive experiences outside of
            client work.
          </p>
        </div>
        <ul className="grid gap-px border border-void-line bg-void-line sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment, i) => {
            const live = Boolean(experiment.href);
            return (
              <Reveal
                as="li"
                key={experiment.slug}
                delay={(i % 3) * 80}
                className={`group relative flex min-h-[260px] flex-col justify-between bg-void p-6 transition-colors duration-500 hover:bg-void-raised active:bg-void-raised md:p-8 ${live ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
              >
                <div>
                  <p className="hud-label flex items-center justify-between text-paper-faint">
                    <span>{`0${i + 1}`}</span>
                    {live && (
                      <span className="flex items-center gap-2 text-ember">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" aria-hidden="true" />
                        Live demo
                      </span>
                    )}
                  </p>
                  <h3 className={`mt-6 font-medium tracking-[-0.03em] text-paper ${live ? "text-[2.25rem] leading-none" : "text-2xl"}`}>
                    {live ? (
                      <Link href={experiment.href!} className="after:absolute after:inset-0">
                        {experiment.title}
                      </Link>
                    ) : (
                      experiment.title
                    )}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-paper-muted">{experiment.description}</p>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                    {experiment.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {live && <ArrowUpRight className="h-5 w-5 shrink-0 text-ember transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-active:-translate-y-1 group-active:translate-x-1" />}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
