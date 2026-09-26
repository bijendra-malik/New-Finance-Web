import type { WorkingCapitalApplication } from "./ApplicationForm";
import { fmtTenure } from "../../../../../components/form/successSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: WorkingCapitalApplication | null;
}

const C = { teal:"#26ae90", navy:"#066a9c", dark:"#286090", gray:"#7b7b7b",
  tealBg:"rgba(38,174,144,0.08)", navyBg:"rgba(6,106,156,0.08)" };

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {

  if (!isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{background:C.navyBg}}>📊</div>
        <h3 className="text-lg font-bold mb-2" style={{color:C.dark}}>No Application Yet</h3>
        <p className="text-sm" style={{color:C.gray}}>Submit your working capital application to track its status here.</p>
      </div>
    );
  }


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
                {submittedApp?.createdAt
                  ? new Date(submittedApp.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})
                  : "—"}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-center px-4 py-1.5 rounded-full text-sm font-bold"
            style={{background:C.tealBg,color:C.teal,border:`1px solid ${C.teal}44`}}>
            Submitted
          </span>
        </div>
      </div>

      {/* ── Application details ── */}
      <div className="grid grid-cols-1 gap-6">

        {/* RIGHT — Details */}
        <div className="space-y-4">

          {/* Loan summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:`1px solid ${C.navy}18`}}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{color:C.navy}}>Loan Details</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Loan Amount",   `₹${(submittedApp?.loanAmount??0).toLocaleString("en-IN")}`],
                ["Tenure", fmtTenure(submittedApp?.loanTenure)],
                ["Collateral",    submittedApp?.collateralPropertyType??"—"],
                ["Employment",    submittedApp?.employmentType??"—"],
              ].map(([l,v])=>(
                <div key={l} className="rounded-xl p-3" style={{background:C.navyBg,border:`1px solid ${C.navy}18`}}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{color:C.gray}}>{l}</p>
                  <p className="text-sm font-bold truncate" style={{color:C.dark}}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collateral property details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:`1px solid ${C.teal}18`}}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{color:C.teal}}>Collateral Property</p>
            <div className="space-y-3">
              {[
                ["Market Value", `₹${(submittedApp?.collateralPropertyMarketValue??0).toLocaleString("en-IN")}`],
                ["Age",          `${submittedApp?.collateralPropertyAge??0} years`],
                ["City",         `${submittedApp?.collateralPropertyCity??""}, ${submittedApp?.collateralPropertyState??""}`],
                ["Pincode",      submittedApp?.collateralPropertyPincode??"—"],
              ].map(([l,v])=>(
                <div key={l} className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
                  style={{borderColor:"#f1f5f9"}}>
                  <span className="text-xs font-semibold uppercase tracking-wide shrink-0" style={{color:C.gray}}>{l}</span>
                  <span className="text-sm font-bold text-right truncate" style={{color:C.dark}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:`1px solid ${C.teal}18`}}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{color:C.teal}}>Applicant Details</p>
            <div className="space-y-3">
              {[
                ["Name",    submittedApp?.fullName??"—"],
                ["Mobile",  `+91 ${submittedApp?.mobile??"—"}`],
                ["Email",   submittedApp?.email??"—"],
                ["City",    `${submittedApp?.city??""}, ${submittedApp?.state??""}`],
                ["PAN",     submittedApp?.panNumber??"—"],
              ].map(([l,v])=>(
                <div key={l} className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
                  style={{borderColor:"#f1f5f9"}}>
                  <span className="text-xs font-semibold uppercase tracking-wide shrink-0" style={{color:C.gray}}>{l}</span>
                  <span className="text-sm font-bold text-right truncate" style={{color:C.dark}}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Existing loans */}
          {((submittedApp?.existingBanks?.length??0) > 0 || (submittedApp?.existingLoanAmount??0) > 0) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:`1px solid #e2e8f0`}}>
              <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{color:C.gray}}>Existing Obligations</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{background:"#f8fafc"}}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{color:C.gray}}>Monthly EMI</p>
                  <p className="text-sm font-bold" style={{color:C.dark}}>₹{(submittedApp?.existingEMI??0).toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-xl p-3" style={{background:"#f8fafc"}}>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{color:C.gray}}>Outstanding</p>
                  <p className="text-sm font-bold" style={{color:C.dark}}>₹{(submittedApp?.existingLoanAmount??0).toLocaleString("en-IN")}</p>
                </div>
              </div>
              {(submittedApp?.existingBanks?.length??0)>0&&(
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{color:C.gray}}>Banks</p>
                  <div className="flex flex-wrap gap-1.5">
                    {submittedApp?.existingBanks.map(b=>(
                      <span key={b} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{background:C.tealBg,color:C.teal,border:`1px solid ${C.teal}33`}}>{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact note */}
      <div className="rounded-xl px-5 py-4 flex items-start gap-3"
        style={{background:C.tealBg,border:`1px solid ${C.teal}33`}}>
        <span className="text-lg shrink-0">📞</span>
        <p className="text-sm" style={{color:C.dark}}>
          Our team will contact you on <strong>+91 {submittedApp?.mobile}</strong> and{" "}
          <strong>{submittedApp?.email}</strong> within <strong>24 hours</strong>.
        </p>
      </div>
    </div>
  );
};

export default LoanStatus;
