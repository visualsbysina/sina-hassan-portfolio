import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title?: string;
  className?: string;
  id?: string;
  inverted?: boolean;
}

export default function SectionHeading({
  label,
  title,
  className,
  id,
  inverted = false,
}: SectionHeadingProps) {
  const heading = title ?? label;

  return (
    <div className={cn("mb-8 md:mb-10", className)}>
      {title && label && (
        <p className={cn("label-mono mb-3", inverted && "text-accent")}>{label}</p>
      )}
      {heading && (
        <h2
          className={cn(
            "heading-serif text-display-md",
            inverted ? "text-cream" : "text-ink"
          )}
          id={id}
        >
          {heading}
        </h2>
      )}
    </div>
  );
}
