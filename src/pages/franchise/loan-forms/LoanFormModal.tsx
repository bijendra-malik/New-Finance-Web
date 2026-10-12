import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LoanFormModalBody from "./LoanFormModalBody";
import ClientPickerModal from "./ClientPickerModal";
import { LOAN_KEY_TO_NAME } from "./LoanFormsMenu";
import type { FranchiseCustomer } from "../../../api/franchiseCustomers";

interface LoanFormModalProps {
  session: { franchiseId: string; name?: string; mobile?: string; email?: string; franchiseStatus?: string } | null;
  profile: { name?: string; mobile?: string; email?: string; isVerified?: boolean; franchiseStatus?: string } | null;
  canSubmit: boolean;
  onRefNo: (refNo: string, productKey: string) => void;
}

const MODAL_ROOT = document.body;

const LoanFormModal = ({ session, profile, canSubmit, onRefNo }: LoanFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [productKey, setProductKey] = useState<string | null>(null);
  // The client the application is filed for — picked or registered in step one.
  const [customer, setCustomer] = useState<FranchiseCustomer | null>(null);
  const onRefNoRef = useRef(onRefNo);
  useEffect(() => { onRefNoRef.current = onRefNo; }, [onRefNo]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const { detail } = event as CustomEvent<{ productKey: string; session: typeof session; profile: typeof profile }>;
      setProductKey(detail.productKey);
      setCustomer(null);
      setOpen(true);
    };
    const onRefno = (event: Event) => {
      const { detail } = event as CustomEvent<{ refNo: string; productKey: string }>;
      onRefNoRef.current(detail.refNo, detail.productKey);
    };
    window.addEventListener("franchise-loan-form:open", onOpen);
    window.addEventListener("franchise-loan-form:refno", onRefno);
    return () => {
      window.removeEventListener("franchise-loan-form:open", onOpen);
      window.removeEventListener("franchise-loan-form:refno", onRefno);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setProductKey(null);
    setCustomer(null);
  };

  if (!open || !productKey) return null;

  // Step one: pick the client this application is for (or register a new one).
  if (!customer) {
    return (
      <ClientPickerModal
        open
        onClose={close}
        productName={LOAN_KEY_TO_NAME[productKey] ?? productKey}
        onPick={(picked) => setCustomer(picked)}
      />
    );
  }

  const labelledBy = "loan-form-modal-title";

  return createPortal(
    <>
      <div className="fixed inset-0 z-90 bg-black/55 backdrop-blur-sm" onClick={close} />
      <div className="fixed inset-0 z-110 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className="relative flex w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[92vh] max-w-4xl"
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b" style={{ borderColor: "var(--form-divider)" }}>
            <div className="min-w-0">
              <h2 id={labelledBy} className="truncate text-lg font-extrabold text-slate-800">
                {LOAN_KEY_TO_NAME[productKey] ?? productKey}
              </h2>
              <p className="mt-0.5 truncate text-[12px] text-slate-500">
                Applying for{" "}
                <span className="font-bold text-slate-700">{customer.fullName}</span> · {customer.mobile}
                {"  "}
                <button
                  type="button"
                  onClick={() => setCustomer(null)}
                  className="font-bold text-(--brand-teal) hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                >
                  Change customer
                </button>
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
              aria-label="Close form"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(92vh - 7rem)" }}>
            <LoanFormModalBody
              productKey={productKey}
              customer={customer}
              session={session}
              profile={profile}
              canSubmit={canSubmit}
              onRefNo={(refNo) => onRefNoRef.current(refNo, productKey)}
              onClose={close}
            />
          </div>
        </div>
      </div>
    </>,
    MODAL_ROOT,
  );
};

export default LoanFormModal;
