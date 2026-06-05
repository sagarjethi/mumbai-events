// Curator CTA — Topmate consultancy booking.
// UX intent: appears AFTER the user has consumed value (event lists, accelerator
// info, etc.) so the offer feels earned, not pre-emptive.
//
// Two variants:
//  - <CuratorCTA />        full block with credibility + offer
//  - <CuratorCTA compact />slim banner

import { ArrowUpRight, Sparkles, Coffee, Users } from 'lucide-react';

const TOPMATE = 'https://topmate.io/sagarjethi';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function CuratorCTA({
  compact = false,
  variant = 'default', // 'default' | 'founders' | 'builders'
  source = 'curator-cta',
}) {
  if (compact) return <CompactCTA source={source} />;

  // Tone presets — pick the closest to the page's audience.
  const COPY = {
    default: {
      eyebrow: 'Stuck on something?',
      headline: 'Book a 1:1 with the curator',
      body:
        "I curated every event on this site, ship indie products, and have helped founders unstick growth, positioning, and AI rollouts. 30 min, paid, focused.",
      bullets: [
        'Product / growth / positioning',
        'AI integration for your stack',
        'Mumbai tech network intros',
      ],
      cta: 'Book on Topmate',
    },
    founders: {
      eyebrow: 'Building a startup in Mumbai?',
      headline: 'Book 1:1 time with Sagar',
      body:
        "Curator of this directory, indie builder, and active in Mumbai's startup community. Useful for founders working through fundraising, accelerator selection, GTM, or AI strategy.",
      bullets: [
        'Accelerator pick & application reviews',
        'GTM + positioning for early-stage',
        'AI integration without burning cash',
      ],
      cta: 'Book a 30-min consult',
    },
    builders: {
      eyebrow: 'Shipping something with AI?',
      headline: 'Get a senior pair of eyes',
      body:
        "I curate this entire directory, ship indie AI products, and have shipped at scale. If you're stuck on architecture, prompts, or shipping into prod — book a slot.",
      bullets: [
        'AI architecture + prompt design',
        'Vector DB / RAG / agent reviews',
        'From PoC to shipped',
      ],
      cta: 'Book a 1:1',
    },
  };
  const c = COPY[variant] || COPY.default;

  return (
    <section
      aria-label="Book a consultation"
      className="my-14 relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl"
    >
      {/* Decorative gradient orb */}
      <div aria-hidden="true" className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-500/30 blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      <div className="relative grid sm:grid-cols-[auto_1fr] gap-6 p-6 sm:p-8 lg:p-10">
        {/* Avatar / identity */}
        <div className="flex flex-col items-start gap-3 sm:max-w-[220px]">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-white/20">
              SJ
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-slate-900 flex items-center justify-center">
              <span className="block w-2 h-2 rounded-full bg-white/90" />
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">Sagar Jethi</div>
            <div className="text-xs text-white/60 mt-0.5">Curator · Indie builder · Mumbai</div>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <a href="https://x.com/sagarbjethi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="X / Twitter">
              <XIcon className="w-3.5 h-3.5" />
            </a>
            <span aria-hidden="true">·</span>
            <a href="https://www.linkedin.com/in/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition">
              LinkedIn
            </a>
            <span aria-hidden="true">·</span>
            <a href="https://github.com/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition">
              GitHub
            </a>
          </div>
        </div>

        {/* Offer */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-300">
            <Sparkles className="w-3 h-3" /> {c.eyebrow}
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{c.headline}</h2>
          <p className="mt-3 text-base text-white/75 leading-relaxed max-w-xl">{c.body}</p>

          <ul className="mt-4 grid sm:grid-cols-2 gap-x-5 gap-y-1.5 text-sm text-white/85">
            {c.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-300 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={TOPMATE}
              target="_blank"
              rel="noopener noreferrer"
              data-source={source}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-3 rounded-xl text-sm transition-all hover:shadow-2xl hover:-translate-y-0.5"
            >
              {c.cta}
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/sagarbjethi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium px-4 py-3 rounded-xl text-sm transition"
            >
              <XIcon className="w-3.5 h-3.5" />
              Or DM first
            </a>
          </div>

          <p className="mt-4 text-xs text-white/45">
            Paid 30-min slots via Topmate · Replies within 24h on weekdays · No-fluff, async-first
          </p>
        </div>
      </div>
    </section>
  );
}

// Slim banner — used in the footer
function CompactCTA({ source }) {
  return (
    <a
      href={TOPMATE}
      target="_blank"
      rel="noopener noreferrer"
      data-source={source}
      className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm px-4 py-2 text-sm transition"
    >
      <span className="inline-flex w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 text-white items-center justify-center text-[11px] font-bold ring-2 ring-white">
        SJ
      </span>
      <span className="flex flex-col leading-tight text-left">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Need help building?</span>
        <span className="text-slate-900 font-semibold">Book 1:1 with Sagar</span>
      </span>
      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
    </a>
  );
}

// Convenient pre-configured exports for common contexts
export function CuratorCTAFounders(props) { return <CuratorCTA variant="founders" {...props} />; }
export function CuratorCTABuilders(props) { return <CuratorCTA variant="builders" {...props} />; }
