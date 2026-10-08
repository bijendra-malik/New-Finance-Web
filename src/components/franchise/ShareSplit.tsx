import { PARTNER_SHARE, INDEXIA_SHARE } from "./franchiseData";

const inr = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;

interface ShareSplitProps {
  partner?: number;
  indexia?: number;
  /** Rupee amounts to show next to each legend row instead of a percentage. */
  partnerAmount?: number;
  indexiaAmount?: number;
  /** Compact hides the legend — for tight cards. */
  compact?: boolean;
  className?: string;
}

/** Horizontal 80/20 payout-share bar with a labelled legend. */
export const ShareSplitBar = ({
  partner = PARTNER_SHARE,
  indexia = INDEXIA_SHARE,
  partnerAmount,
  indexiaAmount,
  compact = false,
  className = "",
}: ShareSplitProps) => {
  const total = partner + indexia || 1;
  const rows = [
    { key: "partner", label: "Franchise Partner", value: partner, amount: partnerAmount, color: "var(--brand-teal)" },
    { key: "indexia", label: "Indexia Finance", value: indexia, amount: indexiaAmount, color: "var(--brand-navy)" },
  ];

  return (
    <div className={className}>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100" role="img"
        aria-label={`Payout split: franchise partner ${Math.round((partner / total) * 100)} percent, Indexia Finance ${Math.round((indexia / total) * 100)} percent`}>
        {rows.map((r) => (
          <div
            key={r.key}
            className="h-full transition-all duration-500"
            style={{ width: `${(r.value / total) * 100}%`, background: r.color }}
          />
        ))}
      </div>

      {!compact && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {rows.map((r) => (
            <div key={r.key} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{r.label}</span>
              </div>
              <p className="mt-1 text-lg font-extrabold text-slate-800">
                {Math.round((r.value / total) * 100)}%
                {r.amount !== undefined && (
                  <span className="ml-2 text-sm font-semibold text-slate-400">({inr(r.amount)})</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
