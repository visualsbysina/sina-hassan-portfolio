import { experience } from "@/data/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import ExperienceItem from "@/components/ui/ExperienceItem";

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="section-rule scroll-mt-24 py-section"
      aria-labelledby="experience-heading"
    >
      <div className="editorial-grid">
        <SectionHeading label="Experience" id="experience-heading" />

        <ol>
          {experience.map((item) => (
            <ExperienceItem key={`${item.organization}-${item.period}`} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}
