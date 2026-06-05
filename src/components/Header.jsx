import { Sparkles } from 'lucide-react';
import EmailCapture from './EmailCapture';
import { EVENT_COUNT } from '../utils/stats';

// Minimal hero — one badge, one H1, one description, one input.
// Stats live below in <Stats />, not here. Keeps the fold light.
export default function Header() {
  return (
    <header className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          {EVENT_COUNT}+ events · June 2026 · Mumbai
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
          Every tech event in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
            Mumbai
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
          Hackathons, conferences and meetups — link-verified, refreshed weekly.
        </p>

        <div className="mt-7 max-w-md mx-auto">
          <EmailCapture
            variant="compact"
            placeholder="Get event drops in your inbox"
            cta="Subscribe"
            source="header"
            successMessage="You're in! Check your inbox."
          />
        </div>
      </div>
    </header>
  );
}
