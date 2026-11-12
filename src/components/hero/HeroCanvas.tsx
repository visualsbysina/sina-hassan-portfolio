"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useWebGL2 } from "@/lib/webgl";
import { cn } from "@/lib/utils";

const HeadField = dynamic(() => import("./HeadField"), { ssr: false });

/** Loads the WebGL portrait only in the browser; a soft glow stands in without WebGL. */
export default function HeroCanvas({ className }: { className?: string }) {
  const webgl = useWebGL2();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden="true">
      <div
        className={cn(
          "absolute right-[-10%] top-1/2 aspect-square w-[70vmin] -translate-y-1/2 rounded-full bg-signal/10 blur-[120px] transition-opacity duration-1000 md:right-[8%]",
          ready && "opacity-50",
        )}
      />
      {webgl && <HeadField className="absolute inset-0" onReady={onReady} />}
    </div>
  );
}
