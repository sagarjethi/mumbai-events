// Editorial — gradient header + clean event list. Magazine spread feel.

import { CATEGORIES } from '../../../data';
import { DOMAIN, FONT_STACK, dayLabel, dowLabel, fs } from '../slideUtils';

function Footer({ w, padX }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        padding: `${fs(w, 0.04)}px ${padX}px`,
        background: '#0f172a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: `${fs(w, 0.022)}px`,
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ fontWeight: 600 }}>{DOMAIN}</span>
      <span style={{ opacity: 0.7 }}>Curated tech events · Mumbai</span>
    </div>
  );
}

function EventRow({ e, theme, w, scale = 1 }) {
  const cat = CATEGORIES[e.category];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: fs(w, 0.025 * scale),
        padding: `${fs(w, 0.022 * scale)}px 0`,
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: fs(w, 0.13 * scale),
          textAlign: 'center',
          paddingRight: fs(w, 0.02 * scale),
          borderRight: `3px solid ${theme.accent}`,
        }}
      >
        <div style={{ fontSize: `${fs(w, 0.024 * scale)}px`, fontWeight: 700, color: theme.accent, letterSpacing: '0.1em' }}>
          {dowLabel(e.startDate)}
        </div>
        <div style={{ fontSize: `${fs(w, 0.026 * scale)}px`, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 4 }}>
          {dayLabel(e.startDate)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: `${fs(w, 0.034 * scale)}px`,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: fs(w, 0.008),
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {e.name}
        </div>
        <div
          style={{
            fontSize: `${fs(w, 0.024 * scale)}px`,
            color: '#475569',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {e.venue}
        </div>
        {cat && (
          <div
            style={{
              marginTop: fs(w, 0.008),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: `${fs(w, 0.02 * scale)}px`,
              color: theme.accent,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {cat.label}
          </div>
        )}
      </div>
    </div>
  );
}

export function CoverSlide({ slide, theme, w, padX, padY }) {
  const big = fs(w, 0.082);
  const eyebrow = fs(w, 0.026);
  const subhead = fs(w, 0.034);

  return (
    <>
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
          padding: `${padY}px ${padX}px ${fs(w, 0.05)}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: fs(w, 0.025),
        }}
      >
        <div style={{ fontSize: `${eyebrow}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85 }}>
          {slide.period.kind === 'week' ? 'Weekly Digest' : 'Monthly Digest'} · Mumbai
        </div>
        <div style={{ fontSize: `${big}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          {slide.period.label}
        </div>
        <div style={{ fontSize: `${subhead}px`, opacity: 0.92, fontWeight: 500 }}>
          {slide.totalCount} {slide.totalCount === 1 ? 'event' : 'events'} happening · in-person
        </div>
      </div>

      {/* Sneak-peek list right on the cover */}
      <div
        style={{
          flex: 1,
          padding: `${fs(w, 0.04)}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: `${fs(w, 0.022)}px`,
            color: '#475569',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: fs(w, 0.018),
          }}
        >
          {slide.preview && slide.preview.length > 0 ? 'Highlights' : 'Swipe to see them all →'}
        </div>
        {(slide.preview || []).map((e) => (
          <EventRow key={e.id} e={e} theme={theme} w={w} scale={0.95} />
        ))}
        {slide.totalCount > (slide.preview?.length || 0) && (
          <div style={{ marginTop: fs(w, 0.02), fontSize: `${fs(w, 0.024)}px`, color: theme.accent, fontWeight: 700 }}>
            + {slide.totalCount - (slide.preview?.length || 0)} more — swipe →
          </div>
        )}
      </div>

      <Footer w={w} padX={padX} />
    </>
  );
}

export function EventsSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div
        style={{
          padding: `${fs(padY, 0.7)}px ${padX}px ${fs(w, 0.03)}px`,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
        }}
      >
        <div style={{ fontSize: `${fs(w, 0.024)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85 }}>
          {slide.period.short} · {slide.slot}
        </div>
        <div style={{ marginTop: fs(w, 0.012), fontSize: `${fs(w, 0.046)}px`, fontWeight: 800, letterSpacing: '-0.01em' }}>
          What's on
        </div>
      </div>

      <div style={{ flex: 1, padding: `${fs(w, 0.04)}px ${padX}px`, display: 'flex', flexDirection: 'column' }}>
        {slide.events.map((e) => <EventRow key={e.id} e={e} theme={theme} w={w} />)}
      </div>

      <Footer w={w} padX={padX} />
    </>
  );
}

export function CtaSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: `${fs(w, 0.026)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85, marginBottom: fs(w, 0.04) }}>
          See all {slide.totalCount} events
        </div>
        <div style={{ fontSize: `${fs(w, 0.07)}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: fs(w, 0.06), maxWidth: '85%' }}>
          Scan or visit the link
        </div>
        {slide.qrSvg && (
          <div
            style={{ background: '#fff', padding: fs(w, 0.025), borderRadius: fs(w, 0.025), boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
            dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
          />
        )}
        <div style={{ marginTop: fs(w, 0.05), fontSize: `${fs(w, 0.032)}px`, fontWeight: 600, opacity: 0.95, wordBreak: 'break-all', maxWidth: '85%' }}>
          {slide.deepLink}
        </div>
      </div>
      <Footer w={w} padX={padX} />
    </>
  );
}

// Long-form single card: shows ALL events. Auto-shrinks the row spacing
// when there are many so nothing overflows; falls back to a "+ N more"
// line ONLY past a hard ceiling that fills the card edge-to-edge.
export function LongformSlide({ slide, theme, w, h, padX, padY }) {
  const list = slide.events;
  const HEADER_RATIO = 0.22;
  const FOOTER_RATIO = 0.16; // QR strip + footer
  const usable = h * (1 - HEADER_RATIO - FOOTER_RATIO);
  // Iteratively pick a row scale that fits all events; floor at 0.55
  const baseRowH = fs(w, 0.07);
  let rowScale = 1;
  while (rowScale > 0.55 && list.length * baseRowH * rowScale > usable) {
    rowScale -= 0.05;
  }
  const fits = list.length * baseRowH * rowScale <= usable;
  const fittedCount = fits ? list.length : Math.floor(usable / (baseRowH * 0.55));
  const visible = list.slice(0, fittedCount);
  const remainder = list.length - visible.length;

  return (
    <>
      <div
        style={{
          padding: `${padY}px ${padX}px`,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
        }}
      >
        <div style={{ fontSize: `${fs(w, 0.022)}px`, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.85 }}>
          {slide.period.kind === 'week' ? 'Weekly Digest' : 'Monthly Digest'} · Mumbai
        </div>
        <div style={{ marginTop: fs(w, 0.012), fontSize: `${fs(w, 0.06)}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          {slide.period.label}
        </div>
        <div style={{ marginTop: fs(w, 0.014), fontSize: `${fs(w, 0.026)}px`, opacity: 0.9, fontWeight: 500 }}>
          {list.length} events · in-person
        </div>
      </div>

      <div style={{ flex: 1, padding: `${fs(w, 0.025)}px ${padX}px`, display: 'flex', flexDirection: 'column' }}>
        {visible.map((e) => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: fs(w, 0.022),
              padding: `${fs(w, 0.012 * rowScale)}px 0`,
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <div style={{ flexShrink: 0, width: fs(w, 0.1), textAlign: 'center', paddingRight: fs(w, 0.012), borderRight: `3px solid ${theme.accent}` }}>
              <div style={{ fontSize: `${fs(w, 0.018 * rowScale)}px`, fontWeight: 700, color: theme.accent, letterSpacing: '0.1em' }}>
                {dowLabel(e.startDate)}
              </div>
              <div style={{ fontSize: `${fs(w, 0.022 * rowScale)}px`, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 3 }}>
                {dayLabel(e.startDate)}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: `${fs(w, 0.028 * rowScale)}px`,
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {e.name}
              </div>
              <div
                style={{
                  fontSize: `${fs(w, 0.02 * rowScale)}px`,
                  color: '#475569',
                  fontWeight: 500,
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {e.venue}
              </div>
            </div>
          </div>
        ))}
        {remainder > 0 && (
          <div style={{ marginTop: fs(w, 0.02), fontSize: `${fs(w, 0.024)}px`, color: theme.accent, fontWeight: 700 }}>
            + {remainder} more — scan QR or visit the link
          </div>
        )}

        {slide.qrSvg && (
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: fs(w, 0.025),
              paddingTop: fs(w, 0.025),
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{ background: '#fff', padding: fs(w, 0.012), borderRadius: fs(w, 0.012), border: '1px solid #e2e8f0' }}
              dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: `${fs(w, 0.022)}px`, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Open the live list
              </div>
              <div style={{ fontSize: `${fs(w, 0.022)}px`, color: '#0f172a', fontWeight: 600, marginTop: 4, wordBreak: 'break-all' }}>
                {slide.deepLink}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer w={w} padX={padX} />
    </>
  );
}

export function EmptySlide({ theme, w, padX, padY }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: `${fs(w, 0.06)}px`, fontWeight: 800, marginBottom: fs(w, 0.025) }}>
          No events
        </div>
        <div style={{ fontSize: `${fs(w, 0.028)}px`, fontWeight: 500, opacity: 0.9 }}>
          Pick another period or clear the search
        </div>
      </div>
      <Footer w={w} padX={padX} />
    </>
  );
}
