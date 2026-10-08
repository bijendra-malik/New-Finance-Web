import { useEffect, useRef, useState } from "react";

/** Animates a displayed number toward its target over `duration` ms. */
export const useCountUp = (target: number, duration = 450) => {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const delta = target - from;
    if (Math.abs(delta) < 1) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    startRef.current = null;
    let raf: number;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + delta * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // Animate only when the target changes; `from` is read once per run by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
};

export default useCountUp;
