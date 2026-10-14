import { useState } from "react";
import PageBanner from "../components/common/PageBanner";
import { fetchApplicationStatus, type ApplicationStatusResult } from "../api/applicationStatus";
import { getApiErrorMessage } from "../utils/apiError";
import { MOBILE_REGEX, PAN_REGEX } from "../utils/validation";
import { formatTimestamp } from "../utils/formatters";
import useSEO from "../hooks/useSEO";

const ApplicationStatusPage = () => {
  useSEO({
    title: "Check Application Status",
    description: "Check your Indexia Finance application status using your application number, PAN and mobile number.",
    path: "/application-status",
  });

  const [applicationNumber, setApplicationNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ApplicationStatusResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(getApiErrorMessage(err, "We couldn’t find an application with those details. Check them and try again."));
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string) => setErrors((previous) => ({ ...previous, [key]: "" }));

  return (
    <>
      <PageBanner
        breadcrumb="Check Application Status"
        title="Track your"
        highlight="Application"
        tagline="Enter the details used when you applied to see the latest update."
      />
      <section className="bg-slate-50 px-5 py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand-teal)">Application support</p>
            <h1 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-(--brand-navy) md:text-4xl">
              Your application, with a clear next step.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              Use your application number, PAN and registered mobile number. These details help us show the right application securely.
            </p>
            <div className="mt-7 border-l-2 border-(--brand-teal) pl-4 text-sm leading-6 text-slate-500">
              Your application number is shown on the receipt you received after submitting the form.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-slate-800">Find an application</h2>
            <p className="mt-1 text-sm text-slate-500">All three details are required.</p>
            <form onSubmit={checkStatus} className="mt-6 space-y-4" noValidate>
              <label className="block text-sm font-semibold text-slate-700">
                Application number
                <input
                  value={applicationNumber}
                  onChange={(event) => { setApplicationNumber(event.target.value); update("applicationNumber"); }}
                  autoComplete="off"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-(--brand-teal) focus:ring-2 focus:ring-(--brand-teal)/20"
                  placeholder="e.g. APP123456"
                  aria-invalid={Boolean(errors.applicationNumber)}
                />
                {errors.applicationNumber && <span className="mt-1 block text-xs text-red-600">{errors.applicationNumber}</span>}
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                PAN number
                <input
                  value={panNumber}
                  onChange={(event) => { setPanNumber(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)); update("panNumber"); }}
                  autoComplete="off"
                  maxLength={10}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm uppercase tracking-wider outline-none transition focus:border-(--brand-teal) focus:ring-2 focus:ring-(--brand-teal)/20"
                  placeholder="ABCDE1234F"
                  aria-invalid={Boolean(errors.panNumber)}
                />
                {errors.panNumber && <span className="mt-1 block text-xs text-red-600">{errors.panNumber}</span>}
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Mobile number
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(event) => { setMobile(event.target.value.replace(/\D/g, "").slice(0, 10)); update("mobile"); }}
                  autoComplete="tel-national"
                  maxLength={10}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none transition focus:border-(--brand-teal) focus:ring-2 focus:ring-(--brand-teal)/20"
                  placeholder="10-digit registered number"
                  aria-invalid={Boolean(errors.mobile)}
                />
                {errors.mobile && <span className="mt-1 block text-xs text-red-600">{errors.mobile}</span>}
              </label>
              {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-lg bg-(--brand-navy) px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal) focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Checking…" : "Check status"}
              </button>
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
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Application number</dt><dd className="font-semibold text-slate-700">{result.applicationNumber || applicationNumber}</dd></div>
                  {result.submittedAt && <div className="flex justify-between gap-4"><dt className="text-slate-500">Submitted</dt><dd className="font-semibold text-slate-700">{formatTimestamp(result.submittedAt)}</dd></div>}
                  {result.updatedAt && <div className="flex justify-between gap-4"><dt className="text-slate-500">Last updated</dt><dd className="font-semibold text-slate-700">{formatTimestamp(result.updatedAt)}</dd></div>}
                </dl>
                {result.message && <p className="mt-3 text-sm leading-6 text-slate-600">{result.message}</p>}
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplicationStatusPage;
