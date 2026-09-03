// /fintech-week-mumbai-2026 - the Global Fintech Fest 2026 week hub.
// Headline event on top, then every side event (official GFF networking +
// night fests + Lu.ma sidelines) as a day-by-day agenda with type / access /
// day filters. Filters live in the URL (?day=&type=&access=&free=&q=) so a
// filtered view is shareable.

import { useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, ArrowUpRight, CalendarPlus, ChevronRight, Clock, ExternalLink,
  Globe, MapPin, Search, Sparkles, Ticket, Users, X, Moon,
} from 'lucide-react';
import { events, SERIES, SIDE_TYPES, ACCESS, CATEGORIES } from '../data';
import { toSlug } from '../utils/slug';
import { addUtm } from '../utils/utm';
import { buildGoogleCalendarUrl } from '../utils/calendar';
import { todayIso, formatClock, dateParts, eachDay } from '../utils/time';
import EventCard from './EventCard';
import EmailCapture from './EmailCapture';
import Footer from './Footer';

const EventMap = lazy(() => import('./EventMap'));

const SITE = 'https://mumbai-events.sagarjethi.com';
const SERIES_ID = 'gff-2026';
const TYPE_GLYPH = { dinner: '🍽️', sundowner: '🌇', nightfest: '🎉', breakfast: '☕', roundtable: '🗣️', community: '👥' };

// What each day of the week means inside GFF. Sep 8 is the invitation-only
// opening day; Sep 9-11 are open to delegate passes.
const DAY_NOTES = {
  '2026-09-07': 'Eve of GFF',
  '2026-09-08': 'GFF opens · invite-only sessions',
  '2026-09-09': 'GFF Day 1 · open to delegates',
  '2026-09-10': 'GFF Day 2 · the big night out',
  '2026-09-11': 'GFF Day 3 · closing day',
  '2026-09-12': 'Weekend after',
};

function isFree(e) { return /\bfree\b/i.test(e.cost || ''); }

// '7:00 PM – 9:00 PM' -> 'to 9:00 PM'; '7:00 PM onwards' -> 'onwards';
// '7:00 PM onwards (gates 6:15 PM)' -> 'onwards (gates 6:15 PM)'
function endLabel(time = '') {
  const range = time.split(/\s[–-]\s/);
  if (range.length > 1) return `to ${range[1]}`;
  const rest = time.replace(/^\d{1,2}:\d{2}\s?[AP]M\s*/i, '').trim();
  return rest;
}

export default function FintechWeekPage() {
  const series = SERIES[SERIES_ID];
  const [params, setParams] = useSearchParams();
  const day = params.get('day') || '';
  const type = params.get('type') || '';
  const access = params.get('access') || '';
  const free = params.get('free') === '1';
  const q = params.get('q') || '';
  const agendaRef = useRef(null);
  const today = todayIso();

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });
  const scrollToAgenda = () => {
    requestAnimationFrame(() => agendaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const headline = useMemo(() => events.find((e) => e.series === SERIES_ID && e.seriesRole === 'headline'), []);
  const sideEvents = useMemo(
    () => events
      .filter((e) => e.series === SERIES_ID && e.seriesRole === 'side')
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || (a.startTime || '').localeCompare(b.startTime || '')),
    [],
  );
  const programmes = useMemo(
    () => events
      .filter((e) => e.series === SERIES_ID && e.seriesRole === 'programme')
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || (a.startTime || '').localeCompare(b.startTime || '')),
    [],
  );
  const alsoThisMonth = useMemo(
    () => events.filter((e) => !e.series && e.startDate.startsWith('2026-09') && e.endDate >= today).slice(0, 6),
    [today],
  );

  const weekDays = useMemo(() => eachDay(series.startDate, series.endDate), [series]);
  const countByDay = useMemo(() => {
    const m = Object.fromEntries(weekDays.map((d) => [d, 0]));
    for (const e of sideEvents) if (m[e.startDate] !== undefined) m[e.startDate] += 1;
    return m;
  }, [weekDays, sideEvents]);
  const countByType = useMemo(() => {
    const m = {};
    for (const e of sideEvents) m[e.sideType] = (m[e.sideType] || 0) + 1;
    return m;
  }, [sideEvents]);
  const countByAccess = useMemo(() => {
    const m = {};
    for (const e of sideEvents) m[e.access] = (m[e.access] || 0) + 1;
    return m;
  }, [sideEvents]);

  const filtered = useMemo(() => {
    let list = sideEvents;
    if (day) list = list.filter((e) => e.startDate <= day && e.endDate >= day);
    if (type) list = list.filter((e) => e.sideType === type);
    if (access) list = list.filter((e) => e.access === access);
    if (free) list = list.filter(isFree);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((e) => [e.name, e.host, e.venue, e.description, ...(e.tags || [])].join(' ').toLowerCase().includes(needle));
    }
    return list;
  }, [sideEvents, day, type, access, free, q]);

  const byDay = useMemo(() => {
    const groups = new Map();
    for (const e of filtered) {
      if (!groups.has(e.startDate)) groups.set(e.startDate, []);
      groups.get(e.startDate).push(e);
    }
    return [...groups.entries()];
  }, [filtered]);

  const hasFilters = !!(day || type || access || free || q);
  const freeCount = sideEvents.filter(isFree).length;

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const title = 'Fintech Week in Mumbai 2026: Global Fintech Fest + every side event';
  const description = `Global Fintech Fest 2026 (Sep 8–11, Jio World Centre & Trident BKC) plus ${sideEvents.length} side events: official GFF dinners, sundowners, night fests and community meetups, filterable by day, type and access.`;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    numberOfItems: sideEvents.length + 1,
    itemListElement: [headline, ...sideEvents].filter(Boolean).map((e, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${SITE}/events/${toSlug(e.name)}`, name: e.name,
    })),
  };
  const faqs = [
    { q: 'When and where is Global Fintech Fest 2026?', a: 'GFF 2026 runs 8 to 11 September 2026 at Jio World Centre and Trident BKC in Bandra Kurla Complex, Mumbai. 8 September is an invitation-only day; 9 to 11 September are open to Silver, Gold and Platinum delegate passes.' },
    { q: 'Do I need a GFF pass to attend the side events?', a: `No for most of them. ${freeCount} of the ${sideEvents.length} tracked side events are free with an RSVP (usually host-approved on Lu.ma). The official GFF dinners are invite-only via request forms, and the Women’s Breakfast and Scapia Sundowner are for registered delegates.` },
    { q: 'Which night has the most side events?', a: 'Thursday 10 September: the official night fests (Open Financial, Uptik, GetePay), the Scapia Sundowner with Salim–Sulaiman, the Activate × AWS × Anthropic AI Sundowner, ElevenLabs × Lightspeed at O Pedro, and the Adyen and Karix dinners all happen that evening.' },
    { q: 'Where are the side events?', a: 'Almost all of them are within a 10-minute walk of Jio World Centre in BKC: the convention centre halls, NMACC, Trident, Social, Taftoon, SodaBottleOpenerWala and O Pedro. Use the map on this page for directions.' },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="global fintech fest 2026, gff 2026 side events, gff mumbai networking, fintech week mumbai, gff night fest, fintech events mumbai september 2026" />
        <link rel="canonical" href={`${SITE}/${series.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE}/${series.slug}`} />
        <meta property="og:image" content={`${SITE}${series.ogImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* ── Hero: the GFF banner, rebuilt ─────────────────────────────── */}
      <header className="relative overflow-hidden bg-[#12118a] text-white">
        <img src={series.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" fetchPriority="high" />
        <div className="absolute inset-0 bg-[#1a19b3]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12118a] via-[#12118a]/60 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-10">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <Link to="/events" className="hover:text-white">Events</Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">{series.weekLabel}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <p className="text-base font-semibold text-[#7dd3fc]">{series.weekLabel}</p>
              <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.02]">
                Global Fintech Fest <span className="text-[#7dd3fc]">2026</span>
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-bold">8 to 11 September, 2026</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm sm:text-base text-white/90">
                <MapPin className="w-4 h-4" /> Jio World Centre | Trident BKC, Mumbai, India
              </p>
              <div className="mt-4">
                <p className="text-base sm:text-lg font-bold">{series.theme}</p>
                <p className="text-base sm:text-lg font-bold text-[#ff7a4d]">{series.tracks.join(' | ')}</p>
                <p className="mt-1 text-sm sm:text-base text-white/85">{series.tagline}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={addUtm(series.register, 'fintech-week-hero', 'gff-2026')}
                  target="_blank" rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#1a19b3] font-semibold px-5 py-2.5 hover:bg-[#e6f6ff] transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7dd3fc]"
                >
                  Get a delegate pass <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={scrollToAgenda}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white font-semibold px-5 py-2.5 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7dd3fc]"
                >
                  Browse {sideEvents.length} side events <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Week ribbon: the memorable bit. Day cells double as the day filter. */}
            <div className="lg:col-span-5">
              <p className="text-sm text-white/80 mb-2">Side events by day. Tap a day to filter.</p>
              <div className="grid grid-cols-6 gap-1.5" role="tablist" aria-label="Filter side events by day">
                {weekDays.map((iso) => {
                  const p = dateParts(iso);
                  const on = day === iso;
                  const core = iso >= series.coreStart && iso <= series.coreEnd;
                  const isToday = iso === today;
                  return (
                    <button
                      key={iso}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => { setParam('day', on ? '' : iso); if (!on) scrollToAgenda(); }}
                      className={[
                        'group relative flex flex-col items-center rounded-xl px-1 pt-2.5 pb-2 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7dd3fc]',
                        on ? 'bg-white text-[#1a19b3]' : 'bg-white/10 hover:bg-white/20 text-white',
                      ].join(' ')}
                    >
                      <span className={`text-[10px] font-semibold ${on ? 'text-[#1a19b3]/70' : 'text-white/70'}`}>{p.dow}</span>
                      <span className="text-2xl font-extrabold leading-none mt-0.5">{p.day}</span>
                      <span className={`mt-1.5 text-[11px] font-semibold tabular-nums ${on ? 'text-[#1a19b3]' : 'text-[#7dd3fc]'}`}>
                        {countByDay[iso]} {countByDay[iso] === 1 ? 'event' : 'events'}
                      </span>
                      <span className={`mt-1.5 h-1 w-6 rounded-full ${core ? (on ? 'bg-[#ff7a4d]' : 'bg-[#ff7a4d]/90') : 'bg-transparent'}`} aria-hidden="true" />
                      {isToday && <span className="absolute -top-1.5 rounded-full bg-[#ff7a4d] text-white text-[9px] font-bold px-1.5 py-px">Today</span>}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-white/70 inline-flex items-center gap-1.5">
                <span className="h-1 w-4 rounded-full bg-[#ff7a4d]" aria-hidden="true" /> GFF main-stage days
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Headline event ───────────────────────────────────────────── */}
        {headline && (
          <section aria-labelledby="headline-heading" className="pt-12">
            <h2 id="headline-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">The headline</h2>
            <p className="mt-1 text-sm text-slate-500">Four days at BKC. Everything else on this page orbits it.</p>

            <article className="mt-5 grid lg:grid-cols-12 rounded-2xl border border-slate-200 overflow-hidden bg-white">
              <Link to={`/events/${toSlug(headline.name)}`} className="lg:col-span-5 relative min-h-[220px] bg-[#1a19b3]">
                <img src={series.image} alt={`${headline.name} exhibition floor`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12118a]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold text-white/80">Organised by</p>
                  <p className="text-sm font-semibold">{series.organisers.join(' · ')}</p>
                </div>
              </Link>
              <div className="lg:col-span-7 p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  <Link to={`/events/${toSlug(headline.name)}`} className="hover:text-[#2323e0]">{headline.name}</Link>
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{headline.description}</p>

                <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-[#2323e0] mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-semibold text-slate-900">Sep 8</dt>
                      <dd className="text-slate-600">Invitation-only sessions (Special Invitation Pass)</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-[#2323e0] mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-semibold text-slate-900">Sep 9 to 11</dt>
                      <dd className="text-slate-600">Open sessions, 8:00 AM to 5:30 PM, all delegate passes</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-[#2323e0] mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-semibold text-slate-900">Venue</dt>
                      <dd className="text-slate-600">{headline.venue}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Ticket className="w-4 h-4 text-[#2323e0] mt-0.5 shrink-0" />
                    <div>
                      <dt className="font-semibold text-slate-900">Passes</dt>
                      <dd className="text-slate-600">{headline.cost}</dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {series.tracks.map((t) => (
                    <span key={t} className="rounded-full bg-[#eef0ff] text-[#2323e0] px-3 py-1 text-xs font-semibold">{t}</span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <a href={addUtm(headline.link, 'fintech-week-headline', 'gff-2026')} target="_blank" rel="noopener noreferrer nofollow ugc" className="inline-flex items-center gap-2 rounded-xl bg-[#2323e0] hover:bg-[#1a19b3] text-white text-sm font-semibold px-4 py-2.5 transition-colors">
                    Register <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href={addUtm(series.website, 'fintech-week-headline', 'gff-2026')} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold px-4 py-2.5 transition-colors">
                    <Globe className="w-4 h-4" /> Official site
                  </a>
                  <a href={buildGoogleCalendarUrl(headline)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold px-4 py-2.5 transition-colors">
                    <CalendarPlus className="w-4 h-4" /> Add to calendar
                  </a>
                  <Link to={`/events/${toSlug(headline.name)}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#2323e0] px-2 py-2.5">
                    Event page <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── Official programmes inside the fest ───────────────────────── */}
        {programmes.length > 0 && (
          <section aria-labelledby="programmes-heading" className="pt-14">
            <h2 id="programmes-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Inside the fest</h2>
            <p className="mt-1 text-sm text-slate-500">Official GFF programmes that run on the convention floor. A delegate pass or an invite gets you in.</p>
            <div className="mt-5 grid md:grid-cols-3 gap-4">
              {programmes.map((e) => {
                const slug = toSlug(e.name);
                const cat = CATEGORIES[e.category];
                return (
                  <article key={e.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#2323e0]/40 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 font-semibold">
                        <span className={`w-1.5 h-1.5 rounded-full ${cat?.dot || 'bg-slate-400'}`} /> {cat?.label}
                      </span>
                      <span className="text-slate-500">{e.date} · {e.time}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
                      <Link to={`/events/${slug}`} className="hover:text-[#2323e0]">{e.name}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-4">{e.description}</p>
                    <ul className="mt-3 space-y-1 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate">{e.venue}</span></li>
                      {e.prize && <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Top prize {e.prize}</li>}
                      <li className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {ACCESS[e.access]?.label}</li>
                    </ul>
                    <div className="mt-auto pt-4 flex gap-2">
                      <a href={addUtm(e.link, 'fintech-week-programme', slug)} target="_blank" rel="noopener noreferrer nofollow ugc" className="inline-flex items-center gap-1.5 rounded-lg bg-[#2323e0] hover:bg-[#1a19b3] text-white text-sm font-semibold px-3.5 py-2 transition-colors">
                        Official page <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link to={`/events/${slug}`} className="inline-flex items-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3.5 py-2 transition-colors">Details</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Side events agenda ───────────────────────────────────────── */}
        <section ref={agendaRef} id="side-events" aria-labelledby="side-heading" className="pt-14 scroll-mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="side-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Side events, day by day</h2>
              <p className="mt-1 text-sm text-slate-500">
                Official GFF networking and night fests, plus the Lu.ma sidelines. {freeCount} are free with an RSVP.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={q}
                onChange={(e) => setParam('q', e.target.value)}
                placeholder="Search hosts, venues, topics"
                aria-label="Search side events"
                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2323e0]/40 focus:border-[#2323e0]"
              />
              {q && (
                <button type="button" onClick={() => setParam('q', '')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sticky filter bar */}
          <div style={{ top: 'calc(4rem + var(--subscribe-bar-h, 0px))' }} className="sticky z-30 -mx-4 sm:mx-0 mt-5 bg-white/95 backdrop-blur border-y sm:border sm:rounded-2xl border-slate-200 px-4 py-3 space-y-2.5">
            <FilterRow label="Day">
              <FilterChip on={!day} onClick={() => setParam('day', '')} count={sideEvents.length}>All week</FilterChip>
              {weekDays.map((iso) => {
                const p = dateParts(iso);
                return (
                  <FilterChip key={iso} on={day === iso} onClick={() => setParam('day', day === iso ? '' : iso)} count={countByDay[iso]} disabled={countByDay[iso] === 0}>
                    {p.dow} {p.day}
                  </FilterChip>
                );
              })}
            </FilterRow>
            <FilterRow label="Type">
              {Object.entries(SIDE_TYPES).filter(([k]) => countByType[k]).map(([k, t]) => (
                <FilterChip key={k} on={type === k} onClick={() => setParam('type', type === k ? '' : k)} count={countByType[k]} dot={t.dot}>
                  {t.label}
                </FilterChip>
              ))}
            </FilterRow>
            <FilterRow label="Access">
              {Object.entries(ACCESS).filter(([k]) => countByAccess[k]).map(([k, a]) => (
                <FilterChip key={k} on={access === k} onClick={() => setParam('access', access === k ? '' : k)} count={countByAccess[k]}>
                  {a.label}
                </FilterChip>
              ))}
              <FilterChip on={free} onClick={() => setParam('free', free ? '' : '1')} count={freeCount}>Free</FilterChip>
              {hasFilters && (
                <button type="button" onClick={clearAll} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </FilterRow>
          </div>

          <p className="mt-4 text-sm text-slate-500" aria-live="polite">
            <span className="font-semibold text-slate-800 tabular-nums">{filtered.length}</span> of {sideEvents.length} side events
            {day && <> on <span className="font-medium text-slate-800">{dateParts(day).dowLong} {dateParts(day).day} {dateParts(day).monthLong}</span></>}
            {type && <> · {SIDE_TYPES[type]?.label}</>}
            {access && <> · {ACCESS[access]?.label}</>}
            {free && <> · free</>}
          </p>

          {byDay.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
              <p className="text-slate-800 font-medium">Nothing matches those filters.</p>
              <p className="text-sm text-slate-500 mt-1">Try a different day or type, or clear everything.</p>
              <button type="button" onClick={clearAll} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#2323e0] hover:bg-[#1a19b3] text-white text-sm font-semibold px-4 py-2">
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-10">
              {byDay.map(([iso, list]) => {
                const p = dateParts(iso);
                const isPast = iso < today;
                return (
                  <section key={iso} aria-labelledby={`day-${iso}`} className={isPast ? 'opacity-70' : ''}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-slate-200 pb-2">
                      <h3 id={`day-${iso}`} className="text-lg sm:text-xl font-bold text-slate-900 whitespace-nowrap">
                        {p.dowLong}, {p.day} {p.monthLong}
                      </h3>
                      <span className="ml-auto sm:order-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">{list.length} {list.length === 1 ? 'event' : 'events'}</span>
                      <span className="basis-full sm:basis-auto sm:order-2 text-sm text-slate-500">{DAY_NOTES[iso]}</span>
                    </div>
                    <ol className="divide-y divide-slate-100">
                      {list.map((e) => <AgendaRow key={e.id} event={e} />)}
                    </ol>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Map ──────────────────────────────────────────────────────── */}
        <section aria-labelledby="map-heading" className="pt-14">
          <h2 id="map-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Where everything is</h2>
          <p className="mt-1 text-sm text-slate-500">Nearly every side event is a short walk from Jio World Centre. Pins are approximate for venues shared only on approval.</p>
          <div className="mt-5 rounded-2xl overflow-hidden border border-slate-200">
            <Suspense fallback={<div className="h-[380px] bg-slate-50 animate-pulse" aria-hidden="true" />}>
              <EventMap events={[headline, ...sideEvents].filter((e) => e && e.lat && e.lng)} height="380px" zoom={14} center={[19.0635, 72.8665]} />
            </Suspense>
          </div>
        </section>

        {/* ── Also this month ──────────────────────────────────────────── */}
        {alsoThisMonth.length > 0 && (
          <section aria-labelledby="also-heading" className="pt-14">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 id="also-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Also in Mumbai this September</h2>
                <p className="mt-1 text-sm text-slate-500">Not part of GFF, still worth your calendar.</p>
              </div>
              <Link to="/events/september-2026" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#2323e0] hover:text-[#1a19b3]">
                All September events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {alsoThisMonth.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
            <Link to="/events/september-2026" className="sm:hidden mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2323e0]">
              All September events <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {/* ── Subscribe ────────────────────────────────────────────────── */}
        <section className="mt-14 rounded-2xl bg-[#12118a] text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7dd3fc]">
                <Sparkles className="w-4 h-4" /> New side events land daily this week
              </div>
              <p className="mt-1 text-lg font-semibold">Get the GFF week digest in your inbox.</p>
              <p className="mt-1 text-sm text-white/75">One email before the fest with every new sundowner, dinner and night fest we verify.</p>
            </div>
            <div className="sm:w-[400px]">
              <EmailCapture variant="inline" placeholder="you@example.com" cta="Subscribe" source="fintech-week" successMessage="Subscribed. See you at BKC." />
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="mt-14 pb-16 border-t border-slate-200 pt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 mb-6">Frequently asked</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-900 list-none">
                  <span>{f.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-xs text-slate-500">
            Sources: <a href={series.networking} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">GFF networking page</a>, <a href={series.nightFest} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">GFF Fintech After Hours</a>, and each event’s Lu.ma page. Verified 3 September 2026.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

function FilterRow({ label, children }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 w-14 text-xs font-semibold text-slate-500">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0 flex-1">{children}</div>
    </div>
  );
}

function FilterChip({ on, onClick, count, dot, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      disabled={disabled}
      className={[
        'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2323e0]/50',
        on ? 'bg-[#2323e0] text-white border-[#2323e0]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${on ? 'bg-white' : dot}`} />}
      {children}
      {typeof count === 'number' && (
        <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums ${on ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function AgendaRow({ event: e }) {
  const type = SIDE_TYPES[e.sideType];
  const access = ACCESS[e.access];
  const slug = toSlug(e.name);
  const free = isFree(e);
  const late = (e.startTime || '') >= '19:30';
  return (
    <li className="py-4 grid grid-cols-[5.5rem_1fr] sm:grid-cols-[5.5rem_6rem_1fr_auto] gap-x-4 gap-y-3 items-start">
      <div className="pt-0.5">
        <p className="text-sm font-bold text-slate-900 tabular-nums leading-tight">{formatClock(e.startTime) || 'TBA'}</p>
        <p className="text-[11px] text-slate-500 leading-tight mt-0.5 inline-flex items-center gap-1 whitespace-nowrap">
          {late && <Moon className="w-3 h-3" aria-hidden="true" />}{endLabel(e.time)}
        </p>
      </div>
      <Link to={`/events/${slug}`} className="hidden sm:block w-24 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-orange-400 to-rose-600 relative">
        {e.image ? (
          <img src={e.image} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-white/80 text-2xl" aria-hidden="true">{TYPE_GLYPH[e.sideType] || '🥂'}</span>
        )}
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          {type && (
            <span className={`inline-flex items-center gap-1 rounded-full ring-1 px-2 py-0.5 text-[11px] font-semibold ${type.chip}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} /> {type.short}
            </span>
          )}
          {free && <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold">Free</span>}
          {e.featured && <span className="inline-flex items-center rounded-full bg-[#eef0ff] text-[#2323e0] px-2 py-0.5 text-[11px] font-semibold">Featured</span>}
        </div>
        <h4 className="font-semibold text-slate-900 leading-snug">
          <Link to={`/events/${slug}`} className="hover:text-[#2323e0]">{e.name}</Link>
        </h4>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{e.description}</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {e.host && <li className="inline-flex items-center gap-1.5 min-w-0"><Users className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate max-w-[16rem]">{e.host}</span></li>}
          <li className="inline-flex items-center gap-1.5 min-w-0"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="truncate max-w-[20rem]">{e.venue}</span></li>
          {access && <li className="inline-flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-slate-400" /> {access.label}</li>}
        </ul>
      </div>
      <div className="col-span-2 sm:col-span-1 flex sm:flex-col gap-2 sm:items-stretch">
        <a
          href={addUtm(e.link, 'fintech-week-agenda', slug)}
          target="_blank" rel="noopener noreferrer nofollow ugc"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2323e0] hover:bg-[#1a19b3] text-white text-sm font-semibold px-3.5 py-2 transition-colors"
        >
          {e.access === 'invite' ? 'Request invite' : 'RSVP'} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <Link to={`/events/${slug}`} className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3.5 py-2 transition-colors">
          Details
        </Link>
      </div>
    </li>
  );
}
