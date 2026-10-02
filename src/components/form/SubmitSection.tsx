import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from "../../constants/legalLinks";
import { THEME as C } from "../../constants/theme";
import { FORM } from "../../constants/formStyles";

/** Green bar at the top of the receipt view with a "back to form" action. */
export const SubmittedReceiptBanner = ({ onBack }: { onBack: () => void }) => (
  <div className="rounded-2xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: C.teal14, border: `1px solid ${C.teal33}` }}>
    <p className="text-sm font-bold" style={{ color: C.dark }}>✓ Application submitted successfully</p>
    <button type="button" onClick={onBack}
      className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition-all hover:opacity-90"
      style={{ background: C.navy }}>
      ← Back to Application Form
    </button>
  </div>
);

/** Bar above the form while an application is submitted — links to the receipt. */
export const SubmittedFormBanner = ({ refNo, onViewReceipt }: { refNo: string; onViewReceipt: () => void }) => (
  <div className="mb-6 rounded-2xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: C.teal14, border: `1px solid ${C.teal33}` }}>
    <div>
      <p className="text-sm font-bold" style={{ color: C.dark }}>✓ Application submitted — Ref No. {refNo}</p>
      <p className="text-xs mt-0.5" style={{ color: C.gray }}>Your details are saved and shown below.</p>
    </div>
    <button type="button" onClick={onViewReceipt}
      className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition-all hover:opacity-90"
      style={{ background: C.navy }}>
      View Receipt
    </button>
  </div>
);

/** Primary submit button — disabled while sending or once already submitted. */
export const SubmitApplicationButton = ({ isSubmitting, submitted }: { isSubmitting: boolean; submitted: boolean }) => (
  <button type="submit" disabled={isSubmitting || submitted}
    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-90"
    style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.navy})` }}>
    {isSubmitting ? (
      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>Submitting...</>
    ) : submitted ? "✓ Application Already Submitted" : "✓ Submit Application"}
  </button>
);

interface ConsentAndSubmitProps {
  agreed: boolean;
  onAgreedChange: (next: boolean) => void;
  apiError?: string;
  submitAttempted?: boolean;
  invalidCount?: number;
  isSubmitting?: boolean;
  submitted?: boolean;
}

export const ConsentAndSubmit = ({
  agreed, onAgreedChange, apiError = "", submitAttempted = false, invalidCount = 0, isSubmitting = false, submitted = false,
}: ConsentAndSubmitProps) => (
  <>
    <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
      <input type="checkbox" checked={agreed} onChange={e=>onAgreedChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded shrink-0" style={{accentColor:C.teal}}/>
      <span className="text-xs" style={{color:C.gray}}>
        By continuing, you agree to Indexia Finance <a href={TERMS_OF_USE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{color:C.navy}}>Terms of Use</a> and <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{color:C.navy}}>Privacy Policy</a>.
      </span>
    </label>

    {(apiError||(submitAttempted&&invalidCount>0))&&(
      <div className="rounded-(--form-field-radius) px-4 py-3 text-sm flex gap-2 items-start mb-5" style={{background:FORM.errorBg,border:`1px solid ${FORM.errorBorder}`,color:FORM.errorText}}>
        <span className="shrink-0 mt-0.5">⚠️</span>
        {apiError||`${invalidCount} field${invalidCount===1?" is":"s are"} invalid — fix the highlighted fields to submit.`}
      </div>
    )}

    <SubmitApplicationButton isSubmitting={isSubmitting} submitted={submitted} />
  </>
);
