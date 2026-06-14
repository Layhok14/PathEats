/**
 * Custom operational error class.
 * Throw this from services/repositories to signal known failure modes.
 * The global error middleware uses `isOperational` to decide
 * whether to show the message to the client.
 */
class AppError extends Error {
  /**
   * @param {string}  message     — Human-readable error description
   * @param {number}  statusCode  — HTTP status code (4xx or 5xx)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
