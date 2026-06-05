import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Heart, ExternalLink } from 'lucide-react';
import EmailCapture from './EmailCapture';

const TWEET_URL = 'https://x.com/sagarbjethi/status/2043607049679057396';
const STORAGE_KEY = 'tweet-support-dismissed-at';
// Compliant interstitial timing: don't show before user has spent meaningful
// time on the page, and never re-show within 7 days of a dismissal.
const SHOW_AFTER_MS = 45_000;          // 45s on page before the prompt appears
const COOLDOWN_DAYS = 7;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

function XIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function recentlyDismissed() {
  if (typeof window === 'undefined') return true;
  try {
    const at = Number(window.localStorage.getItem(STORAGE_KEY) || 0);
    return at > 0 && Date.now() - at < COOLDOWN_MS;
  } catch {
    return true; // fail closed — don't show if storage is unavailable
  }
}

export default function TweetSupportModal() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Never on the homepage (the user just landed); never on inner pages
    // until they've actually spent time reading.
    if (location.pathname === '/') return;
    if (recentlyDismissed()) return;

    const timer = setTimeout(() => setShow(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleDismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Best-effort persistence; safe to ignore failures.
    }
  };

  const handleLike = () => {
    // noopener/noreferrer on programmatic open; nofollow doesn't apply outside <a>.
    window.open(TWEET_URL, '_blank', 'noopener,noreferrer');
    handleDismiss();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-violet-500" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center">
              <XIcon className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
            Finding this helpful?
          </h3>
          <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
            A simple like on the tweet helps more people discover this directory and find events they'd love to attend. It takes 2 seconds and means the world.
          </p>

          {/* CTA */}
          <button
            onClick={handleLike}
            className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Like the tweet on X
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email alternative */}
          <div>
            <p className="text-xs text-slate-500 text-center mb-2">Prefer email? Get event drops in your inbox:</p>
            <EmailCapture
              variant="compact"
              placeholder="you@example.com"
              cta="Subscribe"
              source="tweet-modal"
              successMessage="Subscribed! Thanks 🙏"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
