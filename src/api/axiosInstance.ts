import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://new-finance-back.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Handle 401 globally — clear the customer session.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
