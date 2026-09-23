import { useEffect, useState } from "react";
import { fetchMasters } from "../api/masters";
import { MASTERS } from "../constants/masters";
import type { Masters } from "../constants/masters";

interface UseMastersResult {
  masters: Masters;
  loading: boolean;
  error: boolean;
}

const DEFAULT_MASTERS: Masters = { ...MASTERS, citiesByState: {}, pincodesByLocation: {} };

export const useMasters = (): UseMastersResult => {
  const [masters, setMasters] = useState<Masters>(DEFAULT_MASTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchMasters()
      .then((data) => {
        if (cancelled) return;
        // Merge over defaults — a master type missing from the DB (e.g. stale seed)
        // falls back to its local default instead of leaving the field undefined.
        setMasters({ ...DEFAULT_MASTERS, ...data });
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { masters, loading, error };
};
