// PlanSelector — the plan summary card + package dropdown used by FranchisePlans
// and FranchiseForm. One module so the plan fee/renewal/duration read-out is
// rendered from one place, and the package dropdown is shared between the plans
// comparison and the application form.

import { FRANCHISE_PLANS, type FranchisePlan } from "./franchiseData";
import { AGREEMENT_FEE } from "./franchiseData";
import { Field, SelectField } from "../ui/FieldRenderer";

interface PlanSummaryProps {
  /** Currently selected plan, or undefined when nothing is chosen. */
  plan?: FranchisePlan;
  className?: string;
}

/** The selected-plan read-out shown in the application form. Reused from
 * FranchisePlans' comparison card so the fee/renewal/duration text is consistent. */
export const PlanSummary = ({ plan, className = "" }: PlanSummaryProps) => (
  <div className={className}>
    {plan ? (
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
  value: string;
  onChange: (id: string) => void;
  error?: string;
  required?: boolean;
  full?: boolean;
  id?: string;
}

/** Package-duration dropdown that mirrors FranchisePlans' plan list and uses the
 * same fee strings, so the comparison card and the form dropdown agree. */
export const PackageSelector = ({
  value,
  onChange,
  error,
  required,
  full,
  id = "package",
}: PackageSelectorProps) => (
  <Field
    id={id}
    label="Interested Package Duration"
    required={required}
    error={error}
    full={full}
  >
    <SelectField
      value={value}
      onChange={onChange}
      options={FRANCHISE_PLANS.map((p) => `${p.duration} — ${p.fee}`)}
      placeholder="Select a package duration"
      error={error}
    />
  </Field>
);

interface PlanSelectorProps {
  /** The currently selected plan used for the summary read-out. */
  plan?: FranchisePlan;
  value: string;
  onChange: (id: string) => void;
  error?: string;
  required?: boolean;
  full?: boolean;
  id?: string;
  summaryClassName?: string;
  className?: string;
}

/** Combined plan summary + package selector used by the franchise forms. */
export const PlanSelector = ({
  plan,
  value,
  onChange,
  error,
  required,
  full,
  id = "package",
  summaryClassName = "",
  className = "",
}: PlanSelectorProps) => (
  <div className={className}>
    <PlanSummary plan={plan} className={summaryClassName} />
    <div className="mt-4">
      <PackageSelector
        value={value}
        onChange={onChange}
        error={error}
        required={required}
        full={full}
        id={id}
      />
    </div>
  </div>
);

export default PlanSelector;
