const SESSION_NOTICE_KEY = "patheats_session_notice";

export type AuthArea = "user" | "vendor" | "admin";

const AUTH_KEYS = {
  consumer: { token: "consumer_token", refresh: "consumer_refresh_token", user: "consumer_user" },
  vendor:    { token: "vendor_token",    refresh: "vendor_refresh_token",    user: "vendor_user" },
  admin:     { token: "admin_token",     refresh: "admin_refresh_token",     user: "admin_user" },
} as const;

export function getAuthKeys(area: AuthArea) {
  if (area === "vendor") return AUTH_KEYS.vendor;
  if (area === "admin") return AUTH_KEYS.admin;
  return AUTH_KEYS.consumer;
}

export function authAreaFromPath(pathname = window.location.pathname): AuthArea {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/vendor")) return "vendor";
  return "user";
}

export function loginPathForArea(area: AuthArea): string {
  if (area === "admin") return "/admin/login";
  if (area === "vendor") return "/vendor/login";
  return "/user/login";
}

export function loginPathForCurrentPath(pathname = window.location.pathname): string {
  return loginPathForArea(authAreaFromPath(pathname));
}

export function clearAuthStorage(area?: AuthArea) {
  if (area) {
    const { token, refresh, user } = getAuthKeys(area);
    localStorage.removeItem(token);
    localStorage.removeItem(refresh);
    localStorage.removeItem(user);
  } else {
    for (const key of Object.values(AUTH_KEYS)) {
      localStorage.removeItem(key.token);
      localStorage.removeItem(key.refresh);
      localStorage.removeItem(key.user);
    }
  }
  localStorage.removeItem("patheat_user");
  window.dispatchEvent(new Event("patheats:auth-cleared"));
}

export function setSessionNotice(message: string) {
  sessionStorage.setItem(SESSION_NOTICE_KEY, message);
}

export function consumeSessionNotice() {
  const message = sessionStorage.getItem(SESSION_NOTICE_KEY) || "";
  if (message) sessionStorage.removeItem(SESSION_NOTICE_KEY);
  return message;
}

export function redirectToLoginForCurrentPath(message = "Your session expired. Please sign in again.") {
  const loginPath = loginPathForCurrentPath();
  const area = authAreaFromPath();
  clearAuthStorage(area);
  setSessionNotice(message);

  if (window.location.pathname !== loginPath) {
    window.location.replace(loginPath);
    return;
  }

  window.dispatchEvent(new CustomEvent("patheats:session-notice", { detail: message }));
}
