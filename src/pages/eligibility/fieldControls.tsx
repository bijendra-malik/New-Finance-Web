import { useState, type ReactNode } from "react";
import { amountInWords, digitsOnly, formatIndianNumber } from "../../utils/formatters";
import { fieldClass, placeholderWith } from "./formState";

export const InfoTooltip = ({ label, children }: { label: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  return (
    <span className="inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-label={label}
        onClick={show}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(event) => {
          if (event.key === "Escape") hide();
        }}
        className={`flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[9px] font-bold leading-none transition-colors ${
          open ? "border-(--brand-teal) text-(--brand-teal)" : "border-slate-300 text-slate-500"
        }`}
      >
        i
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-0 top-6 z-20 w-64 max-w-[calc(100vw-3rem)] rounded-xl bg-slate-900 p-3 text-[11.5px] font-normal normal-case leading-4 tracking-normal text-white shadow-xl transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </span>
    </span>
  );
};

export const FieldLabel = ({
  htmlFor, children, required, tooltip,
}: { htmlFor: string; children: ReactNode; required?: boolean; tooltip?: ReactNode }) => (
  <div className="relative mb-1.5 flex items-center gap-1.5">
    <label htmlFor={htmlFor} className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
      {children}
      {required && <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>}
    </label>
    {tooltip}
  </div>
);

export const FieldError = ({ children }: { children?: string }) =>
  children ? <p className="mt-1 text-[11.5px] font-semibold text-red-500">{children}</p> : null;

export const AmountField = ({
  id, label, value, onChange, hint, error, placeholder, required = false, tooltip,
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  hint?: string; error?: string; placeholder?: string; required?: boolean; tooltip?: ReactNode;
}) => {
  const words = amountInWords(Number(digitsOnly(value)));
  return (
    <div>
      <FieldLabel htmlFor={id} required={required} tooltip={tooltip}>{label}</FieldLabel>
      <div className={`flex items-center gap-1 rounded-xl border bg-(--surface-muted) px-3 py-2.5 transition focus-within:ring-2 ${
        error ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100" : "border-slate-200 focus-within:border-(--brand-teal) focus-within:ring-(--brand-teal-33)"
      }`}>
        <span aria-hidden="true" className="text-sm font-bold text-slate-400">₹</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholderWith(hint, placeholder)}
          aria-required={required || undefined}
          value={formatIndianNumber(value)}
          onChange={(event) => onChange(digitsOnly(event.target.value))}
          className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-[12px]"
        />
      </div>
      <FieldError>{error}</FieldError>
      {!error && words && <p className="mt-1 text-[11px] leading-4 text-slate-400">{words}</p>}
    </div>
  );
};

export const PlainField = ({
  id, label, value, onChange, inputMode = "text", placeholder, maxLength, error, hint, required = false,
}: {
  id: string; label: string; value: string; onChange: (next: string) => void;
  inputMode?: "text" | "tel" | "email"; placeholder?: string; maxLength?: number; error?: string; hint?: string;
  required?: boolean;
}) => {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        aria-required={required || undefined}
        autoComplete="off"
        placeholder={placeholderWith(hint, placeholder)}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass(error)} placeholder:text-[12px]`}
      />
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const Card = ({ title, note, badge, children }: { title: string; note: string; badge?: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-(--border-subtle) bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-7">
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      {badge && (
        <span className="rounded-full bg-(--brand-teal-33) px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-(--brand-navy)">
          {badge}
        </span>
      )}
    </div>
    <p className="mt-1 text-[12.5px] leading-5 text-slate-500">{note}</p>
    <div className="mt-5">{children}</div>
  </section>
);
