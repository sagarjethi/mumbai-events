import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Calendar, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { EVENT_COUNT, FREE_COUNT, CONFERENCE_COUNT, FIRST_EVENT_DATE, LAST_EVENT_DATE } from '../utils/stats';

const PERSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://mumbai-events.sagarjethi.com/about#sagar',
  name: 'Sagar Jethi',
  alternateName: '@sagarjethi',
  url: 'https://sagarjethi.com',
  image: 'https://mumbai-events.sagarjethi.com/og-image.png',
  jobTitle: 'Software Engineer & Independent Curator',
  description:
    'Mumbai-based engineer who has attended, spoken at, and helped organize tech events across the city since 2018. Curates this directory as an independent operator.',
  homeLocation: { '@type': 'Place', name: 'Mumbai, Maharashtra, India' },
  knowsAbout: [
    'Tech events',
    'Hackathons',
    'Mumbai startup ecosystem',
    'AI / GenAI',
    'Web3',
    'Developer communities',
  ],
  sameAs: [
    'https://x.com/sagarbjethi',
    'https://www.linkedin.com/in/sagarjethi',
    'https://github.com/sagarjethi',
    'https://topmate.io/sagarjethi',
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>About — Mumbai Tech Events</title>
        <meta
          name="description"
          content="About the Mumbai Tech Events: who curates it, how events are sourced and verified, and how to get in touch. Independent operator, no paid placements."
        />
        <link rel="canonical" href="https://mumbai-events.sagarjethi.com/about" />
        <meta property="og:title" content="About — Mumbai Tech Events" />
        <meta property="og:url" content="https://mumbai-events.sagarjethi.com/about" />
        <script type="application/ld+json">{JSON.stringify(PERSON_LD)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">About</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          About the directory
        </h1>
        <p className="mt-3 text-slate-600 text-lg">
          A complete, link-verified guide to tech events in Mumbai — built by one person who actually attends them.
        </p>

        {/* Author card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 text-white grid place-items-center text-xl font-bold shrink-0">
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900">Sagar Jethi</h2>
              <p className="text-sm text-slate-500">Software engineer · Independent curator · Mumbai</p>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                I've been part of the Mumbai tech scene since 2018 — attending GIDS, Rootconf, FOSSAsia, GDG India,
                Devcon side-events, hackathons across IISc / RVCE / PES, and dozens of meetups. I started this directory
                because no single source covered everything happening across Luma, Eventbrite, Meetup, Devfolio, GDG,
                HasGeek and college fests in one place.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <a href="https://sagarjethi.com" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:border-primary-300 hover:text-primary-700 text-slate-700 font-medium">
                  Personal site
                </a>
                <a href="https://x.com/sagarbjethi" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:border-primary-300 hover:text-primary-700 text-slate-700 font-medium">
                  X / Twitter
                </a>
                <a href="https://www.linkedin.com/in/sagarjethi" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:border-primary-300 hover:text-primary-700 text-slate-700 font-medium">
                  LinkedIn
                </a>
                <a href="https://github.com/sagarjethi" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:border-primary-300 hover:text-primary-700 text-slate-700 font-medium">
                  GitHub
                </a>
                <a href="https://topmate.io/sagarjethi" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium">
                  Book a 1:1
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={Calendar} label="Events tracked" value={`${EVENT_COUNT}+`} />
          <Stat icon={Sparkles} label="Free events" value={FREE_COUNT} />
          <Stat icon={BookOpen} label="Conferences" value={CONFERENCE_COUNT} />
          <Stat icon={ShieldCheck} label="Link-verified" value="Weekly" />
        </div>

        {/* Mission */}
        <Section title="Why this exists">
          <p>
            Mumbai runs 50+ tech events a month. They're scattered across Luma, Eventbrite, Meetup, Devfolio, GDG
            community pages, college fest sites, and personal posts. Most aggregators are paid-placement marketplaces or
            stale. Builders, students and newcomers shouldn't need to follow 20 accounts on X just to find a free
            workshop happening on Saturday.
          </p>
          <p>
            This directory exists to be the one place where every legitimate, in-person Mumbai tech event is listed,
            categorized, and link-checked — for free, with no signup, no ads.
          </p>
        </Section>

        {/* Methodology */}
        <Section title="How events get on the site">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-semibold text-slate-800">Discovery.</span> Automated weekly Playwright scrape of
              Luma, Eventbrite, Meetup, GDG community.dev, HasGeek, AllEvents, Devfolio, plus manual sweeps of college
              fest sites and X / LinkedIn posts from organizers I follow.
            </li>
            <li>
              <span className="font-semibold text-slate-800">Filter.</span> Drops virtual-only events, non-Mumbai
              listings, expired pages, and obvious dropshipping / lead-gen pages. Only in-person Mumbai events inside
              the date window survive.
            </li>
            <li>
              <span className="font-semibold text-slate-800">Verify.</span> Every event link is fetched and cross-checked
              against schema.org JSON-LD <code className="text-xs bg-slate-100 px-1 rounded">eventStatus</code> first,
              then visible page text. Cancelled, postponed and online-moved events are removed within a week.
            </li>
            <li>
              <span className="font-semibold text-slate-800">Categorize.</span> By topic (AI, Web3, hackathons, college,
              startup, etc.) using rule-based keyword matching on the official name + description — no LLM
              hallucinations.
            </li>
            <li>
              <span className="font-semibold text-slate-800">Publish.</span> Per-event detail page, sitemap entry,
              llms.txt entry, JSON-LD with <code className="text-xs bg-slate-100 px-1 rounded">Event</code> schema for
              Google + AI search.
            </li>
          </ol>
          <p className="mt-3 text-sm text-slate-500">
            See the full health-check pipeline in{' '}
            <Link to="/editorial" className="text-primary-600 hover:underline">Editorial standards</Link>.
          </p>
        </Section>

        {/* Independence */}
        <Section title="Independence & money">
          <p>
            <span className="font-semibold text-slate-800">No paid placements.</span> No event organizer has paid to be
            listed, ranked higher, or marked "featured." If that ever changes, it'll be disclosed inline on every paid
            entry — never silently mixed in.
          </p>
          <p>
            <span className="font-semibold text-slate-800">No ads, no tracker pixels.</span> Site uses Vercel Analytics
            and Speed Insights for traffic and performance only — no third-party retargeting, no Meta pixel, no Google
            Ads tracker.
          </p>
          <p>
            <span className="font-semibold text-slate-800">Optional consulting.</span> If you want help running a
            community event in Mumbai, you can{' '}
            <a href="https://topmate.io/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              book a 1:1 on Topmate
            </a>
            . That's the only commercial relationship.
          </p>
        </Section>

        {/* Contact */}
        <Section title="Contact, corrections, takedowns">
          <p>
            Found a wrong date, dead link, or want your event added? Email{' '}
            <a href="mailto:hello@codeminto.com?subject=Mumbai%20Tech%20Events"
               className="text-primary-600 hover:underline font-medium">hello@codeminto.com</a>{' '}
            or DM <a href="https://x.com/sagarbjethi" target="_blank" rel="noopener noreferrer"
                    className="text-primary-600 hover:underline font-medium">@sagarbjethi on X</a>.
          </p>
          <p>
            Organizers can request takedown of their listing at any time — typically processed within 24 hours, no
            questions asked.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            Mumbai, Maharashtra, India
            <span className="mx-1">·</span>
            <Mail className="w-3.5 h-3.5" />
            hello@codeminto.com
          </div>
        </Section>

        <div className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-500">
          Coverage window: {FIRST_EVENT_DATE} → {LAST_EVENT_DATE}.{' '}
          Last reviewed: {new Date().toISOString().slice(0, 10)}.{' '}
          <Link to="/editorial" className="text-primary-600 hover:underline">Editorial standards →</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center">
      <Icon className="w-4 h-4 text-primary-600 mx-auto" />
      <div className="mt-1 text-lg font-bold text-slate-900 leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="space-y-3 text-slate-600 leading-relaxed text-sm sm:text-base">
        {children}
      </div>
    </section>
  );
}
