# mynextbib.com — frontend

> India's running-event calendar — marathons, half marathons, 10Ks and 5Ks across 100+ cities. Live at [mynextbib.com](https://mynextbib.com).

## Two frontends, one site — read this first

| Surface | Source | Deploys to |
|---|---|---|
| **Homepage** (what visitors see) | `timeline/v2-timeline.html` — single-file vanilla timeline, no build step | `dist/index.html` **and** `dist/timeline.html` via `timeline/README.md` flow |
| **Event pages + SPA fallback** | `src/` — React + Vite + TypeScript app | `dist/event/*` + `dist/assets/*` via `npm run build` + selective rsync |

These two share the domain but ship independently. The golden rule, learned the hard way (2026-09-05): **never rsync a React `dist/` over `index.html`** — it serves the old design. React builds ship event pages and assets only.

## The homepage

Month-grouped event timeline: sticky month rail (desktop) / chips (mobile), city + distance + date pill filters, debounced search with ⌘K, custom sort, event detail modal with registration CTA, skeleton loading state, Lenis smooth scroll, warm ember theme. Cards are prerendered into the HTML at deploy time, so crawlers and no-JS visitors get full content and first paint is instant.

Tracking is built in: PostHog snippet + explicit events (`city_filter`, `distance_filter`, `sort_change`, `event_search`, `event_view`, `registration_click`) plus GA. See `timeline/README.md` for the deploy flow.

## The React app

Event detail pages (`/event/<slug>/`) with SEO meta injection, keyword titles, Event JSON-LD, canonicals — plus FAQ, wizard, results and must-do routes. Custom PostHog events live in `src/lib/analytics.ts` (`registration_click`, `city_filter`, `distance_filter`, `newsletter_signup`, `wizard_complete`).

Data quirk worth knowing: `src/prerender.tsx` is browser-bundled, so it can't read files — `vite.config.ts` snapshots `public/prd.txt` to `src/prerender-data.json` (gitignored) at build time, and `HomePage` seeds its initial state from it. If a rebuild ever ships a ~12KB shell `index.html`, that seed broke — don't deploy.

```bash
git clone https://github.com/sameer-hoda/run-find-explore-bibs.git
cd run-find-explore-bibs
npm install          # needs vite-plugin-static-copy@2 (Vite 5); v3 requires Vite 6+
cp .env.example .env # if present
npm run dev          # http://localhost:8080 (API proxied to :3001)
npm run build        # sitemap → vite → meta inject → dist/
npx tsc --noEmit     # typecheck
```

## Project structure

```text
run-find-explore-bibs/
├── timeline/               # LIVE HOMEPAGE source (vanilla, no build)
│   ├── v2-timeline.html    # edit this
│   ├── build_prerender.py  # bakes event cards into the HTML
│   └── README.md           # deploy flow
├── public/                 # static assets + prd.txt (event data snapshot)
├── src/
│   ├── components/         # EventCard, EventDetails, City/DistanceSelector, …
│   ├── pages/              # Home, EventDetail, FAQ, Wizard, Results
│   ├── services/           # eventService (loads /prd.txt), slugify
│   ├── lib/analytics.ts    # PostHog trackEvent() wrapper
│   └── prerender.tsx       # SSR entry (reads prerender-data.json snapshot)
├── index.html              # template (PostHog snippet lives here)
├── generate-sitemap.cjs    # future events only, trailing-slash URLs
└── inject-meta-tags.cjs    # per-event title/description/canonical/OG
```

## SEO essentials

- Sitemap = static routes + future events only, `lastmod` = build day.
- Past event pages stay `200` but carry `X-Robots-Tag: noindex, follow` (Express middleware on the server, not in this repo).
- Canonicals and sitemap URLs use trailing slashes to match served pages.

## Deployment

Homepage → `timeline/README.md` flow. Event pages/assets → build, then rsync `dist/` **excluding** `index.html`, `prd.json`, `prd.txt`:

```bash
rsync -av --exclude index.html --exclude prd.json --exclude prd.txt \
  -e "ssh -i ~/.ssh/mnb_deploy" dist/ ec2-user@3.25.91.141:~/mynextbib_v3/dist/
```

Server runbook, dashboards, credentials map: `MAINTENANCE.md` in the local ops folder (not in this repo).

## Related

| Repo | Purpose |
|---|---|
| [mynextbib-staging](https://github.com/sameer-hoda/mynextbib-staging) | Aggregation pipeline powering the event data |
