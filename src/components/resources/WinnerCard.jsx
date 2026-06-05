import { Trophy, ExternalLink as LinkIcon, Play } from 'lucide-react';
import ExternalLink from '../ExternalLink';
import ThemeChips from './ThemeChips';
import VerifiedBadge from './VerifiedBadge';
import { byIds, tools as allTools } from '../../data/resources';

export default function WinnerCard({ winner }) {
  const stackTools = byIds(allTools, winner.stack || []);
  return (
    <article className="bg-white rounded-xl border border-slate-200 p-5">
      <header className="flex items-start gap-2 mb-2">
        <Trophy className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-slate-900 leading-snug">{winner.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{winner.hackathon}</p>
        </div>
      </header>

      {winner.builderNote && (
        <p className="text-sm text-slate-600 leading-relaxed mb-3">{winner.builderNote}</p>
      )}

      {stackTools.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {stackTools.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700"
            >
              {t.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <ExternalLink
            href={winner.url}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            <LinkIcon className="w-3 h-3" /> Code
          </ExternalLink>
          {winner.demoUrl && (
            <ExternalLink
              href={winner.demoUrl}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800"
            >
              <Play className="w-3 h-3" /> Demo
            </ExternalLink>
          )}
        </div>
        <VerifiedBadge date={winner.verifiedOn} />
      </div>

      <div className="mt-2">
        <ThemeChips themes={winner.themes} />
      </div>
    </article>
  );
}
