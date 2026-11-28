import type { FormState } from "../formState";
import { LRD_DEFAULT_LTV, LRD_LTV_MAX, type ProductSpec, type EligibilityOutcome } from "../models";
import { AmountField, InfoTooltip, PlainField } from "../fieldControls";
import { LtvTooltip } from "./policyTooltips";
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
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Lease details</p>
          <InfoTooltip label="What is lease rental discounting?">
            Lease Rental Discounting lets a property owner borrow against the rent a tenant pays. Rent for the remaining
            lease is discounted to today's value at the loan rate, the lender funds a slice of that value, and the loan
            can never exceed the property's market value.
          </InfoTooltip>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField
            id="elig-lrd-rent"
            label="Monthly rental income"
            value={form.lrdRent}
            onChange={(next) => set("lrdRent", next)}
            error={errors.lrdRent}
            placeholder="e.g. 1,20,000"
            hint="Rent Under The Registered Lease"
            required
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
            required
          />
          <AmountField
            id="elig-lrd-property"
            label="Property market value"
            value={form.lrdPropertyValue}
            onChange={(next) => set("lrdPropertyValue", next)}
            error={errors.lrdPropertyValue}
            placeholder="e.g. 2,50,00,000"
            hint="Current Market Value"
            tooltip={
              <LtvTooltip
                pct={LRD_DEFAULT_LTV}
                subject="property value"
                note={`Lenders stretch that to ${Math.round(LRD_LTV_MAX * 100)}% at most.`}
              />
            }
            required
          />
          <AmountField
            id="elig-lrd-lender-limit"
            label="Lender's maximum limit (optional)"
            value={form.lrdLenderLimit}
            onChange={(next) => set("lrdLenderLimit", next)}
            placeholder="e.g. 5,00,00,000"
            hint="Scheme Cap For This Loan"
          />
        </div>

        {lrdLive && (
          <div className="rounded-xl border border-(--brand-teal-33) bg-(--surface-muted) px-4 py-3">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">Live estimate</p>
            {lrdLive.eligible ? (
              <>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-lg font-bold tabular-nums text-slate-900">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Approx.
                  </span>
                  <span className="whitespace-nowrap">{formatINRRounded(lrdLive.headline)}</span>
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
