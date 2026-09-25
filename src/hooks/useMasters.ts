import { useCallback, useEffect, useState } from "react";
import { fetchMasters, fetchStates, fetchCitiesByState } from "../api/masters";
import { MASTERS } from "../constants/masters";
import type { Masters } from "../constants/masters";

interface UseMastersResult {
  masters: Masters;
  loading: boolean;
  error: boolean;
  loadCities: (state: string) => string[];
}

const DEFAULT_MASTERS: Masters = {
  ...MASTERS,
  states: [],
  citiesByState: {},
};

export const useMasters = (): UseMastersResult => {
  const [masters, setMasters] = useState<Masters>(DEFAULT_MASTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchMasters(), fetchStates()])
      .then(([mastersRes, statesRes]) => {
        if (cancelled) return;
        const failed = mastersRes.status === "rejected" || statesRes.status === "rejected";
        if (failed) setError(true);
        const data = mastersRes.status === "fulfilled" ? mastersRes.value : null;
        const states = statesRes.status === "fulfilled" ? statesRes.value : [];
        setMasters({
          ...DEFAULT_MASTERS,
          ...(data ?? {}),
          states,
          citiesByState: {},
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const loadCities = useCallback((state: string): string[] => {
    if (!state) return [];
    const cached = masters.citiesByState[state];
    if (cached) return [...cached];

    fetchCitiesByState(state)
      .then((cities) => {
        setMasters(prev => ({
          ...prev,
          citiesByState: { ...prev.citiesByState, [state]: cities },
        }));
      })
      .catch(() => {
      });

    return [];
  }, [masters.citiesByState]);

  return { masters, loading, error, loadCities };
};
