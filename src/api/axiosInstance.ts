import axios from "axios";
import { FRANCHISE_TOKEN_KEY, clearFranchiseSession } from "../utils/franchiseSession";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://new-finance-back.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const isFranchiseEndpoint = (url: string): boolean =>
  url.startsWith("/franchise/") || url.startsWith("/auth/franchise/");

// Attach token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url ?? "";
    const token = isFranchiseEndpoint(url)
      ? localStorage.getItem(FRANCHISE_TOKEN_KEY) ?? localStorage.getItem("token")
      : localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear the session that the rejected call belongs to
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url: string = error.config?.url ?? "";
      if (isFranchiseEndpoint(url)) {
        // A failed franchise call must not sign the customer out.
        clearFranchiseSession();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
