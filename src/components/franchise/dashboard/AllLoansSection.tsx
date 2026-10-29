import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import FranchiseStatusChip from "./FranchiseStatusChip";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import {
  formatDate,
  formatRupees,
  isLoanIncomplete,
  loanAmount,
  loanApplicationNo,
  loanCustomerId,
  loanCustomerMobile,
  loanCustomerName,
  loanProductName,
  loanProductKey,
  loanStatus,
  loanSubmittedAt,
  sortLoansNewestFirst,
} from "./franchiseFormat";
import type { FranchiseCustomerLoan } from "../../../api/franchiseCustomers";

interface AllLoansSectionProps {
  loans: FranchiseCustomerLoan[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
}

const customerLabel = (loan: FranchiseCustomerLoan): string =>
  loanCustomerName(loan) || "Unknown customer";

const distinctLabels = (
  rows: FranchiseCustomerLoan[],
  read: (loan: FranchiseCustomerLoan) => string,
): string[] => [...new Set(rows.map(read))].sort((a, b) => a.localeCompare(b));

interface HeaderFilterProps {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}

const HeaderFilter = ({ label, value, options, allLabel, onChange }: HeaderFilterProps) => (
  <th scope="col" className="px-4 py-3 align-bottom">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={`Filter by ${label}`}
      className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[12px] font-semibold normal-case text-slate-700 transition hover:border-slate-300 focus:border-(--brand-teal-44) focus:ring-2 focus:ring-(--brand-teal-14) focus:outline-none"
    >
      <option value="all">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option.toLowerCase()}>
          {option}
        </option>
      ))}
    </select>
  </th>
);

/**
 * All Loans (GET /franchise/loans): every application this franchise has filed,
 * across all of its customers. Each heading — Application, Customer, Status —
 * carries its own filter, unfinished drafts offer a Continue link back into the
 * filing form, and the application detail is one click away.
 */
const AllLoansSection = ({ loans, loading, error, onReload }: AllLoansSectionProps) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [selected, setSelected] = useState<FranchiseCustomerLoan | null>(null);

  const sorted = useMemo(() => sortLoansNewestFirst(loans), [loans]);

  const statuses = useMemo(() => {
    const seen = new Map<string, string>();
    sorted.forEach((loan) => {
      const status = loanStatus(loan);
      const key = status.toLowerCase();
      if (!seen.has(key)) seen.set(key, status);
    });
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [sorted]);

  const products = useMemo(() => distinctLabels(sorted, loanProductName), [sorted]);
  const customers = useMemo(() => distinctLabels(sorted, customerLabel), [sorted]);

  const needle = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      sorted.filter((loan) => {
        if (statusFilter !== "all" && loanStatus(loan).toLowerCase() !== statusFilter) return false;
        if (productFilter !== "all" && loanProductName(loan).toLowerCase() !== productFilter) return false;
        if (customerFilter !== "all" && customerLabel(loan).toLowerCase() !== customerFilter) return false;
        if (!needle) return true;
        return [loanApplicationNo(loan), loanProductName(loan), loanCustomerName(loan), loanCustomerMobile(loan)]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(needle));
      }),
    [sorted, statusFilter, productFilter, customerFilter, needle],
  );

  const totalValue = filtered.reduce((sum, loan) => sum + (loanAmount(loan) ?? 0), 0);

  return (
    <section aria-label="All loans">
      {error && (
        <div
          role="alert"
          className="rounded-xl px-4 py-3"
          style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)" }}
        >
          <p className="text-[12.5px] font-bold" style={{ color: "var(--form-error-text, #b91c1c)" }}>
            Could not load your loans
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{error}</p>
          <Button variant="link" size="sm" onClick={onReload}>
            Try again
          </Button>
        </div>
      )}

      <div className={`${error ? "mt-4" : ""} overflow-hidden rounded-2xl border border-slate-200 bg-white`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <label className="relative w-full max-w-sm">
            <span className="sr-only">Search loans</span>
            <FranchiseIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search application no., customer or product"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pr-3 pl-9 text-[13px] text-slate-700 transition placeholder:text-slate-400 focus:border-(--brand-teal-44) focus:bg-white focus:ring-2 focus:ring-(--brand-teal-14) focus:outline-none"
            />
          </label>

          <p className="ml-auto text-[11.5px] font-semibold text-slate-400">
            {filtered.length} application{filtered.length === 1 ? "" : "s"}
            {totalValue > 0 ? ` · ${formatRupees(totalValue)} total` : ""}
          </p>

          <Button variant="outline" size="sm" onClick={onReload} loading={loading}>
            Refresh
          </Button>
        </div>

        {loading && loans.length === 0 ? (
          <div className="px-4 py-10">
            <p className="flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Loading your loan book…
            </p>
          </div>
        ) : loans.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
            >
              <FranchiseIcon name="layers" filled className="h-6 w-6" />
            </span>
            <h3 className="mt-3 text-[15px] font-extrabold text-slate-800">No loans filed yet</h3>
            <p className="mx-auto mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Open Apply Loan, pick a product and a registered customer — the application will appear here with its
              live status.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-[13px] font-bold text-slate-700">No applications match these filters</p>
            <p className="mt-1 text-[12px] text-slate-500">Try a different search term or filter.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setProductFilter("all");
                setCustomerFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="contain-paint overflow-x-auto">
            <table className="w-full min-w-215 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <HeaderFilter
                    label="Application"
                    value={productFilter}
                    options={products}
                    allLabel="All applications"
                    onChange={setProductFilter}
                  />
                  <HeaderFilter
                    label="Customer"
                    value={customerFilter}
                    options={customers}
                    allLabel="All customers"
                    onChange={setCustomerFilter}
                  />
                  <th scope="col" className="px-4 py-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Amount</th>
                  <th scope="col" className="px-4 py-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Submitted</th>
                  <HeaderFilter
                    label="Status"
                    value={statusFilter}
                    options={statuses}
                    allLabel="All statuses"
                    onChange={setStatusFilter}
                  />
                  <th scope="col" className="px-4 py-3 text-right text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((loan, index) => {
                  const key = `${loanApplicationNo(loan)}-${index}`;
                  const productKey = isLoanIncomplete(loan) ? loanProductKey(loan) : null;
                  const customerId = loanCustomerId(loan);
                  const continuePath = productKey
                    ? `/franchisor-dashboard/apply/${productKey}${
                        customerId ? `?customer=${encodeURIComponent(customerId)}` : ""
                      }`
                    : null;
                  return (
                    <tr key={key} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{loanProductName(loan)}</p>
                        <p className="mt-0.5 text-[11.5px] font-semibold text-slate-400">{loanApplicationNo(loan)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-semibold text-slate-700">{loanCustomerName(loan) || "—"}</p>
                        <p className="mt-0.5 text-[11.5px] text-slate-500">{loanCustomerMobile(loan) || ""}</p>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-slate-700">
                        {formatRupees(loanAmount(loan))}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">{formatDate(loanSubmittedAt(loan))}</td>
                      <td className="px-4 py-3">
                        <FranchiseStatusChip status={loanStatus(loan)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {continuePath && (
                            <Link
                              to={continuePath}
                              className="inline-flex items-center rounded-lg border border-(--brand-teal-44) bg-white px-3 py-1.5 text-xs font-bold text-(--brand-navy) transition hover:bg-(--brand-teal-14) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                            >
                              Continue
                            </Link>
                          )}
                          <Button variant="outline" size="sm" onClick={() => setSelected(loan)}>
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplicationDetailsModal
        key={selected ? loanApplicationNo(selected) : "closed"}
        open={Boolean(selected)}
        loan={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
};

export default AllLoansSection;
