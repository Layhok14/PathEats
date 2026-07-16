import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ connect: vi.fn(), poolQuery: vi.fn() }));
vi.mock("../config/db.js", () => ({ pool: { connect: mocks.connect, query: mocks.poolQuery } }));

import RecoveryRepository from "./RecoveryRepository.js";

describe("RecoveryRepository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("holds and releases a PostgreSQL advisory lock around recovery", async () => {
    const client = { query: vi.fn(), release: vi.fn() };
    client.query
      .mockResolvedValueOnce({ rows: [{ acquired: true }] })
      .mockResolvedValueOnce({ rows: [{ pg_advisory_unlock: true }] });
    mocks.connect.mockResolvedValue(client);
    const operation = vi.fn().mockResolvedValue("done");

    await expect(new RecoveryRepository().withAdvisoryLock(operation)).resolves.toBe("done");
    expect(operation).toHaveBeenCalledOnce();
    expect(client.query.mock.calls[0][0]).toContain("pg_try_advisory_lock");
    expect(client.query.mock.calls[1][0]).toContain("pg_advisory_unlock");
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("rejects recovery when another backend instance owns the lock", async () => {
    const client = { query: vi.fn().mockResolvedValue({ rows: [{ acquired: false }] }), release: vi.fn() };
    mocks.connect.mockResolvedValue(client);
    await expect(new RecoveryRepository().withAdvisoryLock(vi.fn())).rejects.toMatchObject({
      statusCode: 409,
      code: "RECOVERY_IN_PROGRESS",
    });
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("commits parameterized CSV upserts using discovered metadata", async () => {
    const client = { query: vi.fn(), release: vi.fn() };
    client.query
      .mockResolvedValueOnce({ rows: [{ column_name: "id" }, { column_name: "name" }] })
      .mockResolvedValueOnce({ rows: [{ column_name: "id" }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    mocks.connect.mockResolvedValue(client);

    await new RecoveryRepository().restoreCsvRecords("places", ["id", "name"], [["1", "Cafe"]]);
    expect(client.query.mock.calls[3][0]).toContain("ON CONFLICT");
    expect(client.query.mock.calls[3][1]).toEqual(["1", "Cafe"]);
    expect(client.query).toHaveBeenNthCalledWith(5, "COMMIT");
  });

  it("rolls back the full CSV transaction when an upsert fails", async () => {
    const client = { query: vi.fn(), release: vi.fn() };
    client.query
      .mockResolvedValueOnce({ rows: [{ column_name: "id" }] })
      .mockResolvedValueOnce({ rows: [{ column_name: "id" }] })
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("bad row"))
      .mockResolvedValueOnce({});
    mocks.connect.mockResolvedValue(client);

    await expect(new RecoveryRepository().restoreCsvRecords("places", ["id"], [["1"]])).rejects.toThrow("bad row");
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalledOnce();
  });
});
