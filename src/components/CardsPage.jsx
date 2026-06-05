// /cards — shareable-card studio. Pick a period (week/month), a format
// (carousel/single), a size, a color theme, optionally search-filter the
// events shown, then download or share the result.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Download,
  Search,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.778 13.019H3.555V9h3.56v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import * as htmlToImage from 'html-to-image';
import qrcode from 'qrcode';
import JSZip from 'jszip';

import { events as ALL_EVENTS } from '../data';
import {
  getAvailablePeriods,
  pickDefaultPeriod,
  eventsInPeriod,
} from './cards/periods';
import { buildSlides, SIZES, FORMATS } from './cards/buildSlides';
import { THEMES, THEME_KEYS, getTheme } from './cards/themes';
import { STYLES, STYLE_KEYS } from './cards/styles';
import CardSlider from './cards/CardSlider';
import { twitterIntent, linkedinIntent, whatsappIntent, copyLink } from '../utils/share';
import Footer from './Footer';

const SITE = 'https://mumbai-events.sagarjethi.com';
const PAGE_URL = `${SITE}/cards`;

function deepLinkFor(period) {
  if (!period) return SITE;
  if (period.kind === 'month') {
    const [y, m] = period.startDate.split('-').map(Number);
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    return `${SITE}/events/${months[m - 1]}-${y}`;
  }
  return `${SITE}/?d=${period.startDate}`;
}

function fileSlug(period, format, size, idx, total) {
  const head = period ? period.id : 'cards';
  const tag = format === 'single' ? 'card' : `slide-${idx + 1}-of-${total}`;
  return `mumbai-events-${head}-${size}-${tag}.png`;
}

export default function CardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const periods = useMemo(() => getAvailablePeriods(ALL_EVENTS), []);
  const allPeriods = useMemo(() => [...periods.weeks, ...periods.months], [periods]);

  // ----- state ---------------------------------------------------------------
  const initialPeriod = useMemo(() => {
    const fromUrl = searchParams.get('p');
    if (fromUrl) {
      const found = allPeriods.find((p) => p.id === fromUrl);
      if (found) return found;
    }
    return pickDefaultPeriod(periods);
  }, [allPeriods, periods, searchParams]);

  const [period, setPeriod] = useState(initialPeriod);
  const [format, setFormat] = useState(searchParams.get('f') === 'single' ? 'single' : 'carousel');
  const [size, setSize] = useState(SIZES[searchParams.get('s')] ? searchParams.get('s') : 'portrait');
  const [themeKey, setThemeKey] = useState(THEMES[searchParams.get('t')] ? searchParams.get('t') : 'primary');
  const [styleKey, setStyleKey] = useState(STYLES[searchParams.get('d')] ? searchParams.get('d') : 'editorial');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(null); // 'one' | 'all' | null

  // Reflect state back to the URL so a card config is shareable
  useEffect(() => {
    const next = new URLSearchParams();
    if (period) next.set('p', period.id);
    next.set('f', format);
    next.set('s', size);
    next.set('t', themeKey);
    next.set('d', styleKey);
    setSearchParams(next, { replace: true });
  }, [period, format, size, themeKey, styleKey, setSearchParams]);

  const theme = getTheme(themeKey);
  const sizeDef = SIZES[size];

  // ----- derived events ------------------------------------------------------
  const periodEvents = useMemo(() => eventsInPeriod(ALL_EVENTS, period), [period]);
  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return periodEvents;
    return periodEvents.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q),
    );
  }, [periodEvents, search]);

  // ----- QR generation -------------------------------------------------------
  const [qrSvg, setQrSvg] = useState(null);
  const deepLink = useMemo(() => deepLinkFor(period), [period]);

  useEffect(() => {
    let cancelled = false;
    qrcode
      .toString(deepLink, { type: 'svg', errorCorrectionLevel: 'M', margin: 1, width: 240 })
      .then((svg) => { if (!cancelled) setQrSvg(svg); })
      .catch(() => { if (!cancelled) setQrSvg(null); });
    return () => { cancelled = true; };
  }, [deepLink]);

  // ----- slide model ---------------------------------------------------------
  const slides = useMemo(
    () => buildSlides({ period, events: filteredEvents, format, qrSvg, deepLink }),
    [period, filteredEvents, format, qrSvg, deepLink],
  );

  const slideRefs = useRef([]);
  useEffect(() => { slideRefs.current = slideRefs.current.slice(0, slides.length); }, [slides.length]);

  // ----- downloads -----------------------------------------------------------
  async function downloadSlide(idx) {
    const node = slideRefs.current[idx];
    if (!node) return;
    setBusy('one');
    try {
      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio: 1, // node is already at output dimensions
        cacheBust: true,
        backgroundColor: '#ffffff',
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = fileSlug(period, format, size, idx, slides.length);
      a.click();
    } finally {
      setBusy(null);
    }
  }

  async function downloadAll() {
    if (slides.length === 0) return;
    setBusy('all');
    try {
      if (slides.length === 1) {
        await downloadSlide(0);
        return;
      }
      const zip = new JSZip();
      for (let i = 0; i < slides.length; i++) {
        const node = slideRefs.current[i];
        if (!node) continue;
        const dataUrl = await htmlToImage.toPng(node, {
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: '#ffffff',
        });
        const blob = await (await fetch(dataUrl)).blob();
        zip.file(fileSlug(period, format, size, i, slides.length), blob);
      }
      const out = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mumbai-events-${period?.id || 'cards'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  }

  // ----- share intents -------------------------------------------------------
  const shareText = period
    ? `${period.kind === 'week' ? 'Week of ' : ''}${period.short} in Mumbai — ${filteredEvents.length} tech events. Full list:`
    : 'Mumbai tech events directory';

  const tweetUrl = twitterIntent({ text: shareText, url: deepLink });
  const liUrl = linkedinIntent({ url: deepLink });
  const waUrl = whatsappIntent({ text: shareText, url: deepLink });

  async function handleCopy() {
    const ok = await copyLink(deepLink);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // ----- SEO -----------------------------------------------------------------
  const pageTitle = 'Download shareable event cards — Mumbai Events';
  const pageDesc = 'Generate clean, brand-consistent cards for any week or month of Mumbai tech events. Carousel slides or a single tall card. Download as PNG and post to X, LinkedIn, or Instagram in one click.';
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Cards', item: PAGE_URL },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={PAGE_URL} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Mumbai Events" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mumbai Events — shareable card studio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
          <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-slate-500">
            <li>
              <Link to="/" className="hover:text-slate-900 inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-900 font-medium">Shareable cards</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-700 px-3 py-1 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> NEW · Beta
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Shareable cards for every week & month
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 text-base sm:text-lg">
            Pick a period, a theme, a size — get a clean carousel or a single tall card with a QR back to the live list. Post directly to X, LinkedIn, or Instagram.
          </p>
        </section>

        {/* Studio */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <aside className="lg:col-span-5 xl:col-span-4 space-y-5">
              {/* Period */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Period</div>
                {periods.weeks.length > 0 && (
                  <>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">By week</div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {periods.weeks.map((w) => {
                        const on = period?.id === w.id;
                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => setPeriod(w)}
                            aria-pressed={on}
                            className={[
                              'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition',
                              on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                            ].join(' ')}
                          >
                            {w.short}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {periods.months.length > 0 && (
                  <>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">By month</div>
                    <div className="flex flex-wrap gap-1.5">
                      {periods.months.map((m) => {
                        const on = period?.id === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPeriod(m)}
                            aria-pressed={on}
                            className={[
                              'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition',
                              on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                            ].join(' ')}
                          >
                            {m.short}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Design style */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Design style</div>
                <div className="grid grid-cols-3 gap-2">
                  {STYLE_KEYS.map((k) => {
                    const s = STYLES[k];
                    const on = styleKey === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setStyleKey(k)}
                        aria-pressed={on}
                        className={[
                          'rounded-xl px-3 py-3 text-left border transition',
                          on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                        ].join(' ')}
                      >
                        <div className="text-sm font-semibold">{s.label}</div>
                        <div className={[
                          'text-[11px] leading-snug mt-1',
                          on ? 'text-white/80' : 'text-slate-500',
                        ].join(' ')}>{s.blurb}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format & Size */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Format</div>
                  <div className="flex gap-1.5">
                    {Object.values(FORMATS).map((f) => {
                      const on = format === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormat(f.id)}
                          aria-pressed={on}
                          className={[
                            'flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium border transition',
                            on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                          ].join(' ')}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Size</div>
                  <div className="flex gap-1.5">
                    {Object.values(SIZES).map((s) => {
                      const on = size === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSize(s.id)}
                          aria-pressed={on}
                          className={[
                            'flex-1 inline-flex flex-col items-center rounded-lg px-2 py-2 text-xs font-medium border transition',
                            on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                          ].join(' ')}
                        >
                          <span className="font-semibold">{s.label.split(' ')[0]}</span>
                          <span className="text-[10px] mt-0.5 opacity-70">{s.width}×{s.height}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Theme</div>
                  <div className="grid grid-cols-6 gap-2">
                    {THEME_KEYS.map((k) => {
                      const t = THEMES[k];
                      const on = themeKey === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setThemeKey(k)}
                          aria-pressed={on}
                          aria-label={`Theme: ${t.label}`}
                          className={[
                            'aspect-square rounded-lg border-2 transition shadow-sm',
                            on ? 'border-slate-900 ring-2 ring-slate-900/20' : 'border-white hover:border-slate-300',
                          ].join(' ')}
                          style={{ background: `linear-gradient(135deg, ${t.headerFrom}, ${t.headerTo})` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <label htmlFor="card-search" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                  Filter events on this card
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="card-search"
                    type="text"
                    placeholder="ai, hackathon, KTPO…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-700 tabular-nums">{filteredEvents.length}</span> of {periodEvents.length}
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Download</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadAll}
                    disabled={busy !== null || slides.length === 0 || filteredEvents.length === 0}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    {busy === 'all' ? 'Building…' : (slides.length > 1 ? 'Download all (.zip)' : 'Download PNG')}
                  </button>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 pt-2">Share the live link</div>
                <div className="grid grid-cols-4 gap-2">
                  <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 py-2 text-xs font-medium text-slate-700">
                    <XIcon className="w-3.5 h-3.5" /> X
                  </a>
                  <a href={liUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 py-2 text-xs font-medium text-slate-700">
                    <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 py-2 text-xs font-medium text-slate-700">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <button type="button" onClick={handleCopy} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 py-2 text-xs font-medium text-slate-700">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Tip: download the cards, post them as the image, and paste the copied link in the post text.
                </p>
              </div>
            </aside>

            {/* Preview */}
            <main className="lg:col-span-7 xl:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Live preview</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 text-xs">{sizeDef.width}×{sizeDef.height}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {slides.length} {slides.length === 1 ? 'card' : 'slides'}
                  </div>
                </div>

                <CardSlider slides={slides} theme={theme} size={sizeDef} slideRefs={slideRefs} styleKey={styleKey} />

                {/* Per-slide download row */}
                {slides.length > 0 && filteredEvents.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
                      Per-slide:
                    </span>
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => downloadSlide(i)}
                        disabled={busy !== null}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50"
                      >
                        <Download className="w-3 h-3" />
                        Slide {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-slate-500 leading-snug">
                The QR on the closing slide opens the live, period-filtered list on this site so the people who scan it always see the latest event details.
              </p>
            </main>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
