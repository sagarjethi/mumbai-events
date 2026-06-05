// Minimal — bold-minimalism. Solid color block, oversized headline,
// flat list with hairline rules and a single accent line. No gradients.

import { DOMAIN, fs, dayLabel, dowLabel } from '../slideUtils';

function MinFooter({ theme, w, padX }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        padding: `${fs(w, 0.035)}px ${padX}px`,
        borderTop: `1px solid #e2e8f0`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: `${fs(w, 0.02)}px`,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#475569',
        fontWeight: 600,
      }}
    >
      <span>{DOMAIN}</span>
      <span style={{ width: fs(w, 0.04), height: 4, background: theme.accent, borderRadius: 99 }} />
    </div>
  );
}

function MinRow({ e, theme, w, scale = 1 }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: fs(w, 0.025),
        padding: `${fs(w, 0.018 * scale)}px 0`,
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div style={{ flexShrink: 0, width: fs(w, 0.16), color: theme.accent, fontWeight: 800, fontSize: `${fs(w, 0.024 * scale)}px`, letterSpacing: '0.06em' }}>
        {dowLabel(e.startDate)} · {dayLabel(e.startDate)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: `${fs(w, 0.034 * scale)}px`,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
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
            fontSize: `${fs(w, 0.022 * scale)}px`,
            color: '#64748b',
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
  );
}

export function CoverSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div style={{ padding: `${padY}px ${padX}px ${fs(w, 0.04)}px`, color: '#0f172a' }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, color: theme.accent, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, marginBottom: fs(w, 0.05) }}>
          {slide.period.kind === 'week' ? 'Weekly digest' : 'Monthly digest'} · Mumbai
        </div>
        <div
          style={{
            fontSize: `${fs(w, 0.135)}px`,
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            color: '#0f172a',
          }}
        >
          {slide.totalCount}
        </div>
        <div style={{ fontSize: `${fs(w, 0.05)}px`, fontWeight: 800, color: theme.accent, marginTop: fs(w, 0.005), letterSpacing: '-0.02em' }}>
          {slide.totalCount === 1 ? 'event' : 'events'}
        </div>
        <div style={{ fontSize: `${fs(w, 0.04)}px`, color: '#0f172a', fontWeight: 600, marginTop: fs(w, 0.04), letterSpacing: '-0.01em' }}>
          {slide.period.label}
        </div>
        <div style={{ height: fs(w, 0.008), width: fs(w, 0.12), background: theme.accent, marginTop: fs(w, 0.04), borderRadius: 99 }} />
      </div>

      <div style={{ flex: 1, padding: `${fs(w, 0.02)}px ${padX}px ${fs(w, 0.04)}px` }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, color: '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: fs(w, 0.018) }}>
          Highlights
        </div>
        {(slide.preview || []).map((e) => <MinRow key={e.id} e={e} theme={theme} w={w} scale={0.95} />)}
      </div>

      <MinFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function EventsSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div style={{ padding: `${padY * 0.7}px ${padX}px ${fs(w, 0.025)}px` }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, color: theme.accent, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>
          {slide.period.short} · {slide.slot}
        </div>
        <div style={{ marginTop: fs(w, 0.014), fontSize: `${fs(w, 0.06)}px`, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
          What&apos;s on
        </div>
        <div style={{ height: fs(w, 0.006), width: fs(w, 0.1), background: theme.accent, marginTop: fs(w, 0.025), borderRadius: 99 }} />
      </div>
      <div style={{ flex: 1, padding: `${fs(w, 0.025)}px ${padX}px` }}>
        {slide.events.map((e) => <MinRow key={e.id} e={e} theme={theme} w={w} />)}
      </div>
      <MinFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function CtaSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div style={{ flex: 1, padding: `${padY}px ${padX}px`, color: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, color: theme.accent, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, marginBottom: fs(w, 0.04) }}>
          See all {slide.totalCount} events
        </div>
        <div style={{ fontSize: `${fs(w, 0.085)}px`, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          Scan it.
        </div>
        <div style={{ fontSize: `${fs(w, 0.085)}px`, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', color: theme.accent }}>
          Show up.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: fs(w, 0.04), marginTop: fs(w, 0.06) }}>
          {slide.qrSvg && (
            <div
              style={{ background: '#fff', padding: fs(w, 0.018), border: `1px solid #e2e8f0`, borderRadius: fs(w, 0.012) }}
              dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: `${fs(w, 0.022)}px`, color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Live list
            </div>
            <div style={{ marginTop: 6, fontSize: `${fs(w, 0.026)}px`, fontWeight: 700, color: '#0f172a', wordBreak: 'break-all' }}>
              {slide.deepLink}
            </div>
          </div>
        </div>
      </div>
      <MinFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function LongformSlide({ slide, theme, w, h, padX, padY }) {
  const list = slide.events;
  const HEADER_RATIO = 0.2;
  const FOOTER_RATIO = 0.16;
  const usable = h * (1 - HEADER_RATIO - FOOTER_RATIO);
  const baseRowH = fs(w, 0.06);
  let rowScale = 1;
  while (rowScale > 0.55 && list.length * baseRowH * rowScale > usable) rowScale -= 0.05;
  const fits = list.length * baseRowH * rowScale <= usable;
  const fittedCount = fits ? list.length : Math.floor(usable / (baseRowH * 0.55));
  const visible = list.slice(0, fittedCount);
  const remainder = list.length - visible.length;

  return (
    <>
      <div style={{ padding: `${padY}px ${padX}px ${fs(w, 0.02)}px`, color: '#0f172a' }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, color: theme.accent, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>
          {slide.period.kind === 'week' ? 'Weekly digest' : 'Monthly digest'} · Mumbai
        </div>
        <div style={{ marginTop: fs(w, 0.012), fontSize: `${fs(w, 0.07)}px`, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          {slide.period.label}
        </div>
        <div style={{ marginTop: fs(w, 0.012), fontSize: `${fs(w, 0.026)}px`, fontWeight: 600, color: '#475569' }}>
          {list.length} events · in-person
        </div>
        <div style={{ height: fs(w, 0.006), width: fs(w, 0.1), background: theme.accent, marginTop: fs(w, 0.02), borderRadius: 99 }} />
      </div>
      <div style={{ flex: 1, padding: `${fs(w, 0.02)}px ${padX}px`, display: 'flex', flexDirection: 'column' }}>
        {visible.map((e) => <MinRow key={e.id} e={e} theme={theme} w={w} scale={rowScale} />)}
        {remainder > 0 && (
          <div style={{ marginTop: fs(w, 0.02), fontSize: `${fs(w, 0.024)}px`, color: theme.accent, fontWeight: 700 }}>
            + {remainder} more — scan to see them all
          </div>
        )}
        {slide.qrSvg && (
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: fs(w, 0.025), paddingTop: fs(w, 0.025), borderTop: '1px solid #e2e8f0' }}>
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
      <MinFooter theme={theme} w={w} padX={padX} />
    </>
  );
}

export function EmptySlide({ theme, w, padX, padY }) {
  return (
    <>
      <div style={{ flex: 1, padding: `${padY}px ${padX}px`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', color: '#0f172a' }}>
        <div style={{ fontSize: `${fs(w, 0.022)}px`, color: theme.accent, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800, marginBottom: fs(w, 0.04) }}>
          0 events
        </div>
        <div style={{ fontSize: `${fs(w, 0.085)}px`, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
          Nothing here.
        </div>
        <div style={{ fontSize: `${fs(w, 0.03)}px`, fontWeight: 500, color: '#475569', marginTop: fs(w, 0.025) }}>
          Pick another period or clear the search.
        </div>
      </div>
      <MinFooter theme={theme} w={w} padX={padX} />
    </>
  );
}
