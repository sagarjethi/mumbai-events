// Read scraped-events.json, filter to Mumbai + Apr 27 – May 31 2026,
// categorize, dedupe vs existing events.js, write processed-events.json.
import fs from 'node:fs';
import path from 'node:path';

const RAW = JSON.parse(fs.readFileSync('scripts/scraped-events.json', 'utf8'));
const EVENTS_JS = fs.readFileSync('src/data/events.js', 'utf8');

const WINDOW_START = new Date('2026-04-27T00:00:00+05:30').getTime();
const WINDOW_END = new Date('2026-05-31T23:59:59+05:30').getTime();

// --- Existing events: extract names + URLs to dedupe ---
const existingNames = new Set();
const existingLinks = new Set();
for (const m of EVENTS_JS.matchAll(/name:\s*['"]([^'"]+)['"]/g)) existingNames.add(norm(m[1]));
for (const m of EVENTS_JS.matchAll(/link:\s*['"]([^'"]+)['"]/g)) existingLinks.add(m[1]);
let MAX_ID = 0;
for (const m of EVENTS_JS.matchAll(/^\s*id:\s*(\d+)/gm)) MAX_ID = Math.max(MAX_ID, +m[1]);

function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

// --- Mumbai filter ---
const BLR_RX = /\b(mumbai|mumbai|blr|whitefield|koramangala|indiranagar|electronic city|hsr layout|jayanagar|marathahalli|mg road|hebbal|yelahanka|sarjapur|btm|bommanahalli|domlur|nimhans|iisc|ktpo|biec)\b/i;
function isMumbai(e) {
  const blob = `${e.venue || ''} ${e.address || ''} ${e.name || ''} ${e.description || ''} ${e.bodySnippet || ''}`;
  return BLR_RX.test(blob);
}

// --- Online / virtual filter — drop pure-virtual events. ---
function isOnline(e) {
  const name = (e.name || '').toLowerCase();
  const venue = (e.venue || '').toLowerCase();
  const desc = (e.description || e.bodySnippet || '').toLowerCase();
  if (/\b(virtual|online|webinar|live stream|livestream)\b/.test(name)) return true;
  if (/\b(virtual|online|webinar|zoom)\b/.test(venue)) return true;
  if (/^(?:may|apr|april) \d+ - best of /i.test(e.name || '')) return true;
  if (/\bglobal\b.*\bvirtual\b|\bvirtual\b.*\bglobal\b/.test(name)) return true;
  // No venue + "online" / "webinar" / Voxel51 patterns in description
  if (!e.venue && /\b(online|webinar|live stream|virtual)\b/.test(desc)) return true;
  if (!e.venue && /voxel51|fiftyone/i.test(desc)) return true;
  // Voxel51 Mumbai-meetup-group webinar series naming pattern
  if (/^(?:may|apr|april|june|jun) \d+\s*[-–]/i.test(e.name || '')) return true;
  if (/odsc\s+(ai\s+)?east/i.test(e.name || '')) return true;
  // State of DLT Report — virtual discussion
  if (/state of (distributed ledger|dlt) report/i.test(e.name || '')) return true;
  return false;
}
function isOutsideBlr(e) {
  const blob = `${e.venue || ''} ${e.address || ''} ${e.bodySnippet || ''}`;
  // ODSC AI East = Boston; explicit non-IN cities
  if (/\b(boston|new york|nyc|san francisco|sf bay|london|berlin|singapore|dubai|tokyo)\b/i.test(blob) && !BLR_RX.test(blob)) return true;
  return false;
}

// --- Category inference ---
// CAT_RULES applied to NAME first (high precision), then description.
const CAT_RULES = [
  { cat: 'hackathon', rx: /hackathon|hack-?a-?thon|buildathon|codefest|hack night|hack day/i },
  { cat: 'cybersecurity', rx: /\b(cyber\s*sec|infosec|pentest|owasp|defcon|red team|blue team|appsec|cloud security)\b/i },
  { cat: 'web3', rx: /\b(web3|blockchain|crypto|nft|defi|ethereum|solana|polygon|bitcoin|dao)\b/i },
  { cat: 'expo', rx: /\b(expo|exhibition|trade\s?show|jobexpo|jobfair|career fair)\b/i },
  { cat: 'conference', rx: /\b(conference|summit|conclave|symposium|congress)\b/i },
  { cat: 'startup', rx: /\b(startup|founders?|investors?|pitch|demo day|vc|venture)\b/i },
];
const TAG_RULES = [
  ['AI', /\b(ai|gen ?ai|generative ai|llm|gpt|machine learning|ml|deep learning)\b/i],
  ['Agents', /\bagent(ic)?\b/i],
  ['Web3', /\b(web3|blockchain|crypto|nft|defi)\b/i],
  ['Cloud', /\b(aws|gcp|azure|cloud|kubernetes|k8s|devops)\b/i],
  ['Data', /\b(data|analytics|database|postgres|mongodb|kafka|streaming)\b/i],
  ['Frontend', /\b(react|next\.js|nextjs|frontend|tailwind|vite|svelte|vue)\b/i],
  ['Backend', /\b(backend|api|microservice|java|python|golang|rust|node)\b/i],
  ['Mobile', /\b(android|ios|flutter|react native|kotlin|swift)\b/i],
  ['Product', /\bproduct manager|pm\b|product management/i],
  ['Design', /\b(design|ux|ui)\b/i],
  ['Hackathon', /hackathon|buildathon/i],
  ['Startup', /\bstartup|founders\b/i],
  ['MLOps', /\bmlops|llmops\b/i],
  ['Security', /\b(security|infosec|cyber)\b/i],
];

function categorize(e) {
  const name = e.name || '';
  const desc = `${e.description || ''} ${e.bodySnippet || ''}`;
  // HasGeek "Mini Conf" = in-person conference
  if (/mini\s*conf|fifth elephant/i.test(desc) || /mini\s*conf/i.test(name)) return 'conference';
  for (const r of CAT_RULES) if (r.rx.test(name)) return r.cat;
  for (const r of CAT_RULES) if (r.rx.test(desc)) return r.cat;
  return 'meetup';
}
function tagify(e) {
  const blob = `${e.name || ''} ${e.description || ''} ${e.bodySnippet || ''}`;
  const tags = new Set();
  for (const [t, rx] of TAG_RULES) if (rx.test(blob)) tags.add(t);
  return [...tags].slice(0, 6);
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });
}
function dateLabel(s, e) {
  if (!s) return '';
  const a = new Date(s); const b = e ? new Date(e) : a;
  const sameDay = a.toDateString() === b.toDateString();
  return sameDay ? fmtDate(s) : `${fmtDate(s)}–${fmtDate(e || s)}`;
}
function fmtTime(s, e) {
  if (!s) return '';
  const opts = { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' };
  const a = new Date(s).toLocaleTimeString('en-US', opts);
  const b = e ? new Date(e).toLocaleTimeString('en-US', opts) : '';
  return b && b !== a ? `${a} – ${b}` : a;
}

// --- Process ---
const seen = new Set();
const kept = [];
const skipped = { duplicate: 0, outOfWindow: 0, notMumbai: 0, online: 0, noDate: 0 };

for (const e of RAW) {
  // Window check (must have a date for confident inclusion)
  if (!e.startDate) { skipped.noDate++; continue; }
  const t = new Date(e.startDate).getTime();
  if (Number.isNaN(t) || t < WINDOW_START || t > WINDOW_END) { skipped.outOfWindow++; continue; }
  if (isOnline(e)) { skipped.online++; continue; }
  if (isOutsideBlr(e)) { skipped.notMumbai++; continue; }
  const blob = `${e.venue || ''} ${e.address || ''} ${e.bodySnippet || ''}`;
  const otherCity = /\b(mumbai|pune|delhi|hyderabad|chennai|kolkata|noida|gurgaon|gurugram|ahmedabad|jaipur)\b/i.test(blob);
  if (otherCity && !isMumbai(e)) { skipped.notMumbai++; continue; }

  const key = norm(e.name);
  if (existingNames.has(key)) { skipped.duplicate++; continue; }
  if (existingLinks.has(e.eventUrl)) { skipped.duplicate++; continue; }
  if (seen.has(key)) { skipped.duplicate++; continue; }
  seen.add(key);

  kept.push({
    id: ++MAX_ID,
    name: (e.name || '').slice(0, 140).trim(),
    date: dateLabel(e.startDate, e.endDate),
    startDate: (e.startDate || '').slice(0, 10),
    endDate: (e.endDate || e.startDate || '').slice(0, 10),
    venue: (e.venue || 'Mumbai').slice(0, 200).trim(),
    time: fmtTime(e.startDate, e.endDate),
    cost: e.offers || 'See event page',
    category: categorize(e),
    tags: tagify(e),
    description: ((e.description || e.bodySnippet || '').replace(/\s+/g, ' ').slice(0, 320)).trim(),
    link: e.eventUrl,
    source: e.source,
    needsVerification: !e.endDate || !e.venue,
  });
}

kept.sort((a, b) => a.startDate.localeCompare(b.startDate));

fs.writeFileSync('scripts/processed-events.json', JSON.stringify(kept, null, 2));
console.log('Skipped:', skipped);
console.log('Kept:', kept.length);
console.log('Categories:');
const catHist = {};
for (const k of kept) catHist[k.category] = (catHist[k.category] || 0) + 1;
console.log(catHist);
console.log('First 5:', kept.slice(0, 5).map((k) => ({ id: k.id, date: k.date, name: k.name, cat: k.category })));
