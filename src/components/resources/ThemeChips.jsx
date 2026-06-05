import { THEMES } from '../../data/resources/taxonomy';

export default function ThemeChips({ themes = [], active = [], onToggle, size = 'sm' }) {
  const clickable = typeof onToggle === 'function';
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  return (
    <div className="flex flex-wrap gap-1.5">
      {themes.map((t) => {
        if (t === '*') return null;
        const meta = THEMES[t];
        if (!meta) return null;
        const isActive = active.includes(t);
        const base = `inline-flex items-center gap-1 rounded-full font-semibold transition-colors ${padding}`;
        if (!clickable) {
          return <span key={t} className={`${base} ${meta.color}`}>{meta.label}</span>;
        }
        return (
          <button
            key={t}
            type="button"
            onClick={() => onToggle(t)}
            aria-pressed={isActive}
            className={`${base} ${isActive ? 'ring-2 ring-primary-400 ring-offset-1' : 'opacity-80 hover:opacity-100'} ${meta.color}`}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
