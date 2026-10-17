import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageBanner from "../components/common/PageBanner";
import FranchiseStatusCheck from "../components/franchise/FranchiseStatusCheck";
import Button from "../components/ui/Button";
import FranchiseIcon from "../components/franchise/FranchiseIcon";
import { FRANCHISE_EMAIL } from "../components/franchise/franchiseData";
import { verifyFranchiseOTP } from "../api/franchise";
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
    "Portal credentials are issued with your franchise agreement and plan. " +
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
  const { hash } = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [hash]);
  const [franchiseId, setFranchiseId] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [errors, setErrors] = useState<{ franchiseId?: string; mobile?: string; otp?: string }>({});
  const [notice, setNotice] = useState<Notice>(DEFAULT_NOTICE);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (ev: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    const e: { franchiseId?: string; mobile?: string; otp?: string } = {};
    const normalizedFranchiseId = franchiseId.trim().toUpperCase();
    const normalizedMobile = mobile.replace(/\D/g, "").slice(-10);

    if (!/^FRN\d{6}$/.test(normalizedFranchiseId)) e.franchiseId = "Enter the franchisee ID from your agreement (e.g. FRN000003)";
    if (!/^\d{10}$/.test(normalizedMobile)) e.mobile = "Enter your registered 10-digit mobile number";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (!otpVisible) {
      setOtpVisible(true);
      setNotice({
        tone: "info",
        title: "Enter your OTP",
        body: "Enter the OTP sent to your registered mobile number to continue.",
      });
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "Enter the 6-digit OTP sent to your mobile" });
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const res = await verifyFranchiseOTP({ mobile: normalizedMobile, otp });
      if (!res.success || !res.token) {
        setNotice({
          tone: "warn",
          title: "Sign-in failed",
          body: res.message || `These credentials were not accepted. Write to ${FRANCHISE_EMAIL} if your credentials need to be re-issued.`,
        });
        return;
      }
      const status = (res.user?.franchiseStatus ?? "").trim().toLowerCase();
      if (status === "rejected") {
        clearFranchiseSession();
        setNotice({
          tone: "error",
          title: "Franchisee login is locked",
          body: `Your franchise application was not approved. Contact ${FRANCHISE_EMAIL} if you would like to discuss your application.`,
        });
        return;
      }
      const responseFranchiseId = res.franchiseId ?? res.user?.franchiseId;
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
          body: "The franchisee ID does not match this mobile number. Check both details and try again.",
        });
        return;
      }
      saveFranchiseSession(
        {
          franchiseId: responseFranchiseId,
          franchiseStatus: res.user?.franchiseStatus,
          isVerified: res.user?.isVerified,
        },
        res.token,
      );
      login(res.token, {
        _id: res.user?._id ?? responseFranchiseId,
        name: res.user?.name ?? "",
        mobile: res.user?.mobile ?? normalizedMobile,
        email: res.user?.email ?? "",
        isVerified: res.user?.isVerified ?? true,
        isActive: res.user?.isActive ?? true,
        continent: res.user?.continent,
        country: res.user?.country,
        lastLogin: res.user?.lastLogin ?? "",
        createdAt: res.user?.createdAt ?? "",
        updatedAt: res.user?.updatedAt ?? "",
      });

      navigate("/franchisor-dashboard");
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
                    <label htmlFor="franchise-mobile" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      Registered mobile number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="franchise-mobile"
                      type="tel"
                      inputMode="numeric"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setErrors((p) => ({ ...p, mobile: undefined }));
                      }}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      aria-describedby="franchise-mobile-hint"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                        errors.mobile ? "border-red-400 bg-red-50/40" : "border-slate-300"
                      }`}
                    />
                    {errors.mobile && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.mobile}</p>}
                    <p id="franchise-mobile-hint" className="mt-1 text-[11px] text-slate-400">
                      Use the mobile number provided in your franchise application.
                    </p>
                  </div>

                  {otpVisible && <div>
                    <label htmlFor="franchise-otp" className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                      OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="franchise-otp"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setErrors((p) => ({ ...p, otp: undefined }));
                      }}
                      placeholder="6-digit OTP"
                      autoComplete="one-time-code"
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-(--brand-navy) ${
                        errors.otp ? "border-red-400 bg-red-50/40" : "border-slate-300"
                      }`}
                    />
                    {errors.otp && <p className="mt-1 text-[11.5px] font-medium text-red-500">{errors.otp}</p>}
                  </div>}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    style={{ background: "linear-gradient(135deg,var(--brand-navy) 0%,var(--brand-dark) 100%)" }}
                  >
                    {submitting ? "Verifying…" : otpVisible ? "Verify & continue" : "Continue"}
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
                    Become a Franchisee →
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

              <FranchiseStatusCheck />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FranchiseLoginPage;
