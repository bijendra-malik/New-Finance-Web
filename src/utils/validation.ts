import { OTHER_OPTION } from "../constants/masters";

export const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{1,98}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const PINCODE_REGEX = /^[1-9]\d{5}$/;
export const MOBILE_REGEX = /^\d{10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const stripOther = (items: string[]): string[] => items.filter(item => item !== OTHER_OPTION);

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
  { minAge = 21, maxAge = 70, panExample = false }: PersonalDetailsOptions = {},
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
  if(!draft.pincode) e.pincode="Pincode is required";
  else if(!PINCODE_REGEX.test(draft.pincode)) e.pincode="Enter valid 6-digit pincode";
  if(!draft.residenceStatus) e.residenceStatus="Residence status is required";
  else if(draft.residenceStatus===OTHER_OPTION&&!draft.residenceStatusOther.trim()) e.residenceStatusOther="Please mention residence status type";
};
