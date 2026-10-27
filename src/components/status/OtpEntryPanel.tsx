import Button from "../ui/Button";
import CodeBoxes from "../ui/CodeBoxes";

interface OtpEntryPanelProps {
  idPrefix: string;
  maskedMobile?: string;
  otp: string;
  onOtpChange: (value: string) => void;
  otpError?: string;
  apiError?: string;
  notice?: string;
  busy: boolean;
  resending: boolean;
  onVerify: (event: React.FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
  onChangeDetails: () => void;
  verifyLabel?: string;
}

const OtpEntryPanel = ({
  idPrefix,
  maskedMobile,
  otp,
  onOtpChange,
  otpError,
  apiError,
  notice,
  busy,
  resending,
  onVerify,
  onResend,
  onChangeDetails,
  verifyLabel = "Verify & view status",
}: OtpEntryPanelProps) => {
  const otpId = `${idPrefix}-otp`;
  const otpErrorId = `${otpId}-error`;

  return (
    <form onSubmit={onVerify} noValidate className="space-y-4">
      <div className="rounded-xl border border-(--brand-navy)/15 bg-(--brand-navy-14) px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-(--brand-navy)">OTP sent</p>
        <p className="mt-1 text-sm text-slate-600">
          Enter the code sent to{" "}
          <strong className="font-bold text-slate-800">{maskedMobile || "your registered mobile number"}</strong>.
        </p>
      </div>

      <div>
        <label htmlFor={`${otpId}-0`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700">
          One-time password <span className="ml-0.5 text-red-500">*</span>
        </label>
        <CodeBoxes
          idPrefix={otpId}
          label="One-time password"
          value={otp}
          onChange={onOtpChange}
          autoFocus
          disabled={busy}
          invalid={Boolean(otpError)}
          describedBy={otpError ? otpErrorId : undefined}
        />
        {otpError && (
          <p id={otpErrorId} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            {otpError}
          </p>
        )}
      </div>

      {apiError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {apiError}
        </p>
      )}
      {notice && !apiError && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
          {notice}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={busy}>
        {busy ? "Verifying…" : verifyLabel}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
        <button
          type="button"
          onClick={onResend}
          disabled={resending || busy}
          className="cursor-pointer rounded font-semibold text-(--brand-navy) hover:underline disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-(--brand-navy-44)"
        >
          {resending ? "Resending…" : "Resend OTP"}
        </button>
        <button
          type="button"
          onClick={onChangeDetails}
          disabled={busy}
          className="cursor-pointer rounded font-semibold text-slate-500 hover:text-slate-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Use different details
        </button>
      </div>
    </form>
  );
};

export default OtpEntryPanel;
