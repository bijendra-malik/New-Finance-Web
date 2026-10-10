import { useCallback, useEffect, useState } from "react";
import { fetchMyApplications } from "../api/myApplications";
import type { MyApplication } from "../api/myApplications";
import { onApplicationSubmitted } from "../utils/applicationEvents";

// Shared between the header chip and the applications page, so mounting both
// does not fan the 18 product calls out twice.
let cache: MyApplication[] | null = null;
let inflight: Promise<MyApplication[]> | null = null;

const load = (): Promise<MyApplication[]> => {
  if (!inflight) {
    inflight = fetchMyApplications().then((rows) => {
      cache = rows;
      return rows;
    });
    inflight.finally(() => {
      inflight = null;
    });
  }
  return inflight;
};

/**
 * The signed-in customer's applications across every loan product, refreshed
 * whenever one is submitted. `enabled` gates the fetch for signed-out visitors.
 */
export const useMyApplications = (enabled: boolean) => {
  const [applications, setApplications] = useState<MyApplication[]>(() => cache ?? []);
  const [loading, setLoading] = useState(() => enabled && cache === null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    // A manual reload must not serve the previous snapshot.
    cache = null;
    try {
      setApplications(await load());
    } catch {
      setError("Could not load your applications right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    // Initial load: state starts from the cache, so only the cache-miss case
    // needs to fetch. Completion happens inside the promise callbacks.
    if (cache === null) {
      load()
        .then((rows) => {
          if (active) setApplications(rows);
        })
        .catch(() => {
          if (active) setError("Could not load your applications right now.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    // A fresh submission supersedes the cache — reload from the event, not render.
    const unsubscribe = onApplicationSubmitted(() => {
      void refresh();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [enabled, refresh]);

  return { applications, loading, error, refresh };
};

export default useMyApplications;
