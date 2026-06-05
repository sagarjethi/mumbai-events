import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronRight, ArrowRight, ExternalLink as LinkIcon, Bell, Building2, ArrowLeft,
} from 'lucide-react';
import ExternalLink from './ExternalLink';
import EmailCapture from './EmailCapture';
import RevealEmailButton from './RevealEmailButton';
import {
  accelerators,
  ACCELERATOR_SECTORS,
  ACCELERATOR_STAGES,
  ACCELERATOR_EQUITY,
} from '../data/accelerators';

const SITE_URL = 'https://mumbai-events.sagarjethi.com';

// Inline SVG fallbacks for brand icons (lucide v1 doesn't ship these)
function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const equityChipStyles = {
  'non-dilutive':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'equity-required': 'bg-violet-50 text-violet-700 border-violet-200',
  'mixed':           'bg-slate-100 text-slate-700 border-slate-200',
};

export default function AcceleratorDetail() {
  const { slug } = useParams();

  const accelerator = useMemo(
    () => accelerators.find((a) => a.id === slug),
    [slug]
  );

  const related = useMemo(() => {
    if (!accelerator) return [];
    const sectors = new Set(accelerator.sectorFocus || []);
    return accelerators
      .filter((a) => a.id !== accelerator.id)
      .map((a) => ({
        a,
        overlap: (a.sectorFocus || []).filter((s) => sectors.has(s)).length,
      }))
      .filter((x) => x.overlap > 0)
      .sort((x, y) => y.overlap - x.overlap)
      .slice(0, 3)
      .map((x) => x.a);
  }, [accelerator]);

  if (!accelerator) {
    return <Navigate to="/accelerators" replace />;
  }

  const a = accelerator;
  const detailUrl = `${SITE_URL}/accelerators/${a.id}`;
  const title = `${a.name} — Mumbai Accelerator | Apply, Stage, Equity, Sectors`;
  const description = a.tagline
    ? `${a.tagline} ${a.programName ? `Program: ${a.programName}.` : ''} Stage: ${ACCELERATOR_STAGES[a.stage]?.label || a.stage}. Equity: ${ACCELERATOR_EQUITY[a.equity]?.label || a.equity}. Ticket: ${a.ticketSize || 'varies'}.`
    : `${a.name} — Mumbai-presence accelerator.`;

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: a.name,
    url: a.url,
    description: a.tagline,
    parentOrganization: a.vendor ? { '@type': 'Organization', name: a.vendor } : undefined,
    sameAs: [a.twitter, a.linkedin].filter(Boolean),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Mumbai Events', item: SITE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Accelerators',     item: SITE_URL + '/accelerators' },
      { '@type': 'ListItem', position: 3, name: a.name,             item: detailUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={detailUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={detailUrl} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
          <ol className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-slate-500 flex-wrap">
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li><Link to="/accelerators" className="hover:text-primary-600 transition-colors">Accelerators</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li aria-current="page" className="font-medium text-slate-800 truncate">{a.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-gradient-to-br from-violet-600 via-primary-600 to-primary-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold border border-white/10">
                Mumbai · {ACCELERATOR_STAGES[a.stage]?.label || 'All stages'}
              </span>
              {a.equity && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${equityChipStyles[a.equity] || equityChipStyles.mixed}`}>
                  {ACCELERATOR_EQUITY[a.equity]?.label}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {a.name}
            </h1>
            {(a.programName || a.vendor) && (
              <p className="mt-2 text-sm md:text-base text-white/70">
                {a.programName && a.programName !== a.name ? `${a.programName} · ` : ''}
                {a.vendor || 'Independent'}
              </p>
            )}

            {a.tagline && (
              <p className="mt-4 text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">
                {a.tagline}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ExternalLink
                href={a.applyUrl || a.url}
                campaign={a.applyUrl ? 'accelerator-detail-apply' : 'accelerator-detail-visit'}
                content={a.id}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-primary-700 hover:bg-amber-50 hover:text-primary-800 font-semibold text-sm transition-colors shadow-lg shadow-primary-900/20"
              >
                {a.applyUrl ? 'Apply now' : 'Visit website'}
                <LinkIcon className="w-4 h-4" />
              </ExternalLink>
              <a
                href="#alerts"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Notify me when this opens
              </a>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — facts + sectors + about */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick facts */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Program at a glance</h2>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4">
                <Fact label="Stage"    value={ACCELERATOR_STAGES[a.stage]?.label || a.stage || '—'} />
                <Fact label="Equity"   value={ACCELERATOR_EQUITY[a.equity]?.label || a.equity || '—'} />
                <Fact label="Ticket"   value={a.ticketSize || '—'} />
                <Fact label="Duration" value={a.programLength || '—'} />
              </dl>
            </section>

            {/* Sectors */}
            {a.sectorFocus?.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-3">Sectors they back</h2>
                <div className="flex flex-wrap gap-2">
                  {a.sectorFocus.map((s) => {
                    const meta = ACCELERATOR_SECTORS[s];
                    if (!meta) return null;
                    return (
                      <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {meta.label}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Sources & socials */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Official channels</h2>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <ExternalLink href={a.url} campaign="accelerator-detail-website" content={a.id} className="text-primary-600 hover:text-primary-700 font-medium break-all">
                    {a.url}
                  </ExternalLink>
                </li>
                {a.applyUrl && (
                  <li className="flex items-center gap-3">
                    <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <ExternalLink href={a.applyUrl} campaign="accelerator-detail-apply" content={a.id} className="text-primary-600 hover:text-primary-700 font-medium break-all">
                      Apply: {a.applyUrl}
                    </ExternalLink>
                  </li>
                )}
                {a.twitter && (
                  <li className="flex items-center gap-3">
                    <XIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <ExternalLink href={a.twitter} campaign="accelerator-detail-twitter" content={a.id} className="text-slate-700 hover:text-primary-700 font-medium">
                      {a.twitter.replace(/^https?:\/\/(x\.com|twitter\.com)\//, '@')}
                    </ExternalLink>
                  </li>
                )}
                {a.linkedin && (
                  <li className="flex items-center gap-3">
                    <LinkedInIcon className="w-4 h-4 text-[#0A66C2] shrink-0" />
                    <ExternalLink href={a.linkedin} campaign="accelerator-detail-linkedin" content={a.id} className="text-slate-700 hover:text-primary-700 font-medium break-all">
                      LinkedIn
                    </ExternalLink>
                  </li>
                )}
                {a.publicEmail && (
                  <li className="flex items-center gap-3">
                    <span className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <RevealEmailButton accelerator={a} />
                    <span className="text-xs text-slate-400">(publicly listed on their site)</span>
                  </li>
                )}
              </ul>
            </section>

            {/* Related accelerators */}
            {related.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">Apply to these in parallel</h2>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/accelerators/${r.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{r.name}</h3>
                          <p className="text-xs text-slate-500 truncate">{r.tagline}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/accelerators"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Browse all 13 accelerators
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </section>
            )}
          </div>

          {/* Right sidebar — sticky alerts + 1:1 link */}
          <aside className="lg:col-span-1 space-y-6">
            <section
              id="alerts"
              className="bg-gradient-to-br from-violet-600 via-primary-600 to-primary-800 rounded-2xl p-6 text-white sticky top-20 scroll-mt-20"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-300/20 text-amber-200 text-xs font-bold mb-3 border border-amber-300/30">
                <Bell className="w-3 h-3" /> Application alerts
              </div>
              <h2 className="text-lg font-bold leading-tight mb-2">
                Get pinged when {a.name} opens its next cohort.
              </h2>
              <p className="text-xs text-white/75 mb-4 leading-relaxed">
                One email when applications open. Includes deadline, eligibility, and the apply link.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <EmailCapture
                  variant="stacked"
                  placeholder="founder@yourstartup.com"
                  cta="Notify me"
                  source={`accelerator-detail:${a.id}`}
                  tag="accelerator-applications"
                  successMessage="You're on the list."
                />
              </div>
              <p className="mt-4 text-[11px] text-white/60 leading-relaxed">
                Stuck choosing?{' '}
                <a
                  href="https://topmate.io/sagarjethi"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline decoration-white/30 hover:decoration-white/80 hover:text-white transition-colors"
                >
                  Book a 15-min 1:1
                </a>{' '}
                — pick the right one for your stage.
              </p>
            </section>
          </aside>
        </main>

        {/* Footer */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-center">
          <Link
            to="/accelerators"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Mumbai accelerators
          </Link>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-bold text-slate-900 leading-snug">{value}</dd>
    </div>
  );
}
