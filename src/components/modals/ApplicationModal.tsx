import { useState, useEffect } from "react";
import { EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, PAN_REGEX, isAtLeastAge, latestDobForAge } from "../../utils/validation";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSetApplicantPrefill } from "../../context/applicantPrefillContext";
import Button from "../ui/Button";

// ── Loan type → dashboard route ───────────────────────────────────────────────

const dashboardRoutes: Readonly<Record<string, string>> = {
  "Personal Loan": "/dashboard/personalloan",
  "Business Loan": "/dashboard/businessloan",
  "Home Loan": "/dashboard/homeloan",
  "Vehicle Loan": "/dashboard/Vehicleloan",
  "Education Loan": "/dashboard/educationloan",
  "Loan Against Property": "/dashboard/loanagainstproperty",
  "Balance Transfer": "/dashboard/balancetransfer",
  "Credit Card": "/dashboard/creditcard",

  "Premium Credit Cards": "/dashboard/creditcard",
  "Project Loan": "/dashboard/projectloan",
  "Commercial Purchase": "/dashboard/commercialpurchase",
  "Commercial Purchase Loan": "/dashboard/commercialpurchase",
  "Working Capital": "/dashboard/workingcapital",
  "Working Capital Loan": "/dashboard/workingcapital",
  "Lease Rental Discounting": "/dashboard/leaserental",
  "Film Funding": "/dashboard/filmfunding",
  "OD CC Limit": "/dashboard/odcclimit",
  "Loan Against Share": "/dashboard/loanagainstshare",
  "NPA": "/dashboard/npa",
  "Gold Loan": "/dashboard/goldloan",
  "FDI": "/dashboard/fdi",
};

// Homepage globe IDs do not always match the dashboard route slug.
const productIdRoutes: Readonly<Record<string, string>> = {
  personal: "/dashboard/personalloan",
  business: "/dashboard/businessloan",
  home: "/dashboard/homeloan",
  lap: "/dashboard/loanagainstproperty",
  balanceTransfer: "/dashboard/balancetransfer",
  vehicleLoan: "/dashboard/Vehicleloan",
  creditCard: "/dashboard/creditcard",
  educationLoan: "/dashboard/educationloan",
  projectLoan: "/dashboard/projectloan",
  commercialPurchase: "/dashboard/commercialpurchase",
  leaseRentalDiscounting: "/dashboard/leaserental",
  workingCapital: "/dashboard/workingcapital",
  filmFunding: "/dashboard/filmfunding",
  odCcLimit: "/dashboard/odcclimit",
  loanAgainstShare: "/dashboard/loanagainstshare",
  goldLoan: "/dashboard/goldloan",
  fdiLoan: "/dashboard/fdi",
  npaLoan: "/dashboard/npa",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  activeProduct?: { id: string } | null;
}

// ── Reusable Field ─────────────────────────────────────────────────────────────

const Field = ({
  label, type, name, value, onChange, placeholder, error, disabled, maxLength, max, extraCls = "", required = true,
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
  activeProduct,
}: ApplicationModalProps) => {
  const navigate = useNavigate();
  const setApplicantPrefill = useSetApplicantPrefill();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [pan, __setPan] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // PAN-format setter (the structured "autostop" A→Z then 0-9 flush) "Autostop alphanumeric letters": while typing, keep A-Z letters until the 5-letter block is full, then only accept 0-9 digits for the next 4 slots; slot 10 accepts a letter only — the check letter from the card.
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
  const [apiError, setApiError] = useState("");

  const resetAll = () => {
    setFullName("");
    setMobile("");
    setEmail("");
    setDob("");
    __setPan("");
    setFieldErrors({});
    setApiError("");

  };

  const handleClose = () => {
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
    if (!fullName.trim()) e.fullName = "Full name is required";
    else if (!NAME_REGEX.test(fullName.trim())) e.fullName = "Enter a valid full name";
    if (!MOBILE_REGEX.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address";
    if (!dob) e.dob = "Date of birth is required";
    else if (!isAtLeastAge(dob, 21)) e.dob = "You must be at least 21 years old to apply for a loan";
    validatePan("pan", pan, e);
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const productKey = activeProduct?.id ?? productName;

  const validatePan = (name: "pan", value: string, e: Record<string, string>) => {
    if (!value.trim()) { e[name] = "PAN is required"; return; }
    if (!PAN_REGEX.test(value)) { e[name] = "Enter a valid PAN, e.g. ABCDE1234F"; return; }
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────


  const handleDetailsSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setApiError("");
    const dashboardPath = productIdRoutes[productKey] ?? dashboardRoutes[productKey];
    if (!dashboardPath) {
      setApiError("Application form is not available for this product yet.");
      return;
    }
    setApplicantPrefill?.({
      identity: {
        fullName: fullName.trim(),
        mobile,
        email: email.trim(),
        dob,
        panNumber: pan,
      },
      note: "Your details are carried into the application form. You can review them there.",
    });
    handleOpenForm(dashboardPath);
  };  // ── Step 2 — Open the product's application form (dashboard) ─────────────────

  const handleOpenForm = (dashboardPath: string) => {
    resetAll();
    onClose();
    navigate(dashboardPath);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  // Portalled to <body>: an ancestor with its own stacking context (e.g. the hero's `absolute z-10` wrapper) would otherwise trap the popup under the header, no matter how high its z-index is.
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
                    Add your contact and identity details to start the application.
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

              {/* Step rail */}
              <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">

                {[
                  { label: "Your details", active: true },
                  { label: "Application form", active: false },
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

            {/* Body (scrolls when taller than the card) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3.5 md:px-6 md:py-4">

              {/* API-level error */}
              {apiError && (
                <div className="mb-4 bg-(--form-error-bg) border border-red-200 rounded-lg px-4 py-3
                  text-sm text-red-600 flex gap-2.5 items-start">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* Capture applicant identity before opening the loan form. */}
              <form onSubmit={handleDetailsSubmit} className="space-y-3" noValidate>
                  {/* Product selected on the home page. */}
                  <div className="rounded-xl border border-(--brand-teal)/30 bg-(--brand-teal-14) px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                    <p className="mt-0.5 flex items-center gap-2 text-sm font-bold text-slate-800">
                      <svg className="h-4 w-4 shrink-0 text-(--brand-teal)" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {productName}
                    </p>
                  </div>

                  {/* Applicant details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <Field
                      label="Full Name" type="text" name="fullName"
                      value={fullName} onChange={(v) => { setFullName(v); setFieldErrors((p) => ({ ...p, fullName: "" })); }}
                      placeholder="As shown on your PAN card" error={fieldErrors.fullName}
                    />
                    <Field
                      label="Mobile Number" type="tel" name="mobile"
                      value={mobile} onChange={(v) => { setMobile(v.replace(/\D/g, "").slice(0, 10)); setFieldErrors((p) => ({ ...p, mobile: "" })); }}
                      placeholder="10-digit mobile number" error={fieldErrors.mobile} maxLength={10}
                    />
                    <Field
                      label="Email Address" type="email" name="email"
                      value={email} onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: "" })); }}
                      placeholder="you@example.com" error={fieldErrors.email}
                    />
                    <Field
                      label="Date of Birth" type="date" name="dob"
                      value={dob}
                      max={latestDobForAge(21)}
                      onChange={(v) => { setDob(v); setFieldErrors((p) => ({ ...p, dob: "" })); }}
                      error={fieldErrors.dob}
                    />
                    <Field
                      label="PAN Number" type="text" name="pan"
                      value={pan}
                      maxLength={10}
                      onChange={(v) => { setPan(v); setFieldErrors((p) => ({ ...p, pan: "" })); }}
                      placeholder="ABCDE1234F"
                      error={fieldErrors.pan}
                      extraCls="uppercase tracking-wider"
                    />
                  </div>

                  {/* Subtle note — these come from PAN card */}
                  <p className="text-xs text-slate-400 -mt-1">
                    Your name, date of birth and PAN should match your PAN card.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 rounded-lg font-semibold"
                      onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 rounded-lg font-semibold">
                      Continue →
                    </Button>
                  </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ApplicationModal;
