import type { ReactNode } from "react";
import { digitsOnly, formatIndianNumber } from "../../utils/formatters";
import { fieldClass } from "./formState";

export const FieldLabel = ({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
    {children}
    {required && <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>}
  </label>
);

export const FieldError = ({ children }: { children?: string }) =>
  children ? <p className="mt-1 text-[11.5px] font-semibold text-red-500">{children}</p> : null;

export const AmountField = ({
  id, label, value, onChange, hint, error, placeholder = "0", required = false,
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  hint?: string; error?: string; placeholder?: string; required?: boolean;
}) => (
  <div>
    <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
    <div className={`flex items-center gap-1 rounded-xl border bg-(--surface-muted) px-3 py-2.5 transition focus-within:ring-2 ${
      error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100" : "border-slate-200 focus-within:border-(--brand-teal) focus-within:ring-(--brand-teal-33)"
    }`}>
      <span aria-hidden="true" className="text-sm font-bold text-slate-400">₹</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        aria-required={required || undefined}
        value={formatIndianNumber(value)}
        onChange={(event) => onChange(digitsOnly(event.target.value))}
        className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
      />
    </div>
    <FieldError>{error}</FieldError>
    {!error && hint && <p className="mt-1 text-[11px] leading-4 text-slate-400">{hint}</p>}
  </div>
);

export const PlainField = ({
  id, label, value, onChange, inputMode = "text", placeholder, maxLength, error, hint, required = false,
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  inputMode?: "text" | "tel" | "email"; placeholder?: string; maxLength?: number; error?: string; hint?: string;
  required?: boolean;
}) => (
  <div>
    <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
    <input
      id={id}
      type="text"
      inputMode={inputMode}
      aria-required={required || undefined}
      autoComplete="off"
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={fieldClass(error)}
    />
    <FieldError>{error}</FieldError>
    {!error && hint && <p className="mt-1 text-[11px] leading-4 text-slate-400">{hint}</p>}
  </div>
);

export const Card = ({ title, note, children }: { title: string; note: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-(--border-subtle) bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-7">
    <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
    <p className="mt-1 text-[12.5px] leading-5 text-slate-500">{note}</p>
    <div className="mt-5">{children}</div>
  </section>
);
