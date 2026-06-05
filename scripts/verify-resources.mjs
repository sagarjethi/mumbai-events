#!/usr/bin/env node
// Resource verifier. Run: `npm run verify:resources`
// - Schema-lints each entry (required fields, controlled vocabularies, id uniqueness)
// - Cross-refs stackHint/toolHint ids exist in tools.js
// - HEAD-checks every url; tolerates HTTP 403/429 only for allowlisted hosts
// - Warns on verifiedOn > 90 days old
// Exit code: 1 on any error, 0 otherwise.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RES = path.join(ROOT, 'src/data/resources');

const required = {
  tool:        ['id', 'name', 'vendor', 'url', 'docsUrl', 'category', 'themes', 'blurb', 'freeTier', 'verifiedOn'],
  skill:       ['id', 'title', 'category', 'priority', 'themes', 'oneLiner', 'how', 'whyItWins', 'verifiedOn'],
  guide:       ['id', 'title', 'author', 'url', 'format', 'themes', 'blurb', 'verifiedOn'],
  winner:      ['id', 'name', 'hackathon', 'url', 'themes', 'verifiedOn'],
  accelerator: ['id', 'name', 'url', 'tagline', 'verifiedOn'],
};

const allowed403 = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'verify-resources-allowed-403.json'), 'utf8')
);

async function main() {
  const ACC = path.join(ROOT, 'src/data');

  const mods = {
    tools:        (await import(pathToFileURL(path.join(RES, 'tools.js')).href)).tools,
    skills:       (await import(pathToFileURL(path.join(RES, 'skills.js')).href)).skills,
    guides:       (await import(pathToFileURL(path.join(RES, 'guides.js')).href)).guides,
    winners:      (await import(pathToFileURL(path.join(RES, 'winners.js')).href)).winners,
    accelerators: (await import(pathToFileURL(path.join(ACC, 'accelerators.js')).href)).accelerators,
  };
  const taxonomy = await import(pathToFileURL(path.join(RES, 'taxonomy.js')).href);

  const errors = [];
  const warnings = [];
  const seenIds = new Set();

  const checkThemes = (it, label) => {
    for (const t of it.themes || []) {
      if (t === '*') continue;
      if (!taxonomy.THEMES[t]) errors.push(`${label} ${it.id}: unknown theme "${t}"`);
    }
  };

  const checkRequired = (it, shape, label) => {
    for (const k of required[shape]) {
      const v = it[k];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
        errors.push(`${label} ${it.id || '<no-id>'}: missing ${k}`);
      }
    }
    if (it.id) {
      if (seenIds.has(it.id)) errors.push(`${label} ${it.id}: duplicate id`);
      seenIds.add(it.id);
    }
  };

  for (const t of mods.tools) {
    checkRequired(t, 'tool', 'tool');
    if (!taxonomy.TOOL_CATEGORIES[t.category]) errors.push(`tool ${t.id}: unknown category "${t.category}"`);
    if (!taxonomy.FREE_TIERS[t.freeTier])     errors.push(`tool ${t.id}: unknown freeTier "${t.freeTier}"`);
    checkThemes(t, 'tool');
    if (t.blurb && t.blurb.length > 140) warnings.push(`tool ${t.id}: blurb > 140 chars (${t.blurb.length})`);
  }
  for (const s of mods.skills) {
    checkRequired(s, 'skill', 'skill');
    if (!taxonomy.SKILL_CATEGORIES[s.category]) errors.push(`skill ${s.id}: unknown category "${s.category}"`);
    if (!taxonomy.PRIORITIES[s.priority])       errors.push(`skill ${s.id}: unknown priority "${s.priority}"`);
    checkThemes(s, 'skill');
    for (const tid of s.toolHint || []) {
      if (!mods.tools.find((t) => t.id === tid)) errors.push(`skill ${s.id}: toolHint references unknown tool id "${tid}"`);
    }
  }
  for (const g of mods.guides)  { checkRequired(g, 'guide',  'guide');  checkThemes(g, 'guide'); }
  for (const w of mods.winners) { checkRequired(w, 'winner', 'winner'); checkThemes(w, 'winner'); }
  for (const a of mods.accelerators) {
    checkRequired(a, 'accelerator', 'accelerator');
    if (a.tagline && a.tagline.length > 200) warnings.push(`accelerator ${a.id}: tagline > 200 chars (${a.tagline.length})`);
  }

  // Link checks
  const urls = new Map(); // url → list of "label"
  const add = (url, label) => {
    if (!url) return;
    const existing = urls.get(url) || [];
    existing.push(label);
    urls.set(url, existing);
  };
  for (const t of mods.tools) {
    add(t.url, `tool:${t.id}.url`);
    add(t.docsUrl, `tool:${t.id}.docsUrl`);
  }
  for (const g of mods.guides) add(g.url, `guide:${g.id}.url`);
  for (const a of mods.accelerators) {
    add(a.url, `accelerator:${a.id}.url`);
    if (a.applyUrl) add(a.applyUrl, `accelerator:${a.id}.applyUrl`);
  }
  for (const w of mods.winners) {
    add(w.url, `winner:${w.id}.url`);
    if (w.demoUrl) add(w.demoUrl, `winner:${w.id}.demoUrl`);
  }

  const hostname = (u) => { try { return new URL(u).hostname; } catch { return null; } };

  const UA = 'Mozilla/5.0 (compatible; mumbai-events-verify/1.0; +https://mumbai-events.sagarjethi.com)';
  const tryFetch = async (u, method) =>
    fetch(u, { method, redirect: 'follow', headers: { 'User-Agent': UA } });

  const results = await Promise.all(
    [...urls.entries()].map(async ([u, labels]) => {
      const host = hostname(u);
      // Try HEAD → GET on 405/501 → retry-GET once on network error
      try {
        let res = await tryFetch(u, 'HEAD');
        if (res.status === 405 || res.status === 501) res = await tryFetch(u, 'GET');
        return { u, labels, status: res.status, host };
      } catch {
        try {
          const res = await tryFetch(u, 'GET');
          return { u, labels, status: res.status, host };
        } catch (e) {
          return { u, labels, error: e.message, host };
        }
      }
    })
  );
  for (const r of results) {
    if (r.error) {
      // Some real sites fail Node's strict TLS (self-signed chain, older CAs,
      // or WAFs that block our UA entirely). If the host is pre-allowlisted,
      // treat any fetch failure as a warning rather than an error.
      const certErrorHosts = allowed403.certErrorHosts || [];
      if (certErrorHosts.includes(r.host)) {
        warnings.push(`link ${r.u}: ${r.error} — ${r.host} allowlisted (TLS/WAF quirk), manually verified`);
        continue;
      }
      errors.push(`link error: ${r.u} — ${r.error} (used by ${r.labels.join(', ')})`);
      continue;
    }
    if (r.status >= 200 && r.status < 400) continue;
    if ((r.status === 403 || r.status === 429) && allowed403.hosts.includes(r.host)) {
      warnings.push(`link ${r.u}: HTTP ${r.status} from ${r.host} — allowlisted, manually verified`);
      continue;
    }
    errors.push(`link ${r.u}: HTTP ${r.status} (used by ${r.labels.join(', ')})`);
  }

  // Staleness
  const today = new Date();
  for (const list of Object.values(mods)) {
    for (const it of list) {
      if (!it.verifiedOn) continue;
      const age = (today - new Date(it.verifiedOn)) / (1000 * 60 * 60 * 24);
      if (age > 90) warnings.push(`${it.id}: verifiedOn ${it.verifiedOn} is ${Math.round(age)} days old`);
    }
  }

  for (const w of warnings) console.warn('WARN ', w);
  for (const e of errors)   console.error('ERROR', e);
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  const totalEntries = mods.tools.length + mods.skills.length + mods.guides.length + mods.winners.length + mods.accelerators.length;
  console.log(`checked ${urls.size} unique URL(s) across ${totalEntries} entries`);
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error('fatal:', e);
  process.exit(1);
});
