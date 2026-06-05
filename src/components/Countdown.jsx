import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Live countdown to event start. Updates every minute.
 * Shows "Live now", "Starts in Xh Ym", "Xd Yh", or "Event passed".
 */
export default function Countdown({ startDate, endDate, className = '' }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!startDate) return null;

  // Assume 9:00 AM IST start if no specific time
  const start = new Date(startDate + 'T09:00:00+05:30');
  const end = new Date((endDate || startDate) + 'T23:59:59+05:30');

  const diffStart = start - now;
  const diffEnd = end - now;

  // Already ended
  if (diffEnd < 0) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold ${className}`}>
        <Clock className="w-3 h-3" />
        Event ended
      </div>
    );
  }

  // Currently running
  if (diffStart <= 0 && diffEnd >= 0) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        LIVE NOW
      </div>
    );
  }

  // Upcoming
  const totalMinutes = Math.floor(diffStart / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let label;
  if (days > 0) {
    label = `Starts in ${days}d ${hours}h`;
  } else if (hours > 0) {
    label = `Starts in ${hours}h ${minutes}m`;
  } else {
    label = `Starts in ${minutes}m`;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 ${className}`}>
      <Clock className="w-3 h-3" />
      {label}
    </div>
  );
}
