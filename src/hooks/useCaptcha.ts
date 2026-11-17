import { useCallback, useEffect, useState } from "react";
import {
  fetchCaptcha,
  parseCaptchaChallenge,
  verifyCaptcha,
  type CaptchaChallenge,
} from "../api/captcha";
import { getApiErrorMessage } from "../utils/apiError";

export interface CaptchaState {
  challenge: CaptchaChallenge | null;
  answer: string;
  setAnswer: (value: string) => void;
  error: string;
  loading: boolean;
  verifying: boolean;
  refresh: () => void;
  verify: () => Promise<string>;
  reset: () => void;
}

export const useCaptcha = (): CaptchaState => {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedId, setVerifiedId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchCaptcha()
      .then((next) => {
        if (cancelled) return;
        setChallenge(next);
        setError("");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setChallenge(null);
        setError(
          getApiErrorMessage(
            err,
            "The security check could not be loaded. Tap New code to try again.",
          ),
        );
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setAnswer("");
    setError("");
    setChallenge(null);
    setLoaded(false);
    setReloadKey((key) => key + 1);
  }, []);

  const verify = useCallback(async (): Promise<string> => {
    if (!challenge) {
      return "The security check is still loading. Please wait a moment and try again.";
    }
    if (verifiedId === challenge.id) return "";
    const typed = answer.trim();
    if (!typed) return "Answer the security check to continue.";

    setVerifying(true);
    setError("");
    try {
      const response = await verifyCaptcha(challenge.id, typed);
      if (!response.success) {
        const message =
          (response.message && response.message.trim()) ||
          "That answer is not correct. Please try the new code.";
        if (response.captcha) {
          setChallenge(response.captcha);
          setAnswer("");
        } else {
          refresh();
        }
        setError(message);
        return message;
      }
      setVerifiedId(challenge.id);
      return "";
    } catch (err) {
      const message = getApiErrorMessage(err, "We could not check that just now. Please try again.");
      // Wrong answers increment the counter; when the attempts run out the
      // backend replaces the question and sends the new one along with the error.
      const data = (err as { response?: { data?: unknown } } | undefined)?.response?.data;
      const replacement = parseCaptchaChallenge(data);
      if (replacement) {
        setChallenge(replacement);
        setAnswer("");
        setError(message);
        return message;
      }
      const code = (data as { code?: unknown } | undefined)?.code;
      if (typeof code === "string" && code.startsWith("CAPTCHA_")) refresh();
      setError(message);
      return message;
    } finally {
      setVerifying(false);
    }
  }, [answer, challenge, refresh, verifiedId]);

  return {
    challenge,
    answer,
    setAnswer: (value: string) => {
      setAnswer(value);
      setError("");
    },
    error,
    loading: !loaded,
    verifying,
    refresh,
    verify,
    reset: refresh,
  };
};

export default useCaptcha;
