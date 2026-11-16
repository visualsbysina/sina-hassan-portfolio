import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.title,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "Senior Front-End Developer",
      "Drupal Developer",
      "React Developer",
      "Next.js",
      "Accessibility",
      "WCAG",
      "Section 508",
      "Design Systems",
      "React Three Fiber",
      "Three.js",
      "WebGL",
      "Game Development",
      "Unity",
      "Baltimore",
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return createMetadata({
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      title: `${title} — ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}${path}`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
  });
}

export function createProjectMetadata(project: {
  title: string;
  summary: string;
  slug: string;
}): Metadata {
  return createPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}
