/**
 * Sample partner data for the franchisor dashboard.
 *
 * The franchise API currently exposes only register / login,
 * POST /franchise/apply and GET /auth/franchise/profile. There is no endpoint for
 * leads, cases or payout statements yet, so the workspace screens are built on the
 * labelled sample rows below. Every consumer must surface SAMPLE_NOTICE alongside
 * them, and this module should be replaced by real calls once those endpoints exist.
 */

export type LeadStage = "New" | "Submitted" | "In review" | "Approved" | "Disbursed" | "Rejected";

export interface PartnerLead {
  id: string;
  customer: string;
  product: string;
  /** Requested amount in rupees. */
  amount: number;
  stage: LeadStage;
  submittedOn: string;
  lender: string;
}

export interface PayoutRow {
  id: string;
  period: string;
  cases: number;
  /** The lender's payout on disbursed cases, before the split. */
  grossPayout: number;
  /** The partner's share of that payout. */
  partnerShare: number;
  status: "Paid" | "Processing" | "Scheduled";
}

export const SAMPLE_NOTICE =
  "Sample data — the franchise service does not publish leads or payout statements yet.";

export const SAMPLE_LEADS: PartnerLead[] = [
  { id: "LD-2041", customer: "R. Kulkarni", product: "Personal Loan", amount: 450000, stage: "Disbursed", submittedOn: "18 Sep 2026", lender: "Partner NBFC A" },
  { id: "LD-2052", customer: "S. Menon", product: "Business Loan", amount: 1250000, stage: "Approved", submittedOn: "22 Sep 2026", lender: "Partner Bank B" },
  { id: "LD-2063", customer: "A. Bhatt", product: "Home Loan", amount: 3200000, stage: "In review", submittedOn: "27 Sep 2026", lender: "Partner Bank B" },
  { id: "LD-2074", customer: "N. Iyer", product: "Loan Against Property", amount: 2400000, stage: "Submitted", submittedOn: "30 Sep 2026", lender: "Partner NBFC C" },
  { id: "LD-2085", customer: "P. Deshmukh", product: "Vehicle Loan", amount: 780000, stage: "New", submittedOn: "02 Oct 2026", lender: "—" },
  { id: "LD-2096", customer: "K. Raghavan", product: "Personal Loan", amount: 300000, stage: "Rejected", submittedOn: "03 Oct 2026", lender: "Partner NBFC A" },
  { id: "LD-2107", customer: "M. Fernandes", product: "Business Loan", amount: 900000, stage: "Submitted", submittedOn: "05 Oct 2026", lender: "Partner NBFC C" },
  { id: "LD-2118", customer: "D. Chatterjee", product: "Gold Loan", amount: 250000, stage: "Disbursed", submittedOn: "06 Oct 2026", lender: "Partner NBFC A" },
];

export const SAMPLE_PAYOUTS: PayoutRow[] = [
  { id: "PO-0612", period: "June 2026", cases: 4, grossPayout: 186000, partnerShare: 148800, status: "Paid" },
  { id: "PO-0713", period: "July 2026", cases: 6, grossPayout: 254000, partnerShare: 203200, status: "Paid" },
  { id: "PO-0814", period: "August 2026", cases: 5, grossPayout: 212500, partnerShare: 170000, status: "Processing" },
  { id: "PO-0915", period: "September 2026", cases: 7, grossPayout: 296000, partnerShare: 236800, status: "Scheduled" },
];

/** Partner's share of an eligible payout. */
export const PARTNER_SHARE = 80;
/** Indexia's share of an eligible payout. */
export const INDEXIA_SHARE = 20;

/** Rupees with Indian digit grouping, e.g. 1250000 → ₹12,50,000. */
export const inr = (value: number): string => `₹${Math.round(value).toLocaleString("en-IN")}`;

/** Compact rupee label for tiles, e.g. 1250000 → ₹12.5L. */
export const inrCompact = (value: number): string => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

export interface LeadStageTone {
  bg: string;
  border: string;
  text: string;
}

/** One colour per pipeline stage, so tables and chips read the same everywhere. */
export const LEAD_STAGE_TONES: Record<LeadStage, LeadStageTone> = {
  New: { bg: "#eef2f7", border: "#d7dee8", text: "#475569" },
  Submitted: { bg: "#e8f1fb", border: "#c6dcf4", text: "#1b6ca8" },
  "In review": { bg: "#fdf6e3", border: "#f2e2b6", text: "#8a6d1b" },
  Approved: { bg: "#e9f7f2", border: "#bde6d8", text: "#0f7a5f" },
  Disbursed: { bg: "#e6f7ee", border: "#b6e4c9", text: "#0b7a3f" },
  Rejected: { bg: "#fdecec", border: "#f5c6c6", text: "#b3261e" },
};

/** Totals used by the overview tiles, derived from the sample tables. */
export const summariseLeads = (leads: PartnerLead[]) => ({
  total: leads.length,
  inProgress: leads.filter((l) => l.stage === "Submitted" || l.stage === "In review").length,
  disbursed: leads.filter((l) => l.stage === "Disbursed").length,
  requestedValue: leads.reduce((sum, l) => sum + l.amount, 0),
});

export const summarisePayouts = (rows: PayoutRow[]) => ({
  cases: rows.reduce((sum, r) => sum + r.cases, 0),
  partnerShare: rows.reduce((sum, r) => sum + r.partnerShare, 0),
  lastPaid: rows.filter((r) => r.status === "Paid").at(-1)?.partnerShare ?? 0,
});
