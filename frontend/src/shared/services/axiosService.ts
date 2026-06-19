import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const session = localStorage.getItem("patheat_user");
    if (session) {
      const user = JSON.parse(session);
      if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch { /* ignore parse errors */ }
  return config;
});

// Handle 401 globally — clear session and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("patheat_user");

      const isAdminArea =
        window.location.pathname.startsWith("/admin") ||
        window.location.pathname.startsWith("/customer-service") ||
        window.location.pathname.startsWith("/developer");

      if (!isAdminArea) {
        window.location.href = "/user";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
