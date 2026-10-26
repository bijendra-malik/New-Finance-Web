import { useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import { fullNameInitials } from "../../../components/franchise/dashboard/franchiseFormat";
import type { FranchiseCustomer } from "../../../api/franchiseCustomers";
import CustomerRegisterModal from "./CustomerRegisterModal";

interface ClientPickerProps {
  /** Every client registered under this franchise. */
  customers: FranchiseCustomer[];
  loading: boolean;
  error: string | null;
  /** Reloads the registry after a registration. */
  onReload: () => void;
  /** The product this filing is for, named in the panel's copy. */
  productName: string;
  /** The client already chosen, marked in the list. */
  selectedId?: string;
  onPick: (customer: FranchiseCustomer) => void;
}

/**
 * Step one of filing: choose which registered client the application is for, or
 * register a new one on the spot. Presented as a panel inside the filing
 * dashboard rather than a dialog, so the client and the form live in the same
 * workspace.
 */
const ClientPickerPanel = ({
  customers,
  loading,
  error,
  onReload,
  productName,
  selectedId,
  onPick,
}: ClientPickerProps) => {
  const [query, setQuery] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);

  const needle = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      needle
        ? customers.filter((customer) =>
            [customer.fullName, customer.mobile, customer.email, customer.panNumber]
              .filter(Boolean)
              .some((field) => String(field).toLowerCase().includes(needle)),
          )
        : customers,
    [customers, needle],
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-slate-800">Who is this {productName} for?</h2>
          <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-slate-500">
            Pick one of your registered clients. Their identity details are taken from the
            customer record and locked in the form — the application is filed under your
            franchise ID.
          </p>
        </div>
        <Button size="sm" onClick={() => setRegisterOpen(true)}>
          + Register new customer
        </Button>
      </div>

      <div className="mt-5">
        <label htmlFor="client-search" className="sr-only">
          Search customers
        </label>
        <input
          id="client-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, mobile, email or PAN"
          className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
          style={{ border: "1.5px solid var(--form-field-border, #e2e8f0)", background: "var(--form-field-bg, #fff)" }}
        />
      </div>

      <div className="mt-4">
        {loading && (
          <p className="flex items-center gap-2 py-4 text-[12.5px] font-semibold text-slate-500" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
            Loading your customers…
          </p>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl px-4 py-3"
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

        {!loading && !error && customers.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center">
            <p className="text-[13px] font-semibold text-slate-600">No customers registered yet</p>
            <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-slate-500">
              Register the client once — their name, PAN, contact and address are then reused for
              every loan you file for them.
            </p>
          </div>
        )}

        {!loading && !error && customers.length > 0 && filtered.length === 0 && (
          <p className="py-6 text-center text-[12.5px] font-semibold text-slate-500">
            No customer matches “{query.trim()}”. Try a different name, mobile number or PAN.
          </p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ul className="max-h-[52vh] space-y-2 overflow-y-auto pr-1">
            {filtered.map((customer) => {
              const isSelected = customer._id === selectedId;
              return (
                <li key={customer._id}>
                  <button
                    type="button"
                    onClick={() => onPick(customer)}
                    aria-pressed={isSelected}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
                    style={{
                      border: isSelected ? "1.5px solid var(--brand-teal)" : "1px solid #e2e8f0",
                      background: isSelected ? "var(--brand-teal-14, #f0fdfa)" : "#fff",
                    }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-extrabold text-white"
                      style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
                      aria-hidden="true"
                    >
                      {fullNameInitials(customer.fullName)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold text-slate-800">{customer.fullName}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-slate-500">
                        {[customer.mobile, customer.panNumber, [customer.city, customer.state].filter(Boolean).join(", ")]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <span className="shrink-0 text-[12px] font-bold text-(--brand-teal)">
                      {isSelected ? "Selected" : "Select →"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <CustomerRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={(customer) => {
          setRegisterOpen(false);
          onReload();
          if (customer) onPick(customer);
        }}
      />
    </div>
  );
};

export default ClientPickerPanel;
