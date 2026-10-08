import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { loginFranchise } from "../api/franchise";
import { saveFranchiseSession } from "../utils/franchiseSession";
import { getApiErrorMessage } from "../utils/apiError";
import useSEO from "../hooks/useSEO";

/**
 * Franchisor Login — the partner portal entry point, kept separate from the
 * franchisee application flow.
 *
 * Sign-in posts to the live POST /franchise/login endpoint with the franchisee ID
 * issued with the agreement, and stores a franchise session that the franchisor
 * dashboard reads. No session is created unless the backend confirms the credentials.
 */

type Notice = { tone: "info" | "warn"; title: string; body: string } | null;

const PORTAL_POINTS = [
  "Check your franchise agreement status at a glance",
  "Keep plan, renewal and agreement details in one place",
  "Track leads submitted under your franchise agreement",
  "Review payout statements for successfully disbursed cases",
];

const DEFAULT_NOTICE: Notice = {
  tone: "info",
  title: "Portal access is invitation-based",
  body:
    "Portal credentials are issued with your franchise agreement and plan. " +
    "Write to the franchise team if you need access.",
};

const FranchiseLoginPage = () => {
  useSEO({
    title: "Franchisor Login",
    description:
      "Franchisor login for the Indexia Finance franchise partner portal. New here? Apply for a franchise or submit a franchisor enquiry.",
    path: "/franchise-login",
  });

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [notice, setNotice] = useState<Notice>(DEFAULT_NOTICE);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    const e: { identifier?: string; password?: string } = {};
    const franchiseId = identifier.trim().toUpperCase();

    if (!franchiseId) e.identifier = "Enter the franchisee ID issued with your agreement";
    else if (!/^FRN\d{6}$/.test(franchiseId)) {
      e.identifier = "Franchisee IDs look like FRN000003 — check your agreement";
    }
    if (!password) e.password = "Enter your password";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setNotice(null);
    try {
      const res = await loginFranchise({ franchiseId, password });
      if (!res.success || !res.token) {
        setNotice({
          tone: "warn",
          title: "Sign-in failed",
          body: res.message || `These credentials were not accepted. Write to ${FRANCHISE_EMAIL} if your credentials need to be re-issued.`,
        });
        return;
      }
      // Session is only stored after the backend confirms the credentials.
      saveFranchiseSession({ franchiseId: res.franchiseId ?? franchiseId }, res.token);
      navigate("/franchisor-dashboard");
    } catch (error) {
      // A rejected credential comes back as a 4xx with the backend's own message;
      // only a request that never got a response is a connectivity problem.
      const rejected = (error as { response?: unknown })?.response !== undefined;
      setNotice({
        tone: "warn",
        title: rejected ? "Sign-in failed" : "Could not reach the franchise service",
        body: rejected
          ? getApiErrorMessage(error, `These credentials were not accepted. Write to ${FRANCHISE_EMAIL} if they need to be re-issued.`)
          : `The sign-in request did not complete. Check your connection and try again, or write to ${FRANCHISE_EMAIL}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner
        breadcrumb="Franchisor Login"
        title="Franchisor"
        highlight="Login"
        tagline="Partner portal access for Indexia Finance franchisees"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:items-start">
            {/* Left — what the portal is for */}
            <div className="lg:col-span-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
                Franchisor Portal
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">One desk for your franchise business</h2>
              <div
                className="mt-3 h-0.75 w-32 rounded-full"
                style={{ background: "linear-gradient(90deg,#27ae90 0%,var(--brand-navy) 55%,transparent 100%)" }}
              />

              <ul className="mt-8 space-y-4">
                {PORTAL_POINTS.map((point) => (
                  <li key={point} className="flex gap-3.5">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: "linear-gradient(135deg,#26ae90,var(--brand-navy))" }}
                    >
                      <FranchiseIcon name="check" filled className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[13px] leading-relaxed text-slate-600">{point}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--brand-navy-14)" }}>
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-(--brand-navy)">
                  Not a franchisee yet?
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
                  Review the franchise business model, plan fees and the 80:20 payout structure, then apply.
                </p>
                <Link
                  to="/franchise"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-(--brand-navy) hover:underline"
                >
                  View the franchise opportunity →
                </Link>
              </div>
            </div>

            {/* Right — login card */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
                  >
                    <FranchiseIcon name="lock" filled className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Franchisor Login</h2>
                    <p className="text-[12.5px] text-slate-500">For registered franchise partners only</p>
                  </div>
                </div>

                {/* Portal status — stated up front, not after a failed attempt */}
                {notice && (
                  <div
                    role="status"
                    className="mt-6 rounded-xl border px-4 py-3.5"
                    style={
                      notice.tone === "warn"
                        ? { background: "#fff8e6", borderColor: "rgba(224,168,0,0.45)" }
                        : { background: "var(--brand-navy-14)", borderColor: "var(--brand-navy-44)" }
                    }
                  >
                    <p className="text-[12.5px] font-bold text-slate-700">{notice.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{notice.body}</p>
                    <a
                      href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent("Franchisor portal access request")}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
                    >
                      <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                      {FRANCHISE_EMAIL}
                    </a>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="franchisor-id" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      Franchisee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="franchisor-id"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setErrors((p) => ({ ...p, identifier: undefined }));
                      }}
                      placeholder="FRN000003"
                      autoComplete="username"
                      aria-describedby="franchisor-id-hint"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                        errors.identifier ? "border-red-400 bg-red-50/40" : "border-slate-300"
                      }`}
                    />
                    {errors.identifier && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.identifier}</p>}
                    <p id="franchisor-id-hint" className="mt-1 text-[11px] text-slate-400">
                      The franchisee ID is printed on your franchise agreement.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="franchisor-pw" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="franchisor-pw"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors((p) => ({ ...p, password: undefined }));
                        }}
                        placeholder="Your portal password"
                        autoComplete="current-password"
                        className={`w-full rounded-lg border px-3.5 py-2.5 pr-20 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                          errors.password ? "border-red-400 bg-red-50/40" : "border-slate-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md px-2.5 py-1.5 text-[11px] font-bold text-(--brand-navy) transition hover:bg-(--brand-navy-14) focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44)"
                        aria-pressed={showPassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                  >
                    {submitting ? "Signing in…" : "Login"}
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setNotice({
                        tone: "info",
                        title: "Password reset",
                        body: `Password resets are handled by the franchise team while the portal is being rolled out. Write to ${FRANCHISE_EMAIL} with your registered email or mobile number.`,
                      })
                    }
                    className="cursor-pointer text-[12.5px] font-semibold text-(--brand-navy) hover:underline focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44) rounded"
                  >
                    Forgot Password?
                  </button>
                  <Link
                    to="/franchise#become-a-franchisor"
                    className="cursor-pointer text-[12.5px] font-semibold text-(--brand-navy) hover:underline rounded focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44)"
                  >
                    Become a Franchisor →
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-center text-[11.5px] leading-relaxed text-slate-400">
                Looking to apply for a franchise instead?{" "}
                <Link to="/franchise" className="font-semibold text-(--brand-navy) hover:underline">
                  Go to the franchisee application
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FranchiseLoginPage;
