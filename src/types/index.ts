export interface NavItem {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  subtitle?: string;
  organization?: string;
  /** Live project URL for the case study “Visit Site” CTA. */
  url?: string;
  role: string;
  stack: string[];
  summary: string;
  contribution: string;
  featured: boolean;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  caseStudy: {
    headline?: string;
    overview: string;
    context: string;
    challenge: string;
    built: string[];
    approach: string[];
    accessibility: string[];
    outcomes: string[];
    screenshots: {
      src: string;
      alt: string;
      caption?: string;
    }[];
  };
}

export interface ExperienceItem {
  organization: string;
  role: string;
  period: string;
  startYear: number;
  note?: string;
}

export interface Experiment {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  email: string;
  location: string;
  jobTitle: string;
  resumePath: string;
  ogImage: string;
}
