import { heroContent, siteConfig } from "@/data/site";
import HeroCanvas from "@/components/hero/HeroCanvas";
import { ArrowDown, ArrowRight } from "@/components/ui/Icons";

const ACCENT_WORD = "accessible";

export default function Hero() {
  const words = heroContent.headline.split(" ");

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-heading">
      <HeroCanvas className="absolute inset-0 -z-10 opacity-60 md:opacity-100" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_70%,rgba(7,8,10,0.85),transparent_60%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-gradient-to-t from-void via-void/85 to-transparent" />

      <div className="editorial-grid flex min-h-[100svh] flex-col justify-end pb-10 pt-28 md:pb-14">
        <p className="label-mono fade-up mb-6 max-w-md md:mb-8" style={{ "--delay": "100ms" } as React.CSSProperties}>
          <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-ember align-middle" aria-hidden="true" />
          {heroContent.eyebrow}
        </p>

        <h1 id="hero-heading" className="heading-display max-w-[13ch] text-hero text-paper">
          {words.map((word, i) => (
            <span key={i}>
              <span className="rise-mask">
                <span
                  className={word === ACCENT_WORD ? "rise-word font-serif font-normal italic tracking-[-0.02em]" : "rise-word"}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {word === ACCENT_WORD ? <span className="chrome-text">{word}</span> : word}
                </span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>

        <div
          className="fade-up mt-10 grid gap-8 border-t border-void-line pt-6 md:mt-14 md:grid-cols-12 md:gap-6"
          style={{ "--delay": "900ms" } as React.CSSProperties}
        >
          <p className="hud-label text-paper md:col-span-3">{heroContent.subheadline}</p>
          <p className="text-body max-w-xl md:col-span-5">{heroContent.supportingCopy}</p>
          <div className="flex flex-wrap items-start gap-3 md:col-span-4 md:justify-end">
            <a href={heroContent.primaryCta.href} className="btn-primary">
              {heroContent.primaryCta.label}
              <ArrowRight />
            </a>
            <a href={heroContent.secondaryCta.href} className="btn-secondary" download>
              {heroContent.secondaryCta.label}
              <ArrowDown />
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hud-label fade-up absolute right-5 top-24 hidden flex-col items-end gap-1 text-paper-faint md:right-8 md:flex lg:right-12"
        style={{ "--delay": "1400ms" } as React.CSSProperties}
      >
        <span>{siteConfig.location}</span>
        <span>39.29° N · 76.61° W</span>
        <span className="mt-3 text-paper-muted">72,000 pts · webgl</span>
      </div>
    </section>
  );
}
