"use client";

import { useEffect } from "react";

const SURFACES = ".prism-text, .prism-chip, .prism-edge";

/**
 * Eases every prism surface's colours toward the pointer, like tilting the sunglasses' coating.
 * Writes only to the prism elements so the rest of the page isn't restyled each frame.
 */
export default function PrismPointer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;

    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const k = 1 - Math.exp(-dt * 3);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      const x = current.x.toFixed(4);
      const y = current.y.toFixed(4);
      document.querySelectorAll<HTMLElement>(SURFACES).forEach((el) => {
        el.style.setProperty("--prism-x", x);
        el.style.setProperty("--prism-y", y);
      });
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.001) {
        frame = requestAnimationFrame(step);
      } else {
        frame = 0;
        last = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!frame) frame = requestAnimationFrame(step);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
