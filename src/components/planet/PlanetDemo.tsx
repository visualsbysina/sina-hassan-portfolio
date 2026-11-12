"use client";

import dynamic from "next/dynamic";
import type { PlanetExperienceProps } from "./PlanetExperience";
import { useWebGL2 } from "@/lib/webgl";

const PlanetExperience = dynamic(() => import("./PlanetExperience"), {
  ssr: false,
  loading: () => <PlanetPlaceholder label="Loading planet…" />,
});

export default function PlanetDemo(props: PlanetExperienceProps) {
  const webgl = useWebGL2();
  if (webgl === null) return <PlanetPlaceholder label="Loading planet…" className={props.className} />;
  if (!webgl)
    return (
      <PlanetPlaceholder
        className={props.className}
        label="This demo needs WebGL 2, which this browser has turned off or doesn't support."
      />
    );
  return <PlanetExperience {...props} />;
}

function PlanetPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`relative grid h-full w-full place-items-center bg-void ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 aspect-square w-[min(60%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-void-line"
      />
      <p className="hud-label relative max-w-xs px-6 text-center text-paper/60">{label}</p>
    </div>
  );
}
