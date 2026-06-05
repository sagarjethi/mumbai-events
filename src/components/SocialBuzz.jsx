import { Link } from 'react-router-dom';
import { ExternalLink, MessageCircle, ArrowRight } from 'lucide-react';
import { socialBuzz } from '../data/events';
import { addUtm } from '../utils/utm';

function TwitterIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function PlatformIcon({ platform }) {
  if (platform === 'linkedin') {
    return <LinkedInIcon />;
  }
  return <TwitterIcon />;
}

export default function SocialBuzz() {
  return (
    <section id="social" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Social Buzz Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <MessageCircle className="w-4 h-4" />
          Social Buzz
        </div>
        <h2 className="text-3xl font-bold text-slate-900">What People Are Saying</h2>
        <p className="mt-2 text-slate-500">Follow the conversation around Mumbai's biggest event week</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialBuzz.map((post, i) => (
          <a
            key={i}
            href={addUtm(post.link, 'social-buzz', post.platform || post.handle)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group block bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md p-5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                post.platform === 'linkedin'
                  ? 'bg-gradient-to-br from-[#0A66C2] to-[#004182]'
                  : 'bg-gradient-to-br from-primary-400 to-accent-400'
              }`}>
                {post.avatar}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 text-sm truncate">{post.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <PlatformIcon platform={post.platform} />
                  {post.handle}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
              {post.text}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-primary-500 group-hover:text-primary-600 font-medium">
              View post <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/social"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm"
        >
          View All Social Buzz & Connect with Attendees
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
