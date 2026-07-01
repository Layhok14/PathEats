const SESSION_NOTICE_KEY = "patheats_session_notice";

export type AuthArea = "user" | "vendor" | "admin";

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

export function clearAuthStorage() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_refresh_token");
  localStorage.removeItem("auth_user");
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
  clearAuthStorage();
  setSessionNotice(message);

  if (window.location.pathname !== loginPath) {
    window.location.replace(loginPath);
    return;
  }

  window.dispatchEvent(new CustomEvent("patheats:session-notice", { detail: message }));
}
