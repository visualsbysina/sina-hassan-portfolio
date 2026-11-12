import { experiments } from "@/data/experiments";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ExperimentsSection() {
  return (
    <section
      id="experiments"
      className="section-rule bg-ink py-section text-cream"
      aria-labelledby="experiments-heading"
    >
      <div className="editorial-grid">
        <SectionHeading
          label="Interactive Experiments"
          id="experiments-heading"
          inverted
        />

        <p className="mb-10 max-w-prose text-[17px] leading-relaxed text-cream/75 md:text-lg">
          Creative laboratory exploring generative systems, WebGL, and browser-based
          interactive experiences outside of client work.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {experiments.map((experiment) => (
            <article
              key={experiment.slug}
              className="group border border-cream/15 p-6 transition-colors duration-300 hover:border-accent/50"
            >
              <h3 className="heading-serif text-xl text-cream md:text-2xl">
                {experiment.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-cream/65 md:text-base">
                {experiment.description}
              </p>
              <p className="mt-4 font-mono text-xs text-accent">
                {experiment.tags.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
