# Sina Hassan — Portfolio

Production-ready personal portfolio for Sina Hassan, senior front-end developer. Built with Next.js, TypeScript, and Tailwind CSS following an editorial, case-study archive aesthetic.

## Local Setup

```bash
cd ~/Sites/sina-portfolio
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, SEO, structured data
│   ├── page.tsx            # Home page
│   ├── globals.css         # Design tokens, utilities, grain texture
│   ├── not-found.tsx       # 404 page
│   ├── robots.ts           # robots.txt
│   ├── sitemap.ts          # XML sitemap
│   └── work/[slug]/        # Case study routes
├── components/
│   ├── layout/             # Header, Footer, SkipLink
│   ├── sections/           # Hero, CredibilityStrip, SelectedWork, etc.
│   ├── ui/                 # ProjectCard, ButtonLink, ThemeToggle, etc.
│   └── case-study/         # CaseStudyLayout template
├── data/
│   ├── site.ts             # Hero, about, contact, site config
│   ├── navigation.ts       # Header nav items
│   ├── projects.ts         # All projects and case study content
│   ├── experience.ts       # Work history timeline
│   ├── skills.ts           # Technical capabilities
│   └── experiments.ts      # Interactive experiments
├── lib/
│   ├── metadata.ts         # SEO and Open Graph helpers
│   ├── structured-data.ts  # JSON-LD for Person and projects
│   └── utils.ts            # cn() utility
└── types/
    └── index.ts            # Shared TypeScript interfaces
public/
├── images/projects/        # Project screenshots (replace placeholders)
├── images/og-image.svg     # Open Graph image
└── resume.pdf              # Résumé download (replace placeholder)
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `cream` | `#F4F1EA` | Page background |
| `ink` | `#151515` | Primary text |
| `ink-muted` | `#4A4A4A` | Body copy |
| `accent` | `#0A78B5` | Links, labels, CTAs, wireframe |
| `accent-hover` | `#086090` | Button hover state |

### Typography

- **Headlines:** Inter (via `next/font`) — large grotesk sans-serif with tight tracking
- **Body:** Inter — readable sans-serif at 16px base
- **Labels/Tags:** JetBrains Mono — project numbers, tech tags, dates, section labels

Display sizes use fluid `clamp()` scaling via Tailwind custom font sizes (`text-display-xl`, `text-display-lg`, `text-display-md`).

## Content Editing

All content lives in typed data files under `src/data/`. Update these without touching components:

- **Projects:** `src/data/projects.ts` — add/edit projects, case study content, stack tags
- **Experience:** `src/data/experience.ts` — work history entries
- **Skills:** `src/data/skills.ts` — technical capability categories
- **Experiments:** `src/data/experiments.ts` — creative lab projects
- **Site copy:** `src/data/site.ts` — hero text, about bio, contact info
- **Navigation:** `src/data/navigation.ts` — header links

Featured projects (shown in the 3-card grid) are controlled by the `featured: true` flag in `projects.ts`.

## Screenshot Replacement

Place project screenshots in `public/images/projects/` using these filenames and dimensions:

| File | Dimensions | Project |
|------|-----------|---------|
| `imls-2025.png` or `.webp` | 800 × 500 | IMLS 2025 Redesign |
| `imls-2025-map.png` | 800 × 500 | IMLS grants map |
| `us-dot.png` | 800 × 500 | U.S. DOT Multisite |
| `red-hat-clouddot.png` | 800 × 500 | Red Hat CloudDot |
| `stanley-bdk.png` | 800 × 500 | Stanley Black & Decker |
| `vega-studio.png` | 800 × 500 | Vega Studio |

After adding real images, update the `src` paths in `src/data/projects.ts` from `.svg` to your file extension. The `ProjectPlaceholder` component automatically falls back to a styled placeholder if an image fails to load.

Case study pages use 16:9 hero screenshots and optional additional images defined in each project's `caseStudy.screenshots` array.

## Résumé Replacement

Replace `public/resume.pdf` with your actual résumé PDF. The download link appears in:

- Hero secondary CTA
- Header navigation ("Résumé")
- Contact section
- Footer

## Deployment to Vercel

1. Push the repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js — no special configuration needed
4. Update `siteConfig.url` in `src/data/site.ts` to your production domain
5. Replace `public/images/og-image.svg` with a 1200 × 630 PNG for social sharing

```bash
# Or deploy via CLI
npx vercel
```

## Accessibility & Performance Decisions

- **Semantic HTML** with correct heading hierarchy (single h1 on home, h2 for sections)
- **Skip-to-content link** for keyboard users
- **Visible focus states** on all interactive elements (`:focus-visible`)
- **WCAG AA contrast** across light and dark modes
- **Reduced motion support** — hero canvas animation, scroll behavior, and CSS transitions respect `prefers-reduced-motion`
- **Decorative hero visual** hidden from assistive technology (`aria-hidden`, `role="presentation"`)
- **Lazy-loaded hero canvas** via dynamic import with SSR disabled
- **Static generation** for all pages including case studies
- **Optimized fonts** via `next/font` with `display: swap`
- **Minimal layout shift** — placeholder dimensions set on all images
- **JSON-LD structured data** for Person, WebSite, and CreativeWork (projects)
- **Optional dark mode** with system preference detection and manual toggle

## Missing Assets & Content

The following placeholders should be replaced before launch:

- [ ] Real project screenshots (currently SVG placeholders)
- [ ] Actual résumé PDF (`public/resume.pdf`)
- [ ] Open Graph image at 1200 × 630 (`public/images/og-image.svg`)
- [ ] Confirm contact email (`hello@sinahassan.com` in `src/data/site.ts`)
- [ ] Confirm production URL (`https://sinahassan.com` in `src/data/site.ts`)
- [ ] Experiment project links (currently display-only cards)
