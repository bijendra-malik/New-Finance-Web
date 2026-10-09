import type { ReactNode } from "react";
import { cx } from "../ui/cx";

interface SectionShellProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Page rhythm: plain white, soft brand tint, or a deep navy band. */
  tone?: "white" | "tint" | "navy";
  children: ReactNode;
}

const TONES = {
  white: "bg-white",
  tint: "",
  navy: "text-white",
} as const;

const TINT_STYLE = { background: "linear-gradient(180deg,#f7fbfc 0%,#eef6fa 100%)" } as const;
const NAVY_STYLE = { background: "linear-gradient(115deg,#0e1e3c 0%,#1b6ca8 100%)" } as const;

/** Consistent section frame: accent bar, eyebrow, title, optional subtitle, then content. */
const SectionShell = ({ id, eyebrow, title, subtitle, tone = "white", children }: SectionShellProps) => {
  const onNavy = tone === "navy";

  return (
    <section
      id={id}
      className={cx("franchise-anchor relative w-full px-6 py-10 md:px-8 md:py-14", TONES[tone])}
      style={tone === "tint" ? TINT_STYLE : onNavy ? NAVY_STYLE : undefined}
    >
      {tone === "tint" && (
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--brand-navy-14)" }} />
      )}

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-7 max-w-3xl">
          <span
            className={cx(
              "text-[11px] font-extrabold uppercase tracking-[0.18em]",
              onNavy ? "text-(--brand-yellow)" : "text-(--brand-navy)",
            )}
          >
            {eyebrow}
          </span>
          <h2
            className={cx(
              "mt-2 text-2xl font-extrabold leading-tight md:text-3xl",
              onNavy ? "text-white" : "text-slate-800",
            )}
          >
            {title}
          </h2>
          <div
            className="mt-3 h-0.75 w-32 rounded-full"
            style={{ background: "linear-gradient(90deg,#27ae90 0%,var(--brand-navy) 55%,transparent 100%)" }}
          />
          {subtitle && (
            <p className={cx("mt-3 text-sm leading-relaxed md:text-[15px]", onNavy ? "text-white/75" : "text-slate-500")}>
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </div>
    </section>
  );
};

export default SectionShell;
