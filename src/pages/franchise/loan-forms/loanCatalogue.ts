// The products a franchisee can file, and the labels the portal shows for them.
// Every product's `key` is also the slug the filing dashboard is opened with
// (/franchisor-dashboard/apply/<key>), so it must match PRODUCT_FORMS in
// productForms.ts and the backend's product key.

export interface LoanProduct {
  key: string;
  name: string;
  icon: string;
  amount: string;
  tenure: string;
  category: "Secured" | "Unsecured";
}

export const LOAN_PRODUCTS: readonly LoanProduct[] = [
  { key: "personal-loan", name: "Personal Loan", icon: "💳", amount: "₹50,000 onwards", tenure: "1–7 years", category: "Unsecured" },
  { key: "business-loan", name: "Business Loan", icon: "🏢", amount: "₹1,00,000 onwards", tenure: "Up to 5 years", category: "Unsecured" },
  { key: "home-loan", name: "Home Loan", icon: "🏠", amount: "₹3,00,000 onwards", tenure: "Up to 30 years", category: "Secured" },
  { key: "loan-against-property", name: "Loan Against Property", icon: "🏛️", amount: "₹5,00,000 onwards", tenure: "Up to 20 years", category: "Secured" },
  { key: "balance-transfer", name: "Balance Transfer", icon: "🔁", amount: "Existing loan balance", tenure: "Up to 30 years", category: "Unsecured" },
  { key: "project-loan", name: "Project Loan", icon: "🏗️", amount: "As per project", tenure: "Up to 10 years", category: "Secured" },
  { key: "vehicle-loan", name: "Vehicle Loan", icon: "🚗", amount: "On-road vehicle value", tenure: "Up to 7 years", category: "Secured" },
  { key: "education-loan", name: "Education Loan", icon: "🎓", amount: "₹50,000 onwards", tenure: "Up to 15 years", category: "Secured" },
  { key: "credit-card", name: "Credit Card", icon: "💳", amount: "Credit limit", tenure: "Revolving", category: "Unsecured" },
  { key: "commercial-purchase", name: "Commercial Purchase", icon: "🏬", amount: "Purchase value", tenure: "Up to 20 years", category: "Secured" },
  { key: "working-capital", name: "Working Capital", icon: "⚙️", amount: "As per requirement", tenure: "Up to 5 years", category: "Unsecured" },
  { key: "lease-rental-discounting", name: "Lease Rental Discounting", icon: "📜", amount: "Lease receivables", tenure: "Up to 10 years", category: "Secured" },
  { key: "od-cc-limit", name: "OD / CC Limit", icon: "📊", amount: "As sanctioned", tenure: "1–20 years", category: "Unsecured" },
  { key: "loan-against-share", name: "Loan Against Share", icon: "📈", amount: "Market value × LTV", tenure: "Up to 6 years", category: "Secured" },
  { key: "film-funding", name: "Film Funding", icon: "🎬", amount: "Project cost", tenure: "Up to 5 years", category: "Secured" },
  { key: "npa", name: "NPA", icon: "⚠️", amount: "As per case", tenure: "Up to 5 years", category: "Secured" },
  { key: "gold-loan", name: "Gold Loan", icon: "🥇", amount: "Gold value × LTV", tenure: "Up to 4 years", category: "Secured" },
  { key: "fdi", name: "FDI", icon: "🌍", amount: "As per eligibility", tenure: "3–15 years", category: "Secured" },
];

/** The product with this key, or null when the key is not one we file. */
export const productFor = (key: string | null | undefined): LoanProduct | null =>
  key ? LOAN_PRODUCTS.find((product) => product.key === key) ?? null : null;

/** Display name for a product key, falling back to the key itself. */
export const productNameFor = (key: string): string => productFor(key)?.name ?? key;
