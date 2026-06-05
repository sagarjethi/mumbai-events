// Shared helpers + tokens for every CardSlide style. Pure: no JSX.

export const DOMAIN = 'mumbai-events.sagarjethi.com';

export const FONT_STACK = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
// Mono used by the Ticket / data-style flourishes
export const MONO_STACK = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const MONTH_SHORTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function dayLabel(iso) {
  const d = parseIso(iso);
  return `${MONTH_SHORTS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function dowLabel(iso) {
  const d = parseIso(iso);
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getUTCDay()];
}

// Returns the area-scaled px for a single proportional unit, given the
// slide's width. All other sizes scale off this so a square 1080 and a
// 9:16 1080×1920 share the same visual rhythm.
export function fs(w, ratio) {
  return Math.round(w * ratio);
}

// Capacity hints used by styles when deciding "how many events fit".
// Tuned visually for each format; tweak per-style if needed.
export function eventCapacity(w, h, sizeId) {
  // Square: tight; portrait: room; story: lots of room.
  if (sizeId === 'square') return 6;
  if (sizeId === 'portrait') return 9;
  return 14; // story
}
