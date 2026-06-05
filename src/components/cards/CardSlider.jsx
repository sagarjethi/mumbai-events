// Live carousel preview around an array of slide descriptors.
// Renders each <CardSlide> at full output dimensions inside a scaled wrapper
// so the preview is visually accurate while the underlying DOM is still
// 1080x1080 (etc.) — html-to-image captures that DOM unscaled.

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CardSlide from './CardSlide';

// Max width on screen for any preview slide
const PREVIEW_MAX_WIDTH = 360;

export default function CardSlider({ slides, theme, size, slideRefs, styleKey }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);

  // Clamp active index inline rather than via an effect — eliminates the
  // cascading-render warning and is correct on the very first render too.
  const clampedActive = active >= slides.length ? 0 : active;

  const scale = PREVIEW_MAX_WIDTH / size.width;
  const previewW = size.width * scale;
  const previewH = size.height * scale;

  const goto = (i) => {
    const next = Math.max(0, Math.min(slides.length - 1, i));
    setActive(next);
    const el = scrollerRef.current?.querySelector(`[data-slide-index="${next}"]`);
    if (el && scrollerRef.current) {
      const offset = el.offsetLeft - scrollerRef.current.clientWidth / 2 + el.clientWidth / 2;
      scrollerRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 py-4"
      >
        <div
          ref={trackRef}
          className="flex items-start gap-5"
          style={{ minWidth: 'max-content' }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              data-slide-index={i}
              className={[
                'shrink-0 rounded-2xl overflow-hidden border transition-shadow',
                i === clampedActive ? 'border-slate-900 shadow-xl ring-2 ring-slate-900/10' : 'border-slate-200 shadow-sm',
              ].join(' ')}
              style={{ width: previewW, height: previewH, background: '#fff' }}
              onClick={() => goto(i)}
              role="button"
              aria-label={`Show slide ${i + 1} of ${slides.length}`}
              tabIndex={0}
            >
              <div
                style={{
                  width: size.width,
                  height: size.height,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <CardSlide
                  ref={(el) => {
                    if (slideRefs) slideRefs.current[i] = el;
                  }}
                  slide={slide}
                  theme={theme}
                  size={size}
                  styleKey={styleKey}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goto(clampedActive - 1)}
          disabled={clampedActive <= 0}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === clampedActive}
              onClick={() => goto(i)}
              className={[
                'h-2 rounded-full transition-all',
                i === clampedActive ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400',
              ].join(' ')}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goto(clampedActive + 1)}
          disabled={clampedActive >= slides.length - 1}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Active-slide indicator */}
      <div className="mt-2 text-center text-xs text-slate-500">
        Slide <span className="font-semibold text-slate-900 tabular-nums">{clampedActive + 1}</span> of {slides.length}
      </div>
    </div>
  );
}
