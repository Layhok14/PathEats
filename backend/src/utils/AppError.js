import { DEFAULT_ERROR_CODES, severityForStatus } from "./errorCodes.js";

class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    if (typeof statusCode === "object") {
      options = statusCode;
      statusCode = options.statusCode ?? 500;
    }

    super(message);
    this.statusCode = Number(statusCode) || 500;
    this.isOperational = true;
    this.code = options.code || DEFAULT_ERROR_CODES[this.statusCode] || "APP_ERROR";
    this.safeMessage = options.safeMessage || null;
    this.details = options.details || null;
    this.fieldErrors = options.fieldErrors || null;
    this.severity = options.severity || severityForStatus(this.statusCode);
    this.expose = options.expose ?? this.statusCode < 500;
  }
}

export default AppError;
