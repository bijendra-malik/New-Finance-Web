import FranchiseIcon from "./FranchiseIcon";
import SectionShell from "./SectionShell";
import {
  AGREEMENT_FEE,
  AGREEMENT_FEE_NOTE,
  FRANCHISE_PLANS,
  type FranchisePlan,
} from "./franchiseData";

interface FranchisePlansProps {
  selectedPlanId: string | null;
  onSelectPlan: (plan: FranchisePlan) => void;
}

const Check = () => (
  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
    <FranchiseIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.8} />
  </span>
);

/**
 * Plan cards, the mandatory agreement fee, and the terms that apply to all plans.
 *
 * The plan data is rendered exactly once, as cards that reflow from five columns
 * down to one. This section previously also carried a desktop comparison table and
 * a separate mobile card list, which showed the same five plans — duration, fee and
 * renewal — three times over.
 */
const FranchisePlans = ({ selectedPlanId, onSelectPlan }: FranchisePlansProps) => (
  <SectionShell
    id="plans"
    eyebrow="Franchise Investment"
    title="Choose a Plan That Fits Your Business"
    subtitle="Every plan is published with its fee, validity period and renewal terms. The 3-year plan carries the lowest effective monthly cost; prices are exclusive of GST."
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {FRANCHISE_PLANS.map((plan) => {
        const selected = selectedPlanId === plan.id;
        const accent = plan.recommended || selected;

        return (
          <div
            key={plan.id}
            className="relative flex flex-col rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-1"
            style={{
              border: accent ? "2px solid var(--brand-teal)" : "1px solid rgba(6,106,156,0.14)",
              boxShadow: accent ? "0 10px 28px rgba(38,174,144,0.18)" : "0 2px 14px rgba(6,106,156,0.07)",
            }}
          >
            {plan.badge && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white"
                style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
              >
                Best Value — 3 Years
              </span>
            )}

            <div className={plan.badge ? "pt-4" : ""}>
              <h3 className="text-[15px] font-extrabold text-slate-800">{plan.name}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">
                <FranchiseIcon name="clock" className="h-3.5 w-3.5" strokeWidth={2.2} />
                {plan.duration}
              </div>
            </div>

            <p className="mt-4 text-2xl font-extrabold leading-none text-slate-800">
              {plan.fee.split(" + GST")[0]}
              <span className="ml-1 align-middle text-[11px] font-bold uppercase tracking-wider text-slate-400">
                + GST
              </span>
            </p>

            {/* Plan-specific facts only. Payout terms apply to every plan, so they are
                stated once in the payouts section rather than repeated on each card. */}
            <ul className="mt-5 space-y-2 border-t border-dashed border-slate-200 pt-4 text-[12.5px] text-slate-600">
              <li className="flex items-start gap-2">
                <Check />
                <span>Franchise access for {plan.duration.toLowerCase()}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <span>Renewal: {plan.renewal}</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => onSelectPlan(plan)}
              className="mt-5 w-full cursor-pointer rounded-xl py-2.5 text-[13px] font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
              style={
                selected
                  ? { background: "linear-gradient(135deg,#26ae90,var(--brand-navy))", color: "#fff" }
                  : accent
                    ? { background: "var(--brand-teal-14)", color: "var(--brand-navy)" }
                    : { border: "1px solid rgba(6,106,156,0.22)", color: "var(--brand-navy)" }
              }
            >
              {selected ? "Selected ✓" : "Select this plan"}
            </button>
          </div>
        );
      })}
    </div>

    <p className="mt-6 max-w-3xl text-[12.5px] leading-relaxed text-slate-500">
      All fees are exclusive of GST. Renewal charges for the shorter plans are as communicated at the time of
      renewal.
    </p>

    {/* Agreement fee */}
    <div
      className="mt-8 flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between md:p-6"
      style={{ background: "var(--brand-navy-14)", border: "1px dashed var(--brand-navy-44)" }}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
        >
          <FranchiseIcon name="doc" filled className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
            Franchisee Agreement Fee
          </h3>
          <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-slate-600">{AGREEMENT_FEE_NOTE}</p>
        </div>
      </div>
      <p className="shrink-0 text-2xl font-extrabold text-(--brand-navy)">{AGREEMENT_FEE}</p>
    </div>
  </SectionShell>
);

export default FranchisePlans;
