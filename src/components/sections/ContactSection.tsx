import { contactContent } from "@/data/site";
import { siteConfig } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="section-rule scroll-mt-24 py-section"
      aria-labelledby="contact-heading"
    >
      <div className="editorial-grid">
        <div className="max-w-prose">
          <SectionHeading label={contactContent.heading} id="contact-heading" />
          <p className="mb-8 text-[17px] leading-relaxed text-ink-muted md:text-lg">
            {contactContent.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href={`mailto:${contactContent.email}`}>
              {contactContent.email}
            </ButtonLink>
            <ButtonLink href={siteConfig.resumePath} variant="secondary" download>
              Download Résumé
            </ButtonLink>
          </div>
          <p className="mt-6 font-mono text-sm text-ink-faint">
            {contactContent.location}
          </p>
        </div>
      </div>
    </section>
  );
}
