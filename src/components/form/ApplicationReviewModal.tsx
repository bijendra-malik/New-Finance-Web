import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { THEME as C } from "../../constants/theme";
import type { SuccessSection } from "./successSections";
import { fmtINR, fmtText, fmtTenure, isBlank } from "./successSections";

interface ApplicationReviewModalProps {
  open: boolean;
  productName: string;
  sections: SuccessSection[];
  applicantName?: string;
  loanAmount?: number;
  tenureMonths?: number;
  busy: boolean;
  error?: string;
  onCancel: () => void;
  onEditSection?: (section: SuccessSection) => void;
  onConfirm: () => void;
}

const visibleRows = (section: SuccessSection) =>
  section.rows.filter((row) => !row.omit && (row.force || !isBlank(row.value)));

const spinner = (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const ReviewSection = ({
  section,
  index,
  onEdit,
}: {
  section: SuccessSection;
  index: number;
  onEdit?: (section: SuccessSection) => void;
}) => {
  const rows = visibleRows(section);
  if (rows.length === 0) return null;
  const headingId = `review-section-${index}`;

  return (
    <section aria-labelledby={headingId} className="px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-[10px] font-bold" style={{ color: C.teal }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 id={headingId} className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.navy }}>
            {section.title}
          </h3>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(section)}
            className="rounded-lg border px-2.5 py-1 text-[11px] font-bold transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33)"
            style={{ borderColor: C.teal33, color: C.navy }}
            aria-label={`Edit ${section.title}`}
          >
            Edit
          </button>
        )}
      </div>
      <dl className="mt-2.5 grid gap-x-10 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 border-b py-2" style={{ borderColor: "#f1f5f9" }}>
            <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.gray }}>
              {row.label}
            </dt>
            <dd className="min-w-0 text-right text-[13px] font-bold wrap-anywhere" style={{ color: C.dark }}>
              {fmtText(row.value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

const ReviewDialog = ({
  productName,
  sections,
  applicantName,
  loanAmount,
  tenureMonths,
  busy,
  error,
  onCancel,
  onEditSection,
  onConfirm,
}: Omit<ApplicationReviewModalProps, "open">) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(timer);
  }, []);

  const details = sections
    .map((section) => ({ section, rows: visibleRows(section) }))
    .filter((entry) => entry.rows.length > 0);

  const facts: [string, string][] = [
    ["Applicant", applicantName ? fmtText(applicantName) : "—"],
    ["Product", productName],
    ["Loan amount", loanAmount ? fmtINR(loanAmount) : "—"],
    ["Tenure", tenureMonths && tenureMonths > 0 ? fmtTenure(tenureMonths) : "—"],
  ];

  return (
    <Modal open onClose={onCancel} labelledBy="application-review-title" maxWidth="max-w-3xl">
      {/* ── Letterhead ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${C.navyDeep}, ${C.navy})` }}>
        <div className="h-1 w-full" style={{ background: C.teal }} />
        <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: C.teal }}>
              Indexia Finance · Final review
            </p>
            <h2 ref={headingRef} tabIndex={-1} id="application-review-title" className="mt-1 text-xl font-extrabold leading-tight outline-none sm:text-2xl">
              Review your application
            </h2>
            <p className="mt-1 max-w-xl text-[12.5px] leading-6 text-white/75">
              Please check every detail of your {productName} application. You can edit any section
              before giving your final confirmation.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close review"
            className="shrink-0 rounded-lg border border-white/25 bg-white/10 p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70 disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scrollable preview ─────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-b px-5 py-4 sm:grid-cols-4 sm:px-6" style={{ borderColor: C.teal1f, background: C.navy14 }}>
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[9.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.gray }}>{label}</dt>
              <dd className="mt-0.5 text-[13px] font-bold wrap-anywhere" style={{ color: C.dark }}>{value}</dd>
            </div>
          ))}
        </dl>

        {details.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
            {details.map(({ section }, index) => (
              <ReviewSection key={section.title} section={section} index={index} onEdit={onEditSection} />
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-center text-sm text-slate-500">
            No details were captured for this application yet.
          </p>
        )}
      </div>

      {/* ── Consent + actions ──────────────────────────────────────────────── */}
      <div className="shrink-0 border-t bg-white px-5 py-4 sm:px-6" style={{ borderColor: C.teal1f }}>
        <div className="rounded-xl border px-4 py-3" style={{ borderColor: C.teal33, background: C.teal14 }}>
          <p className="text-[12.5px] font-bold" style={{ color: C.dark }}>
            Take a moment — this step is final
          </p>
          <p className="mt-1 text-[12px] leading-5" style={{ color: C.gray }}>
            Once you proceed to the credit-score step, these details are submitted as final and
            cannot be altered. Your credit score can also be entered only once.
          </p>
          <label className="mt-3 flex cursor-pointer select-none items-start gap-2.5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              disabled={busy}
              className="mt-0.5 h-4 w-4 shrink-0 rounded"
              style={{ accentColor: C.teal }}
            />
            <span className="text-[12px] font-semibold leading-5" style={{ color: C.dark }}>
              I have reviewed every detail above and confirm that they are accurate and final.
            </span>
          </label>
        </div>

        {error && (
          <div role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] text-red-700">
            <span className="shrink-0" aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border px-4 py-2.5 text-[12.5px] font-bold transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:opacity-50"
            style={{ borderColor: "#cbd5e1", color: C.dark }}
          >
            Edit details
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!confirmed || busy}
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[12.5px] font-bold text-white shadow-md transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.navy} 100%)` }}
          >
            {busy && spinner}
            {busy ? "Submitting your application…" : "Confirm & proceed to credit score"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/** Mounted only while open, so the confirmation checkbox always starts unticked. */
const ApplicationReviewModal = (props: ApplicationReviewModalProps) =>
  props.open ? <ReviewDialog {...props} /> : null;

export default ApplicationReviewModal;
