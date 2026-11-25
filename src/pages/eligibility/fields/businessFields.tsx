import type { FormState } from "../formState";
import { type ProductSpec } from "../models";
import { DSCR_MIN } from "../models";
import { AmountField, PlainField } from "../fieldControls";

interface Props {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const BusinessFields = ({ product, form, errors, set }: Props) => (
  <>
    {product.family === "wc" && (
      <div className="space-y-4">
        <AmountField
          id="elig-wc-turnover"
          label="Annual business turnover"
          value={form.turnover}
          onChange={(next) => set("turnover", next)}
          error={errors.turnover}
          hint="What you expect over the next 12 months"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wc-stock"
            label="Stock / inventory"
            value={form.stock}
            onChange={(next) => set("stock", next)}
            error={errors.stock}
            hint="Paid stock at cost"
            required={form.odMode === "drawingPower"}
          />
          <AmountField
            id="elig-wc-debtors"
            label="Payments due from customers"
            value={form.debtors}
            onChange={(next) => set("debtors", next)}
            error={errors.debtors}
            hint="Within the last 90 days"
            required={form.odMode === "drawingPower"}
          />
        </div>
        <AmountField
          id="elig-wc-ocl"
          label="Other short-term dues"
          value={form.otherCurrentLiabilities}
          onChange={(next) => set("otherCurrentLiabilities", next)}
          hint="Excluding bank loans"
        />

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
              ? "25% of turnover is the requirement and the bank funds 75% of it — 18.75% of turnover."
              : "Stock and receivables less the bank's margin and deductions, capped by the turnover norm."}
          </p>
        </div>

        {form.odMode === "drawingPower" && (
          <AmountField
            id="elig-od-margin"
            label="Borrower's margin"
            value={form.odMargin}
            onChange={(next) => set("odMargin", next)}
            hint="Deducted from drawing power; your own contribution"
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
            hint="Land, construction, plant and pre-operative costs"
          />
          <AmountField
            id="elig-project-contribution"
            label="Promoter contribution"
            value={form.projectContribution}
            onChange={(next) => set("projectContribution", next)}
            error={errors.projectContribution}
            hint="Your own equity in the project"
            required
          />
        </div>
        <AmountField
          id="elig-project-cashflow"
          label="Projected monthly cash flow (optional)"
          value={form.projectCashFlow}
          onChange={(next) => set("projectCashFlow", next)}
          hint={`Caps the loan at a ${DSCR_MIN}× DSCR on the project's cash flow`}
        />
        <PlainField
          id="elig-project-dscr"
          label="DSCR assumption (×)"
          value={form.projectDscr}
          onChange={(next) => set("projectDscr", next.replace(/[^\d.]/g, ""))}
          inputMode="tel"
          maxLength={4}
          hint="Debt service cover lenders ask for; 1.25× is typical"
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
            hint="Today's market value, not the purchase price; lenders fund about 70% of it"
            required
          />
          <AmountField
            id="elig-commercial-rent"
            label="Monthly rent received (optional)"
            value={form.commercialRent}
            onChange={(next) => set("commercialRent", next)}
            hint={`Caps the loan at a ${DSCR_MIN}× DSCR on the rent`}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-commercial-income"
            label="Monthly income (optional)"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            hint="Caps the loan at what you can repay"
          />
          <AmountField
            id="elig-commercial-emi"
            label="EMIs you already pay"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            hint="Enter 0 if you have none"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-commercial-coapplicant"
            label="Co-applicant monthly income (optional)"
            value={form.commercialCoApplicant}
            onChange={(next) => set("commercialCoApplicant", next)}
            hint="Added to your income when the lender counts both"
          />
          <PlainField
            id="elig-commercial-foir"
            label="FOIR (%)"
            value={form.commercialFoir}
            onChange={(next) => set("commercialFoir", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={4}
            hint="Share of income lenders allow for all EMIs; 70% is typical"
          />
        </div>
        <PlainField
          id="elig-commercial-ltv"
          label="LTV (%)"
          value={form.commercialLtv}
          onChange={(next) => set("commercialLtv", next.replace(/[^\d.]/g, ""))}
          inputMode="tel"
          maxLength={3}
          hint="Share of the property value lenders fund; 70% is typical"
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
          hint="What you expect over the next 12 months"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PlainField
            id="elig-wct-assessment"
            label="Assessment percentage (%)"
            value={form.wcAssessment}
            onChange={(next) => set("wcAssessment", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={5}
            placeholder="e.g. 18.75"
            error={errors.wcAssessment}
            hint="Turnover norm; 18.75% is the Nayak default (75% of a 25% requirement)"
          />
          <AmountField
            id="elig-wct-margin"
            label="Borrower's margin"
            value={form.wcMargin}
            onChange={(next) => set("wcMargin", next)}
            hint="Your own contribution to the working capital"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-wct-current-assets"
            label="Eligible current assets"
            value={form.wcCurrentAssets}
            onChange={(next) => set("wcCurrentAssets", next)}
            error={errors.wcCurrentAssets}
            hint="Inventory, receivables and other qualifying assets"
            required={form.wcMethod === "drawingPower"}
          />
          <AmountField
            id="elig-wct-current-liabilities"
            label="Current liabilities"
            value={form.wcCurrentLiabilities}
            onChange={(next) => set("wcCurrentLiabilities", next)}
            hint="Trade creditors and other current liabilities"
          />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Assessment method</p>
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
            {([
              ["turnover", "Turnover method"],
              ["drawingPower", "Drawing power"],
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
              ? "The turnover norm less your margin sets the limit."
              : "Current assets less current liabilities, less your margin, capped by the turnover norm."
            }
          </p>
        </div>
      </div>
    )}

  </>
);

export default BusinessFields;
