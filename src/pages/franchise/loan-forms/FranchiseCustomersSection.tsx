import { useCallback, useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import FranchiseIcon from "../../../components/franchise/FranchiseIcon";
import CustomerRegisterModal from "./CustomerRegisterModal";
import {
  fetchCustomerLoans,
  fetchCustomerLoanStatus,
  fetchFranchiseCustomers,
  type FranchiseCustomer,
  type FranchiseCustomerLoan,
} from "../../../api/franchiseCustomers";

/** Tone for a loan status string reported by the backend. */
const statusTone = (status?: string): { bg: string; border: string; text: string } => {
  switch ((status ?? "").trim().toLowerCase()) {
    case "approved":
      return { bg: "rgba(38,174,144,0.12)", border: "rgba(38,174,144,0.4)", text: "#0f766e" };
    case "rejected":
      return { bg: "#fef2f2", border: "rgba(239,68,68,0.35)", text: "#b91c1c" };
    case "pending":
    case "submitted":
    case "in review":
      return { bg: "#fff8e6", border: "rgba(224,168,0,0.45)", text: "#92620a" };
    case "disbursed":
      return { bg: "rgba(38,174,144,0.2)", border: "#22bfb3", text: "#0f766e" };
    default:
      return { bg: "var(--brand-navy-14)", border: "var(--brand-navy-22)", text: "var(--brand-navy)" };
  }
};

const StatusChip = ({ status }: { status?: string }) => {
  const tone = statusTone(status);
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize"
      style={{ background: tone.bg, border: `1px solid ${tone.border}`, color: tone.text }}
    >
      {status?.trim() || "Unknown"}
    </span>
  );
};

/**
 * Section 1 — every client registered under this franchise, with their basic
 * details, a way to register a new one, and each client's loans + status.
 */
const FranchiseCustomersSection = () => {
  const [customers, setCustomers] = useState<FranchiseCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Loans drill-down for one client.
  const [loansFor, setLoansFor] = useState<FranchiseCustomer | null>(null);
  const [loans, setLoans] = useState<FranchiseCustomerLoan[]>([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [loansError, setLoansError] = useState<string | null>(null);

  // One loan's status drill-down.
  const [statusFor, setStatusFor] = useState<FranchiseCustomerLoan | null>(null);
  const [statusDetail, setStatusDetail] = useState<FranchiseCustomerLoan | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const applyResult = useCallback((res: Awaited<ReturnType<typeof fetchFranchiseCustomers>>) => {
    if (res.ok) {
      setCustomers(res.customers);
      setListError(null);
    } else {
      setListError(res.message);
    }
    setLoading(false);
  }, []);

  const load = useCallback(async () => {
    applyResult(await fetchFranchiseCustomers());
  }, [applyResult]);

  useEffect(() => {
    let active = true;
    fetchFranchiseCustomers().then((res) => {
      if (active) applyResult(res);
    });
    return () => {
      active = false;
    };
  }, [applyResult]);

  const openLoans = async (customer: FranchiseCustomer) => {
    setLoansFor(customer);
    setLoans([]);
    setLoansError(null);
    setLoansLoading(true);
    const res = await fetchCustomerLoans(customer._id);
    if (res.ok) setLoans(res.loans);
    else setLoansError(res.message);
    setLoansLoading(false);
  };

  const openStatus = async (loan: FranchiseCustomerLoan) => {
    if (!loansFor) return;
    setStatusFor(loan);
    setStatusDetail(null);
    setStatusError(null);
    setStatusLoading(true);
    const applicationNo = loan.applicationNo ?? loan._id;
    const res = await fetchCustomerLoanStatus(loansFor._id, applicationNo);
    if (res.ok) setStatusDetail(res.loan);
    else setStatusError(res.message);
    setStatusLoading(false);
  };

  return (
    <section className="mt-8" aria-labelledby="franchise-customers-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="franchise-customers-heading" className="text-xl font-extrabold text-slate-800">
            Your customers
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Every client registered under your franchise ID. Register a customer once, then file any loan for them.
          </p>
        </div>
        <Button size="md" onClick={() => setRegisterOpen(true)}>
          + Register new customer
        </Button>
      </div>

      <div aria-live="polite" className="mt-4">
        {toast && (
          <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-[12.5px] font-semibold text-emerald-700" style={{ border: "1px solid #b6e4c9" }}>
            {toast}
          </p>
        )}
        {listError && (
          <div className="rounded-xl px-4 py-3" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)" }}>
            <p className="text-[12.5px] font-bold" style={{ color: "var(--form-error-text, #b91c1c)" }}>Could not load your customers</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{listError}</p>
            <Button variant="link" size="sm" onClick={() => { setLoading(true); void load(); }}>Try again</Button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="mt-5 flex items-center gap-2 text-[12.5px] font-semibold text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
          Loading your customers…
        </p>
      ) : !listError && customers.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-white p-7 text-center" style={{ border: "1px solid rgba(6,106,156,0.12)" }}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}>
            <FranchiseIcon name="user" filled className="h-6 w-6" />
          </span>
          <h3 className="mt-3 text-[15px] font-extrabold text-slate-800">No customers yet</h3>
          <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-slate-500">
            Register your first customer with their basic details — PAN, contact and address — then open any loan
            product to apply on their behalf.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(6,106,156,0.12)" }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                <th scope="col" className="px-5 py-3 font-bold">Customer</th>
                <th scope="col" className="px-5 py-3 font-bold">Mobile</th>
                <th scope="col" className="px-5 py-3 font-bold">PAN</th>
                <th scope="col" className="px-5 py-3 font-bold">Location</th>
                <th scope="col" className="px-5 py-3 font-bold">Registered</th>
                <th scope="col" className="px-5 py-3 font-bold"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer._id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-800">{customer.fullName}</p>
                    <p className="mt-0.5 text-[12px] text-slate-500">{customer.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{customer.mobile}</td>
                  <td className="px-5 py-3.5 font-semibold tracking-wide text-slate-700">{customer.panNumber}</td>
                  <td className="px-5 py-3.5 text-slate-600">{customer.city}, {customer.state} — {customer.pincode}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-slate-500">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="outline" size="sm" onClick={() => void openLoans(customer)}>
                      View loans
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomerRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={(customer) => {
          setRegisterOpen(false);
          setToast(
            customer
              ? `${customer.fullName} is registered. You can now apply for a loan on their behalf.`
              : "Customer registered. You can now apply for a loan on their behalf.",
          );
          void load();
        }}
      />

      {/* Client loans drill-down */}
      <Modal
        open={!!loansFor}
        onClose={() => setLoansFor(null)}
        labelledBy="customer-loans-title"
        maxWidth="max-w-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-6 pb-3">
          <div>
            <h2 id="customer-loans-title" className="text-lg font-extrabold text-slate-800">
              {loansFor?.fullName}&rsquo;s loans
            </h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500">
              Every application filed for this customer, with its current status.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLoansFor(null)}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(92vh - 8rem)" }}>
          {loansLoading && (
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Loading loans…
            </p>
          )}
          {loansError && (
            <p role="alert" className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}>
              {loansError}
            </p>
          )}
          {!loansLoading && !loansError && loans.length === 0 && (
            <p className="py-4 text-center text-[13px] text-slate-500">
              No loans filed for this customer yet. Open a loan product and select them to apply.
            </p>
          )}
          {loans.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {loans.map((loan) => (
                <li key={loan._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-slate-800">
                      {loan.loanType || "Loan application"}{" "}
                      <span className="font-medium text-slate-400">· {loan.applicationNo ?? loan._id}</span>
                    </p>
                    <p className="mt-0.5 text-[12px] text-slate-500">
                      {typeof loan.loanAmount === "number" && loan.loanAmount > 0
                        ? `₹${loan.loanAmount.toLocaleString("en-IN")} · `
                        : ""}
                      {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("en-IN") : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusChip status={loan.status} />
                    <Button variant="outline" size="sm" onClick={() => void openStatus(loan)}>
                      Check status
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      {/* One loan's status drill-down */}
      <Modal
        open={!!statusFor}
        onClose={() => setStatusFor(null)}
        labelledBy="loan-status-title"
        maxWidth="max-w-md"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-6 pb-3">
          <h2 id="loan-status-title" className="text-lg font-extrabold text-slate-800">
            Loan status
          </h2>
          <button
            type="button"
            onClick={() => setStatusFor(null)}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">
          {statusLoading && (
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Fetching the latest status…
            </p>
          )}
          {statusError && (
            <p role="alert" className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}>
              {statusError}
            </p>
          )}
          {statusDetail && (
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-bold text-slate-800">
                  {statusDetail.loanType || "Loan application"}
                </p>
                <StatusChip status={statusDetail.status} />
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Application no.", statusDetail.applicationNo ?? statusDetail._id],
                  [
                    "Loan amount",
                    typeof statusDetail.loanAmount === "number" && statusDetail.loanAmount > 0
                      ? `₹${statusDetail.loanAmount.toLocaleString("en-IN")}`
                      : undefined,
                  ],
                  ["Submitted on", statusDetail.createdAt ? new Date(statusDetail.createdAt).toLocaleDateString("en-IN") : undefined],
                  ["Status", statusDetail.status],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-700">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </Modal>
    </section>
  );
};

export default FranchiseCustomersSection;
