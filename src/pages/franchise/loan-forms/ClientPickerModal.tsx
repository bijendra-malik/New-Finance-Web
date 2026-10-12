import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import CustomerRegisterModal from "./CustomerRegisterModal";
import {
  fetchFranchiseCustomers,
  type FranchiseCustomer,
} from "../../../api/franchiseCustomers";

interface ClientPickerModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  /** A client was chosen (picked from the list or just registered). */
  onPick: (customer: FranchiseCustomer) => void;
}

/**
 * Step one of filing a loan on a client's behalf: pick an existing client or
 * register a new one. The form opens once a client is chosen.
 */
const ClientPickerModal = ({ open, onClose, productName, onPick }: ClientPickerModalProps) => {
  const [customers, setCustomers] = useState<FranchiseCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetchFranchiseCustomers().then((res) => {
      if (!active) return;
      if (res.ok) {
        setCustomers(res.customers);
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? customers.filter((c) =>
        [c.fullName, c.mobile, c.email, c.panNumber]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q)),
      )
    : customers;

  return (
    <>
      <Modal open={open && !registerOpen} onClose={onClose} labelledBy="client-picker-title" maxWidth="max-w-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-6 pb-3">
          <div>
            <h2 id="client-picker-title" className="text-lg font-extrabold text-slate-800">
              Select a customer for {productName}
            </h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500">
              The application will be filed under your franchise ID for this customer.
            </p>
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

        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, mobile, email or PAN"
              aria-label="Search customers"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
              style={{ border: "1.5px solid var(--form-field-border, #e2e8f0)", background: "var(--form-field-bg, #fff)" }}
            />
          </div>

          <div className="mt-4 max-h-[45vh] overflow-y-auto">
            {loading && (
              <p className="flex items-center gap-2 py-4 text-[12.5px] font-semibold text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
                Loading your customers…
              </p>
            )}
            {error && (
              <p role="alert" className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}>
                {error}
              </p>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-[13px] font-semibold text-slate-600">
                  {customers.length === 0 ? "No customers registered yet." : "No customer matches that search."}
                </p>
                <p className="mt-1 text-[12px] text-slate-500">
                  {customers.length === 0
                    ? "Register the customer first — it takes their name, PAN, contact and address."
                    : "Try a different name, mobile number or PAN."}
                </p>
              </div>
            )}
            {filtered.length > 0 && (
              <ul className="divide-y divide-slate-100">
                {filtered.map((customer) => (
                  <li key={customer._id}>
                    <button
                      type="button"
                      onClick={() => onPick(customer)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-bold text-slate-800">{customer.fullName}</p>
                        <p className="mt-0.5 truncate text-[12px] text-slate-500">
                          {customer.mobile} · {customer.panNumber} · {customer.city}, {customer.state}
                        </p>
                      </div>
                      <span className="shrink-0 text-[12px] font-bold text-(--brand-teal)">Select →</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5 rounded-xl px-4 py-3" style={{ background: "var(--brand-navy-14)" }}>
            <p className="text-[12.5px] font-semibold text-slate-700">
              New customer? Register them once — their details are reused for every loan you file.
            </p>
            <Button size="sm" className="mt-2.5" onClick={() => setRegisterOpen(true)}>
              + Register new customer
            </Button>
          </div>
        </div>
      </Modal>

      <CustomerRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegistered={(customer) => {
          setRegisterOpen(false);
          if (customer) onPick(customer);
          else {
            // No record returned — reload the list so the new client is pickable.
            fetchFranchiseCustomers().then((res) => {
              if (res.ok) setCustomers(res.customers);
            });
          }
        }}
      />
    </>
  );
};

export default ClientPickerModal;
