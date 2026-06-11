import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Clock,
  Calendar,
  Tag,
  ExternalLink,
  Trophy,
  ArrowLeft,
  Share2,
  Globe,
  Users,
  Sparkles,
  Navigation2,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
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
import EventMap from './EventMap';
import CouponCard from './CouponCard';
import { events, CATEGORIES } from '../data/events';
import { findEventBySlug, toSlug } from '../utils/slug';
import { addUtm } from '../utils/utm';
import { buildGoogleCalendarUrl, downloadIcs } from '../utils/calendar';
import Countdown from './Countdown';
import EmailCapture from './EmailCapture';
import { CalendarPlus } from 'lucide-react';

function getCategoryGradient(category) {
  const gradients = {
    conference: 'from-primary-600 to-primary-800',
    hackathon: 'from-violet-600 to-violet-800',
    startup: 'from-emerald-600 to-emerald-800',
    web3: 'from-amber-500 to-amber-700',
    meetup: 'from-cyan-600 to-cyan-800',
    music: 'from-rose-500 to-rose-700',
    sports: 'from-emerald-500 to-emerald-700',
    expo: 'from-slate-600 to-slate-800',
    cybersecurity: 'from-rose-600 to-rose-800',
    workshop: 'from-indigo-600 to-indigo-800',
  };
  return gradients[category] || 'from-primary-600 to-primary-800';
}

function getCategoryIcon(category) {
  const icons = {
    hackathon: '{ }',
    conference: '🎤',
    startup: '🚀',
    web3: '⛓️',
    meetup: '👥',
    music: '🎵',
    sports: '🏃',
    expo: '🏛️',
    cybersecurity: '🔒',
    workshop: '🛠️',
  };
  return icons[category] || '📅';
}

function formatDate(startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  if (startDate === endDate) {
    return start.toLocaleDateString('en-IN', opts);
  }
  const startStr = start.toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-IN', opts);
  return `${startStr} – ${endStr}`;
}

function getDaysUntil(startDate) {
  const now = new Date();
  const start = new Date(startDate + 'T00:00:00');
  const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Event has passed';
  if (diff === 0) return 'Happening today!';
  if (diff === 1) return 'Tomorrow!';
  return `In ${diff} days`;
}

function getRelatedEvents(event) {
  return events
    .filter((e) => e.id !== event.id && (e.category === event.category || e.tags.some((t) => event.tags.includes(t))))
    .slice(0, 3);
}

export default function EventDetail() {
  const { slug } = useParams();
  const event = findEventBySlug(events, slug);
  const [copied, setCopied] = useState(false);

  if (!event) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>Event Not Found — Mumbai Events</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Event Not Found</h1>
            <p className="text-slate-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>
      </>
    );
  }

  const cat = CATEGORIES[event.category];
  const gradient = getCategoryGradient(event.category);
  const icon = getCategoryIcon(event.category);
  const daysUntil = getDaysUntil(event.startDate);
  const related = getRelatedEvents(event);
  const eventUrl = `https://mumbai-events.sagarjethi.com/events/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
    ...(event.cost === 'Free' || event.cost?.toLowerCase().includes('free')
      ? {
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: event.link },
        }
      : {
          offers: { '@type': 'Offer', url: event.link, availability: 'https://schema.org/InStock' },
        }),
    url: eventUrl,
    ...(event.website ? { sameAs: event.website } : {}),
    image: 'https://mumbai-events.sagarjethi.com/og-image.png',
    organizer: { '@type': 'Organization', name: event.tags?.[0] || 'Mumbai Events' },
    performer: { '@type': 'Organization', name: event.tags?.[0] || 'Mumbai Events' },
    author: { '@id': 'https://mumbai-events.sagarjethi.com/#sagar' },
    publisher: { '@id': 'https://mumbai-events.sagarjethi.com/#organization' },
    dateModified: new Date().toISOString().slice(0, 10),
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.name, text: event.description, url: eventUrl });
    } else {
      await navigator.clipboard.writeText(eventUrl);
    }
  };

  const shareDate = formatDate(event.startDate, event.endDate);
  const twitterText = `🚀 I'm attending ${event.name} on ${shareDate} in Mumbai. Check the full Mumbai June 2026 tech events directory → ${eventUrl}`;
  const whatsappText = `Check this out — ${event.name} is happening on ${shareDate} in Mumbai. Want to go together? ${eventUrl}`;
  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{event.name} — Mumbai Events June 2026</title>
        <meta name="description" content={`${event.description} | ${event.date} at ${event.venue}, Mumbai.`} />
        <meta name="keywords" content={`${event.tags.join(', ')}, Mumbai, ${event.category}, June 2026`} />
        <link rel="canonical" href={eventUrl} />
        <meta property="og:title" content={`${event.name} — Mumbai Events`} />
        <meta property="og:description" content={`${event.description} | ${event.date} at ${event.venue}`} />
        <meta property="og:url" content={eventUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mumbai-events.sagarjethi.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${event.name} — Mumbai Events June 2026`} />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${event.name} — Mumbai Events`} />
        <meta name="twitter:description" content={event.description} />
        <meta name="twitter:image" content="https://mumbai-events.sagarjethi.com/og-image.png" />
        <meta name="twitter:image:alt" content={`${event.name} — Mumbai Events June 2026`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen">
        {/* Sub Nav */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Events
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className={`bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          {event.image && (
            <div className="absolute inset-0" aria-hidden="true">
              <img
                src={event.image}
                alt=""
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {/* Dark scrim keeps the white hero text readable over any photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/55 to-slate-900/70" />
            </div>
          )}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                {/* Category + Status */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                    {cat?.label || event.category}
                  </span>
                  {event.featured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-100 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {(event.cost === 'Free' || event.cost?.toLowerCase().includes('free')) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-100 backdrop-blur-sm">
                      Free
                    </span>
                  )}
                </div>

                {/* Event Name */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                  {event.name}
                </h1>

                {/* Quick Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-white/80 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate, event.endDate)}
                  </span>
                  <span className="hidden sm:inline" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </span>
                </div>

                {/* Author byline — E-E-A-T trust signal */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
                  <span>
                    Curated by{' '}
                    <Link to="/about" className="font-semibold text-white/90 hover:text-white underline-offset-2 hover:underline">
                      Sagar Jethi
                    </Link>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Link verified <time dateTime={new Date().toISOString().slice(0, 10)}>{new Date().toISOString().slice(0, 10)}</time>
                  </span>
                  <span aria-hidden="true">·</span>
                  <Link to="/editorial" className="hover:text-white underline-offset-2 hover:underline">
                    How we verify
                  </Link>
                </div>
              </div>

              {/* Large Icon */}
              <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm text-5xl shrink-0">
                {icon}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Countdown Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Countdown startDate={event.startDate} endDate={event.endDate} />
                  <span className="text-sm text-slate-500">{daysUntil}</span>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About this event</h2>
                <p className="text-slate-600 leading-relaxed text-base">{event.description}</p>

                {event.prize && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Prize Pool: {event.prize}</span>
                  </div>
                )}
              </div>

              {/* Discount / promo codes */}
              <CouponCard event={event} />

              {/* Share */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-slate-900">Share this event</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Tell your network — help more builders find this event.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                    aria-label="Share on X (Twitter)"
                  >
                    <XIcon className="w-4 h-4" />
                    <span>I'm attending</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                    aria-label="Invite a friend on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Invite a friend</span>
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#084a91] text-white text-sm font-semibold transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
                    aria-label="Copy event link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy link'}</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & Map */}
              {event.lat && event.lng && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Location</h2>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Navigation2 className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{event.venue}, Mumbai, Maharashtra</p>
                  <EventMap events={[event]} height="280px" zoom={15} center={[event.lat, event.lng]} showLinks={false} />
                </div>
              )}

              {/* Related Events */}
              {related.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Related Events</h2>
                  <div className="space-y-3">
                    {related.map((r) => {
                      const rCat = CATEGORIES[r.category];
                      return (
                        <Link
                          key={r.id}
                          to={`/events/${toSlug(r.name)}`}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryGradient(r.category)} flex items-center justify-center text-lg shrink-0`}>
                            {getCategoryIcon(r.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                              {r.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {r.date} · {r.venue}
                            </p>
                          </div>
                          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${rCat?.color || 'bg-slate-100 text-slate-600'}`}>
                            {rCat?.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Register Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-16">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Event Details</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.date}</p>
                      <p className="text-xs text-slate-500">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.venue}</p>
                      <p className="text-xs text-slate-500">Mumbai, Maharashtra, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.cost}</p>
                    </div>
                  </div>

                  {event.prize && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Prize: {event.prize}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Promo nudge — points to the Discount codes card */}
                {event.coupons?.length > 0 && (
                  <a
                    href="#discount-codes"
                    className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <Tag className="w-4 h-4 shrink-0" />
                    {event.coupons.find((c) => c.discount)
                      ? `Save ${event.coupons.find((c) => c.discount).discount} with a promo code`
                      : 'Promo codes available'}
                  </a>
                )}

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <a
                    href={addUtm(event.link, 'event-detail-register', toSlug(event.name))}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {event.website && (
                    <a
                      href={addUtm(event.website, 'event-detail-website', toSlug(event.name))}
                      target="_blank"
                      rel="noopener noreferrer nofollow ugc"
                      className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      Official Website
                    </a>
                  )}
                </div>

                {/* Add to Calendar */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <a
                    href={buildGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-3 py-2.5 rounded-xl transition-colors text-xs"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Google Cal
                  </a>
                  <button
                    onClick={() => downloadIcs(event)}
                    className="flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-3 py-2.5 rounded-xl transition-colors text-xs"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Apple / .ics
                  </button>
                </div>

                {event.lat && event.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    <Navigation2 className="w-4 h-4" />
                    Get Directions
                  </a>
                )}

                {/* Notify me email capture */}
                <div className="mt-5 pt-5 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Get reminded before this event
                  </p>
                  <EmailCapture
                    variant="compact"
                    placeholder="you@example.com"
                    cta="Notify me"
                    source={`event-detail:${toSlug(event.name)}`}
                    tag={event.category}
                    successMessage="We'll remind you!"
                  />
                </div>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full mt-2 text-slate-500 hover:text-primary-600 text-sm font-medium py-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share this event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-5xl mx-auto px-4 py-12 mt-6">
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse all Mumbai events
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
