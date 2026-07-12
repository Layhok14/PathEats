import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserRepository from "../repositories/UserRepository.js";
import OtpRepository from "../repositories/OtpRepository.js";
import TokenRepository from "../repositories/TokenRepository.js";
import AppError from "../utils/AppError.js";
import { isPublicRegistrationRole, normalizeRoleScope } from "../utils/roles.js";
import { sendOTPEmail } from "./emailService.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

const MIN_PASSWORD_LENGTH = 8;

function validatePassword(password) {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400, {
      code: "WEAK_PASSWORD",
      safeMessage: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }
}

function normalizeExpectedRoles(expectedRoles) {
  if (!expectedRoles) return [];
  const roles = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];

  return [
    ...new Set(
      roles
        .map((role) => normalizeRoleScope(role, ""))
        .filter(Boolean),
    ),
  ];
}

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.otpRepo = new OtpRepository();
    this.tokenRepo = new TokenRepository();
  }

  async register(data, context = {}) {
    const { email, password, firstName, lastName, phone, roleScope } = data;
    const normalizedRoleScope = normalizeRoleScope(roleScope);

    if (!isPublicRegistrationRole(normalizedRoleScope)) {
      throw new AppError("This role is not available for public registration", 400, {
        code: "ROLE_REGISTRATION_FORBIDDEN",
        safeMessage: "Choose a valid public account type.",
        details: { requestedRole: normalizedRoleScope },
      });
    }

    validatePassword(password);

    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new AppError("Email already registered", 409);

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userRepo.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone || null,
      role_scope: normalizedRoleScope,
    });

    const session = await this._generateTokens(user, { context });
    await this.tokenRepo.logSessionEvent({
      userId: user.id,
      refreshTokenId: session.refreshTokenRecord.id,
      familyId: session.refreshTokenRecord.family_id,
      eventType: "register_success",
      ...this._eventContext(context),
    });

    return this._publicSession(session);
  }

  async login(email, password, context = {}) {
    const expectedRoles = normalizeExpectedRoles(context.expectedRoles || context.expectedRole);
    const user = await this.userRepo.findByEmailWithPassword(email);
    if (!user) {
      await this.tokenRepo.logSessionEvent({
        eventType: "login_failed",
        details: { email, reason: "user_not_found" },
        ...this._eventContext(context),
      });
      throw new AppError("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await this.tokenRepo.logSessionEvent({
        userId: user.id,
        eventType: "login_failed",
        details: { email, reason: "invalid_password" },
        ...this._eventContext(context),
      });
      throw new AppError("Invalid email or password", 401);
    }

    if (user.is_banned) {
      await this.tokenRepo.logSessionEvent({
        userId: user.id,
        eventType: "login_failed",
        details: { email, reason: "banned" },
        ...this._eventContext(context),
      });
      throw new AppError("Account has been suspended", 403);
    }

    const userRole = normalizeRoleScope(user.role_scope);
    if (expectedRoles.length > 0 && !expectedRoles.includes(userRole)) {
      await this.tokenRepo.logSessionEvent({
        userId: user.id,
        eventType: "login_failed",
        details: {
          email,
          reason: "role_mismatch",
          expectedRoles,
          actualRole: userRole,
        },
        ...this._eventContext(context),
      });
      throw new AppError("Account role does not match this sign-in area", 403, {
        code: "AUTH_ROLE_MISMATCH",
        safeMessage: "Use the correct sign-in page for this account.",
      });
    }

    const session = await this._generateTokens(user, { context });
    await this.tokenRepo.logSessionEvent({
      userId: user.id,
      refreshTokenId: session.refreshTokenRecord.id,
      familyId: session.refreshTokenRecord.family_id,
      eventType: "login_success",
      ...this._eventContext(context),
    });

    return this._publicSession(session);
  }

  async refreshAccessToken(refreshToken, context = {}) {
    if (!refreshToken) {
      await this.tokenRepo.logSessionEvent({
        eventType: "refresh_failed",
        details: { reason: "missing_token" },
        ...this._eventContext(context),
      });
      throw new AppError("Refresh token is required", 400);
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      await this.tokenRepo.logSessionEvent({
        eventType: "refresh_failed",
        details: { reason: "invalid_signature" },
        ...this._eventContext(context),
      });
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const stored = await this.tokenRepo.findByToken(refreshToken, { includeRevoked: true });
    if (!stored) {
      await this.tokenRepo.logSessionEvent({
        userId: decoded.sub || null,
        familyId: decoded.family_id || null,
        eventType: "refresh_failed",
        details: { reason: "token_not_found", jti: decoded.jti || null },
        ...this._eventContext(context),
      });
      throw new AppError("Refresh token has been revoked", 401);
    }

    if (stored.revoked_at) {
      await this.tokenRepo.revokeFamily(stored.family_id);
      await this.tokenRepo.logSessionEvent({
        userId: stored.user_id,
        refreshTokenId: stored.id,
        familyId: stored.family_id,
        eventType: "refresh_reuse_detected",
        details: { reason: "revoked_token_reused", jti: stored.jti },
        ...this._eventContext(context),
      });
      throw new AppError("Refresh token has been revoked", 401);
    }

    if (stored.jti !== decoded.jti || stored.family_id !== decoded.family_id) {
      await this.tokenRepo.revokeFamily(stored.family_id);
      await this.tokenRepo.logSessionEvent({
        userId: stored.user_id,
        refreshTokenId: stored.id,
        familyId: stored.family_id,
        eventType: "refresh_failed",
        details: { reason: "token_claim_mismatch", jti: decoded.jti || null },
        ...this._eventContext(context),
      });
      throw new AppError("Invalid or expired refresh token", 401);
    }

    if (new Date(stored.expires_at).getTime() <= Date.now()) {
      await this.tokenRepo.revokeById(stored.id);
      await this.tokenRepo.logSessionEvent({
        userId: stored.user_id,
        refreshTokenId: stored.id,
        familyId: stored.family_id,
        eventType: "refresh_failed",
        details: { reason: "expired_token", jti: stored.jti },
        ...this._eventContext(context),
      });
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await this.userRepo.findById(decoded.sub);
    if (!user) throw new AppError("User not found", 404);
    if (user.is_banned) throw new AppError("Account has been suspended", 403);

    await this.tokenRepo.touch(stored.id);
    const session = await this._generateTokens(user, {
      familyId: stored.family_id,
      context,
    });

    await this.tokenRepo.revokeById(stored.id, session.refreshTokenRecord.id);
    await this.tokenRepo.logSessionEvent({
      userId: user.id,
      refreshTokenId: session.refreshTokenRecord.id,
      familyId: session.refreshTokenRecord.family_id,
      eventType: "refresh_success",
      details: { replacedTokenId: stored.id },
      ...this._eventContext(context),
    });

    return this._publicSession(session);
  }

  async logout(refreshToken, context = {}) {
    if (refreshToken) {
      const stored = await this.tokenRepo.findByToken(refreshToken, { includeRevoked: true });
      if (stored && !stored.revoked_at) {
        await this.tokenRepo.revokeById(stored.id);
      }
      await this.tokenRepo.logSessionEvent({
        userId: stored?.user_id || null,
        refreshTokenId: stored?.id || null,
        familyId: stored?.family_id || null,
        eventType: "logout",
        details: { tokenFound: Boolean(stored) },
        ...this._eventContext(context),
      });
    }
    return { message: "Logged out successfully" };
  }

  async logoutAll(userId, context = {}) {
    const revokedCount = await this.tokenRepo.revokeAllForUser(userId);
    await this.tokenRepo.logSessionEvent({
      userId,
      eventType: "logout_all",
      details: { revokedCount },
      ...this._eventContext(context),
    });
    return { message: "Logged out from all devices" };
  }

  async forgotPassword(email) {
    const user = await this.userRepo.findByEmail(email);
    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString();
      await this.otpRepo.store(email, otp, "password_reset", 15);

      try {
        await sendOTPEmail(email, otp, "password_reset");
      } catch (err) {
        await this.otpRepo.invalidateAll(email, "password_reset");
        console.error("Failed to send OTP email:", err.message);
        if (err?.isOperational) throw err;
        throw new AppError("Failed to send OTP. Please try again.", 502, {
          code: "OTP_EMAIL_DELIVERY_FAILED",
          safeMessage: "Could not send the OTP email. Check SMTP settings and try again.",
        });
      }
    }

    return { message: "If an account exists, an OTP has been sent to the registered email." };
  }

  async verifyOtp(email, otpCode) {
    const otp = await this.otpRepo.verifyOnly(email, otpCode, "password_reset");
    if (!otp) throw new AppError("Invalid or expired OTP", 400);
    return { message: "OTP verified successfully" };
  }

  async resetPassword(email, otpCode, newPassword) {
    const otp = await this.otpRepo.verify(email, otpCode, "password_reset");
    if (!otp) throw new AppError("Invalid or expired OTP", 400);

    validatePassword(newPassword);

    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new AppError("No account found with that email", 404);

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.userRepo.updatePassword(user.id, passwordHash);
    await this.otpRepo.invalidateAll(email, "password_reset");
    await this.tokenRepo.revokeAllForUser(user.id);

    return { message: "Password reset successfully" };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepo.findByIdWithPassword(userId);
    if (!user) throw new AppError("User not found", 404);

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) throw new AppError("Current password is incorrect", 401);

    validatePassword(newPassword);

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await this.userRepo.updatePassword(userId, passwordHash);
    await this.tokenRepo.revokeAllForUser(userId);

    return { message: "Password changed successfully" };
  }

  async _generateTokens(user, { familyId = crypto.randomUUID(), context = {} } = {}) {
    const accessToken = this._signAccessToken(user.id, user.email, user.role_scope);
    const jti = crypto.randomUUID();
    const refreshToken = this._signRefreshToken(user.id, familyId, jti);

    const refreshExpiryMs = this._parseExpiry(JWT_REFRESH_EXPIRY);
    const expiresAt = new Date(Date.now() + refreshExpiryMs).toISOString();
    const refreshTokenRecord = await this.tokenRepo.store(user.id, refreshToken, expiresAt, {
      familyId,
      jti,
      ...this._eventContext(context),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role_scope: user.role_scope,
        role: user.role_scope,
        roleId: user.role_id,
        roleName: user.role_name || user.role_scope,
        baseScope: user.base_scope || user.role_scope,
        tablePrivileges: user.table_privileges || {},
        systemCapabilities: user.system_capabilities || [],
        grantOption: Boolean(user.grant_option),
      },
      accessToken,
      refreshToken,
      refreshTokenRecord,
    };
  }

  _signAccessToken(userId, email, roleScope) {
    return jwt.sign(
      { sub: userId, email, role_scope: roleScope, role: roleScope },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRY }
    );
  }

  _signRefreshToken(userId, familyId, jti) {
    return jwt.sign(
      { sub: userId, family_id: familyId, jti },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRY }
    );
  }

  _publicSession(session) {
    const { refreshTokenRecord, ...payload } = session;
    return payload;
  }

  _eventContext(context = {}) {
    return {
      ipAddress: context.ipAddress || null,
      userAgent: context.userAgent || null,
    };
  }

  _parseExpiry(expiry) {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const num = parseInt(match[1]);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return num * (multipliers[unit] || 86400000);
  }
}

export default AuthService;
