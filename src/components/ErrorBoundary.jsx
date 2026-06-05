import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// Top-level error boundary so a runtime crash anywhere in the tree shows a
// useful recovery screen instead of a blank page. Especially important for
// lazy-loaded route chunks — a failed import or render should not leave the
// user staring at white.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined' && window.console) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="inline-flex w-12 h-12 rounded-full bg-amber-50 text-amber-600 items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">
            A page chunk failed to load or a render error occurred. This is usually a stale browser cache —
            a hard refresh fixes it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                // Force-bypass cache and reload
                if (typeof window !== 'undefined') window.location.reload();
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload page
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2"
            >
              <Home className="w-3.5 h-3.5" />
              Back home
            </Link>
          </div>
          {error?.message && (
            <details className="mt-6 text-left">
              <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Technical details</summary>
              <pre className="mt-2 text-[11px] text-slate-500 bg-slate-50 rounded p-2 overflow-x-auto max-h-32">{String(error.message)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
