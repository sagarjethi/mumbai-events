// Scrape Mumbai tech events for Apr 27 – May 31, 2026 from multiple sources.
// Usage: node scripts/scrape-events.mjs
// Output: scripts/scraped-events.json

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('scripts/scraped-events.json');
const WINDOW_START = new Date('2026-04-27T00:00:00+05:30');
const WINDOW_END = new Date('2026-05-31T23:59:59+05:30');

const TARGETS = [
  // Luma — Mumbai discovery
  { source: 'luma', url: 'https://lu.ma/mumbai' },
  { source: 'luma', url: 'https://lu.ma/discover/mumbai' },
  // Eventbrite — Mumbai tech
  { source: 'eventbrite', url: 'https://www.eventbrite.com/d/india--mumbai/tech/' },
  { source: 'eventbrite', url: 'https://www.eventbrite.com/d/india--mumbai/all-events/?q=hackathon' },
  { source: 'eventbrite', url: 'https://www.eventbrite.com/d/india--mumbai/all-events/?q=ai' },
  // Meetup
  { source: 'meetup', url: 'https://www.meetup.com/find/?location=in--Mumbai&source=EVENTS&keywords=tech' },
  { source: 'meetup', url: 'https://www.meetup.com/find/?location=in--Mumbai&source=EVENTS&keywords=ai' },
  // GDG community.dev
  { source: 'gdg', url: 'https://gdg.community.dev/gdg-mumbai/' },
  { source: 'gdg', url: 'https://gdg.community.dev/gdg-cloud-mumbai/' },
  // HasGeek
  { source: 'hasgeek', url: 'https://hasgeek.com/' },
  // AllEvents
  { source: 'allevents', url: 'https://allevents.in/mumbai/tech' },
  { source: 'allevents', url: 'https://allevents.in/mumbai/all' },
  // Dev.events
  { source: 'devevents', url: 'https://dev.events/IN' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function autoScroll(page, rounds = 8) {
  for (let i = 0; i < rounds; i++) {
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await sleep(800);
  }
}

async function scrapeListing(page, target) {
  const { source, url } = target;
  const out = [];
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(2500);
    await autoScroll(page, 10);

    // Generic anchor harvesting — let the verifier filter later.
    const links = await page.$$eval('a', (as) =>
      as
        .map((a) => ({ href: a.href, text: (a.innerText || '').trim().slice(0, 200) }))
        .filter((x) => x.href && x.text)
    );

    const eventLikes = links.filter((l) => isEventUrl(l.href, source));
    const seen = new Set();
    for (const l of eventLikes) {
      if (seen.has(l.href)) continue;
      seen.add(l.href);
      out.push({ source, listingUrl: url, eventUrl: l.href, title: l.text });
    }
  } catch (e) {
    console.error(`[${source}] listing error ${url}: ${e.message}`);
  }
  return out;
}

function isEventUrl(href, source) {
  try {
    const u = new URL(href);
    if (source === 'luma') return /^lu\.ma$|^.*\.lu\.ma$/.test(u.host) && /^\/[A-Za-z0-9_-]{4,}$/.test(u.pathname);
    if (source === 'eventbrite') return /eventbrite\./.test(u.host) && /\/e\//.test(u.pathname);
    if (source === 'meetup') return /meetup\.com$/.test(u.host) && /\/events\/\d+/.test(u.pathname);
    if (source === 'gdg') return /community\.dev$/.test(u.host) && /\/events\//.test(u.pathname);
    if (source === 'hasgeek') return /hasgeek\.com$/.test(u.host) && u.pathname.split('/').filter(Boolean).length >= 2;
    if (source === 'allevents') return /allevents\.in$/.test(u.host) && /\/[a-z0-9-]+\/\d+/.test(u.pathname);
    if (source === 'devevents') return /dev\.events$/.test(u.host) && /\/event\//.test(u.pathname);
  } catch { /* */ }
  return false;
}

async function scrapeDetail(page, item) {
  const { eventUrl, source } = item;
  try {
    await page.goto(eventUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(1500);

    const data = await page.evaluate(() => {
      const txt = (sel) => {
        const el = document.querySelector(sel);
        return el ? (el.innerText || el.textContent || '').trim() : '';
      };
      const meta = (n) =>
        document.querySelector(`meta[property="${n}"]`)?.content ||
        document.querySelector(`meta[name="${n}"]`)?.content ||
        '';
      // JSON-LD
      const ldNodes = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const ld = [];
      for (const n of ldNodes) {
        try {
          const j = JSON.parse(n.textContent);
          ld.push(j);
        } catch { /* */ }
      }
      return {
        title: document.title,
        ogTitle: meta('og:title'),
        ogDesc: meta('og:description'),
        ogImage: meta('og:image'),
        h1: txt('h1'),
        bodyText: (document.body.innerText || '').slice(0, 4000),
        ld,
      };
    });

    const ev = extractEvent(data);
    return { ...item, ...ev, raw: { title: data.title, h1: data.h1 } };
  } catch (e) {
    return { ...item, error: e.message };
  }
}

function extractEvent(d) {
  // Try schema.org Event from JSON-LD first
  const flatten = (x) => Array.isArray(x) ? x.flatMap(flatten) : x && typeof x === 'object' ? [x, ...Object.values(x).flatMap(flatten)] : [];
  const nodes = flatten(d.ld);
  const ev = nodes.find((n) => n && (n['@type'] === 'Event' || (Array.isArray(n['@type']) && n['@type'].includes('Event'))));
  if (ev) {
    return {
      name: ev.name || d.ogTitle || d.h1 || d.title,
      description: ev.description || d.ogDesc,
      startDate: ev.startDate || '',
      endDate: ev.endDate || ev.startDate || '',
      venue: ev.location?.name || ev.location?.address?.addressLocality || (typeof ev.location === 'string' ? ev.location : ''),
      address: ev.location?.address?.streetAddress || '',
      image: ev.image || d.ogImage,
      offers: ev.offers ? (ev.offers.price ? `${ev.offers.priceCurrency} ${ev.offers.price}` : '') : '',
    };
  }
  // Fallback
  return {
    name: d.ogTitle || d.h1 || d.title,
    description: d.ogDesc,
    bodySnippet: d.bodyText?.slice(0, 1000) || '',
    image: d.ogImage,
  };
}

function inWindow(iso) {
  if (!iso) return null; // unknown — keep
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return t >= WINDOW_START.getTime() && t <= WINDOW_END.getTime();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
  });
  const page = await ctx.newPage();

  const allListings = [];
  for (const t of TARGETS) {
    console.log(`Listing ${t.source}: ${t.url}`);
    const items = await scrapeListing(page, t);
    console.log(`  -> ${items.length} candidates`);
    allListings.push(...items);
  }

  // Dedupe by eventUrl
  const byUrl = new Map();
  for (const l of allListings) if (!byUrl.has(l.eventUrl)) byUrl.set(l.eventUrl, l);
  const queue = [...byUrl.values()].slice(0, 250); // cap

  console.log(`\nFetching detail for ${queue.length} URLs...`);
  const details = [];
  for (let i = 0; i < queue.length; i++) {
    const it = queue[i];
    process.stdout.write(`[${i + 1}/${queue.length}] ${it.eventUrl}\n`);
    const d = await scrapeDetail(page, it);
    const inW = inWindow(d.startDate);
    if (inW === false) continue; // out of date window
    details.push(d);
  }

  await browser.close();

  await fs.writeFile(OUT, JSON.stringify(details, null, 2));
  console.log(`\nWrote ${details.length} events -> ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
