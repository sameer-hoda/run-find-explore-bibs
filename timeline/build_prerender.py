#!/usr/bin/env python3
"""Prerender the default timeline view into variants/v2-timeline.html.

Reads the enriched PRD dict, applies the same default state as the page JS
(future-only, soonest-first, no filters), and replaces the #timeline skeleton
with identical static markup (minus reveal animation classes, so content is
visible with zero JS). Safe to re-run on every data push.

Usage: python3 work/build_prerender.py [prd.json] [v2-timeline.html]
"""
import html
import json
import sys
from collections import OrderedDict
from datetime import date

DIST_KEYS = ["1K","2K","3K","5K","10K","15K","21.1K","25K","35K","42.2K","50K","100K","other"]
MS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
MF = ["January","February","March","April","May","June","July","August","September","October","November","December"]

def esc(s):
    return html.escape(s or "", quote=True)

def is_fallback(u):
    return (not u) or ("mynextbib.com" in u)

def fmt(iso, today):
    y, m, d = int(iso[0:4]), int(iso[5:7]), int(iso[8:10])
    dd = "%02d" % d
    dow = date(y, m, d).strftime("%a")
    diff = (date(y, m, d) - today).days
    return dd, MS[m - 1], dow, diff, (0 <= diff <= 14)

def row(e, today):
    dd, mon, dow, diff, urgent = fmt(e["event_date"], today)
    loc = e.get("location") or {}
    city = loc.get("city") or "Unknown"
    venue = loc.get("venue") or ""
    fb = is_fallback(e.get("event_url")) or e.get("url_status") in ("guessed", "broken")
    dists = [k for k in DIST_KEYS if (e.get("distances") or {}).get(k)]
    pills = "".join(
        '<span class="dpill dpill-hot">%s</span>' % ("Other" if k == "other" else k)
        for k in dists[:4]
    )
    more = '<span class="dpill dpill-ghost">+%d</span>' % (len(dists) - 4) if len(dists) > 4 else ""
    virt = ((e.get("event_type") or "Physical") == "Virtual" and
            '<span class="dpill dpill-dim"><i data-lucide="video" class="w-2.5 h-2.5 mr-0.5"></i>Virtual</span>' or "")
    price = ""
    pr = e.get("price") or {}
    if pr.get("raw"):
        price = esc(pr["raw"].split(" - ")[0])
    elif pr.get("min"):
        price = "₹%s" % pr["min"]
    closing = ""
    rc = e.get("registration_closes")
    if rc:
        try:
            y, m, d = int(rc[0:4]), int(rc[5:7]), int(rc[8:10])
            dd2 = (date(y, m, d) - today).days
            if 0 <= dd2 <= 14:
                closing = ('<span class="inline-flex items-center gap-1 text-[10px] font-medium '
                           'text-accentdeep bg-accentsoft border border-accentline rounded-full px-1.5 h-[18px] shrink-0">'
                           '<i data-lucide="clock" class="w-2.5 h-2.5"></i>%s</span>' % rc[5:].replace("-", "/"))
        except (ValueError, IndexError):
            pass
    dot = '<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"></span>' if urgent else ""
    cta = ('<span class="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 shrink-0 self-center">TBA</span>'
           if fb else
           '<i data-lucide="chevron-right" class="w-4 h-4 text-accentdeep shrink-0 self-center"></i>')
    when = ("in %dd" % diff) if diff >= 0 else ("%dd ago" % abs(diff))
    return (
        '<article title="%s" class="card group cursor-pointer bg-white border border-zinc-200 rounded-[12px] p-2 sm:p-2.5 flex gap-2.5 items-start hover:border-accentline hover:shadow-lift">'
        '<div class="relative shrink-0 w-[38px] sm:w-[42px] h-[46px] sm:h-[50px] rounded-[9px] border border-accentline/70 bg-accentsoft grid place-items-center">'
        '<div class="text-center leading-none"><div class="font-mono text-[14px] sm:text-[15px] font-semibold">%s</div>'
        '<div class="text-[9px] font-semibold tracking-widest text-accentdeep/70 mt-[1px]">%s</div></div>%s</div>'
        '<div class="flex-1 min-w-0 py-px">'
        '<div class="flex items-center gap-1.5 text-[11px] text-zinc-500 min-w-0">'
        '<i data-lucide="map-pin" class="w-3 h-3 shrink-0"></i>'
        '<span class="truncate font-medium flex-1 min-w-0">%s</span>'
        '<span class="hidden md:inline text-[10px] uppercase tracking-wide text-zinc-400 font-medium whitespace-nowrap">%s · %s</span>'
        '%s</div>'
        '<h3 class="truncate text-[13.5px] sm:text-[14px] font-semibold leading-[1.3] tracking-tight mt-px">%s</h3>'
        '<div class="flex items-center gap-1 mt-1 min-w-0">%s%s%s%s</div>'
        '</div>%s</article>'
    ) % (esc(e.get("event_name")), dd, mon, dot, esc(city) + (venue and " · " + esc(venue) or ""),
         dow, when, closing, esc(e.get("event_name")), virt, pills, more,
         (price and '<span class="ml-auto pl-2 text-[11px] font-semibold text-zinc-700 whitespace-nowrap shrink-0">%s</span>' % price or ""), cta)

def month_label(key):
    y, m = int(key[0:4]), int(key[5:7])
    return "%s %d" % (MF[m - 1], y)

def main():
    prd_path = sys.argv[1] if len(sys.argv) > 1 else "/Users/sameerhoda/Projects/mynextbib/sandbox/output/prd_clean.json"
    html_path = sys.argv[2] if len(sys.argv) > 2 else "/Users/sameerhoda/Projects/mynextbib/agents/agent-03-frontend/variants/v2-timeline.html"
    d = json.load(open(prd_path))
    vals = list(d.values())
    today = date.today()
    today_iso = today.isoformat()
    events = sorted([e for e in vals if e.get("event_date", "") >= today_iso],
                    key=lambda e: e["event_date"])
    groups = OrderedDict()
    for e in events:
        groups.setdefault(e["event_date"][:7], []).append(e)
    parts = []
    for k, items in groups.items():
        rows = "".join(
            '<div class="relative"><span class="absolute -left-[38px] sm:-left-[48px] md:-left-[52px] top-6 sm:top-7 w-[13px] h-[13px] rounded-full bg-paper border-[2.5px] border-accentline"></span>%s</div>'
            % row(e, today) for e in items
        )
        parts.append(
            '<section id="m-%s" data-month="%s" class="month-sec" style="scroll-margin-top:var(--mTop,190px)">'
            '<div class="sticky z-10 -mx-1 px-1 py-2 bg-paper/90 backdrop-blur-[8px]" style="top:var(--mTop,190px)">'
            '<div class="flex items-baseline gap-2.5">'
            '<span class="w-2 h-2 rounded-[3px] bg-accent shrink-0 self-center"></span>'
            '<h2 class="text-[13px] font-semibold tracking-tight whitespace-nowrap">%s</h2>'
            '<span class="text-[11px] font-medium text-zinc-400">%d run%s</span>'
            '<div class="flex-1 h-px bg-accentline/70"></div></div></div>'
            '<div class="relative spine mt-1 space-y-2 sm:space-y-2.5 pl-[56px] sm:pl-[68px] md:pl-[72px]">%s</div></section>'
            % (k, k, month_label(k), len(items), "s" if len(items) > 1 else "", rows)
        )
    s = open(html_path).read()
    start_anchor = '<div id="timeline" class="space-y-8 sm:space-y-10">\n'
    end_anchor = '\n    </div>\n    <div id="empty"'
    si = s.find(start_anchor)
    ei = s.find(end_anchor)
    if si < 0 or ei < 0 or ei < si:
        print("ANCHORS NOT FOUND — aborting, file untouched")
        sys.exit(1)
    s = s[:si + len(start_anchor)] + "\n".join(parts) + s[ei:]
    # static result count for no-JS/crawlers
    import re
    s2, n = re.subn(r'(<span id="activeCount"[^>]*>)[^<]*(</span>)',
                    r"\g<1>%d of %d\g<2>" % (len(events), len(events)), s, count=1)
    if n:
        s = s2
    open(html_path, "w").write(s)
    import gzip
    raw = len("\n".join(parts).encode())
    print("prerendered %d events in %d months | html +%dB raw (~%dB gzip) | %s" %
          (len(events), len(groups), raw, len(gzip.compress("\n".join(parts).encode())), html_path))

if __name__ == "__main__":
    main()
