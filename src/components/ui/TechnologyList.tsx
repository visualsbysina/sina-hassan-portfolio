import type { SkillCategory } from "@/types";

interface TechnologyListProps {
  categories: SkillCategory[];
}

export default function TechnologyList({ categories }: TechnologyListProps) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.title}>
          <h3 className="mb-3 font-mono text-sm font-medium uppercase tracking-[0.14em] text-accent">
            {category.title}
          </h3>
          <ul className="flex flex-wrap gap-2.5">
            {category.skills.map((skill) => (
              <li
                key={skill}
                className="border border-rule px-3.5 py-2 text-[15px] text-ink md:text-base"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
