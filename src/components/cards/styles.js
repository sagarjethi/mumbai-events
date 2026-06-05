// Design-style registry. Each style is a different visual treatment for
// the same underlying slide model. Picked from 2026 social-card design
// research: bold minimalism (Minimal), modular bento (Bento), and the
// existing magazine/editorial spread (Editorial).
//
// Adding a new style = add an entry here + a corresponding switch arm
// inside the CardSlide module. Keep this file metadata-only.

export const STYLES = {
  editorial: {
    id: 'editorial',
    label: 'Editorial',
    blurb: 'Gradient header + clean list — magazine spread feel.',
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    blurb: 'Bold minimalism — huge type, big negative space, single accent.',
  },
  bento: {
    id: 'bento',
    label: 'Bento',
    blurb: 'Modular grid — every event in its own tile.',
  },
};

export const STYLE_KEYS = Object.keys(STYLES);
