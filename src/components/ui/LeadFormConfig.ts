// LeadFormConfig — shared field-configuration shape + tiny validators.

export interface LeadFieldConfig {
  half: boolean;
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "select" | "textarea";
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  full?: boolean;
}

/** Minimal validators reused by every generic enquiry / lead form. */
export const validateTel = (v: string): string | undefined =>
  v && !/^\d{10}$/.test(v) ? "Enter a valid 10-digit number" : undefined;

export const validateEmail = (v: string): string | undefined =>
  v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : undefined;

export const missing = (v: unknown): boolean => !v || !(v as string).trim();
