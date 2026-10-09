import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "../../context/authContext";
import { useMasters } from "../../hooks/useMasters";
import { verifyPincode } from "../../api/masters";
import { formatGSTIN, formatPAN } from "../../utils/formatters";
import { buildMailtoUrl } from "../../utils/mailto";
import { getApiErrorMessage } from "../../utils/apiError";
import { requestSignUp } from "../../utils/signInGate";
import { OTHER_OPTION } from "../../constants/masters";
import { EMAIL_REGEX, GSTIN_REGEX, MOBILE_REGEX, PAN_REGEX, PINCODE_REGEX } from "../../utils/validation";
import { applyFranchise } from "../../api/franchise";
import type { ApplyFranchisePayload } from "../../api/franchise";
import { FRANCHISE_EMAIL, FRANCHISE_PLANS, type FranchisePlan } from "./franchiseData";
import { PlanSummary, PackageSelector } from "./PlanSelector";
import { LocationFields } from "../form/LocationFields";
import { Field } from "../ui/FieldRenderer";

/**
 * Application fields, plus the identity fields carried over from the account the
 * visitor registered. The franchisee variant collects the business fields the
 * POST /franchise/apply contract requires; the franchisor variant only collects
 * the enquiry identity fields.
 */
export interface FranchiseFormValues {
  fullName: string;
  pan: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  businessName: string;
  businessType: string;
  businessTypeOther: string;
  gstNumber: string;
  yearsInBusiness: string;
  address: string;
  packageId: string;
}

const EMPTY: FranchiseFormValues = {
  fullName: "", pan: "", mobile: "", email: "", state: "", city: "",
  pincode: "", businessName: "", businessType: "", businessTypeOther: "",
  gstNumber: "", yearsInBusiness: "", address: "", packageId: "",
};

type FieldKey = keyof FranchiseFormValues;
type Variant = "franchisee" | "franchisor";

/** Location master response for a verified pincode. */
interface VerifiedLocation {
  pincode: string;
  state: string;
  city: string;
}

const PINCODE_DEBOUNCE_MS = 500;

interface FranchiseFormProps {
  variant: Variant;
  /** Franchisee only — controlled by the page so the plan cards can pre-select. */
  packageId?: string;
  onPackageChange?: (planId: string) => void;
}

/**
 * Shared franchisee/franchisor form.
 *
 * The franchisee variant is the "Be a Franchisor" application: it is gated on a
 * registered account, carries that account's name, mobile and email in as locked
 * fields, resolves state and city from the pincode via the location master,
 * collects the business details POST /franchise/apply expects, and posts the
 * application to the backend. On success the applicant is told they will be
 * issued a franchise ID and password, and pointed at /franchise-login.
 *
 * The franchisor variant is a lightweight enquiry and still hands the details to
 * the visitor's mail client addressed to the franchise team.
 */
const FranchiseForm = ({ variant, packageId: packageIdProp, onPackageChange }: FranchiseFormProps) => {
  const isFranchisee = variant === "franchisee";
  const { masters, loadCities } = useMasters();
  const { user, isLoggedIn } = useAuth();

  // Both variants can be mounted at once (the franchisor form opens in a modal over the page),
  // so every field id is namespaced per variant to keep the DOM ids unique.
  const fid = (name: string) => `${isFranchisee ? "ff" : "fx"}-${name}`;

  const [values, setValues] = useState<FranchiseFormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Backend responses (both the success confirmation and API errors) surface as a popup.
  const [popup, setPopup] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [mailtoHref, setMailtoHref] = useState("");
  // The city field starts as free text and upgrades to a dropdown once the city master
  // for the chosen state arrives. Once the user types, it stays free text so their input
  // is never swapped out from under them mid-entry.
  // Pincode → location master resolution state.
  const [verifiedLocation, setVerifiedLocation] = useState<VerifiedLocation | null>(null);
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "verifying" | "notFound" | "error">("idle");

  // Identity captured at registration — carried into the form and locked, so the
  // applicant cannot accidentally submit details that don't match their account.
  const identity = useMemo(
    () => ({
      fullName: user?.name?.trim() ?? "",
      mobile: (user?.mobile ?? "").replace(/\D/g, "").slice(-10),
      email: user?.email?.trim() ?? "",
    }),
    [user],
  );
  const hasIdentity = Boolean(identity.fullName || identity.mobile || identity.email);
  const isLocked = (key: "fullName" | "mobile" | "email") =>
    isFranchisee && Boolean(identity[key]);

  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !hasIdentity) return;
    prefilled.current = true;
    setValues((prev) => ({
      ...prev,
      fullName: identity.fullName || prev.fullName,
      mobile: identity.mobile || prev.mobile,
      email: identity.email || prev.email,
    }));
  }, [hasIdentity, identity]);

  const packageId = packageIdProp ?? values.packageId;
  const selectedPlan: FranchisePlan | undefined = FRANCHISE_PLANS.find((p) => p.id === packageId);

  const stateOptions = masters.states;
  const businessTypeOptions = masters.businessTypes;
  // Keep the current city selectable even if it isn't in the loaded master (for example a
  // city returned by the pincode lookup), or the dropdown would blank out the resolved value.

  const set = (key: FieldKey, value: string) => {
    setValues((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const setPackage = (id: string) => {
    setValues((p) => ({ ...p, packageId: id }));
    setErrors((p) => ({ ...p, packageId: undefined }));
    onPackageChange?.(id);
  };

  // Resolve state and city from the pincode (location master), debounced so typing does not
  // fire a lookup per keystroke. Re-resolving on a changed pincode always overwrites the
  // city, so a city left over from a previous pincode is corrected rather than kept.
  useEffect(() => {
    if (!isFranchisee) return;
    const pincode = values.pincode;
    if (!PINCODE_REGEX.test(pincode)) return; // the field's onChange has already reset it
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      setPincodeStatus("verifying");
      verifyPincode(pincode)
        .then((result) => {
          if (cancelled) return;
          if (result.exists && result.info) {
            const { state, city } = result.info;
            setVerifiedLocation({ pincode, state, city });
            setPincodeStatus("idle");
            setValues((p) => ({ ...p, state, city }));
            setErrors((p) => ({ ...p, state: undefined, city: undefined }));
          } else {
            setVerifiedLocation(null);
            setPincodeStatus("notFound");
          }
        })
        .catch(() => {
          if (cancelled) return;
          setVerifiedLocation(null);
          setPincodeStatus("error");
        });
    }, PINCODE_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [values.pincode, isFranchisee]);

  const validate = (vals: FranchiseFormValues) => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!vals.fullName.trim()) e.fullName = "Full name is required";
    if (!vals.pan.trim()) e.pan = "PAN number is required";
    else if (!PAN_REGEX.test(vals.pan)) e.pan = "Enter a valid 10-character PAN (e.g. ABCDE1234F)";
    if (!vals.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!MOBILE_REGEX.test(vals.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!vals.email.trim()) e.email = "Email address is required";
    else if (!EMAIL_REGEX.test(vals.email)) e.email = "Enter a valid email address";
    if (!vals.state.trim()) e.state = "State is required";
    if (!vals.city.trim()) e.city = "City is required";
    if (isFranchisee) {
      if (!vals.pincode.trim()) e.pincode = "Pincode is required";
      else if (!PINCODE_REGEX.test(vals.pincode)) e.pincode = "Enter a valid 6-digit pincode";
      else if (pincodeStatus === "notFound") e.pincode = "This pincode could not be found — check and re-enter";
      if (!vals.businessName.trim()) e.businessName = "Business name is required";
      if (!vals.businessType) e.businessType = "Business type is required";
      else if (vals.businessType === OTHER_OPTION && !vals.businessTypeOther.trim())
        e.businessTypeOther = "Please mention the business type";
      if (vals.gstNumber.trim() && !GSTIN_REGEX.test(vals.gstNumber.toUpperCase()))
        e.gstNumber = "Enter a valid GST number (15-character GSTIN)";
      if (!vals.yearsInBusiness.trim()) e.yearsInBusiness = "Years in business is required";
      else if (!/^\d{1,2}$/.test(vals.yearsInBusiness.trim()))
        e.yearsInBusiness = "Enter years as a number (0–99)";
      if (!vals.address.trim()) e.address = "Address is required";
      if (!packageId) e.packageId = "Select the package duration you are interested in";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Franchisor enquiry — unchanged mail-client hand-off. */
  const submitEnquiry = (vals: FranchiseFormValues) => {
    const rows = [
      { label: "Full Name", value: vals.fullName },
      { label: "PAN Number", value: vals.pan },
      { label: "Mobile Number", value: vals.mobile },
      { label: "Email Address", value: vals.email },
      { label: "State", value: vals.state },
      { label: "City", value: vals.city },
    ];
    const href = buildMailtoUrl(FRANCHISE_EMAIL, `Franchisor Enquiry — ${vals.fullName}`, rows);
    setMailtoHref(href);
    window.location.href = href;
    setSubmitted(true);
  };

  /** Franchisee application — POST /franchise/apply. */
  const submitApplication = async (vals: FranchiseFormValues) => {
    const payload: ApplyFranchisePayload = {
      panNumber: vals.pan.trim().toUpperCase(),
      state: vals.state.trim(),
      city: vals.city.trim(),
      package: selectedPlan?.name ?? packageId,
      pincode: vals.pincode.trim(),
      businessName: vals.businessName.trim(),
      businessType:
        vals.businessType === OTHER_OPTION ? vals.businessTypeOther.trim() : vals.businessType,
      gstNumber: vals.gstNumber.trim().toUpperCase(),
      address: vals.address.trim(),
      yearsInBusiness: vals.yearsInBusiness.trim(),
    };

    setSubmitting(true);
    try {
      const res = await applyFranchise(payload);
      if (!res.success) {
        setPopup({
          tone: "error",
          message: res.message || "We could not submit your application just now. Please try again.",
        });
        return;
      }
      setPopup({
        tone: "success",
        message:
          res.message ||
          "Your application has been received. Our team will issue your franchise ID and password so you can sign in to the franchisor dashboard.",
      });
      setSubmitted(true);
    } catch (err) {
      setPopup({
        tone: "error",
        message: getApiErrorMessage(err, "We could not submit your application just now. Please try again."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();

    // The verified pincode owns the location: if the applicant edited the state or city
    // away from it, correct them back before validating or sending.
    let current = values;
    if (
      isFranchisee &&
      verifiedLocation &&
      (values.state !== verifiedLocation.state || values.city !== verifiedLocation.city)
    ) {
      current = { ...values, state: verifiedLocation.state, city: verifiedLocation.city };
      setValues(current);
    }

    if (!validate(current)) return;

    if (!isFranchisee) {
      submitEnquiry(current);
      return;
    }
    if (!isLoggedIn) {
      setPopup({
        tone: "error",
        message: "Register or sign in with your mobile number before submitting your application.",
      });
      return;
    }
    void submitApplication(current);
  };

  // Backend response popup — the API's own message, shown over whichever state the form is in.
  const popupNode = (
    <Modal open={!!popup} onClose={() => setPopup(null)} labelledBy="franchise-api-message" maxWidth="max-w-md">
      <div className="flex items-start gap-3 px-5 pt-5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${
            popup?.tone === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {popup?.tone === "error" ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <div className="min-w-0">
          <h2 id="franchise-api-message" className="text-[15px] font-extrabold text-slate-800">
            {popup?.tone === "error" ? "Application not submitted" : "Application submitted"}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{popup?.message}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
        {popup?.tone === "success" && (
          <Link
            to="/franchise-login"
            onClick={() => setPopup(null)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
          >
            Go to Franchisor Login →
          </Link>
        )}
        <Button variant="outline" size="md" onClick={() => setPopup(null)}>
          Close
        </Button>
      </div>
    </Modal>
  );

  // ── Registration gate — a signed-out visitor cannot fill the franchisee form ──
  if (isFranchisee && !isLoggedIn) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-navy)">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h3 className="text-lg font-extrabold text-slate-800">Register to apply for a franchise</h3>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-slate-600">
          Only registered users can submit a franchise application. Register with your name, mobile
          number and email — those details are carried into this form automatically — then complete the
          business details here.
        </p>
        <div className="mt-6">
          <Button
            type="button"
            size="lg"
            onClick={() => requestSignUp()}
            style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-teal) 100%)" }}
          >
            Register / Sign In
          </Button>
        </div>
        <p className="mt-3 text-[11.5px] text-slate-500">
          Already registered? Sign in from the same panel with your mobile number.
        </p>
      </div>
    );
  }

  // ── Success — application received, credentials to follow ────────────────────
  if (submitted && isFranchisee) {
    return (
      <>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-800">Application submitted</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
          Your franchise application has been received. Our team will verify your details and issue
          your <strong>franchise ID and password</strong>. Use them to sign in to the franchisor
          dashboard.
        </p>

        <dl className="mx-auto mt-6 max-w-md space-y-1.5 rounded-xl border border-emerald-200 bg-white p-4 text-left text-[12.5px]">
          {[
            ["Applicant", values.fullName],
            ["Business", values.businessName],
            ["PAN", values.pan],
            ["Location", `${values.city}, ${values.state} — ${values.pincode}`],
            ["Plan", selectedPlan ? `${selectedPlan.duration} — ${selectedPlan.fee}` : "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-slate-400">{k}</dt>
              <dd className="text-right font-semibold text-slate-700">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/franchise-login"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
          >
            Go to Franchisor Login →
          </Link>
        </div>
      </div>
      {popupNode}
      </>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-800">Details Ready to Send</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
          Your email app has been opened with all the details filled in and addressed to{" "}
          <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-navy) hover:underline">
            {FRANCHISE_EMAIL}
          </a>
          . Send that email and our franchise team will review your details and get in touch.
        </p>

        <dl className="mx-auto mt-6 max-w-md space-y-1.5 rounded-xl border border-emerald-200 bg-white p-4 text-left text-[12.5px]">
          {[
            ["Name", values.fullName],
            ["PAN", values.pan],
            ["Mobile", values.mobile],
            ["Email", values.email],
            ["Location", `${values.city}, ${values.state}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-slate-400">{k}</dt>
              <dd className="text-right font-semibold text-slate-700">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
          >
            Open the email again
          </a>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setSubmitted(false);
              setValues(EMPTY);
            }}
          >
            Submit another enquiry
          </Button>
        </div>
      </div>
    );
  }

  function inputClass(hasError: boolean) {
    return [
      "w-full rounded-xl border px-3 py-2.5 text-sm text-slate-800 transition placeholder:text-slate-400",
      hasError
        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 bg-white focus:border-(--brand-navy) focus:ring-2 focus:ring-(--brand-navy)/10",
    ].join(" ");
  }

  return (
    <>
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {isFranchisee && hasIdentity && (
        <p className="rounded-lg border border-(--brand-teal-20) bg-(--brand-teal-14) px-3 py-2 text-[11.5px] leading-relaxed text-slate-600">
          🔒 Name, mobile and email were filled from your registered account and are locked. They must
          match your PAN card — contact support to correct them.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id={fid("name")}
          label={isFranchisee ? "Full Name / Applicant Name" : "Full Name"}
          required
          error={errors.fullName}
          hint={isFranchisee ? "Enter exactly as printed on your PAN card" : undefined}
          full={isFranchisee}
        >
          <input
            id={fid("name")}
            className={`${inputClass(!!errors.fullName)} ${isLocked("fullName") ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            readOnly={isLocked("fullName")}
          />
        </Field>

        <Field id={fid("mobile")} label="Mobile Number" required error={errors.mobile}>
          <input
            id={fid("mobile")}
            type="tel"
            inputMode="numeric"
            className={`${inputClass(!!errors.mobile)} ${isLocked("mobile") ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
            value={values.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile number"
            maxLength={10}
            autoComplete="tel"
            readOnly={isLocked("mobile")}
          />
        </Field>

        <Field id={fid("email")} label="Email Address" required error={errors.email}>
          <input
            id={fid("email")}
            type="email"
            className={`${inputClass(!!errors.email)} ${isLocked("email") ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            readOnly={isLocked("email")}
          />
        </Field>

        <Field id={fid("pan")} label="PAN Number" required error={errors.pan}>
          <input
            id={fid("pan")}
            className={`${inputClass(!!errors.pan)} uppercase tracking-wider`}
            value={values.pan}
            onChange={(e) => set("pan", formatPAN(e.target.value))}
            placeholder="ABCDE1234F"
            maxLength={10}
            autoComplete="off"
          />
        </Field>

        {isFranchisee && (
          <Field
            id={fid("gst")}
            label="GST Number"
            error={errors.gstNumber}
            hint="Optional — only if you have a GST-registered business"
          >
            <input
              id={fid("gst")}
              className={`${inputClass(!!errors.gstNumber)} uppercase tracking-wider`}
              value={values.gstNumber}
              onChange={(e) => set("gstNumber", formatGSTIN(e.target.value))}
              placeholder="09ABCDE1234F1Z5"
              maxLength={15}
              autoComplete="off"
            />
          </Field>
        )}

        {isFranchisee && (
          <LocationFields
            slice={{ state: values.state, city: values.city }}
            set={(key, v) => {
              if (key === "state") {
                setValues((p) => ({ ...p, state: v, city: "" }));
                setErrors((p) => ({ ...p, state: undefined, city: undefined }));
              } else {
                set("city", v);
              }
            }}
            errors={{ state: errors.state, city: errors.city }}
            states={stateOptions}
            loadCities={loadCities}
            onPincodeResolved={(r) => {
              setVerifiedLocation({ pincode: r.pincode, state: r.state, city: r.city });
              setPincodeStatus(r.state ? "idle" : "notFound");
              setValues((p) => ({ ...p, state: r.state, city: r.city }));
              setErrors((p) => ({ ...p, state: undefined, city: undefined }));
            }}
            entityLabel=""
            showPincode
            pincodeStatus={pincodeStatus}
            verifiedLocation={verifiedLocation}
          />
        )}

        {isFranchisee && (
          <>
            <Field id={fid("years")} label="Years in Business" required error={errors.yearsInBusiness}>
              <input
                id={fid("years")}
                inputMode="numeric"
                className={inputClass(!!errors.yearsInBusiness)}
                value={values.yearsInBusiness}
                onChange={(e) => set("yearsInBusiness", e.target.value.replace(/\D/g, "").slice(0, 2))}
                placeholder="e.g. 3"
                maxLength={2}
              />
            </Field>

            <Field id={fid("businessName")} label="Business Name" required error={errors.businessName}>
              <input
                id={fid("businessName")}
                className={inputClass(!!errors.businessName)}
                value={values.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                placeholder="Your business / firm name"
                autoComplete="organization"
              />
            </Field>

            <Field id={fid("businessType")} label="Business Type" required error={errors.businessType}>
              <select
                id={fid("businessType")}
                className={inputClass(!!errors.businessType)}
                value={values.businessType}
                onChange={(e) => {
                  set("businessType", e.target.value);
                  if (e.target.value !== OTHER_OPTION) set("businessTypeOther", "");
                }}
              >
                <option value="">Select business type</option>
                {businessTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>

            {values.businessType === OTHER_OPTION && (
              <Field id={fid("businessTypeOther")} label="Mention Business Type" required error={errors.businessTypeOther}>
                <input
                  id={fid("businessTypeOther")}
                  className={inputClass(!!errors.businessTypeOther)}
                  value={values.businessTypeOther}
                  onChange={(e) => set("businessTypeOther", e.target.value)}
                  placeholder="Enter business type"
                />
              </Field>
            )}

            <Field id={fid("address")} label="Address" required error={errors.address} full>
              <textarea
                id={fid("address")}
                rows={3}
                className={`${inputClass(!!errors.address)} resize-y`}
                value={values.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Full postal address as per your official documents"
              />
            </Field>

            <PackageSelector
              id={fid("package")}
              value={packageId}
              onChange={setPackage}
              error={errors.packageId}
              required
              full
            />
          </>
        )}
      </div>

      {/* Selected plan summary — franchisee only, rendered from the shared PlanSummary module. */}
      {isFranchisee && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--brand-navy-14)", border: "1px dashed var(--brand-navy-44)" }}
        >
          <PlanSummary plan={selectedPlan} />
        </div>
      )}

      <p className="text-[11.5px] leading-relaxed text-slate-500">
        {isFranchisee
          ? "All details must be entered as per PAN card / official documents. Submitting this form is an application, not a confirmation of franchise allotment."
          : "All details must be entered as per official documents. Our team reviews every enquiry before getting in touch."}{" "}
        By submitting, you consent to being contacted by Indexia Finance about the franchise programme.
      </p>

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={isFranchisee && submitting}
        style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-teal) 100%)" }}
      >
        {isFranchisee ? (submitting ? "Submitting…" : "Apply for Franchise") : "Submit Details"}
      </Button>
    </form>
    {popupNode}
    </>
  );
};

export default FranchiseForm;
