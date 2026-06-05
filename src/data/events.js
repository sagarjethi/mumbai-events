// Backwards-compat shim. New consumers should import from `../data` (barrel)
// or from the specific files. Keeping this file so we don't break any
// `from '../data/events'` import in one PR.

export { events } from './events/index';
export { CATEGORIES } from './categories';
export { calendarDays } from './calendar-days';
export { platforms } from './platforms';
