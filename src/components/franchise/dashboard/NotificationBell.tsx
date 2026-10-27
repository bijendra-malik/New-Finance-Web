import { useEffect, useMemo, useRef, useState } from "react";
import FranchiseIcon from "../FranchiseIcon";
import { formatDate, loanApplicationNo, loanCustomerName, loanProductName, loanStatus, loanSubmittedAt, loanUpdatedAt } from "./franchiseFormat";
import type { FranchiseCustomer, FranchiseCustomerLoan } from "../../../api/franchiseCustomers";

type Target = "loans" | "customers";

interface UpdateItem {
  id: string;
  target: Target;
  title: string;
  detail: string;
  at?: string;
}

interface NotificationBellProps {
  loans: FranchiseCustomerLoan[];
  customers: FranchiseCustomer[];
  franchiseId: string;
  onOpenSection: (section: Target) => void;
}

const READ_KEY_PREFIX = "indexia_franchise_updates_read:";
const DISMISSED_KEY_PREFIX = "indexia_franchise_updates_dismissed:";
const MAX_STORED_IDS = 200;

const readStoredIds = (prefix: string, franchiseId: string): string[] => {
  try {
    const raw = localStorage.getItem(`${prefix}${franchiseId}`);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const writeStoredIds = (prefix: string, franchiseId: string, ids: string[]): void => {
  try {
    localStorage.setItem(`${prefix}${franchiseId}`, JSON.stringify(ids.slice(-MAX_STORED_IDS)));
  } catch {
    // a full browser should not break the dashboard
  }
};

const timeValue = (iso?: string): number => {
  if (!iso) return 0;
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const relativeTime = (iso?: string): string => {
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

const NotificationBell = ({ loans, customers, franchiseId, onOpenSection }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => readStoredIds(READ_KEY_PREFIX, franchiseId));
  const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
    readStoredIds(DISMISSED_KEY_PREFIX, franchiseId),
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = useMemo<UpdateItem[]>(() => {
    const dismissed = new Set(dismissedIds);
    const loanUpdates = loans.map((loan) => ({      id: `loan-${loanApplicationNo(loan)}`,
      target: "loans" as const,
      title: `${loanProductName(loan)} · ${loanStatus(loan)}`,
      detail: [loanCustomerName(loan), loanApplicationNo(loan)].filter(Boolean).join(" · "),
      at: loanUpdatedAt(loan) ?? loanSubmittedAt(loan),
    }));

    const customerUpdates = customers.map((customer) => ({
      id: `customer-${customer._id}`,
      target: "customers" as const,
      title: "New customer registered",
      detail: [customer.fullName, customer.mobile].filter(Boolean).join(" · "),
      at: customer.createdAt,
    }));

    return [...loanUpdates, ...customerUpdates]
      .filter((item) => !dismissed.has(item.id) && timeValue(item.at) > 0)
      .sort((a, b) => timeValue(b.at) - timeValue(a.at))
      .slice(0, 8);
  }, [loans, customers, dismissedIds]);

  const readSet = useMemo(() => new Set(readIds), [readIds]);
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

  const markRead = (id: string) => {
    if (readIds.includes(id)) return;
    const next = [...readIds, id];
    setReadIds(next);
    writeStoredIds(READ_KEY_PREFIX, franchiseId, next);
  };

  const markAllRead = () => {
    const next = Array.from(new Set([...readIds, ...items.map((item) => item.id)]));
    setReadIds(next);
    writeStoredIds(READ_KEY_PREFIX, franchiseId, next);
  };

  const dismiss = (id: string) => {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    writeStoredIds(DISMISSED_KEY_PREFIX, franchiseId, next);
  };

  const goTo = (target: Target) => {
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
        aria-label={unreadCount > 0 ? `Updates, ${unreadCount} unread` : "Updates"}
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
              Latest updates
            </h2>
            <p className="mt-0.5 text-[11.5px] text-slate-500">
              Newest customer registrations and loan changes first.
            </p>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-[12px] leading-relaxed text-slate-500">
              No updates yet. Registrations and loan status changes will appear here.
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
                        markRead(item.id);
                        goTo(item.target);
                      }}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus-visible:bg-slate-50"
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
                        aria-hidden="true"
                      >
                        <FranchiseIcon
                          name={item.target === "loans" ? "layers" : "user-plus"}
                          className="h-4 w-4"
                        />
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
                          onClick={() => markRead(item.id)}
                          title="Mark as read"
                          aria-label={`Mark “${item.title}” as read`}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-(--brand-teal-14) hover:text-(--brand-navy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => dismiss(item.id)}
                        title="Delete notification"
                        aria-label={`Delete “${item.title}”`}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5">
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-[12px] font-bold text-slate-500 transition hover:text-(--brand-navy) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={() => goTo("loans")}
              className="text-[12px] font-bold text-(--brand-navy) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
            >
              View all applications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
