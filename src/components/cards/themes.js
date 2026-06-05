// Six theme presets for shareable cards. Each entry is a complete style pack
// — header gradient stops, body accent, dot color, and the text color that
// reads on the gradient. Picked to feel distinct on a feed without requiring
// any custom Tailwind config (every color is in the existing palette).

export const THEMES = {
  slate: {
    label: 'Slate',
    headerFrom: '#0f172a',
    headerTo: '#334155',
    accent: '#0f172a',
    accentSoft: '#e2e8f0',
    onHeader: '#ffffff',
    dotClass: 'bg-slate-900',
  },
  primary: {
    label: 'Indigo',
    headerFrom: '#1e3a8a',
    headerTo: '#5a78f2',
    accent: '#3b54e3',
    accentSoft: '#e0e7ff',
    onHeader: '#ffffff',
    dotClass: 'bg-indigo-600',
  },
  violet: {
    label: 'Violet',
    headerFrom: '#5b21b6',
    headerTo: '#9333ea',
    accent: '#7c3aed',
    accentSoft: '#ede9fe',
    onHeader: '#ffffff',
    dotClass: 'bg-violet-600',
  },
  emerald: {
    label: 'Emerald',
    headerFrom: '#065f46',
    headerTo: '#10b981',
    accent: '#059669',
    accentSoft: '#d1fae5',
    onHeader: '#ffffff',
    dotClass: 'bg-emerald-600',
  },
  amber: {
    label: 'Amber',
    headerFrom: '#b45309',
    headerTo: '#f59e0b',
    accent: '#d97706',
    accentSoft: '#fef3c7',
    onHeader: '#ffffff',
    dotClass: 'bg-amber-600',
  },
  rose: {
    label: 'Rose',
    headerFrom: '#9f1239',
    headerTo: '#f43f5e',
    accent: '#e11d48',
    accentSoft: '#ffe4e6',
    onHeader: '#ffffff',
    dotClass: 'bg-rose-600',
  },
};

export const THEME_KEYS = Object.keys(THEMES);

export function getTheme(key) {
  return THEMES[key] || THEMES.slate;
}
