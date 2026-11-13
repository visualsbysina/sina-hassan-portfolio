"use client";

import dynamic from "next/dynamic";
import { useWebGL2 } from "@/lib/webgl";

const Shades = dynamic(() => import("./Shades"), { ssr: false });

/** Loads the sunglasses only in the browser, and only with WebGL. */
export default function ShadesCanvas({ className }: { className?: string }) {
  const webgl = useWebGL2();
  return webgl ? <Shades className={className} /> : null;
}
