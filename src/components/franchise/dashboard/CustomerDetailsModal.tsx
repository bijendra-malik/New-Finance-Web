import { useEffect, useState } from "react";
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
  loanRemark,
  loanStatus,
  loanSubmittedAt,
  loanUpdatedAt,
  sortLoansNewestFirst,
} from "./franchiseFormat";
import {
  fetchCustomerLoanStatus,
  fetchCustomerLoans,
  fetchFranchiseCustomer,
  type FranchiseCustomer,
  type FranchiseCustomerLoan,
} from "../../../api/franchiseCustomers";

interface CustomerDetailsModalProps {
  open: boolean;
  /** The list row the modal was opened from — shown while the detail calls run. */
  customer: FranchiseCustomer | null;
  onClose: () => void;
  /** Starts the Apply Loan flow pre-set to this customer. */
  onApplyLoan: (customer: FranchiseCustomer) => void;
}

/** Label/value pair used across the detail panes. */
const Detail = ({ label, value }: { label: string; value?: string | number | null }) => {
  // Registry values are not guaranteed to be strings — mobile and pincode come
  // back as numbers, and calling `.trim()` on them throws.
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
 * them (POST /franchise/customer/:id/loans), with each application's latest
 * status fetched on demand.
 */
const CustomerDetailsModal = ({ open, customer, onClose, onApplyLoan }: CustomerDetailsModalProps) => {
  const [details, setDetails] = useState<FranchiseCustomer | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [loans, setLoans] = useState<FranchiseCustomerLoan[]>([]);
  const [loansLoading, setLoansLoading] = useState(true);
  const [loansError, setLoansError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applicationDetails, setApplicationDetails] = useState<Record<string, FranchiseCustomerLoan>>({});
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

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

  const toggleApplication = async (loan: FranchiseCustomerLoan) => {
    const key = loanApplicationNo(loan);
    if (expanded === key) {
      setExpanded(null);
      setStatusError(null);
      return;
    }
    setExpanded(key);
    setStatusError(null);
    if (applicationDetails[key] || !customerId) return;

    setStatusLoading(key);
    const res = await fetchCustomerLoanStatus(customerId, key);
    setStatusLoading(null);
    if (res.ok) {
      setApplicationDetails((previous) => ({ ...previous, [key]: res.loan }));
    } else {
      setStatusError(res.message);
    }
  };

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
            <p className="text-[11.5px] font-semibold text-slate-400">
              {loans.length} application{loans.length === 1 ? "" : "s"}
            </p>
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

            {loans.length > 0 && (
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white">
                {loans.map((loan) => {
                  const key = loanApplicationNo(loan);
                  const isOpen = expanded === key;
                  const detail = applicationDetails[key];
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void toggleApplication(loan)}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? "Hide status" : "View status"}
                          </Button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                          {statusLoading === key && (
                            <p className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
                              Fetching the latest status…
                            </p>
                          )}
                          {statusError && expanded === key && (
                            <p role="alert" className="text-[12px] font-semibold text-red-700">{statusError}</p>
                          )}
                          {detail && (
                            <div>
                              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <Detail label="Application no." value={loanApplicationNo(detail)} />
                                <Detail label="Status" value={loanStatus(detail)} />
                                <Detail label="Loan amount" value={formatRupees(loanAmount(detail))} />
                                <Detail label="Submitted on" value={formatDate(loanSubmittedAt(detail))} />
                                <Detail label="Last updated" value={formatDate(loanUpdatedAt(detail))} />
                                <Detail label="Customer" value={record?.fullName ?? displayName} />
                              </dl>
                              {loanRemark(detail) && (
                                <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[12px] leading-5 text-slate-600" style={{ border: "1px solid #e2e8f0" }}>
                                  {loanRemark(detail)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
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
