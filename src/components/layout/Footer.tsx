import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-rule">
      <div className="editorial-grid flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-[14px] text-ink-muted">
          © {year} {siteConfig.name}. {siteConfig.jobTitle}.
        </p>
        <div className="flex gap-6">
          <Link
            href="/resume.pdf"
            className="text-[14px] text-accent hover:text-accent-hover"
          >
            Résumé
          </Link>
          <Link
            href={`mailto:${siteConfig.email}`}
            className="text-[14px] text-accent hover:text-accent-hover"
          >
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
