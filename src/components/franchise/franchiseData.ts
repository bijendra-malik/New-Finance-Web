import type { FranchiseIconName } from "./FranchiseIcon";

export const FRANCHISE_EMAIL = "contactus@indexiafinance.com";

export const PARTNER_SHARE = 80;
export const INDEXIA_SHARE = 20;

export const MAX_PAYOUTS = [
  {
    id: "unsecured",
    icon: "unsecured",
    title: "Unsecured Loans",
    rate: "Up to 4.5%",
    caption: "payout",
    desc: "Personal, business, professional and other unsecured facilities placed with partner banks and NBFCs.",
  },
  {
    id: "secured",
    icon: "secured",
    title: "Secured Loans",
    rate: "Up to 2.5%",
    caption: "payout",
    desc: "Home, loan against property, gold, vehicle and other secured facilities placed with partner lenders.",
  },
] as const;

export interface JourneyStep {
  id: string;
  icon: FranchiseIconName;
  title: string;
  desc: string;
  external?: boolean;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "01",
    icon: "join",
    title: "Apply for a Franchisee",
    desc: "Fill in the required details and select your preferred franchise plan.",
  },
  {
    id: "02",
    icon: "user-plus",
    title: "Franchisee Code",
    desc: "After reviewing your details, Indexia Finance will provide you with a franchisee code, user ID and password.",
  },
  {
    id: "03",
    icon: "pen-line",
    title: "Customer Application",
    desc: "Fill out the application form on behalf of the customer.",
  },
  {
    id: "04",
    icon: "network",
    title: "Leads to the Right Banks / NBFCs",
    desc: "The customer's profile and loan details will be forwarded to the most suitable bank or NBFC from our network of 43+ banks and NBFCs. The selected bank or NBFC may contact the customer directly.",
  },
  {
    id: "05",
    icon: "search",
    title: "Lender Decision",
    desc: "The bank or NBFC will conduct due diligence on the customer's application and make the final approval or rejection decision.",
    external: true,
  },
  {
    id: "06",
    icon: "rupee",
    title: "Loan Disbursement",
    desc: "Once the loan is approved, the loan disbursement process will be completed.",
    external: true,
  },
  {
    id: "07",
    icon: "share",
    title: "Payout to the Franchisee",
    desc: "Following successful loan disbursement, the payout will be credited to the franchisee by the 10th of every month, as per the applicable payout terms.",
  },
];

export interface FranchisePlan {
  id: string;
  name: string;
  shortName: string;
  duration: string;
  fee: string;
  feeShort: string;
  renewal: string;
  months: number;
  recommended?: boolean;
  badge?: string;
}

export const AGREEMENT_FEE = "\u20B930,000 + GST";
export const AGREEMENT_FEE_NOTE =
  "\u20B930,000 + GST franchisee agreement fee is adjustable against payout under the monthly plan, subject to applicable terms.";

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

export const FRANCHISE_FAQS = [
  {
    q: "Is the \u20B930,000 + GST agreement fee refundable?",
    a: "The Franchisee Agreement fee is non-refundable and is valid for three years. It is adjustable against payout under the monthly plan, subject to applicable terms.",
  },
  {
    q: "Can I choose a monthly plan?",
    a: "Yes. A monthly plan is available alongside the 6-month, quarterly, annual and 3-year plans, and it can be picked in the application form. The current fee and validity are shown with the plans above.",
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
    q: "How do I become a Franchisee?",
    a: "Use the \u201CApply for a Franchise\u201D form with your name, mobile number, email address, PAN number, state and city. Our team reviews the details and issues your franchisee code, user ID and password.",
  },
];
