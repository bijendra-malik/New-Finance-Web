import { useState } from "react";
import { EMAIL_REGEX } from "../utils/validation";
import { EmailOtpUnavailableError, sendEmailOtp, verifyEmailOtp } from "../api/emailOtp";

export const useEmailOtp = ({ email, fullName }: { email: string; fullName: string }) => {
  const [challenge, setChallenge] = useState<{
    email: string;
    expiresAt: number;
    signature: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"" | "send" | "verify">("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const cleanEmail = email.trim().toLowerCase();
  const verified = verifiedEmail !== "" && verifiedEmail === cleanEmail;
  const sent = !verified && challenge?.email === cleanEmail;

  const reset = () => {
    setChallenge(null);
    setCode("");
    setError("");
    setNotice("");
  };

  /** Mails a fresh code to the address typed above. */
  const send = async () => {
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Enter a valid email address first");
      return;
    }
    setBusy("send");
    setError("");
    setNotice("");
    try {
      const response = await sendEmailOtp(cleanEmail, fullName.trim());
      if (!response.success || !response.challenge) {
        setError(response.message || "We could not send the OTP just now. Please try again.");
        return;
      }
      setChallenge({ email: cleanEmail, ...response.challenge });
      setCode("");
      setUnavailable(false);
      setNotice(response.message || "OTP sent to your email.");
    } catch (err) {
      if (err instanceof EmailOtpUnavailableError) {
        // No mail transport on this deployment: do not trap the applicant here.
        setUnavailable(true);
        setError(err.message);
        return;
      }
      setError(
        err instanceof Error ? err.message : "We could not send the OTP just now. Please try again.",
      );
    } finally {
      setBusy("");
    }
  };

  /** Checks the typed code against the challenge issued for this address. */
  const verify = async (onVerified?: () => void) => {
    const digits = code.replace(/\D/g, "");
    if (!challenge || challenge.email !== cleanEmail) {
      setError("Request a new OTP for this email address.");
      return;
    }
    if (!/^\d{6}$/.test(digits)) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    setBusy("verify");
    setError("");
    setNotice("");
    try {
      const response = await verifyEmailOtp(cleanEmail, digits, {
        expiresAt: challenge.expiresAt,
        signature: challenge.signature,
      });
      if (!response.success) {
        setError(response.message || "That code is not correct. Please try again.");
        return;
      }
      setVerifiedEmail(cleanEmail);
      setCode("");
      setNotice(response.message || "Email verified.");
      onVerified?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We could not verify the OTP. Please try again.",
      );
    } finally {
      setBusy("");
    }
  };

  return {
    cleanEmail,
    verified,
    sent,
    code,
    setCode,
    busy,
    error,
    setError,
    notice,
    unavailable,
    send,
    verify,
    reset,
  };
};
