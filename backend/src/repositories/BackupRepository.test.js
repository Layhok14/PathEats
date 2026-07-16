import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbQuery: vi.fn(),
  poolQuery: vi.fn(),
  connect: vi.fn(),
}));

vi.mock("../config/db.js", () => ({
  default: { query: mocks.dbQuery },
  pool: { query: mocks.poolQuery, connect: mocks.connect },
}));

import BackupRepository from "./BackupRepository.js";

describe("BackupRepository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns camel-cased profile records through parameterized CRUD", async () => {
    const profile = { id: "profile-1", profileName: "Daily" };
    mocks.dbQuery.mockResolvedValueOnce({ rows: [profile] });
    const repository = new BackupRepository();
    await expect(repository.findProfileById("profile-1")).resolves.toEqual(profile);
    expect(mocks.dbQuery).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1"), ["profile-1"]);
  });

  it("atomically claims due profiles with row skipping", async () => {
    const client = { query: vi.fn(), release: vi.fn() };
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id: "profile-1" }] })
      .mockResolvedValueOnce({});
    mocks.connect.mockResolvedValue(client);

    await expect(new BackupRepository().claimDueProfiles(3)).resolves.toEqual([{ id: "profile-1" }]);
    expect(client.query.mock.calls[1][0]).toContain("FOR UPDATE SKIP LOCKED");
    expect(client.query.mock.calls[1][1]).toEqual([3]);
    expect(client.query).toHaveBeenNthCalledWith(3, "COMMIT");
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("rolls back a failed scheduled state transition", async () => {
    const client = { query: vi.fn(), release: vi.fn() };
    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("insert failed"))
      .mockResolvedValueOnce({});
    mocks.connect.mockResolvedValue(client);

    await expect(new BackupRepository().recordScheduledSuccess(
      { id: "p1", profile_name: "Daily", method: "Entire Database", scope: "full", schedule_interval: "1", schedule_unit: "Days" },
      { fileName: "daily.dump", filePath: "safe/path", size: "1 KB", format: "postgres-custom" },
    )).rejects.toThrow("insert failed");
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("discovers columns with parameters before executing a validated CSV export", async () => {
    mocks.dbQuery
      .mockResolvedValueOnce({ rows: [{ column_name: "id" }, { column_name: "name" }] })
      .mockResolvedValueOnce({ rows: [{ id: "1", name: "Cafe" }], fields: [{ name: "id" }, { name: "name" }] });
    const data = await new BackupRepository().getCsvExportData("places", "WHERE id = '1'");
    expect(mocks.dbQuery.mock.calls[0][1]).toEqual(["places"]);
    expect(data).toEqual({ headers: ["id", "name"], rows: [{ id: "1", name: "Cafe" }] });
  });
});
