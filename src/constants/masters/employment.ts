// Employment / income / business-related master lists.
import { OTHER_OPTION } from "./common";

export const SALARIED = "Salaried" as const;
export const SELF_EMPLOYED_BUSINESS = "Self Employed - Business" as const;
export const SELF_EMPLOYED_PROFESSIONAL = "Self Employed - Professional" as const;

export const SELF_EMPLOYMENT = [SELF_EMPLOYED_BUSINESS, SELF_EMPLOYED_PROFESSIONAL] as const;
export const ALL_EMPLOYMENT_TYPES = [SALARIED, ...SELF_EMPLOYMENT] as const;

export const SALARY_MODES = [
  "Cash", "Cheque", "Electronically deposited-IMPS", "Electronically deposited-NFT/RTGS",
] as const;

export const COMPANY_TYPES = [
  "Private Limited", "Limited", "Partnership", "Proprietorship", "Government", OTHER_OPTION,
] as const;

export const BUSINESS_TYPES = [
  "Proprietorship", "Partnership Firm", "Privated Limited Company", "Public Limited Company",
  "Limited Liability Company", OTHER_OPTION,
] as const;

export const NATURE_OF_BUSINESS = [
  "Manufacture", "Trader/Wholesaler", "Retailer", "Service Provider", OTHER_OPTION,
] as const;

export const INDUSTRY_TYPES = [
  "Agriculture", "Automobiles", "Cement", "Chemical", "Computer", "Construction",
  "Consumer Durables", "Container & Packaging", "Durables", "Energy", "Food & Beverages",
  "Hardware Equipments", "Healthcare", "Household Products", "Industrial Projects", "Metals",
  "Paper", "Petroleum Products", "Plastic", "Rubber", "Textiles", OTHER_OPTION,
] as const;

export const BUSINESS_PLACE_STATUSES = [
  "Owned", "Rented", "Leased", "Shared", OTHER_OPTION,
] as const;

export const PROFESSIONS = [
  "Doctor", "Chartered Accountant", "Lawyer", "Architect", "Company Secretary",
  "Consultant", "Engineer", OTHER_OPTION,
] as const;

export const PERSONAL_EMPLOYMENT_TYPES = [SALARIED] as const;
export const BUSINESS_EMPLOYMENT_TYPES = SELF_EMPLOYMENT;
export const FDI_EMPLOYMENT_TYPES = SELF_EMPLOYMENT;
export const HOME_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const LOAN_AGAINST_PROPERTY_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const WORKING_CAPITAL_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const LEASE_RENTAL_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const OD_CC_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const LOAN_AGAINST_SHARE_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const NPA_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
export const GOLD_LOAN_EMPLOYMENT_TYPES = ALL_EMPLOYMENT_TYPES;
