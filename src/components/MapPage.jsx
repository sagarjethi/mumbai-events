import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Filter } from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';
import EventMap from './EventMap';
import { EVENT_COUNT } from '../utils/stats';

const CATEGORY_COLORS = {
  conference: '#5a78f2',
  hackathon: '#8b5cf6',
  startup: '#10b981',
  web3: '#f59e0b',
  meetup: '#06b6d4',
  music: '#f43f5e',
  sports: '#059669',
  expo: '#64748b',
  cybersecurity: '#e11d48',
};

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const pageUrl = 'https://mumbai-events.sagarjethi.com/map';

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  const mappableEvents = filteredEvents.filter((e) => e.lat && e.lng);

  return (
    <>
      <Helmet>
        <title>Event Map — Mumbai Events June 2026 | Find Venues & Directions</title>
        <meta name="description" content={`Interactive map of ${EVENT_COUNT}+ tech events in Mumbai, June 2026. Find event venues, get directions, and see hackathons, conferences, and meetups near you.`} />
        <meta name="keywords" content="Mumbai events map, tech events locations Mumbai, hackathon venues Mumbai, conference locations India, event map June 2026, Mumbai tech venues" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Event Map — Mumbai Events June 2026" />
        <meta property="og:description" content="Interactive map of all tech events in Mumbai. Find venues and get directions." />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Event Map — Mumbai Events June 2026" />
      </Helmet>

      <div className="min-h-screen">
        {/* Nav */}
        <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Events
            </Link>
            <span className="text-sm font-semibold text-slate-900">Event Map</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-600 to-primary-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3 backdrop-blur-sm">
              <MapPin className="w-4 h-4" />
              Interactive Map
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
              Mumbai Event Venues
            </h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Find all event locations across Mumbai. Click any pin for details and directions.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({events.filter((e) => e.lat && e.lng).length})
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const count = events.filter((e) => e.category === key && e.lat && e.lng).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    selectedCategory === key
                      ? 'text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={selectedCategory === key ? { background: CATEGORY_COLORS[key] } : {}}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[key] }} />
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Map */}
          <EventMap events={filteredEvents} height="65vh" zoom={12} />

          {/* Event List Below Map */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {selectedCategory === 'all' ? 'All Events' : CATEGORIES[selectedCategory]?.label} on Map ({mappableEvents.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mappableEvents.map((event) => {
                const cat = CATEGORIES[event.category];
                return (
                  <Link
                    key={event.id}
                    to={`/events/${toSlug(event.name)}`}
                    className="group flex items-start gap-3 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md p-4 transition-all"
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                      style={{ background: CATEGORY_COLORS[event.category] }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                        {event.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{event.date} &middot; {event.venue}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: `${CATEGORY_COLORS[event.category]}15`, color: CATEGORY_COLORS[event.category] }}>
                          {cat?.label}
                        </span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          Directions →
                        </a>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
