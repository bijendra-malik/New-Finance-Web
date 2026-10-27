import { useEffect, useMemo, useState } from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import FranchiseStatusChip from "./FranchiseStatusChip";
import {
  formatDate,
  formatRupees,
  fullNameInitials,
  loanAmount,
  loanApplicationNo,
  loanProductName,
  loanStatus,
  loanSubmittedAt,
  sortLoansNewestFirst,
} from "./franchiseFormat";
import {
  fetchCustomerLoans,
  fetchFranchiseCustomer,
  type FranchiseCustomer,
  type FranchiseCustomerLoan,
} from "../../../api/franchiseCustomers";

interface CustomerDetailsModalProps {
  open: boolean;
  customer: FranchiseCustomer | null;
  onClose: () => void;
  onApplyLoan: (customer: FranchiseCustomer) => void;
}

const Detail = ({ label, value }: { label: string; value?: string | number | null }) => {
  const text = value === null || value === undefined ? "" : String(value).trim();
  return (
    <div>
      <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-[13px] font-semibold text-slate-700">{text || "—"}</dd>
    </div>
  );
};

/**
 * One registered customer: their registered details plus every loan filed for
 * them (POST /franchise/customer/:id/loans), each with its current status and
 * a status filter over the list.
 */
const CustomerDetailsModal = ({ open, customer, onClose, onApplyLoan }: CustomerDetailsModalProps) => {
  const [details, setDetails] = useState<FranchiseCustomer | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [loans, setLoans] = useState<FranchiseCustomerLoan[]>([]);
  const [loansLoading, setLoansLoading] = useState(true);
  const [loansError, setLoansError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const customerId = customer?._id ?? null;

  // The parent remounts this modal per customer (`key`), so this effect only
  // has to load the selected customer — no state reset is needed here.
  useEffect(() => {
    if (!open || !customerId) return;
    let active = true;

    fetchFranchiseCustomer(customerId).then((res) => {
      if (!active) return;
      if (res.ok) setDetails(res.customer);
      else setDetailsError(res.message);
    });

    fetchCustomerLoans(customerId).then((res) => {
      if (!active) return;
      if (res.ok) setLoans(sortLoansNewestFirst(res.loans));
      else setLoansError(res.message);
      setLoansLoading(false);
    });

    return () => {
      active = false;
    };
  }, [open, customerId]);

  const statuses = useMemo(() => {
    const seen = new Map<string, string>();
    loans.forEach((loan) => {
      const status = loanStatus(loan);
      const key = status.toLowerCase();
      if (!seen.has(key)) seen.set(key, status);
    });
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [loans]);

  const visibleLoans = useMemo(
    () =>
      statusFilter === "all"
        ? loans
        : loans.filter((loan) => loanStatus(loan).toLowerCase() === statusFilter),
    [loans, statusFilter],
  );

  const record = details ?? customer;
  const displayName = record?.fullName?.trim() || "Customer";

  return (
    <Modal open={open && Boolean(customer)} onClose={onClose} labelledBy="franchise-customer-title" maxWidth="max-w-3xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 pt-6 pb-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
            style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))", color: "var(--brand-yellow)" }}
            aria-hidden="true"
          >
            {fullNameInitials(displayName)}
          </span>
          <div className="min-w-0">
            <h2 id="franchise-customer-title" className="truncate text-lg font-extrabold text-slate-800">
              {displayName}
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">Customer {customerId}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(92vh - 9rem)" }}>
        {detailsError && (
          <p role="alert" className="mb-4 rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}>
            {detailsError} The registered row below is still available.
          </p>
        )}

        {/* Registered details */}
        <section aria-labelledby="customer-details-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FranchiseIcon name="doc" className="h-4 w-4 text-(--brand-navy)" />
              <h3 id="customer-details-heading" className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500">
                Registered details
              </h3>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (record) onApplyLoan(record);
              }}
            >
              Apply loan
            </Button>
          </div>
          <dl className="mt-3 grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Mobile" value={record?.mobile} />
            <Detail label="Email" value={record?.email} />
            <Detail label="PAN" value={record?.panNumber} />
            <Detail label="Date of birth" value={formatDate(record?.dob)} />
            <Detail label="City / State" value={record ? `${record.city || "—"}, ${record.state || "—"}` : undefined} />
            <Detail label="Pincode" value={record?.pincode} />
            <Detail label="Registered on" value={formatDate(record?.createdAt)} />
            <Detail label="Franchise" value={record?.franchiseId} />
          </dl>
        </section>

        {/* This customer's loans */}
        <section aria-labelledby="customer-loans-heading" className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FranchiseIcon name="layers" className="h-4 w-4 text-(--brand-navy)" />
              <h3 id="customer-loans-heading" className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500">
                Loans filed
              </h3>
            </div>
            <div className="flex items-center gap-2.5">
              <label className="relative">
                <span className="sr-only">Filter loans filed by status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  disabled={loans.length === 0}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white py-1.5 pr-7 pl-2.5 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 focus:border-(--brand-teal-44) focus:ring-2 focus:ring-(--brand-teal-14) focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status.toLowerCase()}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-[11.5px] font-semibold text-slate-400">
                {visibleLoans.length} application{visibleLoans.length === 1 ? "" : "s"}
                {statusFilter !== "all" ? ` of ${loans.length}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-3">
            {loansLoading && (
              <p className="flex items-center gap-2 py-4 text-[12.5px] font-semibold text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
                Loading this customer&apos;s loans…
              </p>
            )}

            {loansError && (
              <p role="alert" className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}>
                {loansError}
              </p>
            )}

            {!loansLoading && !loansError && loans.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
                <p className="text-[13px] font-bold text-slate-700">No loans filed for this customer yet</p>
                <p className="mt-1 text-[12px] text-slate-500">Open Apply Loan, choose a product, then select this customer.</p>
              </div>
            )}

            {loans.length > 0 && visibleLoans.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-center">
                <p className="text-[13px] font-bold text-slate-700">No applications match this status</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setStatusFilter("all")}>
                  Show all statuses
                </Button>
              </div>
            )}

            {visibleLoans.length > 0 && (
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white">
                {visibleLoans.map((loan) => {
                  const key = loanApplicationNo(loan);
                  return (
                    <li key={key}>
                      <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-slate-800">
                            {loanProductName(loan)}
                            <span className="ml-2 font-medium text-slate-400">· {key}</span>
                          </p>
                          <p className="mt-0.5 text-[11.5px] text-slate-500">
                            {loanAmount(loan) !== undefined ? `${formatRupees(loanAmount(loan))} · ` : ""}
                            Submitted {formatDate(loanSubmittedAt(loan))}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <FranchiseStatusChip status={loanStatus(loan)} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-end border-t border-slate-100 px-6 py-3.5">
        <Button variant="outline" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default CustomerDetailsModal;
