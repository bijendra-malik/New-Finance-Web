// Headline + mandatory-field note shared by loan and franchise forms.

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
