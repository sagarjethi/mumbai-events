// Pure helpers to derive the list of available "periods" (weeks + months)
// from the events data. The CardsPage uses this to populate its period
// picker without any hand-curation — every week/month with at least one
// event becomes an option.

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isoFromUtc(d) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// Monday-anchored ISO week. Returns the Monday date (UTC) for the week
// containing the given ISO date.
function weekMonday(iso) {
  const d = parseIso(iso);
  const dow = d.getUTCDay(); // 0=Sun..6=Sat
  const offset = (dow + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - offset);
  return d;
}

function addDays(d, n) {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + n);
  return next;
}

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatRange(startIso, endIso) {
  const s = parseIso(startIso);
  const e = parseIso(endIso);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  if (sameMonth) {
    return `${MONTH_SHORTS[s.getUTCMonth()]} ${s.getUTCDate()}–${e.getUTCDate()}, ${s.getUTCFullYear()}`;
  }
  return `${MONTH_SHORTS[s.getUTCMonth()]} ${s.getUTCDate()} – ${MONTH_SHORTS[e.getUTCMonth()]} ${e.getUTCDate()}, ${e.getUTCFullYear()}`;
}

// Return all Monday-anchored weeks that contain at least one event start
// inside [earliestEvent, latestEvent]. We anchor on event-start so we don't
// generate empty weeks for periods we don't cover.
export function getAvailablePeriods(events) {
  const valid = events.filter((e) => e.startDate);
  if (valid.length === 0) return { weeks: [], months: [] };

  const sortedStarts = [...new Set(valid.map((e) => e.startDate))].sort();
  const earliest = sortedStarts[0];
  const latest = sortedStarts[sortedStarts.length - 1];

  // Weeks
  const weeks = [];
  let cursor = weekMonday(earliest);
  const lastMonday = weekMonday(latest);
  while (cursor <= lastMonday) {
    const startIso = isoFromUtc(cursor);
    const endIso = isoFromUtc(addDays(cursor, 6));
    const has = valid.some((e) => e.startDate >= startIso && e.startDate <= endIso);
    if (has) {
      weeks.push({
        kind: 'week',
        id: `week-${startIso}`,
        startDate: startIso,
        endDate: endIso,
        label: `Week of ${formatRange(startIso, endIso)}`,
        short: formatRange(startIso, endIso),
      });
    }
    cursor = addDays(cursor, 7);
  }

  // Months
  const monthKeys = [...new Set(valid.map((e) => e.startDate.slice(0, 7)))].sort();
  const months = monthKeys.map((mk) => {
    const [y, m] = mk.split('-').map(Number);
    const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const startIso = `${mk}-01`;
    const endIso = `${mk}-${pad(lastDay)}`;
    return {
      kind: 'month',
      id: `month-${mk}`,
      startDate: startIso,
      endDate: endIso,
      label: `${MONTH_LABELS[m - 1]} ${y}`,
      short: `${MONTH_LABELS[m - 1]} ${y}`,
    };
  });

  return { weeks, months };
}

// Pick a sensible default period: the week containing today if it has events,
// else the next future week with events, else the first week, else the
// first month.
export function pickDefaultPeriod({ weeks, months }) {
  const today = todayIso();
  const containsToday = weeks.find((w) => w.startDate <= today && w.endDate >= today);
  if (containsToday) return containsToday;
  const futureWeek = weeks.find((w) => w.endDate >= today);
  if (futureWeek) return futureWeek;
  if (weeks.length > 0) return weeks[0];
  return months[0] || null;
}

// Filter the global events list to a single period.
export function eventsInPeriod(events, period) {
  if (!period) return [];
  return events
    .filter((e) => e.startDate && e.startDate >= period.startDate && e.startDate <= period.endDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
