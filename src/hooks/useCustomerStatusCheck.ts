import { useCallback, useMemo, useState } from "react";
import {
  requestCustomerStatusOtp,
  verifyCustomerStatusOtp,
  type CustomerStatusResponse,
} from "../api/statusTracking";
import { useAuth } from "../context/authContext";
import { accountFieldDefaults } from "../utils/accountProfile";
import { getApiErrorMessage } from "../utils/apiError";
import { MOBILE_REGEX, PAN_REGEX } from "../utils/validation";

export type StatusCheckStage = "verify" | "otp" | "result";

export interface StatusCheckErrors {
  customerId?: string;
  panNumber?: string;
  mobile?: string;
  otp?: string;
}

const maskMobile = (mobile: string): string =>
  mobile.length === 10 ? `${mobile.slice(0, 2)}******${mobile.slice(-2)}` : mobile;

export const useCustomerStatusCheck = () => {
  const { user } = useAuth();
  const accountDefaults = useMemo(() => accountFieldDefaults(), []);
  const [customerId, setCustomerId] = useState(() => (user?.customerId ?? "").trim().toUpperCase());
  const [panNumber, setPanNumber] = useState(() =>
    (user?.panNumber ?? accountDefaults.panNumber ?? "").trim().toUpperCase(),
  );
  const [mobile, setMobile] = useState(() => (user?.mobile ?? "").replace(/\D/g, "").slice(0, 10));
  const [stage, setStage] = useState<StatusCheckStage>("verify");
  const [otp, setOtp] = useState("");
  const [otpMaskedMobile, setOtpMaskedMobile] = useState("");
  const [errors, setErrors] = useState<StatusCheckErrors>({});
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [result, setResult] = useState<CustomerStatusResponse | null>(null);

  const maskedMobile = useMemo(() => maskMobile(mobile), [mobile]);
  /** Anything the account could not supply, so the customer has to type it. */
  const missing = useMemo(
    () => ({ customerId: !customerId, panNumber: !panNumber, mobile: !mobile }),
    [customerId, panNumber, mobile],
  );
  const needsManualEntry = missing.customerId || missing.panNumber || missing.mobile;

  const clearError = useCallback((key: keyof StatusCheckErrors) => {
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }, []);

  const requestOtp = useCallback(
    async (isResend = false): Promise<boolean> => {
      const id = customerId.trim().toUpperCase();
      const pan = panNumber.trim().toUpperCase();
      const next: StatusCheckErrors = {};
      // No format check on the customer ID: the ID scheme is not final yet.
      if (!id) next.customerId = "Enter your customer ID";
      if (!PAN_REGEX.test(pan)) next.panNumber = "Enter a valid PAN number";
      if (!MOBILE_REGEX.test(mobile)) next.mobile = "Enter your registered 10-digit mobile number";
      setErrors(next);
      if (Object.keys(next).length > 0) return false;

      const setPending = isResend ? setResending : setBusy;
      setPending(true);
      setApiError("");
      setNotice("");
      try {
        const response = await requestCustomerStatusOtp({ customerId: id, panNumber: pan, mobile });
        if (!response.success) {
          setApiError(
            response.message || "We could not send the OTP for those details. Please check them and try again.",
          );
          return false;
        }
        setOtpMaskedMobile(response.mobileMasked?.trim() || maskMobile(mobile));
        setOtp("");
        setStage("otp");
        if (isResend) setNotice(response.message || "A new OTP has been sent.");
        return true;
      } catch (error) {
        setApiError(
          getApiErrorMessage(
            error,
            "We could not send the OTP. Check the customer ID, PAN and mobile number, then try again.",
          ),
        );
        return false;
      } finally {
        setPending(false);
      }
    },
    [customerId, panNumber, mobile],
  );

  const verifyOtp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!/^\d{6}$/.test(otp)) {
        setErrors((previous) => ({ ...previous, otp: "Enter the 6-digit OTP sent to your mobile" }));
        return;
      }
      setBusy(true);
      setApiError("");
      setNotice("");
      try {
        const response = await verifyCustomerStatusOtp({ mobile, otp });
        if (!response.success) {
          setApiError(response.message || "The OTP was not accepted. Please check it and try again.");
          return;
        }
        setResult(response);
        setStage("result");
      } catch (error) {
        setApiError(
          getApiErrorMessage(error, "We could not verify that OTP. Request a new one and try again."),
        );
      } finally {
        setBusy(false);
      }
    },
    [mobile, otp],
  );

  /** Back to the confirmation step, e.g. to resend to a corrected mobile number. */
  const editDetails = useCallback(() => {
    setStage("verify");
    setOtp("");
    setApiError("");
    setNotice("");
    setErrors({});
  }, []);

  const checkAgain = useCallback(() => {
    setResult(null);
    setStage("verify");
    setOtp("");
    setApiError("");
    setNotice("");
    setErrors({});
  }, []);

  return {
    customerId, panNumber, mobile, setCustomerId, setPanNumber, setMobile, maskedMobile, missing, needsManualEntry, stage, otp, setOtp, otpMaskedMobile, errors, clearError, apiError, notice, busy, resending, result, requestOtp, verifyOtp, editDetails, checkAgain,
  };
};

export default useCustomerStatusCheck;
