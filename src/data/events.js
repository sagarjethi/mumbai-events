// Backwards-compat shim. New consumers should import from `../data` (barrel)
// or from the specific files. Keeping this file so we don't break any
// `from '../data/events'` import in one PR.

export { events } from './events/index';
export { CATEGORIES } from './categories';
export { calendarDays } from './calendar-days';
export { platforms } from './platforms';

// socialBuzz still lives here in step 2; step 3 will move it to social/x-posts.js
export { socialBuzz } from './social/buzz';
