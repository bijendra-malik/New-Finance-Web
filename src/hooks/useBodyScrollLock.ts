import { useEffect } from "react";

// Freezes page scrolling while an overlay is open
export const useBodyScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
};
