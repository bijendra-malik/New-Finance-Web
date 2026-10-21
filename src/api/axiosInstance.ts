import axios from "axios";
import {
  franchiseApplyErrorInterceptor,
  franchiseApplyRequestInterceptor,
  franchiseApplyResponseInterceptor,
} from "./franchiseFiling";
import { emitAuthCleared } from "../utils/authEvents";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://new-finance-back.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Franchise filings: while the franchisor portal has a product form open for a
// registered client, the form's own apply POST is rewritten to the franchise
// endpoint (and labelled) here. Inert whenever no filing is in progress.
axiosInstance.interceptors.request.use(
  franchiseApplyRequestInterceptor,
  (error) => Promise.reject(error)
);

// Attach the user bearer token to every request if available.
// Franchise portal endpoints now authenticate with the same user token, so
// there is no separate franchise token path anymore.
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

// Handle 401 globally — clear the customer session, and tell the auth provider
// so the UI stops rendering a signed-in state that can no longer request.
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

// Franchise filings: keep the returned receipt coherent and surface franchise
// failure messages through the form's own error surface.
axiosInstance.interceptors.response.use(
  franchiseApplyResponseInterceptor,
  franchiseApplyErrorInterceptor
);

export default axiosInstance;
