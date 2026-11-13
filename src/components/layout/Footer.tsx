import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-rule relative z-10 bg-void">
      <div className="editorial-grid flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="hud-label text-paper-faint">
          © {year} {siteConfig.name} · {siteConfig.jobTitle} · {siteConfig.location}
        </p>
        <div className="flex gap-6">
          <Link href="/lab/planet-rounds" className="hud-label link-underline text-paper-muted hover:text-paper">
            Planet Rounds
          </Link>
          <a href={siteConfig.resumePath} className="hud-label link-underline text-paper-muted hover:text-paper">
            Résumé
          </a>
          <a href={`mailto:${siteConfig.email}`} className="hud-label link-underline text-paper-muted hover:text-paper">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
