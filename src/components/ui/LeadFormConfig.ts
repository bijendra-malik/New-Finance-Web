// Shared field-configuration shape + tiny validators.
export interface LeadFieldConfig {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "select" | "textarea";
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  /** Set to false to make the field span both columns of the form grid. */
  half?: boolean;
}

export const validateTel = (v: string): string | undefined =>
  v && !/^\d{10}$/.test(v) ? "Enter a valid 10-digit number" : undefined;

export const validateEmail = (v: string): string | undefined =>
  v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : undefined;
