import FranchiseIcon from "./FranchiseIcon";
import SectionShell from "./SectionShell";
import { JOURNEY_STEPS } from "./franchiseData";

/**
 * One journey, told once: application through to the payout landing with the
 * franchise partner.
 *
 * This section replaces three that described overlapping halves of the same
 * sequence — the four-step business model, the five-step post-application
 * timeline and the six-chip lead dependency chain. Steps whose outcome is not in
 * the partner's hands are marked, so approval and disbursement are not read as
 * things the franchise controls.
 */
const FranchiseJourney = () => (
  <SectionShell
    id="how-it-works"
    eyebrow="The Model"
    title="How the Franchise Model Works"
    subtitle="Six steps from application to payout. Steps 4 and 5 depend on the customer and the lender, not on the franchise partner."
  >
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {JOURNEY_STEPS.map((step) => (
        <li
          key={step.id}
          className="group relative flex flex-col rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-1"
          style={{
            border: step.external ? "1px dashed rgba(6,106,156,0.28)" : "1px solid rgba(6,106,156,0.12)",
            boxShadow: "0 2px 14px rgba(6,106,156,0.07)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{
                background: step.external
                  ? "linear-gradient(135deg,var(--brand-navy),var(--brand-navy-deep))"
                  : "linear-gradient(135deg,#26ae90,var(--brand-navy))",
              }}
            >
              <FranchiseIcon name={step.icon} filled className="h-5.5 w-5.5" />
            </span>
            <span className="text-2xl font-extrabold leading-none" style={{ color: "var(--brand-navy-22)" }}>
              {step.id}
            </span>
          </div>

          <h3 className="text-[15px] font-bold text-slate-800">{step.title}</h3>
          <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">{step.desc}</p>

          {step.external && (
            <p className="mt-4 text-[10.5px] font-bold uppercase tracking-widest text-(--brand-navy)">
              Outside the franchise partner&apos;s control
            </p>
          )}
        </li>
      ))}
    </ol>

    {/* The two routes into the business, stated once instead of in three places. */}
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {[
        {
          title: "You build the customer side",
          desc: "Your market, your customer relationships and the leads you submit.",
        },
        {
          title: "Indexia runs the lender side",
          desc: "Product fit, lender coordination, documentation and processing through partner banks and NBFCs.",
        },
      ].map((lane, i) => (
        <div
          key={lane.title}
          className="flex items-start gap-3.5 rounded-2xl px-5 py-4"
          style={{ background: "var(--brand-navy-14)" }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
          >
            <FranchiseIcon name={i === 0 ? "user" : "network"} filled className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-[13.5px] font-bold text-slate-800">{lane.title}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{lane.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </SectionShell>
);

export default FranchiseJourney;
