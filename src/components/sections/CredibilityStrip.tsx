import { credibilityItems } from "@/data/site";

export default function CredibilityStrip() {
  const run = [...credibilityItems, ...credibilityItems];

  return (
    <section aria-label="Professional credentials" className="marquee section-rule overflow-hidden border-b border-void-line py-5 md:py-6">
      <ul className="sr-only">
        {credibilityItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="marquee-track flex w-max" style={{ "--duration": "36s" } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-copy flex shrink-0">
            {run.map((item, i) => (
              <span
                key={i}
                data-repeat={i >= credibilityItems.length ? "" : undefined}
                className="flex items-center whitespace-nowrap text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium tracking-[-0.03em] text-paper"
              >
                <span className={i % 2 ? "font-serif font-normal italic chrome-text" : undefined}>{item}</span>
                <span className="mx-8 inline-block h-2 w-2 rotate-45 chrome-chip md:mx-12" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
