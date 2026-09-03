// Site-wide strip under the nav for the current headline series (GFF week).
// Renders only while the series is upcoming or live, then disappears on its
// own. Non-sticky so it never competes with the nav + subscribe bar.

import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Landmark } from 'lucide-react';
import { events, SERIES } from '../data';
import { todayIso } from '../utils/time';

function daysUntil(iso, today) {
  const [y1, m1, d1] = today.split('-').map(Number);
  const [y2, m2, d2] = iso.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export default function SeriesBanner() {
  const location = useLocation();
  const today = todayIso();
  const series = Object.values(SERIES).find((s) => s.endDate >= today);
  if (!series) return null;
  if (location.pathname === `/${series.slug}`) return null;

  const sideCount = events.filter((e) => e.series === series.id && e.seriesRole === 'side').length;
  const delta = daysUntil(series.coreStart, today);
  const live = today >= series.coreStart && today <= series.coreEnd;
  const when = live
    ? 'Happening now'
    : delta === 0 ? 'Starts today'
    : delta === 1 ? 'Starts tomorrow'
    : delta <= 7 ? `Next week · in ${delta} days`
    : `In ${delta} days`;

  return (
    <Link
      to={`/${series.slug}`}
      className="group block bg-[#12118a] text-white hover:bg-[#1a19b3] transition-colors"
      aria-label={`${series.name}: ${when}. Open the Fintech Week guide.`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 text-sm">
        <span className="hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 shrink-0">
          <Landmark className="w-4 h-4" />
        </span>
        <span className="inline-flex items-center gap-1.5 shrink-0 font-semibold text-[#ff8a5c]">
          {live && <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a5c] animate-pulse" aria-hidden="true" />}
          {when}
        </span>
        <span className="min-w-0 truncate">
          <span className="font-semibold">Global Fintech Fest <span className="text-[#7dd3fc]">2026</span></span>
          <span className="text-white/80"> · 8 to 11 Sep · Jio World Centre, BKC · {sideCount} side events mapped</span>
        </span>
        <span className="ml-auto shrink-0 inline-flex items-center gap-1 font-semibold whitespace-nowrap">
          <span className="hidden sm:inline">See the week</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
