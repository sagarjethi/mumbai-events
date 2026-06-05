// Bento — modular grid. Each event is its own tile with the header
// pulling color from the theme. Reads instantly, very feed-native.

import { CATEGORIES } from '../../../data';
import { DOMAIN, fs, dayLabel, dowLabel } from '../slideUtils';

function BFooter({ theme, w, padX }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        padding: `${fs(w, 0.035)}px ${padX}px`,
        background: theme.accent,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: `${fs(w, 0.022)}px`,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}
    >
      <span>{DOMAIN}</span>
      <span style={{ opacity: 0.85 }}>Mumbai tech events</span>
    </div>
  );
}

function Tile({ e, theme, w, slim = false }) {
  const cat = CATEGORIES[e.category];
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: fs(w, 0.022),
        padding: `${fs(w, slim ? 0.018 : 0.025)}px ${fs(w, 0.022)}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: fs(w, 0.008),
        boxShadow: '0 1px 0 rgba(15,23,42,0.04)',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: `${fs(w, slim ? 0.02 : 0.022)}px`, color: theme.accent, fontWeight: 800, letterSpacing: '0.08em' }}>
          {dowLabel(e.startDate)} · {dayLabel(e.startDate)}
        </div>
        {cat && (
          <div style={{ fontSize: `${fs(w, 0.018)}px`, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {cat.label}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: `${fs(w, slim ? 0.026 : 0.03)}px`,
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.2,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: slim ? 1 : 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {e.name}
      </div>
      <div
        style={{
          fontSize: `${fs(w, 0.02)}px`,
          color: '#64748b',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {e.venue}
      </div>
    </div>
  );
}

export function CoverSlide({ slide, theme, w, padX, padY }) {
  const previewTiles = (slide.preview || []).slice(0, 4);
  return (
    <>
      <div
        style={{
          background: theme.accent,
          color: '#fff',
          padding: `${padY}px ${padX}px ${fs(w, 0.05)}px`,
        }}
      >
        <div style={{ fontSize: `${fs(w, 0.022)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
          {slide.period.kind === 'week' ? 'Weekly digest' : 'Monthly digest'} · Mumbai
        </div>
        <div style={{ marginTop: fs(w, 0.025), fontSize: `${fs(w, 0.075)}px`, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em' }}>
          {slide.period.label}
        </div>
        <div style={{ marginTop: fs(w, 0.018), fontSize: `${fs(w, 0.034)}px`, opacity: 0.95, fontWeight: 600 }}>
          {slide.totalCount} {slide.totalCount === 1 ? 'event' : 'events'} · in-person
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: `${fs(w, 0.035)}px ${padX}px`,
          background: '#f8fafc',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: fs(w, 0.022),
          alignContent: 'flex-start',
        }}
      >
        {previewTiles.map((e) => <Tile key={e.id} e={e} theme={theme} w={w} />)}
        {slide.totalCount > previewTiles.length && (
          <div
            style={{
              gridColumn: '1 / -1',
              fontSize: `${fs(w, 0.024)}px`,
              color: theme.accent,
              fontWeight: 700,
              padding: `${fs(w, 0.012)}px 0`,
            }}
          >
            + {slide.totalCount - previewTiles.length} more — swipe →
          </div>
        )}
      </div>

      <BFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function EventsSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div style={{ background: theme.accent, color: '#fff', padding: `${padY * 0.7}px ${padX}px ${fs(w, 0.025)}px` }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
          {slide.period.short} · {slide.slot}
        </div>
        <div style={{ marginTop: fs(w, 0.012), fontSize: `${fs(w, 0.05)}px`, fontWeight: 900, letterSpacing: '-0.02em' }}>
          What&apos;s on
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: `${fs(w, 0.03)}px ${padX}px`,
          background: '#f8fafc',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: fs(w, 0.022),
          alignContent: 'flex-start',
        }}
      >
        {slide.events.map((e) => <Tile key={e.id} e={e} theme={theme} w={w} />)}
      </div>
      <BFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function CtaSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div style={{ background: theme.accent, color: '#fff', padding: `${padY}px ${padX}px ${fs(w, 0.04)}px` }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
          See all {slide.totalCount} events
        </div>
        <div style={{ marginTop: fs(w, 0.018), fontSize: `${fs(w, 0.07)}px`, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
          Tap or scan
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: `${fs(w, 0.04)}px ${padX}px`,
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: fs(w, 0.025),
          textAlign: 'center',
        }}
      >
        {slide.qrSvg && (
          <div
            style={{ background: '#fff', padding: fs(w, 0.025), borderRadius: fs(w, 0.022), border: '1px solid #e2e8f0' }}
            dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
          />
        )}
        <div style={{ fontSize: `${fs(w, 0.028)}px`, fontWeight: 700, color: '#0f172a', wordBreak: 'break-all', maxWidth: '85%' }}>
          {slide.deepLink}
        </div>
      </div>
      <BFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function LongformSlide({ slide, theme, w, h, padX, padY }) {
  const list = slide.events;
  // Decide grid columns + max tiles by available height
  const cols = w < 1100 ? 2 : 2;
  const HEADER_RATIO = 0.18;
  const FOOTER_RATIO = 0.18; // QR strip + footer
  const usable = h * (1 - HEADER_RATIO - FOOTER_RATIO);
  const baseTileH = fs(w, 0.13);
  let tileScale = 1;
  while (tileScale > 0.6 && Math.ceil(list.length / cols) * baseTileH * tileScale > usable) {
    tileScale -= 0.05;
  }
  const fits = Math.ceil(list.length / cols) * baseTileH * tileScale <= usable;
  const fittedCount = fits ? list.length : Math.floor((usable / (baseTileH * 0.6)) * cols);
  const visible = list.slice(0, fittedCount);
  const remainder = list.length - visible.length;

  return (
    <>
      <div style={{ background: theme.accent, color: '#fff', padding: `${padY}px ${padX}px ${fs(w, 0.025)}px` }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
          {slide.period.kind === 'week' ? 'Weekly digest' : 'Monthly digest'} · Mumbai
        </div>
        <div style={{ marginTop: fs(w, 0.014), fontSize: `${fs(w, 0.06)}px`, fontWeight: 900, letterSpacing: '-0.02em' }}>
          {slide.period.label}
        </div>
        <div style={{ marginTop: fs(w, 0.012), fontSize: `${fs(w, 0.026)}px`, opacity: 0.95, fontWeight: 600 }}>
          {list.length} events · in-person
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: `${fs(w, 0.025)}px ${padX}px`,
          background: '#f8fafc',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: fs(w, 0.018 * tileScale),
          alignContent: 'flex-start',
        }}
      >
        {visible.map((e) => <Tile key={e.id} e={e} theme={theme} w={w} slim={tileScale < 0.85} />)}
        {remainder > 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              fontSize: `${fs(w, 0.024)}px`,
              color: theme.accent,
              fontWeight: 800,
              textAlign: 'center',
              padding: `${fs(w, 0.012)}px 0`,
            }}
          >
            + {remainder} more — scan QR to see them all
          </div>
        )}
      </div>

      {slide.qrSvg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: fs(w, 0.025),
            padding: `${fs(w, 0.025)}px ${padX}px`,
            background: '#0f172a',
            color: '#fff',
          }}
        >
          <div
            style={{ background: '#fff', padding: fs(w, 0.012), borderRadius: fs(w, 0.012) }}
            dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: `${fs(w, 0.02)}px`, color: '#cbd5e1', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Open the live list
            </div>
            <div style={{ fontSize: `${fs(w, 0.024)}px`, fontWeight: 700, marginTop: 4, wordBreak: 'break-all' }}>
              {slide.deepLink}
            </div>
          </div>
        </div>
      )}
      <BFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function EmptySlide({ theme, w, padX, padY }) {
  return (
    <>
      <div style={{ background: theme.accent, color: '#fff', padding: `${padY}px ${padX}px ${fs(w, 0.04)}px` }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, opacity: 0.85 }}>
          0 events
        </div>
        <div style={{ marginTop: fs(w, 0.018), fontSize: `${fs(w, 0.07)}px`, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
          Nothing here.
        </div>
      </div>
      <div style={{ flex: 1, padding: `${fs(w, 0.05)}px ${padX}px`, background: '#f8fafc', color: '#475569', fontSize: `${fs(w, 0.028)}px`, fontWeight: 500 }}>
        Pick another period or clear the search.
      </div>
      <BFooter theme={theme} w={w} padX={padX} />
    </>
  );
}
