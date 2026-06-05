import { Mail } from 'lucide-react';

// Direct mailto chip. Previously this was a gated reveal that asked users to
// subscribe to "unlock" a contact, but the contact emails are already public
// on each accelerator's own site — gating publicly available info as a reward
// can be classified as a deceptive pattern by Google Search. We now show the
// email directly and let users mailto. The newsletter subscribe lives on its
// own block elsewhere in the page, no exchange required.
export default function RevealEmailButton({ accelerator }) {
  if (!accelerator?.publicEmail) return null;
  return (
    <a
      href={`mailto:${accelerator.publicEmail}`}
      className="inline-flex items-center gap-1 text-slate-600 hover:text-primary-700 font-medium"
      title={`Public contact: ${accelerator.publicEmail}`}
    >
      <Mail className="w-3 h-3" />
      Email
    </a>
  );
}
