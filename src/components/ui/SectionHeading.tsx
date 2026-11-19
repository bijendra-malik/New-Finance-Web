import type { ReactNode } from "react";

/** Section title with a compact brand accent bar. */
const SectionHeading = ({ children }: { children: ReactNode }) => (
  <div className="mb-4 flex items-stretch gap-3">
    <div
      className="w-1 shrink-0 self-stretch rounded-full"
      style={{
        background: "linear-gradient(180deg, var(--brand-teal), var(--brand-navy))",
        minHeight: "1.5rem",
      }}
    />
    <h2 className="text-lg font-bold leading-snug tracking-tight text-(--text-strong) md:text-xl">
      {children}
    </h2>
  </div>
);

export default SectionHeading;
