// Append UTM tracking params to outbound links so partner sites can see
// traffic coming from this directory in their analytics.
//
// Convention:
//   utm_source   = mumbai-events.sagarjethi.com  (host)
//   utm_medium   = referral
//   utm_campaign = <context>           e.g. event-card, event-detail, social-buzz
//   utm_content  = <slug or label>     optional, narrows attribution further
//
// Behaviour:
//   - Internal URLs (relative or our own host) are returned untouched
//   - Existing query params (and #fragments) preserved
//   - If the URL already has utm_source, we DO NOT overwrite — caller may have
//     a paid campaign tag we shouldn't clobber
//   - Anchor / mailto / tel / javascript: schemes are returned untouched
//   - utm_content is auto-slugified so values like "AllEvents.in" or
//     "@handle" produce clean attribution keys

const SELF_HOSTS = new Set([
  'mumbai-events.sagarjethi.com',
  'sagarjethi.com',
  'www.sagarjethi.com',
]);

const SOURCE = 'mumbai-events.sagarjethi.com';

// Slugify a UTM value so it's analytics-safe: lowercase a-z, 0-9, dashes only.
function slugifyUtm(value) {
  if (value == null) return '';
  return String(value)
    .toLowerCase()
    .replace(/[''‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function addUtm(url, campaign, content) {
  if (!url || typeof url !== 'string') return url;
  // Skip relative paths, hash anchors, mailto/tel/js
  if (/^(mailto:|tel:|javascript:|#|\/|\.)/i.test(url)) return url;

  let u;
  try {
    u = new URL(url);
  } catch {
    return url; // Non-parseable — pass through untouched
  }
  if (!/^https?:$/.test(u.protocol)) return url;
  if (SELF_HOSTS.has(u.host)) return url;
  if (u.searchParams.has('utm_source')) return url;

  u.searchParams.set('utm_source', SOURCE);
  u.searchParams.set('utm_medium', 'referral');
  const c = slugifyUtm(campaign);
  const ct = slugifyUtm(content);
  if (c) u.searchParams.set('utm_campaign', c);
  if (ct) u.searchParams.set('utm_content', ct);
  return u.toString(); // Preserves #fragment, port, encoded chars
}

// Convenience: build a campaign string from a route + element name
export function utm(url, ctx) {
  if (!ctx) return addUtm(url);
  const campaign = ctx.campaign || ctx;
  const content = ctx.content;
  return addUtm(url, campaign, content);
}
