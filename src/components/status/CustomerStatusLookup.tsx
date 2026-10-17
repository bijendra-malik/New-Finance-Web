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

const CUSTOMER_ID_REGEX = /^CUST\d{4,9}$/;

type Stage = "details" | "otp" | "result";

const maskMobile = (mobile: string) =>
  mobile.length === 10 ? `${mobile.slice(0, 2)}******${mobile.slice(-2)}` : mobile;

const applicationName = (application: CustomerStatusApplication) =>
  application.productName?.trim() || titleCase(application.product) || "Loan application";

const applicationNumber = (application: CustomerStatusApplication) =>
  application.applicationNumber?.trim() || application.applicationNo?.trim() || application._id?.trim();

const submittedAt = (application: CustomerStatusApplication) =>
  application.submittedAt ?? application.createdAt;

const CustomerStatusLookup = () => {
  const [stage, setStage] = useState<Stage>("details");
  const [customerId, setCustomerId] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [result, setResult] = useState<CustomerStatusResponse | null>(null);

  const clearError = (key: string) =>
    setErrors((previous) => ({ ...previous, [key]: "" }));

  const validateDetails = () => {
    const next: Record<string, string> = {};
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
  };

  if (stage === "result" && result) {
    const applications = result.applications ?? result.loans ?? [];
    const overall = result.customerStatus || result.status || "";
    const tone = statusTone(overall || (applications.length ? "Applications found" : "No applications found"));
    const customer = result.customer;

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
        </div>

        {applications.length > 0 ? (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Applications on this customer ID
            </h4>
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
                      {amount && (
                        <span>
                          Amount <strong className="font-semibold text-slate-700">{amount}</strong>
                        </span>
                      )}
                      {formatTimestamp(submittedAt(application)) && (
                        <span>Submitted {formatTimestamp(submittedAt(application))}</span>
                      )}
                      {formatTimestamp(application.updatedAt) && (
                        <span>Updated {formatTimestamp(application.updatedAt)}</span>
                      )}
                    </div>
                    {application.message && <p className="mt-1.5 text-[12.5px] leading-5 text-slate-600">{application.message}</p>}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            Your mobile was verified, but no loan applications are linked to this customer ID yet. If you
            have just submitted one, check again after a short while.
          </p>
        )}

        <Button variant="outline" size="md" onClick={startOver}>
          Check another application
        </Button>
      </section>
    );
  }

  return (
    <div className="mt-5">
      {stage === "details" ? (
        <form onSubmit={handleDetailsSubmit} noValidate className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Find with your customer ID</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">
              Use the customer ID issued with your application. We will send an OTP to your registered
              mobile number to confirm it is you.
            </p>
          </div>

          <Field id="customer-status-id" label="Customer ID" required error={errors.customerId}>
            <TextField
              id="customer-status-id"
              value={customerId}
              onChange={(value) => {
                setCustomerId(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 13));
                clearError("customerId");
              }}
              placeholder="CUST000001"
              error={errors.customerId}
              maxLength={13}
              extraCls="tracking-wider"
            />
          </Field>

          <Field id="customer-status-pan" label="PAN number" required error={errors.panNumber}>
            <TextField
              id="customer-status-pan"
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

          <Field
            id="customer-status-mobile"
            label="Registered mobile number"
            required
            error={errors.mobile}
            hint="The 10-digit number used when you applied."
          >
            <TextField
              id="customer-status-mobile"
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
    </div>
  );
};

export default CustomerStatusLookup;
