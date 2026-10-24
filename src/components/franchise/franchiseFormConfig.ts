/**
 * Static shape of the franchise application form: the field values it collects,
 * the franchisee step order, and the API↔form field mapping.
 *
 * Kept out of the component so the form itself reads as behaviour rather than
 * a wall of literal definitions.
 */

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

export const EMPTY: FranchiseFormValues = {
  fullName: "", pan: "", mobile: "", email: "", state: "", city: "",
  pincode: "", businessName: "", businessType: "", businessTypeOther: "",
  gstNumber: "", yearsInBusiness: "", address: "", packageId: "",
  continent: "",
  country: "",
  dob: ""
};

export type FieldKey = keyof FranchiseFormValues;
export type Variant = "franchisee" | "franchisor";

/** Shared styling for a text input, tinted red when the field has an error. */
export const inputClass = (hasError: boolean) =>
  [
    "w-full rounded-xl border px-3 py-2.5 text-sm text-slate-800 transition placeholder:text-slate-400",
    hasError
      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 bg-white focus:border-(--brand-navy) focus:ring-2 focus:ring-(--brand-navy)/10",
  ].join(" ");

export type FranchiseFormPresentation = "stacked" | "horizontal" | "stepped";

export interface FranchiseeStep {
  id: string;
  label: string;
  hint: string;
  fields: FieldKey[];
}

export const FRANCHISEE_STEPS: FranchiseeStep[] = [
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

export const FRANCHISEE_FIELD_ORDER: FieldKey[] = [
  "fullName", "mobile", "email", "dob", "pan", "gstNumber",
  "pincode", "state", "city",
  "yearsInBusiness", "businessName", "businessType", "businessTypeOther", "address",
  "packageId",
];

export const API_FIELD_TO_FORM: Readonly<Record<string, FieldKey>> = {
  name: "fullName",
  mobile: "mobile",
  email: "email",
  dob: "dob",
  panNumber: "pan",
  planCode: "packageId",
};

export interface VerifiedLocation {
  pincode: string;
  state: string;
  city: string;
}

export const PINCODE_DEBOUNCE_MS = 500;

export interface FranchiseFormProps {
  variant: Variant;
  packageId?: string;
  onPackageChange?: (planId: string) => void;
  presentation?: FranchiseFormPresentation;
}