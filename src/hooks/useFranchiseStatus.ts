import { useEffect, useState } from "react";
import { isFranchiseSignedIn } from "../utils/franchiseSession";
import { fetchFranchiseStatus } from "../api/franchiseCustomers";

/**
 * This franchise's agreement status straight from GET /franchise/status,
 * fetched with the franchise bearer token. Returns an empty string when there
 * is no franchise session or the backend does not report a status, so callers
 * can fall back to the session/profile copy.
 */
export const useFranchiseStatus = (enabled = isFranchiseSignedIn()): { status: string; loading: boolean; reported: boolean } => {
  const [status, setStatus] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetchFranchiseStatus().then((res) => {
      if (!active) return;
      if (res.ok) {
        setStatus(res.status);
        setReported(true);
      } else {
        setReported(false);
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [enabled]);

  return {
    status: enabled ? status : "",
    loading: enabled && !loaded,
    reported: enabled && reported,
  };
};

export default useFranchiseStatus;
