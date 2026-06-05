import { Helmet } from 'react-helmet-async';
import { events } from '../data/events';

const TODAY_ISO = new Date().toISOString().slice(0, 10);

function generateAllEventsJsonLd() {
  return events
    .filter((event) => event.startDate && !event.startDate.includes('TBA'))
    .map((event) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      author: { '@id': 'https://mumbai-events.sagarjethi.com/#sagar' },
      publisher: { '@id': 'https://mumbai-events.sagarjethi.com/#organization' },
      dateModified: TODAY_ISO,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      eventAttendanceMode: event.venue?.toLowerCase().includes('virtual')
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: event.venue?.toLowerCase().includes('virtual')
        ? { '@type': 'VirtualLocation', url: event.link }
        : {
            '@type': 'Place',
            name: event.venue,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Mumbai',
              addressRegion: 'Maharashtra',
              addressCountry: 'IN',
            },
            ...(event.lat && event.lng ? { geo: { '@type': 'GeoCoordinates', latitude: event.lat, longitude: event.lng } } : {}),
          },
      organizer: { '@type': 'Organization', name: event.tags?.[0] || 'Mumbai Events' },
      performer: { '@type': 'Organization', name: event.tags?.[0] || 'Mumbai Events' },
      image: 'https://mumbai-events.sagarjethi.com/og-image.png',
      ...(event.cost === 'Free' || event.cost?.toLowerCase().includes('free')
        ? {
            isAccessibleForFree: true,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: event.link,
            },
          }
        : {
            offers: {
              '@type': 'Offer',
              url: event.link,
              availability: 'https://schema.org/InStock',
            },
          }),
      url: event.link,
      ...(event.website ? { sameAs: event.website } : {}),
    }));
}

// Organization + Person JSON-LD — establishes E-E-A-T (Experience, Expertise,
// Authoritativeness, Trustworthiness) signals that LLMs and Google AI
// Overviews weigh when deciding which sources to cite.
const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://mumbai-events.sagarjethi.com/#organization',
  name: 'Mumbai Tech Events',
  alternateName: 'Mumbai Tech Events',
  url: 'https://mumbai-events.sagarjethi.com',
  logo: 'https://mumbai-events.sagarjethi.com/og-image.png',
  description:
    "India's most complete, link-verified directory of tech events, hackathons, conferences, and meetups in Mumbai. Curated by an independent operator, refreshed daily.",
  founder: {
    '@type': 'Person',
    '@id': 'https://mumbai-events.sagarjethi.com/#sagar',
    name: 'Sagar Jethi',
    alternateName: '@sagarjethi',
    url: 'https://sagarjethi.com',
    jobTitle: 'Software Engineer & Independent Curator',
    description:
      'Mumbai-based engineer who has attended, spoken at, and helped organize tech events across the city since 2018.',
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
      'https://sagarjethi.com',
    ],
  },
  sameAs: [
    'https://github.com/sagarjethi/mumbai-events-2026',
    'https://x.com/sagarbjethi',
  ],
  areaServed: {
    '@type': 'City',
    name: 'Mumbai',
    sameAs: 'https://en.wikipedia.org/wiki/Mumbai',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
  },
};

const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://mumbai-events.sagarjethi.com/#website',
  url: 'https://mumbai-events.sagarjethi.com',
  name: 'Mumbai Tech Events',
  publisher: { '@id': 'https://mumbai-events.sagarjethi.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://mumbai-events.sagarjethi.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
};

export default function SEO() {
  const allEventsJsonLd = generateAllEventsJsonLd();

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_LD)}</script>
      {allEventsJsonLd.map((eventLd) => (
        <script key={eventLd.name} type="application/ld+json">
          {JSON.stringify(eventLd)}
        </script>
      ))}
    </Helmet>
  );
}
