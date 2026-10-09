// PayoutShareViz — the 80/20 split bar plus the worked-rupee example panel.
// Extracted so FranchisePayout and any future partner dashboard share one
// visualisation instead of re-declaring the same bar + example block.

import { ShareSplitBar } from "./ShareSplit";
import { INDEXIA_SHARE, PARTNER_SHARE } from "./franchiseData";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface WorkedExampleProps {
  total: number;
}

const WorkedExample = ({ total }: WorkedExampleProps) => {
  const partnerAmount = (total * PARTNER_SHARE) / 100;
  const indexiaAmount = (total * INDEXIA_SHARE) / 100;

  return (
    <div className="rounded-2xl border border-slate-200">
      <div
        className="flex items-center justify-between gap-3 rounded-t-2xl px-4 py-2.5"
        style={{ background: "var(--brand-navy-14)" }}
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-(--brand-navy)">
          If an eligible case pays out {inr(total)}
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Illustrative
        </span>
      </div>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--brand-teal-14)" }}>
        <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand-teal)" }} />
          Franchise Partner — {PARTNER_SHARE}%
        </span>
        <span className="text-lg font-extrabold" style={{ color: "var(--brand-teal)" }}>
          {inr(partnerAmount)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand-navy)" }} />
          Indexia Finance — {INDEXIA_SHARE}%
        </span>
        <span className="text-lg font-extrabold" style={{ color: "var(--brand-navy)" }}>
          {inr(indexiaAmount)}
        </span>
      </div>
    </div>
  );
};

interface PayoutShareVizProps {
  /** Total payout to illustrate in rupees; {defaultExample} = ₹1,00,000. */
  exampleTotal?: number;
  className?: string;
}

/** The split bar + worked-rupee example, shown together so the percentages are
 * labelled once and the arithmetic is not left implicit. */
const PayoutShareViz = ({ exampleTotal = 100000, className = "" }: PayoutShareVizProps) => (
  <div className={className}>
    <ShareSplitBar compact />
    <div className="mt-6">
      <WorkedExample total={exampleTotal} />
    </div>
    <p className="mt-4 text-[11.5px] leading-relaxed text-slate-500">
      Illustrative example only. Actual payouts vary by lender, product, loan amount, customer profile and
      applicable terms.
    </p>
  </div>
);

export { WorkedExample };
export default PayoutShareViz;
