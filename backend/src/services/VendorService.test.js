import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("../repositories/VendorRepository.js", () => ({
  default: class VendorRepositoryMock {
    create(payload) {
      return createMock(payload);
    }
  },
}));

import VendorService from "./VendorService.js";

describe("VendorService ownership", () => {
  beforeEach(() => {
    createMock.mockReset();
    createMock.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000003",
      name: "Secure stall",
      category_id: "00000000-0000-4000-8000-000000000002",
      status: "active",
      is_open: true,
    });
  });

  it("uses the authenticated vendor as owner even when the client sends owner_id", async () => {
    const authenticatedOwnerId = "00000000-0000-4000-8000-000000000001";
    const service = new VendorService();

    await service.createStall(authenticatedOwnerId, {
      name: "Secure stall",
      category_id: "00000000-0000-4000-8000-000000000002",
      owner_id: "00000000-0000-4000-8000-000000000099",
    });

    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
      owner_id: authenticatedOwnerId,
    }));
  });
});
