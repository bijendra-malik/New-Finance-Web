import { useMemo, useState } from "react";
import { formatDate } from "./franchiseFormat";
import { LOAN_PRODUCTS } from "../../../pages/franchise/loan-forms/loanCatalogue";
import type { FranchiseNotificationOutcome } from "../../../api/franchiseNotifications";
import type { FranchiseIconName } from "../FranchiseIcon";

export type NotificationTarget = "loans" | "customers";

export type NotificationKind = "loan" | "customer" | "other";

export const NOTIFICATION_ICON: Record<NotificationKind, FranchiseIconName> = {
  loan: "layers",
  customer: "user-plus",
  other: "bell",
};

export interface NotificationTone {
  background: string;
  border: string;
  color: string;
  dot: string;
  tint: string;
}

export const NOTIFICATION_TONE: Record<FranchiseNotificationOutcome, NotificationTone> = {
  positive: {
    background: "#e9f7f2",
    border: "#bde6d8",
    color: "#0f766e",
    dot: "#26ae90",
    tint: "rgba(38,174,144,0.06)",
  },
  negative: {
    background: "#fef2f2",
    border: "#f5c6c6",
    color: "#b3261e",
    dot: "#ef4444",
    tint: "rgba(239,68,68,0.05)",
  },
  pending: {
    background: "#fff8e6",
    border: "#f2e2b6",
    color: "#8a5a00",
    dot: "#e0a800",
    tint: "rgba(224,168,0,0.07)",
  },
  neutral: {
    background: "rgba(6,106,156,0.10)",
    border: "rgba(6,106,156,0.22)",
    color: "#0b5e86",
    dot: "#066a9c",
    tint: "rgba(6,106,156,0.05)",
  },
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

/**
 * Display label for the product the API names on a notification (it sends keys
 * such as `creditCard` or `vehicleLoan`). Unknown values are shown as-is.
 */
export const productLabel = (raw?: string): string | undefined => {
  const value = (raw ?? "").trim();
  if (!value) return undefined;
  const slug = value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
  const known = LOAN_PRODUCTS.find(
    (product) => product.key === slug || product.name.toLowerCase() === value.toLowerCase(),
  );
  return known ? known.name : value;
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

export const monthKeyOf = (iso?: string): string => {
  const time = timeValue(iso);
  if (!time) return "";
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export interface NotificationReadState {
  ids: string[];
  all?: string;
  months: Record<string, string>;
}

export interface ReadableNotification {
  id: string;
  at?: string;
  isRead?: boolean;
}

export const notificationIsRead = (
  state: NotificationReadState,
  item: ReadableNotification,
): boolean => {
  if (item.isRead || state.ids.includes(item.id)) return true;
  const at = timeValue(item.at);
  if (!at) return false;
  if (state.all && timeValue(state.all) >= at) return true;
  const month = monthKeyOf(item.at);
  return Boolean(month && state.months[month]);
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

const emptyReadState = (): NotificationReadState => ({ ids: [], months: {} });

const readStoredState = (franchiseId: string): NotificationReadState => {
  if (!franchiseId) return emptyReadState();
  try {
    const raw = localStorage.getItem(`${READ_KEY_PREFIX}${franchiseId}`);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (isStringArray(parsed)) return { ids: parsed, months: {} };
    if (!parsed || typeof parsed !== "object") return emptyReadState();

    const record = parsed as Record<string, unknown>;
    const months: Record<string, string> = {};
    if (record.months && typeof record.months === "object" && !Array.isArray(record.months)) {
      for (const [month, at] of Object.entries(record.months as Record<string, unknown>)) {
        if (typeof at === "string") months[month] = at;
      }
    }
    return {
      ids: isStringArray(record.ids) ? record.ids : [],
      all: typeof record.all === "string" ? record.all : undefined,
      months,
    };
  } catch {
    return emptyReadState();
  }
};

const writeStoredState = (franchiseId: string, state: NotificationReadState): void => {
  if (!franchiseId) return;
  try {
    localStorage.setItem(
      `${READ_KEY_PREFIX}${franchiseId}`,
      JSON.stringify({ ...state, ids: state.ids.slice(-MAX_STORED_IDS) }),
    );
  } catch {
    // a full browser should not break the dashboard
  }
};

export const useNotificationReadState = (franchiseId: string) => {
  const [sessionReads, setSessionReads] = useState<Record<string, NotificationReadState>>({});

  const readState = useMemo(
    () => sessionReads[franchiseId] ?? readStoredState(franchiseId),
    [sessionReads, franchiseId],
  );

  const remember = (next: NotificationReadState) => {
    writeStoredState(franchiseId, next);
    setSessionReads((prev) => ({ ...prev, [franchiseId]: next }));
  };

  const markRead = (id: string) => {
    if (!id || readState.ids.includes(id)) return;
    remember({ ...readState, ids: [...readState.ids, id] });
  };

  const markAllRead = (month?: string) => {
    const at = new Date().toISOString();
    if (month) {
      remember({ ...readState, months: { ...readState.months, [month]: at } });
      return;
    }
    remember({ ...readState, all: at });
  };

  return { readState, markRead, markAllRead };
};
