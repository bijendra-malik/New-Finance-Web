import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a CSS media query in React state. Used to switch between a single
 * horizontal layout on wide screens and a stepped layout on smaller ones.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  // No window (non-browser render) means the wide-screen query cannot match.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
