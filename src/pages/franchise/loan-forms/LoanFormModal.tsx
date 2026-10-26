import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ClientPickerModal from "./ClientPickerModal";
import { LOAN_KEY_TO_NAME } from "./LoanFormsMenu";
import { PRODUCT_FORMS } from "./productForms";
import ApplicantPrefillProvider from "../../../context/ApplicantPrefillProvider";
import type { ApplicantPrefill } from "../../../context/applicantPrefillContext";
import { beginFranchiseFiling, endFranchiseFiling } from "../../../api/franchiseFiling";
import {
  deleteFranchiseCustomerDraft,
  fetchFranchiseCustomerDraft,
  type FranchiseCustomer,
  type FranchiseCustomerDraft,
} from "../../../api/franchiseCustomers";
import {
  clearPendingCreditScoreDraft,
  franchiseDraftOwner,
  onPendingCreditScoreDraftChange,
  readPendingCreditScoreDraft,
} from "../../../utils/applicationFlowState";
import type { LockableField } from "../../../utils/accountProfile";

interface LoanFormModalProps {
  open: boolean;
  productKey: string | null;
  session: { franchiseId: string; name?: string; mobile?: string; email?: string; franchiseStatus?: string } | null;
  canSubmit: boolean;
  presetCustomer?: FranchiseCustomer | null;
  onClose: () => void;
}

const MODAL_ROOT = document.body;

const asText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const customerIdentity = (customer: FranchiseCustomer): Partial<Record<LockableField, string>> => {
  const candidates: [LockableField, string][] = [
    ["fullName", asText(customer.fullName)],
    ["mobile", asText(customer.mobile).replace(/\D/g, "").slice(-10)],
    ["email", asText(customer.email).toLowerCase()],
    ["dob", asText(customer.dob).slice(0, 10)],
    ["panNumber", asText(customer.panNumber).toUpperCase()],
    ["state", asText(customer.state)],
    ["city", asText(customer.city)],
    ["pincode", asText(customer.pincode)],
  ];
  return candidates.reduce<Partial<Record<LockableField, string>>>((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});
};

const LoanFormFiling = ({
  productKey,
  session,
  customer,
  onChangeCustomer,
}: {
  productKey: string;
  session: LoanFormModalProps["session"];
  customer: FranchiseCustomer;
  onChangeCustomer: () => void;
}) => {
  const identity = useMemo(() => customerIdentity(customer), [customer]);
  const identityNote = useMemo(
    () =>
      `🔒 Name, mobile, email, date of birth, PAN and address are taken from the registered customer record for ${customer.fullName} and are locked. Update the customer in Customer Registration to change them.`,
    [customer.fullName],
  );
  const prefill = useMemo<ApplicantPrefill>(() => ({ identity, note: identityNote }), [identity, identityNote]);

  const [draftView, setDraftView] = useState<{
    customerId: string;
    draft: FranchiseCustomerDraft | null;
    error: string;
  }>({ customerId: customer._id, draft: null, error: "" });
  const [discarding, setDiscarding] = useState(false);
  const [, setDraftTick] = useState(0);
  useEffect(
    () => onPendingCreditScoreDraftChange(() => setDraftTick((tick) => tick + 1)),
    [],
  );
  const openDraft = draftView.customerId === customer._id ? draftView.draft : null;
  const discardError = draftView.customerId === customer._id ? draftView.error : "";
  const awaitingCreditScore = Boolean(
    readPendingCreditScoreDraft(franchiseDraftOwner(customer._id)),
  );

  useEffect(() => {
    let alive = true;
    void (async () => {
      const result = await fetchFranchiseCustomerDraft(customer._id);
      if (!alive || !result.ok) return;
      setDraftView({ customerId: customer._id, draft: result.draft, error: "" });
    })();
    return () => {
      alive = false;
    };
  }, [customer._id, awaitingCreditScore]);

  const handleDiscardDraft = async () => {
    if (discarding) return;
    setDiscarding(true);
    const result = await deleteFranchiseCustomerDraft(customer._id);
    setDiscarding(false);
    if (!result.ok) {
      setDraftView((current) => ({ ...current, error: result.message }));
      return;
    }
    if (readPendingCreditScoreDraft(franchiseDraftOwner(customer._id))) {
      clearPendingCreditScoreDraft();
      window.location.reload();
      return;
    }
    setDraftView((current) => ({ ...current, draft: null, error: "" }));
  };

  useEffect(() => {
    beginFranchiseFiling({
      customerId: customer._id,
      productKey,
      slug: productKey,
      identity: {
        fullName: identity.fullName,
        mobile: identity.mobile,
        email: identity.email,
      },
    });
    return () => endFranchiseFiling();
  }, [customer._id, productKey, identity]);

  const ProductForm = PRODUCT_FORMS[productKey] ?? null;

  if (!ProductForm) {
    return (
      <p role="alert" className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}>
        The application form for this product is not available yet. Please contact the franchise desk.
      </p>
    );
  }

  return (
    <div>
      <div
        className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
        style={{ background: "var(--brand-navy-14)" }}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
            Filing for {customer.fullName}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-slate-600">
            {customer.mobile} · {customer.panNumber} · {customer.city}, {customer.state}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[12px] font-bold text-slate-500">Franchise {session?.franchiseId}</span>
          <button
            type="button"
            onClick={onChangeCustomer}
            className="rounded-lg px-2.5 py-1 text-[12px] font-bold text-(--brand-teal) hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
          >
            Change customer
          </button>
        </div>
      </div>

      {openDraft && (
        <div
          className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-xl px-4 py-3"
          style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)" }}
        >
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold" style={{ color: "#92620a" }}>
              {awaitingCreditScore
                ? "This client has an application draft waiting for its credit score."
                : <>
                    An unfinished draft application
                    {openDraft.product
                      ? ` (${LOAN_KEY_TO_NAME[openDraft.product] ?? openDraft.product})`
                      : ""}{" "}
                    is already saved for this client.
                  </>}
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: "#92620a" }}>
              Discard it to drop this draft and start the application over — nothing has been
              sent to the lenders yet.
            </p>
            {discardError && (
              <p role="alert" className="mt-1 text-[12px] font-semibold text-red-600">
                {discardError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => void handleDiscardDraft()}
            disabled={discarding}
            className="shrink-0 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {discarding ? "Discarding…" : "Discard draft"}
          </button>
        </div>
      )}

      <ApplicantPrefillProvider value={prefill}>
        <Suspense
          fallback={
            <p className="flex items-center gap-2 py-6 text-[12.5px] font-semibold text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
              Loading the {LOAN_KEY_TO_NAME[productKey] ?? productKey} form…
            </p>
          }
        >
          <ProductForm userName={customer.fullName} userEmail={customer.email} />
        </Suspense>
      </ApplicantPrefillProvider>
    </div>
  );
};

const LoanFormModal = ({ open, productKey, session, canSubmit, presetCustomer, onClose }: LoanFormModalProps) => {
  const [customer, setCustomer] = useState<FranchiseCustomer | null>(() => presetCustomer ?? null);

  if (!open || !productKey) return null;

  const productName = LOAN_KEY_TO_NAME[productKey] ?? productKey;

  if (!customer) {
    return (
      <ClientPickerModal
        open
        onClose={onClose}
        productName={productName}
        onPick={(picked) => setCustomer(picked)}
      />
    );
  }

  const labelledBy = "franchise-loan-form-title";

  return createPortal(
    <>
      <div className="fixed inset-0 z-90 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-110 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          className="relative flex w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[92vh] max-w-4xl"
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b" style={{ borderColor: "var(--form-divider)" }}>
            <div className="min-w-0">
              <h2 id={labelledBy} className="text-lg font-extrabold text-slate-800">
                {productName}
              </h2>
              <p className="mt-0.5 truncate text-[12px] text-slate-500">
                Applying on behalf of <span className="font-bold text-slate-700">{customer.fullName}</span>
                {" — the form, its fields and its validations are the ones the customer portal uses."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
              aria-label="Close form"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: "calc(92vh - 7rem)" }}>
            {canSubmit ? (
              <LoanFormFiling
                key={productKey}
                productKey={productKey}
                session={session}
                customer={customer}
                onChangeCustomer={() => setCustomer(null)}
              />
            ) : (
              <p role="status" className="rounded-xl px-4 py-3 text-[12.5px] font-semibold" style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)", color: "#92620a" }}>
                This form unlocks once your franchise agreement is active and verified.
              </p>
            )}
          </div>
        </div>
      </div>
    </>,
    MODAL_ROOT,
  );
};

export default LoanFormModal;
