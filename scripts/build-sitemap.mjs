// Regenerate public/sitemap.xml from src/data/events.js + src/data/accelerators.js
// Source of truth: events.js (events array). Run before deploys.
import fs from 'node:fs';

const SITE = 'https://mumbai-events.sagarjethi.com';
const today = new Date().toISOString().slice(0, 10);

function toSlug(s) {
  return s.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Pull names from per-month event files (post-refactor location)
const eventNames = [];
const eventStartDates = [];
for (const f of ['src/data/events/june-2026.js', 'src/data/events/july-2026.js']) {
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  const re = /\{[^{}]*?\bname:\s*['"]([^'"]+)['"][^{}]*?\bstartDate:\s*['"]([^'"]+)['"][^{}]*?\}/gs;
  let m;
  while ((m = re.exec(txt))) {
    eventNames.push(m[1]);
    eventStartDates.push(m[2]);
  }
}

// Pull accelerator slugs (file may not have an explicit slug field — derive from name)
let acceleratorNames = [];
try {
  const accText = fs.readFileSync('src/data/accelerators.js', 'utf8');
  acceleratorNames = [...accText.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
} catch { /* */ }

const urls = [];
function add(path, opts = {}) {
  urls.push({ loc: `${SITE}${path}`, lastmod: opts.lastmod || today, changefreq: opts.changefreq || 'weekly', priority: opts.priority ?? 0.7 });
}

// Top-level
add('/', { changefreq: 'daily', priority: 1.0 });
add('/events', { changefreq: 'daily', priority: 0.95 });
add('/events/june-2026', { changefreq: 'daily', priority: 0.95 });
 add('/events/july-2026', { changefreq: 'daily', priority: 0.95 });
add('/accelerators', { changefreq: 'weekly', priority: 0.9 });
add('/map', { changefreq: 'weekly', priority: 0.8 });

// SEO landing pages — keyword-rich URLs that target high-intent searches
add('/free-tech-events-mumbai', { changefreq: 'daily', priority: 0.9 });
add('/ai-events-mumbai-2026', { changefreq: 'daily', priority: 0.9 });
add('/conferences-mumbai-2026', { changefreq: 'weekly', priority: 0.85 });
add('/web3-events-mumbai-2026', { changefreq: 'weekly', priority: 0.8 });
add('/tech-events-this-weekend-mumbai', { changefreq: 'daily', priority: 0.85 });
add('/college-fests-mumbai-2026', { changefreq: 'weekly', priority: 0.85 });

// Trust / E-E-A-T pages
add('/about', { changefreq: 'monthly', priority: 0.7 });
add('/editorial', { changefreq: 'monthly', priority: 0.6 });

// Shareable-card studio
add('/cards', { changefreq: 'weekly', priority: 0.85 });

// Per-event
const seen = new Set();
eventNames.forEach((n, i) => {
  const slug = toSlug(n);
  if (seen.has(slug)) return; seen.add(slug);
  const sd = eventStartDates[i];
  add(`/events/${slug}`, { changefreq: 'weekly', priority: 0.75, lastmod: sd || today });
});

// Per-accelerator
const accSeen = new Set();
for (const n of acceleratorNames) {
  const slug = toSlug(n);
  if (accSeen.has(slug)) continue; accSeen.add(slug);
  add(`/accelerators/${slug}`, { changefreq: 'monthly', priority: 0.7 });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Wrote sitemap with ${urls.length} URLs.`);
