export * from "./common";
export * from "./location";
export * from "./banks";
export * from "./employment";
export * from "./residence";
export * from "./loan";
export * from "./property";
export * from "./vehicle";
export * from "./education";
export * from "./gold";

import { YES_NO } from "./common";
import type { CitiesByState } from "./location";
import { BANK_NAMES } from "./banks";
import {
  SALARY_MODES, COMPANY_TYPES, BUSINESS_TYPES, NATURE_OF_BUSINESS, INDUSTRY_TYPES,
  BUSINESS_PLACE_STATUSES, PROFESSIONS, PERSONAL_EMPLOYMENT_TYPES, BUSINESS_EMPLOYMENT_TYPES,
  HOME_EMPLOYMENT_TYPES, LOAN_AGAINST_PROPERTY_EMPLOYMENT_TYPES, WORKING_CAPITAL_EMPLOYMENT_TYPES,
  LEASE_RENTAL_EMPLOYMENT_TYPES, OD_CC_EMPLOYMENT_TYPES, LOAN_AGAINST_SHARE_EMPLOYMENT_TYPES,
  NPA_EMPLOYMENT_TYPES, GOLD_LOAN_EMPLOYMENT_TYPES, FDI_EMPLOYMENT_TYPES,
} from "./employment";
import { RESIDENCE_STATUSES } from "./residence";
import {
  EXISTING_LOAN_TYPES, PERSONAL_LOAN_TENURE_YEARS, BUSINESS_LOAN_TENURE_YEARS,
  HOME_LOAN_TENURE_YEARS, LOAN_AGAINST_PROPERTY_TENURE_YEARS, PROJECT_LOAN_TENURE_YEARS,
  CAR_LOAN_TENURE_YEARS, EDUCATION_LOAN_TENURE_YEARS, WORKING_CAPITAL_TENURE_YEARS,
  COMMERCIAL_PURCHASE_TENURE_YEARS, LEASE_RENTAL_TENURE_YEARS, LOAN_AGAINST_SHARE_TENURE_YEARS,
  NPA_TENURE_YEARS, GOLD_LOAN_TENURE_YEARS, FDI_TENURE_YEARS,
} from "./loan";
import {
  BUYING_PROPERTY_TYPES, COLLATERAL_PROPERTY_TYPES, OD_CC_LIMIT_AGAINST_TYPES,
  FDI_FUND_AGAINST_TYPES, PROJECT_TYPES, COMMERCIAL_PROPERTY_TYPES,
} from "./property";
import { VEHICLE_TYPES, TRANSMISSION_TYPES, VEHICLE_PURCHASE_TYPES } from "./vehicle";
import { EDUCATION_COUNTRIES, FIELD_OF_STUDY, ENROLLMENT_STATUSES, PARENT_RELATIONSHIPS } from "./education";
import { GOLD_LOAN_TYPES, GOLD_CARATS_JEWELRY, GOLD_CARATS_NON_JEWELRY } from "./gold";

export const MASTERS = {
  banks: BANK_NAMES,
  existingLoanTypes: EXISTING_LOAN_TYPES,
  residenceStatuses: RESIDENCE_STATUSES,
  salaryModes: SALARY_MODES,
  companyTypes: COMPANY_TYPES,
  businessTypes: BUSINESS_TYPES,
  natureOfBusiness: NATURE_OF_BUSINESS,
  industryTypes: INDUSTRY_TYPES,
  businessPlaceStatuses: BUSINESS_PLACE_STATUSES,
  professions: PROFESSIONS,
  personalEmploymentTypes: PERSONAL_EMPLOYMENT_TYPES,
  businessEmploymentTypes: BUSINESS_EMPLOYMENT_TYPES,
  homeEmploymentTypes: HOME_EMPLOYMENT_TYPES,
  loanAgainstPropertyEmploymentTypes: LOAN_AGAINST_PROPERTY_EMPLOYMENT_TYPES,
  workingCapitalEmploymentTypes: WORKING_CAPITAL_EMPLOYMENT_TYPES,
  leaseRentalEmploymentTypes: LEASE_RENTAL_EMPLOYMENT_TYPES,
  odCcEmploymentTypes: OD_CC_EMPLOYMENT_TYPES,
  loanAgainstShareEmploymentTypes: LOAN_AGAINST_SHARE_EMPLOYMENT_TYPES,
  npaEmploymentTypes: NPA_EMPLOYMENT_TYPES,
  goldLoanEmploymentTypes: GOLD_LOAN_EMPLOYMENT_TYPES,
  fdiEmploymentTypes: FDI_EMPLOYMENT_TYPES,
  buyingPropertyTypes: BUYING_PROPERTY_TYPES,
  collateralPropertyTypes: COLLATERAL_PROPERTY_TYPES,
  fdiFundAgainstTypes: FDI_FUND_AGAINST_TYPES,
  odCcLimitAgainstTypes: OD_CC_LIMIT_AGAINST_TYPES,
  projectTypes: PROJECT_TYPES,
  vehicleTypes: VEHICLE_TYPES,
  transmissionTypes: TRANSMISSION_TYPES,
  vehiclePurchaseTypes: VEHICLE_PURCHASE_TYPES,
  educationCountries: EDUCATION_COUNTRIES,
  fieldOfStudy: FIELD_OF_STUDY,
  enrollmentStatuses: ENROLLMENT_STATUSES,
  parentRelationships: PARENT_RELATIONSHIPS,
  yesNo: YES_NO,
  commercialPropertyTypes: COMMERCIAL_PROPERTY_TYPES,
  personalLoanTenureYears: PERSONAL_LOAN_TENURE_YEARS,
  businessLoanTenureYears: BUSINESS_LOAN_TENURE_YEARS,
  homeLoanTenureYears: HOME_LOAN_TENURE_YEARS,
  loanAgainstPropertyTenureYears: LOAN_AGAINST_PROPERTY_TENURE_YEARS,
  projectLoanTenureYears: PROJECT_LOAN_TENURE_YEARS,
  carLoanTenureYears: CAR_LOAN_TENURE_YEARS,
  educationLoanTenureYears: EDUCATION_LOAN_TENURE_YEARS,
  workingCapitalTenureYears: WORKING_CAPITAL_TENURE_YEARS,
  commercialPurchaseTenureYears: COMMERCIAL_PURCHASE_TENURE_YEARS,
  leaseRentalTenureYears: LEASE_RENTAL_TENURE_YEARS,
  loanAgainstShareTenureYears: LOAN_AGAINST_SHARE_TENURE_YEARS,
  npaTenureYears: NPA_TENURE_YEARS,
  goldLoanTenureYears: GOLD_LOAN_TENURE_YEARS,
  goldLoanTypes: GOLD_LOAN_TYPES,
  goldCaratsJewelry: GOLD_CARATS_JEWELRY,
  goldCaratsNonJewelry: GOLD_CARATS_NON_JEWELRY,
  fdiTenureYears: FDI_TENURE_YEARS,
} as const;

export type Masters = {
  [K in Exclude<keyof typeof MASTERS, "banks">]: ReadonlyArray<(typeof MASTERS)[K][number]>;
} & {
  banks: readonly string[];
  states: readonly string[];
  citiesByState: CitiesByState;
};

export type MasterKey = keyof Masters;
