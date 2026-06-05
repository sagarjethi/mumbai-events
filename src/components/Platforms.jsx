import { ExternalLink, Globe } from 'lucide-react';
import { platforms } from '../data/events';
import { addUtm } from '../utils/utm';

export default function Platforms() {
  return (
    <section id="platforms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Globe className="w-4 h-4" />
          Stay Updated
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Event Platforms</h2>
        <p className="mt-2 text-slate-500">Discover more events on these platforms</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={addUtm(p.url, 'platforms-bar', p.name.toLowerCase())}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary-600 transition-all"
          >
            {p.name}
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </section>
  );
}
