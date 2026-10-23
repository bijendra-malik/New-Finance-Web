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

const SEEN_KEY_PREFIX = "indexia_franchise_updates_seen:";

const readSeen = (franchiseId: string): string | null => {
  try {
    return localStorage.getItem(`${SEEN_KEY_PREFIX}${franchiseId}`);
  } catch {
    return null;
  }
};

const writeSeen = (franchiseId: string, iso: string): void => {
  try {
    localStorage.setItem(`${SEEN_KEY_PREFIX}${franchiseId}`, iso);
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

/**
 * Bell in the dashboard header listing the newest activity in the partner's
 * book — loan status updates and newly registered customers. The service has no
 * notifications feed, so items are derived from the data the dashboard already
 * loads; the last-opened timestamp is kept per franchise in local storage to
 * drive the unread count.
 */
const NotificationBell = ({ loans, customers, franchiseId, onOpenSection }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);
  const [seenAt, setSeenAt] = useState<string | null>(() => readSeen(franchiseId));
  const [markerAt, setMarkerAt] = useState<string | null>(() => readSeen(franchiseId));
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = useMemo<UpdateItem[]>(() => {
    const loanUpdates = loans.map((loan, index) => ({
      id: `loan-${loanApplicationNo(loan)}-${index}`,
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
      .filter((item) => timeValue(item.at) > 0)
      .sort((a, b) => timeValue(b.at) - timeValue(a.at))
      .slice(0, 8);
  }, [loans, customers]);

  const unreadCount = items.filter((item) => timeValue(item.at) > timeValue(seenAt ?? undefined)).length;
  const newest = items[0]?.at;

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

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    // Snapshot what was already seen so this session can still mark the newer
    // rows, then record everything as seen.
    setMarkerAt(seenAt);
    if (newest) {
      setSeenAt(newest);
      writeSeen(franchiseId, newest);
    }
    setOpen(true);
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
                const isNew = timeValue(item.at) > timeValue(markerAt ?? undefined);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(item.target)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50"
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
                          <span className="text-[12.5px] font-bold text-slate-800">{item.title}</span>
                          {isNew && (
                            <>
                              <span
                                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ background: "var(--brand-teal)" }}
                                aria-hidden="true"
                              />
                              <span className="sr-only">New</span>
                            </>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-slate-500">{item.detail}</span>
                        <span className="mt-1 block text-[10.5px] font-semibold text-slate-400">
                          {relativeTime(item.at)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-slate-100 px-4 py-2.5">
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
