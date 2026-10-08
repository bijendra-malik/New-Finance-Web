// Content for the franchise pages. Kept free of JSX so the icon set can live in its own component module.

import type { FranchiseIconName } from "./FranchiseIcon";

/** Email every franchisor enquiry and franchisee application is routed to. */
export const FRANCHISE_EMAIL = "contactus@indexiafinance.com";

/** Payout sharing between the franchise partner and Indexia Finance. */
export const PARTNER_SHARE = 80;
export const INDEXIA_SHARE = 20;

/** Single disclaimer reused wherever a payout figure appears. */
export const PAYOUT_DISCLAIMER =
  "Payouts are subject to successful disbursement and applicable product, lender, and regulatory terms.";

/** Maximum payout rates — deliberately framed as ceilings, never as guarantees. */
export const MAX_PAYOUTS = [
  {
    id: "unsecured",
    icon: "unsecured",
    title: "Unsecured Loans",
    rate: "Up to 4%",
    caption: "payout",
    desc: "Personal, business, professional and other unsecured facilities placed with partner banks and NBFCs.",
  },
  {
    id: "secured",
    icon: "secured",
    title: "Secured Loans",
    rate: "Up to 2.4%",
    caption: "payout",
    desc: "Home, loan against property, gold, vehicle and other secured facilities placed with partner lenders.",
  },
] as const;

/**
 * The single end-to-end journey, from application to payout.
 *
 * This replaces the three separate step lists the page used to carry (the model's
 * four steps, the post-application timeline and the lead-dependency chain), which
 * all described overlapping parts of the same sequence.
 */
export interface JourneyStep {
  id: string;
  icon: FranchiseIconName;
  title: string;
  desc: string;
  /** Marks the steps where the outcome is not in the franchise partner's hands. */
  external?: boolean;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "01",
    icon: "join",
    title: "Apply and pick a plan",
    desc: "Submit your PAN details and choose the plan duration. Franchise allotment is confirmed after agreement and verification.",
  },
  {
    id: "02",
    icon: "lead",
    title: "Generate customer leads",
    desc: "Your business submits eligible customer leads for the loan and business products you want to offer.",
  },
  {
    id: "03",
    icon: "process",
    title: "Indexia places the case",
    desc: "We work with our partner banks and NBFCs to process eligible applications from a single desk.",
  },
  {
    id: "04",
    icon: "doc",
    title: "The lender decides",
    desc: "Each bank or NBFC approves or declines the case under its own credit policy — Indexia Finance does not decide this.",
    external: true,
  },
  {
    id: "05",
    icon: "rupee",
    title: "The loan disburses",
    desc: "The customer's loan is disbursed and the lender releases the payout applicable to that product and case.",
    external: true,
  },
  {
    id: "06",
    icon: "share",
    title: "Your share is credited",
    desc: "The payout released on that case is shared with you as the franchise partner, on the terms set out below.",
  },
];

/**
 * What a payout actually depends on. Stated once, as one panel, because the
 * page previously repeated the same caveat in four separate sections.
 */
export const EARNING_DEPENDENCIES = [
  {
    title: "No leads means no payout",
    desc: "Revenue flows only from customer business that disburses. The franchise fee buys access to the franchise, products and payout structure — it is not a fixed-return investment.",
  },
  {
    title: "Verification is individual",
    desc: "Each applicant is reviewed individually and may be asked for additional documentation before an agreement is issued.",
  },
] as const;

/** Franchise plans, cheapest last so the 3-year plan reads first. */
export interface FranchisePlan {
  id: string;
  name: string;
  /** Short label used in the comparison table columns. */
  shortName: string;
  duration: string;
  /** Fee as shown on the plan card, in lakh/thousand shorthand. */
  fee: string;
  /** Fee for the comparison table. */
  feeShort: string;
  renewal: string;
  /** Whole months of validity — used for the per-month view. */
  months: number;
  recommended?: boolean;
  badge?: string;
}

export const FRANCHISE_PLANS: FranchisePlan[] = [
  {
    id: "3-year",
    name: "3-Year Plan",
    shortName: "3 Year",
    duration: "3 Years",
    fee: "\u20B92.49 Lakh + GST",
    feeShort: "\u20B92.49L + GST",
    renewal: "\u20B93,900",
    months: 36,
    recommended: true,
    badge: "Best Value",
  },
  { id: "annual", name: "Annual Plan", shortName: "Annual", duration: "1 Year", fee: "\u20B91.19 Lakh + GST", feeShort: "\u20B91.19L + GST", renewal: "As applicable", months: 12 },
  { id: "6-month", name: "6-Month Plan", shortName: "6 Month", duration: "6 Months", fee: "\u20B989,000 + GST", feeShort: "\u20B989K + GST", renewal: "As applicable", months: 6 },
  { id: "quarterly", name: "Quarterly Plan", shortName: "Quarterly", duration: "3 Months", fee: "\u20B959,000 + GST", feeShort: "\u20B959K + GST", renewal: "As applicable", months: 3 },
  { id: "monthly", name: "Monthly Plan", shortName: "Monthly", duration: "1 Month", fee: "\u20B924,000 + GST", feeShort: "\u20B924K + GST", renewal: "As applicable", months: 1 },
];

/** Mandatory one-time agreement fee, shown separately so it is never buried. */
export const AGREEMENT_FEE = "\u20B930,000 + GST";
export const AGREEMENT_FEE_NOTE =
  "\u20B930,000 + GST franchisee agreement fee is adjustable against payout under the monthly plan, subject to applicable terms.";

/** Options for the franchisee application form's package dropdown. */
export const PLAN_OPTIONS = FRANCHISE_PLANS.map((p) => `${p.duration} \u2014 ${p.feeShort}`);

export const BENEFITS = [
  { icon: "network", title: "Access to Banks & NBFCs", desc: "Place eligible customer cases with a wide panel of partner banks and NBFCs from a single desk." },
  { icon: "products", title: "Multiple Loan Products", desc: "Offer secured and unsecured products across 18 loan categories instead of a single lender's line." },
  { icon: "share", title: "Attractive Payout Structure", desc: "Eligible payouts are shared with the franchise partner on published terms, with no hidden deduction." },
  { icon: "plans", title: "Flexible Franchise Plans", desc: "Pick a 3-year, annual, 6-month, quarterly or monthly plan based on your business stage." },
  { icon: "opportunity", title: "Business Opportunity", desc: "Build a financial-services business in your own market under an established brand." },
  { icon: "support", title: "Dedicated Support", desc: "Assistance from our franchise team on plans, onboarding, products and payout queries." },
  { icon: "digital", title: "Digital Lead Management", desc: "Submit customer leads through a structured digital process with clear status tracking." },
  { icon: "scale", title: "Scalable Business Model", desc: "Start with a shorter plan and move to a longer tenure as your customer base grows." },
] as const;

/**
 * Only questions whose answers are not already stated in the sections above.
 * Anything the journey, payout or plans sections explain in their own words is
 * deliberately left out here, so the page never answers the same question twice.
 */
export const FRANCHISE_FAQS = [
  {
    q: "Is the \u20B930,000 + GST agreement fee refundable?",
    a: "The agreement fee is adjustable against payout under the monthly plan, subject to applicable terms. It is not presented as a refundable deposit.",
  },
  {
    q: "Can I choose a monthly plan?",
    a: "Yes. A monthly plan (\u20B924,000 + GST, 1 month validity) is available alongside the 6-month, quarterly, annual and 3-year plans.",
  },
  {
    q: "What happens when my franchise plan expires?",
    a: "Your plan covers a fixed validity period — 1 month to 3 years depending on what you choose. Renewal terms, including the applicable renewal fee, are as communicated for your plan at the time of renewal.",
  },
  {
    q: "Is loan approval guaranteed?",
    a: "No. Loan approval and sanction are decided solely by the respective bank or NBFC based on their credit policy, the customer's profile and applicable regulations. Indexia Finance does not guarantee approval for any application.",
  },
  {
    q: "Are payouts guaranteed?",
    a: "No. Payouts are only generated on successful disbursement of eligible cases and are subject to applicable product, lender and regulatory terms. No income is guaranteed.",
  },
  {
    q: "What documents are required?",
    a: "To apply, share your full name as per PAN, PAN number, mobile number, email address, state, city and address, along with the package duration you are interested in. Agreement and verification documents are completed as applicable after review.",
  },
  {
    q: "How do I become a franchisor?",
    a: "Use the \u201CBecome a Franchisor\u201D form with your name, mobile number, email address, PAN number, state and city. Our team reviews the details and gets in touch with you.",
  },
];
