import { aboutContent } from "@/data/site";
import { skillCategories } from "@/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import TechnologyList from "@/components/ui/TechnologyList";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="section-rule scroll-mt-24 py-section"
      aria-labelledby="about-heading"
    >
      <div className="editorial-grid">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <SectionHeading label="About" id="about-heading" />
            <div className="max-w-prose space-y-5 text-[17px] leading-relaxed text-ink-muted md:text-lg">
              {aboutContent.bio.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading label="Technical Capabilities" />
            <TechnologyList categories={skillCategories} />
          </div>
        </div>
      </div>
    </section>
  );
}
