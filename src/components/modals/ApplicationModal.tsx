import { useState, useEffect } from "react";
import { EMAIL_REGEX, MOBILE_REGEX, NAME_REGEX, PAN_REGEX, isAtLeastAge, isAtMostAge } from "../../utils/validation";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSetApplicantPrefill } from "../../context/applicantPrefillContext";
import { useAuth } from "../../context/authContext";
import {
  requestLoanApplyOTP,
  requestLoginOTP,
  verifyLoginOTP,
  verifyOTP,
  type AuthActionResponse,
} from "../../api/auth";
import { fetchContinents, fetchCountriesByContinent } from "../../api/masters";
import type { Continent, Country } from "../../api/masters";
import { useCaptcha } from "../../hooks/useCaptcha";
import { getApiErrorMessage } from "../../utils/apiError";
import { EmailOtpUnavailableError, sendEmailOtp, verifyEmailOtp } from "../../api/emailOtp";
import { loanKeyFor, loanLabelFor } from "../../constants/loanSlugs";
import { markApplySessionPending } from "../../utils/applySession";
import {
  clearPendingCreditScoreDraft,
  readPendingCreditScoreDraft,
  readSubmittedApplication,
  remainingCreditScoreWindow,
} from "../../utils/applicationFlowState";
import Button from "../ui/Button";
import CaptchaField from "../ui/CaptchaField";
import CodeBoxes from "../ui/CodeBoxes";
import { advanceOnEnter } from "../../utils/enterToNext";
import { DateOfBirthPicker } from "../form/FormControls";
import { resolveDashboardPath } from "./applicationModalRoutes";
import { Field, Select } from "./applicationModalFields";

const ALREADY_REGISTERED_SIGNALS = new Set([
  "mobile already exists",
  "mobile already registered",
  "already registered",
  "mobile number already registered",
]);

interface BlockedNotice {
  kind: "rejected" | "cooldown";
  title: string;
  body: string;
  detail?: string;
}

const formatDay = (date: Date): string =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const alreadyAppliedError = (
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

const isAlreadyRegisteredResponse = (
  response: AuthActionResponse,
): boolean => {
  if (response.success) return false;
  const message =
    typeof response.message === "string" ? response.message.trim().toLowerCase() : "";
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

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  activeProduct?: { id: string } | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

const ApplicationModal = ({
  isOpen,
  onClose,
  productName = "",
  activeProduct,
}: ApplicationModalProps) => {
  const navigate = useNavigate();
  const setApplicantPrefill = useSetApplicantPrefill();
  const { login, isLoggedIn, user } = useAuth();
  // Bot check — solved once per panel, checked before any OTP is requested.
  const captcha = useCaptcha();

  // Sign up (register for a product) vs Sign in (returning customer).
  const openedAsLogin = productName.trim().toLowerCase() === "log in";
  const [mode, setMode] = useState<"signup" | "signin">(openedAsLogin ? "signin" : "signup");

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [pan, __setPan] = useState("");
  // Region — chosen from the location masters (GET /masters/location/…).
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [continentOptions, setContinentOptions] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countryOptions, setCountryOptions] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // ── Email OTP — the code is mailed by api/email-otp/* (nodemailer) ──────────
  const [emailChallenge, setEmailChallenge] = useState<{ email: string; expiresAt: number; signature: string } | null>(null);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpBusy, setEmailOtpBusy] = useState<"" | "send" | "verify">("");
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailOtpNotice, setEmailOtpNotice] = useState("");
  const [emailOtpUnavailable, setEmailOtpUnavailable] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const cleanEmail = email.trim().toLowerCase();
  const emailVerified = verifiedEmail !== "" && verifiedEmail === cleanEmail;
  const emailOtpSent = !emailVerified && emailChallenge?.email === cleanEmail;
  // ── Mobile OTP — the code is issued by the backend at registration ─────────
  const [sentMobile, setSentMobile] = useState("");
  const [verifiedMobile, setVerifiedMobile] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpBusy, setMobileOtpBusy] = useState<"" | "send" | "verify">("");
  const [mobileOtpError, setMobileOtpError] = useState("");
  const [mobileOtpNotice, setMobileOtpNotice] = useState("");
  const mobileVerified = verifiedMobile !== "" && verifiedMobile === mobile;
  const mobileOtpSent = !mobileVerified && sentMobile !== "" && sentMobile === mobile;

  const setPan = function (v: string) {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    let structured = "";
    for (const c of clean) {
      const pos = structured.length;
      if (pos < 5 && /[A-Z]/.test(c)) structured += c;
      else if (pos >= 5 && pos < 9 && /[0-9]/.test(c)) structured += c;
      else if (pos === 9 && /[A-Z]/.test(c)) structured += c;
    }
    __setPan(structured);
    setFieldErrors((p) => ({ ...p, pan: "" }));
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────
  const [apiError, setApiError] = useState("");

  const resetEmailOtp = () => {
    setEmailChallenge(null);
    setEmailOtp("");
    setEmailOtpError("");
    setEmailOtpNotice("");
  };

  /** Mails a fresh code to the address typed above. */
  const handleSendEmailOtp = async () => {
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setEmailOtpError("Enter a valid email address first");
      return;
    }
    setEmailOtpBusy("send");
    setEmailOtpError("");
    setEmailOtpNotice("");
    try {
      const response = await sendEmailOtp(cleanEmail, fullName.trim());
      if (!response.success || !response.challenge) {
        setEmailOtpError(response.message || "We could not send the OTP just now. Please try again.");
        return;
      }
      setEmailChallenge({ email: cleanEmail, ...response.challenge });
      setEmailOtp("");
      setEmailOtpUnavailable(false);
      setEmailOtpNotice(response.message || "OTP sent to your email.");
    } catch (err) {
      if (err instanceof EmailOtpUnavailableError) {
        // No mail transport on this deployment: do not trap the applicant here.
        setEmailOtpUnavailable(true);
        setEmailOtpError(err.message);
        return;
      }
      setEmailOtpError(err instanceof Error ? err.message : "We could not send the OTP just now. Please try again.");
    } finally {
      setEmailOtpBusy("");
    }
  };

  /** Checks the typed code against the challenge issued for this address. */
  const handleVerifyEmailOtp = async () => {
    const code = emailOtp.replace(/\D/g, "");
    if (!emailChallenge || emailChallenge.email !== cleanEmail) {
      setEmailOtpError("Request a new OTP for this email address.");
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setEmailOtpError("Enter the 6-digit code from your email");
      return;
    }
    setEmailOtpBusy("verify");
    setEmailOtpError("");
    setEmailOtpNotice("");
    try {
      const response = await verifyEmailOtp(cleanEmail, code, {
        expiresAt: emailChallenge.expiresAt,
        signature: emailChallenge.signature,
      });
      if (!response.success) {
        setEmailOtpError(response.message || "That code is not correct. Please try again.");
        return;
      }
      setVerifiedEmail(cleanEmail);
      setEmailOtp("");
      setEmailOtpNotice(response.message || "Email verified.");
      setFieldErrors((p) => ({ ...p, email: "" }));
    } catch (err) {
      setEmailOtpError(err instanceof Error ? err.message : "We could not verify the OTP. Please try again.");
    } finally {
      setEmailOtpBusy("");
    }
  };
  const [detailsBusy, setDetailsBusy] = useState(false);

  // ── Step 2 — the OTP gate (POST /auth/personal-loan → POST /auth/verify-otp) ──
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendNotice, setResendNotice] = useState("");
  const [resending, setResending] = useState(false);
  // Where to land once the mobile is verified.
  const [pendingDashboard, setPendingDashboard] = useState("");
  const [sessionWasSignedIn, setSessionWasSignedIn] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [blockedNotice, setBlockedNotice] = useState<BlockedNotice | null>(null);
  // The security check is its own step: it opens only once the details are complete.
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaBusy, setCaptchaBusy] = useState(false);

  const resetAll = () => {
    setFullName("");
    setMobile("");
    setEmail("");
    setDob("");
    __setPan("");
    setContinent("");
    setCountry("");
    setCountryOptions([]);
    setCountriesLoading(false);
    setFieldErrors({});
    setApiError("");
    setDetailsBusy(false);
    setStep("details");
    setOtp("");
    setOtpError("");
    setOtpBusy(false);
    setResendNotice("");
    setResending(false);
    setAlreadyRegistered(false);
    setBlockedNotice(null);
    setPendingDashboard("");
    setSessionWasSignedIn(true);
    setMode(openedAsLogin ? "signin" : "signup");
    setSentMobile("");
    setVerifiedMobile("");
    setMobileOtp("");
    setMobileOtpError("");
    setMobileOtpNotice("");
    setCaptchaOpen(false);
    setCaptchaBusy(false);
    captcha.reset();
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const switchMode = (next: "signup" | "signin") => {
    if (next === mode) return;
    setMode(next);
    setStep("details");
    setOtp("");
    setOtpError("");
    setResendNotice("");
    setApiError("");
    setFieldErrors({});
    setAlreadyRegistered(false);
    setBlockedNotice(null);
  };

  // Escape closes the panel, like the backdrop and the Cancel button.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // The security check closes first, leaving the details intact.
      if (captchaOpen) {
        setCaptchaOpen(false);
        captcha.clearError();
        captcha.clearVerification();
        return;
      }
      handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Freeze the page behind the popup, so only the popup's own areas scroll.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Continents load once; the country list follows the chosen continent. Both are
  // masters endpoints, cached in the api module, so re-opening the popup is free.
  useEffect(() => {
    let cancelled = false;
    fetchContinents()
      .then((list) => { if (!cancelled) setContinentOptions(list); })
      .catch(() => { if (!cancelled) setContinentOptions([]); })
      .finally(() => { if (!cancelled) setContinentsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const picked = continentOptions.find((item) => item.name === continent);
    if (!picked) return;
    let cancelled = false;
    fetchCountriesByContinent(picked._id)
      .then((list) => { if (!cancelled) setCountryOptions(list); })
      .catch(() => { if (!cancelled) setCountryOptions([]); })
      .finally(() => { if (!cancelled) setCountriesLoading(false); });
    return () => { cancelled = true; };
  }, [continentOptions, continent]);

  if (!isOpen) return null;

  const productKey = activeProduct?.id ?? productName;
  // The canonical LOAN_SLUGS key names the OTP endpoint (/auth/{loanKey}).
  const loanKey = loanKeyFor(productKey);
  const isLoginMode = mode === "signin";
  /** The question on screen has already been answered. */
  const securityVerified = captcha.verified;

  const formatAvailableAt = (value?: string): string => {
    if (!value) return "";
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? "" : formatDay(new Date(ms));
  };

  /** The cooldown is owned by the API: `retryAfter.availableAt` is shown when it sends one. */
  const noticeForBlockedApplication = (
    rejected: boolean,
    availableAt?: string,
    message?: string,
  ): BlockedNotice => {
    const from = formatAvailableAt(availableAt);
    if (rejected) {
      return {
        kind: "rejected",
        title: "Your earlier application was not eligible",
        body: `Our review of your earlier ${productName} application found it was not eligible for a loan.${
          from ? ` A new application can be filed from ${from}.` : " A new application is not open yet."
        }`,
        detail: "A stronger credit score, or clearing existing dues, can change the outcome. Another product may still suit your profile today.",
      };
    }
    return {
      kind: "cooldown",
      title: "You have already applied",
      body: `${message?.trim() || `You have already applied for ${productName}.`}${
        from ? ` A new application can be filed from ${from}.` : ""
      }`,
      detail: "You can follow the application you have already submitted from My Applications.",
    };
  };

  // ── Validate eligibility fields ───────────────────────────────────────────

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!MOBILE_REGEX.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    // Signing in needs nothing but the registered mobile number.
    if (isLoginMode) {
      setFieldErrors(e);
      return Object.keys(e).length === 0;
    }
    if (!fullName.trim()) e.fullName = "Full name is required";
    else if (!NAME_REGEX.test(fullName.trim())) e.fullName = "Enter a valid full name";
    if (!EMAIL_REGEX.test(email)) e.email = "Enter a valid email address";
    else if (!emailVerified && !emailOtpUnavailable) e.email = "Verify your email with the OTP sent to it";
    if (!dob) e.dob = "Date of birth is required";
    else if (!isAtLeastAge(dob, 18)) e.dob = "You must be at least 18 years old to apply for a loan";
    else if (!isAtMostAge(dob, 65)) e.dob = "Applicants must be 65 years old or younger";
    validatePan("pan", pan, e);
    if (!continent) e.continent = "Select a continent";
    if (!country) e.country = "Select a country";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePan = (name: "pan", value: string, e: Record<string, string>) => {
    if (!value.trim()) { e[name] = "PAN is required"; return; }
    if (!PAN_REGEX.test(value)) { e[name] = "Enter a valid PAN, e.g. ABCDE1234F"; return; }
  };

  // ── Step 1 — Save eligibility details → eligibility test ────────────────────


  /** Carries the verified identity into the dashboard form, then closes the popup. */
  const openApplicationForm = (dashboardPath: string) => {
    setApplicantPrefill?.({
      identity: {
        fullName: fullName.trim(),
        mobile,
        email: email.trim(),
        dob,
        panNumber: pan,
      },
      note: "Your details are carried into the application form. You can review them there.",
      // What the account registered at loan entry holds — not this typed copy —
      // is what the backend compares a submission against, so these values may
      // only fill the fields the account leaves blank.
      authoritative: false,
    });
    resetAll();
    onClose();
    navigate(dashboardPath);
  };

  const applyIdentity = () => ({
    name: fullName.trim(),
    mobile,
    email: email.trim(),
    dob,
    panNumber: pan,
    continent,
    country,
  });

  /**
   * Asks for the OTP: the apply flow registers the product
   * (POST /auth/{loanKey}); the sign-in flow hits POST /auth/login/request-otp.
   * A resend goes through the same call so it matches the first request.
   */
  const requestOtp = (): Promise<AuthActionResponse> => {
    if (!loanKey) {
      return Promise.reject(new Error("This product cannot be applied for yet."));
    }
    if (isLoginMode) return requestLoginOTP({ mobile });
    return requestLoanApplyOTP(loanKey, applyIdentity());
  };

  /** Records that a code is now waiting, either inline or on the verify screen. */
  const markOtpSent = (dashboardPath: string, inline: boolean) => {
    setPendingDashboard(dashboardPath);
    setOtp("");
    setOtpError("");
    setResendNotice("");
    if (inline) {
      setSentMobile(mobile);
      setMobileOtp("");
      setMobileOtpNotice(`OTP sent to +91 ${mobile}.`);
    } else {
      setStep("otp");
    }
  };

  /**
   * Saves the details and asks the backend for the mobile OTP. With `inline`
   * the applicant stays on the details step and enters the code beside the
   * mobile number instead of switching to the verify screen.
   */
  const sendOtpCode = async (inline: boolean, withCaptcha = true) => {
    setApiError("");
    if (inline) setMobileOtpError("");

    // Each sign-in remains tied to the product that opened the modal; do not
    // guess a fallback product when that context is missing.
    const dashboardPath = resolveDashboardPath(productKey);
    if (!dashboardPath || !loanKey) {
      const message = "Application form is not available for this product yet.";
      if (inline) setMobileOtpError(message); else setApiError(message);
      return;
    }

    // Every application is authorised by its own OTP: re-applying — for another
    // product, or after abandoning one — requests a fresh code and replaces the
    // token with the new one, so a stale session can never file the application.
    setSessionWasSignedIn(isLoggedIn);
    if (inline) setMobileOtpBusy("send"); else setDetailsBusy(true);
    try {
      if (withCaptcha) {
        const captchaProblem = await captcha.verify();
        if (captchaProblem) {
          if (inline) setMobileOtpError(captchaProblem); else setApiError(captchaProblem);
          return;
        }
      }
      const response = await requestOtp();
      if (!response.success) {
        if (isAlreadyRegisteredResponse(response)) {
          switchMode("signin");
          try {
            const loginOtp = await requestLoginOTP({ mobile });
            if (!loginOtp.success) {
              const message = loginOtp.message || "We could not send the OTP just now. Please try again.";
              if (inline) setMobileOtpError(message); else setApiError(message);
              return;
            }
            setAlreadyRegistered(true);
            markOtpSent(dashboardPath, inline);
          } catch (loginError) {
            const message = getApiErrorMessage(loginError, "We could not send the OTP just now. Please try again.");
            if (inline) setMobileOtpError(message); else setApiError(message);
          }
          return;
        }
        const message = response.message || "We could not send the OTP just now. Please try again.";
        if (inline) setMobileOtpError(message); else setApiError(message);
        return;
      }
      markOtpSent(dashboardPath, inline);
    } catch (err) {
      const blocked = alreadyAppliedError(err);
      if (blocked) {
        const record = readSubmittedApplication(user?._id ?? mobile, loanKey);
        if (inline) setMobileOtpError(""); else setApiError("");
        setBlockedNotice(
          noticeForBlockedApplication(
            record?.outcome === "rejected",
            blocked.availableAt,
            blocked.message,
          ),
        );
        return;
      }
      const message = getApiErrorMessage(err, "We could not send the OTP just now. Please try again.");
      if (inline) setMobileOtpError(message); else setApiError(message);
    } finally {
      if (inline) setMobileOtpBusy(""); else setDetailsBusy(false);
    }
  };

  /** Step 1 — save the details and send the apply-flow OTP. */
  const handleDetailsSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateDetails()) return;
    // A code already sent beside the mobile number stays valid — open the verify
    // screen instead of issuing a duplicate.
    if (mobileOtpSent) { setStep("otp"); return; }
    // Every detail is complete — now ask the security check before the OTP is sent.
    if (!securityVerified) {
      setCaptchaOpen(true);
      return;
    }
    await sendOtpCode(false);
  };

  /** Answers the security check, then continues with the details submit. */
  const confirmSecurityCheck = async () => {
    if (captchaBusy) return;
    setCaptchaBusy(true);
    // A wrong or missing answer is reported by useCaptcha, and shown on the field.
    const problem = await captcha.verify();
    setCaptchaBusy(false);
    if (problem) return;
    setCaptchaOpen(false);
    await sendOtpCode(false);
  };

  /** The number check itself, run once the security check has been answered. */
  const sendMobileOtpCode = async () => {
    setMobileOtpBusy("send");
    setMobileOtpError("");
    setMobileOtpNotice("");
    const newNumberNotice =
      "This number is not registered yet. Add your details and press Continue — we will verify the number then.";
    try {
      // Looking a number up carries no security check; only Continue does.
      if (isLoginMode) {
        await sendOtpCode(true, false);
        return;
      }
      const response = await requestLoginOTP({ mobile });
      if (response.success) {
        switchMode("signin");
        setAlreadyRegistered(true);
        setSessionWasSignedIn(isLoggedIn);
        markOtpSent(resolveDashboardPath(productKey) ?? "", false);
        return;
      }
      setMobileOtpNotice(newNumberNotice);
    } catch (err) {
      const message = getApiErrorMessage(err, "We could not check this number just now. Please try again.");
      if (/not\s+(found|registered|exist)|does not exist|no user|unregistered/i.test(message)) {
        setMobileOtpNotice(newNumberNotice);
      } else {
        setMobileOtpError(message);
      }
    } finally {
      setMobileOtpBusy("");
    }
  };

  /** Looks the number up. No security check: that comes after Continue. */
  const handleSendMobileOtp = async () => {
    if (!MOBILE_REGEX.test(mobile)) {
      setMobileOtpError("Enter a valid 10-digit mobile number first");
      return;
    }
    await sendMobileOtpCode();
  };

  /**
   * Verifies the mobile code, stores its token, then opens the product's form.
   * Shared by the verify screen and the inline panel beside the mobile number.
   */
  const verifyMobileCode = async (code: string, setError: (message: string) => void) => {
    if (!loanKey) { setError("Please start sign-in from the loan product you want to apply for."); return; }
    try {
      const response = isLoginMode
        ? await verifyLoginOTP(loanKey, { mobile, otp: code })
        : await verifyOTP({ mobile, otp: code });
      if (!response.success || !response.token || !response.user) {
        setError("The verification response was incomplete. Check the code and try again.");
        return;
      }
      login(response.token, response.user);
      setVerifiedMobile(mobile);
      if (isLoginMode) {
        const pendingDraft = readPendingCreditScoreDraft(response.user._id);
        if (pendingDraft) {
          if (remainingCreditScoreWindow(pendingDraft.createdAt).expired) {
            clearPendingCreditScoreDraft();
          } else {
            resetAll();
            onClose();
            const draftDashboard = resolveDashboardPath(pendingDraft.loanKey);
            navigate(draftDashboard ?? "/credit-score", {
              state: draftDashboard
                ? undefined
                : {
                    product: loanLabelFor(pendingDraft.loanKey) ?? pendingDraft.loanKey,
                    requestedProduct: productName,
                  },
            });
            return;
          }
        }
        // With no active draft, sign-in opens the requested product's form.
        resetAll();
        onClose();
        navigate(pendingDashboard);
        return;
      }
      if (!sessionWasSignedIn) markApplySessionPending();
      openApplicationForm(pendingDashboard);
    } catch (err) {
      const blocked = alreadyAppliedError(err);
      if (blocked) {
        const record = loanKey ? readSubmittedApplication(user?._id ?? mobile, loanKey) : null;
        setError("");
        setBlockedNotice(
          noticeForBlockedApplication(
            record?.outcome === "rejected",
            blocked.availableAt,
            blocked.message,
          ),
        );
        return;
      }
      setError(getApiErrorMessage(err, "Invalid OTP. Please try again."));
    }
  };

  /** Step 2 — the verify screen's submit. */
  const handleOtpVerify = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const code = otp.trim();
    if (!code) { setOtpError("Please enter the OTP"); return; }
    if (!/^\d{4,8}$/.test(code)) { setOtpError("Enter a valid OTP"); return; }
    setOtpBusy(true);
    setOtpError("");
    await verifyMobileCode(code, setOtpError);
    setOtpBusy(false);
  };

  /** Verifies the code typed beside the mobile number. */
  const handleVerifyMobileOtp = async () => {
    const code = mobileOtp.replace(/\D/g, "");
    if (!/^\d{4,8}$/.test(code)) { setMobileOtpError("Enter the OTP sent to your mobile"); return; }
    setMobileOtpBusy("verify");
    setMobileOtpError("");
    setMobileOtpNotice("");
    await verifyMobileCode(code, setMobileOtpError);
    setMobileOtpBusy("");
  };

  const handleOtpResend = async () => {
    if (!loanKey) {
      setOtpError("Could not resend the OTP. Please try again.");
      return;
    }
    setResending(true);
    setOtpError("");
    setResendNotice("");
    try {
      const response = await requestOtp();
      if (!response.success) {
        setOtpError(response.message || "Could not resend the OTP. Please try again.");
        return;
      }
      setResendNotice("OTP resent successfully!");
    } catch (err) {
      setOtpError(getApiErrorMessage(err, "Could not resend the OTP. Please try again."));
    } finally {
      setResending(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  // Portalled to <body>: an ancestor with its own stacking context (e.g. the hero's `absolute z-10` wrapper) would otherwise trap the popup under the header, no matter how high its z-index is.
  return createPortal(
    <>
      {/* Backdrop — above the header (z-55) */}
      <div
        className="fixed inset-0 bg-black/70 z-90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal — single-card eligibility gateway */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-3 sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          className="w-full max-w-xl min-w-0 flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white max-h-[92vh]"
        >

          {/* ── Header band — navy, single column: the Sign up / Sign in panel ── */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-(--brand-navy) via-(--brand-dark) to-(--brand-navy-deep) text-white">
            <div className="h-1 w-full bg-(--brand-teal)" />
            <div className="px-5 py-3.5 sm:px-6 sm:py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Sign up / Sign in — the panel's mode switch. */}
                  <div role="tablist" aria-label="Sign up or sign in"
                    className="inline-flex rounded-full bg-white/10 p-1">
                    {([["signup", "Register New Account"], ["signin", "LogIn"]] as const).map(([m, label]) => (
                      <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        onClick={() => switchMode(m)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/70 ${
                          mode === m ? "bg-(--brand-teal) text-white" : "text-white/70 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <h2 id="apply-modal-title" className="mt-1.5 text-lg sm:text-xl font-extrabold tracking-tight">
                    {mode === "signin" ? "Welcome back" : loanKey ? productName : "Create your account"}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-white/70">
                    {mode === "signin"
                      ? `Login with the mobile number registered with us. To create a new account, switch to Register New Account above.`
                      : "Add your contact and identity details to start your application."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close"
                  className="shrink-0 rounded-lg border border-white/25 bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/70 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Step rail */}
              <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">

                {[
                  { label: isLoginMode ? "Your number" : "Your details", state: step === "otp" ? "done" : "active" },
                  { label: "Verify mobile", state: step === "otp" ? "active" : "todo" },
                  { label: isLoginMode ? "Application Form" : "Application form", state: "todo" },
                ].map((s, i, arr) => (
                  <li key={s.label} className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
                      text-[11px] font-bold uppercase tracking-wider transition-all
                      ${s.state === "active"
                        ? "bg-(--brand-teal) text-white shadow-(--brand-teal-44)"
                        : s.state === "done"
                          ? "bg-white/20 text-white border border-white/25"
                          : "bg-white/10 text-white/55 border border-white/15"}`}>
                      {s.state !== "todo" && (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {i + 1}. {s.label}
                    </span>
                    {i < arr.length - 1 && (
                      <span aria-hidden className="text-white/30 text-xs">→</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bg-white overflow-hidden">

            {/* Body (scrolls when taller than the card) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3.5 md:px-6 md:py-4">

              {/* API-level error */}
              {apiError && (
                <div className="mb-4 bg-(--form-error-bg) border border-red-200 rounded-lg px-4 py-3
                  text-sm text-red-600 flex gap-2.5 items-start">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* An earlier application for this product still blocks a new one. */}
              {blockedNotice && (
                <div
                  role="status"
                  className={`mb-4 rounded-xl border px-4 py-3 ${
                    blockedNotice.kind === "rejected"
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      blockedNotice.kind === "rejected" ? "text-amber-700" : "text-slate-500"
                    }`}
                  >                      {blockedNotice.title}
                    </p>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      blockedNotice.kind === "rejected" ? "text-amber-900" : "text-slate-700"
                    }`}
                  >
                    {blockedNotice.body}
                  </p>
                  {blockedNotice.detail && (
                    <p
                      className={`mt-1.5 text-xs leading-5 ${
                        blockedNotice.kind === "rejected" ? "text-amber-800" : "text-slate-500"
                      }`}
                    >
                      {blockedNotice.detail}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="rounded-lg font-semibold"
                      onClick={() => {
                        setBlockedNotice(null);
                        if (step === "otp") setStep("details");
                      }}
                    >
                      Got it
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-lg font-semibold"
                      onClick={() => {
                        setBlockedNotice(null);
                        handleClose();
                        navigate("/applications");
                      }}
                    >
                      View my applications
                    </Button>
                  </div>
                </div>
              )}

              {/* Feature 1 — the number is already registered, so the panel has
                  switched itself to LogIn. Informational only: the shift needs no
                  click, and the tab pills above still allow going back. */}
              {alreadyRegistered && (
                <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Already in our system</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    This mobile number is already registered with us, so we have moved you to
                    sign in. The OTP for {productName} has been sent to this number — enter it
                    below to continue.
                  </p>
                </div>
              )}

              {/* Capture applicant identity before opening the loan form. */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} onKeyDown={advanceOnEnter} className="space-y-3" noValidate>
                  {/* Product selected on the home page — a sign-in has none. */}
                  {!isLoginMode && (
                    <div className="rounded-xl border border-(--brand-teal)/30 bg-(--brand-teal-14) px-4 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                      <p className="mt-0.5 flex items-center gap-2 text-sm font-bold text-slate-800">
                        <svg className="h-4 w-4 shrink-0 text-(--brand-teal)" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {productName}
                      </p>
                    </div>
                  )}

                  {/* Applicant details — email and mobile each verify on the spot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {!isLoginMode && (
                      <Field
                        label="Full Name" type="text" name="fullName"
                        value={fullName} onChange={(v) => { setFullName(v); setFieldErrors((p) => ({ ...p, fullName: "" })); }}
                        placeholder="As per your PAN card" error={fieldErrors.fullName}
                      />
                    )}
                    {!isLoginMode && (
                      <div>
                        <label htmlFor="apply-dob-day" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                          Date of Birth <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <DateOfBirthPicker
                          id="apply-dob-day"
                          value={dob}
                          onChange={(v) => { setDob(v); setFieldErrors((p) => ({ ...p, dob: "" })); }}
                          err={fieldErrors.dob}
                        />
                      </div>
                    )}
                    {!isLoginMode && (
                      <>
                        <div>
                          <label htmlFor="apply-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                            Email Address <span className="text-red-500 ml-0.5">*</span>
                          </label>
                          <div className="flex items-start gap-2">
                            <input
                              id="apply-email"
                              type="email"
                              name="email"
                              value={email}
                              onChange={(event) => {
                                setEmail(event.target.value);
                                setFieldErrors((p) => ({ ...p, email: "" }));
                                resetEmailOtp();
                              }}
                              placeholder="you@example.com"
                              disabled={emailVerified}
                              autoComplete="email"
                              className={`min-w-0 flex-1 px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal) disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${fieldErrors.email ? "border-red-400" : "border-(--form-field-border)"}`}
                            />
                            {emailVerified ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendEmailOtp}
                                disabled={emailOtpBusy === "send" || !EMAIL_REGEX.test(cleanEmail)}
                                className="shrink-0 cursor-pointer rounded-lg border border-(--brand-teal) bg-(--brand-teal-14) px-3 py-2.5 text-xs font-bold text-(--brand-navy) transition hover:bg-(--brand-teal-20) disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {emailOtpBusy === "send" ? "Sending…" : emailOtpSent ? "Resend OTP" : "Send OTP"}
                              </button>
                            )}
                          </div>
                          {emailOtpSent && (
                            <div className="mt-2 space-y-2">
                              <CodeBoxes
                                idPrefix="apply-email-otp"
                                label="Email OTP"
                                value={emailOtp}
                                onChange={(v) => { setEmailOtp(v); setEmailOtpError(""); }}
                                invalid={Boolean(emailOtpError)}
                                disabled={emailOtpBusy === "verify"}
                              />
                              <button
                                type="button"
                                onClick={handleVerifyEmailOtp}
                                disabled={emailOtpBusy === "verify" || emailOtp.length !== 6}
                                className="w-full cursor-pointer rounded-lg bg-(--brand-navy) px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {emailOtpBusy === "verify" ? "Verifying…" : "Verify Email"}
                              </button>
                            </div>
                          )}
                          {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                          {emailOtpError && <p className="text-xs text-red-500 mt-1">{emailOtpError}</p>}
                          {emailOtpNotice && !emailOtpError && <p className="mt-1 text-xs font-medium text-emerald-600">{emailOtpNotice}</p>}
                        </div>
                      </>
                    )}

                    {/* Mobile — the backend issues the code, entered right here */}
                    <div className={isLoginMode ? "sm:col-span-2" : ""}>
                      <label htmlFor="apply-mobile" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                        Mobile Number <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="flex items-start gap-2">
                        <input
                          id="apply-mobile"
                          type="tel"
                          name="mobile"
                          autoComplete="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={mobile}
                          disabled={mobileVerified}
                          onChange={(event) => {
                            setMobile(event.target.value.replace(/\D/g, "").slice(0, 10));
                            setFieldErrors((p) => ({ ...p, mobile: "" }));
                            setMobileOtp("");
                            setMobileOtpError("");
                            setMobileOtpNotice("");
                          }}
                          placeholder="10-digit mobile number"
                          className={`min-w-0 flex-1 px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-(--brand-teal-20) focus:border-(--brand-teal) disabled:bg-(--form-field-bg-disabled) disabled:cursor-not-allowed ${fieldErrors.mobile ? "border-red-400" : "border-(--form-field-border)"}`}
                        />
                        {!isLoginMode && (mobileVerified ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendMobileOtp}
                            disabled={mobileOtpBusy === "send" || !MOBILE_REGEX.test(mobile)}
                            className="shrink-0 cursor-pointer rounded-lg border border-(--brand-teal) bg-(--brand-teal-14) px-3 py-2.5 text-xs font-bold text-(--brand-navy) transition hover:bg-(--brand-teal-20) disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {mobileOtpBusy === "send" ? "Checking…" : mobileOtpSent ? "Resend OTP" : "Check number"}
                          </button>
                        ))}
                      </div>
                      {!isLoginMode && mobileOtpSent && (
                        <div className="mt-2 space-y-2">
                          <CodeBoxes
                            idPrefix="apply-mobile-otp"
                            label="Mobile OTP"
                            value={mobileOtp}
                            onChange={(v) => { setMobileOtp(v); setMobileOtpError(""); }}
                            invalid={Boolean(mobileOtpError)}
                            disabled={mobileOtpBusy === "verify"}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyMobileOtp}
                            disabled={mobileOtpBusy === "verify" || mobileOtp.length < 4}
                            className="w-full cursor-pointer rounded-lg bg-(--brand-navy) px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {mobileOtpBusy === "verify" ? "Verifying…" : "Verify Mobile"}
                          </button>
                        </div>
                      )}
                      {fieldErrors.mobile && <p className="text-xs text-red-500 mt-1">{fieldErrors.mobile}</p>}
                      {mobileOtpError && <p className="text-xs text-red-500 mt-1">{mobileOtpError}</p>}
                      {mobileOtpNotice && !mobileOtpError && <p className="mt-1 text-xs font-medium text-emerald-600">{mobileOtpNotice}</p>}
                    </div>

                    {!isLoginMode && (
                      <>
                        <Select
                          label="Continent" name="continent"
                          value={continent}
                          options={continentOptions.map((c) => c.name)}
                          placeholder={continentsLoading ? "Loading…" : "Select continent"}
                          disabled={continentsLoading}
                          onChange={(v) => {
                            setContinent(v);
                            setCountry("");
                            setCountryOptions([]);
                            setCountriesLoading(true);
                            setFieldErrors((p) => ({ ...p, continent: "", country: "" }));
                          }}
                          error={fieldErrors.continent}
                        />
                        <Select
                          label="Country" name="country"
                          value={country}
                          options={countryOptions.map((c) => c.name)}
                          placeholder={
                            !continent ? "Select a continent first" : countriesLoading ? "Loading…" : "Select country"
                          }
                          disabled={!continent || countriesLoading}
                          onChange={(v) => { setCountry(v); setFieldErrors((p) => ({ ...p, country: "" })); }}
                          error={fieldErrors.country}
                        />
                        <Field
                          label="PAN Number" type="text" name="pan"
                          value={pan}
                          maxLength={10}
                          onChange={(v) => { setPan(v); setFieldErrors((p) => ({ ...p, pan: "" })); }}
                          placeholder="ABCDE1234F"
                          error={fieldErrors.pan}
                          extraCls="uppercase tracking-wider"
                          containerCls="sm:col-span-2"
                        />
                      </>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 rounded-lg font-semibold"
                      onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 rounded-lg font-semibold" loading={detailsBusy}>
                      {detailsBusy ? "Sending OTP…" : "Continue →"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2 — the OTP from POST /auth/{loanKey} (apply) or
                  POST /auth/login/request-otp (sign-in). A refused application
                  is told when the API reopens it, so the OTP form itself is
                  withheld while that notice stands. */}
              {step === "otp" && blockedNotice?.kind !== "rejected" && (
                <form onSubmit={handleOtpVerify} className="space-y-3.5" noValidate>
                  {!isLoginMode && (
                    <div className="rounded-xl border border-(--brand-navy-22) bg-(--brand-navy-14) px-4 py-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-800">{productName}</p>
                    </div>
                  )}

                  <div className="text-center pt-1">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-(--brand-navy-22) bg-(--brand-navy-14)">
                      <svg className="h-6 w-6 text-(--brand-navy)" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500">One-time password sent to</p>
                    <p className="text-base font-bold text-slate-900">+91 {mobile}</p>
                  </div>

                  <div>
                    <label htmlFor="apply-otp-0" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-(--form-dark)">
                      Enter OTP <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <CodeBoxes
                      idPrefix="apply-otp"
                      label="Enter OTP"
                      value={otp}
                      onChange={(v) => { setOtp(v); setOtpError(""); }}
                      autoFocus
                      disabled={otpBusy}
                      invalid={Boolean(otpError)}
                    />
                    {otpError && <p className="mt-1 text-xs font-medium text-red-500">{otpError}</p>}
                    {resendNotice && <p className="mt-1 text-[11px] font-medium text-emerald-600">{resendNotice}</p>}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-lg font-semibold"
                      disabled={otpBusy}
                      onClick={() => { setStep("details"); setOtp(""); setOtpError(""); setResendNotice(""); }}
                    >
                      ← Back
                    </Button>
                    <Button type="submit" className="flex-1 rounded-lg font-semibold" loading={otpBusy}>
                      {otpBusy
                        ? "Verifying…"
                        : isLoginMode
                          ? "Verify & Sign In →"
                          : "Verify & Continue →"}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-slate-400">
                    Didn&apos;t get it?{" "}
                    <button
                      type="button"
                      onClick={handleOtpResend}
                      disabled={resending || otpBusy}
                      className="font-semibold text-(--brand-navy) hover:underline disabled:opacity-40 cursor-pointer"
                    >
                      {resending ? "Resending…" : "Resend OTP"}
                    </button>
                  </p>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Security check — asked after the details, before the OTP is sent. */}
      {captchaOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            style={{ zIndex: 115 }}
            onClick={() => { setCaptchaOpen(false); captcha.clearError(); captcha.clearVerification(); }}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 120 }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="apply-security-check-title"
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="px-5 pt-5">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-(--brand-navy)">
                  Before you continue
                </p>
                <h3 id="apply-security-check-title" className="mt-1 text-lg font-extrabold text-slate-900">
                  Security Check
                </h3>
                <p className="mt-1 text-[12.5px] leading-5 text-slate-600">
                  Your details are filled in. Answer the question below and we will send the OTP to
                  +91 {mobile.replace(/\D/g, "").slice(-10)}.
                </p>
              </div>

              <div className="mt-4 px-5">
                <CaptchaField captcha={captcha} idPrefix="apply-captcha" />
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setCaptchaOpen(false); captcha.clearError(); captcha.clearVerification(); }}
                  disabled={captchaBusy}
                  className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void confirmSecurityCheck()}
                  disabled={captchaBusy || captcha.loading}
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-teal-33) disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, var(--brand-teal), var(--brand-navy))" }}
                >
                  {captchaBusy ? "Checking…" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>,
    document.body
  );
};

export default ApplicationModal;
