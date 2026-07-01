import axios from "axios";
import { redirectToLoginForCurrentPath } from "../utils/authRedirect";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const AUTH_REQUESTS_WITH_LOCAL_ERRORS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
];

function shouldShowAuthErrorOnCurrentPage(url?: string) {
  if (!url) return false;
  return AUTH_REQUESTS_WITH_LOCAL_ERRORS.some((path) => url.includes(path));
}

function processQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const sessionMessage = err.response?.data?.message || "Your session expired. Please sign in again.";

    if (
      err.response?.status !== 401 ||
      originalRequest._retry ||
      shouldShowAuthErrorOnCurrentPage(originalRequest.url)
    ) {
      return Promise.reject(err);
    }

    if (originalRequest.url === "/auth/refresh") {
      redirectToLoginForCurrentPath(sessionMessage);
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("auth_refresh_token");
    if (!refreshToken) {
      isRefreshing = false;
      processQueue(err, null);
      redirectToLoginForCurrentPath(sessionMessage);
      return Promise.reject(err);
    }

    try {
      const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      localStorage.setItem("auth_token", newAccessToken);
      localStorage.setItem("auth_refresh_token", newRefreshToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      const refreshMessage = axios.isAxiosError(refreshErr)
        ? refreshErr.response?.data?.message || sessionMessage
        : sessionMessage;
      redirectToLoginForCurrentPath(refreshMessage);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
