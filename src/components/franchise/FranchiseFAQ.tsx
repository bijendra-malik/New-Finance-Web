import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import SectionShell from "./SectionShell";
import { FRANCHISE_FAQS, FRANCHISE_EMAIL } from "./franchiseData";

/** Section 13 — franchise FAQs. */
const FranchiseFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell
      id="faqs"
      eyebrow="FAQs"
      title="Franchise Questions, Answered Directly"
      subtitle="Fees, payouts, guarantees and documentation — the same answers our team gives on a call."
      tone="tint"
    >
      <div className="mx-auto max-w-4xl">
        <ul className="space-y-3">
          {FRANCHISE_FAQS.map((item, i) => {
            const active = open === i;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl bg-white transition-all duration-300"
                style={{
                  border: active ? "1.5px solid var(--brand-teal)" : "1.5px solid rgba(6,106,156,0.14)",
                  borderLeft: `4px solid ${active ? "var(--brand-teal)" : "#d7dfe5"}`,
                  boxShadow: active ? "0 8px 22px rgba(38,174,144,0.14)" : "0 1px 6px rgba(6,106,156,0.05)",
                }}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(active ? null : i)}
                    aria-expanded={active}
                    className="flex w-full cursor-pointer items-center gap-3.5 px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors"
                      style={{
                        background: active ? "var(--brand-teal)" : "#f1f5f8",
                        color: active ? "#fff" : "var(--brand-navy)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[14px] font-semibold leading-snug text-slate-800">{item.q}</span>
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors"
                      style={{ background: active ? "var(--brand-teal)" : "#f1f5f8" }}
                    >
                      {active
                        ? <Minus size={13} color="#fff" />
                        : <Plus size={13} style={{ color: "var(--brand-navy)" }} />}
                    </span>
                  </button>
                </h3>
                <div
                  className="grid transition-all duration-300"
                  style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
                  aria-hidden={!active}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 px-4 pb-4 pt-3.5 pl-14.5 text-[13px] leading-relaxed text-slate-500">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-[13px] text-slate-500">
            Still have questions? Write to our franchise team at{" "}
            <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-navy) hover:underline">
              {FRANCHISE_EMAIL}
            </a>
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-teal))" }}
          >
            Talk to Our Team →
          </Link>
        </div>
      </div>
    </SectionShell>
  );
};

export default FranchiseFAQ;
