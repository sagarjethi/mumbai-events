import { addUtm } from '../utils/utm';

// Default-on UTM tagging. Pass `noUtm` to opt out (rare — e.g. for explicit
// share links that need a clean URL).
export default function ExternalLink({ href, children, className = '', campaign, content, noUtm = false, ...rest }) {
  const finalHref = noUtm ? href : addUtm(href, campaign || 'external-link', content);
  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={className}
      {...rest}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
