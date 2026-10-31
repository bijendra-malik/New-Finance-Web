import { useEffect, useState } from "react";

interface MediaEnvironment {
  reducedMotion: boolean;
  saveData?: boolean;
  effectiveType?: string;
}

export const shouldAllowHeavyMedia = ({
  reducedMotion,
  saveData,
  effectiveType,
}: MediaEnvironment): boolean => {
  if (reducedMotion) return false;
  if (saveData) return false;
  if (/(^|-)2g$/.test(effectiveType ?? "")) return false;
  return true;
};

export const useHeavyMediaAllowed = (): boolean => {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;

    const permitted = shouldAllowHeavyMedia({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      saveData: connection?.saveData,
      effectiveType: connection?.effectiveType,
    });
    if (!permitted) return;

    const idle = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const handle = idle.requestIdleCallback
      ? idle.requestIdleCallback(() => setAllowed(true))
      : window.setTimeout(() => setAllowed(true), 1500);

    return () => {
      if (idle.cancelIdleCallback) idle.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return allowed;
};

export default useHeavyMediaAllowed;
