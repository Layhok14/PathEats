import nodemailer from "nodemailer";
import AppError from "../utils/AppError.js";

let transporter = null;

function cleanEnv(value) {
  return String(value || "").trim();
}

function isPlaceholder(value) {
  const normalized = cleanEnv(value).toLowerCase();
  return !normalized || normalized.includes("your_") || normalized.includes("change_me");
}

function smtpConfig() {
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  return {
    host: cleanEnv(process.env.SMTP_HOST || "smtp.gmail.com"),
    port: Number.isFinite(port) ? port : 587,
    user: cleanEnv(process.env.SMTP_USER),
    pass: cleanEnv(process.env.SMTP_PASS),
    from: cleanEnv(process.env.SMTP_FROM) || cleanEnv(process.env.SMTP_USER),
  };
}

export function getSmtpStatus() {
  const config = smtpConfig();
  const missing = [];

  if (!config.host) missing.push("SMTP_HOST");
  if (!config.port) missing.push("SMTP_PORT");
  if (isPlaceholder(config.user)) missing.push("SMTP_USER");
  if (isPlaceholder(config.pass)) missing.push("SMTP_PASS");
  if (!config.from) missing.push("SMTP_FROM");

  return {
    configured: missing.length === 0,
    missing,
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    from: config.from,
  };
}

function requireSmtpConfig() {
  const status = getSmtpStatus();
  if (status.configured) return smtpConfig();

  throw new AppError("SMTP is not configured for OTP email.", 503, {
    code: "SMTP_NOT_CONFIGURED",
    safeMessage: "Password reset email is not configured yet. Ask an administrator to finish SMTP setup.",
    details: { missing: status.missing },
  });
}

function getTransporter() {
  if (transporter) return transporter;

  const config = requireSmtpConfig();
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return transporter;
}

export async function verifyEmailTransport() {
  await getTransporter().verify();
  return getSmtpStatus();
}

/**
 * Send an OTP email to the user.
 * @param {string} to - recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {'email_verify'|'password_reset'} type - purpose
 */
export async function sendOTPEmail(to, otp, type = "password_reset") {
  const config = requireSmtpConfig();
  const subject =
    type === "email_verify"
      ? "Verify Your Email - PathEats"
      : "Password Reset OTP - PathEats";

  const purpose =
    type === "email_verify" ? "verify your email address" : "reset your password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #006e2f;">PathEats</h2>
      <p>You requested to ${purpose}.</p>
      <p>Your one-time password (OTP) is:</p>
      <h1 style="color: #006e2f; font-size: 48px; letter-spacing: 8px; text-align: center;">${otp}</h1>
      <p>This OTP will expire in <strong>15 minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr />
      <p style="color: #6B7280; font-size: 12px;">This is an automated message from PathEats. Please do not reply to this email.</p>
    </div>
  `;

  try {
    const info = await getTransporter().sendMail({
      from: config.from,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`, { to, type });
    return info;
  } catch (error) {
    if (error?.isOperational) throw error;
    console.error("Email sending failed:", error.message, { to, type });
    throw new AppError("SMTP email delivery failed.", 502, {
      code: "SMTP_DELIVERY_FAILED",
      safeMessage: "Could not send the OTP email. Check SMTP credentials and try again.",
      details: {
        responseCode: error.responseCode || null,
        command: error.command || null,
      },
    });
  }
}
