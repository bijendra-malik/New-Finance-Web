import axios from "axios";
import {
  franchiseApplyErrorInterceptor,
  franchiseApplyRequestInterceptor,
  franchiseApplyResponseInterceptor,
} from "./franchiseFiling";
import { emitAuthCleared } from "../utils/authEvents";
import { purgeSessionCredentials } from "../utils/sessionCredentials";
import { rememberPendingCreditScoreDraft } from "../utils/applicationFlowState";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://new-finance-back.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  franchiseApplyRequestInterceptor,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const isLoanApply =
      (response.config.method ?? "get").toLowerCase() === "post" &&
      (response.config.url ?? "").endsWith("/customer/loan-apply");
    const requestBody = (() => {
      if (response.config.data && typeof response.config.data === "object" && !Array.isArray(response.config.data)) {
        return response.config.data as Record<string, unknown>;
      }
      if (typeof response.config.data !== "string") return null;
      try {
        const parsed: unknown = JSON.parse(response.config.data);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? parsed as Record<string, unknown>
          : null;
      } catch {
        return null;
      }
    })();
    const payload =
      response.data && typeof response.data === "object" && !Array.isArray(response.data)
        ? response.data as Record<string, unknown>
        : null;
    const data =
      payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)
        ? payload.data as Record<string, unknown>
        : null;
    const responseDraft =
      payload?.draft && typeof payload.draft === "object" && !Array.isArray(payload.draft)
        ? payload.draft as Record<string, unknown>
        : null;
    const draft =
      data?.draft && typeof data.draft === "object" && !Array.isArray(data.draft)
        ? data.draft as Record<string, unknown>
        : null;
    const draftId =
      // Actual loan-apply response: { product, nextStep, draft: { draftId } }.
      (typeof responseDraft?.draftId === "string" && responseDraft.draftId) ||
      (typeof payload?.draftId === "string" && payload.draftId) ||
      (typeof data?.draftId === "string" && data.draftId) ||
      (typeof draft?.draftId === "string" && draft.draftId) ||
      (typeof data?._id === "string" && data._id);

    // The loan form endpoint creates the draft used by the next credit-score
    // request. Persist exactly the ID it returns, but never send a browser-
    // created ID back to the endpoint.
    if (isLoanApply && typeof requestBody?.product === "string" && draftId) {
      try {
        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) as { _id?: unknown } : null;
        if (typeof user?._id === "string" && user._id) {
          const createdAt =
            (typeof responseDraft?.createdAt === "string" && responseDraft.createdAt) ||
            (typeof draft?.createdAt === "string" && draft.createdAt) ||
            new Date().toISOString();
          rememberPendingCreditScoreDraft(
            user._id,
            requestBody.product,
            draftId,
            createdAt,
            { ...requestBody, _id: draftId, createdAt },
          );
        }
      } catch {
        // The application has been saved on the backend even if local recovery
        // state cannot be recorded (for example, disabled browser storage).
      }
    }
    return response;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      purgeSessionCredentials();
      emitAuthCleared();
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  franchiseApplyResponseInterceptor,
  franchiseApplyErrorInterceptor
);

export default axiosInstance;
