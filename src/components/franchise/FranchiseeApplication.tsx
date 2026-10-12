import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useFranchiseStatus } from "../../hooks/useFranchiseStatus";
import { readFranchiseSession } from "../../utils/franchiseSession";
import { requestSignUp } from "../../utils/signInGate";
import FranchiseIcon from "./FranchiseIcon";
import SectionShell from "./SectionShell";
import FranchiseForm from "./FranchiseForm";
import RecipientContact from "./RecipientContact";
import { FRANCHISE_EMAIL } from "./franchiseData";

const BEFORE_YOU_APPLY = [
  "PAN-level details — every field must match your PAN card and official documents.",
  "A registered business entity is not mandatory to apply; the application is reviewed individually.",
  "The plan fee and the agreement fee are separate and both are exclusive of GST.",
  "Franchise allotment is confirmed only after agreement and verification are completed.",
];

interface FranchiseeApplicationProps {
  packageId: string | null;
  onPackageChange: (planId: string) => void;
}

/** Section 11 — the franchisee application form. */
const FranchiseeApplication = ({ packageId, onPackageChange }: FranchiseeApplicationProps) => {
  const { user, isLoggedIn } = useAuth();
  const session = readFranchiseSession();
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);
  const franchiseStatus = useFranchiseStatus(isLoggedIn || Boolean(session));
  const status = (submittedStatus ?? (franchiseStatus.reported ? franchiseStatus.status : null) ?? user?.franchiseStatus ?? session?.franchiseStatus ?? "")
    .trim()
    .toLowerCase();
  const normalizedStatus = status === "none" ? "" : status;
  const statusMessage = (() => {
    if (franchiseStatus.loading) {
      return { title: "Checking application status", message: "Please wait while we check your franchise application.", tone: "blue" as const };
    }
    switch (normalizedStatus) {
      case "pending":
        return { title: "Application Received", message: "Your franchise application has been received and is awaiting review by our team.", tone: "blue" as const };
      case "approved":
      case "active":
        return { title: "Application Approved", message: "Your application is approved. Kindly go to Franchisor Login to access your dashboard.", tone: "green" as const };
      case "rejected":
        return { title: "Application Not Approved", message: "Your franchise application was not approved. Contact the franchise team if you would like to discuss your application.", tone: "red" as const };
      case "unapproved":
      case "unverified":
        return { title: "Application Under Review", message: "Your franchise account is not approved or verified yet. Please contact the franchise team for an update.", tone: "amber" as const };
      default:
        return normalizedStatus
          ? { title: "Application Status", message: "Your franchise application is being reviewed. Contact the franchise team for more information.", tone: "blue" as const }
          : null;
    }
  })();
  const statusColors = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return (
  <SectionShell
    id="franchisee-application"
    eyebrow="Franchisee Application"
    title={statusMessage?.title ?? "Become an Indexia Franchisee"}
    subtitle={statusMessage?.message ?? "Register or sign in first, then share your business details exactly as they appear on your PAN card and pick the package duration that suits you."}
    tone="tint"
  >
    <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
      {/* Before you apply */}
      <aside className="space-y-5">
        <div
          className="rounded-2xl bg-white p-5"
          style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 14px rgba(6,106,156,0.07)" }}
        >
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
            Before you apply
          </h3>
          <ul className="mt-4 space-y-3">
            {BEFORE_YOU_APPLY.map((point) => (
              <li key={point} className="flex gap-2.5 text-[12.5px] leading-relaxed text-slate-600">
                <FranchiseIcon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--brand-teal)" strokeWidth={2.8} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <RecipientContact
          heading="Where your application goes"
          footnote=
            <>The one-time franchisee agreement fee is charged separately from the plan fee you select. It is published in full in <a href="#plans" className="font-semibold text-(--brand-yellow) hover:underline">Plans &amp; fees</a>.</>
        >
          Your application is submitted to our franchise team for review. Once your details are
          verified, you will be issued a <strong>franchise ID and password</strong> to sign in to the
          franchisor dashboard. Prefer email? Write to <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-yellow) hover:underline">{FRANCHISE_EMAIL}</a>.
        </RecipientContact>
      </aside>

      {/* Application form or current application status */}
      <div
        className="rounded-3xl bg-white p-6 md:p-8"
        style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 6px 26px rgba(6,106,156,0.1)" }}
      >
        {statusMessage ? (
          <div className={`rounded-2xl border p-6 ${statusColors[statusMessage.tone]}`}>
            <div className="flex items-start gap-3">
              <FranchiseIcon name={statusMessage.tone === "green" ? "check" : statusMessage.tone === "red" ? "support" : "clock"} filled className="mt-0.5 h-6 w-6 shrink-0" />
              <div>
                <h3 className="text-base font-extrabold">{statusMessage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{statusMessage.message}</p>
                {normalizedStatus === "approved" || normalizedStatus === "active" ? (
                  <Link
                    to="/franchise-login"
                    className="mt-5 inline-flex items-center rounded-xl bg-(--brand-navy) px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    Go to Franchisor Login
                  </Link>
                ) : normalizedStatus === "rejected" || normalizedStatus === "unapproved" || normalizedStatus === "unverified" ? (
                  <a
                    href={`mailto:${FRANCHISE_EMAIL}`}
                    className="mt-5 inline-flex items-center rounded-xl bg-(--brand-navy) px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    Contact the franchise team
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
        <>
        {!isLoggedIn && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
            <p className="text-sm font-semibold">Register or log in to apply for a franchise.</p>
            <p className="mt-1 text-xs leading-relaxed text-blue-800">Sign in first, then complete your Franchisee Application below.</p>
            <button
              type="button"
              onClick={() => requestSignUp()}
              className="mt-3 inline-flex items-center rounded-lg bg-(--brand-navy) px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              Register / Log In
            </button>
          </div>
        )}
        <div className="mb-6 flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
          >
            <FranchiseIcon name="handshake" filled className="h-5.5 w-5.5" />
          </span>
          <div>
            <h3 className="text-[15px] font-extrabold text-slate-800">Franchisee Application</h3>
            <p className="text-[12px] text-slate-500">Fields marked * are required</p>
          </div>
        </div>

        {isLoggedIn && (
          <FranchiseForm
            variant="franchisee"
            packageId={packageId ?? undefined}
            onPackageChange={onPackageChange}
            onApplicationStatus={setSubmittedStatus}
          />
        )}
        </>
        )}
      </div>
    </div>
  </SectionShell>
  );
};

export default FranchiseeApplication;
