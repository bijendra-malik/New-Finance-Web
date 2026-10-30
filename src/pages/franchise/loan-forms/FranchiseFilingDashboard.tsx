import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import ApplicantPrefillProvider from "../../../context/ApplicantPrefillProvider";
import type { ApplicantPrefill } from "../../../context/applicantPrefillContext";
import { useAuth } from "../../../context/authContext";
import FranchiseIcon from "../../../components/franchise/FranchiseIcon";
import CreditScoreGate from "../../../components/loan-eligibility/CreditScoreGate";
import { agreementTone } from "../../../components/franchise/dashboard/agreementTone";
import { fullNameInitials } from "../../../components/franchise/dashboard/franchiseFormat";
import { beginFranchiseFiling, endFranchiseFiling } from "../../../api/franchiseFiling";
import { fetchFranchiseProfile } from "../../../api/franchise";
import {
  deleteFranchiseCustomerDraft,
  fetchFranchiseCustomerDraft,
  fetchFranchiseCustomers,
  type FranchiseCustomer,
  type FranchiseCustomerDraft,
} from "../../../api/franchiseCustomers";
import { isFranchiseSignedIn, readFranchiseSession } from "../../../utils/franchiseSession";
import {
  clearPendingCreditScoreDraft,
  franchiseDraftOwner,
  onPendingCreditScoreDraftChange,
  readPendingCreditScoreDraft,
  remainingCreditScoreWindow,
  type PendingCreditScoreDraft,
} from "../../../utils/applicationFlowState";
import Modal from "../../../components/ui/Modal";
import type { LockableField } from "../../../utils/accountProfile";
import useSEO from "../../../hooks/useSEO";
import ClientPickerPanel from "./ClientPickerPanel";
import { PRODUCT_FORMS } from "./productForms";
import { productFor } from "./loanCatalogue";

type StepKey = "client" | "form" | "credit-score";

const asText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

/** The identity fields the customer record fills into the form. */
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

/**
 * The draft an owner has awaiting a credit score. `revision` is the subscription
 * tick — it re-runs the read when the draft changes, so it must stay a
 * dependency of the memo that calls this.
 */
const pendingDraftFor = (
  owner: string | null,
  revision: number,
): PendingCreditScoreDraft | null => {
  void revision;
  return owner ? readPendingCreditScoreDraft(owner) : null;
};

interface StepMeta {
  key: StepKey;
  label: string;
  short: string;
  icon: ReactNode;
  desc: string;
}

const LockBadge = ({ hint }: { hint: string }) => (
  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400" role="note">
    <FranchiseIcon name="lock" className="h-3 w-3" />
    {hint}
  </span>
);

/**
 * Filing a loan on a client's behalf, as a dashboard: the client is chosen from
 * the registry, the product form is filled against that client's locked
 * identity, and the credit score closes the application. The steps lock in
 * order — once the form is proceeded, the details are final.
 */
const FranchiseFilingDashboard = () => {
  const { productKey = "" } = useParams<{ productKey: string }>();
  const [searchParams] = useSearchParams();
  const requestedCustomerId = searchParams.get("customer");
  const { isLoggedIn } = useAuth();

  const session = readFranchiseSession();
  const product = productFor(productKey);

  useSEO({
    title: product ? `File a ${product.name} — Franchisee Dashboard` : "Filing a loan — Franchisee Dashboard",
    description:
      "File a loan application for a registered client from the Indexia Finance franchisee workspace: pick the client, fill the product form, then enter the credit score to submit.",
    path: `/franchisor-dashboard/apply/${productKey}`,
  });

  const [profile, setProfile] = useState<{ franchiseStatus?: string; name?: string } | null>(null);
  const [customers, setCustomers] = useState<FranchiseCustomer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [pickedCustomer, setPickedCustomer] = useState<FranchiseCustomer | null>(null);
  /** A step the franchisee navigated to themselves; null means "follow the flow". */
  const [view, setView] = useState<StepKey | null>(null);
  const [proceededHere, setProceededHere] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [draftView, setDraftView] = useState<{
    customerId: string;
    draft: FranchiseCustomerDraft | null;
    error: string;
  } | null>(null);
  const [discarding, setDiscarding] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [draftTick, setDraftTick] = useState(0);

  const loadCustomers = useCallback(async () => {
    setCustomersLoading(true);
    const res = await fetchFranchiseCustomers();
    if (res.ok) {
      setCustomers(res.customers);
      setCustomersError(null);
    } else {
      setCustomersError(res.message);
    }
    setCustomersLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      // Hopped off the effect body so the loading state is set in a microtask,
      // not synchronously while React is committing.
      await Promise.resolve();
      if (active) await loadCustomers();
    })();
    return () => {
      active = false;
    };
  }, [loadCustomers]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const res = await fetchFranchiseProfile();
        if (alive && res.success && res.franchise) setProfile(res.franchise);
      } catch {
        // The session already carries the agreement status; live details are a bonus.
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Re-read the draft whenever this client's pending credit-score state changes.
  useEffect(() => onPendingCreditScoreDraftChange(() => setDraftTick((tick) => tick + 1)), []);

  // The client being filed for: the one picked here, or the one named in the URL
  // (the customer registry opens the grid that way).
  const customer = useMemo(() => {
    if (pickedCustomer) return pickedCustomer;
    if (!requestedCustomerId) return null;
    return customers.find((row) => row._id === requestedCustomerId) ?? null;
  }, [pickedCustomer, requestedCustomerId, customers]);

  const pendingDraft = useMemo(
    () => pendingDraftFor(customer ? franchiseDraftOwner(customer._id) : null, draftTick),
    [customer, draftTick],
  );
  const pendingDraftId = pendingDraft?.draftId ?? "";
  const draftIsPending = Boolean(
    pendingDraft && !remainingCreditScoreWindow(pendingDraft.createdAt).expired,
  );

  const customerId = customer?._id ?? "";
  /** The draft this client has saved with the backend, shown as the form's starting point. */
  const draft = draftView && draftView.customerId === customerId ? draftView.draft : null;
  const draftError = draftView && draftView.customerId === customerId ? draftView.error : "";
  /** Once passed, the client and the form are closed: the details are final. */
  const proceeded = proceededHere || draftIsPending;
  const step: StepKey = view ?? (!customer ? "client" : proceeded ? "credit-score" : "form");

  // The saved draft this client may already have with the backend.
  useEffect(() => {
    if (!customerId) return;
    let alive = true;
    void (async () => {
      const res = await fetchFranchiseCustomerDraft(customerId);
      if (alive && res.ok) setDraftView({ customerId, draft: res.draft, error: "" });
    })();
    return () => {
      alive = false;
    };
  }, [customerId, pendingDraftId]);

  // The filing context the product form, its apply call and the credit-score gate
  // read. It is set on a module during render (not only in an effect) because the
  // credit-score gate reads it as soon as it mounts.
  const filing = useMemo(() => {
    if (!customer || !product) return null;
    const next = {
      customerId: customer._id,
      productKey: product.key,
      slug: product.key,
      identity: {
        fullName: asText(customer.fullName),
        mobile: asText(customer.mobile).replace(/\D/g, "").slice(-10),
        email: asText(customer.email),
      },
    };
    beginFranchiseFiling(next);
    return next;
  }, [customer, product]);

  useEffect(() => {
    if (!filing) return;
    beginFranchiseFiling(filing);
    return () => endFranchiseFiling();
  }, [filing]);

  const identity = useMemo(() => (customer ? customerIdentity(customer) : {}), [customer]);
  const prefill = useMemo<ApplicantPrefill>(
    () => ({
      identity,
      lockIdentity: false,
      note: customer
        ? `Name, mobile, email, date of birth, PAN and address are prefilled from the registered customer record for ${customer.fullName}. Check them before you proceed — any correction is saved with this application.`
        : "",
    }),
    [identity, customer],
  );

  const agreementStatus = profile?.franchiseStatus ?? session?.franchiseStatus;
  const status = agreementTone(agreementStatus);
  const canSubmit = (agreementStatus ?? "").trim().toLowerCase() !== "suspended";
  const franchiseName = profile?.name ?? session?.name ?? "Franchise partner";

  const handleDiscardDraft = async () => {
    if (!customer || discarding) return;
    setConfirmDiscardOpen(false);
    setDiscarding(true);
    setDraftView({ customerId: customer._id, draft, error: "" });
    const result = await deleteFranchiseCustomerDraft(customer._id);
    setDiscarding(false);
    if (!result.ok) {
      setDraftView({ customerId: customer._id, draft, error: result.message });
      return;
    }
    if (readPendingCreditScoreDraft(franchiseDraftOwner(customer._id))) {
      clearPendingCreditScoreDraft();
      setProceededHere(false);
      setFinalized(false);
      setView(null);
    }
    setDraftView({ customerId: customer._id, draft: null, error: "" });
  };

  /** The review panel was confirmed: the details are final from here on. */
  const handleProceed = () => {
    setProceededHere(true);
    setView(null);
  };

  // ── Signed-out guard ───────────────────────────────────────────────────────
  if (!session || !isFranchiseSignedIn() || !isLoggedIn) {
    return <Navigate to="/franchisor-dashboard" replace />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-lg font-extrabold text-slate-800">That product is not available</h1>
          <p className="mt-1 text-[12.5px] leading-6 text-slate-500">
            “{productKey}” is not one of the products filed through the franchise portal. Pick a
            product from the Apply Loan section to start filing.
          </p>
          <Link
            to="/franchisor-dashboard?section=apply"
            className="mt-4 inline-flex rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
          >
            Back to Apply Loan
          </Link>
        </div>
      </div>
    );
  }

  const steps: StepMeta[] = [
    {
      key: "client",
      label: "Customer",
      short: "Customer",
      icon: <FranchiseIcon name="user" className="h-4 w-4" />,
      desc: "Who this application is filed for",
    },
    {
      key: "form",
      label: "Application Form",
      short: "Application",
      icon: <FranchiseIcon name="pen-line" className="h-4 w-4" />,
      desc: `${product.name} details — the customer portal's own form`,
    },
    {
      key: "credit-score",
      label: "Credit Score",
      short: "Credit Score",
      icon: <FranchiseIcon name="scale" className="h-4 w-4" />,
      desc: "Check eligibility and submit",
    },
  ];

  const locked = (key: StepKey): string => {
    if (key === "client") return proceeded ? "Locked — filed for this customer" : "";
    if (key === "form") {
      if (proceeded) return "Locked — details are final";
      return customer ? "" : "Choose the customer first";
    }
    return proceeded ? "" : "Available after you proceed from the form";
  };

  const ProductForm = PRODUCT_FORMS[product.key] ?? null;

  const clientPanel = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Customer</p>
      {customer ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
              aria-hidden="true"
            >
              {fullNameInitials(customer.fullName)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-extrabold text-slate-800">{customer.fullName}</p>
              <p className="truncate text-[11.5px] text-slate-500">{customer.mobile}</p>
            </div>
          </div>
          <dl className="mt-3.5 space-y-2">
            {[
              ["PAN", customer.panNumber],
              ["Date of birth", customer.dob ? String(customer.dob).slice(0, 10) : ""],
              ["City", [customer.city, customer.state].filter(Boolean).join(", ")],
              ["Pincode", customer.pincode],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                  <dd className="min-w-0 truncate text-[12px] font-semibold text-slate-700">{value}</dd>
                </div>
              ))}
          </dl>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-slate-500">
            <FranchiseIcon name="lock" className="mt-0.5 h-3 w-3 shrink-0" />
            Taken from the customer record.
          </p>
          {!proceeded && (
            <button
              type="button"
              onClick={() => setView("client")}
              className="mt-2 text-[11.5px] font-bold text-(--brand-teal) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
            >
              Change customer
            </button>
          )}
        </>
      ) : (
        <p className="mt-2 text-[12px] leading-5 text-slate-500">
          No customer selected yet. Choose one from the registry to file this {product.name}.
        </p>
      )}
    </div>
  );

  const filingPanel = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">This filing</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg" style={{ background: "var(--brand-navy-14)" }} aria-hidden="true">
          {product.icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-extrabold text-slate-800">{product.name}</p>
          <p className="text-[11px] text-slate-500">{product.category}</p>
        </div>
      </div>
      <dl className="mt-3.5 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Franchise ID</dt>
          <dd className="text-[12px] font-semibold text-slate-700">{session.franchiseId}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</dt>
          <dd className="text-right text-[12px] font-semibold text-slate-700">{product.amount}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenure</dt>
          <dd className="text-right text-[12px] font-semibold text-slate-700">{product.tenure}</dd>
        </div>
      </dl>
      <div className="mt-3.5 rounded-xl px-3 py-2.5" style={{ background: "var(--brand-navy-14)" }}>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-(--brand-navy)">Application state</p>
        <p className="mt-0.5 text-[12px] font-semibold text-slate-700">
          {finalized
            ? "Submitted — the lenders have it"              : draftIsPending
                ? "Draft saved — awaiting its credit score"
                : proceeded
                  ? "Details final — enter the credit score"
                  : draft
                    ? "Unfinished draft saved"
                    : "Not started yet"}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="flex overflow-hidden"
      style={{ background: "var(--form-page-bg)", marginTop: "var(--header-h)", height: "calc(100vh - var(--header-h))" }}
    >
      {/* LEFT SIDEBAR — franchise identity and the filing steps */}
      <aside
        className="hidden md:flex w-64 shrink-0 flex-col overflow-y-auto border-r"
        style={{ background: "linear-gradient(180deg, var(--brand-navy-deep) 0%, var(--brand-navy) 100%)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="border-b px-5 py-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
              style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-yellow))", color: "var(--brand-navy-deep)" }}
              aria-hidden="true"
            >
              {fullNameInitials(franchiseName)}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: "var(--brand-yellow)" }}>
                Franchisee
              </p>
              <p className="truncate text-[13.5px] font-bold leading-tight text-white">{franchiseName}</p>
              <p className="mt-0.5 truncate text-[11px] text-white/50">ID {session.franchiseId}</p>
            </div>
          </div>
          <span
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
            style={{ background: status.bg, border: `1px solid ${status.border}`, color: status.text }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.text }} aria-hidden="true" />
            {status.label}
          </span>
        </div>

        <nav aria-label="Filing steps" className="flex-1 px-3 py-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            Filing steps
          </p>
          <ol className="space-y-1">
            {steps.map((meta, index) => {
              const hint = locked(meta.key);
              const isLocked = Boolean(hint);
              const active = step === meta.key;
              return (
                <li key={meta.key}>
                  {index > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5" aria-hidden="true">
                      <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {isLocked ? "Locked" : "Next step"}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { if (!isLocked) setView(meta.key); }}
                    disabled={isLocked}
                    aria-current={active ? "step" : undefined}
                    aria-disabled={isLocked}
                    title={isLocked ? hint : undefined}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all disabled:cursor-not-allowed"
                    style={active
                      ? { background: "rgba(255,255,255,0.15)", borderLeft: "3px solid var(--brand-teal)" }
                      : { background: "transparent", borderLeft: "3px solid transparent", opacity: isLocked ? 0.5 : 1 }}
                  >
                    <span className="shrink-0 text-white/80">{meta.icon}</span>
                    <span className="min-w-0">
                      <span className={`block text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-white/70"}`}>
                        {meta.label}
                      </span>
                      <span className="block text-[10px] leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {isLocked ? hint : meta.desc}
                      </span>
                    </span>
                    <span className="ml-auto shrink-0 text-white/60" aria-hidden="true">
                      {isLocked ? <FranchiseIcon name="lock" className="h-3 w-3" /> : "✓"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="px-4 pb-5">
          <Link
            to="/franchisor-dashboard?section=apply"
            className="block rounded-xl px-3 py-2.5 text-center text-[11.5px] font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            ← Back to dashboard
          </Link>
        </div>
      </aside>

      {/* CENTER — the active step */}
      <main id="filing-dashboard-main" className="h-full flex-1 overflow-y-auto">
        <div
          className="md:hidden sticky top-0 z-20 flex border-b"
          style={{ background: "linear-gradient(90deg,var(--brand-navy-deep),var(--brand-navy))", borderColor: "rgba(255,255,255,0.1)" }}
        >
          {steps.map((meta) => {
            const isLocked = Boolean(locked(meta.key));
            const active = step === meta.key;
            return (
              <button
                key={meta.key}
                type="button"
                onClick={() => { if (!isLocked) setView(meta.key); }}
                disabled={isLocked}
                aria-current={active ? "step" : undefined}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-all disabled:cursor-not-allowed"
                style={active
                  ? { borderBottom: "2px solid var(--brand-teal)", color: "#fff" }
                  : { borderBottom: "2px solid transparent", color: "rgba(255,255,255,0.5)", opacity: isLocked ? 0.55 : 1 }}
              >
                <span>{isLocked ? "🔒" : meta.icon}</span>
                <span className="text-[9px] font-semibold whitespace-nowrap">{meta.short}</span>
              </button>
            );
          })}
        </div>

        <div className="px-4 py-6 md:px-8 md:py-9">
          <div className="mb-6">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Franchisee filing · {product.name}
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-slate-800 md:text-[22px]">
              {steps.find((meta) => meta.key === step)?.label}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{steps.find((meta) => meta.key === step)?.desc}</p>
            <div className="mt-2 h-0.5 w-12 rounded-full" style={{ background: "linear-gradient(90deg,var(--brand-teal),var(--brand-navy))" }} />
          </div>

          {!canSubmit && (
            <p
              role="status"
              className="mb-5 rounded-xl px-4 py-3 text-[12.5px] font-semibold"
              style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)", color: "#8a5a00" }}
            >
              Filing unlocks once your franchise agreement is active. You can still review customers
              and loans from the dashboard.
            </p>
          )}

          {step === "client" && (
            <ClientPickerPanel
              customers={customers}
              loading={customersLoading}
              error={customersError}
              onReload={() => void loadCustomers()}
              productName={product.name}
              selectedId={customerId}
              onPick={(picked) => {
                setPickedCustomer(picked);
                setView(null);
              }}
            />
          )}

          {step === "form" && customer && (
            <div className="space-y-4">
              {draft && (
                <div
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)" }}
                >
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold" style={{ color: "#92620a" }}>
                      An unfinished draft application is already saved for this client.
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: "#92620a" }}>
                      Discard it to drop the draft and start this application over — nothing has been
                      sent to the lenders yet.
                    </p>
                    {draftError && (
                      <p role="alert" className="mt-1 text-[12px] font-semibold text-red-600">{draftError}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmDiscardOpen(true)}
                    disabled={discarding}
                    className="shrink-0 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-[12px] font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {discarding ? "Discarding…" : "Discard draft"}
                  </button>
                </div>
              )}

              {!canSubmit ? (
                <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12.5px] font-semibold text-slate-500">
                  The form opens once your franchise agreement is active and verified.
                </p>
              ) : ProductForm ? (
                <ApplicantPrefillProvider value={prefill}>
                  <Suspense
                    fallback={
                      <p className="flex items-center gap-2 py-6 text-[12.5px] font-semibold text-slate-500">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--brand-teal-40) border-t-(--brand-teal)" aria-hidden="true" />
                        Loading the {product.name} form…
                      </p>
                    }
                  >
                    <ProductForm userName={customer.fullName} userEmail={customer.email} onSubmit={handleProceed} />
                  </Suspense>
                </ApplicantPrefillProvider>
              ) : (
                <p
                  role="alert"
                  className="rounded-xl px-4 py-3 text-[12.5px] font-semibold"
                  style={{ background: "var(--form-error-bg, #fef2f2)", border: "1px solid var(--form-error-border, #fecaca)", color: "var(--form-error-text, #b91c1c)" }}
                >
                  The application form for this product is not available yet. Please contact the
                  franchise desk.
                </p>
              )}
            </div>
          )}

          {step === "credit-score" && customer && (
            <div className="space-y-5">
              <div
                className="rounded-2xl px-5 py-4"
                style={{ background: "var(--brand-teal-14)", border: "1px solid var(--brand-teal-33)" }}
                role="status"
              >
                <p className="text-sm font-bold text-(--brand-dark)">✓ Application details have been saved</p>
                <p className="mt-0.5 text-xs text-(--brand-gray)">
                  Filed for {customer.fullName}. The details have been saved and can no longer be
                  edited — the credit score can be entered only once.
                </p>
              </div>

              <CreditScoreGate product={product.name} dashboardPath="/franchisor-dashboard?section=apply" onFinalized={() => setFinalized(true)} />

              {finalized && (
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/franchisor-dashboard?section=loans"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[12.5px] font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    See it in All Loans
                  </Link>
                  <Link
                    to="/franchisor-dashboard?section=apply"
                    className="rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
                  >
                    File another application
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Confirm before the draft is permanently dropped. */}
      <Modal
        open={confirmDiscardOpen}
        onClose={() => setConfirmDiscardOpen(false)}
        labelledBy="discard-draft-confirm-title"
        maxWidth="max-w-md"
      >
        <div className="px-5 pt-5">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-red-600">
            Permanent action
          </p>
          <h2 id="discard-draft-confirm-title" className="mt-1 text-xl font-extrabold text-slate-900">
            Discard this draft?
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Once discarded, the saved draft for {customer?.fullName ?? "this customer"} will be
            permanently deleted and you will need to fill in the {product.name} form again.
            Nothing has been sent to the lenders yet.
          </p>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setConfirmDiscardOpen(false)}
            disabled={discarding}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep draft
          </button>
          <button
            type="button"
            onClick={() => void handleDiscardDraft()}
            disabled={discarding}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {discarding ? "Discarding…" : "Discard draft"}
          </button>
        </div>
      </Modal>

      {/* RIGHT PANEL — the client and the filing summary */}
      <aside className="hidden w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l bg-slate-50 p-4 lg:flex" style={{ borderColor: "#e2e8f0" }}>
        {clientPanel}
        {filingPanel}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Progress</p>
          <p className="mt-2 text-[12px] leading-5 text-slate-600">
            {!customer
              ? "Choose the customer this application is filed for."
              : !proceeded
                ? "Fill the form, then proceed — the details become final at that point."
                : finalized
                  ? "The application is with the lenders; its status updates in All Loans."
                  : "Details have been saved. Enter the customer's credit score to submit the application."}
          </p>
          {customer && (
            <p className="mt-3">
              <LockBadge hint="Filed under your franchise ID" />
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default FranchiseFilingDashboard;
