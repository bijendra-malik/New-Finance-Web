import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CreditScoreGate from "../../../../components/loan-eligibility/CreditScoreGate";
import { loanKeyFor } from "../../../../constants/loanSlugs";
import { THEME as C } from "../../../../constants/theme";
import { FORM } from "../../../../constants/formStyles";
import { useAuth } from "../../../../context/authContext";
import { readPendingCreditScoreDraft, remainingCreditScoreWindow } from "../../../../utils/applicationFlowState";
import { clearApplySessionPending, dropApplySession, isApplySessionPending } from "../../../../utils/applySession";

type Tab = "application" | "credit-score";

const TABS: { key: Tab; label: string; short: string; icon: string; desc: string }[] = [
  { key: "application", label: "Application Form", short: "Application", icon: "📝", desc: "Fill your loan details" },
  { key: "credit-score", label: "Credit Score",     short: "Credit Score", icon: "🎯", desc: "Check eligibility & submit" },
];

const lockIcon = (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6 10.5h12v9.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V10.5z" />
  </svg>
);

/** One row of the profile dropdown's action list. */
const ProfileAction = ({
  icon, label, hint, onClick, danger = false,
}: {
  icon: string; label: string; hint?: string; onClick: () => void; danger?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
      danger ? "font-semibold text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
    }`}
  >
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm ${danger ? "bg-red-50" : "bg-slate-100"}`}>
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block leading-tight">{label}</span>
      {hint && <span className="block text-[10.5px] text-slate-400">{hint}</span>}
    </span>
  </button>
);

/** One labelled value in the profile dropdown's detail list. */
const ProfileDetail = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="min-w-0 truncate text-[12px] font-semibold text-slate-700">{value}</dd>
    </div>
  ) : null;

export interface DashboardShellProps<T> {
  productName: string;
  icon: string;
  applicationDesc?: string;
  renderForm: (ctx: { userName: string; userEmail: string; onSubmit: (id: string, app: T) => void }) => ReactNode;
}
const DashboardShell = <T,>({
  productName,
  icon,
  applicationDesc,
  renderForm,
}: DashboardShellProps<T>) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const pendingDraft = readPendingCreditScoreDraft(user?._id);
  const draftExpired = Boolean(
    pendingDraft && remainingCreditScoreWindow(pendingDraft.createdAt).expired,
  );
  const productLoanKey = loanKeyFor(productName);
  const initialProceeded = Boolean(
    pendingDraft && productLoanKey && pendingDraft.loanKey === productLoanKey && !draftExpired,
  );
  const [proceeded, setProceeded] = useState(initialProceeded);
  const [activeTab, setActiveTab] = useState<Tab>(initialProceeded ? "credit-score" : "application");
  const [creditScoreDone, setCreditScoreDone] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const restartRequired = proceeded && !creditScoreDone && (!pendingDraft || draftExpired);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const tabs = TABS.map(t => ({
    ...t,
    desc: t.key === "application" ? applicationDesc ?? t.desc : t.desc,
    locked: t.key === "application" ? proceeded : !proceeded,
    lockHint: t.key === "application"
      ? "Details final — continue in Credit Score"
      : "Available after you proceed from the form",
  }));

  const initials = user?.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "GU";

  const logoutRef = useRef(logout);
  useEffect(() => { logoutRef.current = logout; });

  useEffect(() => () => {
    if (!isApplySessionPending()) return;
    if (window.location.pathname.startsWith("/dashboard")) return;
    dropApplySession();
    logoutRef.current();
  }, []);

  const handleApplicationSubmit = () => {
    clearApplySessionPending();
    setProceeded(true);
    setActiveTab("credit-score");
  };

  // ── 3-column layout ────────────────────────────────────────────────────────
  return (
    <div
      className="flex overflow-hidden"
      style={{
        background: FORM.pageBg,
        marginTop: "var(--header-h)",
        height: "calc(100vh - var(--header-h))",
      }}
    >

      {/* COL 1: LEFT SIDEBAR */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 border-r"
        style={{ background: "linear-gradient(180deg, var(--brand-navy-deep) 0%, var(--brand-navy) 100%)", borderColor:"rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105"
              style={{ background:"linear-gradient(135deg,var(--brand-teal),var(--brand-navy-deep))", boxShadow:"0 2px 10px rgba(38,174,144,0.3)" }}>
              {icon}
            </div>
            <div>
              <p className="font-extrabold text-white text-sm leading-tight">{productName}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color:"rgba(255,255,255,0.45)" }}>Application Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color:"rgba(255,255,255,0.3)" }}>Navigation</p>
          {tabs.map((t, index) => {
            const active = activeTab === t.key;
            return (
              <div key={t.key}>
                {index > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2" aria-hidden="true">
                    <span className="h-px flex-1" style={{ background:"rgba(255,255,255,0.12)" }} />
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.3)" }}>
                      {t.locked ? "Locked" : "Next step"}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => { if (!t.locked) setActiveTab(t.key); }}
                  disabled={t.locked}
                  aria-current={active ? "step" : undefined}
                  aria-disabled={t.locked}
                  title={t.locked ? t.lockHint : undefined}
                  className="w-full text-left px-3 py-3 rounded-xl transition-all flex items-center gap-3 disabled:cursor-not-allowed"
                  style={active
                    ? { background:"rgba(255,255,255,0.15)", borderLeft:`3px solid ${C.teal}` }
                    : { background:"transparent", borderLeft:"3px solid transparent", opacity: t.locked ? 0.5 : 1 }}
                  onMouseEnter={e => { if(!active && !t.locked) e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
                  onMouseLeave={e => { if(!active) e.currentTarget.style.background="transparent"; }}
                >
                  <span className="text-lg shrink-0">{t.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-tight ${active?"text-white":"text-white/70"}`}>{t.label}</p>
                    <p className="text-[10px] leading-tight" style={{ color:"rgba(255,255,255,0.45)" }}>
                      {t.locked ? t.lockHint : t.desc}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0" style={{ color: t.locked ? "rgba(255,255,255,0.6)" : C.teal }}>
                    {t.locked ? lockIcon : (
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.6} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Step state note */}
        <div className="px-4 pb-5">
          <p className="rounded-xl px-3 py-2.5 text-[10.5px] leading-4"
            style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.65)" }}>
            {proceeded
              ? "Your application details have been saved. Enter your credit score to submit."
              : "Proceed from the form to unlock the credit-score step."}
          </p>
        </div>
      </aside>

      {/* COL 2: MAIN CONTENT (CENTER) */}
      <main id="loan-dashboard-main" className="flex-1 overflow-y-auto h-full">
        {/* Mobile tab bar */}
        <div className="md:hidden sticky top-0 z-20 flex border-b"
          style={{ background:"linear-gradient(90deg,var(--brand-navy-deep),var(--brand-navy))", borderColor:"rgba(255,255,255,0.1)" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { if (!t.locked) setActiveTab(t.key); }}
              disabled={t.locked}
              className="flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-all disabled:cursor-not-allowed"
              style={activeTab===t.key
                ? { borderBottom:`2px solid ${C.teal}`, color:"#fff" }
                : { borderBottom:"2px solid transparent", color:"rgba(255,255,255,0.5)", opacity: t.locked ? 0.55 : 1 }}>
              <span className="text-base">{t.locked ? "🔒" : t.icon}</span>
              <span className="text-[9px] font-semibold whitespace-nowrap">{t.short}</span>
            </button>
          ))}
        </div>

        <div className="px-4 md:px-8 py-6 md:py-10">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-xl font-bold" style={{ color:C.dark }}>
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
            <p className="text-sm mt-0.5" style={{ color:C.gray }}>
              {tabs.find(t => t.key === activeTab)?.desc}
            </p>
            <div className="mt-2 h-0.5 w-12 rounded-full"
              style={{ background:`linear-gradient(90deg,${C.teal},${C.navy})` }}/>
          </div>

          {/* The form stays mounted (hidden) so a proceeded application survives tab switches */}
          <div style={activeTab === "application" ? undefined : { display: "none" }}>
            {renderForm({ userName: user?.name ?? "", userEmail: user?.email ?? "", onSubmit: handleApplicationSubmit })}
          </div>
          {activeTab === "credit-score" && (
            <div className="space-y-5">
              {restartRequired ? (
                <section className="rounded-(--form-card-radius) border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-extrabold" style={{ color: C.dark }}>
                    This application draft is no longer active
                  </h2>
                  <p className="mt-1 max-w-md text-[12.5px] leading-6" style={{ color: C.gray }}>
                    The 24-hour window for your saved {productName} application has ended, so a fresh
                    application has to be filled in before a credit score can be checked.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setProceeded(false); setActiveTab("application"); }}
                    className="mt-4 rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:brightness-110"
                    style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.navy} 100%)` }}
                  >
                    Start a new application
                  </button>
                </section>
              ) : (
                <>
                  <div
                    className="rounded-(--form-card-radius) px-5 py-4"
                    style={{ background: "var(--brand-teal-14)", border: "1px solid var(--brand-teal-33)" }}
                    role="status"
                  >
                    <p className="text-sm font-bold text-(--brand-dark)">✓ Application details have been saved</p>
                    <p className="mt-0.5 text-xs text-(--brand-gray)">
                      Your details have been saved and can no longer be edited. Your credit score can be
                      entered only once.
                    </p>
                  </div>
                  <CreditScoreGate product={productName} onFinalized={() => setCreditScoreDone(true)} />
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* COL 3: RIGHT PANEL — profile */}
      {user && <aside
        className="hidden lg:flex flex-col w-72 shrink-0 border-l"
        style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-end" style={{ borderColor: "#e2e8f0" }}>
          {/* Profile button */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setProfileOpen(o => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all"
              style={{ background: profileOpen ? "#e2e8f0" : "#f1f5f9", border: "1px solid #e2e8f0" }}
              onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = "#e9eef5"; }}
              onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = "#f1f5f9"; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-navy))", color: "var(--brand-yellow)" }}
              >
                {initials}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight truncate max-w-25" style={{ color: "#1e293b" }}>
                  {user.name}
                </p>
                <p className="text-[10.5px] leading-tight font-semibold" style={{ color: "#94a3b8" }}>View profile</p>
              </div>
              <svg
                className={`w-3.5 h-3.5 transition-transform ml-1 ${profileOpen ? "rotate-180" : ""}`}
                style={{ color: "#94a3b8" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dropdown — the account's basic profile, then quick actions */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                <div className="relative overflow-hidden px-4 pb-4 pt-5 text-white"
                  style={{ background: "linear-gradient(135deg, var(--brand-navy-deep), var(--brand-navy))" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-yellow))", color: "var(--brand-navy-deep)" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate">{user.name || "Guest user"}</p>
                      <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={user.isVerified
                        ? { background: "rgba(38,174,144,0.25)", color: "#5ce0bd", border: "1px solid rgba(38,174,144,0.45)" }
                        : { background: "rgba(251,191,36,0.25)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.45)" }
                      }
                    >
                      {user.isVerified ? "✓ KYC verified" : "⏳ Verification pending"}
                    </span>
                    {user.customerId && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}>
                        {user.customerId}
                      </span>
                    )}
                  </div>
                </div>

                <dl className="space-y-2 border-b border-slate-100 px-4 py-3.5">
                  <ProfileDetail label="Customer ID" value={user.customerId} />
                  <ProfileDetail label="Mobile" value={user.mobile ? `+91 ${user.mobile}` : undefined} />
                  <ProfileDetail label="Email" value={user.email} />
                  <ProfileDetail label="Applying for" value={productName} />
                </dl>

                <div className="py-1.5">
                  <ProfileAction icon="📄" label="My applications" hint="Every application you have submitted"
                    onClick={() => { setProfileOpen(false); navigate("/applications"); }} />
                  <ProfileAction icon="🔎" label="Check application status" hint="Verify your mobile to see the latest update"
                    onClick={() => { setProfileOpen(false); navigate("/application-status"); }} />
                  <ProfileAction icon="🏠" label="Back to home"
                    onClick={() => { setProfileOpen(false); navigate("/"); }} />
                </div>
                <div className="border-t border-slate-100 py-1.5">
                  <ProfileAction icon="🚪" label="Logout" danger
                    onClick={() => { setProfileOpen(false); logout(); navigate("/"); }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stepper summary */}
        <div className="px-5 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>Your progress</p>
          <ol className="mt-3 space-y-3">
            {tabs.map(t => (
              <li key={t.key} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={t.locked
                    ? { background: "#e2e8f0", color: "#64748b" }
                    : { background: "var(--brand-teal)", color: "#fff" }}
                >
                  {t.locked ? "🔒" : "✓"}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-bold" style={{ color: "#1e293b" }}>{t.label}</span>
                  <span className="block text-[11px] leading-4 text-slate-400">
                    {t.key === "application"
                      ? (proceeded ? "Saved — details are final" : "Fill and proceed")
                      : (proceeded ? "Enter your score to submit" : "Locked until you proceed")}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </aside>}

    </div>
  );
};

export default DashboardShell;
