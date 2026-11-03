import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const timers: number[] = [];
    let attempts = 0;
    let frame = 0;
    let cancelled = false;

    const scrollToHash = () => {
      if (cancelled) return;

      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (attempts < 5) {
        attempts += 1;
        timers.push(window.setTimeout(scrollToHash, 80));
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    frame = window.requestAnimationFrame(scrollToHash);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [location]);

  return null;
};

export default ScrollToTop;
