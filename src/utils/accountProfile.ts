export type Role = "Customer" | "Franchise";

export interface AccountProfile {
  name: string;
  role: Role;
  country: string;
  countryIso: string;
  phone: string;
  email: string;
  dob?: string;
  pan?: string;
}

export type LockableField =
  | "fullName" | "mobile" | "email" | "dob" | "panNumber"
  | "state" | "city" | "pincode";

// These are intentionally no-op stubs in the current build so the account-form
// flow compiles without a persisted customer store.
export const accountFieldDefaults = () => (
  {} as Partial<Record<LockableField, string>>
);
export const apiUserFieldDefaults = () => (
  {} as Partial<Record<LockableField, string>>
);