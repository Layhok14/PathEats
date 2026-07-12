import { randomUUID } from "crypto";
import AppError from "../utils/AppError.js";
import { DEFAULT_ERROR_CODES, FRIENDLY_MESSAGES } from "../utils/errorCodes.js";

function statusFromError(err) {
  const status = Number(err.statusCode || err.status || 500);
  if (status < 400 || status > 599) return 500;
  return status;
}

function errorCode(err, statusCode) {
  if (err.isOperational && err.code) return err.code;
  return DEFAULT_ERROR_CODES[statusCode] || "INTERNAL_ERROR";
}

function publicMessage(err, statusCode) {
  if (err.safeMessage) return err.safeMessage;
  if (err.isOperational && err.expose !== false) return err.message;
  return FRIENDLY_MESSAGES[statusCode] || FRIENDLY_MESSAGES[500];
}

function requestTraceId(req) {
  const header = req.headers["x-request-id"];
  return typeof header === "string" && header.trim() ? header.trim() : randomUUID();
}

/**
 * Global Express error handler.
 * Catches all errors thrown via `next(err)` or `throw` in async handlers.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = statusFromError(err);
  const traceId = requestTraceId(req);
  const code = errorCode(err, statusCode);
  const message = publicMessage(err, statusCode);
  const severity = err.severity || (statusCode >= 500 ? "error" : "warning");

  res.setHeader("X-Trace-Id", traceId);

  const logPayload = {
    traceId,
    severity,
    statusCode,
    code,
    method: req.method,
    path: req.originalUrl,
    actorId: req.user?.sub ?? null,
    actorRole: req.user?.role_scope ?? null,
    ip: req.ip,
    userAgent: req.get("user-agent") ?? null,
    message: err.message,
    safeMessage: message,
    details: err.details ?? null,
    cause: err.cause?.message ?? null,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };

  const logLine = JSON.stringify(logPayload);
  if (severity === "error") console.error(logLine);
  else console.warn(logLine);

  res.status(statusCode).json({
    success: false,
    code,
    message,
    traceId,
    ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
    ...(process.env.NODE_ENV === "development" && {
      debug: {
        message: err.message,
        stack: err.stack,
      },
    }),
  });
}

/**
 * 404 handler for unknown routes.
 * Must be mounted after all route registrations.
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, {
    code: "ROUTE_NOT_FOUND",
    safeMessage: "We could not find that page or API route.",
    severity: "info",
  }));
}
