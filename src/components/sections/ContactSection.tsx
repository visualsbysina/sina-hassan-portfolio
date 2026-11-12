import { contactContent, siteConfig } from "@/data/site";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";

export default function ContactSection() {
  return (
    <section id="contact" className="section-rule relative scroll-mt-20 overflow-hidden py-24 md:py-40" aria-labelledby="contact-heading">
      <div
        aria-hidden="true"
        className="absolute bottom-[-40%] left-1/2 h-[80%] w-[90%] -translate-x-1/2 rounded-[100%] bg-signal/15 blur-[140px]"
      />
      <div className="editorial-grid relative">
        <p className="label-mono">
          <span className="text-signal">(06)</span> {contactContent.heading}
        </p>
        <h2 id="contact-heading" className="heading-display mt-10 text-mega text-paper">
          Let&apos;s <span className="font-serif font-normal italic tracking-[-0.03em]">talk.</span>
        </h2>

        <div className="mt-14 grid gap-10 border-t border-void-line pt-8 md:grid-cols-12">
          <p className="text-body md:col-span-4">{contactContent.description}</p>
          <div className="md:col-span-8 md:text-right">
            <a
              href={`mailto:${contactContent.email}`}
              className="group inline-flex items-center gap-3 text-[clamp(1.5rem,4.2vw,3.75rem)] font-medium tracking-[-0.04em] text-paper transition-colors hover:text-signal"
            >
              <span className="link-underline">{contactContent.email}</span>
              <ArrowUpRight className="h-[0.6em] w-[0.6em] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
            <div className="mt-8 flex flex-wrap gap-3 md:justify-end">
              <a href={siteConfig.resumePath} className="btn-secondary" download>
                Download Résumé <ArrowDown />
              </a>
            </div>
            <p className="hud-label mt-6 text-paper-faint">{contactContent.location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
