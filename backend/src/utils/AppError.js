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
    this.isOperational = true; // set that the error is predictable or just error edge case in client side, not server error or bug in system
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

// The function inherits from the built-in Error Class and assigned the statusCode of error handling 
// in the codebase to the constructior alongside with the flag to set that the error is user's side cause and not bug in code.
// Then it shows the file name,function, line number which the error was caused or occured from. 