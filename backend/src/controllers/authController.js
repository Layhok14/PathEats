import AuthService from "../services/AuthService.js";
import { catchAsync } from "../utils/catchAsync.js";

const authService = new AuthService();

/**
 * POST /api/auth/register
 */
export const register = catchAsync(async (req, res) => {
  const { email, password, firstName, lastName, phone, roleScope } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, password, firstName, lastName",
    });
  }

  const result = await authService.register({
    email,
    password,
    firstName,
    lastName,
    phone,
    roleScope,
  });

  res.status(201).json({ success: true, data: result });
});

/**
 * POST /api/auth/login
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const result = await authService.login(email, password);
  res.json({ success: true, data: result });
});

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const result = await authService.forgotPassword(email);
  res.json({ success: true, data: result });
});

/**
 * POST /api/auth/verify-otp
 */
export const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const result = await authService.verifyOtp(email, otp);
  res.json({ success: true, data: result });
});

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and newPassword are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const result = await authService.resetPassword(email, otp, newPassword);
  res.json({ success: true, data: result });
});
