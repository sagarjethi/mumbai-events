import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ExternalLink,
  Users,
  MessageCircle,
  Globe,
  Ticket,
  Play,
} from 'lucide-react';
import { xPosts, linkedinPosts, instagramReels, notablePeople, lumaEvents, couponsAndDeals } from '../data/social';
import { EVENT_COUNT } from '../utils/stats';
import TweetCard from './TweetCard';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LumaIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function SocialPage() {
  const pageUrl = 'https://mumbai-events.sagarjethi.com/social';

  return (
    <>
      <Helmet>
        <title>Social Buzz — Mumbai Events June 2026 | Connect with Attendees</title>
        <meta name="description" content={`Follow the social buzz around ${EVENT_COUNT}+ tech events in Mumbai. See what people are saying on X, LinkedIn, Instagram. Connect with attendees and join Luma events.`} />
        <meta name="keywords" content="Mumbai events social, tech events twitter, hackathon community, connect with developers Mumbai, Luma events Mumbai, tech networking India June 2026" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Social Buzz — Mumbai Events June 2026" />
        <meta property="og:description" content={`Follow the conversation. Connect with attendees. Join Luma events. ${EVENT_COUNT}+ tech events in Mumbai.`} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Social Buzz — Mumbai Events June 2026" />
      </Helmet>

      <div className="min-h-screen">
        {/* Nav */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Events
            </Link>
            <span className="text-sm font-semibold text-slate-900">Social Buzz</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-br from-accent-500 via-primary-600 to-violet-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4" />
              Social Buzz & Community
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Connect. Network. Build.
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Follow the conversation, find people who are going, and join the community around Mumbai's biggest tech week.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

          {/* === X / Twitter Section — grouped by topic === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <XIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">Trending on X</h2>
                <p className="text-sm text-slate-500">Posts grouped by event — verified on x.com</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Updated this week
              </span>
            </div>
            <TopicGroupedTweets posts={xPosts} />
          </section>

          {/* === LinkedIn Section === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A66C2] rounded-xl flex items-center justify-center">
                <LinkedInIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">LinkedIn Buzz</h2>
                <p className="text-sm text-slate-500">Professional network conversations about the events</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {linkedinPosts.map((post, i) => (
                <a
                  key={i}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group block bg-white rounded-xl border border-slate-200 hover:border-[#0A66C2]/30 hover:shadow-md p-5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {post.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-sm truncate">{post.name}</div>
                      <div className="text-xs text-slate-500">{post.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{post.text}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-[#0A66C2] font-medium">
                    <LinkedInIcon className="w-3 h-3" />
                    View on LinkedIn <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* === Instagram Reels Section === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded-xl flex items-center justify-center">
                <InstagramIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Instagram Reels</h2>
                <p className="text-sm text-slate-500">Visual highlights and event previews</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {instagramReels.map((reel, i) => (
                <a
                  key={i}
                  href={reel.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group block bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md overflow-hidden transition-all"
                >
                  <div className="aspect-[9/16] bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] relative flex items-center justify-center">
                    <div className="text-white text-center px-4">
                      <Play className="w-10 h-10 mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-bold">{reel.thumbnail}</p>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1.5">
                        <p className="text-white text-xs font-medium truncate">{reel.handle}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-600 line-clamp-2">{reel.caption}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* === People Going / Connect === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">People Likely Attending</h2>
                <p className="text-sm text-slate-500">Connect with builders who are probably going</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              Attendance listed here is based on social media posts and public RSVPs — not confirmed. Always verify directly with the person before planning to meet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notablePeople.map((person, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-primary-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                      {person.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900">{person.name}</h3>
                      <p className="text-sm text-slate-500 mb-3">{person.role}</p>

                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Likely Attending</p>
                        <div className="flex flex-wrap gap-1.5">
                          {person.attending.map((event) => (
                            <span key={event} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium border border-emerald-100">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {person.x && (
                          <a href={person.x} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors">
                            <XIcon className="w-3 h-3" /> X
                          </a>
                        )}
                        {person.linkedin && (
                          <a href={person.linkedin} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium rounded-lg transition-colors">
                            <LinkedInIcon className="w-3 h-3" /> LinkedIn
                          </a>
                        )}
                        {person.website && (
                          <a href={person.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors">
                            <Globe className="w-3 h-3" /> Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* === Coupons & Deals Section === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Coupons & Free Events</h2>
                <p className="text-sm text-slate-500">Save money or attend for free — many top events don't cost a thing</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {couponsAndDeals.map((deal, i) => (
                <a
                  key={i}
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group block bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md p-5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">{deal.event}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold border ${
                      deal.tag === 'FREE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      deal.tag === 'COUPON' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      deal.tag === 'EARLY BIRD' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                      'bg-violet-100 text-violet-700 border-violet-200'
                    }`}>
                      {deal.tag}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">{deal.deal}</p>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{deal.description}</p>
                  {deal.code && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-amber-600 font-medium">Code:</span>
                      <span className="text-sm font-bold text-amber-800 font-mono tracking-wider">{deal.code}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-medium">
                    {deal.tag === 'FREE' ? 'Register Free' : 'Get Deal'} <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* === Luma Events / RSVP === */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Join on Luma</h2>
                <p className="text-sm text-slate-500">RSVP, see who's going, and connect with attendees</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lumaEvents.map((event, i) => (
                <a
                  key={i}
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md p-4 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                      {event.name}
                    </h3>
                    <p className="text-xs text-slate-500">{event.date}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-violet-600 font-medium">
                      <Users className="w-3 h-3" />
                      {event.attendees} going
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-violet-500 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center py-6">
            <p className="text-slate-500 mb-4">Are you attending tech events in Mumbai this June?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://x.com/sagarbjethi"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                <XIcon className="w-4 h-4" />
                Follow on X
              </a>
              <a
                href="https://www.linkedin.com/in/sagarjethi"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                <LinkedInIcon className="w-4 h-4" />
                Connect on LinkedIn
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------------
// Topic grouping for X posts. Auto-derives topic from post text via keyword
// matching so we don't have to hand-tag every entry in data/social.js.
// Topics are listed in display order; first match wins.

const TOPICS = [
  { id: 'lyzr',    label: 'Lyzr Agentathon',    rx: /lyzr|agentathon/i,                                accent: 'violet' },
  { id: 'openai',  label: 'OpenAI Codex',       rx: /openai|codex/i,                                   accent: 'emerald' },
  { id: 'yc',      label: 'YC Startup School',  rx: /\b(yc|y\s?combinator|startup\s?school)\b/i,       accent: 'amber' },
  { id: 'aws',     label: 'AWS Summit',         rx: /aws\s?summit|reinvent|@aws|amazon web services/i, accent: 'amber' },
  { id: 'meta',    label: 'Meta PyTorch',       rx: /pytorch|openenv|@meta\b/i,                        accent: 'violet' },
  { id: 'rust',    label: 'Rust India',         rx: /rust\s?india|@rustlangin|rustindia|rustconf/i,    accent: 'rose' },
  { id: 'gids',    label: 'GIDS Developer Summit', rx: /\bgids\b|developersummit|developer summit/i,   accent: 'primary' },
  { id: 'vibecon', label: 'VibeCon',            rx: /vibe\s?con|vibecode|vibe coding/i,                accent: 'violet' },
  { id: 'eleven',  label: 'ElevenLabs Buildathon', rx: /elevenlabs|buildathon/i,                       accent: 'emerald' },
  { id: 'hackblr', label: 'HackBLR',            rx: /hackblr|geekroom/i,                               accent: 'rose' },
  { id: 'web3',    label: 'Web3 / Crypto',      rx: /\b(web3|w3summit|chainlink|blockchain|defi|crypto)\b/i, accent: 'amber' },
  { id: 'other',   label: 'More from the week', rx: /.*/,                                              accent: 'slate' },
];

const TOPIC_ACCENT = {
  primary: 'bg-primary-50 text-primary-700 ring-primary-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  violet:  'bg-violet-50 text-violet-700 ring-violet-100',
  amber:   'bg-amber-50 text-amber-700 ring-amber-100',
  rose:    'bg-rose-50 text-rose-700 ring-rose-100',
  slate:   'bg-slate-50 text-slate-700 ring-slate-200',
};

function topicFor(post) {
  const blob = `${post.text || ''} ${post.handle || ''} ${post.name || ''}`;
  return TOPICS.find((t) => t.rx.test(blob))?.id || 'other';
}

function TopicGroupedTweets({ posts }) {
  // Group, preserving original order within each topic
  const groups = TOPICS.map((t) => ({
    ...t,
    posts: posts.filter((p) => topicFor(p) === t.id),
  })).filter((g) => g.posts.length > 0);

  return (
    <>
      {/* Sticky in-page jump nav so users can pick a topic */}
      <div className="mb-5 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1.5 pb-1">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#topic-${g.id}`}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full ring-1 px-3 py-1 text-xs font-semibold ${TOPIC_ACCENT[g.accent] || TOPIC_ACCENT.slate}`}
            >
              {g.label}
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full bg-white/70 text-[10px] font-bold tabular-nums">
                {g.posts.length}
              </span>
            </a>
          ))}
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.id} id={`topic-${g.id}`} className="mb-10 scroll-mt-24">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-bold text-slate-900">{g.label}</h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 tabular-nums">{g.posts.length} post{g.posts.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.posts.map((post, i) => (
              <TweetCard key={`${g.id}-${i}`} post={post} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
