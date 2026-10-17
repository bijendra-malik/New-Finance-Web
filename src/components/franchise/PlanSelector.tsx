// Plan summary card + package dropdown shared by FranchisePlans and FranchiseForm.

import type { FranchisePlan } from "./franchiseData";
import { AGREEMENT_FEE } from "./franchiseData";
import { Field } from "../ui/FieldRenderer";

interface PlanSummaryProps {
  /** Currently selected plan, or undefined when nothing is chosen. */
  plan?: FranchisePlan;
  className?: string;
  /** Single-line read-out, for layouts that must stay within one screen. */
  compact?: boolean;
}

export const PlanSummary = ({ plan, className = "", compact = false }: PlanSummaryProps) => (
  <div className={className}>
    {plan && compact ? (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-slate-600">
        {[
          ["Plan", plan.name],
          ["Duration", plan.duration],
          ["Fee", plan.fee],
          ["Renewal", plan.renewal],
          ["Agreement fee", AGREEMENT_FEE],
        ].map(([k, v]) => (
          <span key={k}>
            <span className="font-bold uppercase tracking-wider text-slate-500">{k}</span>{" "}
            <span className="font-bold text-(--brand-navy)">{v}</span>
          </span>
        ))}
      </div>
    ) : plan ? (
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        {[
          ["Selected plan", plan.name],
          ["Duration", plan.duration],
          ["Plan fee", plan.fee],
          ["Renewal", plan.renewal],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">{k}</dt>
            <dd className="mt-0.5 text-[13px] font-bold text-(--brand-navy)">{v}</dd>
          </div>
        ))}
        <div className="col-span-2 sm:col-span-4">
          <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
            Franchisee agreement fee (payable separately)
          </dt>
          <dd className="mt-0.5 text-[13px] font-bold text-slate-700">{AGREEMENT_FEE}</dd>
        </div>
      </dl>
    ) : (
      <p className="text-[12.5px] text-slate-500">
        Select a package duration above — the plan and applicable fee will be shown here before you submit.
      </p>
    )}
  </div>
);

interface PackageSelectorProps {
  /** Selected plan id (not the display label) — matches plan.id. */
  value: string;
  onChange: (planId: string) => void;
  error?: string;
  required?: boolean;
  full?: boolean;
  id?: string;
  plans: FranchisePlan[];
  disabled?: boolean;
}

export const PackageSelector = ({
  value,
  onChange,
  error,
  required,
  full,
  id = "package",
  plans,
  disabled = false,
}: PackageSelectorProps) => {
  const describedBy =
    [error ? `${id}-error` : "", disabled ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <Field
      id={id}
      label="Interested Package Duration"
      required={required}
      error={error}
      full={full}
    >
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
          error ? "border-red-400 bg-red-50/40" : "border-slate-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <option value="">Select a package duration</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.duration} — {plan.fee}
          </option>
        ))}
      </select>
      {disabled && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-slate-400">
          Packages could not be loaded — retry to see the current plans.
        </p>
      )}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-[11px] text-red-500">{error}</p>}
    </Field>
  );
};

export default PackageSelector;
