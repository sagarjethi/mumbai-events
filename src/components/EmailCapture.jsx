import { useState } from 'react';
import { Mail, Check, Loader2, ArrowRight } from 'lucide-react';

/**
 * Reusable email capture form.
 *
 * Props:
 *  - variant: 'inline' | 'compact' | 'stacked'
 *  - label: headline text (optional)
 *  - placeholder: input placeholder
 *  - cta: button text
 *  - source: tag sent with submission (e.g. 'header', 'footer', 'event:openai-codex')
 *  - successMessage: text shown after submission
 *  - tag: optional tag to attach to subscriber (used server-side)
 */
export default function EmailCapture({
  variant = 'inline',
  label,
  placeholder = 'you@example.com',
  cta = 'Subscribe',
  source = 'unknown',
  successMessage = "You're in! Check your inbox.",
  tag,
  compact = false,
  onSuccess,
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, tag }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Subscription failed');
      }

      // Track conversion in Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'email_signup', {
          event_category: 'conversion',
          event_label: source,
        });
      }

      setStatus('success');
      const submittedEmail = email;
      setEmail('');
      if (typeof onSuccess === 'function') {
        try { onSuccess(submittedEmail); } catch { /* ignore consumer errors */ }
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`inline-flex items-center gap-2 ${variant === 'stacked' ? 'justify-center' : ''} px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700`}>
        <Check className="w-4 h-4" />
        {successMessage}
      </div>
    );
  }

  // Compact inline variant (single row)
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading'}
            className="flex-1 min-w-0 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : cta}
          </button>
        </div>
        {status === 'error' && (
          <p className="mt-1.5 text-xs text-rose-600">{errorMsg}</p>
        )}
      </form>
    );
  }

  // Stacked variant — input on top, button below (always vertical at narrow
  // widths to avoid cramping; row-form for compact spaces should use 'compact').
  if (variant === 'stacked') {
    return (
      <div className="w-full">
        {label && (
          <div className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Mail className="w-4 h-4 text-primary-500" />
            {label}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading'}
            aria-invalid={status === 'error'}
            aria-label="Email address"
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
          >
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
        {status === 'error' && (
          <p className="mt-2 text-xs text-rose-600">{errorMsg}</p>
        )}
      </div>
    );
  }

  // Default inline variant with label
  return (
    <div className={`w-full ${compact ? '' : 'max-w-lg'}`}>
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading'}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              {cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-1.5 text-xs text-rose-600">{errorMsg}</p>
      )}
    </div>
  );
}
