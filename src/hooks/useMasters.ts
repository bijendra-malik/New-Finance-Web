import { useEffect, useState } from "react";
import { fetchMasters } from "../api/masters";
import { MASTERS, CITIES_BY_STATE } from "../constants/masters";
import type { Masters } from "../constants/masters";

interface UseMastersResult {
  masters: Masters;
  loading: boolean;
  error: boolean;
}

const DEFAULT_MASTERS: Masters = {
  ...MASTERS,
  citiesByState: CITIES_BY_STATE,
};

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
        // Location maps merge per-key so a partial server seed doesn't wipe the
        // static fallbacks.
        setMasters({
          ...DEFAULT_MASTERS,
          ...data,
          citiesByState: { ...DEFAULT_MASTERS.citiesByState, ...data.citiesByState },
        });
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
