const DEFAULT_CODES = {
  400: "BAD_REQUEST",
  401: "AUTHENTICATION_REQUIRED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION_FAILED",
  429: "RATE_LIMITED",
  500: "INTERNAL_ERROR",
};

const severityForStatus = (statusCode) => {
  if (statusCode >= 500) return "error";
  if (statusCode === 401 || statusCode === 403) return "warning";
  return "info";
};

class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    if (typeof statusCode === "object") {
      options = statusCode;
      statusCode = options.statusCode ?? 500;
    }

    super(message);
    this.statusCode = Number(statusCode) || 500;
    this.isOperational = true;
    this.code = options.code || DEFAULT_CODES[this.statusCode] || "APP_ERROR";
    this.safeMessage = options.safeMessage || null;
    this.details = options.details || null;
    this.fieldErrors = options.fieldErrors || null;
    this.severity = options.severity || severityForStatus(this.statusCode);
    this.expose = options.expose ?? this.statusCode < 500;
  }
}

export default AppError;
