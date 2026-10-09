import FranchiseIcon from "./FranchiseIcon";
import SectionShell from "./SectionShell";
import PayoutShareViz from "./PayoutShareViz";
import {
  EARNING_DEPENDENCIES,
  MAX_PAYOUTS,
  PAYOUT_DISCLAIMER,
} from "./franchiseData";

/**
 * Everything money-related, in one section, each fact stated once:
 * the lender's ceiling rates, the 80:20 split and a worked example, then what a
 * payout actually depends on.
 *
 * This replaces the three sections that each re-explained the split — the payout
 * block inside the model section, the payout-potential section and the
 * how-you-earn walkthrough — plus the separate lead-requirement warning.
 */
const FranchisePayout = () => (
  <SectionShell
    id="payouts"
    eyebrow="Payout Potential"
    title="What a Payout Looks Like"
    subtitle="Payout rates are set by the lender and the product. Your share of an eligible payout is fixed at the split below."
    tone="tint"
  >
    {/* Ceiling rates */}
    <div className="grid gap-6 md:grid-cols-2">
      {MAX_PAYOUTS.map((p) => (
        <div
          key={p.id}
          className="group relative overflow-hidden rounded-3xl bg-white p-6 transition-all duration-300 hover:-translate-y-1 md:p-7"
          style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 4px 22px rgba(6,106,156,0.09)" }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40"
            style={{ background: "radial-gradient(circle,rgba(38,174,144,0.22),transparent 70%)" }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
              >
                <FranchiseIcon name={p.icon} filled className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-800">{p.title}</h3>
              <p className="mt-2 max-w-2xs text-[13px] leading-relaxed text-slate-500">{p.desc}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{p.caption}</p>
              <p className="mt-1 text-3xl font-extrabold leading-none" style={{ color: "var(--brand-navy)" }}>
                {p.rate}
              </p>
            </div>
          </div>
          <div
            className="relative mt-5 rounded-xl px-3.5 py-2.5 text-[11.5px] font-semibold text-slate-500"
            style={{ background: "var(--brand-navy-14)" }}
          >
            Ceiling rate for eligible cases — not a fixed or guaranteed rate.
          </div>
        </div>
      ))}
    </div>

    {/* The split — bar + worked rupee example, shared with any future partner dashboard. */}
    <div
      className="mt-10 rounded-3xl bg-white p-6 md:p-9"
      style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 4px 22px rgba(6,106,156,0.08)" }}
    >
      <div className="max-w-6xl">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
          Who Gets What
        </span>
        <h3 className="mt-2 text-xl font-extrabold text-slate-800 md:text-2xl">
          Your share <span style={{ color: "var(--brand-teal)" }}>{80}%</span> · Indexia share <span style={{ color: "var(--brand-navy)" }}>{20}%</span>
        </h3>
        <PayoutShareViz />
      </div>
    </div>

    {/* What it depends on — one panel, not four scattered caveats */}
    <div
      className="mt-10 overflow-hidden rounded-3xl p-6 md:p-9"
      style={{ background: "linear-gradient(120deg,#0e1e3c 0%,#1b6ca8 100%)" }}
    >
      <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-yellow)">
        Before You Pay Any Fee
      </span>
      <h3 className="mt-2 text-xl font-extrabold leading-snug text-white md:text-2xl">
        What a payout actually depends on
      </h3>

      <ul className="mt-7 grid gap-6 md:grid-cols-2">
        {EARNING_DEPENDENCIES.map((item) => (
          <li key={item.title} className="border-l-2 border-(--brand-teal) pl-4">
            <h4 className="text-[14px] font-bold text-white">{item.title}</h4>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{item.desc}</p>
          </li>
        ))}
      </ul>

      <p className="mt-7 max-w-3xl border-t border-white/15 pt-5 text-[11.5px] leading-relaxed text-white/55">
        {PAYOUT_DISCLAIMER}
      </p>
    </div>
  </SectionShell>
);

export default FranchisePayout;
