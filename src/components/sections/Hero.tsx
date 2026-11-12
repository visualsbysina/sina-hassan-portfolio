import { heroContent } from "@/data/site";
import ButtonLink from "@/components/ui/ButtonLink";
import HeroVisualizationWrapper from "@/components/sections/HeroVisualizationWrapper";

export default function Hero() {
  return (
    <section className="section-rule" aria-labelledby="hero-heading">
      <div className="editorial-grid grid gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-16">
        <div className="flex flex-col justify-center">
          <p className="label-mono mb-4">{heroContent.eyebrow}</p>
          <h1
            id="hero-heading"
            className="heading-serif-display text-display-xl text-ink text-balance"
          >
            {heroContent.headline}
          </h1>
          <p className="mt-5 font-serif text-lg italic text-accent md:text-xl">
            {heroContent.subheadline}
          </p>
          <p className="mt-6 max-w-prose text-[17px] leading-relaxed text-ink-muted md:text-lg">
            {heroContent.supportingCopy}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href={heroContent.primaryCta.href}>
              {heroContent.primaryCta.label}
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href={heroContent.secondaryCta.href} variant="secondary" download>
              {heroContent.secondaryCta.label}
              <ArrowDown />
            </ButtonLink>
          </div>
        </div>

        <div className="relative min-h-[280px] md:min-h-[400px] lg:min-h-[480px]">
          <div className="absolute inset-0 overflow-hidden border border-rule">
            <HeroVisualizationWrapper className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
