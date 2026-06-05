// /college-fests-mumbai-2026 — SEO landing page for Mumbai college festivals.
// Curated list of recurring fests; exact 2026 dates are confirmed manually before
// the event. Until confirmed, fests show as "Tracking" with email capture.

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, Mail, Sparkles, GraduationCap, MapPin, ExternalLink, ChevronRight, Bell,
} from 'lucide-react';
import EmailCapture from './EmailCapture';
import Footer from './Footer';
import { FESTS } from '../data/college-fests';

const SITE = 'https://mumbai-events.sagarjethi.com';

export default function CollegeFestsPage() {
  const tracking = FESTS.filter((f) => f.status === 'tracking');
  const offWindow = FESTS.filter((f) => f.status === 'off-window');

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'College Fests in Mumbai — 2026',
    description: 'Curated list of recurring college festivals in Mumbai — tech, cultural, and combined fests across IISc, RVCE, PES, BMSCE, BIT, Christ, and St. Joseph\'s.',
    numberOfItems: FESTS.length,
    itemListElement: FESTS.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${f.name} — ${f.college}`,
    })),
  };
  const faqs = [
    { q: 'What are the biggest college fests in Mumbai?', a: "Pravega (IISc), Aakar (RVCE), Joshua's (St. Joseph's), Ethos (Christ University), Inventus (BMSCE), and Quasar (PES) are among the most attended." },
    { q: 'When are Mumbai college fests held?', a: 'Most tech-and-cultural fests run between Jan–Apr (spring semester). Cultural-heavy fests like Joshua\'s and Ethos run Aug–Oct.' },
    { q: 'Are college fests in Mumbai open to outsiders?', a: 'Most pro-shows and competitions are open to other-college students with a valid college ID. Some flagship events sell public tickets.' },
    { q: 'Are there hackathons inside Mumbai college fests?', a: 'Yes — Aakar, Inventus, Quasar, and Forum all host inter-college hackathons with cash prizes during their tech tracks.' },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>College Fests in Mumbai 2026 — Pravega, Aakar, Joshua's, Ethos</title>
        <meta
          name="description"
          content="Curated guide to Mumbai college fests in 2026: Pravega (IISc), Aakar (RVCE), Joshua's (St. Joseph's), Ethos (Christ), Inventus (BMSCE), Quasar (PES), and more."
        />
        <meta name="keywords" content="college fests mumbai 2026, mumbai college festivals, pravega iisc, aakar rvce, joshua's st joseph's, ethos christ university, college tech fests mumbai" />
        <link rel="canonical" href={`${SITE}/college-fests-mumbai-2026`} />
        <meta property="og:title" content="College Fests in Mumbai 2026" />
        <meta property="og:description" content="Tech and cultural college fests across IISc, RVCE, PES, BMSCE, Christ, St. Joseph's, and more." />
        <meta property="og:url" content={`${SITE}/college-fests-mumbai-2026`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5">
          <ArrowLeft className="w-4 h-4" /> All event categories
        </Link>

        {/* Hero */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-[0.12em]">
              <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-rose-600 text-white">
                <GraduationCap className="w-4 h-4" />
              </span>
              Tech · Cultural · Combined
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]">
              College Fests in <span className="text-rose-600">Mumbai</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl leading-relaxed">
              The recurring college festivals across Mumbai's biggest campuses — IISc, RVCE, PES, BMSCE, Christ, St. Joseph's. Tech tracks, cultural pro-shows, and inter-college hackathons.
            </p>
          </div>
          <div className="shrink-0 rounded-2xl bg-rose-50 ring-1 ring-rose-100 px-5 py-4 text-center">
            <div className="text-4xl font-bold tabular-nums text-rose-700">{FESTS.length}</div>
            <div className="text-[11px] uppercase tracking-wider font-semibold mt-0.5 text-rose-700 opacity-80">tracked fests</div>
          </div>
        </div>

        {/* Tracking notice */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-900">
            <strong>Live tracking:</strong> exact 2026 dates and registration links are confirmed manually 4–6 weeks before each fest. Subscribe below to get notified the moment a fest opens.
          </div>
        </div>

        {/* Subscribe */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-rose-50 border border-primary-100 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary-600 text-white items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                  <Sparkles className="w-3 h-3" /> First-to-know list
                </div>
                <p className="text-sm text-slate-700 mt-0.5">
                  Get an email the moment any Mumbai college fest opens registrations for 2026.
                </p>
              </div>
            </div>
            <div className="sm:max-w-md sm:w-[420px]">
              <EmailCapture variant="inline" placeholder="you@example.com" cta="Notify me" source="college-fests" successMessage="Subscribed 🙏" />
            </div>
          </div>
        </div>

        {/* Tracking now (within typical Spring window or scheduled) */}
        {tracking.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold text-slate-900">Spring & summer fests</h2>
              <span className="text-xs text-slate-500">Typically Jan–May</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {tracking.map((f) => <FestCard key={f.name} fest={f} accent="rose" />)}
            </div>
          </section>
        )}

        {offWindow.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold text-slate-900">Autumn fests</h2>
              <span className="text-xs text-slate-500">Typically Aug–Oct · we'll list dates closer to the date</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {offWindow.map((f) => <FestCard key={f.name} fest={f} accent="violet" />)}
            </div>
          </section>
        )}

        {/* Cross-links */}
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-xl font-semibold text-slate-900">More to explore</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <CrossLink to="/events">All events by month</CrossLink>
            <CrossLink to="/free-tech-events-mumbai">Free tech events</CrossLink>
            <CrossLink to="/ai-events-mumbai-2026">AI events 2026</CrossLink>
            <CrossLink to="/conferences-mumbai-2026">Tech conferences</CrossLink>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 mb-6">Frequently asked</h2>
          <div className="space-y-4">
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

function FestCard({ fest }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-primary-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{fest.name}</h3>
          <div className="text-sm text-slate-600 mt-0.5">{fest.college}</div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 ring-1 ring-amber-100 rounded-full px-2 py-0.5">
          <Bell className="w-3 h-3" /> Tracking
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{fest.area}</span>
        <span>·</span>
        <span>{fest.type}</span>
        <span>·</span>
        <span>{fest.typicalMonth}</span>
      </div>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{fest.blurb}</p>
      {fest.site && fest.site !== '#' && (
        <a
          href={fest.site}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          College website <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

function CrossLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50"
    >
      {children}
      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
    </Link>
  );
}
