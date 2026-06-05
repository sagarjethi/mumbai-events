// Reusable horizontal scrollable date strip.
// Used by HomeCalendar (April + May) and month detail pages (single month).
//
// Props:
//   events       — array to derive day-counts from (caller decides scope)
//   selectedDate — currently active ISO date or null
//   onDateSelect — receives ISO or null on click
//   accent       — 'slate' | 'violet' | etc — selected-cell color (defaults to slate)
//   onAfterSelect — optional, called after a date is chosen (e.g. to scroll)
//   months       — optional [{ year, monthNum, short }, ...]; defaults to Apr+May 2026

import { useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data';

const DEFAULT_MONTHS = [
  { year: 2026, monthNum: 6, short: 'June' },
  { year: 2026, monthNum: 7, short: 'July' },
];

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildDays(months) {
  const out = [];
  for (let i = 0; i < months.length; i++) {
    const m = months[i];
    const daysInMonth = new Date(Date.UTC(m.year, m.monthNum, 0)).getUTCDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${m.year}-${pad(m.monthNum)}-${pad(d)}`;
      const date = new Date(Date.UTC(m.year, m.monthNum - 1, d));
      out.push({
        iso,
        day: d,
        monthKey: `${m.year}-${m.monthNum}`,
        monthShort: m.short,
        // Insert a divider before any month after the first one
        firstOfMonth: d === 1 && i > 0,
        dow: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase(),
      });
    }
  }
  return out;
}

const ACCENT = {
  slate:  { sel: 'bg-slate-900 border-slate-900 text-white',     dot: 'bg-white/70' },
  violet: { sel: 'bg-violet-700 border-violet-700 text-white',   dot: 'bg-white/70' },
  primary:{ sel: 'bg-primary-700 border-primary-700 text-white', dot: 'bg-white/70' },
};

export default function EventDateStrip({ events: pool, selectedDate, onDateSelect, accent = 'slate', onAfterSelect, months }) {
  const today = todayIso();
  const scrollerRef = useRef(null);
  const monthsList = months && months.length ? months : DEFAULT_MONTHS;
  const days = useMemo(() => buildDays(monthsList), [monthsList]);
  const accentStyles = ACCENT[accent] || ACCENT.slate;

  // Pre-compute per-day event lists once
  const dayMap = useMemo(() => {
    const map = new Map();
    for (const d of days) map.set(d.iso, []);
    for (const e of pool) {
      if (!e.startDate || !e.endDate) continue;
      // Walk every day in the event's range
      let cur = e.startDate;
      while (cur <= e.endDate) {
        if (map.has(cur)) map.get(cur).push(e);
        const [y, m, d] = cur.split('-').map(Number);
        const next = new Date(Date.UTC(y, m - 1, d + 1));
        cur = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
      }
    }
    return map;
  }, [days, pool]);

  // Auto-scroll on mount + change.
  // Priority: an explicit selectedDate (centered) > today (anchored near the
  // left edge so the user sees "now + what's next" first, with past dates
  // still scrollable backwards) > first day with events.
  useEffect(() => {
    if (selectedDate && dayMap.has(selectedDate)) {
      const el = scrollerRef.current?.querySelector(`[data-iso="${selectedDate}"]`);
      if (el && scrollerRef.current) {
        const offset = el.offsetLeft - scrollerRef.current.clientWidth / 2 + el.clientWidth / 2;
        scrollerRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
      }
      return;
    }
    // No explicit selection — anchor on today (if it's in range) or fall back
    // to the first day with events.
    let anchor = null;
    let anchorMode = 'left'; // 'left' = put at start; 'center' = center it
    if (dayMap.has(today)) {
      anchor = today;
    } else {
      for (const d of days) {
        if (dayMap.get(d.iso).length > 0) { anchor = d.iso; anchorMode = 'center'; break; }
      }
    }
    if (!anchor) return;
    const el = scrollerRef.current?.querySelector(`[data-iso="${anchor}"]`);
    if (!el || !scrollerRef.current) return;
    if (anchorMode === 'left') {
      // Put today ~one cell-width from the left edge so a small prior buffer
      // is still visible, hinting that past dates can be scrolled back to.
      const offset = el.offsetLeft - el.clientWidth - 6;
      scrollerRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    } else {
      const offset = el.offsetLeft - scrollerRef.current.clientWidth / 2 + el.clientWidth / 2;
      scrollerRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  }, [selectedDate, today, days, dayMap]);

  const onSelect = (iso) => {
    const next = selectedDate === iso ? null : iso;
    onDateSelect(next);
    if (next && onAfterSelect) onAfterSelect();
  };

  const scrollBy = (dir) => {
    const s = scrollerRef.current;
    if (!s) return;
    s.scrollBy({ left: dir * (s.clientWidth * 0.85), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-md transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-md transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div aria-hidden="true" className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none" />
      <div aria-hidden="true" className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />

      <div
        ref={scrollerRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 sm:-mx-1 px-4 sm:px-1"
      >
        <div className="flex gap-1.5 snap-x pb-2">
          {days.map((d) => {
            const list = dayMap.get(d.iso) || [];
            const has = list.length > 0;
            const isSelected = selectedDate === d.iso;
            const isToday = d.iso === today;
            const cats = [...new Set(list.map((e) => e.category))].slice(0, 3);

            return (
              <div key={d.iso} className="flex items-stretch gap-1.5">
                {d.firstOfMonth && (
                  <div className="self-stretch flex flex-col items-center justify-center px-2">
                    <div className="w-px flex-1 bg-slate-200" />
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 my-1.5 whitespace-nowrap">{d.monthShort}</div>
                    <div className="w-px flex-1 bg-slate-200" />
                  </div>
                )}
                <button
                  data-iso={d.iso}
                  onClick={() => has && onSelect(d.iso)}
                  disabled={!has}
                  aria-pressed={isSelected}
                  aria-label={`${d.dow} ${d.day} — ${list.length} event${list.length !== 1 ? 's' : ''}`}
                  className={[
                    'snap-start shrink-0 w-[60px] sm:w-[68px] py-3 px-1.5 rounded-xl text-center transition border',
                    isSelected
                      ? accentStyles.sel
                      : has
                        ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900'
                        : 'bg-white border-slate-100 text-slate-300 cursor-default',
                    isToday && !isSelected ? 'ring-1 ring-amber-300 bg-amber-50/60' : '',
                  ].join(' ')}
                >
                  <div className={[
                    'text-[10px] font-bold uppercase tracking-[0.1em]',
                    isSelected ? 'text-white/70' : (isToday ? 'text-amber-700' : 'text-slate-400'),
                  ].join(' ')}>
                    {d.dow}
                  </div>
                  <div className={[
                    'mt-0.5 text-xl font-bold tabular-nums leading-none',
                    isSelected ? 'text-white' : (has ? 'text-slate-900' : 'text-slate-300'),
                  ].join(' ')}>
                    {d.day}
                  </div>
                  <div className="mt-2 h-2 flex items-center justify-center gap-0.5">
                    {has ? (
                      cats.length > 1 ? (
                        cats.map((cat, i) => (
                          <span
                            key={i}
                            className={[
                              'w-1 h-1 rounded-full',
                              isSelected ? accentStyles.dot : (CATEGORIES[cat]?.dot || 'bg-slate-400'),
                            ].join(' ')}
                          />
                        ))
                      ) : (
                        <span className={[
                          'w-3 h-0.5 rounded-full',
                          isSelected ? accentStyles.dot : (CATEGORIES[cats[0]]?.dot || 'bg-slate-400'),
                        ].join(' ')} />
                      )
                    ) : null}
                  </div>
                  {has && (
                    <div className={[
                      'mt-1 text-[10px] font-semibold tabular-nums',
                      isSelected ? 'text-white/80' : 'text-slate-500',
                    ].join(' ')}>
                      {list.length}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
