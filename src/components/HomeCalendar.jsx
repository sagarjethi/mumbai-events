// Homepage calendar — single horizontal strip across June 2026.
// Visual + behaviour live in <EventDateStrip>; this component just wires up
// the homepage scope (all events) and the after-select scroll.

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { events as ALL_EVENTS, CATEGORIES } from '../data';
import EventDateStrip from './EventDateStrip';

export default function HomeCalendar({ selectedDate, onDateSelect }) {
  const monthCounts = useMemo(() => ({
    jun: ALL_EVENTS.filter((e) => (e.startDate || '').startsWith('2026-06')).length,
    jul: ALL_EVENTS.filter((e) => (e.startDate || '').startsWith('2026-07')).length,
  }), []);

  const onAfterSelect = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector('#events');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section id="calendar" aria-label="Event calendar — June–July 2026" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">Event calendar</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">June–July 2026</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-700">June {monthCounts.jun}</span>
          <span className="text-slate-300">·</span>
          <span className="font-medium text-slate-700">July {monthCounts.jul}</span>
        </div>
      </div>

      <EventDateStrip
        events={ALL_EVENTS}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onAfterSelect={onAfterSelect}
        accent="slate"
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
