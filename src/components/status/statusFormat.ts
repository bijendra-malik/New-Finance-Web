import { formatMoney } from "../../utils/formatters";

export const formatInr = (amount?: number | null): string | undefined =>
  formatMoney(amount, { maximumFractionDigits: 0 });

export interface StatusTone {
  label: string;
  className: string;
}

const TONES = {
  positive: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  negative: "bg-red-50 text-red-700 ring-1 ring-red-200",
  waiting: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
} as const;

export const statusTone = (raw?: string | null): StatusTone => {
  const label = raw?.trim() || "Status unavailable";
  const key = label.toLowerCase();

  if (/(approv|active|verif|disburs|sanction|complete|success|paid|issued)/.test(key)) {
    return { label, className: TONES.positive };
  }
  if (/(reject|declin|fail|cancel|suspend|expired|closed)/.test(key)) {
    return { label, className: TONES.negative };
  }
  if (/(pending|review|process|progress|submitted|await|hold|applied)/.test(key)) {
    return { label, className: TONES.waiting };
  }
  return { label, className: TONES.neutral };
};

export const titleCase = (value?: string | null): string => {
  if (!value) return "";
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
