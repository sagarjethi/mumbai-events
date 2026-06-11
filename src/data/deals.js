// Standalone partner deals / "friendly" coupon codes that aren't tied to a
// single event in the calendar (e.g. a community pass that covers the whole
// Open Source Week, a sponsor-issued vanity link, a platform credit).
//
// Event-specific coupons live on the event itself (events[].coupons) and the
// Deals page (/deals) merges both sources automatically — so add an entry here
// only when a code/URL stands on its own.
//
// Each deal:
//   id       – stable kebab-case id
//   title    – what the deal is, e.g. "KubeCon India — community pass"
//   partner  – who issued it, e.g. "Kubesimplify"
//   scope    – what it applies to, e.g. "Open Source Week Mumbai"
//   code     – promo string to copy (omit if it's a URL-only deal)
//   url      – registration / redemption link (a "friendly URL" is fine here)
//   discount – e.g. "60% off"
//   price    – e.g. "$120 / ₹10,600"
//   note     – short instruction, e.g. "Use at registration checkout"
//   eventSlug – optional: link to the related event detail page on this site
export const deals = [
  // Add separately-issued friendly coupon codes / URLs here. Example:
  // {
  //   id: 'kubecon-overall-community',
  //   title: 'KubeCon + CloudNativeCon India — community pass',
  //   partner: 'Community partner',
  //   scope: 'Open Source Week Mumbai',
  //   code: 'XXXXXXXX',
  //   url: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-india/register/',
  //   discount: '...',
  //   price: '...',
  //   note: 'Use at registration checkout',
  //   eventSlug: 'kubecon-cloudnativecon-india-2026',
  // },
];
