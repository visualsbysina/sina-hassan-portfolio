import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Sina Hassan",
  title: "Sina Hassan — Senior Front-End Developer",
  description:
    "Senior front-end developer combining Drupal, React, design systems, and interactive technology to create accessible public-facing platforms for federal agencies, global organizations, and creative companies.",
  url: "https://sinahassan.com",
  email: "hello@sinahassan.com",
  location: "Baltimore, MD",
  jobTitle: "Senior Front-End Developer",
  resumePath: "/resume.pdf",
  ogImage: "/images/og-image.svg",
};

export const heroContent = {
  headline: "I build accessible platforms for complex organizations.",
  eyebrow: "14+ years across federal, enterprise, and independent digital products.",
  subheadline: "Drupal · React · Design Systems · Accessibility",
  supportingCopy:
    "Senior front-end developer combining Drupal, React, design systems, and interactive technology to create public-facing platforms for federal agencies, global organizations, and creative companies.",
  primaryCta: { label: "View Selected Work", href: "#work" },
  secondaryCta: { label: "Download Résumé", href: "/resume.pdf" },
};

export const credibilityItems = [
  "14+ Years Experience",
  "Federal & Enterprise",
  "WCAG / Section 508",
  "Drupal + React + WebGL",
];

export const aboutContent = {
  bio: `I'm a senior front-end developer based in Baltimore with 14+ years of experience building accessible digital platforms for federal agencies, enterprise organizations, and independent clients. My work sits at the intersection of design and engineering. I translate complex requirements and design systems into reusable, performant interfaces using Drupal, React, JavaScript, TypeScript, and modern front-end tooling.

My professional work includes national grantmaking platforms, federal multisites, enterprise cloud experiences, interactive data visualization, and digital experiences for creative organizations. Outside of client work, I explore WebGL, generative systems, data visualization, and game development.`,
};

export const contactContent = {
  heading: "Contact",
  description:
    "Available for senior front-end roles, contract engagements, and select freelance projects.",
  email: siteConfig.email,
  location: siteConfig.location,
};
