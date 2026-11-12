import { experience } from "@/data/experience";
import SectionIntro from "@/components/ui/SectionIntro";

export default function ExperienceSection() {
  return (
    <section id="experience" className="section-rule scroll-mt-20 py-24 md:py-36" aria-labelledby="experience-heading">
      <div className="editorial-grid">
        <SectionIntro
          index="04"
          label="Experience"
          id="experience-heading"
          title={
            <>
              14+ years, <span className="font-serif font-normal italic tracking-[-0.02em]">shipping</span>
            </>
          }
        />

        <ol className="border-t border-void-line">
          {experience.map((item) => (
            <li
              key={`${item.organization}-${item.period}`}
              className="group grid gap-x-6 gap-y-1 border-b border-void-line py-6 transition-colors duration-300 hover:bg-void-raised md:grid-cols-12 md:items-baseline md:px-3 md:py-7"
            >
              <p className="hud-label text-paper-faint transition-colors group-hover:text-signal md:col-span-3">{item.period}</p>
              <div className="md:col-span-5">
                <h3 className="text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-paper">
                  {item.organization}
                </h3>
                {item.note && <p className="mt-2 max-w-md text-[15px] leading-relaxed text-paper-faint">{item.note}</p>}
              </div>
              <p className="text-[15px] text-paper-muted md:col-span-4 md:text-right">{item.role}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
