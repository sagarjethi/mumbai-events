// Append a "May 2026" section to llms-full.txt with full per-event details.
import fs from 'node:fs';

const list = JSON.parse(fs.readFileSync('scripts/processed-events.json', 'utf8'));

function toSlug(name) {
  return name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const SITE = 'https://mumbai-events.sagarjethi.com';
const apr = list.filter((e) => e.startDate.startsWith('2026-04'));
const may = list.filter((e) => e.startDate.startsWith('2026-05'));

function entry(e) {
  return `### ${e.name}
- **Date:** ${e.date}
- **Venue:** ${e.venue}
- **Time:** ${e.time || 'See event page'}
- **Cost:** ${e.cost}
- **Category:** ${e.category}
- **Tags:** ${e.tags.join(', ') || '—'}
- **Description:** ${e.description}
- **Source:** ${e.source}
- **Register:** ${e.link}
- **Detail page:** ${SITE}/events/${toSlug(e.name)}
`;
}

const apr2730 = apr.length ? `\n\n---\n\n## APRIL 27 – 30, 2026 (extension)\n\n${apr.map(entry).join('\n')}` : '';
const mayBlock = `\n\n---\n\n## MAY 2026 — FULL LISTING (${may.length} events)\n\nMonth index: ${SITE}/events/may-2026\n\n${may.map(entry).join('\n')}`;

const file = fs.readFileSync('public/llms-full.txt', 'utf8');
// Insert before the final "COMPANION DIRECTORIES" section (or before final "---" + footer if present).
const marker = '# COMPANION DIRECTORIES';
const idx = file.indexOf(marker);
if (idx === -1) { console.error('Could not find COMPANION DIRECTORIES marker'); process.exit(1); }
// Find the "---\n\n# COMPANION..." separator above it
const before = file.slice(0, idx);
const after = file.slice(idx);

// Don't double-insert if already present
if (file.includes('## MAY 2026 — FULL LISTING')) {
  console.log('May section already present; aborting.');
  process.exit(0);
}

const updated = `${before.replace(/\s+$/, '')}\n${apr2730}${mayBlock}\n\n---\n\n${after}`;
fs.writeFileSync('public/llms-full.txt', updated);
console.log(`Appended ${apr.length} April + ${may.length} May entries to llms-full.txt`);
