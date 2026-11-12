import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "vega-studio",
    number: "01",
    title: "Vega Studio",
    organization: "Vega Studio",
    role: "Designer and Full-Stack Developer",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Redux",
      "GSAP",
      "Three.js",
      "Sanity",
    ],
    summary:
      "Built an interactive digital headquarters for Vega Studio, a design-tech company producing multidimensional brand experiences. The site combines a desktop-inspired interface, configurable themes, audiovisual content, case studies, and modular content windows in a responsive Next.js application.",
    contribution:
      "Designed and developed an interactive Next.js experience for a digital-first design-tech studio.",
    featured: true,
    image: {
      src: "/images/projects/vega-studio.jpg",
      alt: "Vega Studio website with architectural visual",
      width: 800,
      height: 500,
    },
    caseStudy: {
      headline: "An interactive digital headquarters for a design-tech studio",
      overview:
        "Built an interactive digital headquarters for Vega Studio, a design-tech company producing multidimensional brand experiences.",
      context:
        "Vega Studio needed a distinctive web presence that demonstrated design sensibility and technical capability. The resulting website presents services, case studies, and audiovisual content through a modular, desktop-inspired interface.",
      challenge:
        "Deliver a responsive Next.js application that supports configurable themes, rich media presentation, and interactive visual elements while remaining performant and maintainable.",
      built: [
        "Next.js application with structured content integration",
        "Responsive layout system for services and case studies",
        "Motion and interaction treatments using GSAP",
        "Interactive visual presentation elements",
        "Modular, windowed interface patterns",
      ],
      approach: [
        "Designed and built the application architecture in Next.js and React",
        "Implemented theme and layout systems for configurable presentation",
        "Integrated audiovisual content and case study modules",
        "Applied GSAP for polished motion with reduced-motion fallbacks",
        "Used Three.js for interactive visual elements where appropriate",
      ],
      accessibility: [
        "Reduced-motion support for animations",
        "Semantic HTML with proper heading hierarchy",
        "Keyboard-accessible navigation and interactive controls",
        "Decorative visual elements hidden from assistive technology",
      ],
      outcomes: [
        "Interactive Next.js experience for a digital-first design-tech studio",
        "Modular content presentation including case studies and services",
        "The resulting website includes a theme selector, media player, VegaTV, and windowed interface patterns",
      ],
      screenshots: [
        {
          src: "/images/projects/vega-studio.jpg",
          alt: "Vega Studio homepage with architectural visual",
          caption: "Studio homepage with interactive visual elements",
        },
      ],
    },
  },
  {
    slug: "imls-2025-redesign",
    number: "02",
    title: "IMLS 2025 Redesign",
    subtitle: "An accessible Drupal platform for America's libraries and museums",
    organization: "Institute of Museum and Library Services",
    role: "Front-End Technical Lead",
    stack: [
      "Drupal 10",
      "Twig",
      "SCSS",
      "JavaScript",
      "PHP",
      "Highcharts",
      "REST APIs",
      "WCAG",
      "Section 508",
    ],
    summary:
      "Led front-end development for the redesign of IMLS.gov, the digital platform for the primary source of federal support for America's libraries and museums. I translated UX specifications into an accessible Drupal 10 component system and developed an interactive map for exploring grants, recipients, award types, and funding data.",
    contribution:
      "Led front-end implementation of the IMLS.gov redesign and developed an interactive national grants visualization.",
    featured: true,
    image: {
      src: "/images/projects/imls-2025.jpg",
      alt: "IMLS 2025 website redesign showing library and museum content",
      width: 800,
      height: 500,
    },
    caseStudy: {
      headline: "An accessible Drupal platform for America's libraries and museums",
      overview:
        "Led front-end development for the redesign of IMLS.gov, the digital platform for the primary source of federal support for America's libraries and museums.",
      context:
        "IMLS serves museum and library stakeholders nationwide through grant programs, research, and agency initiatives. The platform needed to communicate complex funding data while meeting federal accessibility requirements.",
      challenge:
        "Translate UX specifications into a scalable Drupal 10 component system and develop an interactive map for exploring grants, recipients, award types, and funding data.",
      built: [
        "Led front-end implementation of the Drupal 10 redesign",
        "Partnered with UX designers on component specifications",
        "Built reusable Twig and SCSS components",
        "Implemented accessible interface behavior",
        "Developed UI animation and interaction treatments",
        "Built custom Drupal functionality",
        "Developed a grants map using Highcharts and REST APIs",
        "Supported WCAG and Section 508 requirements",
      ],
      approach: [
        "Built modular Twig templates with consistent SCSS architecture",
        "Developed JavaScript modules for map interaction and API data fetching",
        "Integrated Highcharts with accessible chart configurations",
        "Collaborated with UX and back-end teams on component contracts",
        "Applied WCAG 2.1 AA and Section 508 patterns throughout interactive elements",
      ],
      accessibility: [
        "Keyboard-accessible map controls and data interactions",
        "Semantic heading hierarchy and landmark regions",
        "Color contrast compliance across all UI states",
        "Screen reader-friendly chart data summaries",
        "Focus management for dynamic content updates",
      ],
      outcomes: [
        "Led front-end implementation of the Drupal 10 redesign",
        "Built reusable Twig and SCSS component system",
        "Developed interactive grants map with Highcharts and REST APIs",
        "Supported WCAG and Section 508 requirements across the platform",
      ],
      screenshots: [
        {
          src: "/images/projects/imls-2025.jpg",
          alt: "IMLS homepage with hero section and navigation",
          caption: "Homepage with accessible navigation and editorial layout",
        },
        {
          src: "/images/projects/imls-2025-map.svg",
          alt: "Interactive grants map showing funding distribution",
          caption: "Interactive grants map with Highcharts integration",
        },
      ],
    },
  },
  {
    slug: "stanley-black-decker",
    number: "03",
    title: "Stanley Black & Decker Global Multisite",
    organization: "Stanley Black & Decker",
    role: "Drupal Developer",
    stack: [
      "Drupal 10",
      "Acquia Site Studio",
      "Responsive UI",
      "Multilingual components",
    ],
    summary:
      "Developed multilingual, responsive components for a global Drupal 10 multisite using Acquia Site Studio.",
    contribution:
      "Developed multilingual, responsive components for a global Drupal 10 multisite.",
    featured: true,
    image: {
      src: "/images/projects/stanley-bdk.jpg",
      alt: "Stanley Black & Decker global website",
      width: 800,
      height: 500,
    },
    caseStudy: {
      overview:
        "Component development for Stanley Black & Decker's global Drupal 10 multisite, built with Acquia Site Studio for multilingual, brand-consistent experiences.",
      context:
        "A global enterprise requiring localized content across multiple regions while maintaining unified brand standards and responsive design.",
      challenge:
        "Build reusable UI components that content teams could configure independently while supporting multilingual content and responsive layouts across a global multisite.",
      built: [
        "Built reusable UI components with Acquia Site Studio",
        "Multilingual-ready layout and content block patterns",
        "Responsive grid and typography system",
        "Reusable hero, card, and navigation components",
      ],
      approach: [
        "Configured Site Studio components with flexible content fields",
        "Built responsive breakpoints aligned to brand guidelines",
        "Tested multilingual rendering across locale configurations",
        "Established component patterns for content editor adoption",
      ],
      accessibility: [
        "Responsive layouts tested across device sizes",
        "Accessible form and navigation patterns",
        "Language attribute handling for screen readers",
      ],
      outcomes: [
        "Built reusable UI components for a global Drupal 10 multisite",
        "Multilingual component system with Acquia Site Studio",
        "Responsive reusable UI adopted across global properties",
      ],
      screenshots: [
        {
          src: "/images/projects/stanley-bdk.jpg",
          alt: "Stanley Black & Decker website component layout",
          caption: "Global multisite component system",
        },
      ],
    },
  },
  {
    slug: "red-hat-clouddot",
    number: "04",
    title: "Red Hat CloudDot",
    organization: "Red Hat",
    role: "Drupal Developer",
    stack: ["Drupal", "Twig", "JavaScript", "Accessible UI", "Agile delivery"],
    summary:
      "Developed and refined accessible Drupal interfaces for Red Hat's cloud-services web experience, delivering reusable UI, feature enhancements, production fixes, and refactoring ahead of the Support Summit MVP deadline.",
    contribution:
      "Delivered accessible front-end features for Red Hat's cloud-services web experience ahead of a major product deadline.",
    featured: false,
    image: {
      src: "/images/projects/red-hat-clouddot.svg",
      alt: "Red Hat CloudDot platform interface",
      width: 800,
      height: 500,
    },
    caseStudy: {
      overview:
        "Front-end development for Red Hat's cloud-services web experience, delivering accessible Drupal interfaces under an accelerated timeline for the Support Summit MVP.",
      context:
        "Red Hat needed a polished, accessible public-facing web experience for cloud services, with a hard deadline ahead of the Support Summit.",
      challenge:
        "Deliver reusable UI, feature enhancements, production fixes, and refactoring within an Agile cadence while maintaining accessibility and front-end performance.",
      built: [
        "Front-end feature implementation",
        "Drupal UI development",
        "Bug fixes and refactoring",
        "Accessible interface patterns",
        "Performance-oriented front-end work",
      ],
      approach: [
        "Prioritized critical UI paths for MVP scope",
        "Built and refined Twig templates with accessible component states",
        "Iterated with design and engineering teams in Agile sprints",
        "Applied performance profiling during development",
      ],
      accessibility: [
        "WCAG-compliant color and contrast throughout",
        "Keyboard-navigable interactive elements",
        "Semantic HTML structure for assistive technology",
      ],
      outcomes: [
        "Front-end feature implementation for the cloud-services web experience",
        "Accessible Drupal UI development and refactoring",
        "MVP delivered ahead of the Red Hat Support Summit deadline",
      ],
      screenshots: [
        {
          src: "/images/projects/red-hat-clouddot.svg",
          alt: "Red Hat CloudDot dashboard interface",
          caption: "CloudDot platform interface",
        },
      ],
    },
  },
  {
    slug: "bourne-creatives",
    number: "05",
    title: "Bourne Creatives",
    organization: "Bourne Creatives",
    role: "Front-End Developer",
    stack: ["Responsive UI", "HTML", "CSS", "JavaScript"],
    summary:
      "Developed a responsive website for a music and entertainment company specializing in 360-degree brand development.",
    contribution:
      "Developed a responsive website for a music and entertainment company specializing in 360-degree brand development.",
    featured: false,
    image: {
      src: "/images/projects/bourne-creatives.svg",
      alt: "Bourne Creatives website",
      width: 800,
      height: 500,
    },
    caseStudy: {
      headline: "A digital platform for music, entertainment, and artist development",
      overview:
        "Developed a responsive website for Bourne Creatives, a music and entertainment company providing artist development, branding, creative, and marketing services.",
      context:
        "Bourne Creatives needed a public-facing digital presence to present their music, entertainment, and artist development services.",
      challenge:
        "Deliver a responsive website that communicates the company's creative and marketing capabilities across devices.",
      built: [
        "Responsive front-end development",
        "Layout and interface implementation",
        "Content presentation for services and artist development",
      ],
      approach: [
        "Implemented responsive layouts for cross-device presentation",
        "Built interface components for content sections",
        "Collaborated on content structure and visual presentation",
      ],
      accessibility: [
        "Responsive layouts for mobile and desktop",
        "Semantic HTML structure",
        "Accessible navigation patterns",
      ],
      outcomes: [
        "Responsive website for a music and entertainment company",
        "Public digital platform for artist development and creative services",
      ],
      screenshots: [
        {
          src: "/images/projects/bourne-creatives.svg",
          alt: "Bourne Creatives website homepage",
          caption: "Music and entertainment company website",
        },
      ],
    },
  },
  {
    slug: "us-dot-multisite",
    number: "06",
    title: "U.S. DOT Multisite",
    organization: "U.S. Department of Transportation",
    role: "Senior Software Engineer / Drupal",
    stack: ["Drupal", "Twig", "Sass", "JavaScript", "Section 508", "QA"],
    summary:
      "Supported a large federal Drupal multisite spanning more than 15 transportation properties. I developed shared templates and components, reduced redundant front-end implementation, resolved cross-site QA issues, and helped maintain consistent, accessible experiences across distinct agency brands.",
    contribution:
      "Developed reusable front-end architecture for a 15+ site federal Drupal multisite.",
    featured: false,
    image: {
      src: "/images/projects/us-dot.jpg",
      alt: "U.S. Department of Transportation website with highway imagery",
      width: 800,
      height: 500,
    },
    caseStudy: {
      headline: "One front-end system supporting 15+ federal websites",
      overview:
        "Supported a large federal Drupal multisite spanning more than 15 transportation properties through shared front-end architecture, component development, and cross-site maintenance.",
      context:
        "The U.S. Department of Transportation operates numerous sub-agencies and programs, each requiring distinct content while maintaining accessible, consistent experiences. Associated properties include USMMA.edu, FHWA.gov, FRA.dot.gov, and Permits.performance.gov.",
      challenge:
        "Develop shared templates and components that reduce redundant front-end implementation, resolve cross-site QA issues, and maintain accessible experiences across distinct agency brands.",
      built: [
        "Front-end development across a 15+ site Drupal multisite",
        "Site building and configuration",
        "Twig template development",
        "Sass and JavaScript implementation",
        "Reusable component development",
        "Theming across distinct agency properties",
        "Redundancy reduction through shared patterns",
        "Cross-site QA fixes",
        "Section 508 implementation",
      ],
      approach: [
        "Developed base theme patterns with override capabilities per sub-site",
        "Created modular Sass partials for typography, grid, and components",
        "Standardized JavaScript utilities for shared interactive behaviors",
        "Maintained and extended existing templates rather than redesigning all properties",
        "Resolved cross-site QA issues and accessibility defects",
      ],
      accessibility: [
        "Section 508 compliance across shared components",
        "Consistent keyboard navigation patterns",
        "Accessible skip links and landmark structure",
        "Tested form controls and data tables for screen reader compatibility",
      ],
      outcomes: [
        "Front-end development across a 15+ site federal Drupal multisite",
        "Reusable component development reducing redundant implementation",
        "Cross-site QA fixes and Section 508 implementation",
        "Consistent, accessible experiences across distinct agency brands",
      ],
      screenshots: [
        {
          src: "/images/projects/us-dot.jpg",
          alt: "U.S. DOT website homepage",
          caption: "Federal multisite homepage with agency branding",
        },
      ],
    },
  },
  {
    slug: "pcah-gov",
    number: "07",
    title: "PCAH.gov",
    organization: "President's Committee on the Arts and the Humanities",
    role: "Front-End Lead",
    stack: ["Drupal", "Twig", "SCSS", "JavaScript", "Accessibility"],
    summary:
      "Developed the public-facing digital platform for the President's Committee on the Arts and the Humanities, a federal advisory body connecting the White House, cultural agencies, artists, scholars, and philanthropic leaders.",
    contribution:
      "Led front-end development for the public platform of the President's Committee on the Arts and the Humanities.",
    featured: false,
    image: {
      src: "/images/projects/pcah-gov.svg",
      alt: "PCAH.gov public platform homepage",
      width: 800,
      height: 500,
    },
    caseStudy: {
      headline: "A public platform for federal arts and humanities policy",
      overview:
        "Led front-end development for the public-facing digital platform of the President's Committee on the Arts and the Humanities.",
      context:
        "PCAH advised the President and heads of federal cultural agencies on arts and humanities policy. The audience included cultural institutions, artists, scholars, policymakers, and the public.",
      challenge:
        "Build accessible templates, components, and interface behavior for a federal public platform serving diverse cultural and policy audiences.",
      built: [
        "Accessible front-end development for the public platform",
        "Twig templates and reusable components",
        "SCSS architecture for responsive layouts",
        "JavaScript for interface behavior",
        "Accessible navigation and content presentation patterns",
      ],
      approach: [
        "Translated design requirements into Drupal theme templates",
        "Built reusable components for editorial and programmatic content",
        "Applied accessibility standards throughout the public experience",
        "Collaborated with content and back-end teams on implementation",
      ],
      accessibility: [
        "Accessible templates and components for public-facing content",
        "Semantic HTML and heading hierarchy",
        "Keyboard navigation and focus management",
        "Color contrast compliance across UI states",
      ],
      outcomes: [
        "Led front-end development for the PCAH public platform",
        "Accessible templates and components for a federal advisory body",
        "Public digital experience for cultural institutions, artists, and policymakers",
      ],
      screenshots: [
        {
          src: "/images/projects/pcah-gov.svg",
          alt: "PCAH.gov homepage",
          caption: "Public platform for federal arts and humanities policy",
        },
      ],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
