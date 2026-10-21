import { useState } from "react";
import {
  requestCustomerStatusOtp,
  verifyCustomerStatusOtp,
  type CustomerStatusApplication,
  type CustomerStatusResponse,
} from "../../api/statusTracking";
import { getApiErrorMessage } from "../../utils/apiError";
import { formatTimestamp, formatPAN } from "../../utils/formatters";
import { MOBILE_REGEX, PAN_REGEX } from "../../utils/validation";
import Button from "../ui/Button";
import { Field, TextField } from "../ui/FieldRenderer";
import OtpEntryPanel from "./OtpEntryPanel";
import { formatInr, statusTone, titleCase } from "./statusFormat";
import { Link } from "react-router-dom";
import { clearCredentials, readCredentials, saveCredentials } from "../../utils/credentialStorage";

const CUSTOMER_ID_REGEX = /^CUST\d{4,9}$/;
/** Longest customer ID the regex above accepts: "CUST" plus 9 digits. */
const CUSTOMER_ID_MAX_LENGTH = 13;

type Stage = "details" | "otp" | "result";

type FormErrors = {
  customerId?: string;
  panNumber?: string;
  mobile?: string;
  otp?: string;
};

const maskMobile = (mobile: string) =>
  mobile.length === 10 ? `${mobile.slice(0, 2)}******${mobile.slice(-2)}` : mobile;

const applicationName = (application: CustomerStatusApplication) =>
  application.productName?.trim() || titleCase(application.product) || "Loan application";

const applicationNumber = (application: CustomerStatusApplication) =>
  application.applicationNumber?.trim() || application.applicationNo?.trim() || application._id?.trim();

const submittedAt = (application: CustomerStatusApplication) =>
  application.submittedAt ?? application.createdAt;

// ── Stage: details ──────────────────────────────────────────────────────────

const CustomerStatusLookup = () => {
  const [stage, setStage] = useState<Stage>("details");
  // Continue where the visitor left off on this device, if anything was cached.
  // The cached values seed the initial state instead of being written during
  // render, so the first paint already shows them.
  const [storedSearch] = useState(() => readCredentials("customer-status"));
  const [customerId, setCustomerId] = useState(() => storedSearch?.customerId?.trim() ?? "");
  const [panNumber, setPanNumber] = useState(() => storedSearch?.pan?.trim() ?? "");
  const [mobile, setMobile] = useState(() => storedSearch?.mobile?.trim() ?? "");
  const [otp, setOtp] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [result, setResult] = useState<CustomerStatusResponse | null>(null);

  const clearError = (key: keyof FormErrors) =>
    setErrors((previous) => ({ ...previous, [key]: undefined }));

  const validateDetails = () => {
    const next: FormErrors = {};
    const id = customerId.trim().toUpperCase();
    if (!id) next.customerId = "Enter your customer ID";
    else if (!CUSTOMER_ID_REGEX.test(id)) next.customerId = "Enter a valid customer ID (e.g. CUST000001)";
    if (!PAN_REGEX.test(panNumber.trim().toUpperCase())) next.panNumber = "Enter a valid PAN number";
    if (!MOBILE_REGEX.test(mobile)) next.mobile = "Enter your registered 10-digit mobile number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const requestOtp = async (isResend = false) => {
    const setPending = isResend ? setResending : setBusy;
    setPending(true);
    setApiError("");
    setNotice("");
    try {
      const response = await requestCustomerStatusOtp({
        customerId: customerId.trim().toUpperCase(),
        panNumber: panNumber.trim().toUpperCase(),
        mobile,
      });
      if (!response.success) {
        setApiError(response.message || "We could not send the OTP for those details. Check them and try again.");
        return;
      }
      setMaskedMobile(response.mobileMasked?.trim() || maskMobile(mobile));
      setOtp("");
      setStage("otp");
      if (isResend) setNotice(response.message || "A new OTP has been sent.");
    } catch (error) {
      setApiError(
        getApiErrorMessage(
          error,
          "We could not send the OTP. Check the customer ID, PAN and mobile number, then try again.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateDetails()) return;
    // Persist only after the fields pass validation so stale/partial input is not cached.
    saveCredentials("customer-status", {
      customerId: customerId.trim().toUpperCase(),
      pan: panNumber.trim().toUpperCase(),
      mobile,
    });
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
      const response = await verifyCustomerStatusOtp({ mobile, otp });
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
    clearCredentials("customer-status");
  };

  const startOver = () => {
    setCustomerId("");
    setPanNumber("");
    setMobile("");
    setOtp("");
    setMaskedMobile("");
    setResult(null);
    setApiError("");
    setNotice("");
    setErrors({});
    setStage("details");
    clearCredentials("customer-status");
  };

  const onResultDismiss = () => {
    setResult(null);
    setStage("details");
    clearCredentials("customer-status");
  };

  if (stage === "result" && result) {
    const applications = result.applications ?? result.loans ?? [];
    const overall = result.customerStatus || result.status || "";
    const tone = statusTone(overall || (applications.length ? "Applications found" : "No applications found"));
    const customer = result.customer;
    const shownCustomerId = customer?.customerId || customerId.toUpperCase();

    return (
      <section aria-live="polite" className="mt-6 space-y-4">
        <div className="rounded-xl border border-(--brand-teal)/25 bg-(--brand-teal)/5 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer status</p>
              <h3 className="mt-1 text-xl font-extrabold text-(--brand-navy)">
                {customer?.name?.trim() || "Verified customer"}
              </h3>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.className}`}>{tone.label}</span>
          </div>

          <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-slate-200/70 pt-3 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-4 sm:block">
              <dt className="text-slate-500">Customer ID</dt>
              <dd className="font-semibold text-slate-700">{customer?.customerId || customerId.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:block">
              <dt className="text-slate-500">Registered mobile</dt>
              <dd className="font-semibold text-slate-700">{customer?.mobileMasked || maskedMobile || maskMobile(mobile)}</dd>
            </div>
            {formatTimestamp(result.appliedAt) && (
              <div className="flex justify-between gap-4 sm:block">
                <dt className="text-slate-500">First applied</dt>
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

          {/* The headline number of this screen: how many applications we found. */}
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-white/80 px-4 py-3 ring-1 ring-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Applications found</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {applications.length === 0
                  ? "Nothing submitted under this customer ID yet"
                  : `Under customer ID ${shownCustomerId}`}
              </p>
            </div>
            <span
              className="text-2xl font-extrabold leading-none text-(--brand-navy)"
              aria-label={`${applications.length} application${applications.length === 1 ? "" : "s"} found`}
            >
              {applications.length}
            </span>
          </div>
        </div>

        {applications.length > 0 ? (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Submitted applications</h4>
            <ul className="mt-2 space-y-2.5">
              {applications.map((application, index) => {
                const applicationTone = statusTone(application.status);
                const amount = formatInr(application.loanAmount);
                return (
                  <li
                    key={application._id || applicationNumber(application) || index}
                    className="rounded-xl border border-slate-200 bg-white p-3.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800">{applicationName(application)}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${applicationTone.className}`}>
                        {applicationTone.label}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
                      {applicationNumber(application) && (
                        <span>
                          App no. <strong className="font-semibold text-slate-700">{applicationNumber(application)}</strong>
                        </span>
                      )}
                      {amount && <span>Amount · {amount}</span>}
                      {formatTimestamp(submittedAt(application)) && (
                        <span>Applied · {formatTimestamp(submittedAt(application))}</span>
                      )}
                      {application.statusUpdatedAt && (
                        <span>Updated · {formatTimestamp(application.statusUpdatedAt)}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
            <p className="text-sm font-bold text-amber-900">No applications found</p>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              Nothing has been submitted under this customer ID yet. Apply for a loan first — your application will show
              up here as soon as it is filed.
            </p>
            <Link
              to="/"
              className="mt-3 inline-flex rounded-lg px-4 py-2 text-xs font-bold text-white transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-(--brand-teal-44)"
              style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
            >
              Apply for a loan →
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="md" onClick={startOver}>
            Check another customer
          </Button>
          <Button variant="ghost" size="md" onClick={onResultDismiss}>
            Change details
          </Button>
        </div>
      </section>
    );
  }

  // ── Mobile setter that also persists the latest valid mobile value ─────────
  const setMobileState = (next: string) => {
    const normalized = next.replace(/\D/g, "").slice(0, 10);
    setMobile(normalized);
    setErrors((previous) => ({ ...previous, mobile: undefined }));
    if (normalized) {
      saveCredentials("customer-status", { customerId, pan: panNumber, mobile: normalized });
    }
  };

  return (
    <section
      id="application-status"
      aria-labelledby="customer-status-title"
      className="mt-6 scroll-mt-28 rounded-2xl p-6 md:p-8"
      style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <div>
          <h2 id="customer-status-title" className="text-xl font-bold text-slate-800">
            Check Application Status
          </h2>
          <p className="text-[12.5px] text-slate-500">
            Verify your mobile number, then see the latest update on every application.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Search mode — always present so the row switcher keeps its shape */}
        <div className="flex items-center justify-center gap-1 text-[11.5px] text-slate-500">
          <span className="text-(--brand-navy) font-semibold">Search by</span>
          <span aria-hidden="true">·</span>
          <span>customer ID, PAN and mobile</span>
        </div>

        {stage === "details" ? (
          <form onSubmit={handleDetailsSubmit} noValidate className="mt-5 space-y-4">
            <Field id="customer-id" label="Customer ID" required error={errors.customerId}>
              <TextField
                id="customer-id"
                value={customerId}
                onChange={(value) => {
                  setCustomerId(value.toUpperCase().slice(0, CUSTOMER_ID_MAX_LENGTH));
                  clearError("customerId");
                }}
                placeholder="CUST000001"
                error={errors.customerId}
                maxLength={CUSTOMER_ID_MAX_LENGTH}
                autoComplete="organization"
              />
            </Field>

            <Field id="pan" label="PAN number" required error={errors.panNumber}>
              <TextField
                id="pan"
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

            <Field id="mobile" label="Registered mobile number" required error={errors.mobile}>
              <TextField
                id="mobile"
                value={mobile}
                onChange={setMobileState}
                placeholder="10-digit mobile number"
                error={errors.mobile}
                maxLength={10}
                inputMode="tel"
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
          <OtpEntryPanel
            idPrefix="customer-status"
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
        )}

        {/* Footer actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
          <button
            type="button"
            onClick={startOver}
            disabled={busy}
            className="cursor-pointer rounded font-semibold text-(--brand-navy) hover:underline disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44)"
          >
            Clear details
          </button>
          <div className="flex gap-3 text-slate-500">
            <a
              href={`mailto:contact@indexiafinance.com?subject=${encodeURIComponent("Application status help")}`}
              className="font-semibold text-(--brand-navy) hover:underline"
            >
              Not your mobile?
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/franchise-application-status"
              className="font-semibold text-(--brand-navy) hover:underline"
            >
              Franchise application status
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerStatusLookup;
