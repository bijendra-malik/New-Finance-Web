import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import {
  NOTIFICATION_ICON,
  NOTIFICATION_TONE,
  formatDateTime,
  notificationIsRead,
  productLabel,
  relativeTime,
  type NotificationReadState,
  type NotificationTarget,
} from "./franchiseNotifications";
import { formatDate } from "./franchiseFormat";
import {
  fetchFranchiseNotifications,
  fetchFranchiseNotificationsForMonth,
  type FranchiseNotificationItem,
} from "../../../api/franchiseNotifications";
import { useNotificationActions } from "./useNotificationActions";

interface NotificationsPanelProps {
  readState: NotificationReadState;
  onMarkRead: (id: string) => void;
  onMarkAllRead: (month?: string) => void;
  onOpenSection: (target: NotificationTarget) => void;
}

interface PanelView {
  items: FranchiseNotificationItem[];
  total: number;
  totalPages: number;
  hasNext: boolean;
  page: number;
}

const PAGE_SIZE = 10;

const MONTH_LABEL = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" });

/** `YYYY-MM` values and labels for the current month and the eleven before it. */
const monthOptions = (): { value: string; label: string }[] => {
  const options: { value: string; label: string }[] = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let offset = 0; offset < 12; offset += 1) {
    const value = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    options.push({ value, label: MONTH_LABEL.format(cursor) });
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return options;
};

const CONTROL =
  "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)";

const NotificationsPanel = ({
  readState,
  onMarkRead,
  onMarkAllRead,
  onOpenSection,
}: NotificationsPanelProps) => {
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("");
  const [data, setData] = useState<PanelView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  /** Every key of the selected month, so its bulk mark covers all of it. */
  const [monthKeys, setMonthKeys] = useState<string[]>([]);
  const {
    pendingIds,
    markingAll,
    error: actionError,
    markRead,
    markSelectedRead,
    markAllRead,
  } = useNotificationActions({ onMarkRead, onMarkAllRead });

  useEffect(() => {
    let active = true;
    void (async () => {
      if (month) {
        // Month view: the whole month is loaded, then paged here, so the filter
        // works even when the API returns every notification.
        const res = await fetchFranchiseNotificationsForMonth(month);
        if (!active) return;
        if (!res.ok) {
          setError(res.message);
        } else {
          const totalPages = Math.max(1, Math.ceil(res.items.length / PAGE_SIZE));
          const safePage = Math.min(page, totalPages);
          setMonthKeys(res.items.map((item) => item.id));
          setData({
            items: res.items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
            total: res.items.length,
            totalPages,
            hasNext: safePage < totalPages,
            page: safePage,
          });
          setError(null);
          if (safePage !== page) setPage(safePage);
        }
        setLoading(false);
        return;
      }

      const res = await fetchFranchiseNotifications({ page, limit: PAGE_SIZE });
      if (!active) return;
      if (res.ok) {
        setMonthKeys([]);
        setData({
          items: res.page.items,
          total: res.page.total,
          totalPages: Math.max(1, res.page.totalPages),
          hasNext: res.page.hasNext,
          page: res.page.page,
        });
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [page, month, reloadToken]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const hasNext = data?.hasNext ?? page < totalPages;

  const unreadCount = items.filter((item) => !notificationIsRead(readState, item)).length;

  const goToPage = (next: number) => {
    if (next === page) return;
    setLoading(true);
    setPage(next);
  };

  const changeMonth = (value: string) => {
    setLoading(true);
    setMonth(value);
    setPage(1);
  };

  const handleMarkAll = () => {
    if (markingAll) return;
    // read-all marks everything and ignores a month, so a month view marks its
    // own keys through /read instead.
    if (month) {
      void markSelectedRead(monthKeys, month);
      return;
    }
    void markAllRead();
  };

  const reload = () => {
    setLoading(true);
    setReloadToken((token) => token + 1);
  };

  const summary = (() => {
    if (loading && !data) return "Loading your notifications…";
    if (error) return "Notifications could not be loaded.";
    if (total === 0) {
      return month
        ? "Nothing was recorded under your franchise in this month."
        : "Customer registrations and loan status changes appear here.";
    }
    const unread = unreadCount > 0 ? ` · ${unreadCount} unread on this page` : "";
    return `${total} notification${total === 1 ? "" : "s"}${unread}`;
  })();

  return (
    <section aria-labelledby="notifications-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-100 px-5 py-3.5">
        <div className="min-w-0">
          <h2 id="notifications-heading" className="text-[15px] font-extrabold text-slate-800">
            All notifications
          </h2>
          <p className="mt-0.5 text-[11.5px] text-slate-500">{summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {loading && data && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Updating…
            </span>
          )}
          <label className="flex items-center gap-1.5">
            <span className="sr-only">Filter by month</span>
            <select
              value={month}
              onChange={(event) => changeMonth(event.target.value)}
              className={CONTROL}
            >
              <option value="">All months</option>
              {monthOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAll}
            disabled={unreadCount === 0 || items.length === 0 || markingAll}
          >
            {markingAll ? "Marking…" : "Mark all as read"}
          </Button>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-2 text-[12px] font-semibold text-red-700">
          {actionError}
        </p>
      )}

      {error ? (
        <div className="px-5 py-6" role="alert">
          <p className="text-[12.5px] font-semibold text-red-700">{error}</p>
          <Button variant="link" size="sm" onClick={reload}>Try again</Button>
        </div>
      ) : loading && !data ? (
        <p className="flex items-center gap-2 px-5 py-8 text-[12.5px] font-semibold text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
          Loading notifications…
        </p>
      ) : items.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <span
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
            aria-hidden="true"
          >
            <FranchiseIcon name="bell" className="h-5 w-5" />
          </span>
          <p className="mt-3 text-[13px] font-bold text-slate-700">
            {month ? "No notifications in this month" : "No notifications yet"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-slate-500">
            {month
              ? "Pick another month or switch to all months to see the rest."
              : "Register a customer or file a loan and every change will be listed here."}
          </p>
          {month && (
            <button
              type="button"
              onClick={() => changeMonth("")}
              className="mt-2 text-[12px] font-bold text-(--brand-navy) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
            >
              Show all months
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            const unread = !notificationIsRead(readState, item);
            const tone = NOTIFICATION_TONE[item.outcome];
            const product = productLabel(item.product);
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                style={
                  unread
                    ? { background: tone.tint, boxShadow: `inset 3px 0 0 ${tone.dot}` }
                    : undefined
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    void markRead(item.id);
                    onOpenSection(item.target);
                  }}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: tone.background,
                      border: `1px solid ${tone.border}`,
                      color: tone.color,
                    }}
                    aria-hidden="true"
                  >
                    <FranchiseIcon name={NOTIFICATION_ICON[item.kind]} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[13px] ${unread ? "font-extrabold text-slate-800" : "font-semibold text-slate-600"}`}
                      >
                        {item.title}
                      </span>
                      {product && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.06em]"
                          style={{ background: tone.background, border: `1px solid ${tone.border}`, color: tone.color }}
                        >
                          {product}
                        </span>
                      )}
                      {unread && (
                        <>
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: tone.dot }}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Unread</span>
                        </>
                      )}
                    </span>
                    {item.detail && (
                      <span className="mt-0.5 block truncate text-[12px] text-slate-500">{item.detail}</span>
                    )}
                    <span className="mt-1 block text-[10.5px] font-semibold text-slate-400">
                      {relativeTime(item.at) === formatDate(item.at)
                        ? formatDateTime(item.at)
                        : `${formatDateTime(item.at)} · ${relativeTime(item.at)}`}
                    </span>
                  </span>
                </button>

                {unread && (
                  <button
                    type="button"
                    onClick={() => void markRead(item.id)}
                    disabled={pendingIds.includes(item.id)}
                    title="Mark as read"
                    aria-label={`Mark “${item.title}” as read`}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-(--brand-teal-14) hover:text-(--brand-navy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!error && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
          <p className="text-[11.5px] font-semibold text-slate-500">
            Page {page} of {totalPages} · {total} notification{total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={!hasNext || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NotificationsPanel;
