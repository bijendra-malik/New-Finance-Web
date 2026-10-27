/**
 * One label/value row inside a `<dl>` — the shape every detail panel uses for a
 * single fact about a customer or application.
 *
 * Values arrive from the API as strings, numbers or nothing at all, so a number
 * must render without throwing and a blank must read as an em dash rather than
 * an empty gap.
 */
export const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  const text = value === null || value === undefined ? "" : String(value).trim();
  return (
    <div>
      <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-[13px] font-semibold text-slate-700">{text || "—"}</dd>
    </div>
  );
};

export default DetailItem;
