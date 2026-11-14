# Sina Hassan — Portfolio

Personal portfolio for Sina Hassan, senior front-end developer. Built with Next.js, TypeScript, Tailwind CSS, React Three Fiber, GSAP, and Lenis. The site is dark and WebGL-led: a point-cloud portrait in the hero, scroll-driven case-study cards, shader image previews on the project index, and a playable voxel planet from Sina's Unity game.

## Local Setup

```bash
cd ~/Sites/sina-hassan-portfolio
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
pnpm start
```

To build while `pnpm dev` is running, point the build at a separate folder so it doesn't clobber the dev server's `.next`:

```bash
NEXT_DIST_DIR=.next-build pnpm build
```

## Routes

| Route | Content |
|-------|---------|
| `/` | Hero, credentials, selected work, Planet Rounds feature, experiments, project index, other contributions, experience, about, contact |
| `/work/[slug]` | Case studies (statically generated from `src/data/projects.ts`) |
| `/lab/planet-rounds` | Full-screen playable planet with a "how it's built" write-up |
| `/resume.pdf` | Résumé download |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout, fonts, SEO, structured data, smooth scroll
│   ├── page.tsx              # Home page
│   ├── globals.css           # Tokens, utilities, motion keyframes, reduced-motion rules
│   ├── lab/planet-rounds/    # Playable demo page
│   ├── work/[slug]/          # Case study routes
│   ├── not-found.tsx, robots.ts, sitemap.ts
├── components/
│   ├── hero/                 # HeroCanvas (loader + fallback), HeadField (point-cloud shader)
│   ├── planet/               # PlanetDemo (loader + fallback), PlanetExperience (R3F scene)
│   ├── work/                 # HoverPreview (WebGL image plane for the project index)
│   ├── motion/               # SmoothScroll (Lenis + GSAP ticker), Reveal (scroll-in)
│   ├── sections/             # Home page sections
│   ├── layout/               # Header, Footer, SkipLink
│   ├── case-study/           # CaseStudyLayout template
│   └── ui/                   # Icons, SectionIntro, ProjectPlaceholder
├── data/                     # Typed content (site, projects, experience, skills, experiments, nav)
└── lib/
    ├── planet/               # .pvm decoder, chunk mesher, mesher Web Worker
    ├── points.ts             # Hero point-cloud decoder
    ├── webgl.ts              # WebGL2 detection hook
    ├── metadata.ts           # createPageMetadata / createProjectMetadata
    └── structured-data.ts    # JSON-LD
public/
├── lab/planet/*.pvm          # Baked Planet Rounds maps
├── models/hero-portrait-rgb.points.bin     # Baked hero point cloud (914 KB)
├── models/hero-portrait-detail.points.bin  # Dense hover layer (2.2 MB, hover devices only)
├── images/og-image.jpg       # 1200 × 630 share image (captured from the hero)
└── resume.pdf
assets/
└── hero-portrait.glb         # 77 MB source model for the hero (gitignored, not served)
scripts/
├── bake-planet.mjs           # Game .vmap → web .pvm
└── bake-head.mjs             # GLB → point cloud
```

## 3D Assets

Both 3D features load small pre-baked binaries instead of raw source files.

**Planet maps.** The game stores maps in `~/Projects/planet-rounds/Assets/StreamingAssets/Maps/*.vmap`. `bake-planet.mjs` downsamples them to a 170³ grid, keeps the game's palette and run-length encoding, and deflates the result (147 KB–1.5 MB per map). In the browser, a Web Worker inflates the file with `DecompressionStream`, meshes visible faces with per-vertex ambient occlusion in 24³ chunks, and re-meshes only the touched chunks when a crater is carved.

```bash
node scripts/bake-planet.mjs ~/Projects/planet-rounds/Assets/StreamingAssets/Maps/oasis.vmap public/lab/planet/oasis.pvm 170
```

**Hero portrait.** `bake-head.mjs` samples 72,000 points over the surface of `assets/hero-portrait.glb`, storing quantized positions, normals, brightness, and texture color (77 MB → 914 KB). The hero renders the points in monochrome and reveals their color around the cursor.

On devices that can hover, a second, denser bake (180,000 points, 2.2 MB) loads after the intro. It's drawn opaque and depth-tested only under the cursor, so that patch looks like the solid textured model. Touch devices never download it.

```bash
node scripts/bake-head.mjs assets/hero-portrait.glb public/models/hero-portrait-detail.points.bin 180000 4 0.42
``` The model is a head-and-shoulders bust, so sampling is 2.5× denser above 42% of its height to keep the face detailed. The source GLB is too large for git; keep a copy outside the repo.

```bash
node scripts/bake-head.mjs assets/hero-portrait.glb public/models/hero-portrait-rgb.points.bin 72000 2.5 0.42
```

The script expects a single mesh with Y up and the face toward +Z.

Files under `/lab` and `/models` are served with a one-year immutable cache header (`next.config.js`), so rename the output if you re-bake.

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `void` | `#07080A` | Page background |
| `void-raised` | `#0E1014` | Panels, cards |
| `paper` | `#EDEAE3` | Primary text |
| `paper-muted` | 64% paper (≈7:1) | Body copy |
| `paper-faint` | 52% paper (≈4.7:1) | Labels, metadata |
| `signal` | `#4DA3FF` | Accent, links, point-cloud rim light |
| `ember` | `#FF7A2F` | Planet Rounds |

**Typography:** Instrument Sans for headlines and body, Instrument Serif italic for accent words, IBM Plex Mono for labels and HUD text, all via `next/font`. Display sizes use `clamp()` (`text-mega`, `text-hero`).

## Content Editing

All content lives in typed data files under `src/data/`:

- **Projects:** `projects.ts` — projects, case studies, stack tags. `featured: true` puts a project in the stacked "Selected work" cards.
- **Experience:** `experience.ts`
- **Skills:** `skills.ts`
- **Experiments:** `experiments.ts` — an `href` makes a card a live link
- **Site copy:** `site.ts` — hero, about, contact, SEO config
- **Navigation:** `navigation.ts`

## Project Screenshots

Project images live in `public/images/projects/` as 1440×900 JPEGs. Cards and case studies crop to 16:10 and 16:9. PCAH.gov is offline; its screenshot comes from a January 2025 Wayback Machine capture.

## Deployment to Vercel

1. Push the repository to GitHub
2. Import it at [vercel.com](https://vercel.com); Next.js is detected automatically
3. Confirm `siteConfig.url` in `src/data/site.ts` matches the production domain

## Accessibility & Performance

- **Semantic structure:** one h1 per page, ordered headings, landmarks, skip link, and `main` focusable as the skip target.
- **Decorative WebGL is hidden:** the hero, hover preview, and marquee are `aria-hidden`; the marquee has an `sr-only` list equivalent. Decorative index numbers are hidden from screen readers.
- **The planet is operable:** "Blast a crater" and "Restore planet" are real buttons, the lab page switches maps with a labelled native select, and crater and loading changes are announced through a polite live region.
- **Reduced motion:** Lenis is off, scroll reveals and the headline intro are skipped, the marquee becomes static wrapped text, the hero renders on demand without the assemble intro, and the planet stops auto-rotating and shaking. GSAP effects are registered through `gsap.matchMedia` so they never run under reduced motion.
- **Fallbacks:** without WebGL2 the hero shows a static glow, the index shows normal thumbnails, and the planet shows a text explanation. Hover previews only run on fine-pointer devices.
- **Contrast:** all text tokens meet WCAG AA on `void`.
- **Performance:** 3D scenes are dynamically imported with SSR off; the hero and planet stop rendering when scrolled off screen; the planet uses `PerformanceMonitor` to drop DPR on slow devices; meshing runs in a worker with transferable buffers. Home page first-load JS is about 164 KB, and every route is statically generated.
- **SEO:** canonical URLs, Open Graph and Twitter cards, sitemap, robots, and JSON-LD for Person, WebSite, and CreativeWork.

## Missing Assets & Content

- [ ] Planet Rounds gameplay capture (video or stills) for the lab page
- [ ] Actual résumé PDF (`public/resume.pdf`)
- [ ] Confirm contact email and production URL in `src/data/site.ts`
- [ ] Links for the remaining experiments (Generative Forest, Eastern Bloc Rally, etc.)
