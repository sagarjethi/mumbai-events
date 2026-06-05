# Mumbai Tech Events — build notes

This app was cloned from the Bangalore events directory and rebranded to **Mumbai Tech Events**, focused on **June 2026**. Hackathon-specific pages were removed.

## ✅ Real & verified (June 2026)

`src/data/events/june-2026.js` — **16 link-verified Mumbai tech events** for June 2026.
Every event was cross-checked by opening its source page (Linux Foundation, Lu.ma, Meetup, eChai, Eventbrite, allevents.in). Highlights:

- **Open Source Week Mumbai (Jun 14–19, Jio World Convention Centre, BKC)** — MCP Dev Summit, OpenSearchCon India, Open Source Summit India, KubeCon + CloudNativeCon India.
- Microsoft Build //localhost: Mumbai (Jun 13 & 20), Data & Gen AI Summit (Jun 11), IBM Agentic AI Summit (Jun 17–18, virtual), JS Mumbai (Jun 6), eChai startup meetups, weekly AI co-working + tech mixer, Bharat MSME Expo, EDGE Masterclass.

Dropped during verification (not added): invite-only Citi conference, undated World AI Show, two "Rapid Skill Up" spam webinars, two undated meetups, a duplicate MS Build listing.

SEO surfaces regenerated from this data: `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt`, `public/events.md`, plus `index.html` JSON-LD/meta and `src/data/seo-collections.js`.

## ⚠️ Placeholder — replace before relying on it

These files still hold **Bangalore-derived placeholder content** and are tagged at the top with `TODO(mumbai):`

- `src/data/social.js`, `src/data/social/buzz.js` — social-buzz feed (homepage + /social) still references Bangalore April events.
- `src/data/accelerators.js` — accelerator listings.
- `src/data/college-fests.js` — college fests (Bangalore colleges).
- `src/data/platforms.js` — platform links.

## 🎨 Assets to update later (per request, logo handled later)

- Nav logo is a temporary **text wordmark** ("Mumbai Tech Events") — `src/components/Navigation.jsx`.
- `public/blrevents.png` (favicon/apple-touch icon, referenced in `index.html`) and `public/og-image.svg`/`og-image.png` still need a Mumbai redesign.

## Regenerating SEO files

```bash
node scripts/build-sitemap.mjs   # public/sitemap.xml from june-2026.js + accelerators
node scripts/build-llms.mjs      # public/llms.txt, llms-full.txt, events.md
```

## Dev / build

```bash
npm install
npm run dev          # local dev
npm run build:fast   # vite build only (skips network resource-verify + Playwright prerender)
npm run build        # full build (verify:resources + prerender) — needs network + Playwright
```
