import type { FormState } from "../formState";
import { type ProductSpec } from "../models";
import { AmountField, PlainField, FieldLabel, FieldError } from "../fieldControls";
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
              onChange={(event) => set("goldGrams", event.target.value)}
              className={fieldClass(errors.goldGrams)}
            />
            <FieldError>{errors.goldGrams}</FieldError>
            {!errors.goldGrams && (
              <p className="mt-1 text-[11px] leading-4 text-slate-400">Net weight, without stones or thread.</p>
            )}
          </div>

          <AmountField
            id="elig-gold-rate"
            label={`Gold rate per gram (${form.goldCarat}K)`}
            value={form.goldRate}
            onChange={(next) => set("goldRate", next)}
            error={errors.goldRate}
            hint="Today's rate for the purity you selected"
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
            label="Monthly income (optional)"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            hint="Helps us check you can repay comfortably"
          />
          <AmountField
            id="elig-gold-emi"
            label="EMIs you already pay"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            hint="Enter 0 if you have none"
            required
          />
        </div>
      </div>
    )}

    {product.family === "share" && (
      <div className="space-y-5">
        <AmountField
          id="elig-share-value"
          label="Market value of shares"
          value={form.shareValue}
          onChange={(next) => set("shareValue", next)}
          error={errors.shareValue}
          hint="Closing value of the approved shares you will pledge"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-share-income"
            label="Monthly income (optional)"
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            hint="Caps the loan at what you can repay"
          />
          <AmountField
            id="elig-share-emi"
            label="EMIs you already pay"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            hint="Enter 0 if you have none"
            required
          />
        </div>
      </div>
    )}

    {product.key === "vehicleLoan" && (
      <div className="space-y-5">
        <AmountField
          id="elig-vehicle-down"
          label="Down payment"
          value={form.vehicleDownPayment}
          onChange={(next) => set("vehicleDownPayment", next)}
          error={errors.vehicleDownPayment}
          hint="Paid upfront; the loan cannot exceed the on-road price less this amount. Enter 0 if you are financing the full price"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PlainField
            id="elig-vehicle-foir"
            label="FOIR (%)"
            value={form.vehicleFoir}
            onChange={(next) => set("vehicleFoir", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={4}
            hint="Share of income lenders allow for all EMIs; 50% is typical"
          />
          <PlainField
            id="elig-vehicle-ltv"
            label="LTV (%)"
            value={form.vehicleLtv}
            onChange={(next) => set("vehicleLtv", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={3}
            hint="Share of the on-road price lenders fund; 90% is typical"
          />
        </div>
      </div>
    )}

  </>
);

export default AssetFields;
