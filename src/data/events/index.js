import { juneEvents } from './june-2026';
import { julyEvents } from './july-2026';
import { septemberEvents } from './september-2026';

// All events, in startDate order. Add new entries to the per-month files;
// this combine layer stays untouched.
export const events = [...juneEvents, ...julyEvents, ...septemberEvents]
  .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
