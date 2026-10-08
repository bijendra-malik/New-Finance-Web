import { useState, useEffect } from "react";
import { PAN_REGEX, isAtLeastAge, latestDobForAge } from "../../utils/validation";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../utils/apiError";
import { mergeAccountDetails, readAccountRecord } from "../../utils/accountProfile";
import { applyRegister } from "../../api/auth";

// ── Loan type → dashboard route ───────────────────────────────────────────────

const dashboardRoutes: Record<string, string> = {
  "Personal Loan":            "/dashboard/personalloan",
  "Business Loan":            "/dashboard/businessloan",
  "Home Loan":                "/dashboard/homeloan",
  "Vehicle Loan":             "/dashboard/carloan",
  "Education Loan":           "/dashboard/educationloan",
  "Loan Against Property":    "/dashboard/loanagainstproperty",
  "Balance Transfer":         "/dashboard/balancetransfer",
  "Credit Card":              "/dashboard/creditcard",

  "Premium Credit Cards":     "/dashboard/creditcard",
  "Project Loan":             "/dashboard/projectloan",
  "Commercial Purchase":      "/dashboard/commercialpurchase",
  "Commercial Purchase Loan": "/dashboard/commercialpurchase",
  "Working Capital":          "/dashboard/workingcapital",
  "Working Capital Loan":     "/dashboard/workingcapital",
  "Lease Rental Discounting": "/dashboard/leaserental",
  "Film Funding":             "/dashboard/filmfunding",
  "OD CC Limit":               "/dashboard/odcclimit",
  "Loan Against Share":        "/dashboard/loanagainstshare",
  "NPA":                       "/dashboard/npa",
  "Gold Loan":                 "/dashboard/goldloan",
  "FDI":                       "/dashboard/fdi",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

type Step = "details" | "eligibility" | "form";

const OCCUPATIONS = ["Salaried", "Self-Employed", "Business Owner", "Freelancer", "Student", "Retired"];

// PAN validation lives in src/utils/validation.ts (PAN_REGEX) — the same
// rule the dashboard panels already use; the modal just reuses it here.

interface EligResult {
  eligible: boolean;
  maxLoan: string;
  emi: string;
  message: string;
}

/** ₹1,23,456 — same formatting as the public eligibility calculator. */
const fmt = (n: number) =>
  "₹" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// ── Inline Spinner ─────────────────────────────────────────────────────────────

const Spinner = ({ small }: { small?: boolean }) => (
  <svg className={`${small ? "w-3.5 h-3.5" : "w-4 h-4"} animate-spin shrink-0`} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// ── Reusable Field ─────────────────────────────────────────────────────────────

const Field = ({
  label, type, name, value, onChange, placeholder, error, disabled,  maxLength, max, extraCls = "", required = true,
}: {
  label: string; type: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; disabled?: boolean; maxLength?: number; max?: string; extraCls?: string; required?: boolean;
}) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
      {label} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type} name={name} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled} maxLength={maxLength} max={max}
      className={`w-full px-3.5 py-2.5 border border-(--form-field-border) rounded-lg text-sm transition-all
        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
        disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${extraCls}
        ${error ? "border-red-400" : ""}`}
      style={error ? { borderColor: "#ef4444" } : undefined}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────

const ApplicationModal = ({
  isOpen,
  onClose,
  productName = "",
}: ApplicationModalProps) => {
  const productNameFirstWord = productName.trim().split(/\s+/)[0]?.toLowerCase();
  const navigate  = useNavigate();
  // Read the account on every render while open: it's external state that is
  // usually created *after* this component first mounts (sign-up runs while
  // it's already mounted), so a mount-time memo would go stale.
  const account = isOpen ? readAccountRecord() : null;
  // The account created in the header panel — shown read-only below.
  const accountMobile = (account?.phone ?? "").replace(/\D/g, "").slice(-10);

  // ── Step ─────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("details");

  // ── Eligibility fields — POST /customer/apply-register { product, dob, panNumber }
  // The product is the one the visitor chose to apply for (prop), never picked here.
  const [dob, setDob] = useState(() => readAccountRecord()?.dob ?? "");
  const [pan, __setPan] = useState(() => (readAccountRecord()?.pan ?? "").toUpperCase());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Eligibility test — occupation / income / existing EMIs ────────────────
  const [occupation,    setOccupation]    = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEmi,   setExistingEmi]   = useState("");
  const [authorized,    setAuthorized]    = useState(false);
  const [eligErrors,    setEligErrors]    = useState<Record<string, string>>({});
  const [eligResult,    setEligResult]    = useState<EligResult | null>(null);

  // ── PAN-format setter (the structured "autostop" A→Z then 0-9 flush) ─────
  // "Autostop alphanumeric letters": while typing, keep A-Z letters until the
  // 5-letter block is full, then only accept 0-9 digits for the next 4 slots;
  // slot 10 accepts a letter only — the check letter from the card.
  const setPan = function (v: string) {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    let structured = "";
    for (const c of clean) {
      const pos = structured.length;
      if (pos < 5 && /[A-Z]/.test(c)) structured += c;                 // letters autostop at 5
      else if (pos >= 5 && pos < 9 && /[0-9]/.test(c)) structured += c; // digits autostop at 4
      else if (pos === 9 && /[A-Z]/.test(c)) structured += c;           // check letter only
    }
    __setPan(structured);
    setFieldErrors((p) => ({ ...p, pan: "" }));
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────
  const [isSending,  setIsSending]  = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [apiError,   setApiError]   = useState("");

  // ── Right-side error popups ────────────────────────────────────────────────
  const [errorToasts, setErrorToasts] = useState<{ id: number; msg: string }[]>([]);
  const pushErrors = (msgs: string[]) => {
    msgs.forEach((msg, i) => {
      const id = Date.now() + i;
      setErrorToasts((list) => (list.some((x) => x.msg === msg) ? list : [...list, { id, msg }]));
      setTimeout(() => setErrorToasts((list) => list.filter((x) => x.id !== id)), 4500);
    });
  };

  const isBusy = isSending || isChecking;

  const resetAll = () => {
    setStep("details");
    setDob(account?.dob ?? "");
    __setPan((account?.pan ?? "").toUpperCase());
    setFieldErrors({});
    setOccupation("");
    setMonthlyIncome("");
    setExistingEmi("");
    setAuthorized(false);
    setEligErrors({});
    setEligResult(null);
    setApiError("");
    setErrorToasts([]);
  };

  const handleClose = () => {
    if (isBusy) return;
    resetAll();
    onClose();
  };

  // Escape closes the panel, like the backdrop and the Cancel button.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Freeze the page behind the popup, so only the popup's own areas scroll.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Validate eligibility fields ───────────────────────────────────────────

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!accountMobile) e.account = "No account found — create one from the Login menu first";
    if (!dob) e.dob = "Date of birth is required";
    else if (!isAtLeastAge(dob, 21)) e.dob = "You must be at least 21 years old to apply for a loan";
    validatePan("pan", pan, e);
    setFieldErrors(e);
    if (Object.keys(e).length) pushErrors(Object.values(e));
    return Object.keys(e).length === 0;
  };

  const validatePan = (name: "pan", value: string, e: Record<string, string>) => {
    if (!value.trim()) { e[name] = "PAN is required"; return; }
    if (!PAN_REGEX.test(value)) { e[name] = "Enter a valid PAN, e.g. ABCDE1234F"; return; }
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────


  const handleDetailsSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setIsSending(true);
    setApiError("");
    try {
      await applyRegister({
        product: productNameFirstWord,
        dob,
        panNumber: pan,
      });
      mergeAccountDetails({ dob, pan });
      setStep("eligibility");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to save your details. Please try again.");
      setApiError(msg);
      pushErrors([msg]);
    } finally {
      setIsSending(false);
    }
  };

  // ── Step 2 — Eligibility test (same rule as the public calculator:
  // net monthly income minus existing EMIs must clear ₹15,000) ────────────────

  const validateEligibility = () => {
    const e: Record<string, string> = {};
    if (!occupation) e.occupation = "Select your occupation";
    if (!monthlyIncome) e.monthlyIncome = "Net monthly income is required";
    else if (!(parseFloat(monthlyIncome) > 0)) e.monthlyIncome = "Enter a valid income";
    if (!authorized) e.authorized = "Please authorise to proceed";
    setEligErrors(e);
    if (Object.keys(e).length) pushErrors(Object.values(e));
    return Object.keys(e).length === 0;
  };

  const handleEligibility = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateEligibility()) return;

    setIsChecking(true);
    setTimeout(() => {
      const income = parseFloat(monthlyIncome) || 0;
      const emiAmt = parseFloat(existingEmi) || 0;
      const net = income - emiAmt;
      const eligible = net >= 15000;
      const maxLoan = Math.floor((net * 0.5 * 60) / 1000) * 1000;
      const firstName = account?.name?.split(" ")[0] || "there";
      const result: EligResult = {
        eligible,
        maxLoan: eligible ? fmt(maxLoan) : "₹0",
        emi: eligible ? fmt(Math.round(maxLoan / 60)) : "₹0",
        message: eligible
          ? `Great news, ${firstName}! Based on your profile, you may be eligible for a loan up to ${fmt(maxLoan)}.`
          : "Your current income or obligations may not meet the minimum eligibility threshold. Try reducing existing EMIs or applying with a co-applicant.",
      };
      setEligResult(result);
      setIsChecking(false);
      // Eligible → straight to the hand-off screen for the application form.
      if (result.eligible) setStep("form");
    }, 900);
  };

  // ── Step 3 — Open the product's application form (dashboard) ─────────────────

  const handleOpenForm = () => {
    resetAll();
    onClose();
    navigate(dashboardRoutes[productNameFirstWord] ?? "/dashboard/personalloan");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  // Portalled to <body>: an ancestor with its own stacking context (e.g. the
  // hero's `absolute z-10` wrapper) would otherwise trap the popup under the
  // header, no matter how high its z-index is.
  return createPortal(
    <>
      {/* Backdrop — above the header (z-55) */}
      <div
        className="fixed inset-0 bg-black/50 z-90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal — single-card eligibility gateway */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-3 sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          className="w-full max-w-xl min-w-0 flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white max-h-[92vh]"
        >

          {/* ── Header band — navy, single column: this is the eligibility
              gateway, not a login panel ── */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-(--brand-navy) via-(--brand-dark) to-(--brand-navy-deep) text-white">
            <div className="h-1 w-full bg-(--brand-teal)" />
            <div className="px-5 py-3.5 sm:px-6 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    text-[10px] font-bold uppercase tracking-wider bg-(--brand-yellow) text-(--brand-dark)
                    shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    Eligibility check
                  </span>
                  <h2 id="apply-modal-title" className="mt-1.5 text-lg sm:text-xl font-extrabold tracking-tight">
                    {productName}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    Two quick details to check your eligibility, then the application form.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="shrink-0 rounded-lg border border-white/25 bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/70 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Step rail — this flow's real sequence */}
              <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">

                {[
                  { label: "Your details",     active: step === "details" },
                  { label: "Eligibility test", active: step === "eligibility" },
                  { label: "Application form", active: step === "form" },
                ].map((s, i, arr) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
                      text-[11px] font-bold uppercase tracking-wider transition-all
                      ${s.active
                        ? "bg-(--brand-teal) text-white shadow-(--brand-teal-44)"
                        : "bg-white/10 text-white/55 border border-white/15"}`}>
                      {s.active && (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {i + 1}. {s.label}
                    </span>
                    {i < arr.length - 1 && (
                      <span aria-hidden className="text-white/30 text-xs">→</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bg-white overflow-hidden">

            {/* ── Body (scrolls when taller than the card) ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3.5 md:px-6 md:py-4">

              {/* API-level error */}
              {apiError && (
                <div className="mb-4 bg-(--form-error-bg) border border-red-200 rounded-lg px-4 py-3
                  text-sm text-red-600 flex gap-2.5 items-start">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* ── Details step: locked record + PAN inputs ── */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-3" noValidate>
                  {fieldErrors.account && (
                    <p className="text-xs font-medium text-red-500">{fieldErrors.account}</p>
                  )}
                  {!account && !fieldErrors.account && (
                    <p className="text-xs font-medium text-amber-600">
                      No account found — create one from the Login menu first.
                    </p>
                  )}

                  {/* Registered details — created at sign-up, not editable here */}
                  <section
                    aria-labelledby="registered-details-heading"
                    className="rounded-xl border border-dashed border-(--brand-teal-60) bg-(--form-subtle-bg) px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        id="registered-details-heading"
                        className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--brand-navy)"
                      >
                        Registered details
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-(--brand-yellow)/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Locked
                      </span>
                    </div>
                    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                      {([
                        ["Full name", account?.name],
                        ["Mobile", accountMobile ? `+91 ${accountMobile}` : ""],
                        ["Email", account?.email],
                        ["Role", account?.role],
                        ["Country", account?.country],
                      ] as const).map(([label, value]) => (
                        <div key={label} className="min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                          <dd className="truncate text-sm font-semibold text-slate-700">{value || "—"}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2 text-[11px] leading-snug text-slate-500">
                      Created when you registered — these carry into every application form and can't be changed here.
                    </p>
                  </section>

                  {/* Product — the one chosen to apply for; sent unchanged */}
                  <div className="rounded-xl border border-(--brand-teal)/30 bg-(--brand-teal-14) px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                    <p className="mt-0.5 flex items-center gap-2 text-sm font-bold text-slate-800">
                      <svg className="h-4 w-4 shrink-0 text-(--brand-teal)" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {productName}
                    </p>
                  </div>

                  {/* DOB + PAN — from PAN card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <Field
                      label="Date of Birth" type="date" name="dob"
                      value={dob}
                      max={latestDobForAge(21)}
                      onChange={(v) => { setDob(v); setFieldErrors((p) => ({ ...p, dob: "" })); }}
                      error={fieldErrors.dob} disabled={isSending}
                    />
                    <Field
                      label="PAN Number" type="text" name="pan"
                      value={pan}
                      maxLength={10}
                      onChange={(v) => { setPan(v); setFieldErrors((p) => ({ ...p, pan: "" })); }}
                      placeholder="ABCDE1234F"
                      error={fieldErrors.pan} disabled={isSending}
                      extraCls="uppercase tracking-wider"
                    />
                   </div>

                  {/* Subtle note — these come from PAN card */}
                  <p className="text-xs text-slate-400 -mt-1">
                    DOB &amp; PAN must match your PAN card.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={handleClose} disabled={isSending}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600
                        border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition
                        focus:outline-none focus:ring-2 focus:ring-slate-200">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSending}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70
                        flex items-center justify-center gap-2 transition
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)
                        from-(--brand-navy) to-(--brand-dark) hover:from-(--brand-dark)
                        hover:to-(--brand-navy-deep) shadow-(--brand-navy-44)"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}>
                      {isSending ? <><Spinner /> Saving...</> : "Continue →"}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Eligibility test step: income + EMIs ── */}
              {step === "eligibility" && !eligResult && (
                <form onSubmit={handleEligibility} className="space-y-3" noValidate>
                  <div>
                    <h2 className="text-lg font-bold text-(--form-dark)">Eligibility test</h2>
                    <p className="text-xs text-(--brand-gray) mt-0.5">
                      A quick check on your income and existing EMIs — nothing is sent to a lender yet.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                        Occupation <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <select
                        value={occupation}
                        disabled={isChecking}
                        onChange={(e) => { setOccupation(e.target.value); setEligErrors((p) => ({ ...p, occupation: "" })); }}
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-white transition-all
                          focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
                          disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed
                          ${eligErrors.occupation ? "border-red-400" : "border-(--form-field-border)"}`}
                        style={eligErrors.occupation ? { borderColor: "#ef4444" } : undefined}
                      >
                        <option value="">Select occupation</option>
                        {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {eligErrors.occupation && <p className="text-xs text-red-500 mt-1">{eligErrors.occupation}</p>}
                    </div>
                    <Field
                      label="Net Monthly Income" type="number" name="monthlyIncome"
                      value={monthlyIncome}
                      placeholder="e.g. 50000"
                      onChange={(v) => { setMonthlyIncome(v); setEligErrors((p) => ({ ...p, monthlyIncome: "" })); }}
                      error={eligErrors.monthlyIncome} disabled={isChecking}
                    />
                  </div>

                  <Field
                    label="Existing EMI (if any)" type="number" name="existingEmi"
                    value={existingEmi}
                    placeholder="e.g. 5000"
                    required={false}
                    onChange={(v) => setExistingEmi(v)}
                    disabled={isChecking}
                  />

                  <hr className="border-slate-100" />

                  {/* Authorise */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={authorized}
                        disabled={isChecking}
                        onChange={(e) => { setAuthorized(e.target.checked); setEligErrors((p) => ({ ...p, authorized: "" })); }}
                        className="sr-only"
                      />
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition
                        ${authorized
                          ? "border-(--brand-teal) bg-(--brand-teal)"
                          : eligErrors.authorized ? "border-red-400" : "border-slate-300 group-hover:border-(--brand-teal)"}`}>
                        <svg className={`h-3.5 w-3.5 text-white transition ${authorized ? "opacity-100" : "opacity-0"}`}
                          fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-xs leading-relaxed text-slate-500">
                        I authorise Indexia Finance and its partner providers to call or SMS me about this application and agree to the{" "}
                        <span className="font-semibold text-(--brand-navy) underline">Terms of use</span>.
                      </span>
                    </label>
                    {eligErrors.authorized && <p className="ml-8 mt-1 text-xs text-red-500">{eligErrors.authorized}</p>}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep("details")} disabled={isChecking}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600
                        border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition
                        focus:outline-none focus:ring-2 focus:ring-slate-200">
                      ← Back
                    </button>
                    <button type="submit" disabled={isChecking}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-70
                        flex items-center justify-center gap-2 transition
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}>
                      {isChecking ? <><Spinner /> Checking...</> : "Check eligibility →"}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Not eligible — stays on the eligibility step ── */}
              {step === "eligibility" && eligResult && !eligResult.eligible && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-amber-50 px-5 py-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg">
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-extrabold text-red-800">Not eligible yet</h2>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-red-700">{eligResult.message}</p>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This is an estimate only. Final eligibility is subject to lender verification, credit score, and documentation review.</span>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setEligResult(null); setStep("details"); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600
                        border border-slate-300 hover:bg-slate-50 transition
                        focus:outline-none focus:ring-2 focus:ring-slate-200">
                      ← Change details
                    </button>
                    <button type="button" onClick={() => setEligResult(null)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}>
                      Try again →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: eligible → hand off to the application form ── */}
              {step === "form" && eligResult?.eligible && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 px-5 py-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-extrabold text-emerald-800">You're eligible! 🎉</h2>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-emerald-700">{eligResult.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-teal-200 bg-white p-4 text-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Max. Loan Amount</p>
                      <p className="mt-1 text-2xl font-extrabold text-(--brand-teal)">{eligResult.maxLoan}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">Estimated eligibility</p>
                    </div>
                    <div className="rounded-xl border border-teal-200 bg-white p-4 text-center shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Monthly EMI</p>
                      <p className="mt-1 text-2xl font-extrabold text-(--brand-teal)">{eligResult.emi}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">Over 60 months</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This is an estimate only. Final eligibility is subject to lender verification, credit score, and documentation review.</span>
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    Next: fill in the <span className="font-semibold text-(--form-dark)">{productName}</span> application form — your registered details are carried into it.
                  </p>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setEligResult(null); setStep("eligibility"); }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600
                        border border-slate-300 hover:bg-slate-50 transition
                        focus:outline-none focus:ring-2 focus:ring-slate-200">
                      ← Back
                    </button>
                    <button type="button" onClick={handleOpenForm}
                      className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white
                        flex items-center justify-center gap-2 transition
                        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33)"
                      style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-dark) 100%)" }}>
                      Open application form →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right-side error popups */}
      <div className="fixed top-4 right-4 z-120 flex flex-col items-end gap-2 pointer-events-none">
        {errorToasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className="animate-toast-in max-w-76 rounded-lg border border-red-200 bg-(--form-error-bg) px-4 py-2.5 text-xs font-semibold leading-snug text-red-600 shadow-lg"
          >
            {t.msg}
          </div>
        ))}
      </div>
    </>,
    document.body
  );
};

export default ApplicationModal;

