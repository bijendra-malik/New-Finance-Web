import type { ReactNode } from "react";
import { InfoTooltip } from "../fieldControls";
import {
  FOIR_CAP,
  GOLD_LTV_SLABS,
  RENTAL_HAIRCUT,
  WC_BANK_SHARE,
  WC_TURNOVER_NORM,
  WC_TURNOVER_REQUIREMENT,
} from "../models";

const pct = (value: number): number => Math.round(value * 100);

/** Share of income (FOIR) that existing and new EMIs may consume together. */
export const FoirTooltip = ({ cap = FOIR_CAP }: { cap?: number }) => (
  <InfoTooltip label="How is the FOIR applied?">
    Existing EMIs plus this loan&apos;s EMI may use up to {pct(cap)}% of the monthly income entered here; the model
    treats anything above that as unaffordable.
  </InfoTooltip>
);

/** Loan-to-value cap on an asset-backed limit. */
export const LtvTooltip = ({
  pct: share,
  subject,
  note,
}: {
  pct: number;
  subject: string;
  note?: ReactNode;
}) => (
  <InfoTooltip label="How is the LTV applied?">
    The loan is capped at {pct(share)}% of the {subject}, and that cap competes with the model&apos;s other limits.
    {note ? <> {note}</> : null}
  </InfoTooltip>
);

/** Turnover method: requirement, bank share and the resulting norm. */
export const TurnoverNormTooltip = () => (
  <InfoTooltip label="How is the turnover norm applied?">
    {pct(WC_TURNOVER_REQUIREMENT)}% of turnover is the working-capital requirement and banks fund{" "}
    {pct(WC_BANK_SHARE)}% of it, so the limit is {Math.round(WC_TURNOVER_NORM * 10000) / 100}% of turnover.
  </InfoTooltip>
);

/** Only part of the rent counts as income before the FOIR is tested. */
export const RentalHaircutTooltip = () => (
  <InfoTooltip label="How is the rent counted?">
    Only {pct(RENTAL_HAIRCUT)}% of this rent counts as income; the loan is then sized so the EMI fits the FOIR cap
    alongside your salary.
  </InfoTooltip>
);

/** RBI slabs: the gold loan is a share of the metal's value. */
export const GoldLtvTooltip = () => (
  <InfoTooltip label="How is the gold LTV applied?">
    The loan is a share of the gold&apos;s value, stepping down from {pct(GOLD_LTV_SLABS[0].ltv)}% to{" "}
    {pct(GOLD_LTV_SLABS[GOLD_LTV_SLABS.length - 1].ltv)}% as the value crosses the RBI slabs.
  </InfoTooltip>
);
