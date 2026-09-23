import { forwardRef, memo, useState } from "react";
import type { ReactNode } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { THEME as C } from "../../constants/theme";
import { OTHER_OPTION } from "../../constants/masters";
import { toISODate } from "../../utils/formatters";

export const FormCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5" style={{ border: `1px solid ${C.teal}22` }}>
    <div className="px-6 py-4 border-b" style={{ background: `linear-gradient(90deg,${C.tealBg},${C.navyBg})`, borderColor: `${C.teal}20` }}>
      <h2 className="text-base font-bold uppercase tracking-wide" style={{ color: C.dark }}>{title}</h2>
      <p className="text-xs mt-0.5" style={{ color: C.gray }}>{subtitle}</p>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: C.dark }}>
    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

export const FieldError = ({ msg }: { msg?: string }) => msg
  ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;

interface TextFieldProps {
  type?: string; value: string; onChange: (v: string) => void; placeholder: string;
  err?: string; maxLength?: number; extraCls?: string; disabled?: boolean; min?: number; max?: number;
}
export const TextField = memo(({ type = "text", value, onChange, placeholder, err, maxLength, extraCls = "", disabled = false, min, max }: TextFieldProps) => (
  <>
    <input type={type} value={value} placeholder={placeholder}
      maxLength={maxLength} disabled={disabled} min={min} max={max}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none disabled:bg-slate-100 ${extraCls}`}
      style={{ border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`, background: disabled ? "#f8fafc" : "#fafafa" }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.teal}22`; } }}
      onBlur={e => { e.target.style.borderColor = err ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
    />
    <FieldError msg={err} />
  </>
));
TextField.displayName = "TextField";

interface SelectFieldProps {
  value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string; err?: string; disabled?: boolean;
}
export const SelectField = memo(({ value, onChange, options, placeholder, err, disabled = false }: SelectFieldProps) => (
  <>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
      style={{ border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`, background: disabled ? "#f8fafc" : "#fafafa", color: value ? C.dark : C.gray }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.teal}22`; } }}
      onBlur={e => { e.target.style.borderColor = err ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <FieldError msg={err} />
  </>
));
SelectField.displayName = "SelectField";

interface NumberSelectFieldProps {
  value: number; onChange: (v: number) => void; options: readonly number[]; placeholder: string; err?: string;
  formatOption?: (n: number) => string;
}
export const NumberSelectField = memo(({ value, onChange, options, placeholder, err, formatOption }: NumberSelectFieldProps) => (
  <>
    <select value={value || ""} onChange={e => onChange(parseInt(e.target.value))}
      className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none"
      style={{ border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`, background: "#fafafa" }}
      onFocus={e => { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.teal}22`; }}
      onBlur={e => { e.target.style.borderColor = err ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}>
      <option value="">{placeholder}</option>
      {options.map(n => <option key={n} value={n}>{formatOption ? formatOption(n) : n}</option>)}
    </select>
    <FieldError msg={err} />
  </>
));
NumberSelectField.displayName = "NumberSelectField";

// Sentinel appended to a tenure-years options list to offer "More than <max> years" —
// selecting it reveals a free-entry year input (no placeholder, no validation).
export const MORE_THAN_TENURE_OPTION = -1;

interface TenureYearsFieldProps {
  id: string; label: string; required?: boolean;
  value: number; onChange: (v: number) => void;
  customValue: number; onCustomChange: (v: number) => void;
  options: readonly number[]; placeholder?: string; err?: string;
}
export const TenureYearsField = memo(({
  id, label, required = true, value, onChange, customValue, onCustomChange,
  options, placeholder = "Select", err,
}: TenureYearsFieldProps) => {
  const maxYear = options[options.length - 1];
  return (
    <>
      <div id={id}>
        <FieldLabel label={label} required={required} />
        <NumberSelectField value={value} onChange={v => {
          onChange(v);
          if (v !== MORE_THAN_TENURE_OPTION) onCustomChange(0);
        }} options={[...options, MORE_THAN_TENURE_OPTION]} placeholder={placeholder} err={err}
          formatOption={y => y === MORE_THAN_TENURE_OPTION ? `More than ${maxYear} years` : `${y} ${y === 1 ? "year" : "years"}`} />
      </div>
      {value === MORE_THAN_TENURE_OPTION && (
        <div id={`${id}Custom`}>
          <FieldLabel label="Enter Tenure (in years)" required />
          <TextField type="number" value={customValue === 0 ? "" : String(customValue)}
            onChange={v => onCustomChange(Math.max(0, parseInt(v) || 0))}
            placeholder="" />
        </div>
      )}
    </>
  );
});
TenureYearsField.displayName = "TenureYearsField";

interface DateInputProps { value?: string; onClick?: () => void; placeholder?: string; err?: string; }
const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onClick, placeholder, err }, ref) => (
    <input ref={ref} value={value || ""} onClick={onClick} placeholder={placeholder} readOnly
      className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer focus:outline-none focus:border-[#26ae90] focus:ring-2 focus:ring-[#26ae90]/20 border ${err ? "border-red-500" : "border-slate-200"}`}
      style={{ background: "#fafafa", color: C.dark }} />
  )
);
DateInput.displayName = "DateInput";

interface DateFieldProps {
  value: string; onChange: (v: string) => void; err?: string;
  minDate: Date; maxDate: Date; portalId: string;
}
export const DateField = memo(({ value, onChange, err, minDate, maxDate, portalId }: DateFieldProps) => (
  <>
    <DatePicker
      selected={value ? new Date(value + "T00:00:00") : null}
      onChange={(date: Date | null) => onChange(date ? toISODate(date) : "")}
      dateFormat="dd/MM/yyyy"
      placeholderText="DD/MM/YYYY"
      maxDate={maxDate}
      minDate={minDate}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      portalId={portalId}
      wrapperClassName="w-full block"
      customInput={<DateInput err={err} />}
    />
    <FieldError msg={err} />
  </>
));
DateField.displayName = "DateField";

export const DateOfBirthPicker = memo(({ value, onChange, err }: { value: string; onChange: (v: string) => void; err?: string }) => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 100, 0, 1);
  return <DateField value={value} onChange={onChange} err={err} minDate={minDate} maxDate={maxDate} portalId="dob-datepicker-portal" />;
});
DateOfBirthPicker.displayName = "DateOfBirthPicker";

interface PillMultiSelectProps {
  options: readonly string[]; selected: string[]; onChange: (v: string[]) => void; color?: string;
}
export const PillMultiSelect = memo(({ options, selected, onChange, color = C.teal }: PillMultiSelectProps) => {
  const toggle = (item: string) => onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={active
              ? { background: color, color: "#fff", borderColor: color, boxShadow: `0 2px 8px ${color}44` }
              : { background: "#fff", color: C.gray, borderColor: "#e2e8f0" }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = color; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <span className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
              style={active ? { background: "rgba(255,255,255,0.25)" } : { border: "1.5px solid #d1d5db" }}>
              {active && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
});
PillMultiSelect.displayName = "PillMultiSelect";

interface OtherOptionListProps {
  label: string; placeholder: string; items: string[];
  onAdd: (value: string) => void; onRemove: (index: number) => void; color?: string;
  existingOptions?: readonly string[]; required?: boolean; max?: number;
}
export const OtherOptionList = memo(({ label, placeholder, items, onAdd, onRemove, color = C.teal, existingOptions, required, max }: OtherOptionListProps) => {
  const [input, setInput] = useState("");
  const [dupErr, setDupErr] = useState("");
  const limitReached = max !== undefined && items.length >= max;

  const isDuplicate = (v: string) => {
    const norm = v.trim().toLowerCase();
    if (items.some(item => item.trim().toLowerCase() === norm)) return "You've already added this.";
    if (existingOptions?.some(opt => opt.trim().toLowerCase() === norm)) return "This is already available in the list above.";
    return "";
  };

  const commit = () => {
    const v = input.trim();
    if (!v || limitReached) return;
    const dup = isDuplicate(v);
    if (dup) { setDupErr(dup); return; }
    onAdd(v);
    setInput("");
    setDupErr("");
  };
  return (
    <div className="mt-4">
      <FieldLabel label={label} required={required} />
      {limitReached ? (
        <p className="text-xs" style={{ color: C.gray }}>Maximum {max} entries added.</p>
      ) : (
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input type="text" value={input} placeholder={placeholder}
              onChange={e => { setInput(e.target.value); if (dupErr) setDupErr(""); }}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
              className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none"
              style={{ border: `1.5px solid ${dupErr ? "#ef4444" : "#e2e8f0"}`, background: "#fafafa" }}
              onFocus={e => { if (!dupErr) { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}22`; } }}
              onBlur={e => { e.target.style.borderColor = dupErr ? "#ef4444" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
            <FieldError msg={dupErr} />
          </div>
          <button type="button" onClick={commit}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:opacity-90"
            style={{ background: color }}>
            Add
          </button>
        </div>
      )}

      {items.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
              style={{ background: `${color}14`, border: `1px solid ${color}22` }}>
              <span style={{ color: C.dark }}>{i + 1}. {item}</span>
              <button type="button" onClick={() => onRemove(i)}
                className="text-xs font-semibold ml-3 shrink-0 hover:underline" style={{ color: "#ef4444" }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
OtherOptionList.displayName = "OtherOptionList";

interface SelectWithOtherProps {
  id: string; label: string; required?: boolean;
  value: string; onChange: (v: string) => void; options: readonly string[];
  placeholder?: string; disabled?: boolean; err?: string;
  otherId: string; otherLabel: string; otherValue: string; onOtherChange: (v: string) => void;
  otherPlaceholder: string; otherErr?: string;
}
export const SelectWithOther = memo(({
  id, label, required, value, onChange, options, placeholder = "Select", disabled = false, err,
  otherId, otherLabel, otherValue, onOtherChange, otherPlaceholder, otherErr,
}: SelectWithOtherProps) => {
  const select = (
    <div id={id}>
      <FieldLabel label={label} required={required} />
      <SelectField value={value} onChange={onChange} options={options} placeholder={placeholder} err={err} disabled={disabled} />
    </div>
  );

  if (value !== OTHER_OPTION) return select;

  return (
    <>
      {select}
      <div id={otherId}>
        <FieldLabel label={otherLabel} required />
        <TextField value={otherValue} onChange={onOtherChange} placeholder={otherPlaceholder} err={otherErr} />
      </div>
    </>
  );
});
SelectWithOther.displayName = "SelectWithOther";

interface PincodeSelectFieldProps {
  id: string; label: string; required?: boolean;
  options: readonly string[]; cityReady: boolean;
  value: string; onChange: (v: string) => void; err?: string;
  otherId: string; otherValue: string; onOtherChange: (v: string) => void; otherErr?: string;
}
// Dependent on state+city — `options` is that location's known pincode list (resolved by the
// caller from masters.pincodesByLocation), with "Other" always offered as a manual fallback.
export const PincodeSelectField = memo(({
  id, label, required = true, options, cityReady, value, onChange, err,
  otherId, otherValue, onOtherChange, otherErr,
}: PincodeSelectFieldProps) => (
  <SelectWithOther
    id={id} label={label} required={required}
    value={value} onChange={v => { onChange(v); if (v !== OTHER_OPTION) onOtherChange(""); }}
    options={[...options, OTHER_OPTION]}
    placeholder={cityReady ? "Select pincode" : "Select city first"} disabled={!cityReady} err={err}
    otherId={otherId} otherLabel={`Mention ${label}`}
    otherValue={otherValue} onOtherChange={v => onOtherChange(v.replace(/\D/g, "").slice(0, 6))}
    otherPlaceholder="Enter 6-digit pincode" otherErr={otherErr}
  />
));
PincodeSelectField.displayName = "PincodeSelectField";
