import { EMAIL_REGEX, MOBILE_REGEX } from "../../utils/validation";
import Button from "../ui/Button";
import CodeBoxes from "../ui/CodeBoxes";
import { DateOfBirthPicker } from "../form/FormControls";
import { advanceOnEnter } from "../../utils/enterToNext";
import { Field, Select } from "./applicationModalFields";
import type { ApplicationModalForm } from "./useApplicationModalForm";

/** Step 1 — identity details, email/mobile OTP panels and the Continue action. */
const ApplicationDetailsStep = ({ form }: { form: ApplicationModalForm }) => {
  const {
    isLoginMode,
    productName,
    fullName,
    setFullName,
    mobile,
    handleMobileChange,
    email,
    handleEmailChange,
    dob,
    setDob,
    pan,
    setPan,
    cleanEmail,
    continent,
    selectContinent,
    country,
    setCountry,
    continentOptions,
    continentsLoading,
    countryOptions,
    countriesLoading,
    fieldErrors,
    setFieldErrors,
    emailVerified,
    emailOtp,
    setEmailOtp,
    emailOtpBusy,
    emailOtpError,
    setEmailOtpError,
    emailOtpNotice,
    emailOtpSent,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    mobileVerified,
    mobileOtp,
    setMobileOtp,
    mobileOtpBusy,
    mobileOtpError,
    setMobileOtpError,
    mobileOtpNotice,
    mobileOtpSent,
    handleSendMobileOtp,
    handleVerifyMobileOtp,
    detailsBusy,
    handleDetailsSubmit,
    handleClose,
  } = form;

  return (
    <form onSubmit={handleDetailsSubmit} onKeyDown={advanceOnEnter} className="space-y-3" noValidate>
      {/* Product selected on the home page — a sign-in has none. */}
      {!isLoginMode && (
        <div className="rounded-xl border border-(--brand-teal)/30 bg-(--brand-teal-14) px-4 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
          <p className="mt-0.5 flex items-center gap-2 text-sm font-bold text-slate-800">
            <svg className="h-4 w-4 shrink-0 text-(--brand-teal)" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {productName}
          </p>
        </div>
      )}

      {/* Applicant details — email and mobile each verify on the spot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {!isLoginMode && (
          <Field
            label="Full Name" type="text" name="fullName"
            value={fullName} onChange={(v) => { setFullName(v); setFieldErrors((p) => ({ ...p, fullName: "" })); }}
            placeholder="As per your PAN card" error={fieldErrors.fullName}
          />
        )}
        {!isLoginMode && (
          <div>
            <label htmlFor="apply-dob-day" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
              Date of Birth <span className="text-red-500 ml-0.5">*</span>
            </label>
            <DateOfBirthPicker
              id="apply-dob-day"
              value={dob}
              onChange={(v) => { setDob(v); setFieldErrors((p) => ({ ...p, dob: "" })); }}
              err={fieldErrors.dob}
            />
          </div>
        )}
        {!isLoginMode && (
          <>
            <div>
              <label htmlFor="apply-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                Email Address <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="flex items-start gap-2">
                <input
                  id="apply-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  placeholder="you@example.com"
                  disabled={emailVerified}
                  autoComplete="email"
                  className={`min-w-0 flex-1 px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal) disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${fieldErrors.email ? "border-red-400" : "border-(--form-field-border)"}`}
                />
                {emailVerified ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={emailOtpBusy === "send" || !EMAIL_REGEX.test(cleanEmail)}
                    className="shrink-0 cursor-pointer rounded-lg border border-(--brand-teal) bg-(--brand-teal-14) px-3 py-2.5 text-xs font-bold text-(--brand-navy) transition hover:bg-(--brand-teal-20) disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {emailOtpBusy === "send" ? "Sending…" : emailOtpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                )}
              </div>
              {emailOtpSent && (
                <div className="mt-2 space-y-2">
                  <CodeBoxes
                    idPrefix="apply-email-otp"
                    label="Email OTP"
                    value={emailOtp}
                    onChange={(v) => { setEmailOtp(v); setEmailOtpError(""); }}
                    invalid={Boolean(emailOtpError)}
                    disabled={emailOtpBusy === "verify"}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={emailOtpBusy === "verify" || emailOtp.length !== 6}
                    className="w-full cursor-pointer rounded-lg bg-(--brand-navy) px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {emailOtpBusy === "verify" ? "Verifying…" : "Verify Email"}
                  </button>
                </div>
              )}
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
              {emailOtpError && <p className="text-xs text-red-500 mt-1">{emailOtpError}</p>}
              {emailOtpNotice && !emailOtpError && <p className="mt-1 text-xs font-medium text-emerald-600">{emailOtpNotice}</p>}
            </div>
          </>
        )}

        {/* Mobile — the backend issues the code, entered right here */}
        <div className={isLoginMode ? "sm:col-span-2" : ""}>
          <label htmlFor="apply-mobile" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
            Mobile Number <span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="flex items-start gap-2">
            <input
              id="apply-mobile"
              type="tel"
              name="mobile"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              disabled={mobileVerified}
              onChange={(event) => handleMobileChange(event.target.value)}
              placeholder="10-digit mobile number"
              className={`min-w-0 flex-1 px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal) disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${fieldErrors.mobile ? "border-red-400" : "border-(--form-field-border)"}`}
            />
            {!isLoginMode && (mobileVerified ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendMobileOtp}
                disabled={mobileOtpBusy === "send" || !MOBILE_REGEX.test(mobile)}
                className="shrink-0 cursor-pointer rounded-lg border border-(--brand-teal) bg-(--brand-teal-14) px-3 py-2.5 text-xs font-bold text-(--brand-navy) transition hover:bg-(--brand-teal-20) disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mobileOtpBusy === "send" ? "Checking…" : mobileOtpSent ? "Resend OTP" : "Check number"}
              </button>
            ))}
          </div>
          {!isLoginMode && mobileOtpSent && (
            <div className="mt-2 space-y-2">
              <CodeBoxes
                idPrefix="apply-mobile-otp"
                label="Mobile OTP"
                value={mobileOtp}
                onChange={(v) => { setMobileOtp(v); setMobileOtpError(""); }}
                invalid={Boolean(mobileOtpError)}
                disabled={mobileOtpBusy === "verify"}
              />
              <button
                type="button"
                onClick={handleVerifyMobileOtp}
                disabled={mobileOtpBusy === "verify" || mobileOtp.length < 4}
                className="w-full cursor-pointer rounded-lg bg-(--brand-navy) px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mobileOtpBusy === "verify" ? "Verifying…" : "Verify Mobile"}
              </button>
            </div>
          )}
          {fieldErrors.mobile && <p className="text-xs text-red-500 mt-1">{fieldErrors.mobile}</p>}
          {mobileOtpError && <p className="text-xs text-red-500 mt-1">{mobileOtpError}</p>}
          {mobileOtpNotice && !mobileOtpError && <p className="mt-1 text-xs font-medium text-emerald-600">{mobileOtpNotice}</p>}
        </div>

        {!isLoginMode && (
          <>
            <Select
              label="Continent" name="continent"
              value={continent}
              options={continentOptions.map((c) => c.name)}
              placeholder={continentsLoading ? "Loading…" : "Select continent"}
              disabled={continentsLoading}
              onChange={selectContinent}
              error={fieldErrors.continent}
            />
            <Select
              label="Country" name="country"
              value={country}
              options={countryOptions.map((c) => c.name)}
              placeholder={
                !continent ? "Select a continent first" : countriesLoading ? "Loading…" : "Select country"
              }
              disabled={!continent || countriesLoading}
              onChange={(v) => { setCountry(v); setFieldErrors((p) => ({ ...p, country: "" })); }}
              error={fieldErrors.country}
            />
            <Field
              label="PAN Number" type="text" name="pan"
              value={pan}
              maxLength={10}
              onChange={setPan}
              placeholder="ABCDE1234F"
              error={fieldErrors.pan}
              extraCls="uppercase tracking-wider"
              containerCls="sm:col-span-2"
            />
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1 rounded-lg font-semibold"
          onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 rounded-lg font-semibold" loading={detailsBusy}>
          {detailsBusy ? "Sending OTP…" : "Continue →"}
        </Button>
      </div>
    </form>
  );
};

export default ApplicationDetailsStep;
