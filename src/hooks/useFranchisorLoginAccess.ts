import { useAuth } from "../context/authContext";
import { isFranchiseSignedIn } from "../utils/franchiseSession";
import useFranchiseStatus from "./useFranchiseStatus";

/**
 * Gate for every "Franchisor Login" entry point (header nav, franchise page
 * CTAs, form success screens).
 *
 * A signed-out visitor sees them greyed out and non-clickable with a sign-in
 * hint. A customer session on this device enables them — and so does a live
 * franchise partner session, because partners sign in with their franchise ID
 * and password and are *not* signed in to the customer account; without that
 * half of the check a partner could never reach the login page again.
 *
 * The backend franchise status is authoritative. Only accounts with no status
 * (`None`), `pending`, or `rejected` are prevented from opening the login page.
 */
export const useFranchisorLoginAccess = (): boolean => {
  const { isLoggedIn, user } = useAuth();
  const franchiseSignedIn = isFranchiseSignedIn();
  const statusResult = useFranchiseStatus(isLoggedIn || franchiseSignedIn);
  if (!isLoggedIn && !franchiseSignedIn) return false;
  const status = (statusResult.reported ? statusResult.status : user?.franchiseStatus ?? "")
    .trim()
    .toLowerCase();
  if (statusResult.loading) return false;
  if (statusResult.reported && status === "") return false;
  return status !== "none" && status !== "pending" && status !== "rejected";
};

export default useFranchisorLoginAccess;
