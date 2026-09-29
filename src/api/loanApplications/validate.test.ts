import { describe, it, expect } from "vitest";
import {
  validateApplication,
  sanitizeApplication,
  sanitizeApplicationList,
} from "./validate";

/**
 * Fixtures mirroring the real GET /{product}/applications payloads observed
 * from the backend (Credit Card, Working Capital, Commercial Purchase,
 * Lease Rental Discounting, OD/CC Limit, Loan Against Share, Film Funding).
 */

const personal = {
  fullName: "Rahul Sharma",
  mobile: "9876543210",
  email: "rahul@example.com",
  dob: "1992-06-15T00:00:00.000Z",
  panNumber: "ABCDE1234F",
  state: "Maharashtra",
  city: "Pune",
  pincode: "411001",
  residenceStatus: "Owned",
};

const txnBank = {
  displayName: "Multiple Transaction Banks",
  banks: ["HDFC Bank", "State Bank of India", "ICICI Bank"],
};

const base = {
  _id: "6abb8b9715eaff694fc4377e",
  user: "6ab4c294c6ce8b42adf8329c",
  status: "Submitted",
  createdAt: "2026-09-29T09:56:07.663Z",
  updatedAt: "2026-09-29T09:56:07.663Z",
  employmentType: "Self Employed - Business",
  existingEMI: 0,
  existingLoanAmount: 0,
  existingBanks: [],
  otherBankList: [],
  existingLoanTypes: [],
  otherLoanList: [],
  ...personal,
};

const baseSections = {
  sections: {
    loanRequirements: {}, incomeDetails: {}, existingLoanExposure: {}, personalDetails: {},
  },
};

// ── The seven real product payload shapes ─────────────────────────────────────

const creditCardApp = {
  ...base,
  loanType: "Credit Card",
  hasActiveCard: "Yes",
  applyForBank: "HDFC Bank",
  employmentType: "Salaried",
  companyName: "TechNova Pvt Ltd",
  companyType: "Private Limited",
  monthlySalary: 120000,
  salaryReceivedAs: "Bank Transfer",
  salaryBankName: "HDFC Bank",
  ...baseSections,
};

const workingCapitalApp = {
  ...base,
  loanType: "Working Capital",
  loanAmount: 1000000,
  loanTenure: 60,
  collateralPropertyType: "Residential Plot",
  collateralPropertyTypeOther: "",
  collateralPropertyMarketValue: 6000000,
  collateralPropertyAge: 10,
  collateralPropertyState: "Maharashtra",
  collateralPropertyCity: "Pune",
  collateralPropertyPincode: "411001",
  collateralPropertyPincodeOther: "",
  businessType: "Proprietorship",
  businessTypeOther: "",
  businessName: "Aarav Traders",
  gstNumber: "",
  companyPanNumber: "ABCDE1234F",
  natureOfBusiness: "Retail",
  natureOfBusinessOther: "",
  industryType: "Trading",
  industryTypeOther: "",
  subIndustry: "",
  businessEstablishedDate: "2018-05-12T00:00:00.000Z",
  transactionBankName: txnBank,
  lastYearTurnover: 2500000,
  last2YearsTurnover: 2300000,
  lastYearNetIncome: 350000,
  last2YearsNetIncome: 300000,
  businessState: "Maharashtra",
  businessCity: "Pune",
  businessPincode: "411001",
  businessPincodeOther: "",
  businessPlaceStatus: "Owned",
  businessPlaceStatusOther: "",
  ...baseSections,
};

const commercialPurchaseApp = {
  ...workingCapitalApp,
  _id: "6abb8bcb15eaff694fc4377f",
  loanType: "Commercial Purchase",
  employmentType: "Salaried",
  monthlySalary: 90000,
  buyingPropertyType: "Commercial",
  buyingPropertyMarketValue: 6000000,
  buyingPropertyAge: 3,
  companyName: "ABC Corp",
  companyType: "Private Limited",
  salaryReceivedAs: "Bank Transfer",
  salaryBankName: "HDFC Bank",
};

const leaseRentalApp = {
  ...workingCapitalApp,
  _id: "6abb8bcb15eaff694fc4377e",
  loanType: "Lease Rental Discounting",
  employmentType: "Self Employed - Professional",
  monthlyLeaseIncome: 80000,
  totalLeaseAmount: 9600000,
  leasePropertyDuration: 10,
  leasePropertyMarketValue: 6000000,
  leasePropertyAge: 5,
  profession: "Doctor",
  currentYearTurnover: 500000,
  priorYearTurnover: 450000,
  currentYearNetIncome: 70000,
  previousYearNetIncome: 65000,
};

const odccApp = {
  ...leaseRentalApp,
  _id: "6abb8c5c15eaff694fc43780",
  loanType: "OD / CC Limit",
  loanTenure: 432, // legacy record created under the old 3-40 year rule
};

const loanAgainstShareApp = {
  ...workingCapitalApp,
  _id: "6abb8d3415eaff694fc43781",
  loanType: "Loan Against Share",
  shareCompanyName: "Reliance Industries",
  valueOfOneShare: 2500,
  quantityOfShare: 500,
  totalShareValue: 1250000,
};

const filmFundingApp = {
  ...workingCapitalApp,
  _id: "6abb8df615eaff694fc43782",
  loanType: "Film Funding",
  filmComesUnder: "Bollywood",
  filmComesUnderOther: "",
  filmLanguages: ["Hindi", "English"],
  starCastNames: ["Aamir Khan", "Alia Bhatt"],
  totalProjectCost: 20000000,
  ownInvestmentAmount: 5000000,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("validateApplication — real product payloads", () => {
  const cases: [string, unknown][] = [
    ["Credit Card", creditCardApp],
    ["Working Capital", workingCapitalApp],
    ["Commercial Purchase", commercialPurchaseApp],
    ["Lease Rental Discounting", leaseRentalApp],
    ["OD/CC Limit", odccApp],
    ["Loan Against Share", loanAgainstShareApp],
    ["Film Funding", filmFundingApp],
  ];

  it.each(cases)("accepts the real %s payload", (_name, app) => {
    const { ok, errors } = validateApplication(app);
    expect(errors, errors.join("; ")).toEqual([]);
    expect(ok).toBe(true);
  });
});

describe("validateApplication — envelope", () => {
  it("rejects non-objects and arrays", () => {
    expect(validateApplication(null).ok).toBe(false);
    expect(validateApplication("app").ok).toBe(false);
    expect(validateApplication([creditCardApp]).ok).toBe(false);
  });

  it("requires the envelope fields", () => {
    const { ok, errors } = validateApplication({ ...creditCardApp, _id: "", status: undefined, createdAt: "nope" });
    expect(ok).toBe(false);
    expect(errors).toContain("_id: non-empty string required");
    expect(errors).toContain("status: non-empty string required");
    expect(errors).toContain("createdAt: parseable date string required");
  });

  it("rejects unexpected nested values on unknown keys", () => {
    const { ok, errors } = validateApplication({ ...creditCardApp, weird: { a: 1 } });
    expect(ok).toBe(false);
    expect(errors.some(e => e.startsWith("weird:"))).toBe(true);
  });

  it("allows the redundant sections block", () => {
    expect(validateApplication(creditCardApp).ok).toBe(true);
  });
});

describe("validateApplication — personal details", () => {
  it("requires every personal field", () => {
    const partial = { ...creditCardApp };
    for (const k of Object.keys(personal)) delete (partial as Record<string, unknown>)[k];
    const { ok, errors } = validateApplication(partial);
    expect(ok).toBe(false);
    expect(errors.filter(e => e.includes("non-empty string required")).length).toBeGreaterThanOrEqual(9);
  });

  it("checks mobile, email, PAN and pincode formats", () => {
    const { errors } = validateApplication({
      ...creditCardApp,
      mobile: "12345",
      email: "nope",
      panNumber: "abc",
      pincode: "56A001",
    });
    expect(errors).toContain('mobile: expected 10 digits, got "12345"');
    expect(errors.some(e => e.startsWith("email:"))).toBe(true);
    expect(errors.some(e => e.startsWith("panNumber:"))).toBe(true);
    expect(errors.some(e => e.startsWith("pincode:"))).toBe(true);
  });
});

describe("validateApplication — typed fields", () => {
  it("rejects negative and non-numeric amounts", () => {
    const { errors } = validateApplication({
      ...workingCapitalApp,
      loanAmount: -1,
      lastYearTurnover: "abc",
    });
    expect(errors).toContain("loanAmount: must be >= 0, got -1");
    expect(errors).toContain('lastYearTurnover: expected non-negative number, got "abc"');
  });

  it("accepts numeric strings and coerces them in sanitize", () => {
    const raw = { ...workingCapitalApp, loanAmount: "1000000", monthlyLeaseIncome: undefined };
    expect(validateApplication({ ...workingCapitalApp, loanAmount: "1000000" }).ok).toBe(true);
    const clean = sanitizeApplication<typeof workingCapitalApp>(raw);
    expect(clean).not.toBeNull();
    expect(clean!.loanAmount).toBe(1000000);
  });

  it("coerces numeric strings and preserves valid numbers via sanitizeApplication", () => {
    const clean = sanitizeApplication<typeof workingCapitalApp>({
      ...workingCapitalApp,
      loanAmount: "6000000",
      lastYearTurnover: 2500000,
    });
    expect(clean).not.toBeNull();
    expect(clean!.loanAmount).toBe(6000000);
    expect(clean!.lastYearTurnover).toBe(2500000);
  });

  it("rejects non-string arrays", () => {
    const { ok, errors } = validateApplication({
      ...filmFundingApp,
      filmLanguages: [1, 2],
    });
    expect(ok).toBe(false);
    expect(errors).toContain("filmLanguages: expected an array of strings");
  });

  it("accepts transactionBankName as string or object, rejects other shapes", () => {
    expect(validateApplication({ ...workingCapitalApp, transactionBankName: "HDFC Bank" }).ok).toBe(true);
    expect(validateApplication({ ...workingCapitalApp, transactionBankName: txnBank }).ok).toBe(true);
    expect(validateApplication({ ...workingCapitalApp, transactionBankName: { banks: [42] } }).ok).toBe(false);
  });
});

describe("sanitizeApplicationList", () => {
  it("keeps valid records and counts invalid ones", () => {
    const { valid, invalid } = sanitizeApplicationList<typeof workingCapitalApp>([
      workingCapitalApp,
      { ...filmFundingApp, mobile: "12" }, // malformed
      null,
    ]);
    expect(valid).toHaveLength(1);
    expect((valid[0] as unknown as typeof workingCapitalApp).loanType).toBe("Working Capital");
    expect(invalid).toBe(2);
  });

  it("returns empty for a non-array payload", () => {
    expect(sanitizeApplicationList(null)).toEqual({ valid: [], invalid: 0 });
  });
});
