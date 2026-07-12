import { describe, expect, it } from "vitest";
import { inspectPostgresToc } from "./backupToc.js";

const fullArchive = `
5; 2615 2200 SCHEMA - public postgres
10; 0 1 TABLE DATA public users postgres
11; 0 2 TABLE DATA public role postgres
12; 0 3 TABLE DATA public place_categories postgres
13; 0 4 TABLE DATA public places postgres
14; 0 5 TABLE DATA public menu_items postgres
15; 0 6 TABLE DATA public place_menu_items postgres
16; 0 7 TABLE DATA public reviews postgres
`;

describe("PostgreSQL dump TOC inspection", () => {
  it("recognizes a dump that covers the current application schema", () => {
    expect(inspectPostgresToc(fullArchive, [
      "users", "role", "place_categories", "places", "menu_items", "place_menu_items", "reviews",
    ])).toMatchObject({ isFullDatabase: true, dataEntryCount: 7 });
  });

  it("keeps a selected-table dump on the partial path", () => {
    const result = inspectPostgresToc("10; 0 1 TABLE DATA public places postgres", ["users", "places"]);
    expect(result).toMatchObject({ tableNames: ["places"], isFullDatabase: false });
  });

  it("rejects database-level objects", () => {
    expect(() => inspectPostgresToc(`${fullArchive}\n1; 1262 1 DATABASE - patheats postgres`, ["users"]))
      .toThrow("unsupported high-risk object entries");
  });

  it("rejects archives without public table data", () => {
    expect(() => inspectPostgresToc("5; 2615 2200 SCHEMA - public postgres", ["users"]))
      .toThrow("no public table data");
  });

  it("rejects PostGIS-owned spatial reference data", () => {
    expect(() => inspectPostgresToc("10; 0 1 TABLE DATA public spatial_ref_sys postgres", ["users"]))
      .toThrow("spatial_ref_sys");
  });
});
