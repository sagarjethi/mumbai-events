// Event category palette. Single source of truth — referenced by EventCard,
// MonthCalendar, EventsGrid, MapPage, etc. Add a new category here and it
// becomes selectable everywhere.
export const CATEGORIES = {
  conference: { label: 'Conference', color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500' },
  hackathon: { label: 'Hackathon', color: 'bg-violet-50 text-violet-600', dot: 'bg-violet-500' },
  startup: { label: 'Startup', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  web3: { label: 'Web3 / Crypto', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  meetup: { label: 'Meetup', color: 'bg-cyan-50 text-cyan-600', dot: 'bg-cyan-500' },
  music: { label: 'Music & Culture', color: 'bg-rose-50 text-rose-500', dot: 'bg-rose-500' },
  sports: { label: 'Sports', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-600' },
  expo: { label: 'Expo', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-500' },
  cybersecurity: { label: 'Cybersecurity', color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-600' },
};
