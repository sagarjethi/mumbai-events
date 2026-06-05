// X (Twitter) post card — visually mirrors a single tweet on x.com.
// Used by SocialPage. Receives a `post` object from `src/data/social.js`.
//
// Shape:
//   { name, handle, avatar, text, link, date?, verified?, replies?, reposts?, likes?, views? }

import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Upload } from 'lucide-react';

function XLogo({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedTick({ className = 'w-4 h-4 text-sky-500' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  );
}

function fmtCompact(n) {
  if (n == null) return '';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export default function TweetCard({ post }) {
  const {
    name,
    handle,
    avatar,
    text,
    link,
    date,
    verified,
    replies,
    reposts,
    likes,
    views,
  } = post;

  // Render @handle without the leading '@' so we can prefix it ourselves.
  const cleanHandle = (handle || '').replace(/^@/, '');

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:bg-slate-50/70 hover:border-slate-300 transition-colors p-4 h-full"
    >
      {/* Header row — avatar + name/handle + X glyph */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-sm leading-tight">
            <span className="font-bold text-slate-900 truncate max-w-[140px] hover:underline">
              {name}
            </span>
            {verified && <VerifiedTick className="w-4 h-4 text-sky-500 shrink-0" />}
          </div>
          <div className="text-sm text-slate-500 leading-tight truncate">
            @{cleanHandle}
            {date && (
              <>
                <span className="mx-1">·</span>
                <span>{date}</span>
              </>
            )}
          </div>
        </div>
        <XLogo className="w-5 h-5 text-slate-700 shrink-0" />
      </div>

      {/* Body text */}
      <p className="text-[15px] text-slate-900 leading-snug whitespace-pre-line mt-3 line-clamp-6 break-words">
        {text}
      </p>

      {/* Action row — mirrors x.com tweet footer */}
      <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
        <span className="inline-flex items-center gap-1.5 group-hover:text-sky-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          {fmtCompact(replies)}
        </span>
        <span className="inline-flex items-center gap-1.5 group-hover:text-emerald-500 transition-colors">
          <Repeat2 className="w-4 h-4" />
          {fmtCompact(reposts)}
        </span>
        <span className="inline-flex items-center gap-1.5 group-hover:text-rose-500 transition-colors">
          <Heart className="w-4 h-4" />
          {fmtCompact(likes)}
        </span>
        <span className="inline-flex items-center gap-1.5 group-hover:text-sky-500 transition-colors">
          <BarChart2 className="w-4 h-4" />
          {fmtCompact(views)}
        </span>
        <span className="inline-flex items-center gap-2 text-slate-400">
          <Bookmark className="w-4 h-4" />
          <Upload className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
}
