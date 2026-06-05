import { useState } from 'react';
import { events, CATEGORIES } from '../data/events';
import { ExternalLink, Heart, X } from 'lucide-react';
import EmailCapture from './EmailCapture';
import MonthCalendar from './MonthCalendar';

const MONTHS = [
  { key: 'apr', year: 2026, monthNum: 4, label: 'April', long: 'June 2026' },
  { key: 'may', year: 2026, monthNum: 5, label: 'May', long: 'May 2026' },
];

function defaultMonthKey() {
  const d = new Date();
  if (d.getFullYear() === 2026 && d.getMonth() + 1 === 5) return 'may';
  return 'apr';
}

const TWEET_URL = 'https://x.com/sagarbjethi/status/2043607049679057396';
const FOLLOW_URL = 'https://x.com/intent/follow?screen_name=sagarbjethi';
const STORAGE_KEY = 'calendar-support-shown';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function CalendarView({ onDateSelect, selectedDate }) {
  const [showSupport, setShowSupport] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [activeMonth, setActiveMonth] = useState(() => {
    // Auto-switch to the month of the currently-selected date
    if (selectedDate?.startsWith('2026-05')) return 'may';
    return defaultMonthKey();
  });

  const handleDateClick = (date) => {
    const isSelected = selectedDate === date;
    const nextDate = isSelected ? null : date;

    // Show support popup once per session on first calendar click
    if (!isSelected && !sessionStorage.getItem(STORAGE_KEY)) {
      setPendingDate(nextDate);
      setShowSupport(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
      return;
    }

    onDateSelect(nextDate);
  };

  const counts = MONTHS.reduce((acc, m) => {
    acc[m.key] = events.filter((e) => {
      const sd = e.startDate || '';
      const [y, mo] = sd.split('-').map(Number);
      return y === m.year && mo === m.monthNum;
    }).length;
    return acc;
  }, {});

  const current = MONTHS.find((m) => m.key === activeMonth) || MONTHS[0];

  const handleDismiss = () => {
    setShowSupport(false);
    if (pendingDate !== null) {
      onDateSelect(pendingDate);
    }
    setPendingDate(null);
  };

  return (
    <section id="calendar" aria-label="Event calendar — June 2026" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Event Calendar</h2>
        <p className="mt-2 text-slate-500">Click a date to filter — switch months below.</p>
      </div>

      {/* Month tabs */}
      <div className="flex justify-center mb-6">
        <div role="tablist" aria-label="Pick month" className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200">
          {MONTHS.map((m) => {
            const active = m.key === activeMonth;
            return (
              <button
                key={m.key}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveMonth(m.key);
                  // Clear cross-month selection so the EventsGrid below isn't stale.
                  if (selectedDate && !selectedDate.startsWith(`${m.year}-${String(m.monthNum).padStart(2, '0')}`)) {
                    onDateSelect(null);
                  }
                }}
                className={[
                  'inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all',
                  active
                    ? 'bg-white text-primary-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800',
                ].join(' ')}
              >
                {m.long}
                <span className={[
                  'inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-[11px] font-bold',
                  active ? 'bg-primary-100 text-primary-700' : 'bg-white text-slate-500',
                ].join(' ')}>
                  {counts[m.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <MonthCalendar
        year={current.year}
        monthNum={current.monthNum}
        monthLabel={current.long}
        selectedDate={selectedDate}
        onDateSelect={handleDateClick}
      />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </span>
        ))}
      </div>

      {/* Support Popup */}
      {showSupport && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" onClick={handleDismiss}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-violet-500" />

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 pt-5 text-center">
              {/* Namaste */}
              <div className="text-5xl mb-3">🙏</div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Namaste! Enjoying this?
              </h3>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                This directory is free and took hours to build. A quick like or follow helps more people discover these amazing events!
              </p>

              <div className="space-y-2">
                <a
                  href={TWEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  Like the tweet
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
                <a
                  href={FOLLOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <XIcon className="w-4 h-4" />
                  Follow @sagarbjethi
                </a>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or just get email updates</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Email capture */}
              <EmailCapture
                variant="compact"
                placeholder="you@example.com"
                cta="Subscribe"
                source="calendar-modal"
                successMessage="Subscribed 🙏"
              />

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
