import type { ExperienceItem as ExperienceItemType } from "@/types";

interface ExperienceItemProps {
  item: ExperienceItemType;
}

export default function ExperienceItem({ item }: ExperienceItemProps) {
  return (
    <li className="grid gap-2 border-b border-[rgba(21,21,21,0.22)] py-6 first:border-t md:grid-cols-[1fr_auto] md:items-baseline md:gap-8 md:py-7">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-ink md:text-xl">
          {item.organization}
        </h3>
        <p className="mt-1 text-base text-ink-muted">{item.role}</p>
        {item.note && (
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-faint">
            {item.note}
          </p>
        )}
      </div>
      <time
        dateTime={item.period.replace("–", "/").replace("Present", "2026")}
        className="font-mono text-sm uppercase tracking-[0.12em] text-ink-muted md:text-right"
      >
        {item.period}
      </time>
    </li>
  );
}
