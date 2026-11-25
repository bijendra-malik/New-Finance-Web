import { forwardRef, memo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { THEME as C } from "../../constants/theme";
import { FORM } from "../../constants/formStyles";
import { toISODate } from "../../utils/formatters";
import { FieldError } from "./FormControls";

interface DateInputProps { value?: string; onClick?: () => void; placeholder?: string; err?: string; disabled?: boolean; }

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onClick, placeholder, err, disabled }, ref) => (
    <input ref={ref} value={value || ""} onClick={disabled ? undefined : onClick} placeholder={placeholder} readOnly disabled={disabled}
      className={`${FORM.field} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} focus:border-(--brand-teal) focus:ring-2 focus:ring-(--brand-teal-20) border ${err ? "border-(--form-error)" : "border-(--form-field-border)"}`}
      style={{ background: disabled ? FORM.fieldBgDisabled : FORM.fieldBg, color: C.dark }} />
  )
);
DateInput.displayName = "DateInput";

interface DateFieldProps {
  value: string; onChange: (v: string) => void; err?: string;
  minDate: Date; maxDate: Date; portalId: string;
  disabled?: boolean;
}

export const DateField = memo(({ value, onChange, err, minDate, maxDate, portalId, disabled = false }: DateFieldProps) => (
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
      disabled={disabled}
      wrapperClassName="w-full block"
      customInput={<DateInput err={err} disabled={disabled} />}
    />
    <FieldError msg={err} />
  </>
));
DateField.displayName = "DateField";
