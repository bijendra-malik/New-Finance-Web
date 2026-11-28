import type { Cap, EligibilityOutcome, ProductSpec } from "./core";
import { DEBTOR_MARGIN, MIN_LOAN, STOCK_MARGIN, TURNOVER_METHOD_CAP, WC_TURNOVER_NORM, creditRefusal, holding, money, roundTo } from "./core";

// ── OD / CC working capital ───────────────────────────────────────────────────

interface WorkingCapitalInput {
  product: ProductSpec;
  roi?: number;
  turnover: number;
  stock: number;
  debtors: number;
  otherCurrentLiabilities: number;
  margin?: number;
  mode?: "turnover" | "drawingPower";
  creditScore?: number;
  lenderLimit?: number;
  existingLimit?: number;
}

export const workingCapitalEligibility = (input: WorkingCapitalInput): EligibilityOutcome => {
  const { product, turnover } = input;
  const refusal = creditRefusal(input.creditScore, "Indicative drawing power");
  if (refusal) return refusal;
  const roi = input.roi && input.roi > 0 ? input.roi : product.roi;
  const stock = Math.max(0, input.stock);
  const debtors = Math.max(0, input.debtors);
  const otherCurrentLiabilities = Math.max(0, input.otherCurrentLiabilities);
  const currentAssets = stock + debtors;
  const workingCapitalGap = currentAssets - otherCurrentLiabilities;

  const margin = Math.max(0, input.margin ?? 0);
  const mode = input.mode === "drawingPower" ? "drawingPower" : "turnover";
  const turnoverLimit = roundTo(turnover * WC_TURNOVER_NORM, 1000);
  const drawingPower = roundTo(
    Math.max(0, stock * (1 - STOCK_MARGIN) + debtors * (1 - DEBTOR_MARGIN) - margin),
    1000,
  );
  const mpbfMethodI = roundTo(Math.max(0, 0.75 * workingCapitalGap), 1000);
  const mpbfMethodII = roundTo(Math.max(0, 0.75 * currentAssets - otherCurrentLiabilities), 1000);
  const mpbf = Math.min(mpbfMethodI, mpbfMethodII);
  const hasBalanceSheet = currentAssets > 0 || otherCurrentLiabilities > 0;

  if (turnover <= 0) {
    return holding(
      "Indicative OD / CC limit",
      "Projected annual turnover is the starting point for a working-capital limit.",
      ["Use the turnover you expect in the next 12 months, not last year's audited figure."],
    );
  }

  const withinTurnoverMethod = turnover <= TURNOVER_METHOD_CAP;

  if (mode === "drawingPower" && !hasBalanceSheet) {
    return holding(
      "Indicative OD / CC limit",
      "The drawing-power method needs the stock and receivables the bank can charge.",
      ["Add your stock and payments due from customers, or switch back to the turnover method."],
    );
  }

  const lenderLimit = Math.max(0, input.lenderLimit ?? 0);
  const existingLimit = Math.max(0, input.existingLimit ?? 0);

  const caps: Cap[] = [
    { key: "turnover", label: `Turnover method (${Math.round(WC_TURNOVER_NORM * 10000) / 100}%)`, value: turnoverLimit },
  ];
  if (hasBalanceSheet) {
    caps.push({ key: "drawing", label: "Drawing power on stock and receivables", value: drawingPower });
    if (mpbf > 0) caps.push({ key: "mpbf", label: "Cash flow / MPBF limit", value: mpbf });
  }
  if (lenderLimit > 0) {
    caps.push({ key: "lender", label: "Lender's maximum limit", value: roundTo(lenderLimit, 1000) });
  }

  const grossLimit = Math.min(...caps.map((cap) => cap.value));
  const limit = Math.max(0, grossLimit - existingLimit);
  const binding = caps.reduce((lowest, cap) => (cap.value < lowest.value ? cap : lowest)).label;
  const usable = hasBalanceSheet ? Math.min(drawingPower, limit) : limit;
  const currentRatio = currentAssets / (otherCurrentLiabilities + limit || 1);
  const monthlyInterest = Math.round(usable * (roi / 1200));

  if (limit < MIN_LOAN) {
    return {
      ...holding(
        "Indicative OD / CC limit",
        `These figures support less than ${money(MIN_LOAN)}, below the smallest working-capital limit banks open.`,
        ["A higher projected turnover, or stronger current assets, lifts both the turnover norm and MPBF."],
      ),
      caps,
      binding,
      roi: roi,
      months: 12,
      workCapital: {
        turnoverLimit,
        mpbf,
        mpbfMethodI,
        mpbfMethodII,
        drawingPower,
        usable,
        currentRatio,
        currentRatioRequired: 1.33,
        grossLimit,
        existingLimit,
      },
    };
  }

  return {
    eligible: true,
    headline: limit,
    headlineLabel: "Indicative sanctioned limit",
    monthly: monthlyInterest,
    monthlyLabel: "Interest at full draw",
    roi: roi,
    months: 12,
    caps,
    binding,
    foir: null,
    message:
      (mode === "drawingPower"
        ? `The ${money(grossLimit)} limit is the lowest of the turnover norm (${money(turnoverLimit)}), the ${money(drawingPower)} drawing power on stock and receivables after ${money(margin)} of margin and the ${money(mpbf)} cash-flow (MPBF) reading`
        : `A ${money(grossLimit)} limit is ${Math.round(WC_TURNOVER_NORM * 10000) / 100}% of your ${money(turnover)} turnover${hasBalanceSheet ? `, with ${money(usable)} drawable against stock and debtors` : ""}`) +
      (caps.length > 1 ? `. ${binding} binds it.` : ".") +
      (existingLimit > 0
        ? ` After ${money(existingLimit)} of existing OD/CC limit, ${money(limit)} remains available.`
        : ""),
    suggestions: [
      ...(hasBalanceSheet && currentRatio < 1.33
        ? ["A current ratio below 1.33:1 usually needs more long-term funds in the business before sanction."]
        : []),
      ...(!withinTurnoverMethod
        ? [`Above ${money(TURNOVER_METHOD_CAP)} of turnover the turnover norm is only indicative; banks usually assess such cases on MPBF or a cash budget.`]
        : []),
    ],
    workCapital: {
      turnoverLimit,
      mpbf,
      mpbfMethodI,
      mpbfMethodII,
      drawingPower,
      usable,
      currentRatio,
      currentRatioRequired: 1.33,
      grossLimit,
      existingLimit,
    },
  };
};

