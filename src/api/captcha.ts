/**
 * Bot check — GET /captcha/new hands out a text question, POST /captcha/verify
 * answers it. Both sit on the main backend, next to the other routes.
 */
import axiosInstance from "./axiosInstance";

export interface CaptchaChallenge {
  id: string;
  /** The question text, e.g. "3 + 7". */
  question: string;
}

interface CaptchaVerifyResponse {
  success: boolean;
  message?: string;
  code?: string;
  attemptsLeft?: number;
  captcha?: CaptchaChallenge;
}

const asText = (value: unknown): string =>
  typeof value === "string" && value.trim() ? value.trim() : "";

const unwrap = (payload: unknown): Record<string, unknown> => {
  const record =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : {};
  const nested = record.captcha ?? record.data;
  return nested && typeof nested === "object" && !Array.isArray(nested)
    ? (nested as Record<string, unknown>)
    : record;
};

export const parseCaptchaChallenge = (payload: unknown): CaptchaChallenge | null => {
  const source = unwrap(payload);
  const id = asText(source.id) || asText(source.captchaId) || asText(source._id);
  if (!id) return null;
  return { id, question: asText(source.question) };
};

/** GET /captcha/new — issues one question, returned as-is. */
export const fetchCaptcha = async (): Promise<CaptchaChallenge> => {
  const response = await axiosInstance.get("/captcha/new", {
    params: { t: Date.now() },
  });
  const challenge = parseCaptchaChallenge(response.data);
  if (!challenge) throw new Error("The security check could not be loaded. Please try again.");
  return challenge;
};

/** POST /captcha/verify — checks the typed answer against its question. */
export const verifyCaptcha = async (
  id: string,
  answer: string,
): Promise<CaptchaVerifyResponse> => {
  const typed = answer.trim();
  const response = await axiosInstance.post<CaptchaVerifyResponse>("/captcha/verify", {
    id,
    answer: /^-?\d+$/.test(typed) ? Number(typed) : typed,
  });
  return withReplacementChallenge(response.data);
};

/** Attaches the parsed replacement challenge, if the backend sent one. */
const withReplacementChallenge = (
  data: CaptchaVerifyResponse,
): CaptchaVerifyResponse => {
  const captcha = parseCaptchaChallenge(data);
  return captcha ? { ...data, captcha } : data;
};
