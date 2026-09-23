import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/common/Container";
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: "linear-gradient(135deg, #044e74 0%, #066a9c 100%)", borderColor: "rgba(255,255,255,0.1)" }}
    >
      <Container>
        <div className="flex justify-between items-center h-16 px-2 sm:px-4">

          {/* ── Left: Loan type only (no Indexia Finance text) ── */}
          {/* <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 text-xl"
              style={{ background: "linear-gradient(135deg, #26ae90, #066a9c)" }}
            >
              💳
            </div>
            <div>
              <p className="font-extrabold text-base leading-tight text-white">
                {loanType}
              </p>
              <p
                className="text-[10px] font-semibold mt-0.5"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Application Portal
              </p>
            </div>
          </div> */}

          {/* ── Right: Bell + Profile ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Bell */}
            <button
              className="relative p-2 rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-transparent" />
            </button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all"
                style={{ background: profileOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)" }}
                onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #26ae90, #066a9c)", color: "#f2f231" }}
                >
                  {initials}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-white leading-tight truncate max-w-[120px]">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.5)" }}>
                    +91 {user?.mobile ?? ""}
                  </p>
                </div>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ml-1 hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
                >
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  {/* User card */}
                  <div
                    className="px-4 py-4"
                    style={{ background: "linear-gradient(135deg, #044e74, #066a9c)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #26ae90, #f2f231)", color: "#044e74" }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{user?.email}</p>
                        <span
                          className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={user?.isVerified
                            ? { background: "rgba(38,174,144,0.3)", color: "#26ae90", border: "1px solid rgba(38,174,144,0.4)" }
                            : { background: "rgba(251,191,36,0.3)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)" }
                          }
                        >
                          {user?.isVerified ? "✓ Verified" : "⏳ Pending"}
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
                      onClick={handleLogout}
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
        </div>
      </Container>
    </header>
  );
};

export default DashboardHeader;
