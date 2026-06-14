// Central HTTP client — mirrors the Axios API surface using native fetch.
// When axios is available (pnpm add axios), replace this file with the axios version.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:4000/api";
const SESSION_KEY = "patheat_user";

function getAuthHeader(): Record<string, string> {
  try {
    const user = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
    if (user?.token) return { Authorization: `Bearer ${user.token}` };
  } catch { /* malformed session */ }
  return {};
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "/";
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json() as Promise<T>;
}

// Axios-compatible surface so service files don't need to change when swapping
export const apiClient = {
  get:    <T>(path: string)                  => request<T>("GET",    path),
  post:   <T>(path: string, body?: unknown)  => request<T>("POST",   path, body),
  patch:  <T>(path: string, body?: unknown)  => request<T>("PATCH",  path, body),
  delete: <T>(path: string)                  => request<T>("DELETE", path),
};
