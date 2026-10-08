import FranchiseIcon from "./FranchiseIcon";
import SectionShell from "./SectionShell";
import { BENEFITS } from "./franchiseData";

/** Section 6 — eight benefit cards. */
const FranchiseBenefits = () => (
  <SectionShell
    id="benefits"
    eyebrow="Why Indexia"
    title="Why Become an Indexia Franchisee?"
    subtitle="What you actually get from the franchise — no income projections and no approval guarantees, just the working arrangement."
    tone="tint"
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {BENEFITS.map((b) => (
        <div
          key={b.title}
          className="group relative overflow-hidden rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-1"
          style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.07)" }}
        >
          <span
            className="absolute inset-x-0 top-0 h-0.75 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
            style={{ background: "linear-gradient(90deg,#26ae90,var(--brand-navy))" }}
          />
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
          >
            <FranchiseIcon name={b.icon} filled className="h-5.5 w-5.5" />
          </span>
          <h3 className="mt-4 text-[14.5px] font-bold leading-snug text-slate-800">{b.title}</h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">{b.desc}</p>
        </div>
      ))}
    </div>
  </SectionShell>
);

export default FranchiseBenefits;
