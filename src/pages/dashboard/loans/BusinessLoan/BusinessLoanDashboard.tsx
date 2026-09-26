import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "./components/ApplicationForm";
import LoanStatus from "./components/LoanStatus";
import { useAuth } from "../../../../context/authContext";
import type { BusinessLoanApplication } from "./components/ApplicationForm";

type Tab = "application" | "status";

const TABS: { key: Tab; label: string; icon: string; desc: string }[] = [
  { key: "application", label: "Application Form",   icon: "📝", desc: "Fill your loan details"    },
  { key: "status",      label: "Application Status", icon: "📊", desc: "Track your application"    },
];

const C = { teal:"#26ae90", navy:"#066a9c", dark:"#286090", yellow:"#f2f231", gray:"#7b7b7b" };

const BusinessLoanDashboard = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab,     setActiveTab]     = useState<Tab>("application");
  const [isSubmitted,   setIsSubmitted]   = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [submittedApp,  setSubmittedApp]  = useState<BusinessLoanApplication | null>(null);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  if (!isLoggedIn || !user) { navigate("/"); return null; }

  const initials = user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const handleApplicationSubmit = (id: string, app: BusinessLoanApplication) => {
    setApplicationId(id); setSubmittedApp(app);
    setIsSubmitted(true); setActiveTab("status");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── 3-column layout ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: "#f0f4f8", marginTop: "100px" }}>

      {/* ══ COL 1: LEFT SIDEBAR ══════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-r"
        style={{ background: "linear-gradient(180deg,#044e74 0%,#066a9c 100%)", borderColor:"rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105"
              style={{ background:"linear-gradient(135deg,#26ae90,#044e74)", boxShadow:"0 2px 10px rgba(38,174,144,0.3)" }}>
              🏢
            </div>
            <div>
              <p className="font-extrabold text-white text-sm leading-tight">Business Loan</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color:"rgba(255,255,255,0.45)" }}>Application Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color:"rgba(255,255,255,0.3)" }}>Navigation</p>
          {TABS.map(t => {
            const active = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className="w-full text-left px-3 py-3 rounded-xl transition-all flex items-center gap-3"
                style={active
                  ? { background:"rgba(255,255,255,0.15)", borderLeft:`3px solid ${C.teal}` }
                  : { background:"transparent", borderLeft:"3px solid transparent" }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.background="transparent"; }}
              >
                <span className="text-lg shrink-0">{t.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${active?"text-white":"text-white/70"}`}>{t.label}</p>
                  <p className="text-[10px] truncate" style={{ color:"rgba(255,255,255,0.35)" }}>{t.desc}</p>
                </div>
                {t.key==="status" && isSubmitted && (
                  <span className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background:C.teal }}/>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t space-y-2" style={{ borderColor:"rgba(255,255,255,0.08)" }}>
          {[["Max Amount","₹5 Crores"],["Rate","From 12%"],["Tenure","Up to 10 yrs"]].map(([l,v]) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-[11px]" style={{ color:"rgba(255,255,255,0.4)" }}>{l}</span>
              <span className="text-[11px] font-bold" style={{ color:C.yellow }}>{v}</span>
            </div>
          ))}

        </div>
      </aside>

      {/* ══ COL 2: MAIN CONTENT (CENTER) ════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile tab bar */}
        <div className="md:hidden sticky top-0 z-20 flex border-b"
          style={{ background:"linear-gradient(90deg,#044e74,#066a9c)", borderColor:"rgba(255,255,255,0.1)" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-all"
              style={activeTab===t.key
                ? { borderBottom:`2px solid ${C.teal}`, color:"#fff" }
                : { borderBottom:"2px solid transparent", color:"rgba(255,255,255,0.5)" }}>
              <span className="text-base">{t.icon}</span>
              <span className="text-[9px] font-semibold whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="px-4 md:px-8 py-6 md:py-10">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-xl font-bold" style={{ color:C.dark }}>
              {TABS.find(t => t.key === activeTab)?.label}
            </h1>
            <p className="text-sm mt-0.5" style={{ color:C.gray }}>
              {TABS.find(t => t.key === activeTab)?.desc}
            </p>
            <div className="mt-2 h-0.5 w-12 rounded-full"
              style={{ background:`linear-gradient(90deg,${C.teal},${C.navy})` }}/>
          </div>

          <div style={activeTab === "application" ? undefined : { display: "none" }}>
          <ApplicationForm userName={user.name} userEmail={user.email} onSubmit={handleApplicationSubmit} />
        </div>
          {activeTab === "status" && (
            <LoanStatus applicationId={applicationId} isSubmitted={isSubmitted} submittedApp={submittedApp} />
          )}
        </div>
      </main>

      {/* ══ COL 3: RIGHT PANEL — only bell + profile ══════════════════════ */}
      <aside
        className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-screen border-l"
        style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
      >
        {/* Bell + Profile row */}
        <div
          className="px-5 py-4 border-b flex items-center justify-end gap-2"
          style={{ borderColor: "#e2e8f0" }}
        >
          {/* Bell */}
          <button
            className="relative p-2 rounded-lg transition-all"
            style={{ color: "#64748b" }}
            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white" />
          </button>

          {/* Profile button */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all"
              style={{ background: profileOpen ? "#e2e8f0" : "#f1f5f9", border: "1px solid #e2e8f0" }}
              onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = "#e9eef5"; }}
              onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = "#f1f5f9"; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #26ae90, #066a9c)", color: "#f2f231" }}
              >
                {initials}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight truncate max-w-25" style={{ color: "#1e293b" }}>
                  {user.name}
                </p>
                <p className="text-xs leading-tight" style={{ color: "#94a3b8" }}>+91 {user.mobile}</p>
              </div>
              <svg
                className={`w-3.5 h-3.5 transition-transform ml-1 ${profileOpen ? "rotate-180" : ""}`}
                style={{ color: "#94a3b8" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-4" style={{ background: "linear-gradient(135deg, #044e74, #066a9c)" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg, #26ae90, #f2f231)", color: "#044e74" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{user.email}</p>
                      <span
                        className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={user.isVerified
                          ? { background: "rgba(38,174,144,0.3)", color: "#26ae90", border: "1px solid rgba(38,174,144,0.4)" }
                          : { background: "rgba(251,191,36,0.3)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)" }
                        }
                      >
                        {user.isVerified ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm">🏠</span>
                    Back to Home
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1.5">
                  <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-sm">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

    </div>
  );
};

export default BusinessLoanDashboard;
