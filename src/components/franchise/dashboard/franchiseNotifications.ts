import { useMemo, useState } from "react";
import {
  formatDate,
  loanApplicationNo,
  loanCustomerName,
  loanProductName,
  loanStatus,
  loanSubmittedAt,
  loanUpdatedAt,
} from "./franchiseFormat";
import type { FranchiseCustomer, FranchiseCustomerLoan } from "../../../api/franchiseCustomers";
import type { FranchiseIconName } from "../FranchiseIcon";

/** The dashboard section a notification opens. */
export type NotificationTarget = "loans" | "customers";

export type NotificationKind = "loan" | "customer";

export interface FranchiseNotification {
  id: string;
  kind: NotificationKind;
  target: NotificationTarget;
  title: string;
  detail: string;
  at?: string;
}

export const NOTIFICATION_ICON: Record<NotificationKind, FranchiseIconName> = {
  loan: "layers",
  customer: "user-plus",
};

const READ_KEY_PREFIX = "indexia_franchise_updates_read:";
const MAX_STORED_IDS = 200;

export const timeValue = (iso?: string): number => {
  if (!iso) return 0;
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const relativeTime = (iso?: string): string => {
  const time = timeValue(iso);
  if (!time) return "";
  const diff = Date.now() - time;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 172_800_000) return "Yesterday";
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return formatDate(iso);
};

/** Absolute timestamp for the full notifications list, e.g. "20 Nov 2026, 4:12 pm". */
export const formatDateTime = (iso?: string): string => {
  const time = timeValue(iso);
  if (!time) return "—";
  return new Date(time).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/** Every notification for this franchise, newest first. */
export const buildFranchiseNotifications = (
  loans: FranchiseCustomerLoan[],
  customers: FranchiseCustomer[],
): FranchiseNotification[] => {
  const loanNotifications: FranchiseNotification[] = loans.map((loan) => ({
    id: `loan-${loanApplicationNo(loan)}`,
    kind: "loan",
    target: "loans",
    title: `${loanProductName(loan)} · ${loanStatus(loan)}`,
    detail: [loanCustomerName(loan), loanApplicationNo(loan)].filter(Boolean).join(" · "),
    at: loanUpdatedAt(loan) ?? loanSubmittedAt(loan),
  }));

  const customerNotifications: FranchiseNotification[] = customers.map((customer) => ({
    id: `customer-${customer._id}`,
    kind: "customer",
    target: "customers",
    title: "New customer registered",
    detail: [customer.fullName, customer.mobile].filter(Boolean).join(" · "),
    at: customer.createdAt,
  }));

  return [...loanNotifications, ...customerNotifications]
    .filter((item) => timeValue(item.at) > 0)
    .sort((a, b) => timeValue(b.at) - timeValue(a.at));
};

export const useFranchiseNotifications = (
  loans: FranchiseCustomerLoan[],
  customers: FranchiseCustomer[],
): FranchiseNotification[] =>
  useMemo(() => buildFranchiseNotifications(loans, customers), [loans, customers]);

const readStoredIds = (franchiseId: string): string[] => {
  if (!franchiseId) return [];
  try {
    const raw = localStorage.getItem(`${READ_KEY_PREFIX}${franchiseId}`);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const writeStoredIds = (franchiseId: string, ids: string[]): void => {
  if (!franchiseId) return;
  try {
    localStorage.setItem(`${READ_KEY_PREFIX}${franchiseId}`, JSON.stringify(ids.slice(-MAX_STORED_IDS)));
  } catch {
    // a full browser should not break the dashboard
  }
};

/**
 * Read state shared by the bell and the Notifications section. The stored list is the
 * starting point; ids marked during this session are kept per franchise in state.
 */
export const useNotificationReadState = (franchiseId: string) => {
  const [sessionReads, setSessionReads] = useState<Record<string, string[]>>({});

  const readIds = useMemo(
    () => sessionReads[franchiseId] ?? readStoredIds(franchiseId),
    [sessionReads, franchiseId],
  );

  const remember = (next: string[]) => {
    writeStoredIds(franchiseId, next);
    setSessionReads((prev) => ({ ...prev, [franchiseId]: next }));
  };

  const markRead = (id: string) => {
    if (readIds.includes(id)) return;
    remember([...readIds, id]);
  };

  const markAllRead = (ids: string[]) => {
    const next = Array.from(new Set([...readIds, ...ids]));
    if (next.length === readIds.length) return;
    remember(next);
  };

  return { readIds, markRead, markAllRead };
};
