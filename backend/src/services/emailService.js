import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: parseInt(process.env.SMTP_PORT || "587") === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an OTP email to the user.
 * @param {string} to - recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {'email_verify'|'password_reset'} type - purpose
 */
export async function sendOTPEmail(to, otp, type = "password_reset") {
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
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@patheat.com",
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`, { to, type });
    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message, { to, type });
    throw error;
  }
}
