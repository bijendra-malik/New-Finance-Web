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

// ── Indian amount entry helpers ──────────────────────────────────────────────
export const digitsOnly = (raw: string): string =>
  raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

/** Parses a possibly comma-grouped amount string into a non-negative integer ("" → 0). */
export const parseIndianAmount = (raw: string): number =>
  parseInt(raw.replace(/\D/g, ""), 10) || 0;

/** Formats digits with Indian separators for display. */
export const formatIndianNumber = (raw: string): string => {
  const digits = digitsOnly(raw);
  if (!digits) return "";
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  return rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}` : last3;
};

// 15-character GSTIN: 2-digit state code, 5-letter + 4-digit PAN, 1 letter, entity digit, literal Z, checksum — only lets characters through where the GSTIN structure expects them.
export const formatGSTIN = (raw: string): string => {
  const chars = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").split("");
  let out = "";
  for (const c of chars) {
    if (out.length >= 15) break;
    const pos = out.length;
    const isLetter = /[A-Z]/.test(c);
    const isDigit = /[0-9]/.test(c);
    if (pos < 2 && isDigit) out += c;                       // state code
    else if (pos >= 2 && pos < 7 && isLetter) out += c;     // PAN letters
    else if (pos >= 7 && pos < 11 && isDigit) out += c;     // PAN digits
    else if (pos === 11 && isLetter) out += c;              // entity letter
    else if (pos === 12 && /[1-9A-Z]/.test(c)) out += c;    // entity number
    else if (pos === 13 && c === "Z") out += c;             // literal Z
    else if (pos === 14 && /[0-9A-Z]/.test(c)) out += c;    // checksum
  }
  return out;
};
