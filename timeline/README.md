# Timeline homepage (the live mynextbib.com front page)

Single-file, no-build homepage: vanilla JS + Tailwind CDN + Lucide + Lenis.
Month-grouped event timeline, warm ember theme, event detail modal, mobile
filter bar, skeleton loading state, SEO meta + JSON-LD.

This is a mirror of the design source of truth. Edit here, then sync back
before deploying (or edit there and re-mirror — just keep them identical).

## Files

- `v2-timeline.html` — the page **source** (lean, ~62KB, skeleton placeholder
  where cards go). This is what you edit.
- `build_prerender.py` — bakes the default view (future events, soonest-first)
  into the HTML between the `#timeline` anchors. Idempotent, safe to re-run.
- `logo.png` — header logo + favicon source.

## Tracking

PostHog snippet lives in `<head>` (pageviews, replays, autocapture) plus
explicit events via `ph()`: `city_filter`, `distance_filter`, `sort_change`,
`event_search` (debounced), `event_view`, `registration_click` (drawer CTA).
GA (`G-30W1KT0CQE`) is also in `<head>`.

## Build + deploy

```bash
# 1. fresh data
scp -i ~/.ssh/mnb_deploy ec2-user@3.25.91.141:~/mynextbib_v3/dist/prd.json /tmp/live_prd.json
# 2. prerender (edits v2-timeline.html in place between anchors)
python3 timeline/build_prerender.py /tmp/live_prd.json timeline/v2-timeline.html
# 3. ship as both timeline.html and index.html (they are the same page)
scp -i ~/.ssh/mnb_deploy timeline/v2-timeline.html ec2-user@3.25.91.141:/tmp/new_index.html
ssh -i ~/.ssh/mnb_deploy ec2-user@3.25.91.141 \
  'cp ~/mynextbib_v3/dist/index.html ~/mynextbib_v3/dist/index.html.bak_$(date +%Y%m%d) \
   && cp /tmp/new_index.html ~/mynextbib_v3/dist/index.html \
   && cp /tmp/new_index.html ~/mynextbib_v3/dist/timeline.html'
```

Rule: this page deploys ONLY through this flow. Never let a React `dist/`
rsync overwrite `index.html` (it serves the old design — incident 2026-09-05).
