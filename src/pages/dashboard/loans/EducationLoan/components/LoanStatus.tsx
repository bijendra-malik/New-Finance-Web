import type { EducationLoanApplication } from "./ApplicationForm";
import LoanStatusShell, { ContactNote, StatusCard, StatusRow } from "../../shared/LoanStatusShell";
import { LoanSummaryCard, ApplicantDetailsCard, ExistingObligationsCard } from "../../shared/LoanStatusSections";

interface LoanStatusProps {
  applicationId: string;
  isSubmitted: boolean;
  submittedApp?: EducationLoanApplication | null;
}

const LoanStatus = ({ applicationId, isSubmitted, submittedApp }: LoanStatusProps) => {
  const app = submittedApp ?? undefined;

  return (
    <LoanStatusShell
      applicationId={applicationId}
      isSubmitted={isSubmitted}
      submittedApp={app}
      emptyMessage="Submit your education loan application to track its status here."
    >
      {app && (
        <>
          <LoanSummaryCard
            app={app}
          />

          <StatusCard title="Course Details" accent="#26ae90">
            <div className="space-y-3">
              {([
                ["Course", app?.courseName ?? "—"],
                ["University", app?.university ?? "—"],
                ["Institute", app?.instituteName ?? "—"],
                ["Enrollment", app?.enrollmentStatus ?? "—"],
                ["Duration", `${app?.courseDuration ?? 0} years`],
                ["Course Cost", `₹${(app?.educationCost ?? 0).toLocaleString("en-IN")} Lakhs`],
              ]).map(([l, v]) => (
                <StatusRow key={l} label={l} value={v} />
              ))}
            </div>
          </StatusCard>

          <StatusCard title="Student Details" accent="#26ae90">
            <div className="space-y-3">
              {[
                ["Name", app?.fullName ?? "—"],
                ["Mobile", `+91 ${app?.mobile ?? "—"}`],
                ["Email", app?.email ?? "—"],
                ["City", `${app?.city ?? ""}, ${app?.state ?? ""}`],
              ].map(([l, v]) => (
                <StatusRow key={l} label={l} value={v} />
              ))}
            </div>
          </StatusCard>

          <StatusCard title="Co-Applicant Details" accent="#26ae90">
            <div className="space-y-3">
              {([
                ["Relationship", app?.parentRelationship ?? "—"],
                ["Name", app?.parentFullName ?? "—"],
                ["Mobile", `+91 ${app?.parentMobile ?? "—"}`],
                ["Email", app?.parentEmail ?? "—"],
                ["City", `${app?.parentCity ?? ""}, ${app?.parentState ?? ""}`],
                ["PAN", app?.parentPanNumber ?? "—"],
              ]).map(([l, v]) => (
                <StatusRow key={l} label={l} value={v} />
              ))}
            </div>
          </StatusCard>
          <ApplicantDetailsCard app={app} />
          <ExistingObligationsCard app={app} />
          <ContactNote mobile={app.mobile} email={app.email} />
        </>
      )}
    </LoanStatusShell>
  );
};

export default LoanStatus;
