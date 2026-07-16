import AppError from "./AppError.js";

export const PASSWORD_REQUIREMENTS = Object.freeze({
  minLength: "At least 8 characters",
  uppercase: "At least one uppercase letter (A-Z)",
  lowercase: "At least one lowercase letter (a-z)",
  number: "At least one number (0-9)",
  special: "At least one special character",
  noWhitespace: "No spaces or whitespace",
});

export function evaluatePassword(password) {
  const value = typeof password === "string" ? password : "";
  return {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9\s]/.test(value),
    noWhitespace: !/\s/.test(value),
  };
}

export function isStrongPassword(password) {
  return Object.values(evaluatePassword(password)).every(Boolean);
}

export function assertStrongPassword(password) {
  if (isStrongPassword(password)) return;
  throw new AppError("Password does not meet the security requirements", 400, {
    code: "WEAK_PASSWORD",
    safeMessage: "Choose a stronger password and complete every requirement.",
    fieldErrors: {
      password: "Use 8+ characters with uppercase, lowercase, number, special character, and no whitespace.",
    },
    details: { requirements: evaluatePassword(password) },
  });
}
