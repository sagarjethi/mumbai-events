import { useState } from 'react';

// Event cover artwork. Uses a real `image` (e.g. a Lu.ma CDN cover) when one is
// supplied and loads cleanly; otherwise falls back to a branded, category-tinted
// gradient with a watermark glyph so every card stays visually consistent and
// "beautiful" even when an event has no artwork. Shared by EventCard + EventDetail.

const GRADIENTS = {
  conference: 'from-primary-500 via-primary-600 to-primary-800',
  hackathon: 'from-violet-500 via-violet-600 to-violet-800',
  startup: 'from-emerald-500 via-emerald-600 to-emerald-800',
  web3: 'from-amber-400 via-amber-500 to-amber-700',
  meetup: 'from-cyan-500 via-cyan-600 to-cyan-800',
  music: 'from-rose-500 via-rose-600 to-rose-800',
  sports: 'from-emerald-500 via-emerald-600 to-emerald-800',
  expo: 'from-slate-500 via-slate-600 to-slate-800',
  cybersecurity: 'from-rose-500 via-rose-600 to-rose-800',
  workshop: 'from-indigo-500 via-indigo-600 to-indigo-800',
};

const GLYPHS = {
  conference: '🎤',
  hackathon: '{ }',
  startup: '🚀',
  web3: '⛓️',
  meetup: '👥',
  music: '🎵',
  sports: '🏃',
  expo: '🏛️',
  cybersecurity: '🔒',
  workshop: '🛠️',
};

export function coverGradient(category) {
  return GRADIENTS[category] || GRADIENTS.conference;
}

export default function EventCover({
  event,
  className = '',
  rounded = '',
  showGlyph = true,
  children,
}) {
  const [errored, setErrored] = useState(false);
  const gradient = coverGradient(event.category);
  const glyph = GLYPHS[event.category] || '📅';
  const useImage = event.image && !errored;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${rounded} ${className}`}>
      {useImage ? (
        <>
          <img
            src={event.image}
            alt={`${event.name} cover`}
            loading="lazy"
            decoding="async"
            onError={() => setErrored(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Legibility scrim so overlaid pills/text stay readable on any photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
        </>
      ) : (
        <>
          {/* Soft decorative blobs for depth on the gradient fallback */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute -top-10 -right-8 w-40 h-40 bg-white rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-6 w-36 h-36 bg-white rounded-full blur-2xl" />
          </div>
          {showGlyph && (
            <div
              className="absolute inset-0 flex items-center justify-center text-white/25 font-bold select-none"
              aria-hidden="true"
              style={{ fontSize: '4.5rem' }}
            >
              {glyph}
            </div>
          )}
        </>
      )}
      {children}
    </div>
  );
}
