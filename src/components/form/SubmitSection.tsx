import type { ComponentProps } from "react";
import { THEME as C } from "../../constants/theme";
import { ConsentBlock } from "../ui/ConsentBlock";

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

/** Consent + submit block shared by loan and franchise submission forms. */
export const ConsentAndSubmit = (props: ComponentProps<typeof ConsentBlock>) => (
  <ConsentBlock {...props} />
);
