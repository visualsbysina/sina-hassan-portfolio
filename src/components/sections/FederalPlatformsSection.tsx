import Image from "next/image";
import { federalPlatforms } from "@/data/federal-platforms";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FederalPlatformsSection() {
  return (
    <section
      id="federal-platforms"
      className="section-rule scroll-mt-24 py-section"
      aria-labelledby="federal-platforms-heading"
    >
      <div className="editorial-grid">
        <SectionHeading
          label="Selected Federal Platforms"
          id="federal-platforms-heading"
        />

        <div className="space-y-8">
          {federalPlatforms.map((platform) => (
            <article
              key={platform.name}
              className="border border-rule p-6 md:p-8"
            >
              {platform.image && (
                <div className="relative mb-6 aspect-[16/10] overflow-hidden border border-rule">
                  <Image
                    src={platform.image.src}
                    alt={platform.image.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 1360px"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="heading-serif text-xl text-ink md:text-2xl">
                    {platform.url ? (
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {platform.name}
                      </a>
                    ) : (
                      platform.name
                    )}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-accent">
                    {platform.organization}
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-ink-muted md:text-lg">
                {platform.contribution}
              </p>
              <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-faint md:text-base">
                {platform.context}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
