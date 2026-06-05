import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Sparkles,
  ArrowLeft,
  Clock,
  Tag,
  Trophy,
  Code,
  Filter,
  X as XIcon,
} from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';
import EventCard from './EventCard';
import EmailCapture from './EmailCapture';
import MonthCalendar from './MonthCalendar';
import EventDateStrip from './EventDateStrip';
import Footer from './Footer';

const SITE = 'https://mumbai-events.sagarjethi.com';

const MONTHS = {
  'june-2026': {
    label: 'June 2026',
    short: 'June',
    year: 2026,
    monthNum: 6,
    blurb:
      "June is Mumbai's open-source month — the Linux Foundation brings Open Source Week to Jio World Convention Centre (KubeCon + CloudNativeCon India, Open Source Summit India, OpenSearchCon, MCP Dev Summit), alongside Microsoft Build //localhost, a Data & Gen AI Summit, and a busy run of founder and AI community meetups.",
  },
  'july-2026': {
    label: 'July 2026',
    short: 'July',
    year: 2026,
    monthNum: 7,
    blurb:
      "July adds the Postman Agents & APIs developer meetup and the Automation Expo at NESCO Goregaon. More community meetups (GDG, AWS UG, eChai) typically publish closer to the date — this page refreshes as they're confirmed.",
  },
};
const MONTH_ORDER = Object.keys(MONTHS);

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function eventsForMonth(monthNum, year) {
  // Include any event whose date range overlaps the target month, not just
  // events that start in it — otherwise multi-month events (e.g. SIGMOD/PODS
  // 2026-05-31 → 2026-06-05) appear on the calendar's June days but get
  // filtered out by the month-scoped event list, producing empty results
  // when those days are clicked.
  const monthStart = `${year}-${pad(monthNum)}-01`;
  const lastDay = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const monthEnd = `${year}-${pad(monthNum)}-${pad(lastDay)}`;
  return events
    .filter((e) => {
      if (!e.startDate || !e.endDate) return false;
      return e.startDate <= monthEnd && e.endDate >= monthStart;
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function formatHumanDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  return `${weekday}, ${month} ${d}`;
}

function isFree(e) {
  return /\bfree\b/i.test(e.cost || '');
}

function getMonthHighlights(list, max = 3) {
  // Featured first, then prize-bearing, then earliest dated.
  const ranked = [...list].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.prize && !b.prize) return -1;
    if (!a.prize && b.prize) return 1;
    return (a.startDate || '').localeCompare(b.startDate || '');
  });
  return ranked.slice(0, max);
}

// ==========================================================================
// /events  — Months Index
// ==========================================================================

export function MonthsIndexPage() {
  const total = events.length;
  const totalFree = events.filter(isFree).length;
  const totalHackathons = events.filter((e) => e.category === 'hackathon').length;
  const totalConferences = events.filter((e) => e.category === 'conference').length;

  // SEO: FAQPage JSON-LD answers high-volume queries directly.
  const faqs = [
    { q: 'How many tech events are happening in Mumbai in June 2026?', a: `${total}+ public tech events are tracked for June 2026 — ${totalConferences} conferences and dozens of meetups across AI, cloud-native, open source, data and startup programming.` },
    { q: 'What is the biggest tech event in Mumbai in June 2026?', a: 'The Linux Foundation\'s Open Source Week (Jun 14–19, Jio World Convention Centre, BKC) is the headline — KubeCon + CloudNativeCon India, Open Source Summit India, OpenSearchCon India and the MCP Dev Summit, expected to draw thousands of attendees.' },
    { q: 'Are tech events in Mumbai free?', a: `Yes — ${totalFree}+ events on this directory are free to attend, including JS Mumbai, the eChai startup meetups, Microsoft Build //localhost: Mumbai, the IBM Agentic AI Summit and the weekly AI co-working and tech mixer meetups.` },
    { q: 'Where can I find AI events in Mumbai?', a: 'Use /ai-events-mumbai-2026 for the full AI-focused list, or open the June calendar above and filter by tag.' },
    { q: 'How is this directory different from Luma or Eventbrite?', a: 'It aggregates events across Lu.ma, Eventbrite, Meetup, the Linux Foundation, eChai and AllEvents into one link-verified, deduplicated directory. Each event is cross-checked against its primary source.' },
  ];
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mumbai Tech Events by Month — 2026',
    numberOfItems: MONTH_ORDER.length,
    itemListElement: MONTH_ORDER.map((slug, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/events/${slug}`,
      name: MONTHS[slug].label,
    })),
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`Mumbai Tech Events 2026 — ${total}+ Hackathons, Conferences & Meetups by Month`}</title>
        <meta
          name="description"
          content={`Every public tech event in Mumbai, organized by month. ${total}+ events · ${totalHackathons} hackathons · ${totalConferences} conferences · ${totalFree}+ free. June 2026.`}
        />
        <meta name="keywords" content="mumbai tech events 2026, mumbai tech events june 2026, kubecon india 2026, open source summit india, mumbai conferences, ai events mumbai, developer meetups mumbai" />
        <link rel="canonical" href={`${SITE}/events`} />
        <meta property="og:title" content={`Mumbai Tech Events 2026 — ${total}+ events by month`} />
        <meta property="og:description" content="June 2026 tech events in Mumbai — conferences, hackathons, AI/ML meetups, all link-verified." />
        <meta property="og:url" content={`${SITE}/events`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Hero */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]">
          Mumbai Tech Events <span className="text-primary-600">by Month</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl leading-relaxed">
          {total}+ link-verified tech events in Mumbai — hackathons, developer conferences, AI/ML workshops, Web3 fests, and college events. Organized by month so you can plan ahead.
        </p>

        {/* Hero stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Tracked events" value={total} />
          <Stat label="Free events" value={totalFree} accent="emerald" />
          <Stat label="Hackathons" value={totalHackathons} accent="violet" icon={Trophy} />
          <Stat label="Conferences" value={totalConferences} accent="primary" icon={CalendarDays} />
        </div>

        {/* Subscribe — sits above the month cards as requested */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-violet-50 border border-primary-100 p-6 sm:p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary-600 text-white items-center justify-center shadow-sm shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700">
                <Sparkles className="w-3.5 h-3.5" /> Stay in the loop
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Get the weekly Mumbai tech digest
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 max-w-xl">
                One short email per week. New hackathons, conferences, and meetups across {total}+ tracked events. No spam, unsubscribe anytime.
              </p>
              <div className="mt-4">
                <EmailCapture
                  variant="inline"
                  placeholder="you@example.com"
                  cta="Subscribe"
                  source="month-index"
                  successMessage="Subscribed 🙏  Watch your inbox."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Month cards with highlights */}
        <h2 className="sr-only">Pick a month</h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {MONTH_ORDER.map((slug) => {
            const m = MONTHS[slug];
            const list = eventsForMonth(m.monthNum, m.year);
            const highlights = getMonthHighlights(list, 3);
            const free = list.filter(isFree).length;
            const hax = list.filter((e) => e.category === 'hackathon').length;
            return (
              <Link
                key={slug}
                to={`/events/${slug}`}
                className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="h-1.5 bg-gradient-to-r from-primary-400 via-violet-400 to-rose-400" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary-600">{m.year}</div>
                      <h3 className="text-2xl font-bold text-slate-900 mt-0.5 group-hover:text-primary-700 transition-colors">
                        {m.short}
                      </h3>
                    </div>
                    <span className="inline-flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                      <span className="text-xl font-bold leading-none">{list.length}</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider mt-0.5">events</span>
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">{m.blurb}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {free > 0 && <Pill icon="●" tone="emerald">{free} free</Pill>}
                    {hax > 0 && <Pill icon="●" tone="violet">{hax} hackathon{hax !== 1 ? 's' : ''}</Pill>}
                  </div>

                  {highlights.length > 0 && (
                    <ul className="mt-5 space-y-1.5 text-sm">
                      {highlights.map((e) => (
                        <li key={e.id} className="flex items-start gap-2 text-slate-700">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${CATEGORIES[e.category]?.dot || 'bg-slate-400'}`} />
                          <span className="line-clamp-1">
                            <span className="text-slate-500 font-medium tabular-nums">{e.date}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            <span className="text-slate-900">{e.name}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                    See all {list.length} {m.short} events <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Browse by category — internal link cluster, helps SEO + discovery */}
        <section className="mt-12" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-semibold text-slate-900 mb-1">
            Browse by category
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Curated landing pages for the most-searched event types in Mumbai.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <CategoryLink to="/free-tech-events-mumbai" title="Free tech events" desc="No ticket cost — hackathons, AWS, YC" tone="emerald" />
            <CategoryLink to="/ai-events-mumbai-2026" title="AI events 2026" desc="GenAI, LLMs, agentic AI, MCP" tone="violet" />
            <CategoryLink to="/conferences-mumbai-2026" title="Tech conferences" desc="GIDS, AWS Summit, Rust India" tone="primary" />
            <CategoryLink to="/web3-events-mumbai-2026" title="Web3 & crypto" desc="W3Summit, blockchain meetups" tone="amber" />
            <CategoryLink to="/tech-events-this-weekend-mumbai" title="This weekend" desc="Friday → Sunday — refreshes daily" tone="slate" />
            <CategoryLink to="/college-fests-mumbai-2026" title="College fests" desc="Pravega, Aakar, Joshua's, Ethos" tone="rose" />
            <CategoryLink to="/accelerators" title="Mumbai accelerators" desc="13 verified startup programs" tone="primary" />
          </div>
        </section>

        {/* FAQ — visible + JSON-LD-backed for AI/Google ranking */}
        <section className="mt-16 border-t border-slate-200 pt-10" aria-labelledby="faq-heading">
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
        </section>
      </div>
      <Footer />
    </div>
  );
}

// ==========================================================================
// /events/<month-2026>  — Month Detail
// ==========================================================================

const QUICK_FILTERS = [
  { id: null, label: 'All events', icon: Calendar },
  { id: 'today', label: 'Today', icon: Clock },
  { id: 'weekend', label: 'This weekend', icon: CalendarDays },
  { id: 'free', label: 'Free only', icon: Tag },
  { id: 'hackathon', label: 'Hackathons', icon: Trophy },
  { id: 'conference', label: 'Conferences', icon: Code },
];

export default function MonthEventsPage({ month: propMonth }) {
  const params = useParams();
  const month = propMonth || params.month;
  const meta = MONTHS[month];

  const [selectedDate, setSelectedDate] = useState(null);
  const [quickFilter, setQuickFilter] = useState(null);
  const eventsRef = useRef(null);

  const monthEvents = useMemo(() => meta ? eventsForMonth(meta.monthNum, meta.year) : [], [meta]);

  const filtered = useMemo(() => {
    let list = monthEvents;
    if (selectedDate) {
      list = list.filter((e) => e.startDate <= selectedDate && e.endDate >= selectedDate);
    }
    if (quickFilter === 'today') {
      const t = todayIso();
      list = list.filter((e) => e.startDate <= t && e.endDate >= t);
    } else if (quickFilter === 'weekend') {
      list = list.filter((e) => {
        const [y, m, d] = e.startDate.split('-').map(Number);
        const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
        return dow === 5 || dow === 6 || dow === 0; // Fri evening, Sat, Sun
      });
    } else if (quickFilter === 'free') {
      list = list.filter(isFree);
    } else if (quickFilter === 'hackathon' || quickFilter === 'conference') {
      list = list.filter((e) => e.category === quickFilter);
    }
    return list;
  }, [monthEvents, selectedDate, quickFilter]);

  const isFiltered = !!selectedDate || !!quickFilter;
  const byCategory = useMemo(() => {
    const groups = {};
    for (const e of filtered) (groups[e.category] = groups[e.category] || []).push(e);
    return groups;
  }, [filtered]);

  // Auto-scroll to results when a single-date filter is applied
  useEffect(() => {
    if (selectedDate && eventsRef.current) {
      eventsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDate]);

  if (!meta) return <Navigate to="/events" replace />;

  // Stats for hero
  const stats = {
    total: monthEvents.length,
    free: monthEvents.filter(isFree).length,
    hackathons: monthEvents.filter((e) => e.category === 'hackathon').length,
    conferences: monthEvents.filter((e) => e.category === 'conference').length,
  };

  // Prev/next month for footer nav
  const idx = MONTH_ORDER.indexOf(month);
  const prev = idx > 0 ? MONTH_ORDER[idx - 1] : null;
  const next = idx < MONTH_ORDER.length - 1 ? MONTH_ORDER[idx + 1] : null;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Mumbai Tech Events — ${meta.label}`,
    description: meta.blurb,
    numberOfItems: monthEvents.length,
    itemListElement: monthEvents.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/events/${toSlug(e.name)}`,
      name: e.name,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`Mumbai Tech Events — ${meta.label} | ${monthEvents.length} Events`}</title>
        <meta
          name="description"
          content={`Complete list of ${monthEvents.length} tech events in Mumbai, ${meta.label}. ${meta.blurb}`}
        />
        <link rel="canonical" href={`${SITE}/events/${month}`} />
        <meta property="og:title" content={`Mumbai Tech Events — ${meta.label}`} />
        <meta property="og:description" content={`${monthEvents.length} tech events in Mumbai, ${meta.label}.`} />
        <meta property="og:url" content={`${SITE}/events/${month}`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-5" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to="/events" className="hover:text-slate-900">Events</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-medium">{meta.label}</span>
        </nav>

        {/* Hero */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary-600">{meta.year}</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mt-1">
              {meta.short} Tech Events in <span className="text-primary-600">Mumbai</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl">{meta.blurb}</p>
          </div>
        </div>

        {/* Hero stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Events" value={stats.total} />
          <Stat label="Free" value={stats.free} accent="emerald" />
          <Stat label="Hackathons" value={stats.hackathons} accent="violet" icon={Trophy} />
          <Stat label="Conferences" value={stats.conferences} accent="primary" icon={CalendarDays} />
        </div>

        {/* Cross-month link */}
        <div className="mt-5 flex flex-wrap gap-2">
          {MONTH_ORDER.filter((slug) => slug !== month).map((slug) => (
            <Link
              key={slug}
              to={`/events/${slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50/40 transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              See {MONTHS[slug].label} events
            </Link>
          ))}
        </div>

        {/* Subscribe block */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-violet-50 border border-primary-100 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary-600 text-white items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                  <Sparkles className="w-3 h-3" /> Don't miss {meta.short}
                </div>
                <p className="text-sm text-slate-700 mt-0.5">
                  Weekly digest of every {meta.short} event in Mumbai — straight to your inbox.
                </p>
              </div>
            </div>
            <div className="sm:max-w-md sm:w-[420px]">
              <EmailCapture
                variant="inline"
                placeholder="you@example.com"
                cta="Subscribe"
                source={`month:${month}`}
                successMessage="Subscribed 🙏"
              />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <section className="mt-10" aria-labelledby="calendar-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="calendar-heading" className="text-xl font-semibold text-slate-900">Pick a date</h2>
            <span className="text-xs text-slate-500 hidden sm:inline">Click any highlighted day to filter</span>
          </div>

          {/* Compact horizontal strip — same affordance as the homepage */}
          <div className="mb-4">
            <EventDateStrip
              events={monthEvents}
              months={[{ year: meta.year, monthNum: meta.monthNum, short: meta.short }]}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onAfterSelect={() => {
                if (eventsRef.current) eventsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              accent="slate"
            />
          </div>

          <MonthCalendar
            year={meta.year}
            monthNum={meta.monthNum}
            monthLabel={meta.label}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            {Object.entries(CATEGORIES)
              .filter(([key]) => monthEvents.some((e) => e.category === key))
              .map(([key, cat]) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.dot}`} />
                  {cat.label}
                </span>
              ))}
          </div>
        </section>

        {/* Events section */}
        <section ref={eventsRef} className="mt-12 scroll-mt-20" aria-labelledby="events-heading">
          {/* Quick filter chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Filter className="w-3.5 h-3.5" /> Quick filters
            </span>
            {QUICK_FILTERS.map((q) => {
              const Icon = q.icon;
              const active = quickFilter === q.id;
              return (
                <button
                  key={q.label}
                  onClick={() => setQuickFilter(q.id)}
                  aria-pressed={active}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition',
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {q.label}
                </button>
              );
            })}
          </div>

          {/* Active filter summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 id="events-heading" className="text-2xl font-semibold text-slate-900 flex items-center gap-3 flex-wrap">
              {selectedDate ? formatHumanDate(selectedDate) : `All ${meta.short} events`}
              <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
                {filtered.length}
              </span>
            </h2>
            {isFiltered && (
              <button
                onClick={() => { setSelectedDate(null); setQuickFilter(null); }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <XIcon className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <EmptyState
              selectedDate={selectedDate}
              monthLabel={meta.label}
              onClear={() => { setSelectedDate(null); setQuickFilter(null); }}
            />
          )}

          {/* When a single date is picked: flat time-sorted grid (sparse-by-category looks bad) */}
          {selectedDate && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...filtered]
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                .map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}

          {/* Otherwise: grouped by category, with anchor jump-list */}
          {!selectedDate && filtered.length > 0 && (
            <>
              {Object.keys(byCategory).length > 1 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(byCategory).map(([cat, list]) => (
                    <a
                      key={cat}
                      href={`#cat-${cat}`}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${CATEGORIES[cat]?.color || 'bg-slate-100 text-slate-700'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-500'}`} />
                      {CATEGORIES[cat]?.label || cat} <span className="opacity-70">({list.length})</span>
                    </a>
                  ))}
                </div>
              )}

              {Object.entries(byCategory).map(([cat, list]) => (
                <div key={cat} id={`cat-${cat}`} className="mt-10 first:mt-0 scroll-mt-20">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-500'}`} />
                    {CATEGORIES[cat]?.label || cat}
                    <span className="text-sm text-slate-500 font-normal">({list.length})</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {list.map((e) => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        {/* Prev / Next month navigation */}
        {(prev || next) && (
          <nav className="mt-16 grid sm:grid-cols-2 gap-3 border-t border-slate-200 pt-8" aria-label="Adjacent months">
            {prev ? (
              <Link
                to={`/events/${prev}`}
                className="group rounded-xl border border-slate-200 p-4 hover:border-primary-300 hover:bg-primary-50/30 transition"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </div>
                <div className="font-semibold text-slate-900 group-hover:text-primary-700">{MONTHS[prev].label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{eventsForMonth(MONTHS[prev].monthNum, MONTHS[prev].year).length} events</div>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                to={`/events/${next}`}
                className="group rounded-xl border border-slate-200 p-4 sm:text-right hover:border-primary-300 hover:bg-primary-50/30 transition"
              >
                <div className="flex sm:justify-end items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <div className="font-semibold text-slate-900 group-hover:text-primary-700">{MONTHS[next].label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{eventsForMonth(MONTHS[next].monthNum, MONTHS[next].year).length} events</div>
              </Link>
            ) : <div />}
          </nav>
        )}
      </div>

      <Footer />
    </div>
  );
}

// ==========================================================================
// Local UI primitives
// ==========================================================================

const ACCENT = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-700', ring: 'ring-primary-100', icon: 'text-primary-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100', icon: 'text-emerald-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-100', icon: 'text-violet-500' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-100', icon: 'text-slate-500' },
};

function Stat({ label, value, accent = 'slate', icon: Icon }) {
  const a = ACCENT[accent] || ACCENT.slate;
  return (
    <div className={`rounded-xl ${a.bg} ${a.text} ring-1 ${a.ring} px-4 py-3 flex items-center gap-3`}>
      {Icon && <Icon className={`w-5 h-5 ${a.icon}`} />}
      <div>
        <div className="text-2xl font-bold leading-none tabular-nums">{value}</div>
        <div className="text-[11px] uppercase tracking-wider font-semibold mt-1 opacity-80">{label}</div>
      </div>
    </div>
  );
}

function Pill({ children, tone = 'slate' }) {
  const map = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    violet: 'bg-violet-50 text-violet-700 ring-violet-100',
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-2.5 py-0.5 text-xs font-semibold ${map[tone] || map.slate}`}>
      {children}
    </span>
  );
}

const TONE_BORDER = {
  primary: 'hover:border-primary-300 hover:bg-primary-50/30',
  emerald: 'hover:border-emerald-300 hover:bg-emerald-50/30',
  violet: 'hover:border-violet-300 hover:bg-violet-50/30',
  rose: 'hover:border-rose-300 hover:bg-rose-50/30',
  amber: 'hover:border-amber-300 hover:bg-amber-50/30',
  slate: 'hover:border-slate-300 hover:bg-slate-50/30',
};
const TONE_DOT = {
  primary: 'bg-primary-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  slate: 'bg-slate-500',
};

function CategoryLink({ to, title, desc, tone = 'slate' }) {
  return (
    <Link
      to={to}
      className={`group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition ${TONE_BORDER[tone] || TONE_BORDER.slate}`}
    >
      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${TONE_DOT[tone] || TONE_DOT.slate}`} />
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-slate-900 group-hover:text-primary-700">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5 truncate">{desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition shrink-0" />
    </Link>
  );
}

function EmptyState({ selectedDate, monthLabel, onClear }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-10 text-center">
      <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-3" />
      <p className="text-slate-700 font-medium">
        {selectedDate ? `No events on ${formatHumanDate(selectedDate)}` : `No events match your filters in ${monthLabel}`}
      </p>
      <p className="text-sm text-slate-500 mt-1">
        Try a different date or clear your filters to see everything.
      </p>
      <button
        onClick={onClear}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2"
      >
        <XIcon className="w-3.5 h-3.5" /> Clear filters
      </button>
    </div>
  );
}
