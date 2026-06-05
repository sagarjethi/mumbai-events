// Slim site-wide subscribe bar — sits directly under the main nav so the
// email capture is visible on every page within the first 80px of viewport.
// Dismissable + persistent: once a user dismisses or subscribes, the bar
// stays hidden for 90 days on this browser.
//
// Why a separate bar (not the existing footer / page-level captures):
//   - Most visits scroll only the first viewport; bottom-of-page CTAs miss them.
//   - The hero email field is duplicated across pages — keeps inconsistent
//     and competes with primary content.
//   - A single dedicated row is non-disruptive, accessible, and easy to A/B.

import { useEffect, useState } from 'react';
import { Mail, Check, X, Loader2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'subscribe-bar-state';
// Keep dismissed/subscribed users hidden for 90 days
const HIDE_DAYS = 90;
const HIDE_MS = HIDE_DAYS * 24 * 60 * 60 * 1000;

function readState() {
  if (typeof window === 'undefined') return { hidden: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { hidden: false };
    const { at, kind } = JSON.parse(raw);
    if (Date.now() - at < HIDE_MS) return { hidden: true, kind };
    return { hidden: false };
  } catch { return { hidden: false }; }
}
function writeState(kind) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), kind })); } catch { /* ignore */ }
}

export default function SubscribeBar() {
  // Optimistic: show immediately on SSR / first paint, hide after we read
  // localStorage. Keeps prerendered HTML showing the bar to crawlers.
  const [hidden, setHidden] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const s = readState();
    if (s.hidden) setHidden(true);
    setHydrated(true);
  }, []);

  if (hidden) return null;

  const handleDismiss = () => {
    setHidden(true);
    writeState('dismissed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMsg('Enter a valid email');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'subscribe-bar' }),
      });
      if (!res.ok) throw new Error('Subscribe failed');
      setStatus('success');
      writeState('subscribed');
      // Auto-hide after 4s success message
      setTimeout(() => setHidden(true), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Something went wrong. Try again?');
    }
  };

  // Hide via opacity until hydration check completes — avoids a flash of the
  // bar on SSR for users who already dismissed (without making it invisible
  // to crawlers, who don't run useEffect).
  return (
    <div
      role="region"
      aria-label="Subscribe to weekly digest"
      className={[
        'sticky top-14 z-40 w-full border-b border-primary-100 bg-gradient-to-r from-primary-50 via-white to-violet-50',
        'transition-opacity duration-200',
        hydrated ? 'opacity-100' : 'opacity-100',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-3">
          {/* Pitch — collapses on mobile */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-700 shrink-0">
            <Mail className="w-4 h-4 text-primary-600" />
            <span className="font-semibold">Weekly Mumbai tech digest</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">one email · unsubscribe anytime</span>
          </div>

          {/* Form — fills remaining space */}
          {status === 'success' ? (
            <div className="flex-1 inline-flex items-center justify-center sm:justify-end gap-2 text-sm font-semibold text-emerald-700">
              <Check className="w-4 h-4" />
              Subscribed — watch your inbox.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center gap-2 min-w-0"
              aria-label="Subscribe form"
            >
              <span className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
                <Mail className="w-3.5 h-3.5 text-primary-600" />
                Weekly digest
              </span>
              <label className="sr-only" htmlFor="subscribe-bar-email">Email address</label>
              <input
                id="subscribe-bar-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                placeholder="you@example.com"
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'subscribe-bar-error' : undefined}
                className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-3 sm:px-4 py-1.5 transition disabled:opacity-60"
              >
                {status === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>
                  <span className="hidden sm:inline">Subscribe</span>
                  <span className="sm:hidden">Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss subscribe bar"
            className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status === 'error' && (
          <p id="subscribe-bar-error" role="alert" className="mt-1 text-xs text-rose-600">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
