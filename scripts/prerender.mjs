// Post-build static HTML prerenderer using Playwright + a tiny native http
// server. JSDOM was tried first (Option A) but it doesn't reliably run
// `<script type="module">` produced by Vite, so the rendered DOM came out
// identical to the SPA shell. Real Chromium is needed.
//
// Pipeline:
//   1. `vite build` produces dist/index.html + dist/assets/*
//   2. Tiny Node http server serves dist/ on a free port
//   3. Playwright Chromium visits each route and waits for hydration
//   4. The serialized DOM is written to dist/<route>/index.html
//   5. Vercel serves these static files first; SPA hydrates on top in browser.
//
// Vercel: skipped via VERCEL env var. Vercel's build sandbox can't launch
// Chromium reliably (needs system libs that aren't available without sudo),
// so we ship the SPA shell and let Googlebot render JS like before. The
// indexing benefit only kicks in for local builds — run `npm run build`
// locally, then deploy with `vercel deploy --prebuilt` if you want the
// prerendered HTML in production.
//
// Soft-fails on any error so deploys never break.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

function softFail(msg) {
  console.warn(`[prerender] ⚠️  ${msg} — skipping prerender, build will still ship SPA fallback.`);
  process.exit(0);
}

// Skip in Vercel's cloud build sandbox (Chromium not available there).
// Local `vercel build` also sets VERCEL=1, so gate on CI=1 which is only
// set in the cloud sandbox — that way local prebuilt deploys still prerender.
if (process.env.CI && (process.env.VERCEL || process.env.VERCEL_ENV)) {
  console.log('[prerender] Vercel cloud build detected — skipping prerender (SPA fallback will ship).');
  process.exit(0);
}
// Also skip if explicitly disabled
if (process.env.PRERENDER === '0' || process.env.PRERENDER === 'false') {
  console.log('[prerender] PRERENDER=0 — skipping.');
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch (e) {
  softFail(`playwright not importable: ${e.message}`);
}

// ---------- routes ----------
function loadEventSlugs() {
  const out = [];
  for (const f of ['src/data/events/june-2026.js', 'src/data/events/july-2026.js']) {
    if (!fs.existsSync(f)) continue;
    const txt = fs.readFileSync(f, 'utf8');
    for (const m of txt.matchAll(/\bname:\s*['"]([^'"]+)['"]/g)) {
      out.push(m[1]
        .toLowerCase()
        .replace(/[''‘’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''));
    }
  }
  return out;
}
function loadAcceleratorIds() {
  const out = [];
  if (!fs.existsSync('src/data/accelerators.js')) return out;
  const txt = fs.readFileSync('src/data/accelerators.js', 'utf8');
  for (const m of txt.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)) out.push(m[1]);
  return out;
}

const STATIC_ROUTES = [
  '/',
  '/events',
  '/events/june-2026',
  '/events/july-2026',
  '/accelerators',
  '/map',
  '/free-tech-events-mumbai',
  '/ai-events-mumbai-2026',
  '/conferences-mumbai-2026',
  '/web3-events-mumbai-2026',
  '/tech-events-this-weekend-mumbai',
  '/college-fests-mumbai-2026',
  '/about',
  '/editorial',
  '/cards',
];
const eventSlugs = loadEventSlugs();
const acceleratorIds = loadAcceleratorIds();
const routes = [
  ...STATIC_ROUTES,
  ...eventSlugs.map((s) => `/events/${s}`),
  ...acceleratorIds.map((id) => `/accelerators/${id}`),
];
console.log(`Prerendering ${routes.length} routes (${eventSlugs.length} events + ${acceleratorIds.length} accelerators + ${STATIC_ROUTES.length} static)…`);

// ---------- ensure Chromium binary is available ----------
async function tryLaunch() {
  try { const b = await chromium.launch({ headless: true }); await b.close(); return true; }
  catch { return false; }
}
if (!(await tryLaunch())) {
  console.log('[prerender] Chromium binary missing — running `npx playwright install chromium`…');
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync('npx', ['playwright', 'install', 'chromium'], { stdio: 'inherit' });
  if (r.status !== 0 || !(await tryLaunch())) softFail('Chromium not launchable after install attempt');
}

// ---------- tiny static server for dist/ ----------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
};
const DIST = path.resolve('dist');
function tryFile(p) {
  try { const stat = fs.statSync(p); if (stat.isFile()) return p; } catch { /* */ }
  return null;
}
const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  if (!url.startsWith('/')) url = '/' + url;
  const candidate = path.join(DIST, url);
  const resolved = path.resolve(candidate);
  if (!resolved.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  // Resolve as file → directory/index.html → SPA fallback
  const file = tryFile(resolved) || tryFile(path.join(resolved, 'index.html')) || path.join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const PORT = await new Promise((resolve, reject) => {
  server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  server.on('error', reject);
});
console.log(`✓ static server up on http://127.0.0.1:${PORT}`);

// ---------- launch chromium and visit each route ----------
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (compatible; PrerenderBot/1.0; +https://mumbai-events.sagarjethi.com)',
  locale: 'en-IN',
  timezoneId: 'Asia/Kolkata',
  viewport: { width: 1280, height: 720 },
});
const page = await ctx.newPage();

let okCount = 0;
let failCount = 0;
const failures = [];

for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const url = `http://127.0.0.1:${PORT}${route}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(200); // let react-helmet flush
    const html = await page.content();
    const destDir = route === '/' ? 'dist' : `dist${route}`;
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(path.join(destDir, 'index.html'), html);
    okCount++;
    if (i < 5 || i === routes.length - 1 || i % 25 === 0) {
      console.log(`  [${i + 1}/${routes.length}] ${route}`);
    }
  } catch (e) {
    failCount++;
    failures.push({ route, error: e.message });
    if (failures.length <= 3) console.warn(`  ✗ ${route}: ${e.message}`);
  }
}

await browser.close();
try { server.close(); } catch { /* */ }

console.log(`\nPrerender done: ${okCount} OK, ${failCount} failed`);
if (failures.length > 3) console.log(`(${failures.length - 3} more failures suppressed; see scripts/prerender-failures.json)`);
if (failures.length) fs.writeFileSync('scripts/prerender-failures.json', JSON.stringify(failures, null, 2));

process.exit(0);
