export const toISODate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const slugifyLocation = (s: string): string =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const pincodeLocationKey = (state: string, city: string): string =>
  `${slugifyLocation(state)}::${slugifyLocation(city)}`;

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
