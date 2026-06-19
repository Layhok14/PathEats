import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserRepository from "../repositories/UserRepository.js";
import OtpRepository from "../repositories/OtpRepository.js";
import AppError from "../utils/AppError.js";
import { sendOTPEmail } from "./emailService.js";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRY || "15m";

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.otpRepo = new OtpRepository();
  }

  /**
   * Register a new user account.
   * @param {{ email, password, firstName, lastName, phone, roleScope }} data
   */
  async register(data) {
    const { email, password, firstName, lastName, phone, roleScope } = data;

    // 1. Check if email already exists
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 409);

    // 2. Hash password with bcrypt (12 salt rounds)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insert user into database
    const user = await this.userRepo.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone || null,
      role_scope: roleScope || "VENDOR",
    });

    // 4. Sign JWT
    const token = this._signToken(user.id, user.email, user.role_scope);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role_scope: user.role_scope,
      },
      token,
    };
  }

  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    // 1. Find user with password hash
    const user = await this.userRepo.findByEmailWithPassword(email);
    if (!user) throw new AppError("Invalid email or password", 401);

    // 2. Compare password against stored hash
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new AppError("Invalid email or password", 401);

    // 3. Check if account is banned
    if (user.is_banned) throw new AppError("Account has been suspended", 403);

    // 4. Sign JWT
    const token = this._signToken(user.id, user.email, user.role_scope);
    delete user.password_hash;

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role_scope: user.role_scope,
      },
      token,
    };
  }

  /**
   * Forgot password — generate OTP and email it.
   * @param {string} email
   */
  async forgotPassword(email) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new AppError("No account found with that email", 404);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in database (15 min expiry)
    await this.otpRepo.store(email, otp, "password_reset", 15);

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp, "password_reset");
    } catch (err) {
      console.error("Failed to send OTP email:", err.message);
      throw new AppError("Failed to send OTP. Please try again.", 500);
    }

    return { message: "OTP sent to your email" };
  }

  /**
   * Verify OTP — validates the code without resetting password.
   * @param {string} email
   * @param {string} otpCode
   */
  async verifyOtp(email, otpCode) {
    const otp = await this.otpRepo.verify(email, otpCode, "password_reset");
    if (!otp) throw new AppError("Invalid or expired OTP", 400);

    return { message: "OTP verified successfully" };
  }

  /**
   * Reset password after OTP verification.
   * @param {string} email
   * @param {string} otpCode
   * @param {string} newPassword
   */
  async resetPassword(email, otpCode, newPassword) {
    // 1. Verify OTP first
    const otp = await this.otpRepo.verify(email, otpCode, "password_reset");
    if (!otp) throw new AppError("Invalid or expired OTP", 400);

    // 2. Find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new AppError("No account found with that email", 404);

    // 3. Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // 4. Update password
    await this.userRepo.updatePassword(user.id, passwordHash);

    // 5. Invalidate all remaining OTPs for this email
    await this.otpRepo.invalidateAll(email, "password_reset");

    return { message: "Password reset successfully" };
  }

  /**
   * Sign a JWT access token.
   */
  _signToken(userId, email, roleScope) {
    return jwt.sign(
      { sub: userId, email, role_scope: roleScope },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export default AuthService;
