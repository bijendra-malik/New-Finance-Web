import { useMemo, useState } from "react";
import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import CustomerRegisterModal from "../../../pages/franchise/loan-forms/CustomerRegisterModal";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { dateValue, formatDate, fullNameInitials } from "./franchiseFormat";
import type { FranchiseCustomer } from "../../../api/franchiseCustomers";

interface CustomerRegistryProps {
  customers: FranchiseCustomer[];
  loading: boolean;
  error: string | null;
  /** Reloads the registry after a registration. */
  onReload: () => void;
  /** Surfaces a one-line confirmation in the page's live region. */
  onNotice: (message: string) => void;
  /** Starts the Apply Loan flow pre-set to this customer. */
  /** Called from the row / View-details buttons; also receives the customer _id so the
   * parent can pre-select a sensible default product from that customer's loans. */
  onApplyLoan: (customer: FranchiseCustomer, customerId: string) => void;
}

/**
 * Customer Registration section: every client registered under the franchise
 * (GET /franchise/customer), searchable, with the full detail and loan history
 * one click away. Registration reuses the portal's validated modal.
 */
const CustomerRegistry = ({ customers, loading, error, onReload, onNotice, onApplyLoan }: CustomerRegistryProps) => {
  const [query, setQuery] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selected, setSelected] = useState<FranchiseCustomer | null>(null);

  const sorted = useMemo(
    () => [...customers].sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt)),
    [customers],
  );

  const needle = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      needle
        ? sorted.filter((customer) =>
            [customer.fullName, customer.mobile, customer.email, customer.panNumber, customer.city, customer.state]
              .filter(Boolean)
              .some((field) => String(field).toLowerCase().includes(needle)),
          )
        : sorted,
    [sorted, needle],
  );

  const verifiedCount = customers.filter((customer) => customer.isVerified).length;

  return (
    <section aria-labelledby="customers-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="customers-heading" className="text-xl font-extrabold text-slate-800">
            Customers
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">
            {customers.length} registered under this franchise
            {customers.length > 0 ? ` · ${verifiedCount} verified` : ""}. Register once, then file any product for them.
          </p>
        </div>
        <Button size="md" onClick={() => setRegisterOpen(true)}>
          <FranchiseIcon name="user-plus" className="h-4 w-4" />
          Register customer
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl px-4 py-3"
          style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)" }}
        >
          <p className="text-[12.5px] font-bold" style={{ color: "var(--form-error-text, #b91c1c)" }}>
            Could not load your customers
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{error}</p>
          <Button variant="link" size="sm" onClick={onReload}>
            Try again
          </Button>
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <label className="relative w-full max-w-sm">
            <span className="sr-only">Search customers</span>
            <FranchiseIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, mobile, email or PAN"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pr-3 pl-9 text-[13px] text-slate-700 transition placeholder:text-slate-400 focus:border-(--brand-teal-44) focus:bg-white focus:ring-2 focus:ring-(--brand-teal-14) focus:outline-none"
            />
          </label>
          <p className="text-[11.5px] font-semibold text-slate-400">
            {filtered.length} of {customers.length} shown
          </p>
        </div>

        {loading && customers.length === 0 ? (
          <div className="px-4 py-10">
            <p className="flex items-center justify-center gap-2 text-[13px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Loading your customers…
            </p>
          </div>
        ) : customers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white"
              style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
            >
              <FranchiseIcon name="user" filled className="h-6 w-6" />
            </span>
            <h3 className="mt-3 text-[15px] font-extrabold text-slate-800">No customers yet</h3>
            <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-slate-500">
              Register your first customer with their name, PAN, contact and address — then file any loan product on
              their behalf.
            </p>
            <Button size="md" className="mt-4" onClick={() => setRegisterOpen(true)}>
              + Register your first customer
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-[13px] font-bold text-slate-700">No customer matches “{query.trim()}”</p>
            <p className="mt-1 text-[12px] text-slate-500">Try a different name, mobile number, email or PAN.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10.5px] uppercase tracking-wider text-slate-400">
                  <th scope="col" className="px-4 py-3 font-bold">Customer</th>
                  <th scope="col" className="px-4 py-3 font-bold">Contact</th>
                  <th scope="col" className="px-4 py-3 font-bold">PAN</th>
                  <th scope="col" className="px-4 py-3 font-bold">Location</th>
                  <th scope="col" className="px-4 py-3 font-bold">Registered</th>
                  <th scope="col" className="px-4 py-3 font-bold text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((customer) => (
                  <tr key={customer._id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold"
                          style={{
                            background: "var(--brand-navy-14)",
                            color: "var(--brand-navy)",
                          }}
                          aria-hidden="true"
                        >
                          {fullNameInitials(customer.fullName)}
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-bold text-slate-800">
                            {customer.fullName || "Unnamed customer"}
                            {customer.isVerified && (
                              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700">
                                ✓ Verified
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 truncate text-[11.5px] text-slate-500">{customer.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{customer.mobile || "—"}</td>
                    <td className="px-4 py-3 text-[12.5px] font-semibold tracking-wide text-slate-600">
                      {customer.panNumber || "—"}
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-slate-600">
                      {[customer.city, customer.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-500">{formatDate(customer.createdAt)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelected(customer)}>
                          View details
                        </Button>
                        <Button size="sm" onClick={() => onApplyLoan(customer, customer._id)}>
                          Apply loan
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CustomerRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={(customer) => {
          setRegisterOpen(false);
          onNotice(
            customer
              ? `${customer.fullName || "Customer"} is registered. You can now file a loan for them.`
              : "Customer registered. You can now file a loan for them.",
          );
          onReload();
        }}
      />

      <CustomerDetailsModal
        key={selected?._id ?? "closed"}
        open={Boolean(selected)}
        customer={selected}
        onClose={() => setSelected(null)}
        onApplyLoan={(customer) => {
          setSelected(null);
          onApplyLoan(customer, customer._id);
        }}
      />
    </section>
  );
};

export default CustomerRegistry;
