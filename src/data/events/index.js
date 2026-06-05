import { juneEvents } from './june-2026';
import { julyEvents } from './july-2026';

// All events, in startDate order. Add new entries to the per-month files
// (june-2026.js / july-2026.js); this combine layer stays untouched.
export const events = [...juneEvents, ...julyEvents]
  .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
