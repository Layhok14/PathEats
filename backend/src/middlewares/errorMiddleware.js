import AppError from "../utils/AppError.js";

/**
 * Global Express error handler.
 * Catches all errors thrown via `next(err)` or `throw` in async handlers.
 */
export function errorHandler(err, req, res, next) {
  // Default to 500 for unexpected errors
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  console.error(`[${statusCode}] ${err.message}`);
  if (!err.isOperational) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * 404 handler for unknown routes.
 * Must be mounted after all route registrations.
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}
