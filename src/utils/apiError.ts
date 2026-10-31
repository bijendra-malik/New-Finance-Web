const INTERNAL_DETAIL_PATTERN =
  /no document found|model\s+["']|mongoose|mongodb|objectid|e11000|duplicate key|node_modules|\.[cm]?[jt]sx?:\d+:\d+|\bat\s+\w[\w.$]*\s*\([^)]*:\d+\)/i;

const MAX_MESSAGE_LENGTH = 240;

const toUserFacingMessage = (message: unknown, fallback: string): string => {
  if (typeof message !== "string") return fallback;
  const text = message.replace(/\s+/g, " ").trim();
  if (!text || text.length > MAX_MESSAGE_LENGTH) return fallback;
  if (INTERNAL_DETAIL_PATTERN.test(text)) return fallback;
  return text;
};

export const getApiRetryAfter = (err: unknown): string => {
  const value = (
    err as { response?: { data?: { retryAfter?: { availableAt?: unknown } } } } | undefined
  )?.response?.data?.retryAfter?.availableAt;
  if (typeof value !== "string" || !value.trim()) return "";
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return "";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const withRetryAfter = (message: string, err: unknown): string => {
  const availableFrom = getApiRetryAfter(err);
  if (!availableFrom || message.includes(availableFrom)) return message;
  const trimmed = message.trim();
  const separator = /[.!?]$/.test(trimmed) ? " " : ". ";
  return `${trimmed}${separator}A new application can be filed from ${availableFrom}.`;
};

/** Extracts a human-readable message from any axios/API error. */
export const getApiErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  const anyErr = err as { response?: { data?: { message?: string } }; message?: string };
  const raw = anyErr?.response?.data?.message || anyErr?.message;
  if (typeof raw === "string" && /no document found.*model\s+["']otp["']/i.test(raw)) {
    return "This OTP request has expired or is no longer available. Please request a new OTP.";
  }
  return withRetryAfter(toUserFacingMessage(raw, fallback), err);
};

export type ApiFieldErrors = Record<string, string>;

interface ValidationIssue {
  path?: unknown;
  msg?: unknown;
}

export const getApiFieldErrors = (err: unknown): ApiFieldErrors => {
  const issues = (
    err as { response?: { data?: { errors?: unknown } } } | undefined
  )?.response?.data?.errors;
  if (!Array.isArray(issues)) return {};

  const fieldErrors: ApiFieldErrors = {};
  for (const issue of issues) {
    const { path, msg } = (issue ?? {}) as ValidationIssue;
    const text = toUserFacingMessage(msg, "");
    if (typeof path !== "string" || !text) continue;
    if (!fieldErrors[path]) fieldErrors[path] = text;
  }
  return fieldErrors;
};

const fieldLabel = (path: string): string => {
  const words = path.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[._]/g, " ").trim().toLowerCase();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : path;
};

export const getApiErrorMessageWithFields = (
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  const base = getApiErrorMessage(err, fallback);
  const details = Object.entries(getApiFieldErrors(err)).map(
    ([path, msg]) => `${fieldLabel(path)}: ${msg}`,
  );
  if (details.length === 0) return base;
  return `${base} — ${details.join("; ")}`;
};
