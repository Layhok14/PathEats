import { beforeEach, describe, expect, it, vi } from "vitest";

const repository = vi.hoisted(() => ({
  getRoleRecordById: vi.fn(),
  createUser: vi.fn(),
  logAuditAction: vi.fn(),
}));
vi.mock("../repositories/adminRepository.js", () => repository);

import { createUser } from "./AdminService.js";

describe("admin-created account passwords", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requires an explicitly supplied password", async () => {
    await expect(createUser({ name: "Admin User", email: "admin@example.com", roleId: "role-1" }))
      .rejects.toMatchObject({ statusCode: 400, fieldErrors: { password: "Password is required." } });
    expect(repository.createUser).not.toHaveBeenCalled();
  });

  it("rejects weak passwords with the shared contract", async () => {
    await expect(createUser({ name: "Admin User", email: "admin@example.com", roleId: "role-1", password: "password" }))
      .rejects.toMatchObject({ statusCode: 400, code: "WEAK_PASSWORD", fieldErrors: { password: expect.any(String) } });
  });

  it("hashes and creates an account when the password is strong", async () => {
    repository.getRoleRecordById.mockResolvedValue({ id: "role-1", baseScope: "CONSUMER", isSystem: true });
    repository.createUser.mockImplementation(async (data) => ({ id: "u1", ...data }));
    const created = await createUser({
      name: "Strong User", email: "strong@example.com", roleId: "role-1", password: "StrongPass1!",
    });
    expect(created.password_hash).not.toBe("StrongPass1!");
    expect(repository.createUser).toHaveBeenCalledWith(expect.objectContaining({ role_id: "role-1" }));
  });
});
