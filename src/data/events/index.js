import { juneEvents } from './june-2026';

// All events, in startDate order. Add new entries to the per-month file
// (june-2026.js); this combine layer stays untouched.
export const events = [...juneEvents]
  .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
