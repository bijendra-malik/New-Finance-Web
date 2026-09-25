import { useCallback, useEffect, useState } from "react";
import { fetchMasters, fetchStates, fetchCitiesByState, getEmploymentTypes } from "../api/masters";
import { MASTERS } from "../constants/masters";
import type { Masters } from "../constants/masters";

interface UseMastersResult {
  masters: Masters;
  loading: boolean;
  error: boolean;
  loadCities: (state: string) => string[];
  /** Employment types for a loan type, backend-first with local-constants fallback. */
  getEmploymentTypesFor: (loanType: string, fallbackKey: keyof typeof MASTERS) => Promise<string[]>;
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

  const getEmploymentTypesFor = useCallback(
    async (loanType: string, fallbackKey: keyof typeof MASTERS): Promise<string[]> =>
      getEmploymentTypes(loanType, MASTERS[fallbackKey] as readonly string[]),
    []
  );

  return { masters, loading, error, loadCities, getEmploymentTypesFor };
};
