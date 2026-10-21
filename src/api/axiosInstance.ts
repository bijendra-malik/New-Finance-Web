import axios from "axios";
import {
  franchiseApplyErrorInterceptor,
  franchiseApplyRequestInterceptor,
  franchiseApplyResponseInterceptor,
} from "./franchiseFiling";
import { emitAuthCleared } from "../utils/authEvents";
import { getDraftId } from "../utils/applySession";

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
