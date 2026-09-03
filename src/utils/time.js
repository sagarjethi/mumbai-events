// Small date/time helpers shared by the series hub + spotlight components.

export function pad(n) { return n < 10 ? `0${n}` : `${n}`; }

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// '19:00' -> '7:00 PM'
export function formatClock(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
}

// '2026-09-10' -> { dow: 'Wed', dowLong: 'Wednesday', day: 10, month: 'Sep', monthLong: 'September' }
export function dateParts(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const f = (opts) => date.toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
  return {
    dow: f({ weekday: 'short' }),
    dowLong: f({ weekday: 'long' }),
    day: d,
    month: f({ month: 'short' }),
    monthLong: f({ month: 'long' }),
    year: y,
  };
}

// Every ISO day from start to end inclusive.
export function eachDay(startIso, endIso) {
  const out = [];
  let cur = startIso;
  while (cur <= endIso) {
    out.push(cur);
    const [y, m, d] = cur.split('-').map(Number);
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    cur = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
  }
  return out;
}

// Every month that has at least one event, in order. Drives the homepage
// calendar strip, so adding a month of data extends the strip automatically.
export function monthsWithEvents(pool) {
  const seen = new Map();
  for (const e of pool) {
    if (!e.startDate) continue;
    const [y, m] = e.startDate.split('-').map(Number);
    const key = `${y}-${m}`;
    if (!seen.has(key)) {
      seen.set(key, {
        year: y,
        monthNum: m,
        short: new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }),
      });
    }
  }
  return [...seen.values()].sort((a, b) => a.year - b.year || a.monthNum - b.monthNum);
}
