import { useState } from "react";

/**
 * Shared lead/enquiry form used by Franchise Login, Be An Associate and Contact pages.
 * Client-side only for now — no backend endpoint exists yet; shows a success state on submit.
 */

interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "select" | "textarea";
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  half?: boolean; // half-width on desktop
}

interface LeadFormProps {
  fields: FieldConfig[];
  submitLabel: string;
  successTitle: string;
  successMessage: string;
}

const inputBase =
  "w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-navy)] transition";

const LeadForm = ({ fields, submitLabel, successTitle, successMessage }: LeadFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (name: string, v: string) => {
    setValues((p) => ({ ...p, [name]: v }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        e[f.name] = `${f.label} is required`;
        continue;
      }
      if (f.type === "tel" && values[f.name] && !/^\d{10}$/.test(values[f.name])) {
        e[f.name] = "Enter valid 10-digit number";
      }
      if (f.type === "email" && values[f.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[f.name])) {
        e[f.name] = "Enter valid email";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-(--brand-teal)">
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">{successTitle}</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.half === false ? "md:col-span-2" : ""}>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>

            {f.type === "textarea" ? (
              <textarea
                rows={4}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={`${inputBase} resize-y ${errors[f.name] ? "border-red-400" : "border-slate-300"}`}
              />
            ) : f.type === "select" ? (
              <select
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className={`${inputBase} ${errors[f.name] ? "border-red-400" : "border-slate-300"}`}
              >
                <option value="">{f.placeholder ?? "Select an option"}</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type ?? "text"}
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  setField(f.name, f.type === "tel" ? e.target.value.replace(/\D/g, "") : e.target.value)
                }
                placeholder={f.placeholder}
                maxLength={f.type === "tel" ? 10 : undefined}
                className={`${inputBase} ${errors[f.name] ? "border-red-400" : "border-slate-300"}`}
              />
            )}

            {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg py-3 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-teal) 100%)" }}
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default LeadForm;
