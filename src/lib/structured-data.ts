import { siteConfig } from "@/data/site";
import { projects } from "@/data/projects";

export function getPersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.jobTitle,
    url: siteConfig.url,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Baltimore",
      addressRegion: "MD",
      addressCountry: "US",
    },
    knowsAbout: [
      "Front-End Development",
      "Drupal",
      "React",
      "Next.js",
      "Accessibility",
      "Design Systems",
      "Three.js",
      "WebGL",
      "Game Development",
      "Unity",
      "Data Visualization",
    ],
  };
}

export function getProjectStructuredData(project: {
  title: string;
  summary: string;
  slug: string;
  organization?: string;
  role: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteConfig.url}/work/${project.slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: siteConfig.jobTitle,
    },
    ...(project.organization && {
      publisher: {
        "@type": "Organization",
        name: project.organization,
      },
    }),
  };
}

export function getWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}

export function getAllProjectsStructuredData() {
  return projects.map(getProjectStructuredData);
}
