import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { createMailTransport, escapeHtml, mailFrom } from "./mail.ts";

export const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_LENGTH = 6;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailOtpResult {
  status: number;
  body: Record<string, unknown> & { success: boolean; message: string };
}

const fail = (status: number, message: string): EmailOtpResult => ({
  status,
  body: { success: false, message },
});

const asRecord = (body: unknown): Record<string, unknown> =>
  body && typeof body === "object" ? (body as Record<string, unknown>) : {};

const readString = (body: Record<string, unknown>, key: string): string => {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
};

/** The signing key. SMTP_PASS is only a convenience fallback for local runs. */
const otpSecret = (): string =>
  process.env.EMAIL_OTP_SECRET?.trim() || process.env.SMTP_PASS?.trim() || "";

const sign = (key: string, email: string, otp: string, expiresAt: number): string =>
  createHmac("sha256", key).update(`${email}|${otp}|${expiresAt}`).digest("hex");

const otpEmail = (otp: string, name: string) => {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  return {
    subject: `Your Indexia Finance verification code: ${otp}`,
    text: [
      greeting,
      "",
      `Your Indexia Finance verification code is ${otp}.`,
      `It expires in ${Math.round(OTP_TTL_MS / 60000)} minutes.`,
      "",
      "If you did not request this code, you can ignore this email.",
    ].join("\n"),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#0c2a4d;line-height:1.6">
  <p>${greeting}</p>
  <p>Your Indexia Finance verification code is:</p>
  <p style="font-size:30px;font-weight:700;letter-spacing:6px;color:#066a9c;margin:12px 0">${otp}</p>
  <p style="color:#7b7b7b;font-size:13px">This code expires in ${Math.round(OTP_TTL_MS / 60000)} minutes. If you did not request it, you can ignore this email.</p>
</div>`,
  };
};

/** POST /api/email-otp/send — mail a fresh code and return its signed challenge. */
export const handleEmailOtpSend = async (body: unknown): Promise<EmailOtpResult> => {
  const payload = asRecord(body);
  const email = readString(payload, "email").toLowerCase();
  const name = readString(payload, "name");

  if (!EMAIL_RE.test(email)) return fail(400, "Enter a valid email address");

  const key = otpSecret();
  if (!key) return fail(503, "Email verification is not configured on this server.");

  const sender = createMailTransport();
  if (!sender) return fail(503, "Email verification is not configured on this server.");

  const otp = String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
  const expiresAt = Date.now() + OTP_TTL_MS;
  const mail = otpEmail(otp, name);
  const from = mailFrom();

  try {
    await sender.sendMail({ from, to: email, subject: mail.subject, text: mail.text, html: mail.html });
  } catch {
    return fail(502, "We could not send the email right now. Please try again in a moment.");
  }

  return {
    status: 200,
    body: {
      success: true,
      message: `A ${OTP_LENGTH}-digit code has been sent to ${email}.`,
      challenge: { expiresAt, signature: sign(key, email, otp, expiresAt) },
    },
  };
};

/** POST /api/email-otp/verify — check the code against its signed challenge. */
export const handleEmailOtpVerify = async (body: unknown): Promise<EmailOtpResult> => {
  const payload = asRecord(body);
  const email = readString(payload, "email").toLowerCase();
  const otp = readString(payload, "otp").replace(/\D/g, "");
  const signature = readString(payload, "signature");
  const expiresAt = Number(payload.expiresAt);

  if (!EMAIL_RE.test(email)) return fail(400, "Enter a valid email address");
  if (otp.length !== OTP_LENGTH) return fail(400, `Enter the ${OTP_LENGTH}-digit code from your email`);
  if (!signature || !Number.isFinite(expiresAt)) return fail(400, "Request a new code and try again");

  const key = otpSecret();
  if (!key) return fail(503, "Email verification is not configured on this server.");
  if (Date.now() > expiresAt) return fail(410, "That code has expired. Please request a new one.");

  const expected = Buffer.from(sign(key, email, otp, expiresAt), "hex");
  const given = Buffer.from(signature, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return fail(400, "That code is not correct. Please check your email and try again.");
  }

  return { status: 200, body: { success: true, message: "Email verified." } };
};
