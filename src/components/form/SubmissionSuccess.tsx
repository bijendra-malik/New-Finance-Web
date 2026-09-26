import type { SuccessSection, SubmissionSuccessProps } from "./successSections";
import { fmtDateTime, fmtText } from "./successSections";
import { THEME as C } from "../../constants/theme";

/**
 * SubmissionSuccess — acknowledgement receipt shown after a loan application
 * is submitted. Renders every captured detail, organised into professional
 * statement-of-fact sections, using the product's existing colour scheme.
 */

const Section = ({ section }: { section: SuccessSection }) => {
  const rows = section.rows.filter(r => !r.omit && (r.force || !(r.value === undefined || r.value === null || String(r.value).trim() === "" || String(r.value).trim() === "0")));
  if (rows.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${C.teal1f}` }}>
      <div className="px-6 py-3.5 border-b" style={{ background: C.teal14, borderColor: `${C.teal1f}` }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.navy }}>{section.title}</p>
      </div>
      <div className="px-6 divide-y" style={{ borderColor: "#f1f5f9" }}>
        {rows.map(r => (
          <div key={r.label} className="flex items-start justify-between gap-6 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide shrink-0 pt-0.5" style={{ color: C.gray }}>{r.label}</span>
            <span className="text-sm font-bold text-right wrap-break-words" style={{ color: C.dark }}>{fmtText(r.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubmissionSuccess = ({ refNo, fullId, createdAt, productName, applicantName, mobile, email, sections }: SubmissionSuccessProps) => (
  <div className="max-w-3xl mx-auto space-y-5">
    {/* ── Receipt header — letterhead style ── */}
    <div className="rounded-2xl overflow-hidden shadow-xl bg-white" style={{ border: `1px solid ${C.teal33}` }}>
      <div className="h-1.5" style={{ background: `linear-gradient(90deg,${C.teal},${C.navy})` }} />

      <div className="px-7 pt-8 pb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{ background: `linear-gradient(135deg,${C.teal1a},${C.navy1a})`, border: `2px solid ${C.teal}` }}>
          <svg className="w-8 h-8" style={{ color: C.teal }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-1" style={{ color: C.dark }}>Application Submitted</h2>
        <p className="text-sm mb-5" style={{ color: C.gray }}>
          Your {productName} application has been submitted successfully.
        </p>

        {/* Reference badge — styled like an official receipt number */}
        <div className="inline-flex flex-col items-center px-8 py-4 rounded-2xl mb-6"
          style={{ background: C.navy14, border: `1.5px dashed ${C.navy55}` }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.gray }}>Application Reference No.</p>
          <p className="text-xl font-extrabold tracking-widest" style={{ color: C.navy, fontFamily: "'Courier New', monospace" }}>{refNo}</p>
          {fullId && <p className="text-[10px] mt-1.5" style={{ color: C.gray }}>Ref ID: {fullId}</p>}
        </div>

        {createdAt && (
          <p className="text-xs" style={{ color: C.gray }}>
            Submitted on <span className="font-bold" style={{ color: C.dark }}>{fmtDateTime(createdAt)}</span>
          </p>
        )}
      </div>

      {/* ── At-a-glance strip: applicant + product + status ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: `${C.teal1f}`, background: "#fbfdfc" }}>
        {[
          ["Product", productName],
          ["Applicant", fmtText(applicantName)],
          ["Status", "Submitted"],
        ].map(([l, v]) => (
          <div key={l} className="px-6 py-3.5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C.gray }}>{l}</p>
            <p className="text-sm font-bold" style={{ color: C.dark }}>{v}</p>
          </div>
        ))}
      </div>
    </div>

    {/* ── Every section of the filed application ── */}
    {sections.map(s => <Section key={s.title} section={s} />)}

    {/* ── What happens next + footer ── */}
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.teal33}` }}>
      <div className="px-6 py-4 flex items-start gap-3" style={{ background: C.teal14 }}>
        <span className="text-lg shrink-0">📞</span>
        <div>
          <p className="text-sm font-bold mb-0.5" style={{ color: C.dark }}>What happens next?</p>
          <p className="text-xs leading-relaxed" style={{ color: C.gray }}>
            All updates regarding your application will be sent to your registered mobile
            {mobile ? <strong style={{ color: C.dark }}> +91 {mobile}</strong> : " number"} and email
            {email ? <strong style={{ color: C.dark }}> {email}</strong> : " address"}.
            Please keep your KYC documents (Aadhaar, PAN) and income proofs handy for verification.
          </p>
        </div>
      </div>
      <div className="px-6 py-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderTop: `1px solid ${C.teal1f}` }}>
        <p className="text-[10px]" style={{ color: C.gray }}>
          This is a computer-generated acknowledgement of your submission. No signature required.
        </p>
        <button type="button" onClick={() => window.print()}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition-all hover:opacity-90"
          style={{ background: C.navy }}>
          Print Receipt
        </button>
      </div>
    </div>
  </div>
);

export default SubmissionSuccess;
