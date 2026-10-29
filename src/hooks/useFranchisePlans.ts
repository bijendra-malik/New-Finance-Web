import { useCallback, useEffect, useState } from "react";
import { fetchFranchisePlans, type FranchisePlansResponse } from "../api/franchise";
import { getApiErrorMessage } from "../utils/apiError";
import type { FranchisePlan } from "../components/franchise/franchiseData";

export type ApiFranchisePlan = FranchisePlansResponse["plans"][number];
const INR = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const currencySymbol = (currency?: string) =>
  currency && currency.toUpperCase() !== "INR" ? `${currency.toUpperCase()} ` : "\u20B9";

export const formatPlanFee = (amount: number, currency?: string) =>
  `${currencySymbol(currency)}${INR.format(amount)}`;

export const formatPlanFeeCompact = (amount: number, currency?: string) => {
  const symbol = currencySymbol(currency);
  if (amount >= 10000000) return `${symbol}${+(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `${symbol}${+(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `${symbol}${+(amount / 1000).toFixed(0)}K`;
  return `${symbol}${INR.format(amount)}`;
};

export const toFranchisePlan = (plan: ApiFranchisePlan): FranchisePlan => {
  const months = plan.durationMonths ?? 0;
  const gstSuffix = (plan.gstPercent ?? 0) > 0 ? " + GST" : "";
  const duration =
    plan.validityLabel?.trim() ||
    (months > 0 ? `${months} Month${months === 1 ? "" : "s"}` : "");

  return {
    id: plan.code?.trim() || plan._id?.trim() || "",
    name: plan.name?.trim() || duration || "Franchise Plan",
    shortName: plan.name?.trim() || duration || "Plan",
    duration,
    fee: plan.fee != null ? `${formatPlanFee(plan.fee, plan.currency)}${gstSuffix}` : "On request",
    feeShort:
      plan.fee != null ? `${formatPlanFeeCompact(plan.fee, plan.currency)}${gstSuffix}` : "On request",
    renewal:
      plan.renewalFee != null
        ? `${formatPlanFee(plan.renewalFee, plan.currency)}${gstSuffix}`
        : plan.renewalNote?.trim() || "As applicable",
    months,
    recommended: plan.isBestValue === true,
    badge: plan.isBestValue ? "Best Value" : undefined,
  };
};

let plansRequest: Promise<FranchisePlansResponse> | null = null;

const loadPlans = (force = false): Promise<FranchisePlansResponse> => {
  if (force || !plansRequest) {
    plansRequest = fetchFranchisePlans().catch((error: unknown) => {
      plansRequest = null;
      throw error;
    });
  }
  return plansRequest;
};

const comparePlans = (a: ApiFranchisePlan, b: ApiFranchisePlan) => {
  const monthsA = a.durationMonths ?? 0;
  const monthsB = b.durationMonths ?? 0;
  if (monthsA !== monthsB) return monthsB - monthsA;

  const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return (a.name ?? "").localeCompare(b.name ?? "");
};

export interface UseFranchisePlansResult {
  plans: FranchisePlan[];
  loading: boolean;
  error: string;
  bestValueCode: string;
  selectedPlanCode: string;
  reload: () => void;
}

export const useFranchisePlans = (): UseFranchisePlansResult => {
  const [plans, setPlans] = useState<FranchisePlan[]>([]);
  const [bestValueCode, setBestValueCode] = useState("");
  const [selectedPlanCode, setSelectedPlanCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    loadPlans(attempt > 0)
      .then((response) => {
        if (!active) return;

        if (!response?.success) {
          setPlans([]);
          setBestValueCode("");
          setSelectedPlanCode("");
          setError(response?.message || "Franchise plans could not be loaded. Please try again.");
          return;
        }

        const published = (response.plans ?? [])
          .filter((plan) => plan.isActive !== false)
          .sort(comparePlans);
        const mapped = published.map(toFranchisePlan).filter((plan) => plan.id);

        const publishedCodes = new Set(mapped.map((plan) => plan.id));
        const usable = (code: string | null | undefined) => {
          const trimmed = code?.trim();
          return trimmed && publishedCodes.has(trimmed) ? trimmed : "";
        };
        const bestValue = mapped.find((plan) => plan.recommended)?.id || usable(response.bestValueCode) || "";

        setPlans(mapped);
        setBestValueCode(bestValue);
        setSelectedPlanCode(
          bestValue || usable(response.selectedPlanCode) || mapped[0]?.id || "",
        );
        setError(
          mapped.length === 0
            ? "No franchise plans are open right now. Please check back shortly."
            : "",
        );
      })
      .catch((err: unknown) => {
        if (!active) return;
        setPlans([]);
        setBestValueCode("");
        setSelectedPlanCode("");
        setError(getApiErrorMessage(err, "Franchise plans could not be loaded. Please try again."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    setAttempt((n) => n + 1);
  }, []);

  return { plans, loading, error, bestValueCode, selectedPlanCode, reload };
};

export default useFranchisePlans;
