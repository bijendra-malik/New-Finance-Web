/** The two small presentational cards the overview panel is built from. */

import FranchiseIcon from "../FranchiseIcon";
import type { FranchiseIconName } from "../FranchiseIcon";

export const StatCard = ({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: FranchiseIconName;
  accent: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_14px_rgba(6,106,156,0.06)]">
    <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} aria-hidden="true" />
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1.5 text-2xl font-extrabold text-slate-800 md:text-[27px]">{value}</p>
      </div>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
        aria-hidden="true"
      >
        <FranchiseIcon name={icon} className="h-4.5 w-4.5" />
      </span>
    </div>
    <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">{hint}</p>
  </div>
);

export const QuickAction = ({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: FranchiseIconName;
  label: string;
  hint: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left transition-all hover:border-(--brand-teal)/40 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
  >
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))", color: "#fff" }}
      aria-hidden="true"
    >
      <FranchiseIcon name={icon} className="h-4 w-4" filled />
    </span>
    <span className="min-w-0">
      <span className="block text-[13px] font-extrabold text-slate-800">{label}</span>
      <span className="mt-0.5 block text-[11.5px] leading-relaxed text-slate-500">{hint}</span>
    </span>
    <span className="ml-auto shrink-0 self-center text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-(--brand-teal)" aria-hidden="true">
      →
    </span>
  </button>
);
