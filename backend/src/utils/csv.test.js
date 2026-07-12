import { describe, expect, it } from "vitest";
import { parseCsv } from "./csv.js";

describe("CSV parsing", () => {
  it("parses quoted commas and escaped quotes", () => {
    expect(parseCsv('id,name\n1,"Rice, chicken"\n2,"Tea ""large"""\n')).toEqual({
      headers: ["id", "name"],
      records: [["1", "Rice, chicken"], ["2", 'Tea "large"']],
    });
  });

  it("rejects duplicate headers", () => {
    expect(() => parseCsv("id,id\n1,2\n")).toThrow("duplicate column names");
  });

  it("accepts a header-only backup when no rows matched", () => {
    expect(parseCsv("id,name\n")).toEqual({
      headers: ["id", "name"],
      records: [],
    });
  });
});
