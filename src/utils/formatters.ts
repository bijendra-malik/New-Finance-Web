export const toISODate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const formatPAN = (raw: string): string => {
  const chars = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").split("");
  let out = "";
  for (const c of chars) {
    if (out.length >= 10) break;
    const pos = out.length;
    const isLetter = /[A-Z]/.test(c);
    const isDigit = /[0-9]/.test(c);
    if ((pos < 5 || pos === 9) && isLetter) out += c;
    else if (pos >= 5 && pos < 9 && isDigit) out += c;
  }
  return out;
};
