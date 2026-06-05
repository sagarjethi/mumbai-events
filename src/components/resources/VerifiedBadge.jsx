import { ShieldCheck } from 'lucide-react';

// Approximate "now" captured at module load. Per-session staleness check is fine;
// we don't need wall-clock precision on a verification stamp.
const MODULE_LOAD_TIME = new Date().getTime();

export default function VerifiedBadge({ date }) {
  if (!date) return null;
  const ageDays = Math.floor((MODULE_LOAD_TIME - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  const stale = ageDays > 90;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium ${stale ? 'text-amber-600' : 'text-slate-400'}`}
      title={stale ? `Last verified ${ageDays} days ago — may be stale` : `Last verified ${date}`}
    >
      <ShieldCheck className="w-3 h-3" />
      {date}
    </span>
  );
}
