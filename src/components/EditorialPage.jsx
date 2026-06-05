import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldCheck, GitBranch, Mail } from 'lucide-react';

const POLICY_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Editorial standards & corrections policy',
  url: 'https://mumbai-events.sagarjethi.com/editorial',
  description:
    'Sourcing, verification, corrections, and takedown policies for the Mumbai Tech Events.',
  isPartOf: { '@id': 'https://mumbai-events.sagarjethi.com/#website' },
  publisher: { '@id': 'https://mumbai-events.sagarjethi.com/#organization' },
  dateModified: new Date().toISOString().slice(0, 10),
};

export default function EditorialPage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Editorial standards & corrections — Mumbai Tech Events</title>
        <meta
          name="description"
          content="How events are sourced, verified, and corrected on the Mumbai Tech Events. Independent operator, weekly link-check, 24-hour takedown policy."
        />
        <link rel="canonical" href="https://mumbai-events.sagarjethi.com/editorial" />
        <script type="application/ld+json">{JSON.stringify(POLICY_LD)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/about" className="hover:text-primary-600">About</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Editorial standards</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Last reviewed {today}
        </div>

        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          Editorial standards & corrections
        </h1>
        <p className="mt-3 text-slate-600">
          Plain-English policy for how events appear here, how mistakes are fixed, and how organizers can request changes.
        </p>

        <Section title="Sourcing">
          <ul className="list-disc pl-5 space-y-2">
            <li>Listings come only from <strong>verifiable public sources</strong>: Luma, Eventbrite, Meetup, Devfolio, GDG community.dev, HasGeek, AllEvents, Dev.Events, official college fest sites, and public posts by recognized organizers.</li>
            <li>Direct organizer submissions go through the same fetch + JSON-LD checks as scraped events.</li>
            <li>No event is added without a working public registration / info URL.</li>
          </ul>
        </Section>

        <Section title="Verification">
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>JSON-LD first.</strong> Each event URL is parsed for <code className="text-xs bg-slate-100 px-1 rounded">schema.org/Event</code>. Status (<code className="text-xs bg-slate-100 px-1 rounded">EventCancelled</code>, <code className="text-xs bg-slate-100 px-1 rounded">EventPostponed</code>, <code className="text-xs bg-slate-100 px-1 rounded">EventMovedOnline</code>) is treated as authoritative.</li>
            <li><strong>Strip-then-match.</strong> If JSON-LD is missing, the page HTML is stripped of <code className="text-xs bg-slate-100 px-1 rounded">&lt;script&gt;</code> blocks before pattern matching — Luma and Meetup ship full i18n bundles in script tags that contain "Event cancelled" on every page, so naive grepping creates false positives.</li>
            <li><strong>Cadence.</strong> Upcoming events are link-checked at minimum once per week via <code className="text-xs bg-slate-100 px-1 rounded">scripts/check-links-deep.mjs</code>, and again any time the data file is touched.</li>
            <li><strong>Removal.</strong> Cancelled, postponed-without-new-date, online-moved, and 404 events are removed within 7 days of detection (often same day).</li>
          </ol>
        </Section>

        <Section title="What we don't list">
          <ul className="list-disc pl-5 space-y-2">
            <li>Pure online / virtual / webinar events with no Mumbai in-person component.</li>
            <li>Events outside Mumbai / Maharashtra.</li>
            <li>Sales pitches, MLM, or "free" events that funnel into a paid course.</li>
            <li>Events with no public registration link or working organizer page.</li>
            <li>Recurring "best of <em>conf</em>" series that just replay talks from elsewhere.</li>
          </ul>
        </Section>

        <Section title="Corrections policy">
          <p>
            We aim to correct factual errors within <strong>24 hours</strong> of being notified.
          </p>
          <p>
            If a date, venue, price, or description here doesn't match the official event page, the official page wins —
            email <a href="mailto:hello@codeminto.com?subject=Correction%20request" className="text-primary-600 hover:underline font-medium">hello@codeminto.com</a>
            {' '}with the URL and the correct value, and the change is made and re-deployed.
          </p>
          <p>
            Material corrections are noted in the public commit log on{' '}
            <a href="https://github.com/sagarjethi/mumbai-events-2026/commits/main" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">GitHub</a>{' '}
            — every change is timestamped and traceable.
          </p>
        </Section>

        <Section title="Takedown / removal">
          <p>
            Event organizers can request removal of their listing at any time, no questions asked. Email{' '}
            <a href="mailto:hello@codeminto.com?subject=Takedown%20request" className="text-primary-600 hover:underline font-medium">hello@codeminto.com</a>{' '}
            or DM <a href="https://x.com/sagarbjethi" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">@sagarbjethi</a>{' '}
            with the event URL — typical turnaround is under 24 hours.
          </p>
        </Section>

        <Section title="Conflicts of interest">
          <p>
            Curator <a href="/about" className="text-primary-600 hover:underline">Sagar Jethi</a> is an independent
            engineer based in Mumbai. He doesn't take sponsorship or paid placement from any event organizer listed
            here. Any future paid relationships will be disclosed inline on the affected listings.
          </p>
        </Section>

        <Section title="Open source">
          <p className="inline-flex items-start gap-2">
            <GitBranch className="w-4 h-4 text-primary-600 mt-1 shrink-0" />
            <span>
              The full source — including event data, scrapers, and verification scripts — is on GitHub at{' '}
              <a href="https://github.com/sagarjethi/mumbai-events-2026" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">sagarjethi/mumbai-events-2026</a>.
              Issues and pull requests for missing or wrong events are welcome.
            </span>
          </p>
        </Section>

        <div className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-500 inline-flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" />
          Questions? <a href="mailto:hello@codeminto.com" className="text-primary-600 hover:underline">hello@codeminto.com</a>
        </div>
      </div>
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
