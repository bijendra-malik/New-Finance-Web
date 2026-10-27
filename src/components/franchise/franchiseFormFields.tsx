import { Fragment, type ReactNode } from "react";
import { formatGSTIN, formatPAN } from "../../utils/formatters";
import { OTHER_OPTION } from "../../constants/masters";
import { PackageSelector } from "./PlanSelector";
import { LocationFields } from "../form/LocationFields";
import { Field } from "../ui/FieldRenderer";
import type { FranchisePlan } from "./franchiseData";
import type { FieldKey, FranchiseFormPresentation, FranchiseFormValues, VerifiedLocation } from "./franchiseFormConfig";
import { inputClass } from "./franchiseFormConfig";

/**
 * The franchise application form’s field grid.
 *
 * Renders one control per form key and collapses pincode/state/city into the
 * shared LocationFields block. It is presentational: all state and side effects
 * stay in FranchiseForm, which passes them in through props.
 */

export type PincodeStatus = "idle" | "verifying" | "notFound" | "error";

export interface FranchiseFieldsProps {
  /** Which fields to render, in order. */
  keys: FieldKey[];
  values: FranchiseFormValues;
  errors: Partial<Record<FieldKey, string>>;
  set: (key: FieldKey, value: string) => void;
  fid: (name: string) => string;
  /** True for the franchisee application, which words a few fields differently. */
  isFranchisee: boolean;
  presentation: FranchiseFormPresentation;
  businessTypeOptions: readonly string[];
  stateOptions: readonly string[];
  loadCities: (state: string) => string[];
  pincodeStatus: PincodeStatus;
  verifiedLocation: VerifiedLocation | null;
  onPincodeResolved: (r: { pincode: string; state: string; city: string }) => void;
  onLocationSet: (key: "state" | "city", value: string) => void;
  plans: FranchisePlan[];
  plansLoading: boolean;
  plansError: string | null;
  reloadPlans: () => void;
  setPackage: (id: string) => void;
  packageId: string;
}

export const FranchiseFields = ({
  keys,
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
  onPincodeResolved,
  onLocationSet,
  plans,
  plansLoading,
  plansError,
  reloadPlans,
  setPackage,
  packageId,
}: FranchiseFieldsProps) => {
  const isHorizontal = presentation === "horizontal";
  // Full-width spans only make sense where the grid actually has the extra columns.
  const spanFull = isHorizontal ? "sm:col-span-2 lg:col-span-3" : presentation === "stepped" ? "" : "sm:col-span-2";

  const renderField = (key: FieldKey): ReactNode => {
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
              className={inputClass(!!errors.fullName)}
              value={values.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
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
              className={inputClass(!!errors.mobile)}
              value={values.mobile}
              onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit mobile number"
              maxLength={10}
              autoComplete="tel"
            />
          </Field>
        );

      case "email":
        return (
          <Field id={fid("email")} label="Email Address" required error={errors.email}>
            <input
              id={fid("email")}
              type="email"
              className={inputClass(!!errors.email)}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
            />
          </Field>
        );

      case "dob":
        return (
          <Field id={fid("dob")} label="Date of Birth" required error={errors.dob}>
            <input
              id={fid("dob")}
              type="date"
              className={inputClass(!!errors.dob)}
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
  const renderFields = (list: FieldKey[]): ReactNode =>
    list.map((key) => {
      if (key === "pincode") {
        return (
          <LocationFields
            key="location"
            slice={{ state: values.state, city: values.city }}
            pincode={values.pincode}
            set={onLocationSet}
            errors={{ state: errors.state, city: errors.city }}
            states={stateOptions}
            loadCities={loadCities}
            onPincodeResolved={onPincodeResolved}
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

  return <>{renderFields(keys)}</>;
};
