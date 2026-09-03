// Homepage calendar - one horizontal strip across every month that has
// events. Visual + behaviour live in <EventDateStrip>; this component wires
// up the homepage scope (all events) and the after-select scroll.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { events as ALL_EVENTS, CATEGORIES } from '../data';
import EventDateStrip from './EventDateStrip';
import { monthsWithEvents } from '../utils/time';

export default function HomeCalendar({ selectedDate, onDateSelect }) {
  const months = useMemo(() => monthsWithEvents(ALL_EVENTS), []);
  const monthCounts = useMemo(
    () => months.map((m) => ({
      ...m,
      count: ALL_EVENTS.filter((e) => (e.startDate || '').startsWith(`${m.year}-${String(m.monthNum).padStart(2, '0')}`)).length,
    })),
    [months],
  );
  const rangeLabel = months.length
    ? `${months[0].short}–${months[months.length - 1].short} ${months[months.length - 1].year}`
    : '';

  const onAfterSelect = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector('#events');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section id="calendar" aria-label={`Event calendar, ${rangeLabel}`} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">Event calendar</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">{rangeLabel}</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
          {monthCounts.map((m, i) => (
            <span key={`${m.year}-${m.monthNum}`} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">·</span>}
              <span className="font-medium text-slate-700">{m.short} {m.count}</span>
            </span>
          ))}
        </div>
      </div>

      <EventDateStrip
        events={ALL_EVENTS}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onAfterSelect={onAfterSelect}
        accent="slate"
        months={months}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
          {Object.entries(CATEGORIES)
            .filter(([key]) => ALL_EVENTS.some((e) => e.category === key))
            .map(([key, cat]) => (
              <span key={key} className="inline-flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                {cat.label}
              </span>
            ))}
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 group"
        >
          Open full calendar
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
