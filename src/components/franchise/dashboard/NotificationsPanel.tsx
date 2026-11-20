import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import {
  NOTIFICATION_ICON,
  formatDateTime,
  relativeTime,
  useFranchiseNotifications,
  type NotificationTarget,
} from "./franchiseNotifications";
import type { FranchiseCustomer, FranchiseCustomerLoan } from "../../../api/franchiseCustomers";

interface NotificationsPanelProps {
  loans: FranchiseCustomerLoan[];
  customers: FranchiseCustomer[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
  readIds: string[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: (ids: string[]) => void;
  onOpenSection: (target: NotificationTarget) => void;
}

const NotificationsPanel = ({
  loans,
  customers,
  loading,
  error,
  onReload,
  readIds,
  onMarkRead,
  onMarkAllRead,
  onOpenSection,
}: NotificationsPanelProps) => {
  const items = useFranchiseNotifications(loans, customers);
  const readSet = new Set(readIds);
  const unreadCount = items.filter((item) => !readSet.has(item.id)).length;

  return (
    <section aria-labelledby="notifications-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 id="notifications-heading" className="text-[15px] font-extrabold text-slate-800">
            All notifications
          </h2>
          <p className="mt-0.5 text-[11.5px] text-slate-500">
            {items.length === 0
              ? "Customer registrations and loan status changes appear here."
              : `${items.length} notification${items.length === 1 ? "" : "s"} · ${unreadCount} unread`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMarkAllRead(items.map((item) => item.id))}
          disabled={unreadCount === 0 || items.length === 0}
        >
          Mark all as read
        </Button>
      </div>

      {error ? (
        <div className="px-5 py-6">
          <p role="alert" className="text-[12.5px] font-semibold text-red-700">{error}</p>
          <Button variant="link" size="sm" onClick={onReload}>Try again</Button>
        </div>
      ) : loading && items.length === 0 ? (
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
          <p className="mt-3 text-[13px] font-bold text-slate-700">No notifications yet</p>
          <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-slate-500">
            Register a customer or file a loan and every change will be listed here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            const unread = !readSet.has(item.id);
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                style={unread ? { background: "rgba(6,106,156,0.035)" } : undefined}
              >
                <button
                  type="button"
                  onClick={() => {
                    onMarkRead(item.id);
                    onOpenSection(item.target);
                  }}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
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
                      {unread && (
                        <>
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: "var(--brand-teal)" }}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Unread</span>
                        </>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-slate-500">{item.detail}</span>
                    <span className="mt-1 block text-[10.5px] font-semibold text-slate-400">
                      {formatDateTime(item.at)} · {relativeTime(item.at)}
                    </span>
                  </span>
                </button>

                {unread && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(item.id)}
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
    </section>
  );
};

export default NotificationsPanel;
