import type { FormState } from "../formState";
import { type ProductSpec, type EligibilityOutcome } from "../models";
import { LRD_TENURE_YEARS, LRD_ROI, LRD_LTV_MIN, LRD_LTV_MAX } from "../models";
import { AmountField, PlainField } from "../fieldControls";
import { formatINRRounded } from "../../../utils/formatters";

interface Props {
  product: ProductSpec;
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  lrdLive: EligibilityOutcome | null;
}

const LrdFields = ({ product, form, errors, set, lrdLive }: Props) => (
  <>
    {product.family === "lrd" && (
      <div className="space-y-4">
        <div className="group relative flex items-center gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Lease details</p>
          <span className="inline-flex">
            <button
              type="button"
              aria-label="What is lease rental discounting?"
              className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 text-[9px] font-bold leading-none text-slate-500 transition-colors group-hover:border-(--brand-teal) group-hover:text-(--brand-teal)"
            >
              i
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-0 top-6 z-20 w-64 rounded-xl bg-slate-900 p-3 text-[11.5px] font-normal leading-4 text-white opacity-0 shadow-xl transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 sm:left-full sm:top-0 sm:ml-2"
            >
              Lease Rental Discounting lets a property owner borrow against the rent a tenant pays. Rent for the
              remaining lease is discounted to today's value at the loan rate, the lender funds a slice of that
              value, and the loan can never exceed the property's market value.
            </span>
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-lrd-rent"
            label="Monthly rental income"
            value={form.lrdRent}
            onChange={(next) => set("lrdRent", next)}
            error={errors.lrdRent}
            placeholder="e.g. 1,20,000"
            hint="Rent your tenant pays under the registered lease"
          />
          <PlainField
            id="elig-lrd-lease"
            label="Remaining lease tenure (years)"
            value={form.lrdLeaseYears}
            onChange={(next) => set("lrdLeaseYears", next.replace(/\D/g, ""))}
            inputMode="tel"
            maxLength={2}
            placeholder="e.g. 5"
            error={errors.lrdLeaseYears}
          />
          <AmountField
            id="elig-lrd-property"
            label="Property market value"
            value={form.lrdPropertyValue}
            onChange={(next) => set("lrdPropertyValue", next)}
            error={errors.lrdPropertyValue}
            placeholder="e.g. 2,50,00,000"
            hint="Current market value of the leased property"
          />
          <PlainField
            id="elig-lrd-ltv"
            label="Assumed LTV (%)"
            value={form.lrdLtv}
            onChange={(next) => set("lrdLtv", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={4}
            placeholder="e.g. 70"
            error={errors.lrdLtv}
            hint={`Lenders fund ${LRD_LTV_MIN * 100}% to ${LRD_LTV_MAX * 100}% of the discounted rent`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PlainField
            id="elig-lrd-deduction"
            label="Rental deduction (%)"
            value={form.lrdDeduction}
            onChange={(next) => set("lrdDeduction", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={4}
            hint="Vacancy, expenses and lender adjustments; 10% is typical"
          />
          <PlainField
            id="elig-lrd-coverage"
            label="Rent-to-EMI coverage (%)"
            value={form.lrdCoverage}
            onChange={(next) => set("lrdCoverage", next.replace(/[^\d.]/g, ""))}
            inputMode="tel"
            maxLength={3}
            hint="Share of net rent the EMI may use; 70% is typical"
          />
        </div>

        <p className="rounded-xl bg-slate-50 px-4 py-3 text-[11.5px] leading-4 text-slate-500">
          Fixed terms: {LRD_ROI}% p.a. over up to {LRD_TENURE_YEARS} years, capped at the lease left to run.
        </p>

        {lrdLive && (
          <div className="rounded-xl border border-(--brand-teal-33) bg-(--surface-muted) px-4 py-3">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">Live estimate</p>
            {lrdLive.eligible ? (
              <>
                <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                  {formatINRRounded(lrdLive.headline)}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">
                  {formatINRRounded(lrdLive.lease?.rentalLimit ?? 0)} from the discounted rent ·{" "}
                  {formatINRRounded(lrdLive.lease?.propertyLimit ?? 0)} from the property value
                </p>
              </>
            ) : (
              <p className="mt-1 text-[11.5px] leading-4 text-slate-500">
                The rent and property together support less than the smallest loan lenders sanction.
              </p>
            )}
          </div>
        )}
      </div>
    )}
  </>
);

export default LrdFields;
