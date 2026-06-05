// Compact horizontal strip — next ~10 days that have at least one event.
// Used on the homepage; click a day to filter the EventsGrid below.
// "View full calendar" link points to /events for the full month grid.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { events, CATEGORIES } from '../data/events';

const MAX_DAYS = 10;

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildUpcomingDays(limit = MAX_DAYS) {
  const today = todayIso();
  const dayMap = new Map(); // iso → { iso, day, label, dow, count, dotsByCat }
  for (const e of events) {
    if (!e.startDate || !e.endDate) continue;
    if (e.endDate < today) continue; // already past
    // Walk every day in the event's range
    let cursor = e.startDate < today ? today : e.startDate;
    while (cursor <= e.endDate) {
      if (!dayMap.has(cursor)) {
        const [y, m, d] = cursor.split('-').map(Number);
        const date = new Date(Date.UTC(y, m - 1, d));
        dayMap.set(cursor, {
          iso: cursor,
          day: d,
          label: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
          dow: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase(),
          count: 0,
          cats: new Set(),
        });
      }
      const entry = dayMap.get(cursor);
      entry.count += 1;
      entry.cats.add(e.category);
      // bump cursor by one day
      const [y, m, d] = cursor.split('-').map(Number);
      const next = new Date(Date.UTC(y, m - 1, d + 1));
      cursor = `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
    }
  }
  return [...dayMap.values()]
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .slice(0, limit);
}

export default function UpcomingDaysStrip({ selectedDate, onDateSelect }) {
  const today = todayIso();
  const days = useMemo(() => buildUpcomingDays(MAX_DAYS), []);

  if (days.length === 0) {
    return (
      <section id="calendar" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center">
          <p className="text-slate-700 font-medium">No upcoming events on the calendar.</p>
          <p className="text-sm text-slate-500 mt-1">
            <Link to="/events" className="text-primary-600 hover:text-primary-700 font-semibold">Browse by month →</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="calendar" aria-label="Upcoming event days" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-5 gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-600">Next {days.length} event days</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            What's happening soon
          </h2>
        </div>
        <Link
          to="/events"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group"
        >
          <CalendarRange className="w-4 h-4" />
          Full calendar
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Horizontal scroll strip */}
      <div className="-mx-4 sm:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 px-4 sm:px-0 pb-2 snap-x snap-mandatory">
          {days.map((d) => {
            const isSelected = selectedDate === d.iso;
            const isToday = d.iso === today;
            const cats = [...d.cats].slice(0, 4);

            return (
              <button
                key={d.iso}
                onClick={() => onDateSelect(isSelected ? null : d.iso)}
                aria-pressed={isSelected}
                aria-label={`${d.dow} ${d.label} ${d.day} — ${d.count} event${d.count !== 1 ? 's' : ''}`}
                className={[
                  'group shrink-0 snap-start w-[88px] sm:w-[100px] rounded-2xl border bg-white p-3 text-center transition-all',
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2 -translate-y-0.5 shadow-md'
                    : 'border-slate-200 hover:border-primary-300 hover:-translate-y-0.5 hover:shadow-md',
                  isToday && !isSelected ? 'bg-amber-50/40 border-amber-200' : '',
                ].join(' ')}
              >
                <div className={[
                  'text-[10px] font-bold uppercase tracking-[0.1em]',
                  isSelected ? 'text-white' : (isToday ? 'text-amber-700' : 'text-slate-400'),
                ].join(' ')}>
                  {isToday ? 'Today' : d.dow}
                </div>
                <div className={[
                  'mt-1 inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold tabular-nums transition',
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-900 group-hover:bg-slate-100',
                ].join(' ')}>
                  {d.day}
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{d.label}</div>
                <div className="mt-1.5 flex justify-center items-center gap-0.5 min-h-[8px]">
                  {cats.map((cat, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-400'}`}
                    />
                  ))}
                </div>
                <div className={[
                  'text-[11px] font-semibold mt-1 tabular-nums',
                  isSelected ? 'text-slate-900' : 'text-slate-600',
                ].join(' ')}>
                  {d.count}
                </div>
              </button>
            );
          })}

          {/* Trailing "see more" tile */}
          <Link
            to="/events"
            className="group shrink-0 snap-start w-[88px] sm:w-[100px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-3 text-center hover:border-primary-300 hover:bg-primary-50/30 transition flex flex-col items-center justify-center gap-1.5"
          >
            <CalendarRange className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition" />
            <span className="text-[11px] font-semibold text-slate-600 leading-tight group-hover:text-primary-700">
              Full calendar
              <ArrowRight className="inline w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Legend (compact) */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
        {Object.entries(CATEGORIES)
          .filter(([key]) => days.some((d) => d.cats.has(key)))
          .map(([key, cat]) => (
            <span key={key} className="inline-flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
              {cat.label}
            </span>
          ))}
      </div>

      {/* Mobile: full-calendar link below the strip */}
      <div className="mt-4 sm:hidden text-center">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          <CalendarRange className="w-4 h-4" /> Open full calendar
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
