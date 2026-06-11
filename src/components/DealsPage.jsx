import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Ticket, Copy, Check, ExternalLink, Mail, ArrowLeft, ShieldCheck, Calendar, MapPin,
} from 'lucide-react';
import { events } from '../data/events';
import { deals as STANDALONE_DEALS } from '../data/deals';
import CouponCard from './CouponCard';
import { toSlug } from '../utils/slug';
import { addUtm } from '../utils/utm';

const SITE = 'https://mumbai-events.sagarjethi.com';
const PAGE_URL = `${SITE}/deals`;

// One-tap copy chip, shared by the standalone-deal cards.
function CopyChip({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* code stays visible to copy manually */ }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy promo code ${code}`}
      className="group inline-flex items-center gap-2 shrink-0 rounded-lg border border-dashed border-emerald-400 bg-white px-3 py-2 font-mono text-sm font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
    >
      <span>{code}</span>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />}
    </button>
  );
}

export default function DealsPage() {
  // Events that carry coupons — the calendar is the source of truth.
  const eventsWithCoupons = events
    .filter((e) => (e.coupons || []).length > 0)
    .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

  const eventCouponCount = eventsWithCoupons.reduce((n, e) => n + e.coupons.length, 0);
  const totalCodes = eventCouponCount + STANDALONE_DEALS.length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tech Event Discount Codes & Deals — Mumbai 2026',
    description:
      'Verified promo codes and discounts for Mumbai tech events in June–July 2026, including KubeCon + CloudNativeCon India and Open Source Summit India.',
    url: PAGE_URL,
    isPartOf: { '@id': `${SITE}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...STANDALONE_DEALS.map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: d.title,
          url: d.url || PAGE_URL,
        })),
        ...eventsWithCoupons.map((e, i) => ({
          '@type': 'ListItem',
          position: STANDALONE_DEALS.length + i + 1,
          name: `${e.name} — discount code`,
          url: `${SITE}/events/${toSlug(e.name)}`,
        })),
      ],
    },
  };

  return (
    <>
      <Helmet>
        <title>Tech Event Discount Codes & Deals — Mumbai June–July 2026</title>
        <meta
          name="description"
          content="Verified promo & discount codes for Mumbai tech events — KubeCon India, Open Source Summit India and more. One-tap copy, updated as new codes drop."
        />
        <meta name="keywords" content="KubeCon India discount code, Open Source Summit India promo code, Mumbai tech event coupons, KUBESIMPLIFY, TECHBEATLY, 2026" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Tech Event Discount Codes & Deals — Mumbai 2026" />
        <meta property="og:description" content="Verified promo & discount codes for Mumbai tech events — KubeCon India, Open Source Summit India and more." />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen">
        {/* Sub nav */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Events
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
              <Ticket className="w-3.5 h-3.5" />
              Deals & discount codes
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Tech-event discount codes for Mumbai
            </h1>
            <p className="mt-3 max-w-2xl text-white/85 text-base md:text-lg">
              {totalCodes} verified promo {totalCodes === 1 ? 'code' : 'codes'} across {eventsWithCoupons.length}
              {' '}event{eventsWithCoupons.length === 1 ? '' : 's'} — KubeCon + CloudNativeCon India, Open Source
              Summit India and more. One tap to copy, then apply at the official checkout.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-white/70">
              <ShieldCheck className="w-3.5 h-3.5" />
              Codes shared by organizers & community partners · verified on{' '}
              <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toISOString().slice(0, 10)}</time>
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
          {/* Standalone partner deals */}
          {STANDALONE_DEALS.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Partner deals</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {STANDALONE_DEALS.map((d) => (
                  <div key={d.id} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">{d.title}</h3>
                        {d.scope && <p className="text-xs text-slate-500 mt-0.5">{d.scope}</p>}
                      </div>
                      {d.discount && (
                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                          {d.discount}
                        </span>
                      )}
                    </div>
                    {d.price && <p className="mt-2 text-sm text-slate-600">{d.price}</p>}
                    {d.note && <p className="mt-0.5 text-xs text-slate-400">{d.note}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {d.code ? <CopyChip code={d.code} /> : d.url ? (
                        <a href={addUtm(d.url, 'deals', d.id)} target="_blank" rel="noopener noreferrer nofollow ugc"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm font-semibold transition-colors">
                          Get deal <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : null}
                      {d.code && d.url && (
                        <a href={addUtm(d.url, 'deals', d.id)} target="_blank" rel="noopener noreferrer nofollow ugc"
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800">
                          Register & apply <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {d.eventSlug && (
                        <Link to={`/events/${d.eventSlug}`} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary-600">
                          View event
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Event-tied coupons */}
          <section className="space-y-6">
            {STANDALONE_DEALS.length > 0 && (
              <h2 className="text-lg font-bold text-slate-900">Codes by event</h2>
            )}
            {eventsWithCoupons.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No active discount codes right now — check back as new events are added.</p>
              </div>
            ) : (
              eventsWithCoupons.map((e) => {
                const slug = toSlug(e.name);
                return (
                  <div key={e.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                      <div className="min-w-0">
                        <Link to={`/events/${slug}`} className="text-base font-bold text-slate-900 hover:text-primary-700 transition-colors">
                          {e.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{e.date}</span>
                          <span className="inline-flex items-center gap-1 min-w-0"><MapPin className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{e.venue}</span></span>
                        </div>
                      </div>
                      <Link to={`/events/${slug}`} className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">
                        Event details <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <div className="p-2 sm:p-4">
                      <CouponCard event={e} />
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* Trust note + submit CTA */}
          <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div className="text-sm text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800">How we handle codes</p>
                <p className="mt-1">
                  Every code here is shared by an event organizer or an official community partner. Codes can
                  change or expire without notice, so always confirm the final price on the official checkout page
                  before paying. Have a code to add?{' '}
                  <a href="mailto:sagarblockchaindev@gmail.com?subject=Mumbai%20tech%20event%20discount%20code"
                    className="font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Send it in
                  </a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
