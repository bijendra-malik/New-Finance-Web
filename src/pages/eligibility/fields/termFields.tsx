import type { FormState } from "../formState";
import { FOIR_CAP, RENTAL_HAIRCUT, VEHICLE_FOIR, type ProductSpec } from "../models";
import { AmountField, PlainField } from "../fieldControls";
import { FoirTooltip, LtvTooltip, RentalHaircutTooltip } from "./policyTooltips";
import { LAP_CITIES, LAP_PROPERTY_TYPES, LAP_USAGES } from "../formState";
import { SALARIED } from "../../../constants/masters";

interface Props {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  occupation: string;
  occupationOptions: readonly string[];
  incomeLabel: string;
  incomeHint: string;
  asset: ProductSpec["asset"];
  assetLtv: number;
}

const TermFields = ({ product, form, errors, set, occupation, occupationOptions, incomeLabel, incomeHint, asset, assetLtv }: Props) => (
  <>
    {product.family === "term" && (
      <div className="space-y-5">
        {occupationOptions.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Occupation</p>
            <div className="flex flex-col gap-1.5 rounded-xl bg-slate-100 p-1 sm:flex-row sm:flex-wrap">
              {occupationOptions.map((option) => {
                const active = option === occupation;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => set("occupation", option)}
                    aria-pressed={active}
                    className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-white text-(--brand-navy) shadow-sm" : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-income"
            label={incomeLabel}
            value={form.monthlyIncome}
            onChange={(next) => set("monthlyIncome", next)}
            error={errors.monthlyIncome}
            placeholder={occupation === SALARIED ? "e.g. 75,000" : "e.g. 12,00,000"}
            hint={incomeHint}
            tooltip={<FoirTooltip cap={product.key === "vehicleLoan" ? VEHICLE_FOIR : FOIR_CAP} />}
            required
          />
          <AmountField
            id="elig-emi"
            label="Total monthly EMI"
            value={form.existingEmi}
            onChange={(next) => set("existingEmi", next)}
            error={errors.existingEmi}
            placeholder="e.g. 12,000"
            hint="Enter 0 If You Have No EMI"
            required
          />
        </div>

        {asset && (
          <AmountField
            id={`elig-${asset.field}`}
            label={asset.label}
            value={form[asset.field]}
            onChange={(next) => set(asset.field, next)}
            error={errors[asset.field]}
            placeholder={product.key === "vehicleLoan" ? "e.g. 12,00,000" : "e.g. 80,00,000"}
            required
            hint={
              product.key === "lap"
                ? `Up To ${Math.round(assetLtv * 100)}% Funding Against Current Market Value Of The Property`
                : undefined
            }
            tooltip={
              <LtvTooltip
                pct={assetLtv}
                subject={product.key === "vehicleLoan" ? "on-road price" : "property value"}
                note={product.key === "lap" ? "Property type and city category move that percentage." : undefined}
              />
            }
          />
        )}

        {product.key === "lap" && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Property type</p>
              <div className="flex flex-col gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex-row sm:flex-wrap">
                {LAP_PROPERTY_TYPES.map((option) => {
                  const active = option === form.lapPropertyType;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => set("lapPropertyType", option)}
                      aria-pressed={active}
                      className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-(--brand-navy) text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {form.lapPropertyType === "Other" && (
              <PlainField
                id="elig-lap-property-other"
                label="Property type"
                value={form.lapPropertyOther}
                onChange={(next) => set("lapPropertyOther", next)}
                placeholder="e.g. Agricultural Land, Warehouse"
                error={errors.lapPropertyOther}
                required
              />
            )}

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">City category</p>
              <div className="flex flex-col gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex-row sm:flex-wrap">
                {LAP_CITIES.map((option) => {
                  const active = option.value === form.lapCity;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => set("lapCity", option.value)}
                      aria-pressed={active}
                      className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-(--brand-navy) text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Property usage</p>
              <div className="flex flex-col gap-1.5 rounded-xl bg-white p-1 ring-1 ring-slate-200 sm:flex-row sm:flex-wrap">
                {LAP_USAGES.map((option) => {
                  const active = option === form.lapUsage;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => set("lapUsage", option)}
                      aria-pressed={active}
                      className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-[12px] font-bold transition-all ${active ? "bg-(--brand-navy) text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {form.lapUsage === "Rented out" && (
                <AmountField
                  id="elig-lap-rent"
                  label="Monthly rent received"
                  value={form.lapRent}
                  onChange={(next) => set("lapRent", next)}
                  error={errors.lapRent}
                  placeholder="e.g. 25,000"
                  hint={`${Math.round(RENTAL_HAIRCUT * 100)}% Of Rent Counts As Income`}
                  tooltip={<RentalHaircutTooltip />}
                  required
                />
              )}
              <div className={form.lapUsage === "Rented out" ? undefined : "sm:col-span-2"}>
                <AmountField
                  id="elig-lap-existing-loan"
                  label="Existing loan on this property (optional)"
                  value={form.lapExistingLoan}
                  onChange={(next) => set("lapExistingLoan", next)}
                  placeholder="e.g. 15,00,000 or 0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )}

  </>
);

export default TermFields;
