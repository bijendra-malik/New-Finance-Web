// Shared field-configuration shape + tiny validators.
import { EMAIL_REGEX, MOBILE_REGEX } from "../../utils/validation";

export interface LeadFieldConfig {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "select" | "textarea";
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  /** Minimum number of characters allowed (validated on submit — e.g. textarea messages). */
  minLength?: number;
  /** Set to false to make the field span both columns of the form grid. */
  half?: boolean;
}

export const validateTel = (v: string): string | undefined =>
  v && !MOBILE_REGEX.test(v) ? "Enter a valid 10-digit number" : undefined;

export const validateEmail = (v: string): string | undefined =>
  v && !EMAIL_REGEX.test(v) ? "Enter a valid email" : undefined;
