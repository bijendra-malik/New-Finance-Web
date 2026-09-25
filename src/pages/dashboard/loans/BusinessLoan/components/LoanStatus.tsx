import type { BusinessLoanApplication } from "./ApplicationForm";
import { fmtTenure } from "../../../../../components/form/successSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: BusinessLoanApplication | null;
}

const C = { teal:"#26ae90", navy:"#066a9c", dark:"#286090", gray:"#7b7b7b",
  tealBg:"rgba(38,174,144,0.08)", navyBg:"rgba(6,106,156,0.08)" };

const dash = "—";
const inr = (n?: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const dt = (v?: string) => {
  if (!v) return dash;
  const d = new Date(v);
  return isNaN(d.getTime()) ? dash : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const list = (arr?: string[]) => (arr && arr.length > 0 ? arr.join(", ") : dash);

/** Transaction bank display: the backend may not persist the individual banks
 *  list, so fall back to the stored name itself ("Multiple Transaction Banks"). */
const txnBank = (name?: string, banks?: string[]) =>
  name === "Multiple Transaction Banks" && banks && banks.length > 0 ? list(banks) : (name ?? dash);

/** The backend merges custom entries into the arrays; drop the "Other" sentinel for display. */
const withoutOther = (arr?: string[]) => (arr ?? []).filter(b => b !== "Other");

/** One labelled row; value falls back to — so every collected field stays visible. */
const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b last:border-0" style={{ borderColor: "#f1f5f9" }}>
    <span className="text-xs font-semibold uppercase tracking-wide shrink-0" style={{ color: C.gray }}>{label}</span>
    <span className="text-sm font-bold text-right truncate" style={{ color: C.dark }}>{value ?? dash}</span>
  </div>
);

const Card = ({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: `1px solid ${accent}18` }}>
    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: accent }}>{title}</p>
    {children}
  </div>
);

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp;

  if (!isSubmitted || !app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{background:C.navyBg}}>📊</div>
        <h3 className="text-lg font-bold mb-2" style={{color:C.dark}}>No Application Yet</h3>
        <p className="text-sm" style={{color:C.gray}}>Submit your loan application to track its status here.</p>
      </div>
    );
  }

  const isBusiness   = app.employmentType === "Self Employed - Business";
  const isProfessional = app.employmentType === "Self Employed - Professional";
  const banks    = withoutOther([...(app.existingBanks ?? []), ...(app.existingBanksOther ?? app.otherBankList ?? [])]);
  const loanTypes = withoutOther([...(app.existingLoanTypes ?? []), ...(app.existingLoanTypesOther ?? app.otherLoanList ?? [])]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Application ID banner ── */}
      <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${C.teal}33`}}>
        <div className="h-1.5" style={{background:`linear-gradient(90deg,${C.teal},${C.navy})`}}/>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{background:C.tealBg,border:`1.5px solid ${C.teal}33`}}>✅</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{color:C.gray}}>Application Submitted</p>
              <p className="text-base font-extrabold" style={{color:C.dark}}>
                ID: <span style={{color:C.teal}}>{applicationId.slice(-10).toUpperCase()}</span>
              </p>
              <p className="text-xs mt-0.5" style={{color:C.gray}}>
                {dt(app.createdAt)}
              </p>
              <p className="text-[10px] mt-0.5" style={{color:C.gray}}>Ref ID: {applicationId}</p>
            </div>
          </div>
          <span className="self-start sm:self-center px-4 py-1.5 rounded-full text-sm font-bold"
            style={{background:C.tealBg,color:C.teal,border:`1px solid ${C.teal}44`}}>
            {app.status}
          </span>
        </div>
      </div>

      {/* ── Loan requirement ── */}
      <Card title="Loan Requirement" accent={C.navy}>
        <Row label="Loan Type" value={app.loanType ?? "Business Loan"} />
        <Row label="Loan Amount" value={inr(app.loanAmount)} />
        <Row label="Tenure" value={fmtTenure(app.loanTenure)} />
        <Row label="Employment Type" value={app.employmentType} />
      </Card>

      {/* ── Employment & income (branch-specific fields) ── */}
      <Card title="Employment & Income" accent={C.teal}>
        {isBusiness && (
          <>
            <Row label="Business Name" value={app.businessName} />
            <Row label="Business Type" value={app.businessType} />
            <Row label="GST Number" value={app.gstNumber} />
            <Row label="Company PAN" value={app.companyPanNumber} />
            <Row label="Nature of Business" value={app.natureOfBusiness} />
            <Row label="Industry Type" value={[app.industryType, app.subIndustry].filter(Boolean).join(" — ") || dash} />
            <Row label="Established On" value={dt(app.businessEstablishedDate)} />
            <Row label="Transaction Bank" value={txnBank(app.transactionBankName, app.transactionBanks)} />
            <Row label="Last Year Turnover" value={inr(app.lastYearTurnover)} />
            <Row label="Last 2 Years Turnover" value={inr(app.last2YearsTurnover)} />
            <Row label="Last Year Net Income" value={inr(app.lastYearNetIncome)} />
            <Row label="Last 2 Years Net Income" value={inr(app.last2YearsNetIncome)} />
          </>
        )}
        {isProfessional && (
          <>
            <Row label="Profession" value={app.profession} />
            <Row label="GST Number" value={app.gstNumber} />
            <Row label="Company PAN" value={app.companyPanNumber} />
            <Row label="Transaction Bank" value={txnBank(app.transactionBankName, app.transactionBanks)} />
            <Row label="Current Year Turnover" value={inr(app.currentYearTurnover)} />
            <Row label="Current Year Net Income" value={inr(app.currentYearNetIncome)} />
            <Row label="Previous Year Turnover" value={inr(app.priorYearTurnover)} />
            <Row label="Previous Year Net Income" value={inr(app.previousYearNetIncome)} />
          </>
        )}
        {!isBusiness && !isProfessional && (
          <Row label="Employment Type" value={app.employmentType} />
        )}
      </Card>

      {/* ── Business location (self-employed branches) ── */}
      {(isBusiness || isProfessional) && (
        <Card title="Business Location" accent={C.navy}>
          <Row label="State" value={app.businessState} />
          <Row label="City" value={app.businessCity} />
          <Row label="Pincode" value={app.businessPincode} />
          <Row label="Business Place Status" value={app.businessPlaceStatus} />
        </Card>
      )}

      {/* ── Applicant details ── */}
      <Card title="Applicant Details" accent={C.teal}>
        <Row label="Full Name" value={app.fullName} />
        <Row label="Date of Birth" value={dt(app.dob)} />
        <Row label="PAN Number" value={app.panNumber?.toUpperCase()} />
        <Row label="Mobile" value={app.mobile ? `+91 ${app.mobile}` : dash} />
        <Row label="Email" value={app.email} />
        <Row label="State" value={app.state} />
        <Row label="City" value={app.city} />
        <Row label="Pincode" value={app.pincode} />
        <Row label="Residence Status" value={app.residenceStatus} />
      </Card>

      {/* ── Existing loan obligations ── */}
      <Card title="Existing Loan Obligations" accent={C.gray}>
        <Row label="Existing Total EMI" value={inr(app.existingEMI)} />
        <Row label="Existing Loan Amount" value={inr(app.existingLoanAmount)} />
        <Row label="Existing Banks" value={list(banks)} />
        <Row label="Existing Loan Types" value={list(loanTypes)} />
      </Card>

      {/* Contact note */}
      <div className="rounded-xl px-5 py-4 flex items-start gap-3"
        style={{background:C.tealBg,border:`1px solid ${C.teal}33`}}>
        <span className="text-lg shrink-0">📞</span>
        <p className="text-sm" style={{color:C.dark}}>
          Our team will contact you on <strong>+91 {app.mobile}</strong> and{" "}
          <strong>{app.email}</strong> within <strong>24 hours</strong>.
        </p>
      </div>
    </div>
  );
};

export default LoanStatus;
