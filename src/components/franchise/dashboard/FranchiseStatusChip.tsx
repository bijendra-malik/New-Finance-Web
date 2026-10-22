import { statusTone } from "./franchiseFormat";

/** One consistent status pill for customers, loans and applications. */
const FranchiseStatusChip = ({
  status,
  size = "sm",
}: {
  status?: string;
  size?: "sm" | "md";
}) => {
  const tone = statusTone(status);
  const label = status?.trim() || "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold capitalize ${
        size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]"
      }`}
      style={{ background: tone.bg, border: `1px solid ${tone.border}`, color: tone.text }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone.dot }} aria-hidden="true" />
      {label}
    </span>
  );
};

export default FranchiseStatusChip;
