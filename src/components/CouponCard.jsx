import { useState } from 'react';
import { Ticket, Copy, Check, ExternalLink, Mail } from 'lucide-react';
import { addUtm } from '../utils/utm';
import { toSlug } from '../utils/slug';

// Discount / promo codes for an event.
// Each coupon: { code, label, discount, price, note, url, email }
//   code     – the promo string to copy (omit for "email for code" offers)
//   label    – e.g. "Corporate Pass"
//   discount – e.g. "60% off"
//   price    – e.g. "$120 / ₹10,600"
//   note     – short instruction, e.g. "Use at registration checkout"
//   url      – registration link the code applies to (optional)
//   email    – when there is no code, an address to request one (optional)
export default function CouponCard({ event }) {
  const coupons = event?.coupons || [];
  const [copied, setCopied] = useState(null);
  if (coupons.length === 0) return null;

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    } catch {
      /* clipboard unavailable — code is still visible to copy manually */
    }
  };

  const slug = toSlug(event.name);

  return (
    <div id="discount-codes" className="scroll-mt-20 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <Ticket className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-bold text-slate-900">Discount codes</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Verified community promo codes. Apply the code at checkout on the official registration page.
      </p>

      <ul className="space-y-3">
        {coupons.map((c, i) => {
          const isCopied = copied === c.code;
          return (
            <li
              key={c.code || c.label || i}
              className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.label && (
                      <span className="text-sm font-semibold text-slate-900">{c.label}</span>
                    )}
                    {c.discount && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                        {c.discount}
                      </span>
                    )}
                  </div>
                  {c.price && (
                    <p className="mt-0.5 text-sm text-slate-600">{c.price}</p>
                  )}
                  {c.note && (
                    <p className="mt-0.5 text-xs text-slate-400">{c.note}</p>
                  )}
                </div>

                {c.code ? (
                  <button
                    type="button"
                    onClick={() => copy(c.code)}
                    aria-label={`Copy promo code ${c.code}`}
                    className="group inline-flex items-center gap-2 shrink-0 rounded-lg border border-dashed border-emerald-400 bg-white px-3 py-2 font-mono text-sm font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
                  >
                    <span>{c.code}</span>
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                    )}
                  </button>
                ) : c.email ? (
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email for code
                  </a>
                ) : null}
              </div>

              {isCopied && (
                <p className="mt-2 text-xs font-semibold text-emerald-600">Copied to clipboard ✓</p>
              )}

              {(c.url || event.link) && c.code && (
                <a
                  href={addUtm(c.url || event.link, 'coupon', slug)}
                  target="_blank"
                  rel="noopener noreferrer nofollow ugc"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                  Register & apply code
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
        Codes are shared by event organizers and community partners and can change or expire without
        notice. Always confirm the final price on the official checkout page before paying.
      </p>
    </div>
  );
}
