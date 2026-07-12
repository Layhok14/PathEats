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

const AUTH_PATHS_KEEP_LOCAL = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
]);

function isFormDataPayload(data: unknown) {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

function removeContentTypeHeader(headers: unknown) {
  if (!headers || typeof headers !== "object") return;

  const maybeAxiosHeaders = headers as { delete?: (name: string) => void };
  if (typeof maybeAxiosHeaders.delete === "function") {
    maybeAxiosHeaders.delete("Content-Type");
    maybeAxiosHeaders.delete("content-type");
    return;
  }

  const plainHeaders = headers as Record<string, unknown>;
  delete plainHeaders["Content-Type"];
  delete plainHeaders["content-type"];
}

function shouldShowAuthErrorOnCurrentPage(url?: string) {
  if (!url) return false;
  return AUTH_PATHS_KEEP_LOCAL.has(url);
}

function processQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  pendingQueue = [];
}

function portalPrefixForCurrentPath(): "consumer" | "vendor" | "admin" | "developer" | "business" {
  const pathname = window.location.pathname;
  if (pathname.startsWith("/developer")) return "developer";
  if (pathname.startsWith("/business")) return "business";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/vendor")) return "vendor";
  return "consumer";
}

function prefixForUrl(url?: string): "consumer" | "vendor" | "admin" | "developer" | "business" {
  if (!url) return "consumer";
  if (url.startsWith("/vendor") || url.startsWith("vendor")) return "vendor";
  if (url.startsWith("/admin") || url.startsWith("admin")) return portalPrefixForCurrentPath();
  if (url.startsWith("/dev") || url.startsWith("dev")) return portalPrefixForCurrentPath();
  if (url.startsWith("/business") || url.startsWith("business")) return "business";
  if (url.startsWith("/developer") || url.startsWith("developer")) return "developer";
  return "consumer";
}

function getTokenForUrl(url?: string): string | null {
  const prefix = prefixForUrl(url);
  return localStorage.getItem(`${prefix}_token`);
}

function getRefreshTokenForUrl(url?: string): string | null {
  const prefix = prefixForUrl(url);
  return localStorage.getItem(`${prefix}_refresh_token`);
}

function saveTokensForUrl(url: string | undefined, accessToken: string, refreshToken: string) {
  const prefix = prefixForUrl(url);
  localStorage.setItem(`${prefix}_token`, accessToken);
  localStorage.setItem(`${prefix}_refresh_token`, refreshToken);
}

api.interceptors.request.use((config) => {
  if (isFormDataPayload(config.data)) {
    removeContentTypeHeader(config.headers);
  }

  const token = getTokenForUrl(config.url);
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

    const refreshToken = getRefreshTokenForUrl(originalRequest.url);
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

      saveTokensForUrl(originalRequest.url, newAccessToken, newRefreshToken);

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
