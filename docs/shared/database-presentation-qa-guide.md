# Database Presentation Q&A Guide

Purpose: prepare the team for follow-up questions after the database presentation, especially around backup, recovery, table selection, and why the system shows more tables than the ERD.

How to use this file in later sessions: treat this as the fast-answer sheet for defense questions. It is tied to the current codebase, with file and function references so any teammate can trace the explanation back to implementation.

## Quick implementation map

- Backup page UI: [frontend/src/admin/pages/developer/BackupManagerPage.tsx](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\frontend\src\admin\pages\developer\BackupManagerPage.tsx)
- Frontend API calls: [frontend/src/admin/services/developerService.ts](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\frontend\src\admin\services\developerService.ts)
- Backup/recovery routes: [backend/src/routes/devRoutes.js](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\backend\src\routes\devRoutes.js)
- Backup creation logic: [backend/src/services/backupService.js](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\backend\src\services\backupService.js)
- Recovery logic: [backend/src/services/backupRecoveryService.js](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\backend\src\services\backupRecoveryService.js)
- Dump inspection guard: [backend/src/utils/backupToc.js](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\backend\src\utils\backupToc.js)

## Q1. Why can we include “special” or internal tables when doing a table backup and then recovery?

Short answer: because the current backup system is metadata-driven, not ERD-driven.

What that means in this project:

- The backup engine does not ask, “Is this table part of the presentation ERD?”
- It asks, “Is this a real table in the database schema that this backup method allows?”

Current behavior:

- Full and specific-table backups are generated in `backupService.js`.
- For actual backup execution, `getPublicTableNames(client)` reads every base table in the `public` schema from `information_schema.tables`.
- If a table exists in `public` and passes identifier validation, it can be included in backup scope.
- Recovery also works generically:
  - PostgreSQL dump recovery restores table data from the dump.
  - CSV recovery restores rows into a selected target table if the columns are compatible.

Important clarification for the presentation:

- These are not PostgreSQL system catalogs like `pg_class` or `pg_attribute`.
- What we may call “special” in the UI are usually:
  - internal application tables such as `audit_log`, `backup_profiles`, `scheduled_backups`, `recovery_operations`, `refresh_tokens`, `session_events`, `query_presets`, `database_activity_log`
  - runtime-created support tables such as `otps`
  - other non-ERD operational tables that still exist as normal database tables

Why recovery is possible:

- `pg_dump` and `pg_restore` operate on table data and schema objects, not business meaning.
- `restoreCsvFile()` in `backupRecoveryService.js` only checks whether the target table exists and whether CSV columns are allowed for that table.
- So if a table is real and valid for the recovery method, the engine can restore it even if it is not meant for the main ERD story.

Presentation-safe conclusion:

- Our current implementation allows operational/internal tables to participate in backup because it is based on actual schema discovery.
- For the defense, we should distinguish between:
  - tables that are valid backup targets in the system
  - tables that are important enough to show in the academic ERD/RM

## Q2. Why are there so many table choices in “backup by tables”? Why more than the ERD and more than admin-only tables? How is that data fetched?

Short answer: after the fix, the UI prefers the same source the backup validator uses, with a fallback so the selector does not become empty.

Current data flow:

1. `BackupManagerPage.tsx` and the recovery modal first try to load table names from `getDevBackupTables()`.
2. `getDevBackupTables()` is implemented in `developerService.ts` and calls `GET /dev/backups/tables`.
3. `GET /dev/backups/tables` in `devRoutes.js` calls `getPublicTableNames(client)`.
4. `getPublicTableNames(client)` in `backupService.js` reads `information_schema.tables`.
5. If that preferred source fails or returns no rows, the frontend falls back to `getDevDatabase()` and extracts unique table names from `/dev/database`.

Why this can still produce more choices than the ERD:

- the selector is now limited to valid backup tables in `public`
- but `public` still contains more than only core business tables
- so the UI can still show:
  - core business tables
  - internal application support tables
  - admin/developer operational tables
  - runtime-created support tables such as `otps`

Important implementation detail:

- the preferred selector source and validator source are aligned
- both use `getPublicTableNames(client)`
- the frontend still has a fallback to database inventory so the choice box does not go blank if the preferred route is temporarily unavailable

This is the clearest explanation for the teacher:

- The selector prefers `/dev/backups/tables`.
- The backup engine validates against that same `public` table list.
- The frontend also keeps a fallback to `/dev/database` so the user is not blocked by an empty selector.
- So the design now balances correctness first, with UI resilience second.

Why this matters academically:

- ERD/RM should show the tables that represent our system design.
- The backup UI is showing implementation-level operational inventory inside the allowed application schema.
- Those are related, but not identical.

What to say if asked whether Supabase/framework tables are “ours”:

- If a table is in our `public` schema and used by our app, it is part of the live operational database, even if it is not part of the core business ERD.
- Truly platform-managed schemas such as `auth` or `storage` should not be treated as our main ERD design.
- In this codebase, both the selector and validator now target `public` base tables.
- The list can still feel larger than the ERD because operational tables live in the same schema.

## Q3. What happens when we select the wrong table for specific row recovery?

There are three main cases.

### Case A: the target table does not exist in `public`

Result:

- Recovery fails before commit.
- `restoreCsvFile()` checks `information_schema.columns`.
- If no columns are returned, it throws:
  - `Target table "<name>" does not exist`

Effect:

- No database rows are committed.
- The transaction is rolled back.

### Case B: the table exists, but the CSV columns do not belong to that table

Result:

- Recovery fails before data insert.
- `restoreCsvFile()` compares CSV headers with actual allowed columns.
- If headers are invalid, it throws:
  - `CSV contains unsupported columns: ...`

Effect:

- No CSV changes are committed.

### Case C: the wrong table exists and its columns are still compatible

Result:

- Recovery may succeed technically but be wrong logically.

Example:

- If the CSV headers are valid for the selected table and types can be inserted, PostgreSQL will accept the rows.
- The backend cannot detect business intent such as “this data belongs to `users`, not `audit_log`” unless schema mismatch exposes the mistake.

Presentation-safe conclusion:

- The system protects against missing tables and invalid columns.
- It does not fully protect against a human choosing the wrong but technically compatible table.

## Q4. What happens when we write the wrong condition for row backup, or choose the wrong table for row backup?

### If the condition is structurally invalid

`validateRowCondition()` in `backupService.js` enforces:

- it must start with `WHERE`
- it cannot contain `;`, `--`, `/*`, `*/`
- it cannot contain destructive SQL keywords such as `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`, `GRANT`, `REVOKE`, `COPY`, `CALL`, `DO`, `EXECUTE`

Result:

- The backup request is rejected before the query runs.

### If the condition passes validation but is invalid SQL

Example:

- wrong column name
- wrong operator
- invalid function usage

Result:

- the actual `SELECT` query inside `createPostgresCsvFile()` fails
- backup is not produced

### If the condition is valid SQL but logically wrong

Example:

- the filter is too broad
- the filter is too narrow
- the wrong date range is used
- the wrong status value is used

Result:

- the backup succeeds, but the content is wrong

Possible outcomes:

- too many rows included
- zero rows matched
- unintended rows included from the correct table

If zero rows match:

- the generated CSV still contains the header row
- recovery later will restore no data rows

### If the wrong source table is chosen during row backup

Result:

- the system creates a valid CSV from that chosen table if it exists
- the file is technically correct but semantically wrong for the operator’s goal

Presentation-safe conclusion:

- The backend protects against SQL injection-style misuse and invalid table names.
- It cannot fully protect against valid but mistaken business logic in the filter.

## Q5. Why does specific row backup download as CSV, while full/table backup downloads as `.dump`?

Because the project uses two different backup strategies on purpose.

For full database and specific-table backup:

- `generateBackupForProfile()` calls `createPostgresDumpFile()`
- that uses `pg_dump --format=custom`
- returned format is:
  - extension: `.dump`
  - header `X-Backup-Format: postgres-custom`

For specific-row backup:

- `generateBackupForProfile()` detects row-level scope
- it calls `createPostgresCsvFile()`
- returned format is:
  - extension: `.csv`
  - header `X-Backup-Format: csv`

Why this design makes sense:

- PostgreSQL custom dump is better for whole-database or whole-table structure/data recovery
- CSV is better for row-level export/import because it is simpler and easier to reinsert selectively

## Q6. What happens if we try to recover a CSV file using PostgreSQL dump recovery, or recover a `.dump` file as CSV?

The recovery flow separates them by recovery type.

Current behavior:

- PostgreSQL dump recovery checks the file signature first.
- CSV recovery requires a target table and parses the file as CSV.

Result:

- wrong recovery type causes validation failure
- the operation is recorded as failed
- no partial row restore should be committed

This is important to say:

- CSV, SQL, and PostgreSQL custom dump are different artifact formats.
- They are not interchangeable.

## Q7. Why do we not use every table shown in the backup UI in the ERD/RM?

Because ERD/RM should communicate the core business design, not every operational detail.

Good ERD/RM candidates:

- `users`
- `role`
- `places`
- `place_categories`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `reviews`
- `bookmarks`
- `routes`
- image tables if your final ERD scope includes asset metadata

Usually not the main ERD focus:

- `audit_log`
- `backup_profiles`
- `scheduled_backups`
- `recovery_operations`
- `refresh_tokens`
- `session_events`
- `query_presets`
- `database_activity_log`
- `otps`

These are real tables, but they support operation, security, or maintenance rather than the main customer-facing business flow.

## Q8. Does a database backup also back up Supabase Storage files?

No.

Important answer:

- PostgreSQL backup covers database data.
- Supabase Storage objects are separate from PostgreSQL table rows.
- Metadata may be in the database, but the actual file objects are stored elsewhere.

So:

- a database backup alone does not guarantee full recovery of uploaded images/files

## Q9. How does the system reduce dangerous full-dump recovery?

Two main protections exist.

### 1. Dump inspection before restore

`inspectPostgresToc()` in `backupToc.js` rejects:

- `DATABASE`
- `PUBLICATION`
- `SUBSCRIPTION`
- `EVENT TRIGGER`
- `FOREIGN DATA WRAPPER`
- `SERVER`
- `spatial_ref_sys`

### 2. Serialized recovery execution

Recovery is wrapped by `withRecoveryLock(...)` so destructive recovery jobs do not overlap in one backend instance.

Why this matters:

- it reduces the chance of restoring unsafe objects
- it reduces overlapping restore operations that could corrupt state

## Q10. Why might the teacher ask about `spatial_ref_sys`, and what should we answer?

Suggested answer:

- This project uses PostGIS, so PostgreSQL provides spatial support objects.
- `spatial_ref_sys` is a PostGIS reference table, not our business data.
- The backup/recovery safeguards intentionally exclude it from normal application backup logic.

Why:

- it is platform/reference data, not application-owned transactional data
- restoring it as if it were our business table is unnecessary and risky

## Likely extra teacher questions

### “How do you know backup access is controlled?”

Answer:

- Backup/recovery routes are not public.
- They are under developer/admin backend routes.
- The route file applies capability and role checks before allowing backup operations.

### “How do you avoid SQL injection in row backup?”

Answer:

- table names are identifier-validated
- row conditions are restricted by `validateRowCondition()`
- dangerous SQL keywords, comments, and statement separators are blocked

### “Can the system guarantee correct business recovery if the operator chooses the wrong table?”

Answer:

- No, not completely.
- It guarantees technical validation, not human intent validation.
- That is why operator knowledge and table classification matter.

### “Why is the backup selector not limited only to ERD tables?”

Answer:

- Because the current UI is driven by live schema metadata from `/dev/backups/tables`, not an ERD whitelist.
- The system is schema-driven for correctness, while the ERD is presentation-driven for core design.

### “What is the main limitation of row-level CSV recovery?”

Answer:

- It is good for selective data recovery, but it does not restore full relational context automatically.
- If dependent tables are not restored consistently, foreign-key or business consistency problems may remain.

## Member focus

### Layhok — Global admin + developer interface

Must be ready to explain:

- exact backup/recovery flow by file and function
- why UI table choices can still be broader than ERD tables even after the fix
- how `/dev/backups/tables` and `getPublicTableNames()` keep the selector aligned with backup validation
- why row backup is CSV and table/full backup is `.dump`
- the safeguards in `inspectPostgresToc()` and `withRecoveryLock()`

### Pav — Vendor + Business assistance interface

Must be ready to explain:

- why not every real database table belongs in the business ERD
- which tables are operational/internal versus customer/business-facing
- what business risk happens if the wrong table or wrong row condition is chosen
- why vendor-facing data recovery should target business tables, not internal admin/support tables

### Smey — Consumer interface

Must be ready to explain:

- how backup/recovery decisions affect end-user data consistency
- why wrong recovery can impact visible consumer data such as users, places, menus, reviews, bookmarks, and routes
- why technical validation is necessary but still not enough without correct operator judgment

## Short defense-ready summary

If the teacher asks for one compact answer:

> The backup UI currently shows tables from live database metadata, so it can include more than the ERD. The actual backup engine still validates against real schema tables, mainly in `public`. Internal support tables can be backed up because they are real operational tables, but they are not all appropriate for the academic ERD. Wrong table or wrong filter choices are partly blocked by validation, but logically wrong yet valid choices can still produce incorrect backup content, so operator understanding of the schema remains critical.
