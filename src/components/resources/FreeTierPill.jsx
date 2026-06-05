import { FREE_TIERS } from '../../data/resources/taxonomy';

const toneStyles = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  violet:  'bg-violet-50 text-violet-700 border-violet-200',
  amber:   'bg-amber-50 text-amber-700 border-amber-200',
  slate:   'bg-slate-100 text-slate-600 border-slate-200',
};

export default function FreeTierPill({ tier, note }) {
  const meta = FREE_TIERS[tier];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${toneStyles[meta.tone] || toneStyles.slate}`}
      title={note || meta.label}
    >
      {meta.label}
    </span>
  );
}
