import { LOAN_AMOUNT_RANGES } from "../../constants/masters";
import { formatINRRounded } from "../../utils/formatters";

export const T = {
  navy: "var(--brand-navy)",
  navyDeep: "#032B5C",
  gold: "var(--brand-yellow)",
  goldSoft: "#E7F98F",
  cream: "#F1FAF8",
  paper: "#FFFFFF",
  ink: "#0C2A4D",
  inkSoft: "var(--brand-gray)",
  emerald: "var(--brand-teal)",
  emeraldSoft: "#D7F5F1",
  rust: "#2E6FB5",
  rustSoft: "#DEEAF8",
  limeDark: "#8FA916",
  limeSoft: "#F2FAD1",
  line: "#E2E8E7",
  onNavyMuted: "#D5E6F3",
  onNavyLine: "rgba(255,255,255,0.18)",
};

export const serif = { fontFamily: "'Fraunces', Georgia, serif" };

// ── Loan type config ──────────────────────────────────────────────────────────
export const loanTypes = [
  { id: "personal",  label: "Personal",   full: "Personal Loan",        rate: 11.0, minAmt: LOAN_AMOUNT_RANGES.personal.min,            maxAmt: 5_000_000,   minTenure: 1, maxTenure: 7  },
  { id: "home",      label: "Home",       full: "Home Loan",            rate: 8.5,  minAmt: LOAN_AMOUNT_RANGES.home.min,                maxAmt: 100_000_000, minTenure: 5, maxTenure: 30 },
  { id: "vehicle",   label: "Vehicle",    full: "Vehicle Loan",         rate: 9.0,  minAmt: LOAN_AMOUNT_RANGES.vehicle.min,             maxAmt: 20_000_000,  minTenure: 1, maxTenure: 7  },
  { id: "business",  label: "Business",   full: "Business Loan",        rate: 12.0, minAmt: LOAN_AMOUNT_RANGES.business.min,            maxAmt: 10_000_000,  minTenure: 1, maxTenure: 5  },
  { id: "education", label: "Education",  full: "Education Loan",       rate: 8.0,  minAmt: LOAN_AMOUNT_RANGES.education.min,           maxAmt: 30_000_000,  minTenure: 1, maxTenure: 15 },
  { id: "lap",       label: "Property",   full: "Loan Against Property",rate: 9.5,  minAmt: LOAN_AMOUNT_RANGES.loanAgainstProperty.min, maxAmt: 100_000_000, minTenure: 5, maxTenure: 20 },
  { id: "balance",   label: "Transfer",   full: "Balance Transfer",     rate: 9.0,  minAmt: LOAN_AMOUNT_RANGES.balanceTransfer.min,     maxAmt: 50_000_000,  minTenure: 1, maxTenure: 30 },
  { id: "credit",    label: "Credit Card",full: "Credit Card",          rate: 18.0, minAmt: 10000,   maxAmt: 500000,   minTenure: 1, maxTenure: 3  },
  { id: "project",   label: "Project",    full: "Project Loan",         rate: 10.5, minAmt: LOAN_AMOUNT_RANGES.project.min,             maxAmt: 500_000_000, minTenure: 1, maxTenure: 7  },
  { id: "commercial",label: "Commercial", full: "Commercial Purchase",  rate: 12.0, minAmt: LOAN_AMOUNT_RANGES.commercialPurchase.min,    maxAmt: 100_000_000, minTenure: 1, maxTenure: 10 },
  { id: "working",   label: "Working Cap",full: "Working Capital",      rate: 12.5, minAmt: LOAN_AMOUNT_RANGES.workingCapital.min,       maxAmt: 50_000_000,  minTenure: 1, maxTenure: 5  },
  { id: "lrd",       label: "Lease Rent", full: "Lease Rental Discounting", rate: 10.5, minAmt: LOAN_AMOUNT_RANGES.leaseRental.min,        maxAmt: 250_000_000, minTenure: 1, maxTenure: 10 },
  { id: "gold",      label: "Gold",       full: "Gold Loan",            rate: 9.0,  minAmt: LOAN_AMOUNT_RANGES.gold.min,                maxAmt: 5_000_000,   minTenure: 1, maxTenure: 3  },
  { id: "shares",    label: "Shares",     full: "Loan Against Shares",  rate: 11.0, minAmt: LOAN_AMOUNT_RANGES.loanAgainstShare.min,     maxAmt: 50_000_000,  minTenure: 1, maxTenure: 10 },
];

type BankRates = Record<string, number>;

export interface Bank {
  id: string;
  label: string;
  rates: BankRates;
  verified: string[];
}

export const banks: readonly Bank[] = [
  {
    id: "hdfc", label: "HDFC Bank",
    rates: { personal: 9.99, home: 8.0, vehicle: 9.0, business: 11.5, education: 8.5, lap: 9.5, balance: 8.1, credit: 18 },
    verified: ["personal", "home"],
  },
  {
    id: "icici", label: "ICICI Bank",
    rates: { personal: 10.25, home: 8.75, vehicle: 9.0, business: 12.0, education: 9.0, lap: 9.5, balance: 8.85, credit: 18 },
    verified: ["personal", "home"],
  },
  {
    id: "axis", label: "Axis Bank",
    rates: { personal: 9.99, home: 8.0, vehicle: 9.25, business: 12.0, education: 10.0, lap: 9.75, balance: 8.1, credit: 18 },
    verified: ["personal", "home"],
  },
  {
    id: "kotak", label: "Kotak Mahindra Bank",
    rates: { personal: 10.99, home: 7.6, vehicle: 9.5, business: 12.5, education: 10.5, lap: 9.75, balance: 7.7, credit: 18 },
    verified: ["personal", "home"],
  },
  {
    id: "sbi", label: "State Bank of India",
    rates: { personal: 10.0, home: 7.5, vehicle: 8.75, business: 11.0, education: 8.05, lap: 9.0, balance: 7.6, credit: 18 },
    verified: ["personal", "home"],
  },
  {
    id: "pnb", label: "PNB Housing",
    rates: { personal: 10.85, home: 7.45, vehicle: 9.25, business: 11.5, education: 8.5, lap: 9.25, balance: 7.55, credit: 18 },
    verified: ["personal", "home"],
  },
  {
    id: "bajaj", label: "Bajaj Finserv",
    rates: { personal: 10.0, home: 7.5, vehicle: 9.5, business: 13.0, education: 11.0, lap: 10.0, balance: 7.6, credit: 16 },
    verified: ["personal", "home"],
  },
  {
    id: "tata", label: "Tata Capital",
    rates: { personal: 10.99, home: 8.25, vehicle: 9.75, business: 13.5, education: 11.5, lap: 10.5, balance: 8.35, credit: 16 },
    verified: ["personal"],
  },
];

export const bankById = (id: string): Bank | undefined => banks.find(bank => bank.id === id);

// ── Helpers ───────────────────────────────────────────────────────────────────
export const fmt = formatINRRounded;
