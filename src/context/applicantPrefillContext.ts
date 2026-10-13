import { createContext, useContext } from "react";
import type { LockableField } from "../utils/accountProfile";

/**
 * A portal-supplied applicant identity.
 *
 * Every product form renders the shared `PersonalDetailsSection`, which normally
 * fills and locks the identity fields from the signed-in account
 * (`readStoredProfile()`). When a franchisor files an application on a customer's
 * behalf, the applicant is the *registered client*, not the signed-in franchisee —
 * so the portal wraps the form in `ApplicantPrefillProvider` and the section fills
 * and locks the client's record instead. Product forms need no changes: they
 * receive the same component with the same contract.
 */
export interface ApplicantPrefill {
  /** Identity fields to force-fill and lock. Blank values are ignored. */
  identity: Partial<Record<LockableField, string>>;
  /** Banner copy shown above the identity fields while the lock is active. */
  note: string;
}

export const ApplicantPrefillContext = createContext<ApplicantPrefill | null>(null);

/** The identity a host (e.g. the franchisor portal) wants a form to apply for. */
export const useApplicantPrefill = (): ApplicantPrefill | null =>
  useContext(ApplicantPrefillContext);
