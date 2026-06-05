import { Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Slim, single-row footer. Curator pill is the primary action; everything else
// is meta. The verbose "Subscribe / Follow" stack moved out — header has the
// email box, nav has navigation, no need to repeat them at page-bottom.
export default function Footer() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Site links — About + Editorial earn E-E-A-T trust */}
          <p className="text-xs text-slate-500">
            <Link to="/about" className="text-slate-700 hover:text-primary-600 font-medium">About</Link>
            <span className="mx-1.5 text-slate-300">·</span>
            <Link to="/editorial" className="text-slate-700 hover:text-primary-600 font-medium">Editorial standards</Link>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="mailto:hello@codeminto.com?subject=Mumbai%20Tech%20Events" className="text-slate-700 hover:text-primary-600 font-medium">
              Contact
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://github.com/sagarjethi/mumbai-events-2026/commits/main" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800">
              Changelog
            </a>
          </p>

          <p className="text-xs text-slate-400">
            Curated by{' '}
            <a href="https://sagarjethi.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
              @sagarjethi
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://topmate.io/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">
              Book 1:1
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://x.com/sagarbjethi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800">
              <XIcon className="w-3 h-3" /> X
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://www.linkedin.com/in/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800">
              LinkedIn
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href="https://github.com/sagarjethi/mumbai-events-2026" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800">
              GitHub
            </a>
          </p>

          <p className="text-[11px] text-slate-400 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Independent · No paid placements · Link-checked weekly · Last reviewed <time dateTime={today}>{today}</time>
          </p>

          <p className="text-[11px] text-slate-400 inline-flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-400" /> for the Mumbai tech community · Always verify dates on the official event page.
          </p>
        </div>
      </div>
    </footer>
  );
}
