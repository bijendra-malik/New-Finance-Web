import { useState } from "react";

/**
 * Shows a field's error only after the visitor has interacted with it,
 * so a fresh form isn't covered in red.
 */
export const useTouchedErrors = <K extends string>(allErrors: Partial<Record<K, string>>) => {
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({});

  const errors: Partial<Record<K, string>> = {};
  (Object.keys(touched) as K[]).forEach((k) => {
    if (touched[k] && allErrors[k]) errors[k] = allErrors[k];
  });

  const touch = (key: K) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  const markAllTouched = (keys: string[]) =>
    setTouched((prev) => {
      const next = { ...prev };
      keys.forEach((k) => { next[k as K] = true; });
      return next;
    });

  // Fields that stop applying when the visitor switches branch must also stop showing errors, so their touched flag is cleared rather than set.
  const untouch = (keys: string[]) =>
    setTouched((prev) => {
      const next = { ...prev };
      keys.forEach((k) => { delete next[k as K]; });
      return next;
    });

  return { touched, errors, touch, markAllTouched, untouch };
};

export default useTouchedErrors;
