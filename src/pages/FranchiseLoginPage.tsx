import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { loginFranchise } from "../api/franchise";
import { PAN_REGEX } from "../utils/validation";
import { formatPAN } from "../utils/formatters";
import {
  saveFranchiseSession,
  clearFranchiseSession,
} from "../utils/franchiseSession";
import { getApiErrorMessage } from "../utils/apiError";
import useSEO from "../hooks/useSEO";
import { useAuth } from "../context/authContext";

type Notice = { tone: "info" | "warn" | "error"; title: string; body: string } | null;

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
    "Sign in with your franchisee ID and the PAN number from your franchise application. " +
    "Write to the franchise team if you need access.",
};

const FranchiseLoginPage = () => {
  useSEO({
    title: "Franchisee Login",
    description:
      "Franchisee login for the Indexia Finance franchise partner portal. New here? Apply for a franchise or submit a franchise enquiry.",
    path: "/franchise-login",
  });

  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const [franchiseId, setFranchiseId] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [errors, setErrors] = useState<{ franchiseId?: string; panNumber?: string }>({});
  const [notice, setNotice] = useState<Notice>(DEFAULT_NOTICE);
  const [submitting, setSubmitting] = useState(false);
  const [welcome, setWelcome] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    if (!welcome) return;
    const timer = setTimeout(() => navigate("/franchisor-dashboard"), 2000);
    return () => clearTimeout(timer);
  }, [welcome, navigate]);

  const handleSubmit = async (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    const e: { franchiseId?: string; panNumber?: string } = {};
    const normalizedFranchiseId = franchiseId.trim().toUpperCase();
    const normalizedPan = panNumber.trim().toUpperCase();

    if (!/^FRN\d{6}$/.test(normalizedFranchiseId)) e.franchiseId = "Enter the franchisee ID from your agreement (e.g. FRN000003)";
    if (!PAN_REGEX.test(normalizedPan)) e.panNumber = "Enter the PAN number from your franchise application";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setNotice(null);
    try {
      const res = await loginFranchise({ franchiseId: normalizedFranchiseId, password: normalizedPan });
      if (!res.success || !res.token) {
        setNotice({
          tone: "warn",
          title: "Sign-in failed",
          body: res.message || `These credentials were not accepted. Write to ${FRANCHISE_EMAIL} if your credentials need to be re-issued.`,
        });
        return;
      }
      const status = (res.franchise?.franchiseStatus ?? "").trim().toLowerCase();
      if (status === "rejected") {
        clearFranchiseSession();
        setNotice({
          tone: "error",
          title: "Franchisee login is locked",
          body: `Your franchise application was not approved. Contact ${FRANCHISE_EMAIL} if you would like to discuss your application.`,
        });
        return;
      }
      const responseFranchiseId = res.franchise?.franchiseId;
      if (!responseFranchiseId) {
        setNotice({
          tone: "warn",
          title: "Verification incomplete",
          body: "Your account was verified but no franchisee ID was returned. Please contact the franchise team.",
        });
        return;
      }
      if (responseFranchiseId.trim().toUpperCase() !== normalizedFranchiseId) {
        setNotice({
          tone: "warn",
          title: "Sign-in failed",
          body: "The franchisee ID does not match the PAN on this account. Check both details and try again.",
        });
        return;
      }      saveFranchiseSession(
        {
          franchiseId: responseFranchiseId,
          franchiseStatus: res.franchise?.franchiseStatus,
          isVerified: res.franchise?.isVerified,
        },
        res.token,
      );
      
      setWelcome({ name: res.franchise?.name?.trim() || undefined });
      setLoggedIn({
        _id: res.franchise?._id ?? responseFranchiseId,
        name: res.franchise?.name ?? "",
        mobile: res.franchise?.mobile ?? "",
        email: res.franchise?.email ?? "",
        isVerified: res.franchise?.isVerified ?? true,
        isActive: res.franchise?.isActive ?? true,
        continent: res.franchise?.continent,
        country: res.franchise?.country,
        lastLogin: res.franchise?.lastLogin ?? "",
        createdAt: res.franchise?.createdAt ?? "",
        updatedAt: res.franchise?.updatedAt ?? "",
      });
    } catch (error) {
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
        breadcrumb="Franchisee Login"
        title="Franchisee"
        highlight="Login"
        tagline="Partner portal access for Indexia Finance franchisees"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:items-start">
            {/* Left — an overview of the franchisee portal */}
            <div className="lg:col-span-2">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--brand-navy)">
                Franchisee Portal
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
                    <h2 className="text-xl font-bold text-slate-800">Franchisee Verification</h2>
                    <p className="text-[12.5px] text-slate-500">For registered franchise partners only</p>
                  </div>
                </div>

                {/* Portal status — stated up front, not after a failed attempt */}
                {notice && (
                  <div
                    role="status"
                    className="mt-6 rounded-xl border px-4 py-3.5"
                    style={
                      notice.tone === "error"
                        ? { background: "#fef2f2", borderColor: "#fecaca" }
                        : notice.tone === "warn"
                          ? { background: "#fff8e6", borderColor: "rgba(224,168,0,0.45)" }
                          : { background: "var(--brand-navy-14)", borderColor: "var(--brand-navy-44)" }
                    }
                  >
                    <p className="text-[12.5px] font-bold text-slate-700">{notice.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{notice.body}</p>
                    {notice.tone !== "info" && (
                      <a
                        href={`mailto:${FRANCHISE_EMAIL}?subject=${encodeURIComponent("Franchisee portal access request")}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-(--brand-navy) hover:underline"
                      >
                        <FranchiseIcon name="mail" className="h-3.5 w-3.5" />
                        {FRANCHISE_EMAIL}
                      </a>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="franchise-id" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      Franchisee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="franchise-id"
                      value={franchiseId}
                      onChange={(e) => {
                        setFranchiseId(e.target.value.toUpperCase());
                        setErrors((p) => ({ ...p, franchiseId: undefined }));
                      }}
                      placeholder="FRN000003"
                      autoComplete="username"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                        errors.franchiseId ? "border-red-400 bg-red-50/40" : "border-slate-300"
                      }`}
                    />
                    {errors.franchiseId && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.franchiseId}</p>}
                  </div>

                  <div>
                    <label htmlFor="franchise-pan" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      PAN number (your password) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="franchise-pan"
                      value={panNumber}
                      onChange={(e) => {
                        setPanNumber(formatPAN(e.target.value));
                        setErrors((p) => ({ ...p, panNumber: undefined }));
                      }}
                      placeholder="ABCDE1234F"
                      autoComplete="off"
                      maxLength={10}
                      aria-describedby="franchise-pan-hint"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm uppercase tracking-wider text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                        errors.panNumber ? "border-red-400 bg-red-50/40" : "border-slate-300"
                      }`}
                    />
                    {errors.panNumber && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.panNumber}</p>}
                    <p id="franchise-pan-hint" className="mt-1 text-[11px] text-slate-400">
                      Your password is the PAN number used in your franchise application.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                  >
                    {submitting ? "Verifying…" : "Sign in"}
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setNotice({
                        tone: "info",
                        title: "Password reset",
                        body: `Your password is the PAN number from your franchise application. Write to ${FRANCHISE_EMAIL} if it needs to be re-issued.`,
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
                    Become a Franchisee →
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-center text-[11.5px] leading-relaxed text-slate-400">
                Looking to apply for a franchise instead?{" "}
                <Link to="/franchise" className="font-semibold text-(--brand-navy) hover:underline">
                  Go to the franchisee application
                </Link>
                . <br />
                Waiting for approval?{" "}
                <Link
                  to="/franchise-application-status"
                  className="font-semibold text-(--brand-navy) hover:underline"
                >
                  Check your franchise application status
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success confirmation — shown right after sign-in, before the dashboard opens. */}
      <Modal
        open={!!welcome}
        onClose={() => navigate("/franchisor-dashboard")}
        labelledBy="franchise-login-success"
        maxWidth="max-w-md"
      >
        <div className="flex items-start gap-3 px-5 pt-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 id="franchise-login-success" className="text-[15px] font-extrabold text-slate-800">
              Signed in successfully
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
              {welcome?.name ? `Welcome back, ${welcome.name}. ` : "Welcome back. "}
              Your franchisee dashboard is opening now — you can also continue to it right away.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end border-t border-slate-100 px-5 py-4">
          <Button
            size="md"
            onClick={() => navigate("/franchisor-dashboard")}
            style={{ background: "linear-gradient(135deg,var(--brand-navy),var(--brand-dark))" }}
          >
            Go to dashboard →
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default FranchiseLoginPage;
