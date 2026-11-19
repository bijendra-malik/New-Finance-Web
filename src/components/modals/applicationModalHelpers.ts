import type { AuthActionResponse } from "../../api/auth";

const ALREADY_REGISTERED_SIGNALS = new Set([
  "mobile already exists",
  "mobile already registered",
  "already registered",
  "mobile number already registered",
]);

export interface BlockedNotice {
  kind: "rejected" | "cooldown";
  title: string;
  body: string;
  detail?: string;
}

export interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  activeProduct?: { id: string } | null;
}

export const formatDay = (date: Date): string =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const alreadyAppliedError = (
  err: unknown,
): { message: string; availableAt?: string } | null => {
  const response = (
    err as {
      response?: { status?: number; data?: { message?: string; retryAfter?: { availableAt?: string } } };
    }
  )?.response;
  const message = response?.data?.message;
  if (typeof message !== "string" || !message.trim()) return null;
  const isCooldown =
    response?.status === 409 || /already applied|already submitted/i.test(message);
  if (!isCooldown) return null;
  return { message: message.trim(), availableAt: response?.data?.retryAfter?.availableAt };
};

export const isAlreadyRegisteredResponse = (response: AuthActionResponse): boolean => {
  if (response.success) return false;
  const message = typeof response.message === "string" ? response.message.trim().toLowerCase() : "";
  if (ALREADY_REGISTERED_SIGNALS.has(message)) return true;
  if (message.includes("already")) {
    if (
      message.includes("mobile") ||
      message.includes("number") ||
      message.includes("registered") ||
      message.includes("exist")
    ) {
      return true;
    }
  }
  return false;
};
