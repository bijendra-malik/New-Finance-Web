import axios from "axios";
import {
  franchiseApplyErrorInterceptor,
  franchiseApplyRequestInterceptor,
  franchiseApplyResponseInterceptor,
} from "./franchiseFiling";
import { emitAuthCleared } from "../utils/authEvents";
import { getDraftId, rememberDraftId } from "../utils/applySession";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://new-finance-back.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isApplyPost =
      (config.method ?? "get").toLowerCase() === "post" &&
      (config.url ?? "").endsWith("/customer/loan-apply");
    if (!isApplyPost) return config;
    const body =
      config.data && typeof config.data === "object" && !Array.isArray(config.data)
        ? (config.data as Record<string, unknown>)
        : null;
    if (!body || body.draftId) return config;
    const draftId =
      typeof body.product === "string" ? getDraftId(body.product) : null;
    if (draftId) config.data = { ...body, draftId };
    return config;
  },
  (error) => Promise.reject(error)
);

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
    // request. Persist exactly the ID it returns for that product.
    if (isLoanApply && typeof requestBody?.product === "string" && draftId) {
      rememberDraftId(requestBody.product, draftId);
    }
    return response;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
