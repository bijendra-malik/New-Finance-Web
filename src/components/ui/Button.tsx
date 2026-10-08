import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "teal" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "text-white bg-linear-to-br from-(--brand-navy) to-(--brand-dark) hover:shadow-lg",
  teal: "text-white bg-linear-to-br from-(--brand-teal) to-(--brand-navy) hover:shadow-lg",
  outline: "border border-slate-300 text-slate-600 bg-white hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  link: "text-(--brand-navy) font-semibold hover:underline px-0!",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
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
      "focus:outline-none focus:ring-2 focus:ring-(--brand-teal-33) focus:ring-offset-1",
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
