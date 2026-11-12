import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/** Section opener: an indexed mono label over a large display heading. */
export default function SectionIntro({
  index,
  label,
  title,
  id,
  aside,
  className,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  id: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 grid gap-6 md:mb-16 md:grid-cols-12", className)}>
      <p className="label-mono md:col-span-3">
        <span className="text-signal">{`(${index})`}</span> {label}
      </p>
      <Reveal className="md:col-span-9">
        <h2 id={id} className="heading-display text-[clamp(2.5rem,6vw,5.5rem)] text-paper">
          {title}
        </h2>
        {aside && <div className="text-body mt-6 max-w-2xl">{aside}</div>}
      </Reveal>
    </div>
  );
}
