import type { NPAApplication } from "./ApplicationForm";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: NPAApplication | null;
}

const C = { teal:"#26ae90", navy:"#066a9c", dark:"#286090", gray:"#7b7b7b",
  tealBg:"rgba(38,174,144,0.08)", navyBg:"rgba(6,106,156,0.08)" };

const STATUS_STEPS = [
  { key:"Submitted",    icon:"✅", desc:"Application received"          },
  { key:"Under Review", icon:"🔍", desc:"Team is verifying your details"  },
  { key:"Verification", icon:"📄", desc:"Documents being verified"        },
  { key:"Approved",     icon:"👍", desc:"Settlement plan approved"        },
  { key:"Disbursed",    icon:"💰", desc:"Funds transferred to account"    },
];

// Determine how far the status has progressed
const getStepIndex = (status: string) => {
  const map: Record<string,number> = {
    "Pending":     1,
    "Submitted":   1,
    "Under Review":2,
    "Verification":3,
    "Approved":    4,
    "Disbursed":   5,
    "Rejected":    -1,
  };
  return map[status] ?? 1;
};

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {

  if (!isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{background:C.navyBg}}>📊</div>
        <h3 className="text-lg font-bold mb-2" style={{color:C.dark}}>No Application Yet</h3>
        <p className="text-sm" style={{color:C.gray}}>Submit your NPA application to track its status here.</p>
      </div>
    );
  }

  const currentStep = getStepIndex(submittedApp?.status ?? "Pending");
  const isRejected  = false;
  const existingBanks = [...(submittedApp?.existingBanksNpa??[]), ...(submittedApp?.existingBanksNonNpa??[])];

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
            style={isRejected
              ?{background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca"}
              :{background:C.tealBg,color:C.teal,border:`1px solid ${C.teal}44`}}>
            {submittedApp?.status ?? "Pending"}
          </span>
        </div>
      </div>

      {/* ── Two-column layout: Status timeline + Application details ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:`1px solid ${C.teal}18`}}>
          <p className="text-xs font-bold uppercase tracking-wide mb-5" style={{color:C.navy}}>Application Progress</p>
          <div className="space-y-0">
            {STATUS_STEPS.map((s, i) => {
              const done    = i + 1 <= currentStep;
              const active  = i + 1 === currentStep;
              const last    = i === STATUS_STEPS.length - 1;
              return (
                <div key={s.key} className="flex gap-4">
                  {/* Icon + line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all"
                      style={done
                        ?{background:C.teal,boxShadow:active?`0 0 0 4px ${C.teal}22`:"none"}
                        :{background:"#f1f5f9",color:C.gray}}>
                      {done
                        ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        : <span className="text-base">{s.icon}</span>
                      }
                    </div>
                    {!last && <div className="w-0.5 h-8 my-1" style={{background:done?C.teal+"44":"#e2e8f0"}}/>}
                  </div>
                  {/* Text */}
                  <div className="pb-6 min-w-0 pt-1.5">
                    <p className={`text-sm font-bold leading-tight`}
                      style={{color:done?C.dark:C.gray}}>{s.key}</p>
                    <p className="text-xs mt-0.5" style={{color:C.gray}}>{s.desc}</p>
                    {active&&(
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{background:C.tealBg,color:C.teal,border:`1px solid ${C.teal}44`}}>
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="space-y-4">

          {/* Loan summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{border:`1px solid ${C.navy}18`}}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{color:C.navy}}>Settlement Details</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Loan Amount",   `₹${(submittedApp?.loanAmount??0).toLocaleString("en-IN")}`],
                ["Tenure",        `${submittedApp?.loanTenure??0} months`],
                ["Employment",    submittedApp?.employmentType??"—"],
                ["Residence",     submittedApp?.residenceStatus??"—"],
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
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{color:C.teal}}>Collateral Property Details</p>
            <div className="space-y-3">
              {[
                ["Property Type",  submittedApp?.collateralPropertyType??"—"],
                ["Market Value",   `₹${(submittedApp?.collateralPropertyMarketValue??0).toLocaleString("en-IN")}`],
                ["Property Age",   `${submittedApp?.collateralPropertyAge??0} years`],
                ["City",           `${submittedApp?.collateralPropertyCity??""}, ${submittedApp?.collateralPropertyState??""}`],
                ["Pincode",        submittedApp?.collateralPropertyPincode??"—"],
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
          {(existingBanks.length > 0 || (submittedApp?.existingLoanAmount??0) > 0) && (
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
              {existingBanks.length>0&&(
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{color:C.gray}}>Banks</p>
                  <div className="flex flex-wrap gap-1.5">
                    {existingBanks.map(b=>(
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
