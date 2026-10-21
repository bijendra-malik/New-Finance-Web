import { useState } from "react";
import { Link } from "react-router-dom";
import {
  requestFranchiseStatusOtp,
  verifyFranchiseStatusOtp,
  type FranchiseStatusLookupResponse,
} from "../../api/statusTracking";
import { getApiErrorMessage } from "../../utils/apiError";
import { clearCredentials, readCredentials, saveCredentials } from "../../utils/credentialStorage";
import { formatTimestamp, formatPAN } from "../../utils/formatters";
import { MOBILE_REGEX, PAN_REGEX } from "../../utils/validation";
import Button from "../ui/Button";
import { Field, TextField } from "../ui/FieldRenderer";
import OtpEntryPanel from "../status/OtpEntryPanel";
import { statusTone } from "../status/statusFormat";
import FranchiseIcon from "./FranchiseIcon";
import { FRANCHISE_EMAIL } from "./franchiseData";

type Stage = "details" | "otp" | "result";

const maskMobile = (mobile: string) =>
  mobile.length === 10 ? `${mobile.slice(0, 2)}******${mobile.slice(-2)}` : mobile;

const FranchiseStatusCheck = () => {
  const [stage, setStage] = useState<Stage>("details");
  // Details verified for this flow earlier on this device, so they do not have
  // to be retyped. The OTP is still required every time.
  const [stored] = useState(() => readCredentials("franchise-status"));
  const [mobile, setMobile] = useState(() => stored?.mobile ?? "");
  const [panNumber, setPanNumber] = useState(() => stored?.pan ?? "");
  const [otp, setOtp] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [result, setResult] = useState<FranchiseStatusLookupResponse | null>(null);

  const clearError = (key: string) => setErrors((previous) => ({ ...previous, [key]: "" }));

  const validateDetails = () => {
    const next: Record<string, string> = {};
    if (!MOBILE_REGEX.test(mobile)) next.mobile = "Enter the mobile number used in your application";
    if (!PAN_REGEX.test(panNumber.trim().toUpperCase())) next.panNumber = "Enter a valid PAN number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const requestOtp = async (isResend = false) => {
    const setPending = isResend ? setResending : setBusy;
    setPending(true);
    setApiError("");
    setNotice("");
    try {
      const response = await requestFranchiseStatusOtp({
        mobile,
        panNumber: panNumber.trim().toUpperCase(),
      });
      if (!response.success) {
        setApiError(response.message || "We could not send the OTP for those details. Check them and try again.");
        return;
      }
      saveCredentials("franchise-status", { mobile, pan: panNumber.trim().toUpperCase() });
      setMaskedMobile(response.mobileMasked?.trim() || maskMobile(mobile));
      setOtp("");
      setStage("otp");
      if (isResend) setNotice(response.message || "A new OTP has been sent.");
    } catch (error) {
      setApiError(
        getApiErrorMessage(
          error,
          "We could not send the OTP. Check the mobile number and PAN used in your application, then try again.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateDetails()) return;
    void requestOtp(false);
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setErrors((previous) => ({ ...previous, otp: "Enter the 6-digit OTP sent to your mobile" }));
      return;
    }
    setBusy(true);
    setApiError("");
    setNotice("");
    try {
      const response = await verifyFranchiseStatusOtp({ mobile, otp });
      if (!response.success) {
        setApiError(response.message || "The OTP was not accepted. Check it and try again.");
        return;
      }
      setResult(response);
      setStage("result");
    } catch (error) {
      setApiError(getApiErrorMessage(error, "We could not verify that OTP. Request a new one and try again."));
    } finally {
      setBusy(false);
    }
  };

  const changeDetails = () => {
    setStage("details");
    setOtp("");
    setApiError("");
    setNotice("");
    setErrors({});
  };

  const startOver = () => {
    clearCredentials("franchise-status");
    setMobile("");
    setPanNumber("");
    setOtp("");
    setMaskedMobile("");
    setResult(null);
    setApiError("");
    setNotice("");
    setErrors({});
    setStage("details");
  };

  const tone = statusTone(result?.franchiseStatus);
  const franchiseId = result?.franchise?.franchiseId?.trim() || result?.franchise?.franchiseeCode?.trim();

  return (
    <section
      id="application-status"
      aria-labelledby="franchise-status-title"
      className="mt-6 scroll-mt-28 rounded-2xl p-6 md:p-8"
      style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
        >
          <FranchiseIcon name="search" filled className="h-5 w-5" />
        </span>
        <div>
          <h2 id="franchise-status-title" className="text-xl font-bold text-slate-800">
            Franchise Application Status
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Already applied? Track it here — no portal login needed.
          </p>
        </div>
      </div>

      {stage === "result" && result ? (
        <div aria-live="polite" className="mt-5 space-y-4">
          <div className="rounded-xl border border-(--brand-teal)/25 bg-(--brand-teal)/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Application status</p>
                <h3 className="mt-1 text-xl font-extrabold text-(--brand-navy)">
                  {result.franchise?.name?.trim() || "Franchise application"}
                </h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.className}`}>{tone.label}</span>
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-slate-200/70 pt-3 text-sm sm:grid-cols-2">
              {franchiseId && (
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-slate-500">Franchisee ID</dt>
                  <dd className="font-semibold text-slate-700">{franchiseId}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-slate-500">Registered mobile</dt>
                <dd className="font-semibold text-slate-700">
                  {result.franchise?.mobileMasked || maskedMobile || maskMobile(mobile)}
                </dd>
              </div>
              {formatTimestamp(result.appliedAt) && (
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-slate-500">Applied on</dt>
                  <dd className="font-semibold text-slate-700">{formatTimestamp(result.appliedAt)}</dd>
                </div>
              )}
              {formatTimestamp(result.updatedAt) && (
                <div className="flex justify-between gap-4 sm:block">
                  <dt className="text-slate-500">Last updated</dt>
                  <dd className="font-semibold text-slate-700">{formatTimestamp(result.updatedAt)}</dd>
                </div>
              )}
            </dl>

            {result.message && <p className="mt-3 text-sm leading-6 text-slate-600">{result.message}</p>}
          </div>

          {result.canLogin ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              Your franchisee access is active. Sign in above with your franchisee ID and registered mobile number.
            </p>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              Portal sign-in opens once your application is approved. If your details need a correction,
              write to{" "}
              <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-(--brand-navy) hover:underline">
                {FRANCHISE_EMAIL}
              </a>
              .
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="md" onClick={startOver}>
              Check another application
            </Button>
            <Link to="/franchise" className="text-[12.5px] font-semibold text-(--brand-navy) hover:underline">
              Back to the franchise page →
            </Link>
          </div>
        </div>
      ) : stage === "details" ? (
        <form onSubmit={handleDetailsSubmit} noValidate className="mt-5 space-y-4">
          <p className="text-[12.5px] leading-relaxed text-slate-500">
            Enter the mobile number and PAN used in your franchise application. We will send an OTP to
            that mobile before showing the status.
          </p>

          <Field id="franchise-status-mobile" label="Registered mobile number" required error={errors.mobile}>
            <TextField
              id="franchise-status-mobile"
              value={mobile}
              onChange={(value) => {
                setMobile(value.replace(/\D/g, "").slice(0, 10));
                clearError("mobile");
              }}
              placeholder="10-digit mobile number"
              error={errors.mobile}
              maxLength={10}
              inputMode="tel"
            />
          </Field>

          <Field id="franchise-status-pan" label="PAN number" required error={errors.panNumber}>
            <TextField
              id="franchise-status-pan"
              value={panNumber}
              onChange={(value) => {
                setPanNumber(formatPAN(value));
                clearError("panNumber");
              }}
              placeholder="ABCDE1234F"
              error={errors.panNumber}
              maxLength={10}
              extraCls="uppercase tracking-wider"
            />
          </Field>

          {apiError && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              {apiError}
            </p>
          )}

          <Button type="submit" size="lg" fullWidth loading={busy}>
            {busy ? "Sending OTP…" : "Send OTP"}
          </Button>
        </form>
      ) : (
        <div className="mt-5">
          <OtpEntryPanel
            idPrefix="franchise-status"
            maskedMobile={maskedMobile}
            otp={otp}
            onOtpChange={(value) => {
              setOtp(value);
              clearError("otp");
            }}
            otpError={errors.otp}
            apiError={apiError}
            notice={notice}
            busy={busy}
            resending={resending}
            onVerify={handleVerify}
            onResend={() => void requestOtp(true)}
            onChangeDetails={changeDetails}
          />
        </div>
      )}
    </section>
  );
};

export default FranchiseStatusCheck;
