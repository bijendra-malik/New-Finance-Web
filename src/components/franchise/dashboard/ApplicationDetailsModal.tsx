import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import FranchiseStatusChip from "./FranchiseStatusChip";
import {
  formatDate,
  formatRupees,
  loanAmount,
  loanApplicationNo,
  loanCustomerId,
  loanCustomerMobile,
  loanCustomerName,
  loanProductName,
  loanRemark,
  loanStatus,
  loanSubmittedAt,
  loanUpdatedAt,
} from "./franchiseFormat";
import { fetchCustomerLoanStatus, type FranchiseCustomerLoan } from "../../../api/franchiseCustomers";

interface ApplicationDetailsModalProps {
  open: boolean;
  /** The all-loans row the modal was opened from. */
  loan: FranchiseCustomerLoan | null;
  onClose: () => void;
}

const Detail = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
    <dd className="mt-0.5 wrap-break-word text-[13px] font-semibold text-slate-700">{value?.trim() || "—"}</dd>
  </div>
);

/**
 * One application from the franchise-wide loan list. When the row carries a
 * customer id and application number, the latest status is fetched from
 * GET /franchise/customer/:id/loans/:applicationNo; otherwise the list row is
 * shown as-is.
 */
const ApplicationDetailsModal = ({ open, loan, onClose }: ApplicationDetailsModalProps) => {
  const customerId = loan ? loanCustomerId(loan) : undefined;
  const applicationNo = loan ? loanApplicationNo(loan) : undefined;
  const canRefresh = Boolean(customerId && applicationNo);

  const [fresh, setFresh] = useState<FranchiseCustomerLoan | null>(null);
  const [loading, setLoading] = useState(canRefresh);
  const [error, setError] = useState<string | null>(null);

  // The parent remounts this modal per application (`key`), so the state above
  // starts clean for every opened row.
  useEffect(() => {
    if (!open || !loan || !customerId || !applicationNo) return;
    let active = true;

    fetchCustomerLoanStatus(customerId, applicationNo).then((res) => {
      if (!active) return;
      if (res.ok) setFresh(res.loan);
      else setError(res.message);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [open, loan, customerId, applicationNo]);

  const record = fresh ?? loan;

  return (
    <Modal open={open && Boolean(loan)} onClose={onClose} labelledBy="franchise-application-title" maxWidth="max-w-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 pt-6 pb-4">
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-(--brand-teal)">Application</p>
          <h2 id="franchise-application-title" className="mt-0.5 truncate text-lg font-extrabold text-slate-800">
            {record ? loanProductName(record) : "Loan application"}
          </h2>
          <p className="mt-0.5 text-[12px] font-semibold text-slate-400">{applicationNo}</p>
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
        {loading && (
          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
            Fetching the latest status…
          </p>
        )}
        {error && (
          <p role="alert" className="mb-4 rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)", color: "#8a5a00" }}>
            {error} Showing the details from the loan list.
          </p>
        )}

        {record && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Current status</p>
                <p className="mt-1 text-sm font-bold text-slate-700">{loanCustomerName(record) || "Customer"}</p>
              </div>
              <FranchiseStatusChip status={loanStatus(record)} size="md" />
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Detail label="Application no." value={loanApplicationNo(record)} />
              <Detail label="Customer" value={loanCustomerName(record)} />
              <Detail label="Mobile" value={loanCustomerMobile(record)} />
              <Detail label="Loan amount" value={formatRupees(loanAmount(record))} />
              <Detail label="Submitted on" value={formatDate(loanSubmittedAt(record))} />
              <Detail label="Last updated" value={formatDate(loanUpdatedAt(record))} />
              <Detail label="Customer id" value={customerId} />
            </dl>

            {loanRemark(record) && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Remarks</p>
                <p className="mt-1 text-[12.5px] leading-6 text-slate-600">{loanRemark(record)}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end border-t border-slate-100 px-6 py-3.5">
        <Button variant="outline" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ApplicationDetailsModal;
