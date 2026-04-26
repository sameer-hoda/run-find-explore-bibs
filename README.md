# MyNextBib.com — Frontend

> React + Vite + TypeScript frontend for [mynextbib.com](https://mynextbib.com), India's premier running and sports event discovery platform.

---

## Overview

This is the production frontend for MyNextBib. It consumes processed event data to let users search, filter, and explore running events across India. Built for speed, SEO, and mobile-first experiences.

---

## Features

- **Event Search & Discovery** — Full-text search with instant results.
- **Smart Filters** — Filter by city, distance (5K · 10K · Half Marathon · Marathon), and event type.
- **Event Detail Pages** — Rich pages with registration links, dates, locations, and descriptions.
- **SEO Ready** — Server-side meta-tag injection, sitemap generation, structured data, and prerendered HTML.
- **Responsive Design** — Optimized for mobile, tablet, and desktop.
- **Newsletter Signup** — Email subscription component for event alerts.
- **Social Sharing** — Open Graph images and Twitter cards for every event.

---

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite** — Lightning-fast builds
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible component primitives
- **Lucide React** — Icon library

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Install

```bash
git clone https://github.com/sameer-hoda/run-find-explore-bibs.git
cd run-find-explore-bibs
npm install
```

### Environment

```bash
cp .env.example .env
# Fill in real API keys (Airtable, OpenAI, etc.)
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Static output goes to `dist/`, ready for deployment to AWS EC2 / Nginx.

---

## Project Structure

```
run-find-explore-bibs/
├── public/                 # Static assets (favicons, banners, sitemap)
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route-level pages (Home, Event Detail, FAQ, etc.)
│   ├── services/           # API & data services
│   ├── server/             # Small backend utilities (subscriptions, infographics)
│   ├── App.tsx             # Root router
│   └── main.tsx            # Entry point
├── index.html              # HTML template with injected meta tags
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind theme
└── package.json
```

---

## SEO & Performance

- **Meta Tags** — `inject-meta-tags.cjs` injects dynamic meta tags per route at build time.
- **Sitemap** — `generate-sitemap.cjs` builds a comprehensive `sitemap.xml` for search engines.
- **Prerender** — `src/prerender.tsx` generates static HTML for key routes.
- **Structured Data** — JSON-LD event schemas for Google rich results.

---

## Deployment

This repo is deployed to an AWS EC2 instance running Nginx. The build artifacts in `dist/` are synced via `rsync` from the parent staging repository:

```bash
# Run from the parent staging repo
./deploy_remote.sh
```

See [mynextbib-staging](https://github.com/sameer-hoda/mynextbib-staging) for the full deployment pipeline.

---

## Related Repositories

| Repo | Purpose |
|------|---------|
| [mynextbib-staging](https://github.com/sameer-hoda/mynextbib-staging) | Scrapers, automation, and deployment scripts |

---

## License

Private / All rights reserved. This codebase is proprietary to MyNextBib.
