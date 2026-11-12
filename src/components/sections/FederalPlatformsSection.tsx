import Image from "next/image";
import { federalPlatforms } from "@/data/federal-platforms";
import Reveal from "@/components/motion/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";

export default function FederalPlatformsSection() {
  return (
    <section id="federal-platforms" className="scroll-mt-20 pb-24 md:pb-36" aria-labelledby="federal-platforms-heading">
      <div className="editorial-grid">
        <h2 id="federal-platforms-heading" className="label-mono mb-6">
          Selected Federal Platforms
        </h2>
        {federalPlatforms.map((platform) => (
          <Reveal as="article" key={platform.name} className="grid border border-void-line md:grid-cols-12">
            {platform.image && (
              <div className="relative aspect-[16/10] overflow-hidden border-b border-void-line md:col-span-7 md:border-b-0 md:border-r">
                <Image src={platform.image.src} alt={platform.image.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover object-top" />
              </div>
            )}
            <div className="flex flex-col justify-between gap-8 p-6 md:col-span-5 md:p-10">
              <div>
                <p className="hud-label text-paper-faint">{platform.organization}</p>
                <h3 className="heading-display mt-4 text-[clamp(2rem,3.6vw,3.5rem)] text-paper">{platform.name}</h3>
                <p className="text-body mt-5">{platform.contribution}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-paper-faint">{platform.context}</p>
              </div>
              {platform.url && (
                <a href={platform.url} target="_blank" rel="noopener noreferrer" className="hud-label inline-flex items-center gap-2 text-paper hover:text-signal">
                  Visit {platform.name}
                  <span className="sr-only">(opens in a new tab)</span>
                  <ArrowUpRight />
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
