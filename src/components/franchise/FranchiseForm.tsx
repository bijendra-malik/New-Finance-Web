import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import { useMasters } from "../../hooks/useMasters";
import { verifyPincode } from "../../api/masters";
import { formatGSTIN, formatPAN } from "../../utils/formatters";
import { buildMailtoUrl } from "../../utils/mailto";
import { getApiErrorMessage } from "../../utils/apiError";
import { readCredentials, saveCredentials } from "../../utils/credentialStorage";
import { OTHER_OPTION } from "../../constants/masters";
import { EMAIL_REGEX, GSTIN_REGEX, MOBILE_REGEX, PAN_REGEX, PINCODE_REGEX } from "../../utils/validation";
import { registerFranchise, verifyFranchiseOTP } from "../../api/franchise";
import type { FranchiseEntryPayload } from "../../api/franchise";
import { useFranchisePlans } from "../../hooks/useFranchisePlans";
import { FRANCHISE_EMAIL } from "./franchiseData";
import type { FranchisePlan } from "./franchiseData";
import { PlanSummary, PackageSelector } from "./PlanSelector";
import { LocationFields } from "../form/LocationFields";
import { Field } from "../ui/FieldRenderer";
import OtpEntryPanel from "../status/OtpEntryPanel";

export interface FranchiseFormValues {
  continent: string;
  country: string;
  dob: string;
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
  continent: "",
  country: "",
  dob: ""
};

type FieldKey = keyof FranchiseFormValues;
type Variant = "franchisee" | "franchisor";

export type FranchiseFormPresentation = "stacked" | "horizontal" | "stepped";

interface FranchiseeStep {
  id: string;
  label: string;
  hint: string;
  fields: FieldKey[];
}

const FRANCHISEE_STEPS: FranchiseeStep[] = [
  { id: "personal", label: "Personal", hint: "Name, contact and PAN", fields: ["fullName", "mobile", "email", "dob", "pan"] },
  {
    id: "business",
    label: "Business",
    hint: "Business and GST details",
    fields: ["businessName", "businessType", "businessTypeOther", "gstNumber", "yearsInBusiness"],
  },
  { id: "location", label: "Location", hint: "Where you operate", fields: ["pincode", "state", "city", "address"] },
  { id: "plan", label: "Plan", hint: "Choose your package", fields: ["packageId"] },
];

const FRANCHISEE_FIELD_ORDER: FieldKey[] = [
  "fullName", "mobile", "email", "dob", "pan", "gstNumber",
  "pincode", "state", "city",
  "yearsInBusiness", "businessName", "businessType", "businessTypeOther", "address",
  "packageId",
];

interface VerifiedLocation {
  pincode: string;
  state: string;
  city: string;
}

const PINCODE_DEBOUNCE_MS = 500;

interface FranchiseFormProps {
  variant: Variant;
  packageId?: string;
  onPackageChange?: (planId: string) => void;
  presentation?: FranchiseFormPresentation;
}

const FranchiseForm = ({
  variant,
  packageId: packageIdProp,
  onPackageChange,
  presentation = "stacked",
}: FranchiseFormProps) => {
  const isFranchisee = variant === "franchisee";
  const { masters, loadCities } = useMasters();
  const { user } = useAuth();
  const franchisorLoginEnabled = true;

  const fid = (name: string) => `${isFranchisee ? "ff" : "fx"}-${name}`;

  const {
    plans,
    loading: plansLoading,
    error: plansError,
    selectedPlanCode,
    reload: reloadPlans,
  } = useFranchisePlans();

  // Details already verified for this form on this device are seeded straight
  // into state, so the effect below only has to fill what is still blank.
  const [values, setValues] = useState<FranchiseFormValues>(() => {
    const stored = readCredentials("franchisee-verification");
    if (!stored) return EMPTY;
    return {
      ...EMPTY,
      fullName: stored.fullName ?? "",
      mobile: stored.mobile ?? "",
      email: stored.email ?? "",
      pan: stored.pan ?? "",
    };
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [popup, setPopup] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [mailtoHref, setMailtoHref] = useState("");
  const [step, setStep] = useState(0);
  const [verifiedLocation, setVerifiedLocation] = useState<VerifiedLocation | null>(null);
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "verifying" | "notFound" | "error">("idle");
  // OTP stage after POST /franchise/entry — the applicant confirms the mobile
  // number via POST /franchise/entry/verify before the application is final.
  const [otpStage, setOtpStage] = useState(false);
  const [entryMobile, setEntryMobile] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [lastPayload, setLastPayload] = useState<FranchiseEntryPayload | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpApiError, setOtpApiError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const identity = useMemo(
    () => ({
      fullName: user?.name?.trim() ?? "",
      mobile: (user?.mobile ?? "").replace(/\D/g, "").slice(-10),
      email: user?.email?.trim() ?? "",
    }),
    [user],
  );
  const hasIdentity = Boolean(identity.fullName || identity.mobile || identity.email);
  const isLocked = (key: "fullName" | "mobile" | "email" | "dob") =>
    key === "dob" ? false : isFranchisee && Boolean(identity[key]);

  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !hasIdentity) return;
    prefilled.current = true;
    // Previously verified details stay as they are; the account only fills blanks.
    setValues((prev) => ({
      ...prev,
      fullName: prev.fullName || identity.fullName,
      mobile: prev.mobile || identity.mobile,
      email: prev.email || identity.email,
    }));
  }, [hasIdentity, identity]);

  const packageId = packageIdProp || values.packageId || selectedPlanCode;
  const selectedPlan: FranchisePlan | undefined = plans.find((p) => p.id === packageId);

  const stateOptions = masters.states;
  const businessTypeOptions = masters.businessTypes;

  const set = (key: FieldKey, value: string) => {
    setValues((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const setPackage = (id: string) => {
    setValues((p) => ({ ...p, packageId: id }));
    setErrors((p) => ({ ...p, packageId: undefined }));
    onPackageChange?.(id);
  };

  useEffect(() => {
    if (!isFranchisee) return;
    const pincode = values.pincode;
    if (!PINCODE_REGEX.test(pincode)) return;
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

  const buildErrors = (vals: FranchiseFormValues) => {
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
    return e;
  };

  const validateStep = (vals: FranchiseFormValues, index: number) => {
    const e = buildErrors(vals);
    setErrors(e);
    return !FRANCHISEE_STEPS[index].fields.some((key) => e[key]);
  };

  const submitEnquiry = (vals: FranchiseFormValues) => {
    const rows = [
      { label: "Full Name", value: vals.fullName },
      { label: "PAN Number", value: vals.pan },
      { label: "Mobile Number", value: vals.mobile },
      { label: "Email Address", value: vals.email },
      { label: "Date of Birth", value: vals.dob },
      { label: "Continent", value: vals.continent },
      { label: "Country", value: vals.country },
      { label: "Business Name", value: vals.businessName },
      { label: "Business Type", value: vals.businessType === OTHER_OPTION ? vals.businessTypeOther : vals.businessType },
      { label: "GST Number", value: vals.gstNumber },
      { label: "Years in Business", value: vals.yearsInBusiness },
      { label: "Address", value: vals.address },
    ];

    const href = buildMailtoUrl(FRANCHISE_EMAIL, `Franchise Enquiry — ${vals.fullName}`, rows);
    setMailtoHref(href);
    window.location.href = href;
    setSubmitted(true);
  };

  const submitApplication = async (vals: FranchiseFormValues) => {
    const payload: FranchiseEntryPayload = {
      name: vals.fullName.trim(),
      email: vals.email.trim(),
      mobile: vals.mobile.replace(/\D/g, "").slice(-10),
      panNumber: vals.pan.trim().toUpperCase(),
      dob: vals.dob,
      continent: vals.continent,
      country: vals.country,
      planCode: packageId,
      businessName: vals.businessName.trim(),
      businessType:
        vals.businessType === OTHER_OPTION ? vals.businessTypeOther.trim() : vals.businessType,
      gstNumber: vals.gstNumber.trim().toUpperCase(),
      address: vals.address.trim(),
      yearsInBusiness: vals.yearsInBusiness.trim(),
    };

    setSubmitting(true);
    try {
      const res = await registerFranchise(payload);
      if (!res.success) {
        setPopup({
          tone: "error",
          message: res.message || "We could not submit your application just now. Please try again.",
        });
        return;
      }
      // Entry accepted — the backend has sent an OTP to the applicant's mobile,
      // so move to the verification step instead of finishing immediately.
      setLastPayload(payload);
      setEntryMobile(payload.mobile ?? "");
      setMaskedMobile(res.mobileMasked?.trim() || "");
      setOtp("");
      setOtpError("");
      setOtpApiError("");
      setOtpNotice(res.message || "An OTP has been sent to your registered mobile number.");
      setOtpStage(true);
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

    if (!agreed) {
      setConsentError("Please accept the declaration above to continue.");
      if (isFranchisee && presentation === "stepped") setStep(FRANCHISEE_STEPS.length - 1);
      return;
    }
    setConsentError("");

    let current = values;
    if (
      isFranchisee &&
      verifiedLocation &&
      (values.state !== verifiedLocation.state || values.city !== verifiedLocation.city)
    ) {
      current = { ...values, state: verifiedLocation.state, city: verifiedLocation.city };
      setValues(current);
    }

    const e = buildErrors(current);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      if (isFranchisee && presentation === "stepped") {
        const index = FRANCHISEE_STEPS.findIndex((s) => s.fields.some((key) => e[key]));
        if (index >= 0) setStep(index);
      }
      return;
    }

    if (!isFranchisee) {
      submitEnquiry(current);
      return;
    }
    void submitApplication(current);
  };

  // ── OTP verification for the franchisee application ──────────────────────
  const verifyEntryOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter the 6-digit OTP sent to your mobile");
      return;
    }
    setVerifying(true);
    setOtpApiError("");
    setOtpNotice("");
    try {
      const res = await verifyFranchiseOTP({ mobile: entryMobile, otp });
      if (!res.success) {
        setOtpApiError(res.message || "The OTP was not accepted. Check it and try again.");
        return;
      }
      setOtpStage(false);
      setSubmitted(true);
      if (lastPayload) {
        saveCredentials("franchisee-verification", {
          fullName: lastPayload.name,
          mobile: lastPayload.mobile,
          email: lastPayload.email,
          pan: lastPayload.panNumber,
        });
      }
    } catch (err) {
      setOtpApiError(getApiErrorMessage(err, "We could not verify that OTP. Request a new one and try again."));
    } finally {
      setVerifying(false);
    }
  };

  const resendEntryOtp = async () => {
    if (!lastPayload) return;
    setResending(true);
    setOtpApiError("");
    try {
      // Re-sending goes through the same entry endpoint that issues the OTP.
      const res = await registerFranchise(lastPayload);
      if (!res.success) {
        setOtpApiError(res.message || "We could not resend the OTP. Try again in a moment.");
        return;
      }
      setMaskedMobile((prev) => res.mobileMasked?.trim() || prev);
      setOtpNotice(res.message || "A new OTP has been sent.");
    } catch (err) {
      setOtpApiError(getApiErrorMessage(err, "We could not resend the OTP. Check your connection and try again."));
    } finally {
      setResending(false);
    }
  };

  const backToForm = () => {
    setOtpStage(false);
    setOtp("");
    setOtpError("");
    setOtpApiError("");
    setOtpNotice("");
  };

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
          franchisorLoginEnabled ? (
          <Link
            to="/franchise-login"
            onClick={() => setPopup(null)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
          >
            Go to Franchisee Login →
          </Link>
          ) : (
          <span
            aria-disabled="true"
            title="Sign in to access the franchisee portal"
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white/60"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))", opacity: 0.6 }}
          >
            Go to Franchisee Login →
          </span>
          )
        )}
        <Button variant="outline" size="md" onClick={() => setPopup(null)}>
          Close
        </Button>
      </div>
    </Modal>
  );

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
          Your mobile number is verified and your franchise application has been received. Our team
          will review your details — once approved, sign in with your{" "}
          <strong>franchisee ID and the PAN number from this application</strong>.
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
          {franchisorLoginEnabled ? (
          <Link
            to="/franchise-login"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
          >
            Go to Franchisee Login →
          </Link>
          ) : (
          <span
            aria-disabled="true"
            title="Sign in to access the franchisee portal"
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white/60"
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))", opacity: 0.6 }}
          >
            Go to Franchisee Login →
          </span>
          )}
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

  // ── OTP stage — shown after the entry call accepts the application ──────
  if (isFranchisee && otpStage) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-7 sm:px-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand-teal)">Verify your mobile</p>
        <h3 className="mt-2 text-xl font-extrabold text-(--brand-navy)">One step left — confirm your OTP</h3>
        <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-slate-600">
          Your application has been received. Enter the OTP sent to your registered mobile number to
          verify your franchisee access.
        </p>
        <div className="mt-5">
          <OtpEntryPanel
            idPrefix="ff-apply"
            maskedMobile={maskedMobile}
            otp={otp}
            onOtpChange={(value) => {
              setOtp(value);
              setOtpError("");
            }}
            otpError={otpError}
            apiError={otpApiError}
            notice={otpNotice}
            busy={verifying}
            resending={resending}
            onVerify={verifyEntryOtp}
            onResend={() => void resendEntryOtp()}
            onChangeDetails={backToForm}
            verifyLabel="Verify application"
          />
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

  const isHorizontal = presentation === "horizontal";
  const isStepped = presentation === "stepped";
  const lastStep = FRANCHISEE_STEPS.length - 1;

  const gridClass = isHorizontal
    ? "grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
    : isStepped
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-1 gap-5 sm:grid-cols-2";

  // Full-width spans only make sense where the grid actually has the extra columns.
  const spanFull = isHorizontal ? "sm:col-span-2 lg:col-span-3" : isStepped ? "" : "sm:col-span-2";
  const lockedClass = (key: "fullName" | "mobile" | "email" | "dob") =>
    isLocked(key) ? "cursor-not-allowed bg-slate-100 text-slate-500" : "";

  const handleLocationSet = (key: "state" | "city", v: string) => {
    if (key === "state") {
      setValues((p) => ({ ...p, state: v, city: "" }));
      setErrors((p) => ({ ...p, state: undefined, city: undefined }));
    } else {
      set("city", v);
    }
  };

  const renderField = (key: FieldKey): React.ReactNode => {
    switch (key) {
      case "fullName":
        return (
          <Field
            id={fid("name")}
            label={isFranchisee ? "Full Name / Applicant Name" : "Full Name"}
            required
            error={errors.fullName}
            hint={isFranchisee ? "Enter exactly as printed on your PAN card" : undefined}
            full={isFranchisee && presentation === "stacked"}
          >
            <input
              id={fid("name")}
              className={`${inputClass(!!errors.fullName)} ${lockedClass("fullName")}`}
              value={values.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              readOnly={isLocked("fullName")}
            />
          </Field>
        );

      case "mobile":
        return (
          <Field id={fid("mobile")} label="Mobile Number" required error={errors.mobile}>
            <input
              id={fid("mobile")}
              type="tel"
              inputMode="numeric"
              className={`${inputClass(!!errors.mobile)} ${lockedClass("mobile")}`}
              value={values.mobile}
              onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit mobile number"
              maxLength={10}
              autoComplete="tel"
              readOnly={isLocked("mobile")}
            />
          </Field>
        );

      case "email":
        return (
          <Field id={fid("email")} label="Email Address" required error={errors.email}>
            <input
              id={fid("email")}
              type="email"
              className={`${inputClass(!!errors.email)} ${lockedClass("email")}`}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              readOnly={isLocked("email")}
            />
          </Field>
        );

      case "dob":
        return (
          <Field id={fid("dob")} label="Date of Birth" required error={errors.dob}>
            <input
              id={fid("dob")}
              type="date"
              className={`${inputClass(!!errors.dob)} ${lockedClass("dob")}`}
              value={values.dob}
              onChange={(e) => set("dob", e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </Field>
        );

      case "pan":
        return (
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
        );

      case "gstNumber":
        return (
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
        );

      case "yearsInBusiness":
        return (
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
        );

      case "businessName":
        return (
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
        );

      case "businessType":
        return (
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
        );

      case "businessTypeOther":
        if (values.businessType !== OTHER_OPTION) return null;
        return (
          <Field id={fid("businessTypeOther")} label="Mention Business Type" required error={errors.businessTypeOther}>
            <input
              id={fid("businessTypeOther")}
              className={inputClass(!!errors.businessTypeOther)}
              value={values.businessTypeOther}
              onChange={(e) => set("businessTypeOther", e.target.value)}
              placeholder="Enter business type"
            />
          </Field>
        );

      case "address":
        return (
          <div className={spanFull}>
            <Field id={fid("address")} label="Address" required error={errors.address}>
              <textarea
                id={fid("address")}
                rows={isHorizontal ? 2 : 3}
                className={`${inputClass(!!errors.address)} resize-y`}
                value={values.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Full postal address as per your official documents"
              />
            </Field>
          </div>
        );

      case "packageId":
        if (plansLoading) {
          return (
            <div className={spanFull}>
              <Field id={fid("package")} label="Package Duration">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Loading packages…
                </div>
              </Field>
            </div>
          );
        }
        return (
          <div className={spanFull}>
            {plansError && (
              <div
                role="alert"
                className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600"
              >
                <span>{plansError}</span>
                <button
                  type="button"
                  onClick={reloadPlans}
                  className="cursor-pointer font-bold underline underline-offset-2 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Retry
                </button>
              </div>
            )}
            <PackageSelector
              id={fid("package")}
              value={packageId}
              onChange={setPackage}
              error={errors.packageId}
              required
              plans={plans}
              disabled={plans.length === 0}
            />
          </div>
        );

      default:
        return null;
    }
  };

  /** Renders a key list, collapsing pincode/state/city into the shared location block. */
  const renderFields = (keys: FieldKey[]): React.ReactNode =>
    keys.map((key) => {
      if (key === "pincode") {
        return (
          <LocationFields
            key="location"
            slice={{ state: values.state, city: values.city }}
            pincode={values.pincode}
            set={handleLocationSet}
            errors={{ state: errors.state, city: errors.city }}
            states={stateOptions}
            loadCities={loadCities}
            onPincodeResolved={(r) => {
              setVerifiedLocation(r.state ? { pincode: r.pincode, state: r.state, city: r.city } : null);
              setPincodeStatus("idle");
              setValues((p) => ({ ...p, pincode: r.pincode, state: r.state, city: r.city }));
              setErrors((p) => ({ ...p, state: undefined, city: undefined }));
            }}
            entityLabel=""
            showPincode
            pincodeStatus={pincodeStatus}
            verifiedLocation={verifiedLocation}
          />
        );
      }
      if (key === "state" || key === "city") return null; // rendered by LocationFields
      return <Fragment key={key}>{renderField(key)}</Fragment>;
    });

  const planSummaryBlock = (
    <div
      className={isHorizontal ? "rounded-xl px-4 py-2.5" : "rounded-2xl p-4"}
      style={{ background: "var(--brand-navy-14)", border: "1px dashed var(--brand-navy-44)" }}
      role="region"
      aria-label="Selected plan summary"
    >
      {plansLoading ? (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          Loading plan details…
        </div>
      ) : selectedPlan ? (
        <PlanSummary plan={selectedPlan} compact={isHorizontal} />
      ) : null}
    </div>
  );

  const consentText = isHorizontal
    ? "All details must match your PAN card / official documents. Submitting is an application, not a confirmation of allotment, and you consent to being contacted about the franchise programme."
    : isFranchisee
      ? "All details must be entered as per PAN card / official documents. Submitting this form is an application, not a confirmation of franchise allotment. By submitting, you consent to being contacted by Indexia Finance about the franchise programme."
      : "All details must be entered as per official documents. Our team reviews every enquiry before getting in touch. By submitting, you consent to being contacted by Indexia Finance about the franchise programme.";

  return (
    <>
    <form onSubmit={handleSubmit} noValidate className={isHorizontal ? "space-y-4" : "space-y-5"}>
      {isFranchisee && hasIdentity && (
        <p className="rounded-lg border border-(--brand-teal-20) bg-(--brand-teal-14) px-3 py-2 text-[11.5px] leading-relaxed text-slate-600">
          🔒 Name, mobile and email were filled from your registered account and are locked. They must
          match your PAN card — contact support to correct them.
        </p>
      )}

      {/* Stepped layout — progress + which step is on screen */}
      {isStepped && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {FRANCHISEE_STEPS.map((s, i) => (
              <span
                key={s.id}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{ background: i <= step ? "var(--brand-teal)" : "#e2e8f0" }}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
              Step {step + 1} of {FRANCHISEE_STEPS.length} · {FRANCHISEE_STEPS[step].label}
            </span>
            <span className="text-[11.5px] text-slate-500">{FRANCHISEE_STEPS[step].hint}</span>
          </div>
        </div>
      )}

      {/* Plan summary sits with the plan step in the stepped layout, under the grid otherwise. */}
      {isFranchisee && isStepped && FRANCHISEE_STEPS[step].id === "plan" && planSummaryBlock}

      <div className={gridClass}>
        {isFranchisee ? (
          renderFields(isStepped ? FRANCHISEE_STEPS[step].fields : FRANCHISEE_FIELD_ORDER)
        ) : (
          <>
            {renderField("fullName")}
            {renderField("mobile")}
            {renderField("email")}
            {renderField("pan")}
            <Field id={fid("state")} label="State" required error={errors.state}>
              <input
                id={fid("state")}
                className={inputClass(!!errors.state)}
                value={values.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Your state"
                autoComplete="address-level1"
              />
            </Field>
            <Field id={fid("city")} label="City" required error={errors.city}>
              <input
                id={fid("city")}
                className={inputClass(!!errors.city)}
                value={values.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Your city"
                autoComplete="address-level2"
              />
            </Field>
          </>
        )}
      </div>

      {/* Selected plan summary — franchisee only, rendered from the shared PlanSummary module. */}
      {isFranchisee && !isStepped && planSummaryBlock}

      {/* Consent declaration — a required checkbox, shown with the submit control. */}
      {(!isStepped || step === lastStep) && (
        <div>
          <label
            className={`flex cursor-pointer select-none items-start gap-2.5 rounded-xl border px-3.5 py-3 transition-colors ${
              consentError
                ? "border-red-300 bg-red-50"
                : "border-(--brand-navy-14) bg-(--brand-navy-14)"
            }`}
          >
            <input
              id={fid("consent")}
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) setConsentError("");
              }}
              aria-invalid={!!consentError}
              aria-describedby={consentError ? fid("consent-error") : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded"
              style={{ accentColor: "var(--brand-teal)" }}
            />
            <span className="text-[11.5px] leading-relaxed text-slate-600">{consentText}</span>
          </label>
          {consentError && (
            <p id={fid("consent-error")} role="alert" className="mt-1.5 text-[11.5px] font-medium text-red-500">
              {consentError}
            </p>
          )}
        </div>
      )}

      {/* Footer — stepped pages with Continue, everyone else submits from here. */}
      {isFranchisee && isStepped ? (
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep((s) => Math.max(s - 1, 0))}>
              Back
            </Button>
          )}
          {step < lastStep ? (
            <Button
              size="lg"
              fullWidth
              onClick={() => {
                if (validateStep(values, step)) setStep((s) => Math.min(s + 1, lastStep));
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-teal) 100%)" }}
            >
              {submitting ? "Submitting…" : "Apply for Franchise"}
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isFranchisee && submitting}
          style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-teal) 100%)" }}
        >
          {isFranchisee ? (submitting ? "Submitting…" : "Apply for Franchise") : "Submit Details"}
        </Button>
      )}
    </form>
    {popupNode}
    </>
  );
};

export default FranchiseForm;
