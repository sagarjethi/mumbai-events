// "Featured this month" spotlight used on the homepage and /events index.
// One large headline card (the series headline event) plus the two featured
// side events. Everything is derived from data: mark an event `featured`
// with a `series` and it shows up here.

import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink, MapPin, Users } from 'lucide-react';
import { events, SERIES, SIDE_TYPES, ACCESS } from '../data';
import { toSlug } from '../utils/slug';
import { addUtm } from '../utils/utm';
import { todayIso, formatClock } from '../utils/time';

function pickSpotlight() {
  const today = todayIso();
  const headline = events.find((e) => e.seriesRole === 'headline' && e.endDate >= today);
  if (!headline) return null;
  const series = SERIES[headline.series];
  const sides = events
    .filter((e) => e.series === headline.series && e.seriesRole === 'side' && e.featured && e.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || (a.startTime || '').localeCompare(b.startTime || ''))
    .slice(0, 2);
  return { headline, series, sides };
}

export default function FeaturedSpotlight({ compact = false }) {
  const spot = pickSpotlight();
  if (!spot) return null;
  const { headline, series, sides } = spot;
  const hub = `/${series.slug}`;

  return (
    <section aria-labelledby="spotlight-heading" className={compact ? 'mt-10' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10'}>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 id="spotlight-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Featured this September
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {series.weekLabel}: the headline fest and the side events worth planning around.
          </p>
        </div>
        <Link to={hub} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#2323e0] hover:text-[#1a19b3] group">
          Full Fintech Week guide
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Headline */}
        <Link
          to={hub}
          className="group relative lg:col-span-3 min-h-[300px] sm:min-h-[340px] rounded-2xl overflow-hidden bg-[#1a19b3] text-white ring-1 ring-[#2323e0]/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7dd3fc]"
          aria-label={`${headline.name}: open the Fintech Week guide`}
        >
          <img src={series.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12118a] via-[#1d1cc4]/70 to-[#2323e0]/40" />
          <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
            <p className="text-sm font-semibold text-white/85">{series.weekLabel}</p>
            <h3 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.05]">
              Global Fintech Fest <span className="text-[#7dd3fc]">2026</span>
            </h3>
            <p className="mt-2 text-base sm:text-lg font-semibold">8 to 11 September, 2026</p>
            <p className="inline-flex items-center gap-1.5 text-sm text-white/85"><MapPin className="w-3.5 h-3.5" /> Jio World Centre | Trident BKC, Mumbai</p>
            <p className="mt-3 text-sm font-semibold text-[#ff8a5c]">{series.tracks.join('  |  ')}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#1a19b3] text-sm font-semibold px-4 py-2 group-hover:bg-[#e6f6ff] transition-colors">
                See the whole week <ArrowRight className="w-4 h-4" />
              </span>
              <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur text-white text-sm font-medium px-3.5 py-2">
                {events.filter((e) => e.series === series.id && e.seriesRole === 'side').length} side events tracked
              </span>
            </div>
          </div>
        </Link>

        {/* Featured side events */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {sides.map((e) => {
            const type = SIDE_TYPES[e.sideType];
            const access = ACCESS[e.access];
            const slug = toSlug(e.name);
            return (
              <article key={e.id} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-[#2323e0]/40 hover:shadow-lg transition-all">
                <div className="flex gap-4 p-4">
                  <Link to={`/events/${slug}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-orange-400 to-rose-600">
                    {e.image && <img src={e.image} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {type && (
                        <span className={`inline-flex items-center gap-1 rounded-full ring-1 px-2 py-0.5 text-[11px] font-semibold ${type.chip}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} /> {type.short}
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full bg-[#eef0ff] text-[#2323e0] px-2 py-0.5 text-[11px] font-semibold">GFF Week</span>
                    </div>
                    <h3 className="mt-1.5 font-semibold text-slate-900 leading-snug line-clamp-2">
                      <Link to={`/events/${slug}`} className="hover:text-[#2323e0]">{e.name}</Link>
                    </h3>
                    <ul className="mt-1.5 space-y-0.5 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-400" /> {e.date} · {formatClock(e.startTime)}</li>
                      {e.host && <li className="flex items-center gap-1.5 min-w-0"><Users className="w-3 h-3 text-slate-400 shrink-0" /> <span className="truncate">{e.host}</span></li>}
                    </ul>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5">
                  <span className="text-xs text-slate-500">{access?.label}</span>
                  <a
                    href={addUtm(e.link, 'spotlight', slug)}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2323e0] hover:text-[#1a19b3]"
                  >
                    RSVP <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Link to={hub} className="sm:hidden mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2323e0]">
        Full Fintech Week guide <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
