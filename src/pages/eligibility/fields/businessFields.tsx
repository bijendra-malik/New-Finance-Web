import type { FormState } from "../formState";
import { type ProductSpec } from "../models";
import { DSCR_MIN, PROJECT_MIN_CONTRIBUTION, WC_BANK_SHARE, WC_TURNOVER_NORM, WC_TURNOVER_REQUIREMENT } from "../models";
import { AmountField, InfoTooltip } from "../fieldControls";

interface Props {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const DscrTooltip = () => (
  <InfoTooltip label="What is DSCR?">
    DSCR (Debt Service Coverage Ratio) is the monthly rent or projected cash flow divided by the loan's EMI, so it
    shows how many times over the income covers the repayment. Lenders want at least {DSCR_MIN}× cover, so the EMI
    is capped at that monthly figure ÷ {DSCR_MIN} and the loan is sized from that EMI over the tenure.
  </InfoTooltip>
);

const BusinessFields = ({ product, form, errors, set }: Props) => (
  <>
    {product.family === "wc" && (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wc-turnover"
            label="Annual business turnover"
            value={form.turnover}
            onChange={(next) => set("turnover", next)}
            error={errors.turnover}
            placeholder="e.g. 2,00,00,000"
            hint="Next 12 Months' Turnover"
            required
          />
          <AmountField
            id="elig-wc-stock"
            label="Stock / inventory"
            value={form.stock}
            onChange={(next) => set("stock", next)}
            error={errors.stock}
            placeholder="e.g. 20,00,000"
            hint="Paid Stock At Cost"
            required={form.odMode === "drawingPower"}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wc-debtors"
            label="Payments due from customers"
            value={form.debtors}
            onChange={(next) => set("debtors", next)}
            error={errors.debtors}
            placeholder="e.g. 10,00,000"
            hint="Within The Last 90 Days"
            required={form.odMode === "drawingPower"}
          />
          <AmountField
            id="elig-wc-ocl"
            label="Other short-term dues"
            value={form.otherCurrentLiabilities}
            onChange={(next) => set("otherCurrentLiabilities", next)}
            placeholder="e.g. 4,00,000"
            hint="Excluding Bank Loans"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wc-lender-limit"
            label="Lender's maximum limit (optional)"
            value={form.odLenderLimit}
            onChange={(next) => set("odLenderLimit", next)}
            placeholder="e.g. 50,00,000"
            hint="Bank Policy Cap"
          />
          <AmountField
            id="elig-wc-existing-limit"
            label="Existing OD/CC limit (optional)"
            value={form.odExistingLimit}
            onChange={(next) => set("odExistingLimit", next)}
            placeholder="e.g. 5,00,000"
            hint="Deducted From The Limit"
          />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Assessment method</p>
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
            {([
              ["turnover", "Turnover method"],
              ["drawingPower", "Drawing power"],
            ] as const).map(([value, label]) => {
              const active = form.odMode === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("odMode", value)}
                  aria-pressed={active}
                  className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11.5px] leading-4 text-slate-500">
            {form.odMode === "turnover"
              ? `${Math.round(WC_TURNOVER_REQUIREMENT * 100)}% of turnover is the requirement and the bank funds ${Math.round(WC_BANK_SHARE * 100)}% of it — ${Math.round(WC_TURNOVER_NORM * 10000) / 100}% of turnover.`
              : "Stock and receivables less the bank's margin and deductions, capped by the turnover norm."}
          </p>
        </div>

        {form.odMode === "drawingPower" && (
          <AmountField
            id="elig-od-margin"
            label="Borrower's margin"
            value={form.odMargin}
            onChange={(next) => set("odMargin", next)}
            placeholder="e.g. 5,00,000"
            hint="Your Own Contribution"
          />
        )}
      </div>
    )}

    {product.family === "project" && (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-project-cost"
            label="Total project cost"
            value={form.projectCost}
            onChange={(next) => set("projectCost", next)}
            error={errors.projectCost}
            placeholder="e.g. 5,00,00,000"
            hint="Total Cost Of The Project"
            required
          />
          <AmountField
            id="elig-project-contribution"
            label="Promoter's Own contribution"
            value={form.projectContribution}
            onChange={(next) => set("projectContribution", next)}
            error={errors.projectContribution}
            placeholder="e.g. 1,50,00,000"
            hint={`Minimum ${Math.round(PROJECT_MIN_CONTRIBUTION * 100)}% Is Required`}
            required
          />
        </div>
        <AmountField
          id="elig-project-cashflow"
          label="Projected monthly cash flow (optional)"
          value={form.projectCashFlow}
          onChange={(next) => set("projectCashFlow", next)}
          placeholder="e.g. 12,00,000"
          hint={`Caps The Loan At A ${DSCR_MIN}× DSCR`}
          tooltip={<DscrTooltip />}
        />
      </div>
    )}

    {product.family === "commercial" && (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-commercial-value"
            label="Property current market value"
            value={form.propertyValue}
            onChange={(next) => set("propertyValue", next)}
            error={errors.propertyValue}
            placeholder="e.g. 2,00,00,000"
            hint="Today's Market Value"
            required
          />
          <AmountField
            id="elig-commercial-rent"
            label="Monthly rent received (optional)"
            value={form.commercialRent}
            onChange={(next) => set("commercialRent", next)}
            placeholder="e.g. 1,00,000"
            hint={`Caps At A ${DSCR_MIN}× DSCR On The Rent`}
            tooltip={<DscrTooltip />}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-commercial-income"
            label="Monthly Net Income (optional)"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            placeholder="e.g. 1,50,000"
            hint="Caps The Loan At What You Repay"
          />
          <AmountField
            id="elig-commercial-emi"
            label="Total monthly EMI"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            placeholder="e.g. 20,000"
            hint="Enter 0 If You Have No EMI"
            required
          />
        </div>
        <AmountField
          id="elig-commercial-coapplicant"
          label="Co-applicant Monthly Net Income (optional)"
          value={form.commercialCoApplicant}
          onChange={(next) => set("commercialCoApplicant", next)}
          placeholder="e.g. 60,000"
          hint="Added To Your Income"
        />
      </div>
    )}

    {product.family === "turnover" && (
      <div className="space-y-5">
        <AmountField
          id="elig-wct-turnover"
          label="Projected annual turnover"
          value={form.turnover}
          onChange={(next) => set("turnover", next)}
          error={errors.turnover}
          placeholder="e.g. 3,00,00,000"
          hint="Next 12 Months' Turnover"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wct-current-assets"
            label="Eligible current assets"
            value={form.wcCurrentAssets}
            onChange={(next) => set("wcCurrentAssets", next)}
            error={errors.wcCurrentAssets}
            placeholder="e.g. 60,00,000"
            hint="Inventory Plus Receivables"
            required={form.wcMethod === "workingCapital"}
          />
          <AmountField
            id="elig-wct-current-liabilities"
            label="Current liabilities"
            value={form.wcCurrentLiabilities}
            onChange={(next) => set("wcCurrentLiabilities", next)}
            placeholder="e.g. 20,00,000"
            hint="Trade Creditors And Dues"
          />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Assessment method</p>
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
            {([
              ["turnover", "Turnover method"],
              ["workingCapital", "Working capital"],
            ] as const).map(([value, label]) => {
              const active = form.wcMethod === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("wcMethod", value)}
                  aria-pressed={active}
                  className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11.5px] leading-4 text-slate-500">
            {form.wcMethod === "turnover"
              ? `${Math.round(WC_TURNOVER_NORM * 10000) / 100}% of projected turnover sets the limit.`
              : "Current assets less current liabilities, financed after your margin, capped by the turnover norm."
            }
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wct-lender-limit"
            label="Lender's maximum limit (optional)"
            value={form.wcLenderLimit}
            onChange={(next) => set("wcLenderLimit", next)}
            placeholder="e.g. 1,00,00,000"
            hint="Bank Policy Cap"
          />
          <AmountField
            id="elig-wct-existing-limit"
            label="Existing working capital loans (optional)"
            value={form.wcExistingLimit}
            onChange={(next) => set("wcExistingLimit", next)}
            placeholder="e.g. 10,00,000"
            hint="Deducted From The Limit"
          />
        </div>
      </div>
    )}

  </>
);

export default BusinessFields;
