export const toISODate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const formatMoney = (
  value?: number | null,
  options?: Intl.NumberFormatOptions,
): string | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const sign = value < 0 ? "-" : "";
  return `${sign}₹${Math.abs(value).toLocaleString("en-IN", options)}`;
};

export const formatINR = (value: number): string =>
  `₹${value.toLocaleString("en-IN")}`;

export const formatINRRounded = (value: number): string =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export const formatTimestamp = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

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

export const digitsOnly = (raw: string): string =>
  raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

const WORDS_ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
] as const;
const WORDS_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"] as const;

const underHundred = (n: number): string =>
  n < 20 ? WORDS_ONES[n] : `${WORDS_TENS[Math.floor(n / 10)]}${n % 10 ? `-${WORDS_ONES[n % 10]}` : ""}`;

const underThousand = (n: number): string => {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${WORDS_ONES[hundreds]} hundred` : "", rest ? underHundred(rest) : ""]
    .filter(Boolean)
    .join(" ");
};

export const numberToWords = (value: number): string => {
  const n = Math.floor(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < 100) return underHundred(n);
  if (n < 1000) return underThousand(n);
  if (n < 100000) return `${underThousand(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${underThousand(n % 1000)}` : ""}`;
  if (n < 10000000) return `${underHundred(Math.floor(n / 100000))} lakh${n % 100000 ? ` ${numberToWords(n % 100000)}` : ""}`;
  return `${numberToWords(Math.floor(n / 10000000))} crore${n % 10000000 ? ` ${numberToWords(n % 10000000)}` : ""}`;
};

export const amountInWords = (value: number): string => {
  const words = numberToWords(value);
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "";
};

export const formatIndianNumber = (raw: string): string => {
  const digits = digitsOnly(raw);
  if (!digits) return "";
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  return rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}` : last3;
};

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
