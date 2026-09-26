import type { SuccessSection } from "../../../../components/form/successSections";
import { fmtText } from "../../../../components/form/successSections";
import { StatusCard } from "./LoanStatusShell";
import { THEME as C } from "../../../../constants/theme";

const ApplicationDetails = ({ sections, contact }: {
  sections: SuccessSection[];
  /** Applicant contact shown in the closing note. */
  contact?: { mobile?: string; email?: string };
}) => (
  <>
    {sections.map(section => {
      const rows = section.rows.filter(r =>
        !r.omit && (r.force || !(r.value === undefined || r.value === null || String(r.value).trim() === "" || String(r.value).trim() === "0"))
      );
      if (rows.length === 0) return null;

      return (
        <StatusCard key={section.title} title={section.title} accent={C.teal}>
          <div className="space-y-3">
            {rows.map(r => (
              <StatusCardRow key={r.label} label={r.label} value={fmtText(r.value)} />
            ))}
          </div>
        </StatusCard>
      );
    })}

    {contact && (
      <div className="rounded-xl px-5 py-4 flex items-start gap-3" style={{ background: C.teal14, border: `1px solid ${C.teal33}` }}>
        <span className="text-lg shrink-0">📞</span>
        <p className="text-sm" style={{ color: C.dark }}>
          Our team will contact you on <strong>+91 {contact.mobile}</strong> and{" "}
          <strong>{contact.email}</strong> within <strong>24 hours</strong>.
        </p>
      </div>
    )}
  </>
);

const StatusCardRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-6 py-1.5 border-b last:border-0" style={{ borderColor: "#f1f5f9" }}>
    <span className="text-xs font-semibold uppercase tracking-wide shrink-0 pt-0.5" style={{ color: C.gray }}>{label}</span>
    <span className="text-sm font-bold text-right wrap-break-words" style={{ color: C.dark }}>{value}</span>
  </div>
);

export default ApplicationDetails;
