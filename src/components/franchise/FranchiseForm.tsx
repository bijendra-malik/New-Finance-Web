import { useState } from "react";
import Button from "../ui/Button";
import { useMasters } from "../../hooks/useMasters";
import { formatPAN } from "../../utils/formatters";
import { buildMailtoUrl } from "../../utils/mailto";
import {
  AGREEMENT_FEE,
  FRANCHISE_EMAIL,
  FRANCHISE_PLANS,
  type FranchisePlan,
} from "./franchiseData";

export interface FranchiseFormValues {
  fullName: string;
  pan: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  address: string;
  packageId: string;
}

const EMPTY: FranchiseFormValues = {
  fullName: "", pan: "", mobile: "", email: "", state: "", city: "", address: "", packageId: "",
};

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = keyof FranchiseFormValues;
type Variant = "franchisee" | "franchisor";

const inputClass = (invalid: boolean) =>
  `w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
    invalid ? "border-red-400 bg-red-50/40" : "border-slate-300"
  }`;

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}

const Field = ({ id, label, required, error, hint, full, children }: FieldProps) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1 text-[11.5px] font-medium text-red-500">{error}</p>
    ) : hint ? (
      <p className="mt-1 text-[11.5px] text-slate-400">{hint}</p>
    ) : null}
  </div>
);

interface FranchiseFormProps {
  variant: Variant;
  /** Franchisee only — controlled by the page so the plan cards can pre-select. */
  packageId?: string;
  onPackageChange?: (planId: string) => void;
}

/**
 * Shared franchisee/franchisor form. Both variants collect PAN-level identity details;
 * the franchisee variant adds an address and a package selection with a live fee summary.
 * Submissions are handed to the user's mail client addressed to the franchise team —
 * there is no backend endpoint for franchise enquiries yet.
 */
const FranchiseForm = ({ variant, packageId: packageIdProp, onPackageChange }: FranchiseFormProps) => {
  const isFranchisee = variant === "franchisee";
  const { masters, loadCities } = useMasters();
  // Both variants can be mounted at once (the franchisor form opens in a modal over the page),
  // so every field id is namespaced per variant to keep the DOM ids unique.
  const fid = (name: string) => `${isFranchisee ? "ff" : "fx"}-${name}`;

  const [values, setValues] = useState<FranchiseFormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [mailtoHref, setMailtoHref] = useState("");
  // The city field starts as free text and upgrades to a dropdown once the city master
  // for the chosen state arrives. Once the user types, it stays free text so their input
  // is never swapped out from under them mid-entry.
  const [cityIsFreeText, setCityIsFreeText] = useState(false);

  const packageId = packageIdProp ?? values.packageId;
  const selectedPlan: FranchisePlan | undefined = FRANCHISE_PLANS.find((p) => p.id === packageId);

  const stateOptions = masters.states;
  const cityOptions = values.state ? loadCities(values.state) : [];

  const set = (key: FieldKey, value: string) => {
    setValues((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const setPackage = (id: string) => {
    setValues((p) => ({ ...p, packageId: id }));
    setErrors((p) => ({ ...p, packageId: undefined }));
    onPackageChange?.(id);
  };

  const validate = () => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!values.fullName.trim()) e.fullName = "Full name is required";
    if (!values.pan.trim()) e.pan = "PAN number is required";
    else if (!PAN_PATTERN.test(values.pan)) e.pan = "Enter a valid 10-character PAN (e.g. ABCDE1234F)";
    if (!values.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(values.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!values.email.trim()) e.email = "Email address is required";
    else if (!EMAIL_PATTERN.test(values.email)) e.email = "Enter a valid email address";
    if (!values.state.trim()) e.state = "State is required";
    if (!values.city.trim()) e.city = "City is required";
    if (isFranchisee) {
      if (!values.address.trim()) e.address = "Address is required";
      if (!packageId) e.packageId = "Select the package duration you are interested in";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    if (!validate()) return;

    const rows = [
      { label: "Full Name (as per PAN)", value: values.fullName },
      { label: "PAN Number", value: values.pan },
      { label: "Mobile Number", value: values.mobile },
      { label: "Email Address", value: values.email },
      { label: "State", value: values.state },
      { label: "City", value: values.city },
      ...(isFranchisee
        ? [
            { label: "Address", value: values.address },
            {
              label: "Interested Package",
              value: selectedPlan ? `${selectedPlan.duration} — ${selectedPlan.fee}` : "Not selected",
            },
            { label: "Agreement Fee", value: AGREEMENT_FEE },
          ]
        : []),
    ];

    const subject = isFranchisee
      ? `Franchisee Application — ${values.fullName}`
      : `Franchisor Enquiry — ${values.fullName}`;

    const href = buildMailtoUrl(FRANCHISE_EMAIL, subject, rows);
    setMailtoHref(href);
    window.location.href = href;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-800">
          {isFranchisee ? "Application Ready to Send" : "Details Ready to Send"}
        </h3>
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
            ...(isFranchisee && selectedPlan
              ? [["Plan", `${selectedPlan.duration} — ${selectedPlan.fee}`] as [string, string]]
              : []),
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
            Submit another {isFranchisee ? "application" : "enquiry"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id={fid("name")} label={isFranchisee ? "Full Name / Applicant Name" : "Full Name"} required
          error={errors.fullName} hint={isFranchisee ? "Enter exactly as printed on your PAN card" : undefined}>
          <input id={fid("name")} className={inputClass(!!errors.fullName)} value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" autoComplete="name" />
        </Field>

        <Field id={fid("pan")} label="PAN Number" required error={errors.pan}>
          <input id={fid("pan")} className={`${inputClass(!!errors.pan)} uppercase tracking-wider`} value={values.pan}
            onChange={(e) => set("pan", formatPAN(e.target.value))} placeholder="ABCDE1234F" maxLength={10}
            autoComplete="off" />
        </Field>

        <Field id={fid("mobile")} label="Mobile Number" required error={errors.mobile}>
          <input id={fid("mobile")} type="tel" inputMode="numeric" className={inputClass(!!errors.mobile)}
            value={values.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number"
            maxLength={10} autoComplete="tel" />
        </Field>

        <Field id={fid("email")} label="Email Address" required error={errors.email}>
          <input id={fid("email")} type="email" className={inputClass(!!errors.email)} value={values.email}
            onChange={(e) => set("email", e.target.value)} placeholder="your@email.com" autoComplete="email" />
        </Field>

        <Field id={fid("state")} label="State" required error={errors.state}>
          {stateOptions.length > 0 ? (
            <select id={fid("state")} className={inputClass(!!errors.state)} value={values.state}
              onChange={(e) => { setValues((p) => ({ ...p, state: e.target.value, city: "" })); setErrors((p) => ({ ...p, state: undefined })); }}>
              <option value="">Select state</option>
              {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input id={fid("state")} className={inputClass(!!errors.state)} value={values.state}
              onChange={(e) => set("state", e.target.value)} placeholder="Your state" autoComplete="address-level1" />
          )}
        </Field>

        <Field id={fid("city")} label="City" required error={errors.city}>
          {cityOptions.length > 0 && !cityIsFreeText ? (
            <select id={fid("city")} className={inputClass(!!errors.city)} value={values.city}
              onChange={(e) => set("city", e.target.value)}>
              <option value="">Select city</option>
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <input id={fid("city")} className={inputClass(!!errors.city)} value={values.city}
              onChange={(e) => { setCityIsFreeText(true); set("city", e.target.value); }}
              placeholder="Your city" autoComplete="address-level2" />
          )}
        </Field>

        {isFranchisee && (
          <>
            <Field id={fid("address")} label="Address" required error={errors.address} full>
              <textarea id={fid("address")} rows={3} className={`${inputClass(!!errors.address)} resize-y`}
                value={values.address} onChange={(e) => set("address", e.target.value)}
                placeholder="Full postal address as per your official documents" />
            </Field>

            <Field id={fid("package")} label="Interested Package Duration" required error={errors.packageId} full>
              <select id={fid("package")} className={inputClass(!!errors.packageId)} value={packageId}
                onChange={(e) => setPackage(e.target.value)}>
                <option value="">Select a package duration</option>
                {FRANCHISE_PLANS.map((p) => (
                  <option key={p.id} value={p.id}>{p.duration} — {p.fee}</option>
                ))}
              </select>
            </Field>
          </>
        )}
      </div>

      {/* Selected plan summary — franchisee only */}
      {isFranchisee && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--brand-navy-14)", border: "1px dashed var(--brand-navy-44)" }}
        >
          {selectedPlan ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              {[
                ["Selected plan", selectedPlan.name],
                ["Duration", selectedPlan.duration],
                ["Plan fee", selectedPlan.fee],
                ["Renewal", selectedPlan.renewal],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-[13px] font-bold text-(--brand-navy)">{v}</dd>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-4">
                <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Franchisee agreement fee (payable separately)
                </dt>
                <dd className="mt-0.5 text-[13px] font-bold text-slate-700">{AGREEMENT_FEE}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-[12.5px] text-slate-500">
              Select a package duration above — the plan and applicable fee will be shown here before you submit.
            </p>
          )}
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
        style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-teal) 100%)" }}
      >
        {isFranchisee ? "Apply for Franchise" : "Submit Details"}
      </Button>
    </form>
  );
};

export default FranchiseForm;
