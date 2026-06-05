// Centralized social-share URL builders. Mirrors the logic in EventDetail.jsx
// so any new feature (CardsPage, future hubs, etc.) gets the same intents.
//
// Each helper takes an explicit URL + text and returns a fully encoded
// outbound link. We deliberately do NOT call window.open here — call sites
// should render an <a> with target="_blank" rel="noopener noreferrer" so
// browsers treat it as a user-initiated nav.

export function twitterIntent({ text, url }) {
  const tail = url ? ` ${url}` : '';
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text + tail)}`;
}

export function whatsappIntent({ text, url }) {
  const tail = url ? ` ${url}` : '';
  return `https://wa.me/?text=${encodeURIComponent(text + tail)}`;
}

export function linkedinIntent({ url }) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export async function copyLink(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
