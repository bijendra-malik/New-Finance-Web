import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { Link } from "react-router-dom";
import { useMasters } from "../../hooks/useMasters";
import {
  fetchContinents,
  fetchCountriesByContinent,
  verifyPincode,
  type Continent,
  type Country,
} from "../../api/masters";
import { buildMailtoUrl } from "../../utils/mailto";
import { advanceOnEnter } from "../../utils/enterToNext";
import { getApiErrorMessage, getApiFieldErrors } from "../../utils/apiError";
import { OTHER_OPTION } from "../../constants/masters";
import { EMAIL_REGEX, MOBILE_REGEX, PAN_REGEX, PINCODE_REGEX, isAtLeastAge } from "../../utils/validation";
import { registerFranchise, verifyFranchiseOTP } from "../../api/franchise";
import type { FranchiseEntryPayload } from "../../api/franchise";
import { useFranchisePlans } from "../../hooks/useFranchisePlans";
import { FRANCHISE_EMAIL } from "./franchiseData";
import type { FranchisePlan } from "./franchiseData";
import { PlanSummary } from "./PlanSelector";
import { Field } from "../ui/FieldRenderer";
import { EnquiryReadyPanel, OtpStagePanel, SubmittedPanel } from "./FranchiseFormPanels";
import { FranchiseFields } from "./franchiseFormFields";

import {
  API_FIELD_TO_FORM,
  EMPTY,
  FRANCHISEE_FIELD_ORDER,
  FRANCHISEE_STEPS,
  PINCODE_DEBOUNCE_MS,
  inputClass,
  type FieldKey,
  type FranchiseFormProps,
  type FranchiseFormValues,
  type VerifiedLocation,
} from "./franchiseFormConfig";

export type { FranchiseFormValues, FranchiseFormPresentation } from "./franchiseFormConfig";

const FranchiseForm = ({
  variant,
  packageId: packageIdProp,
  onPackageChange,
  presentation = "stacked",
}: FranchiseFormProps) => {
  const isFranchisee = variant === "franchisee";
  const { masters, loadCities } = useMasters();
  const franchisorLoginEnabled = true;

  const fid = (name: string) => `${isFranchisee ? "ff" : "fx"}-${name}`;

  const {
    plans,
    loading: plansLoading,
    error: plansError,
    selectedPlanCode,
    reload: reloadPlans,
  } = useFranchisePlans();

  const [values, setValues] = useState<FranchiseFormValues>(() => {
    return EMPTY;
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
  const [continentOptions, setContinentOptions] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
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

  const packageId = packageIdProp || values.packageId || selectedPlanCode;
  const selectedPlan: FranchisePlan | undefined = plans.find((p) => p.id === packageId);

  useEffect(() => {
    let cancelled = false;
    fetchContinents()
      .then((list) => {
        if (!cancelled) setContinentOptions(list);
      })
      .catch(() => {
        if (!cancelled) setContinentOptions([]);
      })
      .finally(() => {
        if (!cancelled) setContinentsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const selectedContinent = continentOptions.find((item) => item.name === values.continent);
    if (!selectedContinent) {
      setCountryOptions([]);
      setCountriesLoading(false);
      return;
    }

    let cancelled = false;
    setCountriesLoading(true);
    fetchCountriesByContinent(selectedContinent._id)
      .then((list) => {
        if (!cancelled) setCountryOptions(list);
      })
      .catch(() => {
        if (!cancelled) setCountryOptions([]);
      })
      .finally(() => {
        if (!cancelled) setCountriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [continentOptions, values.continent]);

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

    if (!vals.fullName.trim()) e.fullName = "Name is required";

    if (!vals.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!MOBILE_REGEX.test(vals.mobile)) e.mobile = "Enter a valid 10-digit mobile number";

    if (!vals.email.trim()) e.email = "Email address is required";
    else if (!EMAIL_REGEX.test(vals.email.trim())) e.email = "Enter a valid email address";

    if (!vals.dob) e.dob = "Date of birth is required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(vals.dob))
      e.dob = "Enter a valid date of birth (YYYY-MM-DD)";
    else if (!isAtLeastAge(vals.dob, 21))
      e.dob = "Applicant must be at least 21 years old to apply";

    if (!vals.pan.trim()) e.pan = "PAN number is required";
    else if (!PAN_REGEX.test(vals.pan.trim().toUpperCase()))
      e.pan = "Enter a valid PAN number (e.g. ABCDE1234F)";

    if (isFranchisee) {
      if (!vals.continent) e.continent = "Continent is required";
      if (!vals.country) e.country = "Country is required";
      if (!packageId) e.packageId = "Select the plan you are interested in";
    } else {
      if (!vals.state.trim()) e.state = "State is required";
      if (!vals.city.trim()) e.city = "City is required";
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
      { label: "Mobile Number", value: vals.mobile },
      { label: "Email Address", value: vals.email },
      { label: "Date of Birth", value: vals.dob },
      { label: "PAN Number", value: vals.pan },
      { label: "GST Number", value: vals.gstNumber },
      { label: "Years in Business", value: vals.yearsInBusiness },
      { label: "Business Name", value: vals.businessName },
      { label: "Business Type", value: vals.businessType === OTHER_OPTION ? vals.businessTypeOther : vals.businessType },
      { label: "Business Office Address", value: vals.address },
      { label: "Continent", value: vals.continent },
      { label: "Country", value: vals.country },
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
      state: vals.state.trim(),
      city: vals.city.trim(),
      pincode: vals.pincode.trim(),
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
      setLastPayload(payload);
      setEntryMobile(payload.mobile ?? "");
      setMaskedMobile(res.mobileMasked?.trim() || "");
      setOtp("");
      setOtpError("");
      setOtpApiError("");
      setOtpNotice(res.message || "An OTP has been sent to your registered mobile number.");
      setOtpStage(true);
    } catch (err) {
      const fromApi = Object.entries(getApiFieldErrors(err)).reduce<Partial<Record<FieldKey, string>>>(
        (acc, [path, message]) => {
          const key = API_FIELD_TO_FORM[path];
          if (key) acc[key] = message;
          return acc;
        },
        {},
      );
      if (Object.keys(fromApi).length > 0) {
        setErrors(fromApi);
        if (isFranchisee && presentation === "stepped") {
          const index = FRANCHISEE_STEPS.findIndex((s) => s.fields.some((key) => fromApi[key]));
          if (index >= 0) setStep(index);
        }
      }
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
      <SubmittedPanel
        values={values}
        selectedPlan={selectedPlan}
        franchisorLoginEnabled={franchisorLoginEnabled}
        popup={popupNode}
      />
    );
  }

  if (submitted) {
    return (
      <EnquiryReadyPanel
        values={values}
        mailtoHref={mailtoHref}
        onSubmitAnother={() => {
          setSubmitted(false);
          setValues(EMPTY);
        }}
      />
    );
  }

  // ── OTP stage — shown after the entry call accepts the application ──────
  if (isFranchisee && otpStage) {
    return (
      <OtpStagePanel
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
      />
    );
  }

  const isHorizontal = presentation === "horizontal";
  const isStepped = presentation === "stepped";
  const lastStep = FRANCHISEE_STEPS.length - 1;

  const gridClass = isHorizontal
    ? "grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
    : isStepped
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-1 gap-5 sm:grid-cols-2";

  const handleLocationSet = (key: "state" | "city", v: string) => {
    if (key === "state") {
      setValues((p) => ({ ...p, state: v, city: "" }));
      setErrors((p) => ({ ...p, state: undefined, city: undefined }));
    } else {
      set("city", v);
    }
  };

  // Everything the field grid needs, in one place so it stays readable at the call site.
  const fieldProps = {
    values,
    errors,
    set,
    fid,
    isFranchisee,
    presentation,
    businessTypeOptions,
    stateOptions,
    loadCities,
    pincodeStatus,
    verifiedLocation,
    continentOptions,
    continentsLoading,
    countryOptions,
    countriesLoading,
    onPincodeResolved: (r: { pincode: string; state: string; city: string }) => {
      setVerifiedLocation(r.state ? { pincode: r.pincode, state: r.state, city: r.city } : null);
      setPincodeStatus("idle");
      setValues((p) => ({ ...p, pincode: r.pincode, state: r.state, city: r.city }));
      setErrors((p) => ({ ...p, state: undefined, city: undefined }));
    },
    onLocationSet: handleLocationSet,
    plans,
    plansLoading,
    plansError,
    reloadPlans,
    setPackage,
    packageId,
  };
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
    ? "All details must match your PAN card and official documents. Submitting an application does not guarantee allotment. By submitting, you consent to being contacted regarding the franchise programme."
    : isFranchisee
      ? "All details must match your PAN card and other official documents. Submitting this form constitutes an application and does not guarantee franchise allotment. By submitting, you consent to being contacted by Indexia Finance regarding the franchise programme."
      : "All details must match your official documents. Our team reviews every enquiry before getting in touch. By submitting this form, you consent to being contacted by Indexia Finance regarding the franchise programme.";

  return (
    <>
    <form onSubmit={handleSubmit} onKeyDown={advanceOnEnter} noValidate className={isHorizontal ? "space-y-4" : "space-y-5"}>
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
          <FranchiseFields keys={isStepped ? FRANCHISEE_STEPS[step].fields : FRANCHISEE_FIELD_ORDER} {...fieldProps} />
        ) : (
          <>
            <FranchiseFields keys={["fullName", "mobile", "email", "pan"]} {...fieldProps} />
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
              data-enter-next
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
