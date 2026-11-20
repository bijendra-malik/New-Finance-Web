import { useEffect, useRef, useState } from "react";
import FranchiseIcon from "../FranchiseIcon";
import {
  NOTIFICATION_ICON,
  relativeTime,
  useFranchiseNotifications,
  type NotificationTarget,
} from "./franchiseNotifications";
import type { FranchiseCustomer, FranchiseCustomerLoan } from "../../../api/franchiseCustomers";

const PREVIEW_COUNT = 10;

interface NotificationBellProps {
  loans: FranchiseCustomerLoan[];
  customers: FranchiseCustomer[];
  readIds: string[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: (ids: string[]) => void;
  onOpenSection: (target: NotificationTarget) => void;
  onViewAll: () => void;
}

const NotificationBell = ({
  loans,
  customers,
  readIds,
  onMarkRead,
  onMarkAllRead,
  onOpenSection,
  onViewAll,
}: NotificationBellProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = useFranchiseNotifications(loans, customers).slice(0, PREVIEW_COUNT);
  const readSet = new Set(readIds);
  const unreadCount = items.filter((item) => !readSet.has(item.id)).length;

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggle = () => setOpen((wasOpen) => !wasOpen);

  const goTo = (target: NotificationTarget) => {
    setOpen(false);
    onOpenSection(target);
  };

  const bellIcon = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4.5 w-4.5"
      aria-hidden="true"
    >
      <path d="M6 9a6 6 0 0 1 12 0c0 4.2 1.4 5.7 2 6.2.4.4.2 1.3-.6 1.3H4.6c-.8 0-1-.9-.6-1.3C4.6 14.7 6 13.2 6 9z" />
      <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
    </svg>
  );

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="franchise-updates-panel"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
      >
        {bellIcon}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[9.5px] font-extrabold text-white"
            style={{ background: "#ef4444" }}
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id="franchise-updates-panel"
          aria-labelledby="franchise-updates-heading"
          className="absolute top-full right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 id="franchise-updates-heading" className="text-[13px] font-extrabold text-slate-800">
              Latest notifications
            </h2>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-[12px] leading-relaxed text-slate-500">
              No notifications yet. Registrations and loan status changes will appear here.
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {items.map((item) => {
                const unread = !readSet.has(item.id);
                return (
                  <li key={item.id} className="flex items-start gap-2 px-4 py-3 transition-colors hover:bg-slate-50">
                    <button
                      type="button"
                      onClick={() => {
                        onMarkRead(item.id);
                        goTo(item.target);
                      }}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus-visible:bg-slate-50"
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
                        aria-hidden="true"
                      >
                        <FranchiseIcon name={NOTIFICATION_ICON[item.kind]} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start gap-2">
                          <span
                            className={`text-[12.5px] ${unread ? "font-bold text-slate-800" : "font-semibold text-slate-500"}`}
                          >
                            {item.title}
                          </span>
                          {unread && (
                            <>
                              <span
                                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ background: "var(--brand-teal)" }}
                                aria-hidden="true"
                              />
                              <span className="sr-only">Unread</span>
                            </>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-slate-500">{item.detail}</span>
                        <span className="mt-1 block text-[10.5px] font-semibold text-slate-400">
                          {relativeTime(item.at)}
                        </span>
                      </span>
                    </button>

                    <span className="flex shrink-0 items-center gap-0.5 pt-0.5">
                      {unread && (
                        <button
                          type="button"
                          onClick={() => onMarkRead(item.id)}
                          title="Mark as read"
                          aria-label={`Mark “${item.title}” as read`}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-(--brand-teal-14) hover:text-(--brand-navy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5">
            <button
              type="button"
              onClick={() => onMarkAllRead(items.map((item) => item.id))}
              disabled={unreadCount === 0}
              className="text-[12px] font-bold text-slate-500 transition hover:text-(--brand-navy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onViewAll();
              }}
              className="text-[12px] font-bold text-(--brand-navy) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
