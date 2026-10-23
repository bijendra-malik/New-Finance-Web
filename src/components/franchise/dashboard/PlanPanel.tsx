import { useMemo } from "react";
import Button from "../../ui/Button";
import FranchiseIcon from "../FranchiseIcon";
import { formatDate } from "./franchiseFormat";
import { formatPlanFee, useFranchisePlans } from "../../../hooks/useFranchisePlans";
import { isCurrentCataloguePlan, isPlanOver, planWindow, remainingLabel } from "./planTime";
import type { FranchiseAccount } from "../../../api/franchise";

type Profile = FranchiseAccount | null;

const planFeeLabel = (profile: Profile): string | null => {
  const plan = profile?.plan;
  if (!plan || plan.fee == null) return null;
  const gst = (plan.gstPercent ?? 0) > 0 ? " + GST" : "";
  return `${formatPlanFee(plan.fee, plan.currency)}${gst}`;
};

const planRenewalLabel = (profile: Profile, fallback?: string): string | null => {
  const plan = profile?.plan;
  if (plan?.renewalFee != null) return formatPlanFee(plan.renewalFee, plan.currency);
  return plan?.renewalNote?.trim() || fallback || null;
};

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
    <dd className="mt-0.5 text-[12.5px] font-bold text-slate-700">{value}</dd>
  </div>
);

/**
 * The partner's current plan: the term it was sold for, when it started, how
 * much of it is left and what renewal costs.
 */
export const CurrentPlanCard = ({ profile, months }: { profile: Profile; months?: number }) => {
  const plan = profile?.plan;
  const term = planWindow(profile, months);
  const remaining = remainingLabel(term);
  const over = isPlanOver(term);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="current-plan-heading">
      <div
        className="flex flex-wrap items-start justify-between gap-4 px-5 py-4"
        style={{ background: "linear-gradient(120deg,rgba(6,106,156,0.07),rgba(38,174,144,0.1))" }}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
            aria-hidden="true"
          >
            <FranchiseIcon name="plans" className="h-5 w-5" filled />
          </span>
          <div className="min-w-0">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Current plan</p>
            <h2 id="current-plan-heading" className="mt-0.5 text-lg font-extrabold text-slate-800">
              {plan?.name?.trim() || "Plan not reported"}
            </h2>
            <p className="mt-0.5 text-[12px] font-semibold text-slate-500">
              {term.months > 0 ? `${term.months}-month term` : "Term not reported"}
              {plan?.code ? ` · ${plan.code}` : ""}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p
            className="text-[26px] font-extrabold leading-none"
            style={{ color: over ? "#b3261e" : "var(--brand-navy)" }}
          >
            {term.known ? (over ? "Ended" : Math.max(0, term.daysLeft ?? 0)) : "—"}
          </p>
          <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {term.known ? (over ? "Term ended" : "Days remaining") : "Validity not reported"}
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        {term.known ? (
          <>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-[11px] font-bold text-slate-500">{formatDate(term.startISO)}</span>
              <div
                role="progressbar"
                aria-label="Plan tenure used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={term.percentUsed}
                className="h-2 min-w-16 flex-1 overflow-hidden rounded-full bg-slate-100"
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max(2, term.percentUsed)}%`,
                    background: over ? "#ef4444" : "linear-gradient(90deg,var(--brand-teal),var(--brand-navy))",
                  }}
                />
              </div>
              <span className="shrink-0 text-[11px] font-bold text-slate-500">{formatDate(term.endISO)}</span>
            </div>

            <p className="mt-2 text-[12.5px] font-bold text-slate-600">{remaining}</p>

            {over && (
              <p
                className="mt-3 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold"
                style={{ background: "#fff8e6", border: "1px solid rgba(224,168,0,0.45)", color: "#8a5a00" }}
              >
                This plan's term ended on {formatDate(term.endISO)}. Contact the franchise desk to renew.
              </p>
            )}
          </>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-slate-500">
            The plan term or its start date has not been reported, so time remaining cannot be calculated yet.
          </p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Fact label="Plan fee" value={planFeeLabel(profile) ?? "Not reported"} />
          <Fact label="Renewal" value={planRenewalLabel(profile) ?? "As applicable"} />
          <Fact label="Valid until" value={term.known ? formatDate(term.endISO) : "—"} />
        </dl>
      </div>
    </section>
  );
};

/**
 * My Plan section: the current plan's tenure plus every published franchise
 * plan, marked with the one this partner is on.
 */
const PlanPanel = ({ profile }: { profile: Profile }) => {
  const { plans, loading, error, reload } = useFranchisePlans();

  const currentPlan = useMemo(
    () => plans.find((plan) => isCurrentCataloguePlan(plan, profile)),
    [plans, profile],
  );
  const months = profile?.plan?.durationMonths || currentPlan?.months;

  return (
    <div className="space-y-4">
      <CurrentPlanCard profile={profile} months={months} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-labelledby="plan-catalogue-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="plan-catalogue-heading" className="text-[15px] font-extrabold text-slate-800">
              Franchise plans
            </h2>
            <p className="mt-0.5 text-[11.5px] text-slate-500">
              Every published plan, with its fee and renewal terms. Fees exclude GST.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reload} loading={loading}>
            Refresh plans
          </Button>
        </div>

        {loading && plans.length === 0 ? (
          <div className="space-y-3 px-5 py-5" aria-busy="true" aria-label="Loading franchise plans">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <span className="block h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                  <span className="block h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error && plans.length === 0 ? (
          <div role="alert" className="px-5 py-6">
            <p className="text-[12.5px] font-bold" style={{ color: "var(--form-error-text)" }}>
              Could not load the franchise plans
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{error}</p>
            <Button variant="link" size="sm" onClick={reload}>
              Try again
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {plans.map((plan) => {
              const current = isCurrentCataloguePlan(plan, profile);
              return (
                <li key={plan.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold"
                    style={{ background: "var(--brand-navy-14)", color: "var(--brand-navy)" }}
                    aria-hidden="true"
                  >
                    {plan.months > 0 ? `${plan.months}m` : "—"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-slate-800">
                      {plan.name}
                      {current && (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-700">
                          Current
                        </span>
                      )}
                      {plan.recommended && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9.5px] font-bold"
                          style={{ background: "var(--brand-teal-14)", color: "var(--brand-navy)" }}
                        >
                          Best value
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-slate-500">
                      {plan.duration} · renewal {plan.renewal}
                    </p>
                  </div>

                  <p className="shrink-0 text-[13px] font-extrabold text-slate-800">{plan.fee}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PlanPanel;
