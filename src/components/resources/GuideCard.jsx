import { Book, Video, FileText } from 'lucide-react';
import ExternalLink from '../ExternalLink';
import ThemeChips from './ThemeChips';
import VerifiedBadge from './VerifiedBadge';

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.8-.26.8-.57 0-.28-.01-1.02-.02-2-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.72-1.54-2.54-.3-5.22-1.27-5.22-5.66 0-1.25.45-2.27 1.17-3.07-.12-.3-.51-1.47.11-3.05 0 0 .96-.3 3.15 1.17a10.9 10.9 0 0 1 5.74 0C17.87 5.15 18.83 5.45 18.83 5.45c.63 1.58.24 2.75.12 3.05.73.8 1.17 1.82 1.17 3.07 0 4.4-2.69 5.35-5.25 5.64.41.36.77 1.07.77 2.16 0 1.56-.02 2.82-.02 3.2 0 .31.21.68.81.57A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const ICONS = { article: FileText, video: Video, repo: GithubIcon, docs: Book };

export default function GuideCard({ guide }) {
  const Icon = ICONS[guide.format] || FileText;
  return (
    <ExternalLink
      href={guide.url}
      className="block bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all p-4"
    >
      <header className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Icon className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wider font-semibold">{guide.format}</span>
        {guide.estMinutes && <span>· {guide.estMinutes} min</span>}
      </header>
      <h3 className="font-bold text-slate-900 leading-snug mb-1">{guide.title}</h3>
      <p className="text-xs text-slate-500 mb-2">by {guide.author}</p>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{guide.blurb}</p>
      <div className="flex items-center justify-between gap-2">
        <ThemeChips themes={guide.themes} />
        <VerifiedBadge date={guide.verifiedOn} />
      </div>
    </ExternalLink>
  );
}
