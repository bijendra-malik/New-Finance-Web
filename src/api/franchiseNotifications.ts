import axiosInstance from "./axiosInstance";
import { franchisePortalError } from "./franchiseCustomers";
import { asRecord } from "../utils/objects";

// ── Types ────────────────────────────────────────────────────────────────────

type FranchiseNotificationKind = "loan" | "customer" | "other";
type FranchiseNotificationTarget = "loans" | "customers";
export type FranchiseNotificationOutcome = "positive" | "negative" | "pending" | "neutral";

export interface FranchiseNotificationItem {
  id: string;
  title: string;
  detail: string;
  product?: string;
  at?: string;
  kind: FranchiseNotificationKind;
  outcome: FranchiseNotificationOutcome;
  target: FranchiseNotificationTarget;
  isRead: boolean;
}

interface FranchiseNotificationPage {
  items: FranchiseNotificationItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  unread?: number;
}

interface FranchiseNotificationQuery {
  page: number;
  limit: number;
  month?: string;
}

type Row = Record<string, unknown>;

// ── Field readers ────────────────────────────────────────────────────────────

const pickString = (record: Row | null, keys: readonly string[]): string | undefined => {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
};

const pickNumber = (record: Row | null, keys: readonly string[]): number | undefined => {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
};

const pickBoolean = (record: Row | null, keys: readonly string[]): boolean | undefined => {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
    if (value === 1 || value === 0) return value === 1;
  }
  return undefined;
};

// ── Row mapping ──────────────────────────────────────────────────────────────

const kindFrom = (type: string | undefined): FranchiseNotificationKind => {
  const normalized = (type ?? "").toLowerCase();
  if (/customer|client|kyc|registration|profile/.test(normalized)) return "customer";
  // "loan_status" and friends. "franchise_application" is not a loan event.
  if (/loan|disbur|sanction|emi|repay|collection/.test(normalized)) return "loan";
  return "other";
};

const outcomeFrom = (kind: string | undefined, status: string | undefined): FranchiseNotificationOutcome => {
  const value = `${kind ?? ""} ${status ?? ""}`.toLowerCase();
  if (/reject|declin|cancel|fail|expired|overdue|default/.test(value)) return "negative";
  if (/approv|sanction|disbur|complete|closed|success|active|verified/.test(value)) return "positive";
  if (/submit|pending|review|process|progress|new|hold|await|reminder|renew/.test(value)) return "pending";
  return "neutral";
};

const NESTED_KEYS = [
  "product",
  "loan",
  "loanDetails",
  "application",
  "applicationDetails",
  "meta",
  "data",
];
const DEEP_KEYS = ["product", "loan", "productDetails", "loanProduct"];

const nestedRecords = (row: Row): (Row | null)[] => {
  const records: (Row | null)[] = [row];
  for (const key of NESTED_KEYS) {
    const nested = asRecord(row[key]);
    if (!nested) continue;
    records.push(nested);
    for (const deepKey of DEEP_KEYS) {
      const deep = asRecord(nested[deepKey]);
      if (deep) records.push(deep);
    }
  }
  return records;
};

const productFrom = (row: Row): string | undefined => {
  const direct = pickString(row, [
    "productName",
    "product_name",
    "productLabel",
    "product",
    "loanProduct",
    "productType",
    "loanType",
    "loanName",
    "scheme",
    "productKey",
  ]);
  if (direct) return direct;

  for (const record of nestedRecords(row).slice(1)) {
    const value = pickString(record, [
      "productName",
      "product_name",
      "loanProduct",
      "loanType",
      "loanName",
      "product",
      "name",
      "title",
      "label",
    ]);
    if (value) return value;
  }
  return undefined;
};

const toItem = (value: unknown, index: number): FranchiseNotificationItem | null => {
  const row = asRecord(value);
  if (!row) return null;

  const detail =
    pickString(row, ["message", "body", "description", "detail", "text", "remark"]) ?? "";
  const title =
    pickString(row, ["title", "heading", "subject", "label", "notificationTitle"]) ??
    detail;
  if (!title) return null;

  const id =
    pickString(row, [
      "key",
      "notificationKey",
      "_id",
      "id",
      "notificationId",
      "notification_id",
      "alertId",
    ]) ?? `notification-${index}`;

  const kind = kindFrom(
    pickString(row, ["type", "category", "event", "kind", "notificationType", "eventType"]),
  );
  const payloads = [asRecord(row.data), asRecord(row.payload), asRecord(row.details)].filter(
    (record): record is Row => record !== null,
  );
  const status = payloads
    .map((record) => pickString(record, ["status", "loanStatus", "state"]))
    .find(Boolean);
  const outcome = outcomeFrom(
    pickString(row, ["kind", "outcome", "result", "eventKind"]),
    status ?? pickString(row, ["status", "loanStatus"]),
  );

  const target: FranchiseNotificationTarget =
    kind === "customer"
      ? "customers"
      : kind === "loan"
        ? "loans"
        : /customer|client/i.test(pickString(row, ["section", "target", "link", "url"]) ?? "")
          ? "customers"
          : "loans";

  return {
    id,
    title,
    detail: detail === title ? "" : detail,
    product: productFrom(row) ?? undefined,
    at:
      pickString(row, ["createdAt", "timestamp", "date", "time", "occurredAt", "updatedAt"]) ??
      undefined,
    kind,
    outcome,
    target,
    isRead: pickBoolean(row, ["isRead", "read", "seen", "isSeen"]) ?? false,
  };
};

// ── Response unwrap ──────────────────────────────────────────────────────────

const LIST_KEYS = ["notifications", "items", "results", "rows", "data", "list", "records"];

const listFrom = (body: Row | null): unknown[] | null => {
  if (!body) return null;
  const candidates: unknown[] = [body, body.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    const record = asRecord(candidate);
    if (!record) continue;
    for (const key of LIST_KEYS) {
      const value = record[key];
      if (Array.isArray(value)) return value;
      const nested = asRecord(value);
      if (nested) {
        for (const nestedKey of LIST_KEYS) {
          if (Array.isArray(nested[nestedKey])) return nested[nestedKey] as unknown[];
        }
      }
    }
  }
  return null;
};

const metaCandidates = (body: Row | null): (Row | null)[] => {
  if (!body) return [];
  const data = asRecord(body.data);
  return [
    asRecord(body.pagination),
    asRecord(body.meta),
    asRecord(data?.pagination),
    asRecord(data?.meta),
    data,
    body,
  ];
};

const numberFromMeta = (candidates: (Row | null)[], keys: readonly string[]): number | undefined => {
  for (const candidate of candidates) {
    const value = pickNumber(candidate, keys);
    if (value !== undefined) return value;
  }
  return undefined;
};

const booleanFromMeta = (candidates: (Row | null)[], keys: readonly string[]): boolean | undefined => {
  for (const candidate of candidates) {
    const value = pickBoolean(candidate, keys);
    if (value !== undefined) return value;
  }
  return undefined;
};

// ── API call ─────────────────────────────────────────────────────────────────

/**
 * One page of this franchise's notifications, newest first.
 * GET /franchise/notifications?page=1&limit=10&month=YYYY-MM
 */
export const fetchFranchiseNotifications = async (
  query: FranchiseNotificationQuery,
): Promise<{ ok: true; page: FranchiseNotificationPage } | { ok: false; message: string }> => {
  const { page, limit, month } = query;
  try {
    const res = await axiosInstance.get<Record<string, unknown>>("/franchise/notifications", {
      params: {
        page,
        limit,
        ...(month ? { month } : {}),
      },
    });

    const body = asRecord(res.data);
    if (body && body.success === false) {
      return {
        ok: false,
        message: pickString(body, ["message"]) || "The notifications could not be loaded.",
      };
    }

    const rows = listFrom(body);
    if (!rows) {
      return {
        ok: false,
        message: pickString(body, ["message"]) || "The notifications were not returned.",
      };
    }

    const items = rows
      .map((row, index) => toItem(row, index))
      .filter((item): item is FranchiseNotificationItem => item !== null);

    const meta = metaCandidates(body);
    // Without a reported total, the rows seen so far are the only safe lower bound.
    const total =
      numberFromMeta(meta, ["total", "totalCount", "totalItems", "totalRecords", "count"]) ??
      (page - 1) * limit + items.length;
    const totalPages =
      numberFromMeta(meta, ["totalPages", "totalPage", "pages", "lastPage"]) ??
      Math.max(1, Math.ceil(total / limit));
    const hasNext =
      booleanFromMeta(meta, ["hasNext", "hasNextPage", "hasMore"]) ?? page < totalPages;
    const unread = numberFromMeta(meta, [
      "unread",
      "unreadCount",
      "totalUnread",
      "unreadItems",
      "unreadNotifications",
    ]);

    return {
      ok: true,
      page: {
        items,
        page: numberFromMeta(meta, ["page", "currentPage"]) ?? page,
        limit: numberFromMeta(meta, ["limit", "perPage", "pageSize"]) ?? limit,
        total,
        totalPages,
        hasNext,
        ...(unread !== undefined ? { unread } : {}),
      },
    };
  } catch (err) {
    return {
      ok: false,
      message: franchisePortalError(err, "Could not load your notifications."),
    };
  }
};

const postNoContent = async (
  url: string,
  body: Record<string, unknown>,
  fallback: string,
): Promise<{ ok: true } | { ok: false; message: string }> => {
  try {
    const res = await axiosInstance.post<Record<string, unknown>>(url, body);
    const payload = asRecord(res.data);
    if (payload && payload.success === false) {
      return {
        ok: false,
        message: pickString(payload, ["message"]) || fallback,
      };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: franchisePortalError(err, fallback) };
  }
};

/**
 * Mark these notifications read. POST /franchise/notifications/read
 * The body is `{ keys: [...] }` — a bare `notificationId` is accepted but marks nothing.
 */
export const markFranchiseNotificationsRead = (
  keys: string[],
): Promise<{ ok: true } | { ok: false; message: string }> =>
  postNoContent(
    "/franchise/notifications/read",
    { keys },
    "Could not mark the notification as read.",
  );

/**
 * Mark every notification read. POST /franchise/notifications/read-all
 * The backend ignores a month here (it marks everything), so a month-scoped
 * bulk mark goes through /read with that month's keys instead.
 */
export const markAllFranchiseNotificationsRead = (): Promise<
  { ok: true } | { ok: false; message: string }
> =>
  postNoContent(
    "/franchise/notifications/read-all",
    {},
    "Could not mark the notifications as read.",
  );

// ── Bell summary ─────────────────────────────────────────────────────────────

export interface FranchiseNotificationSummary {
  /** The newest notifications, for the bell's preview list. */
  items: FranchiseNotificationItem[];
  total: number;
  unread: number;
}

const BADGE_CAP = 10;
const SUMMARY_PAGE_SIZE = 100;
const MAX_SUMMARY_PAGES = 5;

export const fetchFranchiseNotificationBell = async (
  previewCount: number,
): Promise<{ ok: true; data: FranchiseNotificationSummary } | { ok: false; message: string }> => {
  const first = await fetchFranchiseNotifications({ page: 1, limit: previewCount });
  if (!first.ok) return first;

  const { items, total, hasNext, page: firstPage } = first.page;
  let unread = first.page.unread ?? items.filter((item) => !item.isRead).length;

  if (first.page.unread === undefined) {
    let page = firstPage;
    let more = hasNext;
    let guard = 0;
    while (more && unread < BADGE_CAP && guard < MAX_SUMMARY_PAGES) {
      guard += 1;
      const next = await fetchFranchiseNotifications({
        page: page + 1,
        limit: SUMMARY_PAGE_SIZE,
      });
      if (!next.ok) break;
      unread += next.page.items.filter((item) => !item.isRead).length;
      page = next.page.page > page ? next.page.page : page + 1;
      more = next.page.hasNext;
    }
  }

  return { ok: true, data: { items, total: Math.max(total, items.length), unread } };
};

// ── Month filter ─────────────────────────────────────────────────────────────

const MONTH_PAGE_SIZE = 100;
const MAX_MONTH_PAGES = 5;

const monthOf = (iso?: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

/**
 * Every notification of one `YYYY-MM` month, newest first. The month is both sent to
 * the API and applied locally, so the filter still works if the API ignores the
 * parameter; paging stops once rows older than the month are reached.
 */
export const fetchFranchiseNotificationsForMonth = async (
  month: string,
): Promise<{ ok: true; items: FranchiseNotificationItem[] } | { ok: false; message: string }> => {
  const collected: FranchiseNotificationItem[] = [];
  const seen = new Set<string>();
  let page = 1;
  let reachedOlder = false;

  for (let guard = 0; guard < MAX_MONTH_PAGES && !reachedOlder; guard += 1) {
    const res = await fetchFranchiseNotifications({ page, limit: MONTH_PAGE_SIZE, month });
    if (!res.ok) return res;

    const rows = res.page.items;
    for (const item of rows) {
      const key = monthOf(item.at);
      if (key === month) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          collected.push(item);
        }
      } else if (key && key < month) {
        reachedOlder = true;
      }
    }

    if (reachedOlder || !res.page.hasNext || rows.length === 0) break;
    page = res.page.page > page ? res.page.page : page + 1;
  }

  return { ok: true, items: collected };
};
