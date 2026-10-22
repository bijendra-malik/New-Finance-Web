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
  | "state" | "city" | "pincode" | "residenceStatus" | "residenceStatusOther";

type StoredUser = Record<string, unknown>;

const valueOf = (user: StoredUser, key: string): string | undefined => {
  const value = user[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

export const accountFieldDefaults = (): Partial<Record<LockableField, string>> => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const user = parsed as StoredUser;
    const dob = valueOf(user, "dob");
    const panNumber = valueOf(user, "panNumber") ?? valueOf(user, "pan");

    return {
      fullName: valueOf(user, "name") ?? valueOf(user, "fullName"),
      mobile: valueOf(user, "mobile"),
      email: valueOf(user, "email"),
      dob: dob ? dob.slice(0, 10) : undefined,
      panNumber: panNumber?.toUpperCase(),
      state: valueOf(user, "state"),
      city: valueOf(user, "city"),
      pincode: valueOf(user, "pincode"),
      residenceStatus: valueOf(user, "residenceStatus"),
      residenceStatusOther: valueOf(user, "residenceStatusOther"),
    };
  } catch {
    return {};
  }
};

export const apiUserFieldDefaults = accountFieldDefaults;
