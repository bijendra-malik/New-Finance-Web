import type { FormState } from "../formState";
import { type ProductSpec } from "../models";
import { AmountField, FieldLabel, FieldError } from "../fieldControls";
import { CARATS, fieldClass } from "../formState";

interface Props {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const AssetFields = ({ product, form, errors, set }: Props) => (
  <>
    {product.family === "gold" && (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="elig-gold-weight" required>Gold weight (grams)</FieldLabel>
            <input
              id="elig-gold-weight"
              type="number"
              min={1}
              step={1}
              value={form.goldGrams}
              placeholder="Net Weight, No Stones Or Thread"
              onChange={(event) => set("goldGrams", event.target.value)}
              className={`${fieldClass(errors.goldGrams)} placeholder:text-[12px]`}
            />
            <FieldError>{errors.goldGrams}</FieldError>
          </div>

          <AmountField
            id="elig-gold-rate"
            label={`Gold rate per gram (${form.goldCarat}K)`}
            value={form.goldRate}
            onChange={(next) => set("goldRate", next)}
            error={errors.goldRate}
            placeholder="e.g. 7,200"
            hint="Today's Rate For This Purity"
            required
          />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Gold purity</p>
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1">
            {CARATS.map((carat) => {
              const active = carat === form.goldCarat;
              return (
                <button
                  key={carat}
                  type="button"
                  onClick={() => set("goldCarat", carat)}
                  aria-pressed={active}
                  className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {carat}K
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-gold-income"
            label="Monthly Net Income"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            error={errors.monthlyIncome}
            placeholder="e.g. 60,000"
            hint="Take-Home Pay That Reaches Your Bank"
            required
          />
          <AmountField
            id="elig-gold-emi"
            label="Total monthly EMI"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            placeholder="e.g. 8,000"
            hint="Enter 0 If You Have No EMI"
            required
          />
        </div>
      </div>
    )}

    {product.family === "share" && (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-share-value"
            label="Market value of shares"
            value={form.shareValue}
            onChange={(next) => set("shareValue", next)}
            error={errors.shareValue}
            placeholder="e.g. 10,00,000"
            hint="Value Of The Shares Pledged"
            required
          />
          <AmountField
            id="elig-share-income"
            label="Monthly Net Income (optional)"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            placeholder="e.g. 1,00,000"
            hint="Caps The Loan At What You Repay"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-share-lender-limit"
            label="Lender's maximum limit (optional)"
            value={form.shareLenderLimit}
            onChange={(next) => set("shareLenderLimit", next)}
            placeholder="e.g. 20,00,000"
            hint="Scheme Cap For This Portfolio"
          />
          <AmountField
            id="elig-share-exposure"
            label="Existing loan against these shares (optional)"
            value={form.shareExposure}
            onChange={(next) => set("shareExposure", next)}
            placeholder="e.g. 0"
            hint="Deducted From The Limit"
          />
        </div>
        <AmountField
          id="elig-share-emi"
          label="Total monthly EMI"
          value={form.existingEmi}
          onChange={(next) => set("existingEmi", next)}
          error={errors.existingEmi}
          placeholder="e.g. 8,000"
          hint="Enter 0 If You Have No EMI"
          required
        />
      </div>
    )}

  </>
);

export default AssetFields;
