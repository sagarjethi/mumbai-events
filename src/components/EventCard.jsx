import { Link } from 'react-router-dom';
import { MapPin, Clock, Tag, ExternalLink, Trophy } from 'lucide-react';
import { CATEGORIES } from '../data';
import { toSlug } from '../utils/slug';
import { addUtm } from '../utils/utm';

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function daysBetween(aIso, bIso) {
  const [y1, m1, d1] = aIso.split('-').map(Number);
  const [y2, m2, d2] = bIso.split('-').map(Number);
  const a = new Date(Date.UTC(y1, m1 - 1, d1)).getTime();
  const b = new Date(Date.UTC(y2, m2 - 1, d2)).getTime();
  return Math.round((b - a) / 86400000);
}

// Returns { label, tone } for a relevance badge — or null if not relevant.
// Past, today, tomorrow, this-week. Anything further out is implicit (event date already shown).
function relevanceBadge(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const today = todayIso();
  if (endDate < today) return { label: 'Past', tone: 'past' };
  if (startDate <= today && endDate >= today) return { label: 'Live · Today', tone: 'live' };
  const delta = daysBetween(today, startDate);
  if (delta === 1) return { label: 'Tomorrow', tone: 'soon' };
  if (delta <= 7) return { label: `In ${delta} days`, tone: 'soon' };
  return null;
}
const RELEVANCE_TONES = {
  live: 'bg-rose-50 text-rose-700 ring-rose-100',
  soon: 'bg-amber-50 text-amber-700 ring-amber-100',
  past: 'bg-slate-100 text-slate-500 ring-slate-200',
};

// Cards in a grid must align bottoms. Strategy:
//   article  → flex flex-col h-full (stretches with grid row)
//   header   → fixed-rhythm rows: badges, title (clamp 2), description (clamp 2)
//   meta     → fixed slots; venue truncates rather than wraps
//   tags     → single row; overflow with "+N"
//   actions  → mt-auto pins this to the bottom regardless of content above
const MAX_VISIBLE_TAGS = 3;

export default function EventCard({ event }) {
  const cat = CATEGORIES[event.category];
  const slug = toSlug(event.name);
  const isFree = /\bfree\b/i.test(event.cost || '');
  const detailHref = `/events/${slug}`;
  const tags = event.tags || [];
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflowTags = tags.length - visibleTags.length;
  const relevance = relevanceBadge(event.startDate, event.endDate);
  const isPast = relevance?.tone === 'past';

  return (
    <article
      itemScope
      itemType="https://schema.org/Event"
      className={[
        'group relative flex flex-col h-full bg-white rounded-xl border overflow-hidden',
        'border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200',
        event.featured ? 'ring-1 ring-primary-200' : '',
        isPast ? 'opacity-70 hover:opacity-100' : '',
      ].join(' ')}
    >
      {event.featured && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-[11px] font-semibold tracking-wide px-4 py-1 text-center" aria-label="Featured event">
          FEATURED EVENT
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Badges row — always present, fixed height */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2 min-h-[22px]">
          {/* Relevance pill comes first when present — most-scannable signal */}
          {relevance && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${RELEVANCE_TONES[relevance.tone]}`}>
              {relevance.tone === 'live' && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              )}
              {relevance.label}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cat?.color || 'bg-slate-100 text-slate-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cat?.dot || 'bg-slate-400'}`} />
            {cat?.label || event.category}
          </span>
          {isFree && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              Free
            </span>
          )}
          {event.prize && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
              <Trophy className="w-3 h-3" aria-hidden="true" />
              {event.prize}
            </span>
          )}
        </div>

        {/* Title — clamped to 2 lines, fixed line-height for rhythm */}
        <h3 className="font-semibold text-slate-900 leading-snug text-[17px] line-clamp-2 min-h-[2.6em]">
          <Link to={detailHref} className="group-hover:text-primary-700 transition-colors" itemProp="name">
            {event.name}
          </Link>
        </h3>

        {/* Description — clamped to 2 lines */}
        <p
          itemProp="description"
          className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[2.6em]"
        >
          {event.description}
        </p>

        {/* Meta — date / venue / cost. Single-line truncation prevents wrap chaos. */}
        <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2 min-w-0">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <time itemProp="startDate" dateTime={event.startDate} className="font-medium text-slate-700">
              {event.date}
            </time>
            {event.time && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="truncate">{event.time}</span>
              </>
            )}
            <meta itemProp="endDate" content={event.endDate} />
          </li>
          <li className="flex items-center gap-2 min-w-0" itemProp="location" itemScope itemType="https://schema.org/Place">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span itemProp="name" className="truncate">{event.venue}</span>
            <meta itemProp="address" content="Mumbai, Maharashtra, India" />
          </li>
          {!isFree && event.cost && (
            <li className="flex items-center gap-2 min-w-0">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.cost}</span>
            </li>
          )}
        </ul>

        {/* Tags — single row, overflow as "+N" chip */}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-nowrap gap-1.5 overflow-hidden" aria-label="Tags">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="shrink-0 px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[11px] border border-slate-100 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {overflowTags > 0 && (
              <span className="shrink-0 px-2 py-0.5 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                +{overflowTags}
              </span>
            )}
          </div>
        )}

        {/* Spacer pushes actions to bottom — only kicks in when content is short */}
        <div className="flex-1" />

        {/* Actions — pinned to card bottom, equal-weight buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            to={detailHref}
            aria-label={`View details for ${event.name}`}
            className="inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <a
            href={addUtm(event.link, 'event-card', slug)}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            itemProp="url"
            aria-label={`Register for ${event.name}`}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            Register
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
