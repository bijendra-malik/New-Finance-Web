/** The labelled input and select the apply modal builds its forms from. */

export const Field = ({
  label, type, name, value, onChange, placeholder, error, disabled, maxLength, max, extraCls = "", containerCls = "", required = true,
}: {
  label: string; type: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; disabled?: boolean; maxLength?: number; max?: string; extraCls?: string; containerCls?: string; required?: boolean;
}) => (
  <div className={containerCls}>
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
      {label} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type} name={name} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled} maxLength={maxLength} max={max}
      className={`w-full px-3.5 py-2.5 border border-(--form-field-border) rounded-lg text-sm transition-all
        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
        disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${extraCls}
        ${error ? "border-red-400" : ""}`}
      style={error ? { borderColor: "#ef4444" } : undefined}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export const Select = ({
  label, name, value, onChange, options, placeholder, error, disabled,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; error?: string; disabled?: boolean;
}) => (
  <div>
    <label htmlFor={name} className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
      {label} <span className="text-red-500 ml-0.5">*</span>
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all
        focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal)
        disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed
        ${error ? "border-red-400" : "border-(--form-field-border)"}`}
      style={error ? { borderColor: "#ef4444" } : undefined}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);
