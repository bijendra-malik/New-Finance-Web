import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { SuccessSection } from "../form/successSections";
import { fmtDate, fmtDateTime, fmtINR, fmtText, isBlank } from "../form/successSections";
import { THEME as C } from "../../constants/theme";
import CreditScoreGauge from "./CreditScoreGauge";
import { BAND_META, SCORE_MAX, type CreditBand } from "./creditScoreEvaluation";

interface ApplicationConfirmationProps {
  productName: string;
  application: Record<string, unknown> | null;
  sections: SuccessSection[];
  creditScore: number;
  band: CreditBand;
  message?: string;
  dashboardPath?: string;
}

const readableText = (value: unknown): string | undefined => {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
};

const positiveAmount = (value: unknown): number | undefined => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/,/g, ""))
        : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const visibleRows = (section: SuccessSection) =>
  section.rows.filter((row) => !row.omit && (row.force || !isBlank(row.value)));

const DetailSection = ({ section, index }: { section: SuccessSection; index: number }) => {
  const rows = visibleRows(section);
  if (rows.length === 0) return null;
  const headingId = `application-detail-${index}`;

  return (
    <section aria-labelledby={headingId} className="px-6 py-5 sm:px-8">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[10px] font-bold" style={{ color: C.teal }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          id={headingId}
          className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
          style={{ color: C.navy }}
        >
          {section.title}
        </h3>
      </div>
      <dl className="mt-3 grid gap-x-10 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b py-2"
            style={{ borderColor: "#f1f5f9" }}
          >
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

const ApplicationConfirmation = ({
  productName,
  application,
  sections,
  creditScore,
  band,
  message,
  dashboardPath,
}: ApplicationConfirmationProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const bandMeta = BAND_META[band];
  const reference =
    readableText(application?._id) ??
    readableText(application?.applicationId) ??
    readableText(application?.id);
  const status = readableText(application?.status) ?? "Submitted";
  const applicant = readableText(application?.fullName);
  const mobile = readableText(application?.mobile);
  const email = readableText(application?.email);
  const submittedAt = readableText(application?.createdAt) ?? readableText(application?.submittedAt);
  const loanAmount = positiveAmount(application?.loanAmount);
  const shortReference = reference ? reference.slice(-10).toUpperCase() : undefined;

  const details = sections
    .map((section) => ({ section, rows: visibleRows(section) }))
    .filter((entry) => entry.rows.length > 0);

  const facts: [string, string][] = [
    ["Applicant", fmtText(applicant)],
    ["Product", productName],
    ["Loan amount", loanAmount ? fmtINR(loanAmount) : "—"],
    ["Submitted on", submittedAt ? fmtDate(submittedAt) : "—"],
  ];

  const nextSteps: [string, string][] = [
    ["Verification call", "Our team reviews your file and calls you within one working day."],
    ["Documents", "Keep PAN, address proof and your latest income proof ready for verification."],
    ["Track progress", "Live status stays available under My Applications."],
  ];

  return (
    <article aria-labelledby="application-confirmation-title" className="space-y-5">
      {/* ── Letterhead ─────────────────────────────────────────────────────── */}
      <header
        className="overflow-hidden rounded-(--form-card-radius) bg-(--form-card-bg) shadow-sm"
        style={{ border: `1px solid ${C.teal33}` }}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${C.teal}, ${C.navy})` }} />
        <div className="px-6 pt-7 pb-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: C.teal }}>
                Indexia Finance · Loan application
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                id="application-confirmation-title"
                className="mt-2 text-2xl font-extrabold leading-tight outline-none md:text-[28px]"
                style={{ color: C.dark }}
              >
                Application confirmed
              </h1>
              <p className="mt-2 max-w-xl text-[13px] leading-6" style={{ color: C.gray }}>
                {message ||
                  `Your ${productName} application has been submitted successfully.`}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {status}
              </span>
              {shortReference && (
                <div
                  className="rounded-xl px-4 py-2.5 sm:text-right"
                  style={{ background: C.navy14, border: `1.5px dashed ${C.navy55}` }}
                >
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: C.gray }}>
                    Application reference
                  </p>
                  <p
                    className="mt-0.5 font-mono text-sm font-bold tracking-[0.14em]"
                    style={{ color: C.navy }}
                  >
                    {shortReference}
                  </p>
                </div>
              )}
            </div>
          </div>

          <dl
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-5 sm:grid-cols-4"
            style={{ borderColor: C.teal1f }}
          >
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[9.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.gray }}>
                  {label}
                </dt>
                <dd className="mt-1 text-[13.5px] font-bold wrap-anywhere" style={{ color: C.dark }}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ── Eligibility assessment ─────────────────────────────────────────── */}
      <section
        aria-labelledby="confirmation-eligibility-title"
        className="overflow-hidden rounded-(--form-card-radius) bg-(--form-card-bg)"
        style={{ border: `1px solid ${C.teal33}` }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-8"
          style={{ background: C.teal14, borderBottom: `1px solid ${C.teal1f}` }}
        >
          <h2
            id="confirmation-eligibility-title"
            className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.navy }}
          >
            Eligibility assessment
          </h2>
          <span
            className="rounded-full bg-white px-3 py-1 text-[11px] font-bold"
            style={{ color: bandMeta.color, border: `1px solid ${bandMeta.border}` }}
          >
            {bandMeta.label} band · {bandMeta.range[0]}–{bandMeta.range[1]}
          </span>
        </div>
        <div className="grid gap-6 px-6 py-6 sm:px-8 md:grid-cols-[1fr_19rem] md:items-center">
          <div>
            <p className="text-lg font-extrabold" style={{ color: C.dark }}>
              Eligible for {productName}
            </p>
            <p className="mt-1.5 text-[13px] leading-6" style={{ color: C.gray }}>
              Verified against a credit score of{" "}
              <strong style={{ color: C.dark }}>{creditScore}</strong> out of {SCORE_MAX}.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11.5px] font-semibold" style={{ background: C.teal14, color: C.navy }}>
              <span aria-hidden="true">✓</span>
              Your submitted details have been recorded against this application.
            </p>
          </div>
          <CreditScoreGauge score={creditScore} band={band} description={bandMeta.blurb} />
        </div>
      </section>

      {/* ── Every filed detail ─────────────────────────────────────────────── */}
      {details.length > 0 && (
        <section
          aria-labelledby="application-details-title"
          className="overflow-hidden rounded-(--form-card-radius) bg-(--form-card-bg)"
          style={{ border: `1px solid ${C.teal33}` }}
        >
          <div
            className="flex flex-wrap items-baseline justify-between gap-2 px-6 py-4 sm:px-8"
            style={{ background: C.teal14, borderBottom: `1px solid ${C.teal1f}` }}
          >
            <h2
              id="application-details-title"
              className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: C.navy }}
            >
              Application details
            </h2>
            <p className="text-[11px]" style={{ color: C.gray }}>
              Complete record, as filed by the applicant
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
            {details.map(({ section }, index) => (
              <DetailSection key={section.title} section={section} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* ── What happens next ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="confirmation-next-steps-title"
        className="overflow-hidden rounded-(--form-card-radius) bg-(--form-card-bg)"
        style={{ border: `1px solid ${C.teal33}` }}
      >
        <div className="px-6 py-4 sm:px-8" style={{ borderBottom: `1px solid ${C.teal1f}` }}>
          <h2
            id="confirmation-next-steps-title"
            className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.navy }}
          >
            What happens next
          </h2>
        </div>
        <ol className="grid gap-px md:grid-cols-3" style={{ background: "#f1f5f9" }}>
          {nextSteps.map(([title, body], index) => (
            <li key={title} className="bg-(--form-card-bg) px-6 py-5">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: C.teal }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <p className="mt-2.5 text-[12.5px] font-bold" style={{ color: C.dark }}>
                {title}
              </p>
              <p className="mt-1 text-[12px] leading-5" style={{ color: C.gray }}>
                {body}
              </p>
            </li>
          ))}
        </ol>
        <p
          className="px-6 py-4 text-[12px] leading-5 sm:px-8"
          style={{ background: C.teal14, color: C.gray }}
        >
          Updates will be sent to{" "}
          <strong style={{ color: C.dark }}>{mobile ? `+91 ${mobile}` : "your registered mobile"}</strong>{" "}
          and <strong style={{ color: C.dark }}>{email ?? "your registered email"}</strong>.
        </p>
      </section>

      {/* ── Document footer ────────────────────────────────────────────────── */}
      <footer
        className="flex flex-col gap-4 rounded-(--form-card-radius) bg-(--form-card-bg) px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        style={{ border: `1px solid ${C.teal33}` }}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold" style={{ color: C.gray }}>
            Computer-generated confirmation · no signature required
          </p>
          <p className="mt-1 truncate font-mono text-[10.5px] text-slate-400">
            {reference ? `ID ${reference}` : "Reference available shortly"}
            {submittedAt ? ` · ${fmtDateTime(submittedAt)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) focus-visible:ring-offset-1"
          >
            Print / Save PDF
          </button>
          {dashboardPath && (
            <Link
              to={dashboardPath}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) focus-visible:ring-offset-1"
            >
              Back to dashboard
            </Link>
          )}
          <Link
            to="/applications"
            className="rounded-xl px-5 py-2.5 text-[12px] font-bold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) focus-visible:ring-offset-1"
            style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.navy} 100%)` }}
          >
            Track application
          </Link>
        </div>
      </footer>
    </article>
  );
};

export default ApplicationConfirmation;
