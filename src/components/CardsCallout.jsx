// Slim homepage banner sitting between <Stats /> and <HomeCalendar />.
// Single click → /cards. Deliberately understated so it doesn't compete
// with the hero or the calendar strip below.

import { Link } from 'react-router-dom';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function CardsCallout() {
  return (
    <section
      aria-label="Shareable event cards"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
    >
      <Link
        to="/cards"
        className="group block rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:border-slate-300 hover:shadow-sm transition"
      >
        <div className="px-5 sm:px-6 py-4 flex items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-semibold text-slate-900">
                Download shareable cards
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-100 text-primary-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                New
              </span>
            </div>
            <div className="mt-0.5 text-xs sm:text-sm text-slate-600">
              Auto-built carousels &amp; single cards for every week + month — post to X, LinkedIn, IG.
            </div>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
            Browse all cards
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </section>
  );
}
