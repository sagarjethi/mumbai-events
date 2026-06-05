import { useMemo, useState, useRef } from 'react';
import { events as ALL_EVENTS, CATEGORIES } from '../data/events';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function buildMonthGrid(year, monthNum) {
  const first = new Date(Date.UTC(year, monthNum - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const startWeekday = first.getUTCDay();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: `${year}-${pad(monthNum)}-${pad(d)}`, day: d });
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function eventsForDate(date) {
  return ALL_EVENTS.filter((e) => e.startDate <= date && e.endDate >= date);
}

// Heat tier from 0..4 → opacity / size of the activity dot under the day number.
// Airbnb uses presence/absence, but with up to 11 events per day we need density signal too.
function tierFor(count) {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export default function MonthCalendar({ year, monthNum, monthLabel, selectedDate, onDateSelect }) {
  const cells = useMemo(() => buildMonthGrid(year, monthNum), [year, monthNum]);
  const today = todayIso();
  const [hover, setHover] = useState(null); // { date, x, y } for popover positioning
  const popoverRef = useRef(null);

  const totals = useMemo(() => {
    let count = 0;
    for (const c of cells) if (c) count += eventsForDate(c.date).length;
    return count;
  }, [cells]);

  const hoverEvents = hover ? eventsForDate(hover.date) : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{year}</div>
          <div className="text-xl font-semibold text-slate-900 leading-tight tracking-tight">{monthLabel}</div>
        </div>
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700 tabular-nums">{totals}</span> event{totals !== 1 ? 's' : ''} this month
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] border-b border-slate-100">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-2 py-2.5 text-center">{w}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 border-l border-slate-100">
        {cells.map((c, i) => {
          if (!c) {
            return <div key={`e${i}`} className="aspect-square sm:aspect-[5/4] border-r border-b border-slate-100 bg-slate-50/30" />;
          }
          const list = eventsForDate(c.date);
          const has = list.length > 0;
          const isSelected = selectedDate === c.date;
          const isToday = c.date === today;
          const tier = tierFor(list.length);

          return (
            <button
              key={c.date}
              onClick={() => onDateSelect && (has ? onDateSelect(isSelected ? null : c.date) : null)}
              onMouseEnter={(e) => { if (has) setHover({ date: c.date, rect: e.currentTarget.getBoundingClientRect() }); }}
              onMouseLeave={() => setHover(null)}
              onFocus={(e) => { if (has) setHover({ date: c.date, rect: e.currentTarget.getBoundingClientRect() }); }}
              onBlur={() => setHover(null)}
              disabled={!has || !onDateSelect}
              aria-label={`${c.date} — ${list.length} event${list.length !== 1 ? 's' : ''}`}
              aria-pressed={isSelected}
              className={[
                'group relative aspect-square sm:aspect-[5/4] border-r border-b border-slate-100',
                'flex flex-col items-center justify-center transition-colors',
                has ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default',
                isSelected ? 'bg-primary-50/40' : '',
              ].join(' ')}
            >
              {/* Day number — single source of focus */}
              <span
                className={[
                  'inline-flex items-center justify-center w-9 h-9 rounded-full text-base sm:text-[17px] font-semibold transition-all tabular-nums',
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : (has ? 'text-slate-900 group-hover:bg-slate-100' : 'text-slate-300'),
                  isToday && !isSelected ? 'ring-2 ring-primary-400 ring-offset-1' : '',
                ].join(' ')}
              >
                {c.day}
              </span>

              {/* Activity indicator — single dot, opacity scales with density */}
              {has && (
                <span
                  className={[
                    'mt-1.5 h-1 rounded-full transition-all',
                    isSelected ? 'bg-white/80' : 'bg-slate-900',
                    tier === 1 ? 'w-1 opacity-40' : '',
                    tier === 2 ? 'w-2 opacity-60' : '',
                    tier === 3 ? 'w-3 opacity-80' : '',
                    tier === 4 ? 'w-4 opacity-100' : '',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Hover popover — rich info on demand, like Airbnb's price tooltips */}
      {hover && hoverEvents.length > 0 && (
        <HoverPopover
          ref={popoverRef}
          rect={hover.rect}
          date={hover.date}
          events={hoverEvents}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------

function HoverPopover({ rect, date, events: list }) {
  if (!rect) return null;
  // Use fixed positioning since rect is viewport-relative.
  // Clamp horizontally so it doesn't bleed off-screen.
  const cx = Math.max(150, Math.min(window.innerWidth - 150, rect.left + rect.width / 2));
  const top = rect.top - 8;

  const [yyyy, mm, dd] = date.split('-').map(Number);
  const human = new Date(Date.UTC(yyyy, mm - 1, dd)).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
  });

  return (
    <div
      role="tooltip"
      style={{ position: 'fixed', top, left: cx, transform: 'translate(-50%, -100%)' }}
      className="z-50 pointer-events-none"
    >
      <div className="relative rounded-xl bg-slate-900 text-white shadow-2xl ring-1 ring-black/5 w-[260px] py-2.5 px-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs font-semibold tracking-wide text-white/70">{human}</div>
          <div className="text-[11px] font-semibold text-white/90 bg-white/10 rounded-full px-1.5 py-0.5">
            {list.length}
          </div>
        </div>
        <ul className="space-y-1">
          {list.slice(0, 4).map((e) => (
            <li key={e.id} className="flex items-start gap-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${CATEGORIES[e.category]?.dot || 'bg-slate-400'}`} />
              <span className="text-[13px] leading-snug line-clamp-2">{e.name}</span>
            </li>
          ))}
          {list.length > 4 && (
            <li className="text-[11px] text-white/60 pt-0.5">+ {list.length - 4} more · click to see all</li>
          )}
        </ul>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 bg-slate-900" />
      </div>
    </div>
  );
}
