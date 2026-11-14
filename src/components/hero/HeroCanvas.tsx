"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/** Keep in sync with the particle assemble duration in HeadField. */
const INTRO_SECONDS = 2.8;

const HeadField = dynamic(() => import("./HeadField"), { ssr: false });

/** Loads the WebGL portrait; glow eases in with the particle intro once points are ready. */
export default function HeroCanvas({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <div
        className={cn(
          "absolute right-[-10%] top-1/2 aspect-square w-[70vmin] -translate-y-1/2 rounded-full blur-[120px] opacity-0 md:right-[8%]",
          ready && "opacity-50",
        )}
        style={{
          background: "rgba(106, 61, 255, 0.18)",
          transition: `opacity ${INTRO_SECONDS}s ease-out`,
        }}
      />
      <HeadField className="absolute inset-0" onReady={onReady} />
    </div>
  );
}
