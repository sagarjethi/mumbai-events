// Per-route static HTML shells, generated without a browser.
//
// Vercel's build sandbox has no Chromium, so scripts/prerender.mjs skips
// itself there and every URL would otherwise ship the homepage index.html
// (homepage title, description, canonical and JSON-LD) to crawlers. This
// script gives each route its own shell: correct <title>, meta description,
// canonical, Open Graph / Twitter tags, route-specific JSON-LD and a plain
// HTML summary inside #root that React replaces on hydration. When the full
// prerender can run (locally), it overwrites these files with rendered HTML.
//
// Runs after `vite build`, before `prerender.mjs`. Node only.

import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const SITE = 'https://mumbai-events.sagarjethi.com';
const DIST = path.resolve('dist');
const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

// Load the app's data modules through Vite so extensionless imports and
// lucide-react resolve exactly as they do in the app.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const data = await vite.ssrLoadModule('/src/data/index.js');
const { toSlug } = await vite.ssrLoadModule('/src/utils/slug.js');
await vite.close();

const { events, SERIES, SIDE_TYPES, ACCESS, COLLECTIONS, CATEGORIES } = data;

// ---------- helpers ----------
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isFree = (e) => /\bfree\b/i.test(e.cost || '');
const abs = (u) => (u && u.startsWith('/') ? `${SITE}${u}` : u);

function humanRange(startIso, endIso) {
  const f = (iso, opts) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { timeZone: 'UTC', ...opts });
  if (startIso === endIso) return f(startIso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return `${f(startIso, { day: 'numeric', month: 'long' })} to ${f(endIso, { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function eventJsonLd(e) {
  const url = `${SITE}/events/${toSlug(e.name)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: e.venue,
      address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
      ...(e.lat && e.lng ? { geo: { '@type': 'GeoCoordinates', latitude: e.lat, longitude: e.lng } } : {}),
    },
    image: abs(e.image) || `${SITE}/og-image.png`,
    organizer: { '@type': 'Organization', name: e.host || e.tags?.[0] || 'Mumbai Tech Events' },
    offers: isFree(e)
      ? { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: e.link }
      : { '@type': 'Offer', url: e.link, availability: 'https://schema.org/InStock' },
    ...(isFree(e) ? { isAccessibleForFree: true } : {}),
    url,
    ...(e.website ? { sameAs: e.website } : {}),
    ...(e.series && SERIES[e.series] ? { superEvent: { '@type': 'Event', name: SERIES[e.series].name, url: `${SITE}/${SERIES[e.series].slug}` } } : {}),
  };
}

function itemList(name, description, list) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: list.length,
    itemListElement: list.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/events/${toSlug(e.name)}`, name: e.name })),
  };
}

function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${url}` })),
  };
}

function eventListHtml(list) {
  return `<ul>${list.map((e) => `<li><a href="/events/${toSlug(e.name)}">${esc(e.name)}</a> - ${esc(e.date)}, ${esc(e.venue)}${e.cost ? ` - ${esc(e.cost)}` : ''}</li>`).join('')}</ul>`;
}

// Build one shell from the homepage template.
function renderShell({ title, description, canonical, image, jsonLd, body, ogType = 'website' }) {
  let html = shell;
  // Strip homepage-only head pieces: JSON-LD blocks, noscript, keywords, and
  // any existing title/description/og/twitter/canonical tags.
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/g, '');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="(title|description|keywords|twitter:[^"]+)" content="[^"]*"\s*\/>\s*/g, '');
  html = html.replace(/<meta property="og:[^"]+" content="[^"]*"\s*\/>\s*/g, '');
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>\s*/g, '');
  const img = image || `${SITE}/og-image.png`;
  const head = [
    `<meta name="title" content="${esc(title)}" />`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="Mumbai Tech Events" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    ...jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`),
  ].join('\n    ');
  html = html.replace('</head>', `    ${head}\n  </head>`);
  // Static body content inside #root. React's createRoot().render() replaces it.
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root"><main class="prerender-shell" style="max-width:72rem;margin:0 auto;padding:1.5rem 1rem;font-family:Inter,system-ui,sans-serif">${body}</main></div>`);
  return html;
}

function write(route, html) {
  const dir = route === '/' ? DIST : path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

let count = 0;

// ---------- event detail pages ----------
for (const e of events) {
  const slug = toSlug(e.name);
  const route = `/events/${slug}`;
  const series = e.series ? SERIES[e.series] : null;
  const title = `${e.name} - ${e.date} 2026, Mumbai | Mumbai Tech Events`;
  const description = `${e.description} ${humanRange(e.startDate, e.endDate)} at ${e.venue}. ${e.cost}.`.slice(0, 300);
  const body = `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/events">Events</a>${series ? ` / <a href="/${series.slug}">${esc(series.weekLabel)}</a>` : ''}</nav>
    <h1>${esc(e.name)}</h1>
    <p><strong>${esc(humanRange(e.startDate, e.endDate))}</strong>${e.time ? ` · ${esc(e.time)}` : ''}</p>
    <p>${esc(e.venue)}, Mumbai</p>
    ${e.host ? `<p>Hosted by ${esc(e.host)}</p>` : ''}
    <p>${esc(e.cost)}${e.access && ACCESS[e.access] ? ` · ${esc(ACCESS[e.access].label)}` : ''}</p>
    ${e.image ? `<img src="${esc(e.image)}" alt="${esc(e.name)} cover" width="800" height="450" style="max-width:100%;height:auto" />` : ''}
    <h2>About this event</h2>
    <p>${esc(e.description)}</p>
    ${series ? `<p>Part of <a href="/${series.slug}">${esc(series.weekLabel)}</a>${e.sideType && SIDE_TYPES[e.sideType] ? ` (${esc(SIDE_TYPES[e.sideType].label)})` : ''}.</p>` : ''}
    <p><a href="${esc(e.link)}" rel="nofollow noopener">Register on the official page</a></p>
    <p>Topics: ${(e.tags || []).map(esc).join(', ')}</p>`;
  write(route, renderShell({
    title, description, canonical: `${SITE}${route}`, image: abs(e.image), ogType: 'article',
    jsonLd: [eventJsonLd(e), breadcrumb([['Home', '/'], ['Events', '/events'], [e.name, route]])],
    body,
  }));
  count++;
}

// ---------- series hubs ----------
for (const s of Object.values(SERIES)) {
  const route = `/${s.slug}`;
  const headline = events.find((e) => e.series === s.id && e.seriesRole === 'headline');
  const sides = events.filter((e) => e.series === s.id && e.seriesRole === 'side').sort((a, b) => a.startDate.localeCompare(b.startDate) || (a.startTime || '').localeCompare(b.startTime || ''));
  const programmes = events.filter((e) => e.series === s.id && e.seriesRole === 'programme');
  const title = `${s.weekLabel} 2026: ${s.name} + every side event | Mumbai Tech Events`;
  const description = `${s.name} (${humanRange(s.coreStart, s.coreEnd)}, ${s.venue}) plus ${sides.length} side events: official GFF dinners, sundowners, night fests and community meetups, by day, type and access.`;
  const byDay = new Map();
  for (const e of sides) { if (!byDay.has(e.startDate)) byDay.set(e.startDate, []); byDay.get(e.startDate).push(e); }
  const body = `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/events">Events</a> / ${esc(s.weekLabel)}</nav>
    <h1>${esc(s.name)}: ${esc(s.weekLabel)}</h1>
    <p><strong>${esc(humanRange(s.coreStart, s.coreEnd))}</strong> · ${esc(s.venue)}</p>
    <p>${esc(s.theme)}: ${s.tracks.map(esc).join(' | ')}. ${esc(s.tagline)}.</p>
    ${s.stats ? `<h2>GFF by the numbers</h2><ul>${s.stats.map((x) => `<li>${x.value.toLocaleString('en-IN')}${x.suffix || ''} ${esc(x.label.toLowerCase())}</li>`).join('')}</ul><p>Source: <a href="${esc(s.statsSource)}" rel="nofollow noopener">globalfintechfest.com</a></p>` : ''}
    ${headline ? `<h2>The headline</h2><p><a href="/events/${toSlug(headline.name)}">${esc(headline.name)}</a> - ${esc(headline.description)}</p>` : ''}
    <h2>Featured side events</h2>${eventListHtml(sides.filter((e) => e.featured))}
    <h2>Side events, day by day</h2>
    ${[...byDay.entries()].map(([iso, list]) => `<h3>${esc(humanRange(iso, iso))}</h3>${eventListHtml(list)}`).join('')}
    ${programmes.length ? `<h2>Inside the fest</h2>${eventListHtml(programmes)}` : ''}
    <p>Sources: <a href="${esc(s.networking)}" rel="nofollow noopener">GFF networking</a>, <a href="${esc(s.nightFest)}" rel="nofollow noopener">GFF night fest</a> and each event's Lu.ma page.</p>`;
  write(route, renderShell({
    title, description, canonical: `${SITE}${route}`, image: abs(s.ogImage),
    jsonLd: [itemList(title, description, [headline, ...sides, ...programmes].filter(Boolean)), breadcrumb([['Home', '/'], ['Events', '/events'], [s.weekLabel, route]])],
    body,
  }));
  count++;
}

// ---------- month pages + /events index ----------
const months = new Map();
for (const e of events) {
  const key = e.startDate.slice(0, 7);
  if (!months.has(key)) months.set(key, []);
  months.get(key).push(e);
}
const monthSlug = (key) => {
  const [y, m] = key.split('-').map(Number);
  return `${new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }).toLowerCase()}-${y}`;
};
const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};
for (const [key, list] of months) {
  const route = `/events/${monthSlug(key)}`;
  const title = `Mumbai Tech Events - ${monthLabel(key)} | ${list.length} events`;
  const description = `All ${list.length} tech events in Mumbai in ${monthLabel(key)}: ${list.slice(0, 4).map((e) => e.name).join(', ')} and more. Dates, venues and registration links.`;
  const byCat = new Map();
  for (const e of list) { if (!byCat.has(e.category)) byCat.set(e.category, []); byCat.get(e.category).push(e); }
  const body = `
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/events">Events</a> / ${esc(monthLabel(key))}</nav>
    <h1>Mumbai Tech Events, ${esc(monthLabel(key))}</h1>
    <p>${list.length} link-verified events.</p>
    ${[...byCat.entries()].map(([cat, l]) => `<h2>${esc(CATEGORIES[cat]?.label || cat)}</h2>${eventListHtml(l)}`).join('')}`;
  write(route, renderShell({
    title, description, canonical: `${SITE}${route}`,
    jsonLd: [itemList(title, description, list), breadcrumb([['Home', '/'], ['Events', '/events'], [monthLabel(key), route]])],
    body,
  }));
  count++;
}
{
  const route = '/events';
  const title = `Mumbai Tech Events 2026 - ${events.length}+ events by month`;
  const description = `Every public tech event in Mumbai, organised by month: ${[...months.keys()].map(monthLabel).join(', ')}. Conferences, hackathons, meetups and Global Fintech Fest week.`;
  const body = `<h1>Mumbai Tech Events by Month</h1><ul>${[...months.entries()].map(([k, l]) => `<li><a href="/events/${monthSlug(k)}">${esc(monthLabel(k))}</a> - ${l.length} events</li>`).join('')}</ul>`;
  write(route, renderShell({ title, description, canonical: `${SITE}${route}`, jsonLd: [breadcrumb([['Home', '/'], ['Events', route]])], body }));
  count++;
}

// ---------- SEO collections ----------
for (const [slug, cfg] of Object.entries(COLLECTIONS)) {
  const route = `/${slug}`;
  const list = events.filter(cfg.filter).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const body = `<h1>${esc(cfg.h1.join(' '))}</h1><p>${esc(cfg.intro)}</p>${eventListHtml(list)}${cfg.faqs?.length ? `<h2>Frequently asked</h2>${cfg.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}` : ''}`;
  const jsonLd = [itemList(cfg.title, cfg.description, list)];
  if (cfg.faqs?.length) jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cfg.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  write(route, renderShell({ title: cfg.title, description: cfg.description, canonical: `${SITE}${route}`, jsonLd, body }));
  count++;
}

console.log(`Static shells written: ${count} routes`);
