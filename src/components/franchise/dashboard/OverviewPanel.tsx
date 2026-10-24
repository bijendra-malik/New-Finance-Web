/** The dashboard's Overview section: KPIs, quick actions, and the two "recent" lists. */

import Button from "../../ui/Button";
import FranchiseStatusChip from "./FranchiseStatusChip";
import { StatCard, QuickAction } from "./franchiseCards";
import type { FranchiseCustomer, FranchiseCustomerLoan } from "../../../api/franchiseCustomers";
import {
  dateValue,
  formatDate,
  formatRupees,
  formatRupeesCompact,
  fullNameInitials,
  isLoanInProgress,
  isLoanPositive,
  loanAmount,
  loanApplicationNo,
  loanCustomerName,
  loanProductName,
  loanStatus,
  sortLoansNewestFirst,
} from "./franchiseFormat";
import type { Section } from "./franchiseSections";

const RECENT_COUNT = 5;

interface OverviewPanelProps {
  customers: FranchiseCustomer[];
  customersError: string | null;
  loadingCustomers: boolean;
  loans: FranchiseCustomerLoan[];
  loansError: string | null;
  loadingLoans: boolean;
  goToSection: (next: Section) => void;
  onReloadCustomers: () => void;
  onReloadLoans: () => void;
}

const OverviewPanel = ({
  customers,
  customersError,
  loadingCustomers,
  loans,
  loansError,
  loadingLoans,
  goToSection,
  onReloadCustomers,
  onReloadLoans,
}: OverviewPanelProps) => {
  const recentLoans = sortLoansNewestFirst(loans).slice(0, RECENT_COUNT);
  const recentCustomers = [...customers]
    .sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt))
    .slice(0, RECENT_COUNT);

  const inProgress = loans.filter(isLoanInProgress).length;
  const positive = loans.filter(isLoanPositive).length;
  const totalLoanValue = loans.reduce((sum, loan) => sum + (loanAmount(loan) ?? 0), 0);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Customers"
          value={String(customers.length)}
          hint="Registered under your franchise ID"
          icon="user"
          accent="linear-gradient(90deg,var(--brand-teal),var(--brand-navy))"
        />
        <StatCard
          label="Applications"
          value={String(loans.length)}
          hint={totalLoanValue > 0 ? `${formatRupeesCompact(totalLoanValue)} requested in total` : "Loans filed across all products"}
          icon="layers"
          accent="linear-gradient(90deg,var(--brand-navy),var(--brand-navy-light))"
        />
        <StatCard
          label="In progress"
          value={String(inProgress)}
          hint="Submitted, under review or processing"
          icon="clock"
          accent="linear-gradient(90deg,#e0a800,#f6c453)"
        />
        <StatCard
          label="Approved / disbursed"
          value={String(positive)}
          hint="Sanctioned, disbursed or closed"
          icon="check"
          accent="linear-gradient(90deg,#26ae90,#7bd9c4)"
        />
      </div>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading" className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 id="quick-actions-heading" className="text-[13px] font-extrabold uppercase tracking-wider text-slate-500">
          Quick actions
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <QuickAction
            icon="user-plus"
            label="Register a customer"
            hint="Add a client to your franchise registry"
            onClick={() => goToSection("customers")}
          />
          <QuickAction
            icon="pen-line"
            label="Apply for a loan"
            hint="File any product on a customer's behalf"
            onClick={() => goToSection("apply")}
          />
          <QuickAction
            icon="layers"
            label="Track applications"
            hint="Review every loan and its live status"
            onClick={() => goToSection("loans")}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* Recent applications */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="recent-loans-heading">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 id="recent-loans-heading" className="text-[15px] font-extrabold text-slate-800">
                Recent applications
              </h2>
              <p className="mt-0.5 text-[11.5px] text-slate-500">The latest loans filed under your franchise.</p>
            </div>
            <Button variant="link" size="sm" onClick={() => goToSection("loans")}>
              View all →
            </Button>
          </div>

          {loansError ? (
            <div className="px-5 py-6">
              <p role="alert" className="text-[12.5px] font-semibold text-red-700">{loansError}</p>
              <Button variant="link" size="sm" onClick={onReloadLoans}>Try again</Button>
            </div>
          ) : loadingLoans && loans.length === 0 ? (
            <p className="flex items-center gap-2 px-5 py-8 text-[12.5px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Loading applications…
            </p>
          ) : recentLoans.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[13px] font-bold text-slate-700">No applications yet</p>
              <p className="mt-1 text-[12px] text-slate-500">File your first loan to see it tracked here.</p>
              <Button size="sm" className="mt-3" onClick={() => goToSection("apply")}>Apply for a loan</Button>
            </div>
          ) : (
            <div className="contain-paint overflow-x-auto">
              <table className="w-full min-w-140 text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10.5px] uppercase tracking-wider text-slate-400">
                    <th scope="col" className="px-5 py-2.5 font-bold">Product</th>
                    <th scope="col" className="px-3 py-2.5 font-bold">Customer</th>
                    <th scope="col" className="px-3 py-2.5 font-bold">Amount</th>
                    <th scope="col" className="px-5 py-2.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLoans.map((loan, index) => (
                    <tr key={`${loanApplicationNo(loan)}-${index}`}>
                      <td className="px-5 py-3">
                        <p className="text-[13px] font-bold text-slate-800">{loanProductName(loan)}</p>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{loanApplicationNo(loan)}</p>
                      </td>
                      <td className="px-3 py-3 text-[12.5px] text-slate-600">{loanCustomerName(loan) || "—"}</td>
                      <td className="px-3 py-3 text-[12.5px] font-semibold text-slate-700">{formatRupees(loanAmount(loan))}</td>
                      <td className="px-5 py-3"><FranchiseStatusChip status={loanStatus(loan)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Newest customers */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="recent-customers-heading">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 id="recent-customers-heading" className="text-[15px] font-extrabold text-slate-800">
                Newest customers
              </h2>
              <p className="mt-0.5 text-[11.5px] text-slate-500">Registered most recently.</p>
            </div>
            <Button variant="link" size="sm" onClick={() => goToSection("customers")}>
              View all →
            </Button>
          </div>

          {customersError ? (
            <div className="px-5 py-6">
              <p role="alert" className="text-[12.5px] font-semibold text-red-700">{customersError}</p>
              <Button variant="link" size="sm" onClick={onReloadCustomers}>Try again</Button>
            </div>
          ) : loadingCustomers && customers.length === 0 ? (
            <p className="flex items-center gap-2 px-5 py-8 text-[12.5px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Loading customers…
            </p>
          ) : recentCustomers.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[13px] font-bold text-slate-700">No customers yet</p>
              <p className="mt-1 text-[12px] text-slate-500">Register your first client to get started.</p>
              <Button size="sm" className="mt-3" onClick={() => goToSection("customers")}>Register customer</Button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentCustomers.map((customer) => (
                <li key={customer._id} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10.5px] font-extrabold"
                    style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
                    aria-hidden="true"
                  >
                    {fullNameInitials(customer.fullName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-slate-800">{customer.fullName || "Unnamed customer"}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{customer.mobile || "—"}</p>
                  </div>
                  <span className="shrink-0 text-[10.5px] font-semibold text-slate-400">{formatDate(customer.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default OverviewPanel;
