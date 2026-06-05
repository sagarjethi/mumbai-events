// Link-check every UPCOMING event. Flag 404/410/timeouts/3xx-loops.
// Usage: node scripts/check-links.mjs [--all]
//   --all   include past events too
// Output: scripts/link-check.json + console summary

import fs from 'node:fs';

const FILES = ['src/data/events/april-2026.js', 'src/data/events/may-2026.js', 'src/data/events/other.js'];
const includeAll = process.argv.includes('--all');

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const TODAY = todayIso();

// Extract event objects with id, name, link, startDate, endDate
const events = [];
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  const re = /\{[^{}]*?\bid:\s*(\d+)[^{}]*?\bname:\s*['"]([^'"]+)['"][^{}]*?\bstartDate:\s*['"]([^'"]+)['"][^{}]*?\bendDate:\s*['"]([^'"]+)['"][^{}]*?\blink:\s*['"]([^'"]+)['"][^{}]*?\}/gs;
  let m;
  while ((m = re.exec(txt))) {
    events.push({
      id: +m[1],
      name: m[2],
      startDate: m[3],
      endDate: m[4],
      link: m[5],
      file: f,
    });
  }
}

const target = includeAll ? events : events.filter((e) => e.endDate >= TODAY);
console.log(`Today: ${TODAY}`);
console.log(`Total events: ${events.length}`);
console.log(`Checking ${target.length} ${includeAll ? 'all' : 'upcoming'} events…\n`);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const TIMEOUT_MS = 15000;

async function check(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
        'Range': 'bytes=0-32768',
      },
    });
    return {
      status: r.status,
      ok: r.status < 400,
      finalUrl: r.url,
      redirected: r.url !== url,
    };
  } catch (e) {
    return { status: 0, ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally { clearTimeout(t); }
}

const POOL = 6;
const results = [];
let i = 0;
async function worker() {
  while (i < target.length) {
    const e = target[i++];
    const r = await check(e.link);
    results.push({ ...e, ...r });
    const sym = r.ok ? '✅' : '❌';
    console.log(`${sym} [${r.status || 'ERR'}] ${e.name.slice(0, 60).padEnd(60)} ${e.startDate}`);
  }
}
await Promise.all(Array.from({ length: POOL }, worker));

results.sort((a, b) => a.startDate.localeCompare(b.startDate));
fs.writeFileSync('scripts/link-check.json', JSON.stringify(results, null, 2));

const broken = results.filter((r) => !r.ok);
const cf403 = broken.filter((r) => r.status === 403); // Likely Cloudflare bot block
const real404 = broken.filter((r) => r.status === 404 || r.status === 410);
const timeouts = broken.filter((r) => r.error === 'timeout');
const otherFail = broken.filter((r) => !cf403.includes(r) && !real404.includes(r) && !timeouts.includes(r));

console.log('\n═══════════════════════════════════════════════');
console.log('SUMMARY');
console.log('═══════════════════════════════════════════════');
console.log(`Total checked   : ${results.length}`);
console.log(`✅ OK           : ${results.filter((r) => r.ok).length}`);
console.log(`❌ Broken       : ${broken.length}`);
console.log(`   ├─ 404/410   : ${real404.length}`);
console.log(`   ├─ 403 (CF?) : ${cf403.length}`);
console.log(`   ├─ Timeouts  : ${timeouts.length}`);
console.log(`   └─ Other     : ${otherFail.length}`);

if (real404.length) {
  console.log('\n=== HARD 404/410 (truly broken) ===');
  for (const b of real404) {
    console.log(`  [${b.id}] ${b.name}`);
    console.log(`        ${b.link}`);
    console.log(`        Date: ${b.startDate} -> ${b.endDate}\n`);
  }
}
if (cf403.length) {
  console.log('\n=== 403 (likely Cloudflare bot block — needs manual verify) ===');
  for (const b of cf403) {
    console.log(`  [${b.id}] ${b.name}`);
    console.log(`        ${b.link}\n`);
  }
}
if (timeouts.length) {
  console.log('\n=== TIMEOUTS ===');
  for (const b of timeouts) {
    console.log(`  [${b.id}] ${b.name}`);
    console.log(`        ${b.link}\n`);
  }
}
if (otherFail.length) {
  console.log('\n=== OTHER FAILURES ===');
  for (const b of otherFail) {
    console.log(`  [${b.id}] ${b.status || b.error} — ${b.name}`);
    console.log(`        ${b.link}\n`);
  }
}
