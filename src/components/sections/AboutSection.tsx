import { aboutContent } from "@/data/site";
import { skillCategories } from "@/data/skills";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";

export default function AboutSection() {
  const [lead, ...rest] = aboutContent.bio.split("\n\n");

  return (
    <section id="about" className="section-rule scroll-mt-20 py-24 md:py-36" aria-labelledby="about-heading">
      <div className="editorial-grid">
        <SectionIntro
          index="05"
          label="About"
          id="about-heading"
          title={
            <>
              Design <span className="font-serif font-normal italic tracking-[-0.02em] text-signal">meets</span> engineering
            </>
          }
        />

        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-8 md:col-start-4">
            <p className="text-[clamp(1.25rem,2.1vw,1.875rem)] leading-[1.35] tracking-[-0.015em] text-paper">{lead}</p>
            {rest.map((paragraph, i) => (
              <p key={i} className="text-body mt-6 max-w-2xl">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="mt-20 md:mt-28">
          <h3 className="label-mono mb-6">Technical Capabilities</h3>
          <div className="grid gap-px border border-void-line bg-void-line sm:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map((category, i) => (
              <Reveal key={category.title} delay={i * 80} className="bg-void p-6 md:p-8">
                <h4 className="hud-label text-paper">
                  <span className="text-signal">{`0${i + 1}`}</span> {category.title}
                </h4>
                <ul className="mt-6 space-y-2">
                  {category.skills.map((skill) => (
                    <li key={skill} className="text-[15px] text-paper-muted">
                      {skill}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
