import { THEME as C } from "../../constants/theme";

/** Headline + mandatory-field note shown above every application form. */
const FormPageHeader = ({ headline }: { headline: string }) => (
  <div className="mb-6">
    <h1 className="text-xl font-bold" style={{ color: C.dark }}>{headline}</h1>
    <p className="text-xs mt-1.5" style={{ color: C.gray }}>
      Fields with asterisk mark (*) are mandatory. All amounts should be entered in INR (₹).
    </p>
  </div>
);

export default FormPageHeader;
