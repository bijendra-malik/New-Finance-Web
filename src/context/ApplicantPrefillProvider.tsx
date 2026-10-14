import { useState, type ReactNode } from "react";
import { ApplicantPrefillActionsContext, ApplicantPrefillContext } from "./applicantPrefillContext";
import type { ApplicantPrefill } from "./applicantPrefillContext";

/**
 * Supplies the identity a hosted application form should fill and lock — used by
 * the franchisor portal so a form applies for the selected client rather than the
 * signed-in franchisee.
 */
export const ApplicantPrefillProvider = ({
  value,
  children,
}: {
  value?: ApplicantPrefill;
  children: ReactNode;
}) => {
  const [applicant, setApplicant] = useState<ApplicantPrefill | null>(value ?? null);
  const resolvedValue = value ?? applicant;
  return (
    <ApplicantPrefillActionsContext.Provider value={value ? null : setApplicant}>
      <ApplicantPrefillContext.Provider value={resolvedValue}>{children}</ApplicantPrefillContext.Provider>
    </ApplicantPrefillActionsContext.Provider>
  );
};

export default ApplicantPrefillProvider;
