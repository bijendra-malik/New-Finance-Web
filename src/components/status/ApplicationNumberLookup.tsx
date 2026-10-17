import { useState } from "react";
import { fetchApplicationStatus, type ApplicationStatusResult } from "../../api/applicationStatus";
import { getApiErrorMessage } from "../../utils/apiError";
import { MOBILE_REGEX, PAN_REGEX } from "../../utils/validation";
import { formatTimestamp } from "../../utils/formatters";
import Button from "../ui/Button";
import { Field, TextField } from "../ui/FieldRenderer";

const ApplicationNumberLookup = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ApplicationStatusResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearError = (key: string) => setErrors((previous) => ({ ...previous, [key]: "" }));

  const checkStatus = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!applicationNumber.trim()) nextErrors.applicationNumber = "Enter your application number";
    if (!PAN_REGEX.test(panNumber.trim().toUpperCase())) nextErrors.panNumber = "Enter a valid PAN number";
    if (!MOBILE_REGEX.test(mobile)) nextErrors.mobile = "Enter a valid 10-digit mobile number";
    setErrors(nextErrors);
    setResult(null);
    setError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const status = await fetchApplicationStatus({
        applicationNumber: applicationNumber.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        mobile,
      });
      setResult(status);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "We couldn’t find an application with those details. Check them and try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-lg font-bold text-slate-800">Find with your application number</h3>
      <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">
        Use the application number printed on your submission receipt, with the PAN and mobile number
        you applied with.
      </p>

      <form onSubmit={checkStatus} noValidate className="mt-5 space-y-4">
        <Field id="status-application-number" label="Application number" required error={errors.applicationNumber}>
          <TextField
            id="status-application-number"
            value={applicationNumber}
            onChange={(value) => {
              setApplicationNumber(value);
              clearError("applicationNumber");
            }}
            placeholder="e.g. APP123456"
            error={errors.applicationNumber}
          />
        </Field>

        <Field id="status-application-pan" label="PAN number" required error={errors.panNumber}>
          <TextField
            id="status-application-pan"
            value={panNumber}
            onChange={(value) => {
              setPanNumber(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10));
              clearError("panNumber");
            }}
            placeholder="ABCDE1234F"
            error={errors.panNumber}
            maxLength={10}
            extraCls="uppercase tracking-wider"
          />
        </Field>

        <Field id="status-application-mobile" label="Mobile number" required error={errors.mobile}>
          <TextField
            id="status-application-mobile"
            value={mobile}
            onChange={(value) => {
              setMobile(value.replace(/\D/g, "").slice(0, 10));
              clearError("mobile");
            }}
            placeholder="10-digit registered number"
            error={errors.mobile}
            maxLength={10}
            inputMode="tel"
          />
        </Field>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? "Checking…" : "Check status"}
        </Button>
      </form>

      {result && (
        <section aria-live="polite" className="mt-6 rounded-xl border border-(--brand-teal)/25 bg-(--brand-teal)/5 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Application status</p>
              <h3 className="mt-1 text-xl font-extrabold text-(--brand-navy)">{result.status}</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              {result.productName || "Loan application"}
            </span>
          </div>
          <dl className="mt-4 space-y-2 border-t border-slate-200/70 pt-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Application number</dt>
              <dd className="font-semibold text-slate-700">{result.applicationNumber || applicationNumber}</dd>
            </div>
            {result.submittedAt && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Submitted</dt>
                <dd className="font-semibold text-slate-700">{formatTimestamp(result.submittedAt)}</dd>
              </div>
            )}
            {result.updatedAt && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Last updated</dt>
                <dd className="font-semibold text-slate-700">{formatTimestamp(result.updatedAt)}</dd>
              </div>
            )}
          </dl>
          {result.message && <p className="mt-3 text-sm leading-6 text-slate-600">{result.message}</p>}
        </section>
      )}
    </div>
  );
};

export default ApplicationNumberLookup;
