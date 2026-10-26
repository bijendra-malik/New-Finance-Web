import type { FranchiseSession } from "../../../utils/franchiseSession";
import { LOAN_PRODUCTS } from "./loanCatalogue";

interface LoanFormsMenuProps {
  session: FranchiseSession;
  canSubmit: boolean;
  onOpenProduct: (productKey: string) => void;
  /** The client this filing is for, when one has already been picked. */
  filingFor?: { fullName: string; mobile?: string } | null;
  onClearClient?: () => void;
}

const LoanFormsMenu = ({
  session,
  canSubmit,
  onOpenProduct,
  filingFor = null,
  onClearClient,
}: LoanFormsMenuProps) => (
  <div className="mt-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800">Loan products</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          {LOAN_PRODUCTS.length} products · filed under <span className="font-bold">{session.franchiseId}</span>
        </p>
      </div>

      {filingFor && (
        <div className="flex items-center gap-3 rounded-xl px-3.5 py-2" style={{ background: "var(--brand-navy-14)" }}>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-(--brand-navy)">Filing for</p>
            <p className="truncate text-[12.5px] font-bold text-slate-700">
              {filingFor.fullName}
              {filingFor.mobile ? ` · ${filingFor.mobile}` : ""}
            </p>
          </div>
          {onClearClient && (
            <button
              type="button"
              onClick={onClearClient}
              className="shrink-0 rounded-lg px-2 py-1 text-[11.5px] font-bold text-(--brand-teal) hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>

    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LOAN_PRODUCTS.map((product) => (
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
          aria-label={`Start a ${product.name} application`}
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
                Start filing
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

export default LoanFormsMenu;
