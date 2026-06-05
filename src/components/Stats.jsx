import {
  EVENT_COUNT,
  FREE_COUNT,
  CONFERENCE_COUNT,
  MEETUP_COUNT,
} from '../utils/stats';

// Compact stat strip — replaces the 4-card gradient grid that competed with the
// hero. One inline row, hairline divided. Floats over the hero edge for that
// "credibility ribbon" feel without adding another section block.
export default function Stats() {
  const stats = [
    { value: `${EVENT_COUNT}+`, label: 'events' },
    { value: CONFERENCE_COUNT, label: 'conferences' },
    { value: FREE_COUNT, label: 'free' },
    { value: MEETUP_COUNT, label: 'meetups' },
  ];

  return (
    <section
      aria-label="Directory stats"
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 sm:-mt-9 mb-2 relative z-10"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={[
              'px-4 py-3 sm:py-4 text-center',
              // hairline borders only between cells
              i > 0 ? 'sm:border-l border-slate-100' : '',
              i >= 2 ? 'border-t sm:border-t-0 border-slate-100' : '',
              i === 1 ? 'border-l border-slate-100' : '',
            ].join(' ')}
          >
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
              {s.value}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-slate-500 mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
