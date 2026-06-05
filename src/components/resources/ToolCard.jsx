import { ExternalLink as LinkIcon, Book } from 'lucide-react';
import ExternalLink from '../ExternalLink';
import ThemeChips from './ThemeChips';
import FreeTierPill from './FreeTierPill';
import VerifiedBadge from './VerifiedBadge';
import { TOOL_CATEGORIES } from '../../data/resources/taxonomy';

export default function ToolCard({ tool }) {
  return (
    <article className="bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all p-4 flex flex-col gap-3">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 leading-tight truncate">{tool.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {tool.vendor} · {TOOL_CATEGORIES[tool.category]?.label}
          </p>
        </div>
        <FreeTierPill tier={tool.freeTier} note={tool.freeTierNote} />
      </header>

      <p className="text-sm text-slate-600 leading-relaxed">{tool.blurb}</p>

      {tool.freeTierNote && (
        <p className="text-[11px] text-slate-400 -mt-1 line-clamp-2">{tool.freeTierNote}</p>
      )}

      <ThemeChips themes={tool.themes} />

      <footer className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-3 text-xs">
          <ExternalLink
            href={tool.url}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            <LinkIcon className="w-3 h-3" /> Visit
          </ExternalLink>
          {tool.docsUrl && (
            <ExternalLink
              href={tool.docsUrl}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
            >
              <Book className="w-3 h-3" /> Docs
            </ExternalLink>
          )}
        </div>
        <VerifiedBadge date={tool.verifiedOn} />
      </footer>
    </article>
  );
}
