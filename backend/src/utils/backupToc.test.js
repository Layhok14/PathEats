import { describe, expect, it } from "vitest";
import { inspectPostgresToc } from "./backupToc.js";

const fullArchiveToc = `
; Archive created at 2026-07-11 12:00:00 UTC
5; 2615 2200 SCHEMA - public postgres
210; 1259 41001 TABLE public users postgres
211; 1259 41002 TABLE public place_categories postgres
212; 1259 41003 TABLE public places postgres
213; 1259 41004 TABLE public menu_items postgres
214; 1259 41005 TABLE public place_menu_items postgres
215; 1259 41006 TABLE public reviews postgres
216; 1259 41007 TABLE public backup_profiles postgres
217; 1259 41008 TABLE public scheduled_backups postgres
218; 1259 41009 TABLE public recovery_operations postgres
310; 0 41001 TABLE DATA public users postgres
311; 0 41002 TABLE DATA public place_categories postgres
312; 0 41003 TABLE DATA public places postgres
313; 0 41004 TABLE DATA public menu_items postgres
314; 0 41005 TABLE DATA public place_menu_items postgres
315; 0 41006 TABLE DATA public reviews postgres
316; 0 41007 TABLE DATA public backup_profiles postgres
317; 0 41008 TABLE DATA public scheduled_backups postgres
318; 0 41009 TABLE DATA public recovery_operations postgres
319; 0 41010 SEQUENCE SET public users_id_seq postgres
`;

describe("PostgreSQL backup TOC inspection", () => {
  it("recognizes numeric pg_restore entries for a complete public-schema archive", () => {
    expect(inspectPostgresToc(fullArchiveToc, ["users", "places"])).toMatchObject({
      isFullDatabase: true,
      dataEntryCount: 10,
    });
  });

  it("keeps a selected-table archive on the partial restore path", () => {
    const partialToc = `
210; 1259 41002 TABLE public places postgres
311; 0 41002 TABLE DATA public places postgres
`;

    expect(inspectPostgresToc(partialToc, ["users", "places"])).toMatchObject({
      tableNames: ["places"],
      isFullDatabase: false,
    });
  });

  it("does not classify an archive as full when any current table is missing", () => {
    expect(inspectPostgresToc(fullArchiveToc, ["users", "places", "new_feature_table"]).isFullDatabase).toBe(false);
  });

  it("recognizes a complete application archive when the current schema is empty", () => {
    expect(inspectPostgresToc(fullArchiveToc, []).isFullDatabase).toBe(true);
  });

  it("rejects database-level archive objects", () => {
    const dangerousToc = `${fullArchiveToc}\n1; 1262 16384 DATABASE - patheats postgres`;
    expect(() => inspectPostgresToc(dangerousToc, ["users", "places"])).toThrow(
      "unsupported high-risk object entries"
    );
  });
});
