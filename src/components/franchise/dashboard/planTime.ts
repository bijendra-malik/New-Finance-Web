// Tenure math for the franchisee dashboard's current plan.
//
// The franchise service reports the plan a partner is on (duration in months)
// and the dates around the agreement. Nothing reports an explicit expiry date,
// so the window is derived from the agreement start plus the plan term, with
// the day clamped for short months (e.g. 31 Jan + 1 month → 28/29 Feb).

import type { FranchiseAccount } from "../../../api/franchise";

type Profile = FranchiseAccount | null;

const DAY = 86_400_000;

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Add whole months to a date without rolling into the next month. */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date.getTime());
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
};

/** The day this agreement started, from the most specific date reported. */
export const planStartDate = (profile: Profile): Date | null =>
  parseDate(profile?.franchiseApprovedAt) ??
  parseDate(profile?.franchiseAppliedAt) ??
  parseDate(profile?.createdAt);

export interface PlanWindow {
  startISO?: string;
  endISO?: string;
  months: number;
  /** Whole days left; negative once the term has ended. */
  daysLeft?: number;
  totalDays?: number;
  /** Share of the term already used, clamped to 0–100. */
  percentUsed: number;
  known: boolean;
}

/**
 * The current plan's term window. `months` accepts the plan term resolved from
 * the published catalogue when the profile does not carry it.
 */
export const planWindow = (profile: Profile, months?: number, now: Date = new Date()): PlanWindow => {
  const term = months && months > 0 ? months : profile?.plan?.durationMonths ?? 0;
  const start = planStartDate(profile);
  if (!start || term <= 0) return { months: term, percentUsed: 0, known: false };

  const end = addMonths(start, term);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY));
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / DAY);
  const elapsed = totalDays - Math.max(0, daysLeft);
  const percentUsed = Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));

  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
    months: term,
    daysLeft,
    totalDays,
    percentUsed,
    known: true,
  };
};

/** Readable tenure left, e.g. "132 days left" or "3 months left". */
export const remainingLabel = (window: PlanWindow): string | null => {
  if (!window.known || window.daysLeft === undefined) return null;
  if (window.daysLeft <= 0) return "Term ended";
  if (window.daysLeft === 1) return "1 day left";
  if (window.daysLeft < 45) return `${window.daysLeft} days left`;
  const monthsLeft = Math.floor(window.daysLeft / 30);
  const extraDays = window.daysLeft % 30;
  if (monthsLeft < 12) {
    return extraDays > 5 ? `${monthsLeft} months ${extraDays} days left` : `${monthsLeft} months left`;
  }
  return "More than a year left";
};

export const isPlanOver = (window: PlanWindow): boolean =>
  window.known && (window.daysLeft ?? 0) <= 0;

/** True when the published plan row is the partner's current plan. */
export const isCurrentCataloguePlan = (
  plan: { id: string; name: string; months: number },
  profile: Profile,
): boolean => {
  const code = (profile?.plan?.code ?? profile?.plan?.plan)?.trim().toLowerCase();
  const name = profile?.plan?.name?.trim().toLowerCase();
  if (code && plan.id.trim().toLowerCase() === code) return true;
  if (name && plan.name.trim().toLowerCase() === name) return true;
  const months = profile?.plan?.durationMonths;
  return Boolean(months && months === plan.months);
};
