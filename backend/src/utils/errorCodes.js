export const DEFAULT_ERROR_CODES = {
  400: "BAD_REQUEST",
  401: "AUTHENTICATION_REQUIRED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_FAILED",
  429: "RATE_LIMITED",
  500: "INTERNAL_ERROR",
};

export const FRIENDLY_MESSAGES = {
  400: "Check your input and try again.",
  401: "Your session expired. Please sign in again.",
  403: "You do not have permission to do that.",
  404: "We could not find what you asked for.",
  409: "That change conflicts with existing data.",
  422: "Some information needs to be corrected.",
  429: "Too many requests. Please wait and try again.",
  500: "Something went wrong. Please try again.",
};

export function severityForStatus(statusCode) {
  if (statusCode >= 500) return "error";
  if (statusCode === 401 || statusCode === 403) return "warning";
  return "info";
}
