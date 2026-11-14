"use client";

import { useEffect } from "react";

const SURFACES = ".chrome-text, .chrome-chip, .chrome-edge";

/**
 * Eases prismatic chrome fills toward the pointer, and lights a camo spotlight on the page
 * that follows it. Writes chrome vars onto accent surfaces; camo vars onto the body.
 */
export default function ChromePointer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const body = document.body;
    const target = { x: 0, y: 0, px: 50, py: 40 };
    const current = { x: 0, y: 0, px: 50, py: 40 };
    let frame = 0;
    let last = 0;
    let following = false;

    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const k = 1 - Math.exp(-dt * 3);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.px += (target.px - current.px) * k;
      current.py += (target.py - current.py) * k;

      const x = current.x.toFixed(4);
      const y = current.y.toFixed(4);
      document.querySelectorAll<HTMLElement>(SURFACES).forEach((el) => {
        el.style.setProperty("--chrome-x", x);
        el.style.setProperty("--chrome-y", y);
      });
      body.style.setProperty("--camo-x", `${current.px.toFixed(2)}%`);
      body.style.setProperty("--camo-y", `${current.py.toFixed(2)}%`);

      const delta =
        Math.abs(target.x - current.x) +
        Math.abs(target.y - current.y) +
        Math.abs(target.px - current.px) +
        Math.abs(target.py - current.py);
      if (delta > 0.02) {
        frame = requestAnimationFrame(step);
      } else {
        frame = 0;
        last = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -(e.clientY / window.innerHeight) * 2 + 1;
      target.px = (e.clientX / window.innerWidth) * 100;
      target.py = (e.clientY / window.innerHeight) * 100;
      if (!following) {
        following = true;
        body.classList.add("camo-follow");
      }
      if (!frame) frame = requestAnimationFrame(step);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      body.classList.remove("camo-follow");
      body.style.removeProperty("--camo-x");
      body.style.removeProperty("--camo-y");
    };
  }, []);

  return null;
}
