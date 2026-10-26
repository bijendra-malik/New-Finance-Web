import PageBanner from "../components/common/PageBanner";
import CustomerApplications from "../components/status/CustomerApplications";
import OtpEntryPanel from "../components/status/OtpEntryPanel";
import Button from "../components/ui/Button";
import { Field, TextField } from "../components/ui/FieldRenderer";
import { useCustomerStatusCheck } from "../hooks/useCustomerStatusCheck";
import useSEO from "../hooks/useSEO";
import { formatPAN } from "../utils/formatters";

const MyApplicationsPage = () => {
  useSEO({
    title: "My Applications",
    description:
      "Track every loan application you have submitted with Indexia Finance — its stage, timeline and the details you filed, verified by OTP.",
    path: "/applications",
  });

  const check = useCustomerStatusCheck();
  const { stage, missing } = check;

  const identityRows = [
    { label: "Customer ID", value: check.customerId },
    { label: "PAN number", value: check.panNumber },
    { label: "Registered mobile", value: check.mobile ? `+91 ${check.mobile}` : "" },
  ];

  return (
    <>
      <PageBanner
        breadcrumb="My Applications"
        title="My"
        highlight="Applications"
        tagline="Every application you have filed, with its live status and the details you submitted"
      />

      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-8">
          {stage === "result" && check.result ? (
            <CustomerApplications result={check.result} onCheckAgain={check.checkAgain} />
          ) : (
            <section
              aria-labelledby="my-applications-title"
              className="rounded-2xl p-6 md:p-8"
              style={{ border: "1px solid rgba(6,106,156,0.12)", boxShadow: "0 2px 16px rgba(6,106,156,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg,var(--brand-teal),var(--brand-navy))" }}
                  aria-hidden="true"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                </span>
                <div>
                  <h2 id="my-applications-title" className="text-xl font-bold text-slate-800">
                    {stage === "otp" ? "Verify your mobile number" : "Show my applications"}
                  </h2>
                  <p className="text-[12.5px] text-slate-500">
                    Your details are filled in from your account — verify with the OTP sent to your mobile.
                  </p>
                </div>
              </div>

              {stage === "verify" ? (
                <div className="mt-6 space-y-5">
                  {check.needsManualEntry ? (
                    <div className="space-y-4">
                      <p className="text-[12.5px] leading-6 text-slate-500">
                        Confirm the details we should look your applications up by.
                      </p>
                      {missing.customerId && (
                        <Field id="status-customer-id" label="Customer ID" required error={check.errors.customerId}>
                          <TextField
                            id="status-customer-id"
                            value={check.customerId}
                            onChange={(value) => {
                              check.setCustomerId(value.toUpperCase());
                              check.clearError("customerId");
                            }}
                            placeholder="Your customer ID"
                            error={check.errors.customerId}
                          />
                        </Field>
                      )}
                      {missing.panNumber && (
                        <Field id="status-pan" label="PAN number" required error={check.errors.panNumber}>
                          <TextField
                            id="status-pan"
                            value={check.panNumber}
                            onChange={(value) => {
                              check.setPanNumber(formatPAN(value));
                              check.clearError("panNumber");
                            }}
                            placeholder="ABCDE1234F"
                            error={check.errors.panNumber}
                            maxLength={10}
                            extraCls="uppercase tracking-wider"
                          />
                        </Field>
                      )}
                      {missing.mobile && (
                        <Field id="status-mobile" label="Registered mobile number" required error={check.errors.mobile}>
                          <TextField
                            id="status-mobile"
                            value={check.mobile}
                            onChange={(value) => {
                              check.setMobile(value.replace(/\D/g, "").slice(0, 10));
                              check.clearError("mobile");
                            }}
                            placeholder="10-digit mobile number"
                            error={check.errors.mobile}
                            maxLength={10}
                            inputMode="tel"
                          />
                        </Field>
                      )}
                    </div>
                  ) : (
                    <dl className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2">
                      {identityRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-baseline justify-between gap-4 border-b border-slate-200/70 py-2.5 last:border-0"
                        >
                          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{row.label}</dt>
                          <dd className="min-w-0 text-right text-[13px] font-bold text-slate-700 wrap-anywhere">
                            {row.value || "—"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {check.apiError && (
                    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                      {check.apiError}
                    </p>
                  )}

                  <Button size="lg" fullWidth loading={check.busy} onClick={() => void check.requestOtp(false)}>
                    {check.busy ? "Sending OTP…" : "Send OTP & show my applications"}
                  </Button>

                  <p className="text-[12px] leading-5 text-slate-500">
                    🔒 These details come from your registration and are locked. We send a one-time
                    password to your registered mobile before showing your applications.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <OtpEntryPanel
                    idPrefix="my-applications"
                    maskedMobile={check.otpMaskedMobile}
                    otp={check.otp}
                    onOtpChange={(value) => {
                      check.setOtp(value);
                      check.clearError("otp");
                    }}
                    otpError={check.errors.otp}
                    apiError={check.apiError}
                    notice={check.notice}
                    busy={check.busy}
                    resending={check.resending}
                    onVerify={check.verifyOtp}
                    onResend={() => void check.requestOtp(true)}
                    onChangeDetails={check.editDetails}
                    verifyLabel="Verify & show my applications"
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default MyApplicationsPage;
