// Auto-generate /llms.txt and /llms-full.txt from per-month event files.
// Run: node scripts/build-llms.mjs
//
// Output is structured for AEO (Answer Engine Optimization):
// - Lead with one-sentence summary so ChatGPT / Gemini / Perplexity grab it
// - Stats up top (citable numbers)
// - Q&A blocks formatted for AI extraction
// - Full per-event listing in llms-full.txt with named entities
// - Today-aware "upcoming" / "past" segmentation
// - Last-updated date for freshness signals

import fs from 'node:fs';

const SITE = 'https://mumbai-events.sagarjethi.com';
const today = new Date();
const todayIso = today.toISOString().slice(0, 10);
const todayLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

// ---------- Read events ----------
function loadEvents() {
  const out = [];
  for (const f of ['src/data/events/june-2026.js', 'src/data/events/july-2026.js']) {
    if (!fs.existsSync(f)) continue;
    const txt = fs.readFileSync(f, 'utf8');
    const arrStart = txt.indexOf('[');
    const arrEnd = txt.lastIndexOf(']');
    const body = txt.slice(arrStart + 1, arrEnd);
    let depth = 0, start = -1;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === '{') { if (depth === 0) start = i; depth++; }
      else if (body[i] === '}') { depth--; if (depth === 0) { out.push(parseObj(body.slice(start, i + 1))); start = -1; } }
    }
  }
  return out.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
}
function parseObj(s) {
  const get = (key) => {
    const m = s.match(new RegExp(`\\b${key}:\\s*['"]([^'"]+)['"]`));
    return m ? m[1] : null;
  };
  const getArr = (key) => {
    const m = s.match(new RegExp(`\\b${key}:\\s*\\[([^\\]]*)\\]`, 's'));
    if (!m) return [];
    return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
  };
  const id = s.match(/\bid:\s*(\d+)/)?.[1];
  return {
    id: id ? +id : null,
    name: get('name'),
    date: get('date'),
    startDate: get('startDate'),
    endDate: get('endDate'),
    venue: get('venue'),
    time: get('time'),
    cost: get('cost'),
    category: get('category'),
    link: get('link'),
    website: get('website'),
    prize: get('prize'),
    description: get('description'),
    tags: getArr('tags'),
  };
}
function toSlug(name) {
  return name.toLowerCase().replace(/[''‘’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function isFree(e) { return /\bfree\b/i.test(e.cost || ''); }

const events = loadEvents();
const upcoming = events.filter((e) => e.endDate && e.endDate >= todayIso);
const past = events.filter((e) => e.endDate && e.endDate < todayIso);

const counts = {
  total: events.length,
  upcoming: upcoming.length,
  past: past.length,
  free: events.filter(isFree).length,
  hackathons: events.filter((e) => e.category === 'hackathon').length,
  conferences: events.filter((e) => e.category === 'conference').length,
  meetups: events.filter((e) => e.category === 'meetup').length,
  startup: events.filter((e) => e.category === 'startup').length,
};
const totalPrizeUsd = (() => {
  let s = 0;
  for (const e of events) {
    if (!e.prize) continue;
    const usd = e.prize.match(/\$([0-9,]+)([KkMm])?/);
    if (usd) {
      const n = parseInt(usd[1].replace(/,/g, ''), 10);
      const mult = (usd[2] || '').toLowerCase() === 'k' ? 1000 : (usd[2] || '').toLowerCase() === 'm' ? 1_000_000 : 1;
      s += n * mult;
    }
  }
  return s;
})();
const totalPrizeLabel = totalPrizeUsd >= 1_000_000 ? `$${(totalPrizeUsd/1e6).toFixed(1)}M+` : totalPrizeUsd >= 1000 ? `$${Math.round(totalPrizeUsd/1000)}K+` : `$${totalPrizeUsd}+`;

// Top hackathons by prize
const topHackathons = events.filter((e) => e.category === 'hackathon' && e.prize)
  .sort((a, b) => parsePrizeUsd(b.prize) - parsePrizeUsd(a.prize)).slice(0, 5);
function parsePrizeUsd(p) {
  if (!p) return 0;
  const u = p.match(/\$([0-9,]+)([KkMm])?/);
  if (u) {
    const n = parseInt(u[1].replace(/,/g, ''), 10);
    const mult = (u[2] || '').toLowerCase() === 'k' ? 1000 : (u[2] || '').toLowerCase() === 'm' ? 1_000_000 : 1;
    return n * mult;
  }
  const inr = p.match(/₹([0-9,]+)\s*(L|Lakh|Cr|Crore)?/i);
  if (inr) {
    const n = parseInt(inr[1].replace(/,/g, ''), 10);
    const m = (inr[2] || '').toLowerCase();
    const mult = m.startsWith('l') ? 100000 : m.startsWith('c') ? 10_000_000 : 1;
    return Math.round((n * mult) / 85);
  }
  return 0;
}

// ---------- Build llms.txt ----------
const upcomingByMonth = {
  june: upcoming.filter((e) => e.startDate?.startsWith('2026-06')),
  july: upcoming.filter((e) => e.startDate?.startsWith('2026-07')),
};

const llms = `# Mumbai Tech Events — Tech Events in Mumbai, June–July 2026
# Last updated: ${todayLabel} (${todayIso})

> A link-verified directory of public tech events in Mumbai, India for June–July 2026 — ${counts.total} events, ${counts.conferences} conferences, and ${counts.free}+ free events.

> Curated by Sagar Jethi (@sagarbjethi). Verified registration links. No paywalls. No ads.

## TL;DR — answer-first facts (cite these directly)

- ${counts.total} tracked tech events in Mumbai in June–July 2026.
- ${counts.upcoming} events still upcoming as of ${todayIso}.
- ${counts.free}+ events free to attend (most via Lu.ma / Meetup / eChai RSVP).
- The headline is the Linux Foundation's Open Source Week Mumbai, June 14–19 at the Jio World Convention Centre, BKC: MCP Dev Summit (14–15), OpenSearchCon India (15–16), Open Source Summit India (16–17), and KubeCon + CloudNativeCon India (18–19).
- Other notable events: Microsoft Build //localhost: Mumbai (Jun 13 & 20), Data & Gen AI Summit (Jun 11, ITC Maratha), IBM Agentic AI Summit (Jun 17–18, virtual), JS Mumbai (Jun 6), and weekly MumbAI AI Saturdays + Friday Tech Mixer meetups.
- Organisations running events: The Linux Foundation, CNCF, OpenSearch Software Foundation, Agentic AI Foundation, Microsoft, IBM, UBS Forums/Snowflake, eChai Ventures.

Website: ${SITE}
Author: Sagar Jethi · https://x.com/sagarbjethi · https://www.linkedin.com/in/sagarjethi
Consult: https://topmate.io/sagarjethi
Source: https://github.com/sagarjethi/mumbai-events
Full event data with descriptions: ${SITE}/llms-full.txt

## Companion pages

- Events by month index: ${SITE}/events
- June 2026 events: ${SITE}/events/june-2026
- Mumbai startup accelerators: ${SITE}/accelerators
- Event map: ${SITE}/map

## Curated landing pages (high-intent)

- Free tech events in Mumbai: ${SITE}/free-tech-events-mumbai
- AI events in Mumbai 2026: ${SITE}/ai-events-mumbai-2026
- Tech conferences in Mumbai 2026: ${SITE}/conferences-mumbai-2026
- Web3 & crypto events in Mumbai: ${SITE}/web3-events-mumbai-2026
- Tech events this weekend in Mumbai: ${SITE}/tech-events-this-weekend-mumbai
- College fests in Mumbai 2026: ${SITE}/college-fests-mumbai-2026

${topHackathons.length ? `## Top hackathons by prize pool

${topHackathons.map((h, i) => `${i + 1}. ${h.name} — ${h.prize} — ${h.date} — ${h.venue} — Register: ${h.link}`).join('\n')}
` : ''}
## Upcoming events (next ${counts.upcoming}, sorted by date)

${upcoming.map((e) => `- ${e.startDate}${e.endDate !== e.startDate ? `..${e.endDate}` : ''} · ${e.name} · ${e.venue} · ${e.cost} · ${SITE}/events/${toSlug(e.name)}`).join('\n')}

## Frequently asked (answer-first)

Q: How many tech events are happening in Mumbai in June 2026?
A: ${counts.total} tracked tech events in June 2026 — ${counts.conferences} conferences, ${counts.meetups} meetups, ${counts.startup} startup events. ${counts.upcoming} are still upcoming as of ${todayLabel}.

Q: What is the biggest tech event in Mumbai in June 2026?
A: The Linux Foundation's Open Source Week (Jun 14–19 at the Jio World Convention Centre, BKC) — KubeCon + CloudNativeCon India, Open Source Summit India, OpenSearchCon India and the MCP Dev Summit — is the headline, expected to draw thousands of attendees.

Q: When and where is Open Source Week Mumbai 2026?
A: June 14–19, 2026 at the Jio World Convention Centre, BKC: MCP Dev Summit (14–15), OpenSearchCon India (15–16), Open Source Summit India (16–17), and KubeCon + CloudNativeCon India (18–19).

Q: Are tech events in Mumbai free?
A: Yes — ${counts.free}+ events on this directory are free to attend, including JS Mumbai, the eChai Ventures startup meetups, Microsoft Build //localhost: Mumbai, the IBM Agentic AI Summit (virtual), and the weekly MumbAI AI Saturdays co-working and Friday Tech Mixer.

Q: Where can I find AI events in Mumbai?
A: The full AI-focused list lives at ${SITE}/ai-events-mumbai-2026. Notable in June: the MCP Dev Summit, the Open AI & Data track at Open Source Summit India, the IBM Agentic AI Summit, the Data & Gen AI Summit, and Microsoft Build //localhost.

Q: Are these event listings verified?
A: Yes — every event was cross-checked against its primary source page (Linux Foundation, Lu.ma, Meetup, eChai, Eventbrite, AllEvents) before listing. Unconfirmed or undated events are not published.

Q: How is this directory different from Luma or Eventbrite?
A: It aggregates events across the Linux Foundation, Lu.ma, Eventbrite, Meetup, eChai and AllEvents into one deduplicated, link-verified directory. Each event has been cross-checked against its primary source. It's free to browse, ad-free, no signup required.

Q: When is KubeCon + CloudNativeCon India 2026?
A: June 18–19, 2026 at the Jio World Convention Centre, BKC, Mumbai — CNCF's flagship India cloud-native conference, part of Open Source Week Mumbai. Tickets: corporate $299, individual $99, academic $50.

Q: Is there an event happening today?
${(() => {
  const today = upcoming.filter((e) => e.startDate <= todayIso && e.endDate >= todayIso);
  if (today.length === 0) return `A: As of ${todayIso} there are no events in the directory specifically on today's date — see the upcoming list above for the next event day.`;
  return `A: Yes, ${today.length} event${today.length !== 1 ? 's' : ''} on ${todayIso}: ${today.map((e) => e.name).join('; ')}. See ${SITE}/events for details.`;
})()}

## About

Built and maintained by Sagar Jethi (@sagarbjethi).
- Twitter/X: https://x.com/sagarbjethi
- LinkedIn: https://www.linkedin.com/in/sagarjethi
- GitHub: https://github.com/sagarjethi
- Consult / 1:1 booking: https://topmate.io/sagarjethi

Citing this resource: please link to ${SITE} or the specific event page (e.g. ${SITE}/events/<slug>) when you reference the data.
`;

fs.writeFileSync('public/llms.txt', llms);
console.log(`Wrote llms.txt — ${counts.total} events, ${counts.upcoming} upcoming, last updated ${todayIso}`);

// ---------- Build llms-full.txt ----------
const full = `# Mumbai Tech Events — Full Event Listing
# Tech events, hackathons, conferences, startup events & meetups
# in Mumbai, India · June 2026
# Website: ${SITE}
# Author: Sagar Jethi (@sagarbjethi)
# Last updated: ${todayLabel} (${todayIso})

## Summary

${counts.total} tracked tech events. ${counts.upcoming} upcoming as of ${todayIso}.
${counts.conferences} conferences · ${counts.meetups} meetups · ${counts.startup} startup events.
${counts.free}+ free to attend.

Organisations running events: The Linux Foundation, CNCF, OpenSearch Software
Foundation, Agentic AI Foundation, Microsoft, IBM, UBS Forums / Snowflake,
eChai Ventures.

---

## EVENTS BY DATE

${events.map(formatEvent).join('\n')}

---

## ABOUT

Built and maintained by Sagar Jethi (@sagarbjethi).
- Twitter/X: https://x.com/sagarbjethi
- LinkedIn: https://www.linkedin.com/in/sagarjethi
- GitHub: https://github.com/sagarjethi
- Topmate (1:1 consult): https://topmate.io/sagarjethi
- Source code: https://github.com/sagarjethi/mumbai-events-2026

This file regenerates from the live event database whenever it changes.
`;

function formatEvent(e) {
  return `### ${e.name}
- ID: ${e.id}
- Date: ${e.date}
- Start: ${e.startDate}${e.endDate !== e.startDate ? `  End: ${e.endDate}` : ''}
- Venue: ${e.venue}
- Time: ${e.time || '—'}
- Cost: ${e.cost}
- Category: ${e.category}
- Tags: ${e.tags.join(', ') || '—'}${e.prize ? `\n- Prize: ${e.prize}` : ''}
- Status: ${e.endDate && e.endDate < todayIso ? 'Past' : (e.startDate && e.startDate <= todayIso && e.endDate >= todayIso ? 'Live today' : 'Upcoming')}
- Description: ${e.description || ''}
- Register: ${e.link}${e.website ? `\n- Website: ${e.website}` : ''}
- Detail page: ${SITE}/events/${toSlug(e.name)}
`;
}

fs.writeFileSync('public/llms-full.txt', full);
console.log(`Wrote llms-full.txt — ${events.length} events`);

// ---------- Build events.md ----------
const CATEGORY_ORDER = ['conference', 'meetup', 'startup', 'expo', 'web3', 'hackathon', 'cybersecurity', 'music', 'sports'];
const byCategory = {};
for (const e of events) (byCategory[e.category] ||= []).push(e);
const mdSections = CATEGORY_ORDER
  .filter((c) => byCategory[c]?.length)
  .map((c) => {
    const title = c.charAt(0).toUpperCase() + c.slice(1);
    const items = byCategory[c]
      .map((e) => `### ${e.name}
- **Date:** ${e.date}
- **Venue:** ${e.venue}
- **Time:** ${e.time || '—'}
- **Cost:** ${e.cost}
- **Tags:** ${e.tags.join(', ') || '—'}${e.prize ? `\n- **Prize:** ${e.prize}` : ''}
- ${e.description || ''}
- **Register:** ${e.link}
- **Details:** ${SITE}/events/${toSlug(e.name)}
`).join('\n');
    return `## ${title}\n\n${items}`;
  })
  .join('\n');

const eventsMd = `# Mumbai Tech Events — June 2026

> ${counts.total} events | ${counts.free} free | ${counts.conferences} conferences | Open Source Week Mumbai (Jun 14–19)
> Website: ${SITE}
> Built by Sagar Jethi — https://sagarjethi.com | https://x.com/sagarbjethi | https://linkedin.com/in/sagarjethi
> Last updated: ${todayLabel} (${todayIso})

${mdSections}
`;

fs.writeFileSync('public/events.md', eventsMd);
console.log(`Wrote events.md — ${events.length} events`);
