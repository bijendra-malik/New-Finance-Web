import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  PAN_REGEX,
  isAtLeastAge,
  isAtMostAge,
} from "../../utils/validation";
import { useSetApplicantPrefill } from "../../context/applicantPrefillContext";
import { useAuth } from "../../context/authContext";
import {
  requestLoanApplyOTP,
  requestLoginOTP,
  verifyLoginOTP,
  verifyOTP,
  type AuthActionResponse,
} from "../../api/auth";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useCaptcha } from "../../hooks/useCaptcha";
import { useEmailOtp } from "../../hooks/useEmailOtp";
import { useLocationMasters } from "../../hooks/useLocationMasters";
import { getApiErrorMessage } from "../../utils/apiError";
import { loanKeyFor } from "../../constants/loanSlugs";
import { loanLabelFor, loanRouteFor } from "../../constants/loanRoutes";
import { markApplySessionPending } from "../../utils/applySession";
import {
  clearPendingCreditScoreDraft,
  readPendingCreditScoreDraft,
  readSubmittedApplication,
  remainingCreditScoreWindow,
} from "../../utils/applicationFlowState";
import {
  alreadyAppliedError,
  formatDay,
  isAlreadyRegisteredResponse,
  type ApplicationModalProps,
  type BlockedNotice,
} from "./applicationModalHelpers";

export const useApplicationModalForm = ({
  isOpen,
  onClose,
  productName = "",
  activeProduct,
}: ApplicationModalProps) => {
  const navigate = useNavigate();
  const setApplicantPrefill = useSetApplicantPrefill();
  const { login, isLoggedIn, user } = useAuth();
  const captcha = useCaptcha();

  const openedAsLogin = productName.trim().toLowerCase() === "log in";
  const [mode, setMode] = useState<"signup" | "signin">(openedAsLogin ? "signin" : "signup");

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [pan, __setPan] = useState("");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const {
    continents: continentOptions,
    countries: countryOptions,
    continentsLoading,
    countriesLoading,
  } = useLocationMasters(continent);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const {
    cleanEmail,
    verified: emailVerified,
    sent: emailOtpSent,
    unavailable: emailOtpUnavailable,
    code: emailOtp,
    setCode: setEmailOtp,
    busy: emailOtpBusy,
    error: emailOtpError,
    setError: setEmailOtpError,
    notice: emailOtpNotice,
    send: handleSendEmailOtp,
    verify: verifyEmailCode,
    reset: resetEmailOtp,
  } = useEmailOtp({ email, fullName });
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

  /** Email edit: clears its error and invalidates any code sent to the old address. */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setFieldErrors((p) => ({ ...p, email: "" }));
    resetEmailOtp();
  };

  /** Mobile edit: digits only; any code sent to the previous number no longer applies. */
  const handleMobileChange = (value: string) => {
    setMobile(value.replace(/\D/g, "").slice(0, 10));
    setFieldErrors((p) => ({ ...p, mobile: "" }));
    setMobileOtp("");
    setMobileOtpError("");
    setMobileOtpNotice("");
  };

  /** A new continent resets the country list and its selection. */
  const selectContinent = (name: string) => {
    setContinent(name);
    setCountry("");
    setFieldErrors((p) => ({ ...p, continent: "", country: "" }));
  };

  /** Verify the emailed code and clear the field error once it is accepted. */
  const handleVerifyEmailOtp = () =>
    verifyEmailCode(() => setFieldErrors((p) => ({ ...p, email: "" })));

  const [detailsBusy, setDetailsBusy] = useState(false);

  // ── Step 2 — the OTP gate (POST /auth/personal-loan → POST /auth/verify-otp) ──
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendNotice, setResendNotice] = useState("");
  const [resending, setResending] = useState(false);
  const [pendingDashboard, setPendingDashboard] = useState("");
  const [sessionWasSignedIn, setSessionWasSignedIn] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [blockedNotice, setBlockedNotice] = useState<BlockedNotice | null>(null);
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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
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

  useBodyScrollLock(isOpen);

  const productKey = activeProduct?.id ?? productName;
  const loanKey = loanKeyFor(productKey);
  const isLoginMode = mode === "signin";
  const securityVerified = captcha.verified;

  const formatAvailableAt = (value?: string): string => {
    if (!value) return "";
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? "" : formatDay(new Date(ms));
  };

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
        detail:
          "A stronger credit score, or clearing existing dues, can change the outcome. Another product may still suit your profile today.",
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
    if (!value.trim()) {
      e[name] = "PAN is required";
      return;
    }
    if (!PAN_REGEX.test(value)) {
      e[name] = "Enter a valid PAN, e.g. ABCDE1234F";
      return;
    }
  };

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

// (POST /auth/{loanKey}); the sign-in flow hits POST /auth/login/request-otp.
  const requestOtp = (): Promise<AuthActionResponse> => {
    if (!loanKey) {
      return Promise.reject(new Error("This product cannot be applied for yet."));
    }
    if (isLoginMode) return requestLoginOTP({ mobile });
    return requestLoanApplyOTP(loanKey, applyIdentity());
  };

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

  const sendOtpCode = async (inline: boolean, withCaptcha = true) => {
    setApiError("");
    if (inline) setMobileOtpError("");

    const dashboardPath = loanRouteFor(productKey)?.dashboard;
    if (!dashboardPath || !loanKey) {
      const message = "Application form is not available for this product yet.";
      if (inline) setMobileOtpError(message);
      else setApiError(message);
      return;
    }

    setSessionWasSignedIn(isLoggedIn);
    if (inline) setMobileOtpBusy("send");
    else setDetailsBusy(true);
    try {
      if (withCaptcha) {
        const captchaProblem = await captcha.verify();
        if (captchaProblem) {
          if (inline) setMobileOtpError(captchaProblem);
          else setApiError(captchaProblem);
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
              const message =
                loginOtp.message || "We could not send the OTP just now. Please try again.";
              if (inline) setMobileOtpError(message);
              else setApiError(message);
              return;
            }
            setAlreadyRegistered(true);
            markOtpSent(dashboardPath, inline);
          } catch (loginError) {
            const message = getApiErrorMessage(
              loginError,
              "We could not send the OTP just now. Please try again.",
            );
            if (inline) setMobileOtpError(message);
            else setApiError(message);
          }
          return;
        }
        const message = response.message || "We could not send the OTP just now. Please try again.";
        if (inline) setMobileOtpError(message);
        else setApiError(message);
        return;
      }
      markOtpSent(dashboardPath, inline);
    } catch (err) {
      const blocked = alreadyAppliedError(err);
      if (blocked) {
        const record = readSubmittedApplication(user?._id ?? mobile, loanKey);
        if (inline) setMobileOtpError("");
        else setApiError("");
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
      if (inline) setMobileOtpError(message);
      else setApiError(message);
    } finally {
      if (inline) setMobileOtpBusy("");
      else setDetailsBusy(false);
    }
  };

  /** Step 1 — save the details and send the apply-flow OTP. */
  const handleDetailsSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    if (!validateDetails()) return;
    if (mobileOtpSent) {
      setStep("otp");
      return;
    }
    if (!securityVerified) {
      setCaptchaOpen(true);
      return;
    }
    await sendOtpCode(false);
  };

  const confirmSecurityCheck = async () => {
    if (captchaBusy) return;
    setCaptchaBusy(true);
    const problem = await captcha.verify();
    setCaptchaBusy(false);
    if (problem) return;
    setCaptchaOpen(false);
    await sendOtpCode(false);
  };

  const sendMobileOtpCode = async () => {
    setMobileOtpBusy("send");
    setMobileOtpError("");
    setMobileOtpNotice("");
    const newNumberNotice =
      "This number is not registered yet. Add your details and press Continue — we will verify the number then.";
    try {
      if (isLoginMode) {
        await sendOtpCode(true, false);
        return;
      }
      const response = await requestLoginOTP({ mobile });
      if (response.success) {
        switchMode("signin");
        setAlreadyRegistered(true);
        setSessionWasSignedIn(isLoggedIn);
        markOtpSent(loanRouteFor(productKey)?.dashboard ?? "", false);
        return;
      }
      setMobileOtpNotice(newNumberNotice);
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "We could not check this number just now. Please try again.",
      );
      if (/not\s+(found|registered|exist)|does not exist|no user|unregistered/i.test(message)) {
        setMobileOtpNotice(newNumberNotice);
      } else {
        setMobileOtpError(message);
      }
    } finally {
      setMobileOtpBusy("");
    }
  };

  const handleSendMobileOtp = async () => {
    if (!MOBILE_REGEX.test(mobile)) {
      setMobileOtpError("Enter a valid 10-digit mobile number first");
      return;
    }
    await sendMobileOtpCode();
  };

  const verifyMobileCode = async (code: string, setError: (message: string) => void) => {
    if (!loanKey) {
      setError("Please start sign-in from the loan product you want to apply for.");
      return;
    }
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
            const draftDashboard = loanRouteFor(pendingDraft.loanKey)?.dashboard;
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
  const handleOtpVerify = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const code = otp.trim();
    if (!code) {
      setOtpError("Please enter the OTP");
      return;
    }
    if (!/^\d{4,8}$/.test(code)) {
      setOtpError("Enter a valid OTP");
      return;
    }
    setOtpBusy(true);
    setOtpError("");
    await verifyMobileCode(code, setOtpError);
    setOtpBusy(false);
  };

  /** Verifies the code typed beside the mobile number. */
  const handleVerifyMobileOtp = async () => {
    const code = mobileOtp.replace(/\D/g, "");
    if (!/^\d{4,8}$/.test(code)) {
      setMobileOtpError("Enter the OTP sent to your mobile");
      return;
    }
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

  return {
    navigate,
    productName,
    loanKey,
    mode,
    isLoginMode,
    step,
    fullName,
    setFullName,
    mobile,
    handleMobileChange,
    email,
    handleEmailChange,
    dob,
    setDob,
    pan,
    setPan,
    cleanEmail,
    continent,
    selectContinent,
    country,
    setCountry,
    continentOptions,
    continentsLoading,
    countryOptions,
    countriesLoading,
    fieldErrors,
    setFieldErrors,
    emailVerified,
    emailOtp,
    setEmailOtp,
    emailOtpBusy,
    emailOtpError,
    setEmailOtpError,
    emailOtpNotice,
    emailOtpSent,
    handleSendEmailOtp,
    handleVerifyEmailOtp,
    mobileVerified,
    mobileOtp,
    setMobileOtp,
    mobileOtpBusy,
    mobileOtpError,
    setMobileOtpError,
    mobileOtpNotice,
    setMobileOtpNotice,
    mobileOtpSent,
    handleSendMobileOtp,
    handleVerifyMobileOtp,
    apiError,
    blockedNotice,
    setBlockedNotice,
    alreadyRegistered,
    detailsBusy,
    handleDetailsSubmit,
    otp,
    setOtp,
    otpError,
    setOtpError,
    otpBusy,
    resendNotice,
    setResendNotice,
    resending,
    handleOtpVerify,
    handleOtpResend,
    captcha,
    captchaOpen,
    setCaptchaOpen,
    captchaBusy,
    confirmSecurityCheck,
    handleClose,
    switchMode,
    setStep,
  };
};

export type ApplicationModalForm = ReturnType<typeof useApplicationModalForm>;
