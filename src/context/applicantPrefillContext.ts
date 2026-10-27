import { createContext, useContext } from "react";
import type { LockableField } from "../utils/accountProfile";

export interface ApplicantPrefill {
  identity: Partial<Record<LockableField, string>>;
  note: string;
  authoritative?: boolean;
  lockIdentity?: boolean;
}

export const ApplicantPrefillContext = createContext<ApplicantPrefill | null>(null);
export const ApplicantPrefillActionsContext = createContext<((value: ApplicantPrefill | null) => void) | null>(null);

/** The identity a host (e.g. the franchisor portal) wants a form to apply for. */
export const useApplicantPrefill = (): ApplicantPrefill | null =>
  useContext(ApplicantPrefillContext);

export const useSetApplicantPrefill = () => useContext(ApplicantPrefillActionsContext);
