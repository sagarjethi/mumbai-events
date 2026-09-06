// Multi-event series ("weeks") that group a headline conference with the
// side events orbiting it. Events opt in with `series: '<id>'` plus
// `seriesRole: 'headline' | 'side'` and (for side events) a `sideType` key
// from SIDE_TYPES below. FintechWeekPage, EventCard and EventDetail all read
// from here so the taxonomy lives in exactly one place.

export const SIDE_TYPES = {
  dinner:     { label: 'Dinners & receptions',     short: 'Dinners',     dot: 'bg-rose-500',    chip: 'bg-rose-50 text-rose-700 ring-rose-100' },
  sundowner:  { label: 'Sundowners & mixers',      short: 'Sundowners',  dot: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 ring-amber-100' },
  nightfest:  { label: 'Night fests',              short: 'Night fests', dot: 'bg-violet-500',  chip: 'bg-violet-50 text-violet-700 ring-violet-100' },
  breakfast:  { label: 'Breakfasts',               short: 'Breakfasts',  dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  roundtable: { label: 'Roundtables & boardrooms', short: 'Roundtables', dot: 'bg-primary-500', chip: 'bg-primary-50 text-primary-700 ring-primary-100' },
  community:  { label: 'Community meetups',        short: 'Meetups',     dot: 'bg-cyan-500',    chip: 'bg-cyan-50 text-cyan-700 ring-cyan-100' },
};

export const ACCESS = {
  open:     { label: 'Open RSVP',        hint: 'Register and you are in.' },
  approval: { label: 'Approval needed',  hint: 'Host approves each RSVP.' },
  invite:   { label: 'Invite only',      hint: 'Request an invite from the host.' },
};

export const SERIES = {
  'gff-2026': {
    id: 'gff-2026',
    slug: 'fintech-week-mumbai-2026',
    name: 'Global Fintech Fest 2026',
    short: 'GFF 2026',
    weekLabel: 'Fintech Week in Mumbai',
    startDate: '2026-09-07',
    endDate: '2026-09-12',
    coreStart: '2026-09-08',
    coreEnd: '2026-09-11',
    venue: 'Jio World Centre & Trident BKC, Mumbai',
    theme: 'Potential to Impact',
    tracks: ['Agentic AI', 'Tokenisation', 'Quantum'],
    tagline: 'Trusted, Connected, Global Systems for Inclusive Finance',
    organisers: ['Payments Council of India', 'NPCI', 'Fintech Convergence Council'],
    website: 'https://www.globalfintechfest.com/',
    register: 'https://register.globalfintechfest.com/',
    networking: 'https://www.globalfintechfest.com/gff-networking',
    nightFest: 'https://www.globalfintechfest.com/gff-night-fest',
    // Official counters from globalfintechfest.com (2026 site, "powering" block), read 2026-09-06.
    stats: [
      { label: 'Footfall', value: 100000, suffix: '+', key: true },
      { label: 'Participating institutions', value: 5000, suffix: '+', key: true },
      { label: 'Startups', value: 4500, suffix: '+', key: true },
      { label: 'Speakers', value: 1000, suffix: '+', key: true },
      { label: 'Countries', value: 80, suffix: '+', key: true },
      { label: 'Exhibitors', value: 350, suffix: '+', key: true },
      { label: 'Sessions', value: 360, suffix: '+' },
      { label: 'Founders', value: 200, suffix: '+' },
      { label: 'Regulators', value: 80, suffix: '+' },
      { label: 'Product launches', value: 75, suffix: '+' },
      { label: 'Masterclasses', value: 40, suffix: '+' },
      { label: 'Policy makers', value: 30, suffix: '+' },
      { label: 'Reports launched', value: 15, suffix: '+' },
    ],
    statsSource: 'https://www.globalfintechfest.com/',
    image: '/gff-2026-hero.webp',
    ogImage: '/gff-2026-og.webp',
  },
};

export function seriesOf(event) {
  return event?.series ? SERIES[event.series] : null;
}
