// Vercel serverless function — proxies email subscriptions to Beehiiv.
//
// Required environment variables (set in Vercel dashboard):
//   BEEHIIV_API_KEY        — your Beehiiv API key
//   BEEHIIV_PUBLICATION_ID — your publication ID (starts with "pub_")
//
// If env vars are not set, it logs the email and returns success
// (prevents UX from breaking during initial setup).

import { PostHog } from 'posthog-node';

async function capturePostHog(email, source, tag, ok) {
  const key = process.env.VITE_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_KEY;
  if (!key) return;
  const ph = new PostHog(key, {
    host: process.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  });
  ph.capture({
    distinctId: email,
    event: 'email_subscribed',
    properties: { source, tag, ok },
  });
  await ph.shutdown();
}

// Origins allowed to call this endpoint. Same-origin (empty Origin header)
// is always allowed — locks cross-site abuse while keeping the site working.
const ALLOWED_ORIGINS = new Set([
  'https://mumbai-events.sagarjethi.com',
  'https://www.mumbai-events.sagarjethi.com',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function originAllowed(origin) {
  if (!origin) return true; // same-origin (no Origin header) / server-to-server
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Allow Vercel preview deployments for this project
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

function setCors(res, origin) {
  if (origin && originAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // CORS preflight — only respond positively to allowed origins
  if (req.method === 'OPTIONS') {
    setCors(res, origin);
    return res.status(originAllowed(origin) ? 204 : 403).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!originAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  setCors(res, origin);

  const body = req.body || {};
  const email = typeof body.email === 'string' ? body.email : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'unknown';
  const tag = typeof body.tag === 'string' ? body.tag.slice(0, 64) : undefined;

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  // Graceful fallback if Beehiiv not configured yet. Don't leak the "dev"
  // flag in the response — clients only need to know it succeeded.
  if (!apiKey || !pubId) {
    console.log('[subscribe] Beehiiv not configured; captured source=%s', source);
    await capturePostHog(email, source, tag, true);
    return res.status(200).json({ ok: true });
  }

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source,
          utm_medium: 'website',
          utm_campaign: 'mumbai-events-2026',
          ...(tag ? { custom_fields: [{ name: 'interest', value: tag }] } : {}),
        }),
      }
    );

    const data = await beehiivRes.json();

    if (!beehiivRes.ok) {
      console.error('[subscribe] Beehiiv error status=%s', beehiivRes.status);
      return res.status(502).json({
        error: data.errors?.[0]?.message || 'Failed to subscribe',
      });
    }

    await capturePostHog(email, source, tag, true);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
}
