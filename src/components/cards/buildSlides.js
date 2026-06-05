// Pure function that turns (period, filtered events, format, size) into a
// list of slide descriptors. CardSlide is a switch on `kind` — keep this
// file the single source of truth for the per-period composition.

const EVENTS_PER_SLIDE = 4;

// How many events to surface on the cover slide as a "what's coming" tease
// — keeps the card feeling like an actual digest, not just a title page.
const COVER_PREVIEW = 3;

export const SIZES = {
  square:   { id: 'square',   label: 'Square 1:1',   width: 1080, height: 1080 },
  portrait: { id: 'portrait', label: 'Portrait 4:5', width: 1080, height: 1350 },
  story:    { id: 'story',    label: 'Story 9:16',   width: 1080, height: 1920 },
};

export const FORMATS = {
  carousel: { id: 'carousel', label: 'Carousel slides' },
  single:   { id: 'single',   label: 'Single tall card' },
};

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export function buildSlides({ period, events, format, qrSvg, deepLink }) {
  if (!period || events.length === 0) {
    return [
      {
        kind: 'empty',
        period,
      },
    ];
  }

  if (format === 'single') {
    return [
      {
        kind: 'longform',
        period,
        events,
        qrSvg,
        deepLink,
      },
    ];
  }

  // carousel — cover (with event preview) + up to 4 event slides + cta
  const groups = chunk(events, EVENTS_PER_SLIDE).slice(0, 4);
  const slides = [
    {
      kind: 'cover',
      period,
      totalCount: events.length,
      preview: events.slice(0, COVER_PREVIEW),
    },
    ...groups.map((g, i) => ({
      kind: 'events',
      period,
      events: g,
      slot: `${i + 1}of${groups.length}`,
    })),
    { kind: 'cta', period, qrSvg, deepLink, totalCount: events.length },
  ];
  return slides;
}
