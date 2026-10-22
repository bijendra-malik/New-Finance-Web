/** Extracts a human-readable message from any axios/API error. */
export const getApiErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  const anyErr = err as { response?: { data?: { message?: string } }; message?: string };
  return anyErr?.response?.data?.message || anyErr?.message || fallback;
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
    if (typeof path !== "string" || typeof msg !== "string" || !msg.trim()) continue;
    if (!fieldErrors[path]) fieldErrors[path] = msg.trim();
  }
  return fieldErrors;
};
