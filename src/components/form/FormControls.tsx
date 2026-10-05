import { forwardRef, memo, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { THEME as C } from "../../constants/theme";
import { FORM } from "../../constants/formStyles";
import { OTHER_OPTION, MORE_THAN_TENURE_OPTION } from "../../constants/masters";

export { MORE_THAN_TENURE_OPTION };
import { toISODate, digitsOnly, formatIndianNumber } from "../../utils/formatters";
import { verifyPincode } from "../../api/masters";
import type { PincodeVerification } from "../../api/masters";

export const FormCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => (
  <div className="bg-(--form-card-bg) rounded-(--form-card-radius) shadow-sm overflow-hidden mb-5" style={{ border: `1px solid ${C.teal22}` }}>
    <div className="px-6 py-4 border-b" style={{ background: `linear-gradient(90deg,${C.teal14},${C.navy14})`, borderColor: `${C.teal20}` }}>
      <h2 className="text-base font-bold uppercase tracking-wide" style={{ color: C.dark }}>{title}</h2>
      <p className="text-xs mt-0.5" style={{ color: C.gray }}>{subtitle}</p>
    </div>
    <div className="p-(--form-card-pad)">{children}</div>
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
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url" | "search" | "none";
}
export const TextField = memo(({ type = "text", value, onChange, placeholder, err, maxLength, extraCls = "", disabled = false, min, max, inputMode }: TextFieldProps) => (
  <>
    <input type={type} value={value} placeholder={placeholder}
      maxLength={maxLength} disabled={disabled} min={min} max={max} inputMode={inputMode}
      onChange={e => onChange(e.target.value)}
      className={`${FORM.field} disabled:bg-slate-100 ${extraCls}`}
      style={{ border: `1.5px solid ${err ? FORM.error : FORM.fieldBorder}`, background: disabled ? FORM.fieldBgDisabled : FORM.fieldBg }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.teal22}`; } }}
      onBlur={e => { e.target.style.borderColor = err ? FORM.error : FORM.fieldBorder; e.target.style.boxShadow = "none"; }}
    />
    <FieldError msg={err} />
  </>
));
TextField.displayName = "TextField";

export const AmountField = memo(({ value, onChange, placeholder, err }: { value: string | number; onChange: (v: string) => void; placeholder: string; err?: string }) => (
  <TextField
    type="text"
    inputMode="numeric"
    value={formatIndianNumber(String(value))}
    onChange={v => onChange(digitsOnly(v))}
    placeholder={placeholder}
    err={err}
  />
));
AmountField.displayName = "AmountField";

interface SelectFieldProps {
  value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string; err?: string; disabled?: boolean;
  /** Optional per-option label override — defaults to the raw value. */
  formatOption?: (value: string) => string;
}
export const SelectField = memo(({ value, onChange, options, placeholder, err, disabled = false, formatOption }: SelectFieldProps) => (
  <>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      className={`${FORM.field} disabled:bg-slate-100 disabled:cursor-not-allowed`}
      style={{ border: `1.5px solid ${err ? FORM.error : FORM.fieldBorder}`, background: disabled ? FORM.fieldBgDisabled : FORM.fieldBg, color: value ? C.dark : C.gray }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.teal22}`; } }}
      onBlur={e => { e.target.style.borderColor = err ? FORM.error : FORM.fieldBorder; e.target.style.boxShadow = "none"; }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{formatOption ? formatOption(o) : o}</option>)}
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
      className={FORM.field}
      style={{ border: `1.5px solid ${err ? FORM.error : FORM.fieldBorder}`, background: FORM.fieldBg }}
      onFocus={e => { e.target.style.borderColor = C.teal; e.target.style.boxShadow = `0 0 0 3px ${C.teal22}`; }}
      onBlur={e => { e.target.style.borderColor = err ? FORM.error : FORM.fieldBorder; e.target.style.boxShadow = "none"; }}>
      <option value="">{placeholder}</option>
      {options.map(n => <option key={n} value={n}>{formatOption ? formatOption(n) : n}</option>)}
    </select>
    <FieldError msg={err} />
  </>
));
NumberSelectField.displayName = "NumberSelectField";

interface TenureYearsFieldProps {
  id: string; label: string; required?: boolean;
  value: number; onChange: (v: number) => void;
  customValue: number; onCustomChange: (v: number) => void;
  customErr?: string;
  options: readonly number[]; placeholder?: string; err?: string;
  maxYears?: number;
}
export const TenureYearsField = memo(({
  id, label, required = true, value, onChange, customValue, onCustomChange, customErr,
  options, placeholder = "Select", err, maxYears,
}: TenureYearsFieldProps) => {
  const cappedOptions = maxYears ? options.filter(y => y <= maxYears) : options;
  const maxYear = cappedOptions[cappedOptions.length - 1];
  const showMoreOption = !maxYears || maxYears > maxYear;
  const tenureOptions = (showMoreOption ? [...cappedOptions, MORE_THAN_TENURE_OPTION] : [...cappedOptions]) as readonly number[];
  return (
    <div id={id}>
      <FieldLabel label={label} required={required} />
      <NumberSelectField value={value} onChange={v => {
        onChange(v);
        if (v !== MORE_THAN_TENURE_OPTION) onCustomChange(0);
      }} options={tenureOptions} placeholder={placeholder} err={err}
        formatOption={y => y === MORE_THAN_TENURE_OPTION ? `More than ${maxYear} years` : `${y} ${y === 1 ? "year" : "years"}`} />
      {value === MORE_THAN_TENURE_OPTION && (
        <div id={`${id}Custom`} className="mt-3">
          <FieldLabel label="Enter Tenure (in years)" required />
          <TextField type="number" value={customValue === 0 ? "" : String(customValue)}
            onChange={v => onCustomChange(Math.max(0, parseInt(v) || 0))}
            placeholder="" err={customErr} max={maxYears} />
        </div>
      )}
    </div>
  );
});
TenureYearsField.displayName = "TenureYearsField";

interface DateInputProps { value?: string; onClick?: () => void; placeholder?: string; err?: string; }
const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onClick, placeholder, err }, ref) => (
    <input ref={ref} value={value || ""} onClick={onClick} placeholder={placeholder} readOnly
      className={`${FORM.field} cursor-pointer focus:border-(--brand-teal) focus:ring-2 focus:ring-(--brand-teal-20) border ${err ? "border-(--form-error)" : "border-(--form-field-border)"}`}
      style={{ background: FORM.fieldBg, color: C.dark }} />
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
  const maxDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 100, 0, 1);
  return <DateField value={value} onChange={onChange} err={err} minDate={minDate} maxDate={maxDate} portalId="dob-datepicker-portal" />;
});
DateOfBirthPicker.displayName = "DateOfBirthPicker";

interface PillMultiSelectProps {
  options: readonly string[]; selected: string[]; onChange: (v: string[]) => void; color?: string;
  disabled?: boolean;
}
export const PillMultiSelect = memo(({ options, selected, onChange, color = C.teal, disabled = false }: PillMultiSelectProps) => {
  const toggle = (item: string) => { if (!disabled) onChange(selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item]); };
  // Alpha tints can't be appended to a var() colour, so each shade is looked
  // up by the brand colour's variable name in the :root token set.
  const shade = (alpha: string): string => {
    const m = /var\(--brand-([a-z-]+)\)/.exec(color);
    return m ? `var(--brand-${m[1]}-${alpha})` : `${color}${alpha}`;
  };
  return (
    <div className={`flex flex-wrap gap-2 ${disabled ? "opacity-50 pointer-events-none select-none" : ""}`} aria-disabled={disabled}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={active
              ? { background: color, color: "#fff", borderColor: color, boxShadow: `0 2px 8px ${shade("44")}` }
              : { background: FORM.cardBg, color: C.gray, borderColor: FORM.fieldBorder }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = color; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = FORM.fieldBorder; }}>
            <span className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
              style={active ? { background: "rgba(255,255,255,0.25)" } : { border: `1.5px solid ${FORM.fieldBorderStrong}` }}>
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
  // Alpha tints can't be appended to a var() colour — resolve via the token set.
  const shade = (alpha: string): string => {
    const m = /var\(--brand-([a-z-]+)\)/.exec(color);
    return m ? `var(--brand-${m[1]}-${alpha})` : `${color}${alpha}`;
  };
  const [input, setInput] = useState("");
  const [dupErr, setDupErr] = useState("");
  const limitReached = max !== undefined && items.length >= max;
  const MAX_ENTRY_LENGTH = 100;

  const isDuplicate = (v: string) => {
    const norm = v.trim().toLowerCase();
    if (items.some(item => item.trim().toLowerCase() === norm)) return "You've already added this.";
    if (existingOptions?.some(opt => opt.trim().toLowerCase() === norm)) return "This is already available in the list above.";
    return "";
  };

  const commit = () => {
    const v = input.trim();
    if (!v || limitReached) return;
    if (v.length > MAX_ENTRY_LENGTH) { setDupErr(`Maximum ${MAX_ENTRY_LENGTH} characters`); return; }
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
            <input type="text" value={input} placeholder={placeholder} maxLength={MAX_ENTRY_LENGTH}
              onChange={e => { setInput(e.target.value); if (dupErr) setDupErr(""); }}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
              className={FORM.field}
              style={{ border: `1.5px solid ${dupErr ? FORM.error : FORM.fieldBorder}`, background: FORM.fieldBg }}
              onFocus={e => { if (!dupErr) { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${shade("22")}`; } }}
              onBlur={e => { e.target.style.borderColor = dupErr ? FORM.error : FORM.fieldBorder; e.target.style.boxShadow = "none"; }}
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
              style={{ background: shade("14"), border: `1px solid ${shade("22")}` }}>
              <span style={{ color: C.dark }}>{i + 1}. {item}</span>
              <button type="button" onClick={() => onRemove(i)}
                className="text-xs font-semibold ml-3 shrink-0 hover:underline" style={{ color: FORM.error }}>
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
  return (
    <div id={id}>
      <FieldLabel label={label} required={required} />
      <SelectField value={value} onChange={onChange} options={options} placeholder={placeholder} err={err} disabled={disabled} />
      {value === OTHER_OPTION && (
        <div id={otherId} className="mt-3">
          <FieldLabel label={otherLabel} required />
          <TextField value={otherValue} onChange={v => onOtherChange(v.slice(0, 100))} placeholder={otherPlaceholder} err={otherErr} maxLength={100} />
        </div>
      )}
    </div>
  );
});
SelectWithOther.displayName = "SelectWithOther";

interface PincodeInputFieldProps {
  id: string; label: string; required?: boolean;
  value: string; onChange: (v: string) => void; err?: string;
  onResolved?: (result: { pincode: string; state: string; city: string }) => void;
  disabled?: boolean;
}
/** Digits only, max 6, no leading zero (Indian pincodes never start with 0) — matches /^[1-9]\d{5}$/ used in each form's computeErrors(). */
const sanitizePincode = (raw: string) =>
  raw.replace(/\D/g, "").replace(/^0+/, "").slice(0, 6);

const PINCODE_REGEX = /^[1-9]\d{5}$/;
const DEBOUNCE_MS = 600;

interface PincodeFeedback {
  status: "verifying" | "invalid" | "notFound" | "error";
  message?: string;
}

export const PincodeInputField = memo(({
  id, label, required = true, value, onChange, err, onResolved, disabled = false,
}: PincodeInputFieldProps) => {
  const [feedback, setFeedback] = useState<PincodeFeedback | null>(null);
  const latestRequest = useRef(0);
  const lastResolved = useRef("");
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    const requestSeq = ++latestRequest.current;
    if (!PINCODE_REGEX.test(value)) {
      if (lastResolved.current) {
        lastResolved.current = "";
        onResolvedRef.current?.({ pincode: value, state: "", city: "" });
      }
      setFeedback(null);
      return;
    }
    setFeedback({ status: "verifying" });
    const timer = setTimeout(() => {
      verifyPincode(value)
        .then((result: PincodeVerification) => {
          if (latestRequest.current !== requestSeq) return;
          if (result.exists && result.info) {
            if (lastResolved.current !== value) {
              lastResolved.current = value;
              onResolvedRef.current?.({ pincode: value, state: result.info.state, city: result.info.city });
            }
            setFeedback(null);
          } else {
            setFeedback({ status: "notFound", message: result.message });
          }
        })
        .catch(() => {
          if (latestRequest.current !== requestSeq) return;
          setFeedback({
            status: "error",
            message: "Could not verify pincode right now — it will be re-checked on submit",
          });
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value]);

  const showError = err ?? (feedback?.status === "notFound"
    ? (feedback.message || "This pincode does not exist")
    : feedback?.status === "error" ? feedback.message : undefined);

  return (
    <div id={id}>
      <FieldLabel label={label} required={required} />
      <TextField
        value={value}
        onChange={v => onChange(sanitizePincode(v))}
        placeholder="Enter 6-digit pincode"
        err={showError}
        maxLength={6}
        inputMode="numeric"
        disabled={disabled}
      />
      {feedback?.status === "verifying" && !disabled && (
        <p className="text-xs mt-1" style={{ color: C.gray }}>Verifying pincode…</p>
      )}
    </div>
  );
});
PincodeInputField.displayName = "PincodeInputField";
