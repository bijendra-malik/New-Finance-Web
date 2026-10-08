import type { ReactNode } from "react";

/** Heading with a vertical accent bar and a gradient underline. */
const SectionHeading = ({ children }: { children: ReactNode }) => (
  <div className="flex items-stretch gap-3 mb-3">
    <div
      className="w-0.75 rounded-full shrink-0 self-stretch"
      style={{ background: "linear-gradient(180deg,#27ae90,var(--brand-navy))", minHeight: "1.25rem" }}
    />
    <div className="inline-block">
      <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug">{children}</h2>
      <div
        className="mt-0.5 h-0.5 w-full rounded-full"
        style={{ background: "linear-gradient(90deg,#27ae90 0%,var(--brand-navy) 60%,transparent 100%)" }}
      />
    </div>
  </div>
);

export default SectionHeading;
