// Opinionated field primitives so forms stop re-declaring input/select/textarea boilerplate.

import { memo } from "react";
import { cx } from "../ui/cx";

interface BaseFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  full?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}


export const Field = memo(({ id, label, required, error, hint, full, children }: BaseFieldProps) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">
      {label} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
    ) : hint ? (
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    ) : null}
  </div>
));
Field.displayName = "Field";


export const TextField = memo(
  ({
    value,
    onChange,
    placeholder,
    error,
    maxLength,
    disabled,
    inputMode,
    extraCls,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    error?: string;
    maxLength?: number;
    disabled?: boolean;
    inputMode?: "text" | "tel" | "numeric" | "email";
    extraCls?: string;
  }) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      inputMode={inputMode}
      className={cx(
        "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy)",
        error ? "border-red-400 bg-red-50/40" : "border-slate-300",
        disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : "",
        extraCls ?? ""
      )}
    />
  )
);
TextField.displayName = "TextField";


export const SelectField = memo(
  ({
    value,
    onChange,
    options,
    placeholder,
    error,
    disabled,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: readonly string[];
    placeholder: string;
    error?: string;
    disabled?: boolean;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cx(
        "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy)",
        error ? "border-red-400 bg-red-50/40" : "border-slate-300",
        disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
);
SelectField.displayName = "SelectField";


export const TextAreaField = memo(
  ({
    value,
    onChange,
    placeholder,
    error,
    rows,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    error?: string;
    rows?: number;
  }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cx(
        "w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) resize-y",
        error ? "border-red-400 bg-red-50/40" : "border-slate-300"
      )}
    />
  )
);
TextAreaField.displayName = "TextAreaField";
