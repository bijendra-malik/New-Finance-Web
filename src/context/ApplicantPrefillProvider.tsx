import type { ReactNode } from "react";
import { ApplicantPrefillContext } from "./applicantPrefillContext";
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
  value: ApplicantPrefill;
  children: ReactNode;
}) => <ApplicantPrefillContext.Provider value={value}>{children}</ApplicantPrefillContext.Provider>;

export default ApplicantPrefillProvider;
