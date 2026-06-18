import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

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
 *             token: { type: string }
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
router.post("/register", register);

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
router.post("/login", login);

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
router.post("/forgot-password", forgotPassword);

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
router.post("/verify-otp", verifyOtp);

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
router.post("/reset-password", resetPassword);

export default router;
