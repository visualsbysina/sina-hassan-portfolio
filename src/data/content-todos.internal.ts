/**
 * INTERNAL — NOT FOR PUBLIC DISPLAY
 *
 * Unresolved content claims requiring confirmation from Sina
 * or additional repository evidence before strengthening language.
 */

export const contentTodos = [
  {
    id: "red-hat-scope",
    topic: "Red Hat CloudDot scope",
    note:
      "Confirm whether work was limited to the public cloud-services web experience versus the authenticated Hybrid Cloud Console. Current copy describes the public Drupal UI only.",
  },
  {
    id: "bourne-stack",
    topic: "Bourne Creatives stack and contribution",
    note:
      "Inspect the relevant repository to confirm framework, CMS, exact role, and which sections/interactions Sina implemented before expanding the case study.",
  },
  {
    id: "vega-features",
    topic: "Vega Studio feature attribution",
    note:
      "Confirm which publicly visible features (theme selector, media player, VegaTV, modular windows, Three.js visuals) were personally implemented versus delivered as part of the overall site.",
  },
  {
    id: "dot-properties",
    topic: "DOT multisite properties directly touched",
    note:
      "Confirm which of the 15+ properties Sina worked on directly. Associated examples include USMMA.edu, FHWA.gov, FRA.dot.gov, and Permits.performance.gov.",
  },
  {
    id: "screenshots",
    topic: "Screenshot freshness and live links",
    note:
      "Project cards use real screenshots and case studies link out via Visit Site. PCAH.gov is defunct; Visit Site and the screenshot both use the Jan 2025 Wayback capture. Re-capture if any of the live sites redesign.",
  },
  {
    id: "pcah-evidence",
    topic: "PCAH.gov contribution evidence",
    note:
      "Confirm front-end lead scope, templates, and components implemented for PCAH.gov before adding more specific implementation claims.",
  },
] as const;
