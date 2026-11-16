import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Sina Hassan",
  title: "Sina Hassan — Senior Front-End Developer",
  description:
    "Senior front-end developer specializing in Drupal, React, and design systems — with deep Three.js, WebGL, and game-development work for accessible platforms and interactive experiences.",
  url: "https://sina.software",
  email: "hello@sinahassan.com",
  location: "Baltimore, MD",
  jobTitle: "Senior Front-End Developer",
  resumePath: "/resume.pdf",
  ogImage: "/images/og-image.jpg",
};

export const heroContent = {
  headline: "I build accessible platforms for complex organizations.",
  eyebrow: "14+ years across enterprise, creative, and public-sector digital products.",
  subheadline: "Drupal · React · Three.js · Accessibility",
  supportingCopy:
    "Senior front-end developer shipping Drupal and React platforms, design systems, and real-time 3D — from federal multisites to Three.js experiences and games in the browser and Unity.",
  primaryCta: { label: "View Selected Work", href: "#work" },
  secondaryCta: { label: "Download Résumé", href: "/resume.pdf" },
};

export const credibilityItems = [
  "14+ Years Experience",
  "Drupal + React",
  "Three.js + Game Dev",
  "WCAG 2.1 AA",
];

export const aboutContent = {
  bio: `I'm a senior front-end developer based in Baltimore with 14+ years of experience building accessible digital platforms for enterprise organizations, independent clients, and public institutions. My day-to-day work is Drupal, React, TypeScript, and design systems — translating complex requirements into reusable, performant interfaces.

That same craft shows up in interactive work: Three.js and WebGL in the browser, data visualization, and game development in Unity. Client projects range from federal Drupal multisites and enterprise cloud UIs to creative digital headquarters; on my own time I ship real-time 3D demos and games that keep the front-end skills sharp.`,
};

export const contactContent = {
  heading: "Contact",
  description:
    "Available for senior front-end roles — Drupal, React, and interactive Three.js work — plus contract engagements and select freelance projects.",
  email: siteConfig.email,
  location: siteConfig.location,
};
