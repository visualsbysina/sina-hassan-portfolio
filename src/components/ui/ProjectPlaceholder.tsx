"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectPlaceholderProps {
  title: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  sizes?: string;
  priority?: boolean;
}

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  "imls-2025-redesign": "from-emerald-900/80 to-teal-800/60",
  "us-dot-multisite": "from-blue-950/80 to-slate-800/60",
  "red-hat-clouddot": "from-red-950/80 to-gray-900/60",
  "stanley-black-decker": "from-yellow-950/80 to-neutral-800/60",
  "vega-studio": "from-neutral-900/90 to-neutral-700/60",
  "pcah-gov": "from-indigo-950/80 to-slate-900/60",
  "bourne-creatives": "from-purple-950/80 to-neutral-900/60",
};

export default function ProjectPlaceholder({
  title,
  slug,
  imageSrc,
  imageAlt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: ProjectPlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const gradient = PLACEHOLDER_GRADIENTS[slug] ?? "from-accent/20 to-accent/5";

  if (!imageError) {
    return (
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-top"
        sizes={sizes}
        priority={priority}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className={`project-placeholder bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10,120,181,0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${slug})`} />
        </svg>
      </div>
      <div className="relative z-10 px-4 text-center">
        <p className="heading-serif text-lg text-white/90">{title}</p>
      </div>
    </div>
  );
}
