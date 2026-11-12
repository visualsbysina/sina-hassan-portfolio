import { credibilityItems } from "@/data/site";

export default function CredibilityStrip() {
  return (
    <section className="section-rule" aria-label="Professional credentials">
      <div className="editorial-grid">
        <ul className="grid grid-cols-2 divide-x divide-rule lg:grid-cols-4">
          {credibilityItems.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center px-4 py-8 text-center md:px-6 md:py-10"
            >
              <span className="max-w-[12rem] font-mono text-[15px] font-medium uppercase leading-snug tracking-[0.12em] text-ink md:text-base">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
