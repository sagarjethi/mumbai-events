// CardSlide — thin dispatcher. Renders a slide at output pixel dimensions
// (1080x1080 etc.) inside a styled wrapper; the parent CSS-scales the
// wrapper for preview while html-to-image captures the inner DOM 1:1.
//
// The actual visual treatment is delegated to one of the design-style
// modules under ./styles/ — pick which one via the `styleKey` prop.

import { forwardRef } from 'react';
import { FONT_STACK, fs } from './slideUtils';

import * as editorial from './styles/editorial';
import * as minimal from './styles/minimal';
import * as bento from './styles/bento';

const STYLE_IMPLS = { editorial, minimal, bento };

const CardSlide = forwardRef(function CardSlide({ slide, theme, size, styleKey = 'editorial' }, ref) {
  const w = size.width;
  const h = size.height;
  const Impl = STYLE_IMPLS[styleKey] || STYLE_IMPLS.editorial;

  // Header padding/typography scales with width so the design works at
  // every aspect ratio.
  const padX = fs(w, 0.075);
  const padY = fs(w, 0.075);

  const baseStyle = {
    width: `${w}px`,
    height: `${h}px`,
    fontFamily: FONT_STACK,
    background: '#ffffff',
    color: '#0f172a',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  };

  const childProps = { slide, theme, w, h, padX, padY };

  return (
    <div ref={ref} style={baseStyle} data-card-slide={slide.kind} data-card-style={styleKey}>
      {slide.kind === 'cover' && <Impl.CoverSlide {...childProps} />}
      {slide.kind === 'events' && <Impl.EventsSlide {...childProps} />}
      {slide.kind === 'cta' && <Impl.CtaSlide {...childProps} />}
      {slide.kind === 'longform' && <Impl.LongformSlide {...childProps} />}
      {slide.kind === 'empty' && <Impl.EmptySlide {...childProps} />}
    </div>
  );
});

export default CardSlide;
