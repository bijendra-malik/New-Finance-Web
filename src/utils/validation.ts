import { MORE_THAN_TENURE_OPTION, OTHER_OPTION } from "../constants/masters";
import type { LoanAmountRange } from "../constants/masters";
import { formatIndianNumber } from "./formatters";

export const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{1,98}$/;
export const COMPANY_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{0,99}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const PINCODE_REGEX = /^[1-9]\d{5}$/;
export const MOBILE_REGEX = /^\d{10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const stripOther = (items: string[]): string[] => items.filter(item => item !== OTHER_OPTION);

/** Whole years between an ISO date (yyyy-mm-dd) and today. -1 when unparseable. */
export const ageOn = (dob: string, today = new Date()): number => {
  if (!dob) return -1;
  const born = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(born.getTime())) return -1;
  let age = today.getFullYear() - born.getFullYear();
  const monthDelta = today.getMonth() - born.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < born.getDate())) age -= 1;
  return age;
};

const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** True only for a real date at or past `minAge` (loan applicants must be 18+). */
export const isAtLeastAge = (dob: string, minAge = 18, today = new Date()): boolean => {
  const age = ageOn(dob, today);
  return age >= minAge;
};

/** True only for a real date at or below `maxAge` (loan applicants must be 65 or younger). */
export const isAtMostAge = (dob: string, maxAge = 65, today = new Date()): boolean => {
  const age = ageOn(dob, today);
  return age >= 0 && age <= maxAge;
};

/** Latest date of birth that still satisfies `minAge` — for a date input's max. */
export const latestDobForAge = (minAge = 18, today = new Date()): string =>
  toIsoDate(new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate()));

/** Earliest date of birth that still satisfies `maxAge` — for a date input's min. */
export const earliestDobForAge = (maxAge = 65, today = new Date()): string =>
  toIsoDate(new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate() + 1));

export interface TenureDraft {
  loanTenureYears: number;
  loanTenureYearsCustom?: number;
}

export const validateTenure = (
  draft: TenureDraft,
  e: Partial<Record<string, string>>,
  maxYears: number,
  minYears = 1,
): void => {
  const custom = draft.loanTenureYearsCustom ?? 0;
  const rangeLabel = `between ${minYears} and ${maxYears} years`;
  if (!draft.loanTenureYears) {
    e.loanTenureYears = "Select loan tenure";
  } else if (draft.loanTenureYears === MORE_THAN_TENURE_OPTION) {
    if (!custom) e.loanTenureYearsCustom = "Enter the loan tenure in years";
    else if (custom < minYears || custom > maxYears)
      e.loanTenureYearsCustom = `Enter a tenure ${rangeLabel}`;
  } else if (draft.loanTenureYears < minYears || draft.loanTenureYears > maxYears) {
    e.loanTenureYears = `Tenure must be ${rangeLabel}`;
  }
};

export interface LoanAmountDraft {
  loanAmount: number;
}

export const validateLoanAmount = (
  draft: LoanAmountDraft,
  e: Partial<Record<string, string>>,
  { min, max }: LoanAmountRange,
): void => {
  if (draft.loanAmount < min) {
    e.loanAmount = `Minimum ₹${formatIndianNumber(String(min))}`;
  } else if (draft.loanAmount > max) {
    e.loanAmount = `Maximum loan amount is ₹${formatIndianNumber(String(max))}`;
  }
};

export interface PersonalDetailsDraft {
  fullName: string; mobile: string; email: string; dob: string; panNumber: string;
  state: string; city: string; pincode: string;
  residenceStatus: string; residenceStatusOther: string;
}

interface PersonalDetailsOptions {
  minAge?: number;
  maxAge?: number;
  panExample?: boolean;
}

export const validatePersonalDetails = (
  draft: PersonalDetailsDraft,
  e: Partial<Record<string, string>>,
  { minAge = 18, maxAge = 65, panExample = false }: PersonalDetailsOptions = {},
): void => {
  if(!draft.fullName.trim()) e.fullName="Name is required";
  else if(!NAME_REGEX.test(draft.fullName.trim())) e.fullName="Name must be at least 2 characters and contain only letters, spaces, dots or hyphens";
  if(!draft.mobile.trim()) e.mobile="Mobile is required";
  else if(!MOBILE_REGEX.test(draft.mobile)) e.mobile="Enter a valid 10-digit mobile number";
  if(!draft.email.trim()) e.email="Email is required";
  else if(!EMAIL_REGEX.test(draft.email)) e.email="Enter valid email";
  if(!draft.dob) e.dob="Date of birth is required";
  else {
    const dobDate = new Date(draft.dob+"T00:00:00");
    const today = new Date(); today.setHours(0,0,0,0);
    if(dobDate>today) e.dob="Date of birth cannot be in the future";
    else {
      const minAgeDate = new Date(today.getFullYear()-minAge, today.getMonth(), today.getDate());
      const maxAgeDate = new Date(today.getFullYear()-maxAge, today.getMonth(), today.getDate());
      if(dobDate<maxAgeDate) e.dob=`Maximum application age is ${maxAge} years for this loan`;
      if(dobDate>minAgeDate) e.dob=`You must be at least ${minAge} years old`;
    }
  }
  if(!draft.panNumber.trim()) e.panNumber="PAN is required";
  else if(!PAN_REGEX.test(draft.panNumber.toUpperCase())) e.panNumber=panExample?"Invalid PAN format. Example: ABCDE1234F":"Invalid PAN format";
  if(!draft.state) e.state="State is required";
  if(!draft.city) e.city="City is required";
  const rawPincode = draft.pincode?.replace(/\D/g, "") ?? "";
  if(!rawPincode) e.pincode="Pincode is required";
  else if(!PINCODE_REGEX.test(rawPincode)) e.pincode="Enter a valid 6-digit pincode";
  if(!draft.residenceStatus) e.residenceStatus="Residence status is required";
  else if(draft.residenceStatus===OTHER_OPTION&&!draft.residenceStatusOther.trim()) e.residenceStatusOther="Please mention residence status type";
};
