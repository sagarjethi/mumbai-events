// Single import surface for everything data-related.
// Prefer:  import { events, CATEGORIES } from '../data';
// Over:    import { events, CATEGORIES } from '../data/events';
//
// The legacy '../data/events' import path still works as a shim, but new
// code should target this barrel so we can refactor underlying files freely.

/**
 * @typedef {Object} EventRecord
 * @property {number} id                Unique numeric id (kept stable across edits)
 * @property {string} name              Display title
 * @property {string} date              Human-readable label, e.g. "Apr 22–23"
 * @property {string} startDate         ISO yyyy-mm-dd in IST timezone
 * @property {string} endDate           ISO yyyy-mm-dd; equal to startDate for single-day events
 * @property {string} venue             Venue name + area, e.g. "Jio World Convention Centre, BKC, Mumbai"
 * @property {string} time              Display time range, e.g. "10:00 AM – 9:30 PM" or "2 full days"
 * @property {string} cost              "Free", "₹15,000–₹33,000", "Paid (~$195)", "See event page", etc.
 * @property {keyof CATEGORIES} category   conference | hackathon | startup | web3 | meetup | music | sports | expo | cybersecurity
 * @property {string[]} tags            Topic tags surfaced on cards + filter
 * @property {string} description       1–3 sentences. Surfaced on EventCard + EventDetail.
 * @property {string} link              Primary outbound URL — registration page (UTM-tagged at render time)
 * @property {string=} website          Optional secondary URL — official conference homepage
 * @property {string=} prize            Display prize, e.g. "$100,000" or "₹2L"
 * @property {boolean=} featured        If true, surfaces in the homepage featured strip
 * @property {number=} lat              Map marker latitude
 * @property {number=} lng              Map marker longitude
 * @property {string=} source           "luma" | "eventbrite" | "meetup" | "hasgeek" | "gdg" — for attribution
 * @property {string[]=} themes         Hackathon track themes (used by HackathonsPage)
 * @property {string[]=} featuredToolIds   Builder-resources tool refs
 */

/** @typedef {{ label: string, color: string, dot: string }} CategoryEntry */
/** @typedef {Record<string, CategoryEntry>} Categories */

// Core events surface
export { events } from './events/index';
export { juneEvents } from './events/june-2026';

// Reference / chrome data
export { CATEGORIES } from './categories';
export { calendarDays } from './calendar-days';
export { platforms } from './platforms';

// Curated landing pages
export { COLLECTIONS, isFree, matchesAi, matchesWeb3 } from './seo-collections';
export { FESTS as collegeFests } from './college-fests';

// Social
export { socialBuzz } from './social/buzz';
// Re-export all the richer SocialPage arrays
export {
  xPosts,
  linkedinPosts,
  instagramReels,
  notablePeople,
  lumaEvents,
  couponsAndDeals,
} from './social';

// Accelerators (already in its own module)
export { accelerators } from './accelerators';
