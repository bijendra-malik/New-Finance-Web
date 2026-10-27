import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { cx } from "./cx";

export interface CodeBoxesProps {
  idPrefix: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  digits?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

const CodeBoxes = ({
  idPrefix,
  label,
  value,
  onChange,
  digits = 6,
  disabled = false,
  autoFocus = false,
  invalid = false,
  describedBy,
}: CodeBoxesProps) => {
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length: digits }, (_, i) => value[i] ?? "");

  const focusBox = (index: number) => {
    const target = Math.max(0, Math.min(digits - 1, index));
    boxRefs.current[target]?.focus();
  };

  const handleBoxInput = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const before = value.slice(0, index);
    const after = value.slice(index + 1);
    onChange((before + digit + after).slice(0, digits));
    focusBox(before.length + 1);
  };

  const handleBoxKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (chars[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusBox(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, digits);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    focusBox(pasted.length);
  };

  return (
    <div
      role="group"
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="grid grid-cols-6 gap-2"
      onPaste={handlePaste}
    >
      {chars.map((digit, index) => (
        <input
          key={index}
          ref={el => { boxRefs.current[index] = el; }}
          id={`${idPrefix}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          aria-label={`${label} digit ${index + 1}`}
          onChange={e => handleBoxInput(index, e.target.value)}
          onKeyDown={e => handleBoxKeyDown(index, e)}
          onFocus={e => e.target.select()}
          className={cx(
            "w-full rounded-xl border px-0 py-3 text-center text-lg font-bold tracking-[0.2em] text-slate-800",
            "transition outline-none focus:ring-2 focus:ring-(--brand-teal)/30 disabled:bg-slate-100",
            invalid ? "border-red-400 bg-red-50/40" : "border-slate-300 focus:border-(--brand-teal)",
          )}
        />
      ))}
    </div>
  );
};

export default CodeBoxes;
