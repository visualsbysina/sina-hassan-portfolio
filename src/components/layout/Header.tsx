"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

function useBaltimoreTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/New_York",
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const time = useBaltimoreTime();
  const toggle = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled || open ? "border-b border-void-line bg-void/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="editorial-grid flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link href="/" className="group flex items-baseline gap-3" aria-label={`${siteConfig.name} — Home`} onClick={() => setOpen(false)}>
          <span className="text-[17px] font-medium tracking-[-0.02em] text-paper">{siteConfig.name}</span>
          <span className="hud-label hidden text-paper-faint lg:inline">{siteConfig.jobTitle}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navigation.map((item, i) => (
            <Link key={item.href} href={item.href} className="group hud-label text-paper-muted transition-colors hover:text-paper">
              <span aria-hidden="true" className="mr-1.5 text-paper-faint transition-colors group-hover:text-signal">
                {`0${i + 1}`}
              </span>
              {item.label}
            </Link>
          ))}
          <a href={siteConfig.resumePath} className="hud-label border border-paper/25 px-3 py-2 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-void">
            Résumé
          </a>
          {time && (
            <span className="hud-label hidden text-paper-faint xl:inline" aria-label={`Local time in Baltimore: ${time}`}>
              BAL {time}
            </span>
          )}
        </nav>

        <button
          ref={toggle}
          type="button"
          className="hud-label -mr-2 flex h-11 items-center gap-3 px-2 text-paper md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true" className="relative block h-2.5 w-5">
            <span className={cn("absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-300", open && "translate-y-[5px] rotate-45")} />
            <span className={cn("absolute bottom-0 left-0 h-px w-full bg-paper transition-transform duration-300", open && "-translate-y-[4px] -rotate-45")} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="h-[calc(100svh-64px)] overflow-y-auto border-t border-void-line bg-void md:hidden">
          <ul className="editorial-grid flex flex-col py-6">
            {navigation.map((item, i) => (
              <li key={item.href} className="fade-up border-b border-void-line" style={{ "--delay": `${i * 50}ms` } as React.CSSProperties}>
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={item.href}
                  className="flex items-baseline justify-between py-4 text-[2.5rem] font-medium leading-none tracking-[-0.04em] text-paper"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span aria-hidden="true" className="hud-label text-paper-faint">
                    {`0${i + 1}`}
                  </span>
                </Link>
              </li>
            ))}
            <li className="pt-8">
              <a href={siteConfig.resumePath} className="btn-secondary">
                Download Résumé
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
