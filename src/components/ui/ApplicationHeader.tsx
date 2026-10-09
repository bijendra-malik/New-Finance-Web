// ApplicationHeader — headline + mandatory-field note shown above every
// application form. Extracted so loan and franchise forms share one header
// instead of re-declaring the same two-line block.

import { THEME as C } from "../../constants/theme";

interface ApplicationHeaderProps {
  headline: string;
  currencyNote?: boolean;
}

export const ApplicationHeader = ({ headline, currencyNote = true }: ApplicationHeaderProps) => (
  <div className="mb-6">
    <h1 className="text-xl font-bold" style={{ color: C.dark }}>{headline}</h1>
    <p className="text-xs mt-1.5" style={{ color: C.gray }}>
      Fields marked with * are mandatory.
      {currencyNote && <> All amounts should be entered in INR (&nbsp;₹&nbsp;).</>}
    </p>
  </div>
);

export default ApplicationHeader;
