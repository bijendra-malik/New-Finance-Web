/** Email OTP calls — served same-origin by api/email-otp/* (nodemailer). */

interface EmailOtpChallenge {
  expiresAt: number;
  signature: string;
}

interface EmailOtpResponse {
  success: boolean;
  message: string;
  challenge?: EmailOtpChallenge;
}

/** Thrown when the deployment has no mail transport configured. */
export class EmailOtpUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailOtpUnavailableError";
  }
}

const postJson = async (path: string, payload: unknown): Promise<EmailOtpResponse> => {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new EmailOtpUnavailableError("Email verification is unavailable right now.");
  }

  const data = (await response.json().catch(() => null)) as EmailOtpResponse | null;

  if (response.status === 404 || response.status === 503) {
    throw new EmailOtpUnavailableError(
      data?.message || "Email verification is unavailable right now.",
    );
  }
  if (!data) {
    throw new Error("We could not reach the email service. Please try again.");
  }
  return data;
};

export const sendEmailOtp = (email: string, name = ""): Promise<EmailOtpResponse> =>
  postJson("/api/email-otp/send", { email, name });

export const verifyEmailOtp = (
  email: string,
  otp: string,
  challenge: EmailOtpChallenge,
): Promise<EmailOtpResponse> =>
  postJson("/api/email-otp/verify", { email, otp, ...challenge });
