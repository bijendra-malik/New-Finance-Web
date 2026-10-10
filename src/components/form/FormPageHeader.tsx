import { THEME as C } from "../../constants/theme";

// Section heading, not the page title — the dashboard shell or the host page owns the H1.
const FormPageHeader = ({ headline }: { headline: string }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold" style={{ color: C.dark }}>{headline}</h2>
    <p className="text-xs mt-1.5" style={{ color: C.gray }}>
      Fields with asterisk mark (*) are mandatory. All amounts should be entered in INR (₹).
    </p>
  </div>
);

export default FormPageHeader;
