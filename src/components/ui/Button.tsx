import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";
import { cx } from "./cx";

type ButtonVariant = "primary" | "teal" | "outline" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "text-white bg-(--brand-navy) shadow-xs hover:bg-(--brand-navy-deep) hover:shadow-md active:bg-(--brand-navy-deep)",
  teal:
    "text-white bg-(--brand-teal) shadow-xs hover:bg-(--brand-navy) hover:shadow-md active:bg-(--brand-navy)",
  outline:
    "border border-slate-300 text-slate-700 bg-white hover:border-(--brand-teal) hover:bg-(--brand-teal-14) hover:text-(--brand-navy)",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-(--brand-navy)",
  danger: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  link: "text-(--brand-navy) font-semibold hover:underline px-0!",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-xs rounded-lg",
  md: "min-h-10 px-4 py-2.5 text-sm rounded-xl",
  lg: "min-h-12 px-6 py-3 text-base rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /** Marks the button Enter should move to when a form has no fields left. */
  "data-enter-next"?: boolean;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cx(
      "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 cursor-pointer",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal) focus-visible:ring-offset-2",
      "active:scale-[0.99]",
      "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none",
      VARIANTS[variant],
      SIZES[size],
      fullWidth && "w-full",
      className,
    )}
    {...rest}
  >
    {loading && <Spinner size={size === "sm" ? 14 : 16} />}
    {children}
  </button>
);

export default Button;
