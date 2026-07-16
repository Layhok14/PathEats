import { Router } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { otpLimiter, loginLimiter, registerLimiter } from "../middlewares/rateLimiter.js";
import AuthService from "../services/AuthService.js";
import AppError from "../utils/AppError.js";

const authService = new AuthService();
const router = Router();

const requestContext = (req) => ({
  ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
  userAgent: req.get("user-agent") || null,
});

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required: [email, password, firstName, lastName]
 *       properties:
 *         email:       { type: string, format: email, example: "vendor@patheat.app" }
 *         password:    { type: string, format: password, example: "SecurePass123!" }
 *         firstName:   { type: string, example: "Sophea" }
 *         lastName:    { type: string, example: "Meng" }
 *         phone:       { type: string, example: "012-345-678" }
 *         roleScope:   { type: string, enum: [VENDOR, CONSUMER], example: "VENDOR" }
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:    { type: string, format: email, example: "vendor@patheat.app" }
 *         password: { type: string, format: password, example: "SecurePass123!" }
 *     ForgotPasswordInput:
 *       type: object
 *       required: [email]
 *       properties:
 *         email: { type: string, format: email, example: "vendor@patheat.app" }
 *     VerifyOtpInput:
 *       type: object
 *       required: [email, otp]
 *       properties:
 *         email: { type: string, format: email, example: "vendor@patheat.app" }
 *         otp:   { type: string, example: "123456" }
 *     ResetPasswordInput:
 *       type: object
 *       required: [email, otp, newPassword]
 *       properties:
 *         email:       { type: string, format: email, example: "vendor@patheat.app" }
 *         otp:         { type: string, example: "123456" }
 *         newPassword: { type: string, format: password, example: "NewSecurePass123!" }
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id: { type: string, format: uuid }
 *                 email: { type: string }
 *                 firstName: { type: string }
 *                 lastName: { type: string }
 *                 role_scope: { type: string }
 *             accessToken: { type: string }
 *             refreshToken: { type: string }
 *     MessageResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: object
 *           properties:
 *             message: { type: string }
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new account (vendor or consumer)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email already registered
 */
router.post("/register", registerLimiter, catchAsync(async (req, res) => {
  const { email, password, firstName, lastName, phone, roleScope } = req.body;
  if (!email || !password || !firstName || !lastName) {
    throw new AppError("Missing required fields: email, password, firstName, lastName", 400);
  }
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }
  const result = await authService.register(
    { email, password, firstName, lastName, phone, roleScope },
    requestContext(req)
  );
  res.status(201).json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginLimiter, catchAsync(async (req, res) => {
  const { email, password, expectedRole, expectedRoles } = req.body;
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  const result = await authService.login(email, password, {
    ...requestContext(req),
    expectedRole,
    expectedRoles,
  });
  res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Tokens refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", loginLimiter, catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }
  const result = await authService.refreshAccessToken(refreshToken, requestContext(req));
  res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and revoke refresh token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post("/logout", catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.logout(refreshToken, requestContext(req));
  res.json({ success: true, data: result });
}));

router.post("/logout-all", authMiddleware, catchAsync(async (req, res) => {
  const result = await authService.logoutAll(req.user.sub, requestContext(req));
  res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: No account found with that email
 */
router.post("/forgot-password", otpLimiter, catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("Email is required", 400);
  }
  const result = await authService.forgotPassword(email);
  res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpInput'
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", otpLimiter, catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }
  const result = await authService.verifyOtp(email, otp);
  res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/reset-password", otpLimiter, catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new AppError("Email, OTP, and newPassword are required", 400);
  }
  // Server-side validation will enforce minimum length; basic client check
  if (newPassword.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }
  const result = await authService.resetPassword(email, otp, newPassword);
  res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change password with current password (authenticated)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string, example: "oldpassword123" }
 *               newPassword:     { type: string, example: "newpassword456" }
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password is incorrect
 */
router.post("/change-password", authMiddleware, catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }
  const result = await authService.changePassword(req.user.sub, currentPassword, newPassword);
  res.json({ success: true, data: result });
}));

export default router;
