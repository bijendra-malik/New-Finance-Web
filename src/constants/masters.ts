export const OTHER_OPTION = "Other" as const;

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export type CitiesByState = Record<string, readonly string[]>;

// Keyed by `${slugifiedState}::${slugifiedCity}` — see utils/formatters.ts#pincodeLocationKey.
// Cities with no entry here fall back to a plain "Other" pincode field.
export type PincodesByLocation = Record<string, readonly string[]>;

export const BANK_NAMES = [
  "HDFC", "SBI", "Bank Of India", "ICICI", "Punjab National Bank",
  "Kotak Mahindra Bank", "AXIS", "Citibank", OTHER_OPTION,
] as const;

export const EXISTING_LOAN_TYPES = [
  "Personal loan", "Business loan", "Home loan", "Car loan", "Working Capital",
  "Project Loan", "OD/CC", "Loan against share", "Gold loan", OTHER_OPTION,
] as const;

export const RESIDENCE_STATUSES = [
  "Owned by self", "Owned by spouse", "Owned by parents", "Rented with siblings",
  "Rented with family", "Rent and stay alone", "Paying Guest", "Hostel",
  "Company Provided", OTHER_OPTION,
] as const;

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

export const PERSONAL_EMPLOYMENT_TYPES = ["Salaried"] as const;

export const BUSINESS_EMPLOYMENT_TYPES = [
  "Self Employed - Business", "Self Employed - Professional",
] as const;

export const HOME_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const BUYING_PROPERTY_TYPES = [
  "New", "Under-construction", "Old-construction", OTHER_OPTION,
] as const;

export const COLLATERAL_PROPERTY_TYPES = [
  "Residential Property", "Commercial Property", "Industrial Property", OTHER_OPTION,
] as const;

export const OD_CC_LIMIT_AGAINST_TYPES = [
  "Residential Property", "Commercial Property", "Industrial Property", "Unsecured", OTHER_OPTION,
] as const;

export const LOAN_AGAINST_PROPERTY_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const WORKING_CAPITAL_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const LEASE_RENTAL_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const OD_CC_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const LOAN_AGAINST_SHARE_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const NPA_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const GOLD_LOAN_EMPLOYMENT_TYPES = [
  "Salaried", "Self Employed - Business", "Self Employed - Professional",
] as const;

export const FDI_EMPLOYMENT_TYPES = [
  "Self Employed - Business", "Self Employed - Professional",
] as const;

export const FDI_FUND_AGAINST_TYPES = [
  "Company Valuation", "Residential Property", "Commercial Property", "Industrial Property", OTHER_OPTION,
] as const;

export const PROJECT_TYPES = [
  "Construction Project", "Infrastructure Development", "Real Estate Development",
  "Manufacturing / Industrial Project", "Expansion Project", "Renewable Energy Project",
  OTHER_OPTION,
] as const;

export const VEHICLE_TYPES = [
  "Hatchback", "Sedan", "SUV", "MUV / MPV", "Luxury Car", "Two Wheeler", "Commercial Vehicle",
  OTHER_OPTION,
] as const;

export const TRANSMISSION_TYPES = [
  "Manual", "Automatic", OTHER_OPTION,
] as const;

export const VEHICLE_PURCHASE_TYPES = [
  "New Vehicle", "Used Vehicle", OTHER_OPTION,
] as const;

export const EDUCATION_COUNTRIES = [
  "India", "USA", "United Kingdom", "Canada", "Australia", "Germany", "Ireland",
  "Singapore", "New Zealand", OTHER_OPTION,
] as const;

export const FIELD_OF_STUDY = [
  "Engineering", "Medicine", "Management / MBA", "Computer Science / IT", "Law",
  "Arts & Humanities", "Science", "Commerce", OTHER_OPTION,
] as const;

export const ENROLLMENT_STATUSES = [
  "Admission Confirmed", "Admission Applied", "Yet to Apply", OTHER_OPTION,
] as const;

export const PARENT_RELATIONSHIPS = [
  "Father", "Mother", "Guardian", OTHER_OPTION,
] as const;

export const YES_NO = ["Yes", "No"] as const;

export const COMMERCIAL_PROPERTY_TYPES = [
  "Commercial", "Industrial", OTHER_OPTION,
] as const;

export const PERSONAL_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const BUSINESS_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const HOME_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
] as const;

export const LOAN_AGAINST_PROPERTY_TENURE_YEARS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export const PROJECT_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const CAR_LOAN_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const EDUCATION_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const WORKING_CAPITAL_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const COMMERCIAL_PURCHASE_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const LEASE_RENTAL_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const LOAN_AGAINST_SHARE_TENURE_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const NPA_TENURE_YEARS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

export const GOLD_LOAN_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export const GOLD_LOAN_TYPES = [
  "Jewellery", "Coin", "Bar", OTHER_OPTION,
] as const;

export const GOLD_CARATS_JEWELRY = [
  "18 Karat", "20 Karat", "22 Karat", OTHER_OPTION,
] as const;

export const GOLD_CARATS_NON_JEWELRY = [
  "18 Karat", "22 Karat", "24 Karat", OTHER_OPTION,
] as const;

export const FDI_TENURE_YEARS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export const MASTERS = {
  states: INDIAN_STATES,
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
  [K in keyof typeof MASTERS]: ReadonlyArray<(typeof MASTERS)[K][number]>;
} & {
  citiesByState: CitiesByState;
  pincodesByLocation: PincodesByLocation;
};

export type MasterKey = keyof Masters;
