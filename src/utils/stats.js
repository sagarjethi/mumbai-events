// Single source of truth for all derived counts/prize totals shown across the site.
// If you add or change an event in `data/events.js`, every number on the site
// (Header pills, Stats cards, Hackathons hero, JSON-LD, meta descriptions in
// index.html via the Vite plugin) updates automatically.

import { events } from '../data/events';

// --- Constants ---

export const INR_PER_USD = 85;

// --- Parsers ---

export function parsePrizeBuckets(prize) {
  if (!prize) return { usd: 0, inr: 0 };
  const match = prize.match(/([$₹])([\d,]+)/);
  if (!match) return { usd: 0, inr: 0 };
  const amount = parseInt(match[2].replace(/,/g, ''), 10);
  return match[1] === '$' ? { usd: amount, inr: 0 } : { usd: 0, inr: amount };
}

export function parsePrizeUsd(prize) {
  const { usd, inr } = parsePrizeBuckets(prize);
  return usd + Math.round(inr / INR_PER_USD);
}

// --- Formatters ---

export function formatUsdCompact(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function formatInrCompact(n) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 2)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${n}`;
}

// --- Helpers ---

function isFree(e) {
  if (!e.cost) return false;
  return e.cost === 'Free' || e.cost.toLowerCase().includes('free');
}

// --- Computed counts ---

export const EVENT_COUNT = events.length;
export const FREE_COUNT = events.filter(isFree).length;
export const HACKATHON_COUNT = events.filter((e) => e.category === 'hackathon').length;
export const CONFERENCE_COUNT = events.filter((e) => e.category === 'conference').length;
export const MEETUP_COUNT = events.filter((e) => e.category === 'meetup').length;

// --- Prize totals ---

export const PRIZE_TOTALS = events.reduce(
  (acc, e) => {
    const { usd, inr } = parsePrizeBuckets(e.prize);
    acc.usd += usd;
    acc.inr += inr;
    if (e.prize) acc.count += 1;
    return acc;
  },
  { usd: 0, inr: 0, count: 0 }
);

export const TOTAL_PRIZE_USD_RAW = PRIZE_TOTALS.usd + Math.round(PRIZE_TOTALS.inr / INR_PER_USD);
export const TOTAL_PRIZE_USD_COMPACT = formatUsdCompact(TOTAL_PRIZE_USD_RAW);
export const TOTAL_PRIZE_LABEL = `${TOTAL_PRIZE_USD_COMPACT}+`;

export const PRIZE_USD_COMPACT = PRIZE_TOTALS.usd > 0 ? formatUsdCompact(PRIZE_TOTALS.usd) : null;
export const PRIZE_INR_COMPACT = PRIZE_TOTALS.inr > 0 ? formatInrCompact(PRIZE_TOTALS.inr) : null;

// --- Date range ---

const sortedStarts = [...events].map((e) => e.startDate).sort();
const sortedEnds = [...events].map((e) => e.endDate || e.startDate).sort();
export const FIRST_EVENT_DATE = sortedStarts[0];
export const LAST_EVENT_DATE = sortedEnds[sortedEnds.length - 1];

// --- Display labels (used by index.html template tokens too) ---

export const EVENT_COUNT_LABEL = `${EVENT_COUNT}+`;
export const HACKATHON_COUNT_LABEL = `${HACKATHON_COUNT}`;
export const FREE_COUNT_LABEL = `${FREE_COUNT}`;
