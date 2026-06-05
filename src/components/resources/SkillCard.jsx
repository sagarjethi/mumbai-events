import ThemeChips from './ThemeChips';
import VerifiedBadge from './VerifiedBadge';
import ExternalLink from '../ExternalLink';
import { PRIORITIES, SKILL_CATEGORIES } from '../../data/resources/taxonomy';
import { tools as allTools } from '../../data/resources';

const priorityToneStyles = {
  rose:   'bg-rose-50 text-rose-700',
  violet: 'bg-violet-50 text-violet-700',
  slate:  'bg-slate-100 text-slate-600',
};

const categoryAccent = {
  speed:        'border-l-amber-400',
  security:     'border-l-rose-400',
  'demo-craft': 'border-l-violet-400',
  'team-ops':   'border-l-emerald-400',
};

export default function SkillCard({ skill }) {
  const toolHints = (skill.toolHint || [])
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean);
  const priorityMeta = PRIORITIES[skill.priority];
  const priorityTone = priorityToneStyles[priorityMeta?.tone] || priorityToneStyles.slate;

  return (
    <article className={`bg-white rounded-xl border border-slate-200 border-l-4 ${categoryAccent[skill.category] || 'border-l-slate-300'} p-5 flex flex-col gap-3`}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {SKILL_CATEGORIES[skill.category]?.label}
          </p>
          <h3 className="font-bold text-slate-900 leading-snug mt-0.5">{skill.title}</h3>
        </div>
        {priorityMeta && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityTone}`}>
            {priorityMeta.label}
          </span>
        )}
      </header>

      <p className="text-sm text-slate-600">{skill.oneLiner}</p>

      <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
        {(skill.how || []).map((h, i) => <li key={i}>{h}</li>)}
      </ol>

      {skill.whyItWins && (
        <p className="text-sm text-slate-500 italic leading-relaxed">{skill.whyItWins}</p>
      )}

      {skill.snippet && (
        <pre className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-x-auto">
          <code>{skill.snippet}</code>
        </pre>
      )}

      {toolHints.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {toolHints.map((t) => (
            <ExternalLink
              key={t.id}
              href={t.url}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {t.name}
            </ExternalLink>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {skill.themes?.[0] !== '*' && <ThemeChips themes={skill.themes} />}
          {skill.sourceRef && (
            <ExternalLink
              href={skill.sourceRef}
              className="text-[10px] text-slate-400 hover:text-slate-600"
            >
              source ↗
            </ExternalLink>
          )}
        </div>
        <VerifiedBadge date={skill.verifiedOn} />
      </footer>
    </article>
  );
}
