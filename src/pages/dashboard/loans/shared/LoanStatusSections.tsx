import { StatusCard, StatusRow, StatusTile } from "./LoanStatusShell";
import { C } from "./statusTheme";
import { fmtTenure } from "../../../../components/form/successSections";

/** Common fields every application object carries (structural subset). */
interface CommonApplication {
  fullName: string;
  mobile: string;
  email: string;
  panNumber?: string;
  state?: string;
  city?: string;
  residenceStatus?: string;
  employmentType: string;
  loanAmount?: number;
  loanTenure?: number;
  existingEMI?: number;
  existingLoanAmount?: number;
  existingBanks?: string[];
  existingLoanTypes?: string[];
}

// Existing Obligations card
export const ExistingObligationsCard = ({
  app,
  pillSource = "banks",
  extraBanks,
}: {
  app: CommonApplication;
  /** Which array feeds the pills. */
  pillSource?: "banks" | "loanTypes";
  /** Extra banks merged into the pill list (NPA: non-NPA accounts). */
  extraBanks?: string[];
}) => {
  const pills = pillSource === "loanTypes"
    ? (app.existingLoanTypes ?? [])
    : [...(app.existingBanks ?? []), ...(extraBanks ?? [])];
  const pillLabel = pillSource === "loanTypes" ? "Loan Types" : "Banks";

  if (pills.length === 0 && !(app.existingLoanAmount ?? 0 > 0)) return null;

  return (
    <StatusCard title="Existing Obligations" accent={C.gray}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "#f8fafc" }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: C.gray }}>Monthly EMI</p>
          <p className="text-sm font-bold" style={{ color: C.dark }}>₹{(app.existingEMI ?? 0).toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "#f8fafc" }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: C.gray }}>Outstanding</p>
          <p className="text-sm font-bold" style={{ color: C.dark }}>₹{(app.existingLoanAmount ?? 0).toLocaleString("en-IN")}</p>
        </div>
      </div>
      {pills.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: C.gray }}>{pillLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {pills.map(b => (
              <span key={b} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: C.tealBg, color: C.teal, border: `1px solid ${C.teal}33` }}>{b}</span>
            ))}
          </div>
        </div>
      )}
    </StatusCard>
  );
};

// Applicant Details card
export const ApplicantDetailsCard = ({ app, nameLabel = "Name" }: {
  app: CommonApplication;
  nameLabel?: string;
}) => (
  <StatusCard title="Applicant Details" accent={C.teal}>
    <div className="space-y-3">
      {[
        [nameLabel,      app.fullName ?? "—"],
        ["Mobile",       `+91 ${app.mobile ?? "—"}`],
        ["Email",        app.email ?? "—"],
        ["City",         `${app.city ?? ""}, ${app.state ?? ""}`],
        ["PAN",          app.panNumber ?? "—"],
      ].map(([l, v]) => (
        <StatusRow key={l} label={l} value={v} />
      ))}
    </div>
  </StatusCard>
);

// Loan summary tile grid
export const LoanSummaryCard = ({ title = "Loan Details", app, extraTiles = [] }: {
  title?: string;
  app: CommonApplication;
  /** Product-specific tiles appended after amount/tenure. */
  extraTiles?: { label: string; value: React.ReactNode }[];
}) => (
  <StatusCard title={title} accent={C.navy}>
    <div className="grid grid-cols-2 gap-3">
      <StatusTile label="Loan Amount" value={`₹${(app.loanAmount ?? 0).toLocaleString("en-IN")}`} />
      <StatusTile label="Tenure" value={fmtTenure(app.loanTenure)} />
      {extraTiles.map(t => <StatusTile key={t.label} label={t.label} value={t.value} />)}
    </div>
  </StatusCard>
);
