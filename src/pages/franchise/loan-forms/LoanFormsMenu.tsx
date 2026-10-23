import type { FranchiseSession } from "../../../utils/franchiseSession";

interface LoanFormsMenuProps {
  session: FranchiseSession;
  profile: { name?: string; mobile?: string; email?: string; isVerified?: boolean; franchiseStatus?: string } | null;
  canSubmit: boolean;
  onOpenProduct: (productKey: string) => void;
}

const PRODUCTS = [
  {
    key: "personal-loan",
    name: "Personal Loan",
    icon: "💳",
    amount: "₹50,000 – ₹50,00,000",
    tenure: "1–84 months",
    category: "Unsecured",
  },
  {
    key: "business-loan",
    name: "Business Loan",
    icon: "🏢",
    amount: "₹1,00,000 – ₹50,00,000",
    tenure: "Up to 84 months",
    category: "Unsecured",
  },
  {
    key: "home-loan",
    name: "Home Loan",
    icon: "🏠",
    amount: "Up to ₹10,00,00,000",
    tenure: "Up to 30 years",
    category: "Secured",
  },
  {
    key: "loan-against-property",
    name: "Loan Against Property",
    icon: "🏛️",
    amount: "Up to ₹10,00,00,000",
    tenure: "Up to 15 years",
    category: "Secured",
  },
  {
    key: "balance-transfer",
    name: "Balance Transfer",
    icon: "🔁",
    amount: "Existing loan balance",
    tenure: "Up to 84 months",
    category: "Unsecured",
  },
  {
    key: "project-loan",
    name: "Project Loan",
    icon: "🏗️",
    amount: "As per project",
    tenure: "As per lender",
    category: "Secured",
  },
  {
    key: "vehicle-loan",
    name: "Vehicle Loan",
    icon: "🚗",
    amount: "On-road vehicle value",
    tenure: "Up to 84 months",
    category: "Secured",
  },
  {
    key: "education-loan",
    name: "Education Loan",
    icon: "🎓",
    amount: "Up to ₹50,00,000",
    tenure: "Up to 15 years",
    category: "Secured",
  },
  {
    key: "credit-card",
    name: "Credit Card",
    icon: "💳",
    amount: "Credit limit",
    tenure: "Revolving",
    category: "Unsecured",
  },
  {
    key: "commercial-purchase",
    name: "Commercial Purchase",
    icon: "🏬",
    amount: "Purchase value",
    tenure: "Up to 84 months",
    category: "Secured",
  },
  {
    key: "working-capital",
    name: "Working Capital",
    icon: "⚙️",
    amount: "As per requirement",
    tenure: "Up to 84 months",
    category: "Unsecured",
  },
  {
    key: "lease-rental-discounting",
    name: "Lease Rental Discounting",
    icon: "📜",
    amount: "Lease receivables",
    tenure: "Up to 84 months",
    category: "Secured",
  },
  {
    key: "od-cc-limit",
    name: "OD / CC Limit",
    icon: "📊",
    amount: "As sanctioned",
    tenure: "As per limit",
    category: "Unsecured",
  },
  {
    key: "loan-against-share",
    name: "Loan Against Share",
    icon: "📈",
    amount: "Market value × LTV",
    tenure: "Up to 84 months",
    category: "Secured",
  },
  {
    key: "film-funding",
    name: "Film Funding",
    icon: "🎬",
    amount: "Project cost",
    tenure: "As per lender",
    category: "Secured",
  },
  {
    key: "npa",
    name: "NPA",
    icon: "⚠️",
    amount: "As per case",
    tenure: "As per lender",
    category: "Secured",
  },
  {
    key: "gold-loan",
    name: "Gold Loan",
    icon: "🥇",
    amount: "Gold value × LTV",
    tenure: "Up to 12 months",
    category: "Secured",
  },
  {
    key: "fdi",
    name: "FDI",
    icon: "🌍",
    amount: "As per eligibility",
    tenure: "As per lender",
    category: "Secured",
  },
];

const LOAN_KEY_TO_NAME: Record<string, string> = Object.fromEntries(
  PRODUCTS.map((p) => [p.key, p.name]),
);

const LoanFormsMenu = ({ session, canSubmit, onOpenProduct }: LoanFormsMenuProps) => {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Loan products</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            {PRODUCTS.length} products · filed under <span className="font-bold">{session.franchiseId}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article
            key={product.key}
            className="rounded-2xl bg-white p-5 transition-all"
            style={{
              border: "1px solid rgba(6,106,156,0.12)",
              boxShadow: "0 2px 14px rgba(6,106,156,0.06)",
              opacity: canSubmit ? 1 : 0.6,
              cursor: canSubmit ? "pointer" : "default",
            }}
            onClick={() => { if (canSubmit) onOpenProduct(product.key); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (canSubmit) onOpenProduct(product.key);
              }
            }}
            tabIndex={canSubmit ? 0 : -1}
            role={canSubmit ? "button" : undefined}
            aria-label={`Open ${product.name} application form`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--brand-navy-14)" }}
                >
                  <span className="text-lg leading-none">{product.icon}</span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-extrabold text-slate-800">{product.name}</h3>
                  <p className="mt-0.5 text-[11.5px] text-slate-500">{product.category}</p>
                </div>
              </div>
              {canSubmit && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  Open form
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-slate-600">
              <span className="font-semibold text-slate-700">Amount · {product.amount}</span>
              <span>Tenure · {product.tenure}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export { LOAN_KEY_TO_NAME };
export default LoanFormsMenu;
