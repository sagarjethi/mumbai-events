import { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Above-the-fold: keep eager so first paint is fast and SEO crawlers see them.
import Header from './components/Header';
import Navigation from './components/Navigation';
import Stats from './components/Stats';
import HomeCalendar from './components/HomeCalendar';
import EventsGrid from './components/EventsGrid';
import Footer from './components/Footer';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
import SubscribeBar from './components/SubscribeBar';
import CardsCallout from './components/CardsCallout';

// Below-the-fold on home: lazy so the homepage TTI is faster.
const SocialBuzz = lazy(() => import('./components/SocialBuzz'));
const Platforms = lazy(() => import('./components/Platforms'));

// Per-route components: lazy-loaded so each route is its own chunk.
// Saves ~200KB+ from the homepage bundle (Leaflet alone ships ~150KB).
const EventDetail = lazy(() => import('./components/EventDetail'));
const MonthsIndexPage = lazy(() => import('./components/MonthEventsPage').then((m) => ({ default: m.MonthsIndexPage })));
const MonthEventsPage = lazy(() => import('./components/MonthEventsPage'));
const CollectionPage = lazy(() => import('./components/CollectionPage'));
const CollegeFestsPage = lazy(() => import('./components/CollegeFestsPage'));
const SocialPage = lazy(() => import('./components/SocialPage'));
const MapPage = lazy(() => import('./components/MapPage'));
const AcceleratorsPage = lazy(() => import('./components/AcceleratorsPage'));
const AcceleratorDetail = lazy(() => import('./components/AcceleratorDetail'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const EditorialPage = lazy(() => import('./components/EditorialPage'));
const CardsPage = lazy(() => import('./components/CardsPage'));

// Minimal route-level loading fallback. Keeps CLS low — same height as a hero.
function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary-500 animate-spin" aria-label="Loading" />
    </div>
  );
}

function HomePage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen">
      <SEO />
      <Header />
      <Stats />
      <CardsCallout />
      <HomeCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <EventsGrid selectedDate={selectedDate} onClearDate={() => setSelectedDate(null)} />
      <Suspense fallback={null}>
        <SocialBuzz />
        <Platforms />
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Navigation />
      <SubscribeBar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<MonthsIndexPage />} />
          <Route path="/events/june-2026" element={<MonthEventsPage month="june-2026" />} />
          <Route path="/events/:slug" element={<EventDetail />} />

          {/* SEO landing pages — generic CollectionPage with config-driven filters */}
          <Route path="/free-tech-events-mumbai" element={<CollectionPage slug="free-tech-events-mumbai" />} />
          <Route path="/ai-events-mumbai-2026" element={<CollectionPage slug="ai-events-mumbai-2026" />} />
          <Route path="/conferences-mumbai-2026" element={<CollectionPage slug="conferences-mumbai-2026" />} />
          <Route path="/web3-events-mumbai-2026" element={<CollectionPage slug="web3-events-mumbai-2026" />} />
          <Route path="/tech-events-this-weekend-mumbai" element={<CollectionPage slug="tech-events-this-weekend-mumbai" />} />
          <Route path="/college-fests-mumbai-2026" element={<CollegeFestsPage />} />
          <Route path="/accelerators" element={<AcceleratorsPage />} />
          <Route path="/accelerators/:slug" element={<AcceleratorDetail />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/editorial" element={<EditorialPage />} />
          <Route path="/cards" element={<CardsPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
