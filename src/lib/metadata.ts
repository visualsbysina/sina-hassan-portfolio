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
      "Federal Web Development",
      "Three.js",
      "WebGL",
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

export function createProjectMetadata(project: {
  title: string;
  summary: string;
  slug: string;
}): Metadata {
  return createMetadata({
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
      url: `${siteConfig.url}/work/${project.slug}`,
    },
  });
}
