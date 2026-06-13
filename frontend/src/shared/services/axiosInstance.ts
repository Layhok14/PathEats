// Central HTTP client configuration — install axios and uncomment when backend is ready:
// import axios from "axios";
//
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
//   timeout: 10000,
//   headers: { "Content-Type": "application/json" },
// });
//
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
//
// export default axiosInstance;

// Placeholder until axios is installed via: pnpm add axios
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
