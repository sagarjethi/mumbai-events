// Deep link check — fetches the full HTML and looks for "this event was
// cancelled / no longer available / page not found / draft" patterns that
// reveal a 200 page actually showing a dead event.
//
// Usage: node scripts/check-links-deep.mjs

import fs from 'node:fs';

const FILES = ['src/data/events/april-2026.js', 'src/data/events/may-2026.js'];

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const TODAY = todayIso();

const events = [];
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  const re = /\{[^{}]*?\bid:\s*(\d+)[^{}]*?\bname:\s*['"]([^'"]+)['"][^{}]*?\bstartDate:\s*['"]([^'"]+)['"][^{}]*?\bendDate:\s*['"]([^'"]+)['"][^{}]*?\blink:\s*['"]([^'"]+)['"][^{}]*?\}/gs;
  let m;
  while ((m = re.exec(txt))) {
    events.push({ id: +m[1], name: m[2], startDate: m[3], endDate: m[4], link: m[5] });
  }
}

const upcoming = events.filter((e) => e.endDate >= TODAY).sort((a, b) => a.startDate.localeCompare(b.startDate));
console.log(`Today: ${TODAY} · Deep-checking ${upcoming.length} upcoming events…\n`);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Strings that suggest the event page is dead/cancelled even with 200 status.
// All patterns must use word boundaries / context anchors so they don't
// match base64 IDs, hashes, or class names that happen to contain
// substrings like "404d" or "cancelled" in build-time data.
const DEAD_PATTERNS = [
  /\bevent (?:was|has been) cancell?ed\b/i,
  /\bno longer (?:available|active|on sale)\b/i,
  /\bthis event has ended\b/i,
  /\bsorry,? (?:this )?(?:page|event) (?:doesn'?t exist|not found|isn'?t available)\b/i,
  /\b404\b\s*(?:not found|page|error|—|-)/i,
  /<h1[^>]*>\s*404\s*<\/h1>/i,
  /<title[^>]*>\s*(?:404|page not found|not found)\s*[-—|]/i,
  /\bpage not found\b/i,
  /\bevent not found\b/i,
  /\bthis draft has expired\b/i,
  /\bunavailable in your region\b/i,
];

// Strings that mark a Meetup / Luma page as online-only (not in-person Mumbai)
const ONLINE_PATTERNS = [
  /\bonline event\b/i,
  /\bvirtual event\b/i,
  /\battend online\b/i,
  />online<\/[a-z]+>/i,
  /"is_online_event"\s*:\s*true/i,    // Eventbrite JSON
  /"isOnline"\s*:\s*true/i,            // Luma JSON
  /\bzoom\.us\b/i,                     // Zoom-only meetups
];

async function deepCheck(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });
    if (!r.ok && r.status !== 206) return { status: r.status, ok: false };
    const html = await r.text();
    // 1) Highest-confidence signal: schema.org eventStatus in JSON-LD (handles
    //    Luma + Eventbrite). Trust this above all body-text matching.
    const ldMatch = html.match(/"eventStatus"\s*:\s*"https?:\/\/schema\.org\/Event(Cancelled|Postponed|MovedOnline)"/i);
    if (ldMatch) return { status: r.status, ok: false, deadHint: `eventStatus=${ldMatch[1]}`, reason: ldMatch[1].toLowerCase() === 'movedonline' ? 'online' : 'cancelled' };
    // 2) Strip <script> blocks BEFORE pattern matching — Luma + Meetup pages
    //    embed the entire i18n translation bundle (including "Event cancelled",
    //    "This event has been cancelled.") in those scripts. Treating those as
    //    real cancellations was a false-positive bug.
    const noScript = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ').slice(0, 250000);
    for (const rx of DEAD_PATTERNS) {
      const m = noScript.match(rx);
      if (m) return { status: r.status, ok: false, deadHint: m[0].slice(0, 80), reason: 'cancelled' };
    }
    for (const rx of ONLINE_PATTERNS) {
      const m = noScript.match(rx);
      if (m) return { status: r.status, ok: false, deadHint: m[0].slice(0, 80), reason: 'online' };
    }
    return { status: r.status, ok: true };
  } catch (e) {
    return { status: 0, ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally { clearTimeout(t); }
}

const POOL = 4;
const results = [];
let i = 0;
async function worker() {
  while (i < upcoming.length) {
    const e = upcoming[i++];
    const r = await deepCheck(e.link);
    results.push({ ...e, ...r });
    const sym = r.ok ? '✅' : (r.reason === 'online' ? '🌐' : '⚠️ ');
    const note = r.error || r.deadHint || (r.ok ? '' : `${r.status}`);
    console.log(`${sym} [${r.status || 'ERR'}] ${e.name.slice(0, 55).padEnd(55)} ${note}`);
  }
}
await Promise.all(Array.from({ length: POOL }, worker));

results.sort((a, b) => a.startDate.localeCompare(b.startDate));
fs.writeFileSync('scripts/link-check-deep.json', JSON.stringify(results, null, 2));

const flagged = results.filter((r) => !r.ok);
console.log('\n═══════════════════════════════════════════════');
console.log('DEEP CHECK SUMMARY');
console.log('═══════════════════════════════════════════════');
console.log(`Reachable & content-OK : ${results.filter((r) => r.ok).length}`);
console.log(`Flagged                : ${flagged.length}`);

if (flagged.length) {
  const cancelled = flagged.filter((f) => f.reason === 'cancelled');
  const online    = flagged.filter((f) => f.reason === 'online');
  const errors    = flagged.filter((f) => !f.reason);
  if (cancelled.length) {
    console.log('\n=== CANCELLED EVENTS ===');
    for (const f of cancelled) console.log(`[${f.id}] ${f.name}  (${f.startDate})\n  ${f.link}\n  hint="${f.deadHint}"\n`);
  }
  if (online.length) {
    console.log('\n=== ONLINE-ONLY EVENTS (not in-person Mumbai) ===');
    for (const f of online) console.log(`[${f.id}] ${f.name}  (${f.startDate})\n  ${f.link}\n  hint="${f.deadHint}"\n`);
  }
  if (errors.length) {
    console.log('\n=== HTTP ERRORS / OTHER ===');
    for (const f of errors) console.log(`[${f.id}] ${f.name}  (${f.startDate})\n  ${f.link}\n  status=${f.status || 'ERR'}${f.error ? ' err=' + f.error : ''}\n`);
  }
  // IDs lists for easy automated removal
  if (cancelled.length || online.length || errors.length) {
    console.log('\nDEAD_IDS = ' + JSON.stringify([...cancelled, ...online, ...errors].map((f) => f.id)));
  }
}
