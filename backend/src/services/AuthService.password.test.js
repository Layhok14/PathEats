import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthService from "./AuthService.js";

describe("AuthService password behavior", () => {
  let service;

  beforeEach(() => {
    service = new AuthService();
    service.userRepo = {};
    service.otpRepo = {};
    service.tokenRepo = { logSessionEvent: vi.fn(), revokeAllForUser: vi.fn() };
  });

  it("rejects weak registration before persistence", async () => {
    await expect(service.register({
      email: "user@example.com", password: "password", firstName: "A", lastName: "B", roleScope: "CONSUMER",
    })).rejects.toMatchObject({ statusCode: 400, code: "WEAK_PASSWORD", fieldErrors: { password: expect.any(String) } });
  });

  it("still permits an existing legacy weak password at ordinary login", async () => {
    const passwordHash = await bcrypt.hash("legacy", 4);
    const user = { id: "u1", email: "user@example.com", password_hash: passwordHash, role_scope: "CONSUMER", is_banned: false };
    service.userRepo.findByEmailWithPassword = vi.fn().mockResolvedValue(user);
    service._generateTokens = vi.fn().mockResolvedValue({
      user, accessToken: "access", refreshToken: "refresh", refreshTokenRecord: { id: "r1", family_id: "f1" },
    });

    await expect(service.login(user.email, "legacy")).resolves.toMatchObject({ accessToken: "access" });
  });

  it("rejects reusing the current strong password", async () => {
    const passwordHash = await bcrypt.hash("StrongPass1!", 4);
    service.userRepo.findByIdWithPassword = vi.fn().mockResolvedValue({ id: "u1", password_hash: passwordHash });
    await expect(service.changePassword("u1", "StrongPass1!", "StrongPass1!")).rejects.toMatchObject({
      statusCode: 400,
      code: "PASSWORD_REUSE",
    });
    expect(service.tokenRepo.revokeAllForUser).not.toHaveBeenCalled();
  });
});
