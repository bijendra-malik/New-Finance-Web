import type { ReactNode } from "react";
import { THEME as C } from "../../../../constants/theme";

const LoanStatusShell = ({
  applicationId,
  isSubmitted,
  submittedApp,
  emptyMessage = "Submit your loan application to track its status here.",
  children,
}: {
  applicationId: string;
  isSubmitted: boolean;
  /** `createdAt` is the only field the shell itself needs. */
  submittedApp?: { createdAt?: string } | null;
  emptyMessage?: string;
  children?: ReactNode;
}) => {
  if (!isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{ background: C.navy14 }}>📊</div>
        <h3 className="text-lg font-bold mb-2" style={{ color: C.dark }}>No Application Yet</h3>
        <p className="text-sm" style={{ color: C.gray }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Application ID banner ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.teal33}` }}>
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${C.teal},${C.navy})` }} />
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: C.teal14, border: `1.5px solid ${C.teal33}` }}>✅</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: C.gray }}>Application Submitted</p>
              <p className="text-base font-extrabold" style={{ color: C.dark }}>
                ID: <span style={{ color: C.teal }}>{applicationId.slice(-10).toUpperCase()}</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.gray }}>
                {submittedApp?.createdAt
                  ? new Date(submittedApp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                  : "—"}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center px-4 py-1.5 rounded-full text-sm font-bold"
            style={{ background: C.teal14, color: C.teal, border: `1px solid ${C.teal44}` }}>
            Submitted
          </span>
        </div>
      </div>

      {/* ── Product detail cards ── */}
      {children}
    </div>
  );
};

/** Card frame used for every detail section (loan details, applicant, …). */
export const StatusCard = ({ title, accent, children }: {
  title: string;
  accent: string;
  children: ReactNode;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: `1px solid ${accent}18` }}>
    <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: accent }}>{title}</p>
    {children}
  </div>
);

export default LoanStatusShell;
