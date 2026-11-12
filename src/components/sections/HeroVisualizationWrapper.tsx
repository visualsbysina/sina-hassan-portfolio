"use client";

import HeroVisualization from "@/components/sections/HeroVisualization";

interface HeroVisualizationWrapperProps {
  className?: string;
}

export default function HeroVisualizationWrapper({
  className,
}: HeroVisualizationWrapperProps) {
  return <HeroVisualization className={className} />;
}
