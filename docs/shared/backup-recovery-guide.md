# PathEats - Backup & Recovery Technical Guide

> Audience: Developer administrators, backend engineers, and presentation team members  
> Scope: Current backup generation, restore flow, scheduler lifecycle, performance behavior, and team speaking focus  
> Files referenced: `backend/src/services/backupService.js`, `backend/src/services/backupRecoveryService.js`, `backend/src/services/backupScheduler.js`, `backend/src/routes/devRoutes.js`, `backend/src/utils/backupToc.js`, `backend/src/utils/csv.js`

---

## 1. Backup Methods

The current system supports three backup methods:

| Method | Tool | Output | Use case |
|--------|------|--------|----------|
| Entire Database | `pg_dump` custom format | `.dump` | Full backup of the `public` schema |
| Specific Tables | `pg_dump` custom format | `.dump` | Backup selected application tables |
| Specific Rows | SQL `SELECT` + app-side CSV writer | `.csv` | Export selected rows from one table |

### 1.1 Full database / specific tables (`createPostgresDumpFile`)

Current implementation:

```text
pg_dump
  --format=custom
  --no-owner
  --no-privileges
  --no-comments
  --file <temp path>
```

Current behavior:

- uses a spawned `pg_dump` process, not a Node-only implementation
- connects using parsed `DATABASE_URL`
- full backup includes `public` schema and excludes `public.spatial_ref_sys`
- specific-table backup resolves the requested table list against `information_schema.tables`
- output is written to a temporary file first, then streamed or copied

Important code path:

- `backend/src/services/backupService.js`
  - `validateBackupProfile`
  - `getPublicTableNames`
  - `resolveBackupTables`
  - `postgresDumpArgsForProfile`
  - `createPostgresDumpFile`

### 1.2 Row-level CSV (`createPostgresCsvFile`)

Current behavior:

- validates the target table name
- validates the row filter and requires it to start with `WHERE`
- loads table columns from `information_schema.columns`
- runs a dynamic `SELECT ... FROM <table> <condition>`
- converts the full result set into CSV in application memory
- writes CSV to a temporary file before download

Important code path:

- `backend/src/services/backupService.js`
  - `parseScope`
  - `validateRowCondition`
  - `createPostgresCsvFile`

Current selector behavior:

- the backup page and recovery modal now try to load table choices from `GET /api/dev/backups/tables`
- that route calls `getPublicTableNames(client)`
- if that preferred source fails or returns no tables, the frontend falls back to `GET /api/dev/database` and extracts unique table names from the inventory response
- this means the selector prefers validator-aligned tables, but still avoids an empty UI if the preferred route is temporarily unavailable

Important output behavior:

- `NULL` is written as `\N`
- commas, quotes, and newlines are escaped
- the response header now exposes `Content-Disposition` and `X-Backup-Format`, so row-level exports download correctly as `.csv`

## 2. Recovery Methods

The current system supports two recovery types:

| Input | Type | Behavior |
|-------|------|----------|
| `.dump`, `.backup`, `.pgdump` | PostgreSQL Dump | Validates dump signature, inspects TOC, then restores full dump or table data |
| `.csv` | Row Level CSV | Validates headers and upserts row data into the target table |

### 2.1 Full dump recovery (`restoreFullDump`)

Current behavior:

1. uploaded file is written to a temp directory
2. `pg_restore --list` is executed first to inspect the dump TOC
3. dump entries are filtered through `filterManagedSchemaRestoreList`
4. a pre-restore safety backup is created with `pg_dump`
5. `pg_restore` runs with:

```text
--clean
--if-exists
--exit-on-error
--single-transaction
--no-owner
--no-privileges
--use-list <filtered restore list>
--dbname <database>
```

Current design meaning:

- it does not manually drop and recreate the `public` schema anymore
- it tries to restore transactionally, so failed restore should not partially commit
- it intentionally creates a safety dump before changing the database

Important code path:

- `backend/src/routes/devRoutes.js`
  - `POST /api/dev/recovery`
- `backend/src/services/backupRecoveryService.js`
  - `inspectPostgresDump`
  - `createManagedSchemaRestoreList`
  - `createPreRestoreSafetyDump`
  - `restoreFullDump`
- `backend/src/utils/backupToc.js`
  - `inspectPostgresToc`
  - `filterManagedSchemaRestoreList`

### 2.2 Table dump recovery (`restoreTableDump`)

Current behavior:

- the uploaded dump is inspected first
- if the dump is not recognized as a full-database application dump, the route loops through each detected table
- `restoreTableDump` is called once per table
- each table restore runs `pg_restore` with `--table=public.<table>`
- optional `truncateFirst` support exists in code, but the current route does not use it

Important implication:

- a partial multi-table dump can trigger several separate restore passes
- that increases restore time compared with one single full restore

### 2.3 CSV recovery (`restoreCsvFile`)

Current behavior:

1. uploaded CSV is written to a temp file
2. CSV is parsed in Node
3. headers are validated against `information_schema.columns`
4. primary-key columns are read from PostgreSQL metadata
5. rows are inserted one at a time inside a transaction
6. if the CSV contains the primary key, conflicts become `DO UPDATE`
7. otherwise conflicts become `DO NOTHING`

Important code path:

- `backend/src/services/backupRecoveryService.js`
  - `restoreCsvFile`
- `backend/src/utils/csv.js`
  - `parseCsv`

Important difference from the old guide:

- CSV restore is not only `INSERT ... DO NOTHING`
- if the primary key exists in the CSV header, the current code uses `ON CONFLICT (...) DO UPDATE`

## 3. Scheduler

Current scheduler behavior:

- `startBackupScheduler()` starts on backend boot from `backend/app.js`
- polling interval is 60 seconds
- due profiles are claimed in batches using `FOR UPDATE SKIP LOCKED`
- at most 5 due profiles are claimed per cycle
- profiles are marked `RUNNING` before the actual backup starts
- finished artifacts are copied into `BACKUP_STORAGE_DIR`
- history is written to `scheduled_backups`

Current lifecycle fields in `backup_profiles`:

```sql
backup_profiles (
  id,
  profile_name,
  method,
  scope,
  schedule_interval,
  schedule_unit,
  status,
  size,
  is_enabled,
  last_error,
  run_count,
  run_started_at,
  last_backup_at,
  next_backup_at,
  created_at,
  updated_at
)
```

Current practical status meanings:

| Status | Meaning |
|--------|---------|
| `MANUAL` | No active schedule |
| `ACTIVE` | Scheduled and enabled |
| `PAUSED` | Scheduled but disabled |
| `RUNNING` | Currently claimed by scheduler |
| `FAILED` | Last scheduled execution failed |
| `CONFIGURED` | Migration/default legacy state before normalization |

Important code path:

- `backend/src/services/backupScheduler.js`
  - `claimDueProfiles`
  - `processDueProfiles`
  - `generateScheduledBackup`

Important design note:

- scheduled backups are faster to download later because the file already exists on disk
- manual `GET /api/dev/backups/:id/download` always generates a fresh artifact on demand

## 4. API Endpoints

### Backup profiles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dev/backups` | List backup profiles |
| GET | `/api/dev/backups/tables` | List valid `public` base tables for backup/recovery selectors |
| POST | `/api/dev/backups` | Create backup profile |
| PATCH | `/api/dev/backups/:id` | Update backup profile |
| DELETE | `/api/dev/backups/:id` | Delete profile and associated scheduled files |
| GET | `/api/dev/backups/:id/download` | Generate and stream a fresh backup |
| POST | `/api/dev/backups/:id/pause` | Pause schedule |
| POST | `/api/dev/backups/:id/resume` | Resume schedule |

### Scheduled backups

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dev/backups/scheduled` | List saved scheduled artifacts |
| GET | `/api/dev/backups/scheduled/:id/download` | Download a saved scheduled artifact |
| DELETE | `/api/dev/backups/scheduled/:id` | Delete artifact record and remove file |

### Recovery

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dev/recovery` | List recovery history |
| POST | `/api/dev/recovery` | Upload and execute recovery |

Required confirmation text:

| Type | Expected text |
|------|---------------|
| PostgreSQL Dump | `RESTORE POSTGRES DUMP` |
| Row Level CSV | `RECOVER` |

Current access control:

- route role gate: `GLOBAL_ADMIN` or `DEVELOPER_ADMIN`
- capability gate:
  - `/backups` requires `BACKUP`
  - `/recovery` requires `RECOVERY`
  - `/query` and `/queries` require `QUERY`
  - `/maintenance` requires `MAINTENANCE`

## 5. Security

Current security controls:

- JWT authentication through `authMiddleware`
- role restriction through `restrictToRoles("GLOBAL_ADMIN", "DEVELOPER_ADMIN")`
- capability restriction through `requireSystemCapability`
- upload extension whitelist: `.dump`, `.backup`, `.pgdump`, `.csv`
- upload size limit: `100 MB`
- PostgreSQL custom dump signature validation: first bytes must match `PGDMP`
- table-name validation with safe identifier regex
- row filter validation blocks:
  - statement separators
  - SQL comments
  - DDL and destructive keywords
- dump TOC inspection blocks unsupported high-risk object types

Important code path:

- `backend/src/routes/devRoutes.js`
- `backend/src/services/backupService.js`
- `backend/src/services/backupRecoveryService.js`
- `backend/src/utils/backupToc.js`

Important team note:

- backup files cover PostgreSQL data in the managed schema
- they do not back up Supabase Storage objects automatically
- image metadata tables are backed up, but the real object files in storage are separate

## 6. Error Handling

| Scenario | Current behavior |
|----------|------------------|
| PostgreSQL client tools missing | spawn error becomes `AppError` with install guidance |
| Database connection failure | `pg_dump` or `pg_restore` fails and returns stderr-derived message |
| Corrupted dump upload | rejected by signature check or TOC inspection |
| Unsupported object in dump | rejected during TOC inspection |
| Invalid CSV | rejected by header/row validation before commit |
| Two recoveries started at once | in-process lock throws `RECOVERY_IN_PROGRESS` |
| Scheduled backup failure | `backup_profiles.status` becomes `FAILED`, error written to `last_error`, failure row inserted into `scheduled_backups` |
| Restore failure | full restore should not commit due to `--single-transaction`; CSV restore rolls back explicit transaction |

Important corrections to the old guide:

- there is now a pre-restore safety dump before full restore
- scheduled backup state includes `run_count`, `run_started_at`, and `updated_at`
- scheduled failures are recorded in `scheduled_backups`

Important limitation:

- `withRecoveryLock` is an in-memory lock inside one backend process
- it prevents concurrent recovery only inside the current Node instance
- it is not a distributed/database-backed lock

## 7. Best Practices

- use scheduled backups when you want faster later downloads of prepared artifacts
- use full dump restore only when you really intend to replace broad application state
- test CSV recovery separately from PostgreSQL dump recovery because the behavior is different
- keep `BACKUP_STORAGE_DIR` outside public web-serving paths
- install PostgreSQL client tools on the backend machine because `pg_dump` and `pg_restore` are required
- monitor `last_error`, `run_count`, `last_backup_at`, and `next_backup_at`
- remember that storage objects are not included automatically
- treat row-level CSV recovery carefully because it can update existing rows if primary keys are present

---

## 8. Why Backup And Recovery Feel Slow On Localhost

This is the main performance explanation the team should know.

### 8.1 Manual backup is generated on demand

When you click download for a backup profile, the app does not send a prebuilt file unless you are downloading from `scheduled_backups`.

Instead it does this live:

1. validate the profile
2. create a temp directory
3. run `pg_dump` or query data for CSV
4. write the artifact to disk
5. stat the file
6. update metadata in `backup_profiles`
7. start streaming the file
8. clean up the temp directory after the response finishes

So the wait time is real backup work, not just download time.

### 8.2 `pg_dump` is expensive by design

For dump-based backups, `pg_dump` must:

- connect to PostgreSQL
- read schema metadata
- read table data
- serialize the dump
- compress the custom-format output
- write the full artifact to disk

Even on localhost app code, this can still be slow because the database may actually be remote Supabase, not a local PostgreSQL instance.

### 8.3 CSV backup loads the whole query result into Node

Row-level backup is not streamed row-by-row from PostgreSQL to CSV.

Current code:

- runs the `SELECT`
- receives all rows into application memory
- converts them to CSV in JavaScript
- writes the whole file to disk

For large row selections, this can feel slower than expected.

### 8.4 Full restore is intentionally heavy

Full dump recovery currently does extra safety work:

1. save upload to temp file
2. inspect dump contents with `pg_restore --list`
3. create a pre-restore safety dump
4. create a filtered restore list
5. execute the actual `pg_restore`

This means one full recovery can include both:

- one `pg_dump`
- multiple `pg_restore` operations

That is much slower than a simple direct import, but it is safer.

### 8.5 Partial dump recovery can repeat work per table

If the uploaded dump is treated as a partial application dump, the route loops over each discovered table and calls `restoreTableDump()` separately.

That means:

- repeated `pg_restore` work
- repeated restore-list handling
- repeated database write work

So a dump containing many tables can take noticeably longer.

### 8.6 CSV recovery is row-by-row

CSV restore does not use PostgreSQL `COPY`.

Current code:

- parses CSV in Node
- builds insert statements
- executes one insert per row inside a transaction

That is much slower than bulk-load tooling, especially on larger files.

### 8.7 Windows + child-process + disk I/O overhead

On local development, extra delay can also come from:

- spawning `pg_dump` / `pg_restore`
- writing temp files under OS temp directories
- copying scheduled files into `BACKUP_STORAGE_DIR`
- antivirus or Windows filesystem overhead

### 8.8 What to say in presentation

Use this explanation:

- slower backup and restore is expected because the current design prioritizes correctness and safety over raw speed
- full recovery performs validation and a safety dump before actual restore
- manual backup generation is on-demand, so generation time is visible to the user
- CSV recovery is application-level row upsert, not native bulk `COPY`

---

## 9. Additional Team Notes

The team should know these current-state facts:

- scheduled backup download is not the same thing as manual backup download
- manual backup generates a new file each time
- scheduled backup download serves an already-saved artifact
- full recovery creates a safety dump first
- CSV restore may update rows if the CSV includes primary-key columns
- the current recovery lock is only per backend instance
- backup metadata lives in database tables, but files also exist on disk
- there is audit logging for backup and recovery actions through `logAuditAction`

---

## 10. Member Focus

### Layhok: Global admin + developer interface

Main focus:

- `backend/src/routes/devRoutes.js`
- `backend/src/services/backupService.js`
- `backend/src/services/backupRecoveryService.js`
- `backend/src/services/backupScheduler.js`

Must be able to explain:

- why developer routes are capability-gated
- the difference between manual backup download and scheduled backup download
- why full restore is slower because of TOC inspection and safety dump
- what the backup lifecycle fields mean

### Pav: Vendor + Business Assistance

Main focus:

- understand backup and recovery as internal/admin features, not vendor-facing features
- understand which business tables matter most during backup:
  - `users`
  - `places`
  - `place_hours`
  - `menu_items`
  - `place_menu_items`
  - `reviews`
  - image metadata tables

Must be able to explain:

- why CSV recovery is useful for targeted fixes
- why backup does not include actual storage objects automatically
- which restored tables affect vendor-facing operations

### Smey: Consumer

Main focus:

- understand backup impact on consumer-visible tables:
  - `places`
  - `reviews`
  - `bookmarks`
  - `routes`
  - `search_history`

Must be able to explain:

- how restore affects consumer data consistency
- why safety-first restore matters for ratings, reviews, and saved user data
- why the slower process is acceptable for recovery because it protects correctness

---

*Document version 3.0 - updated to the current July 2026 implementation with capability-gated developer routes, safety-dump full restore, current scheduler lifecycle fields, CSV upsert restore behavior, and performance explanation for localhost testing.*
