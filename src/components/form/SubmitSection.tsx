import type { ComponentProps } from "react";
import { ConsentBlock } from "../ui/ConsentBlock";

/** Consent + submit block shared by loan and franchise submission forms. */
export const ConsentAndSubmit = (props: ComponentProps<typeof ConsentBlock>) => (
  <ConsentBlock {...props} />
);
