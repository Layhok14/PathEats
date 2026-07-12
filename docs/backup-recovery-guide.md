# PathEats — Backup & Recovery Technical Guide

> **Audience**: Developer administrators and backend engineers  
> **Scope**: PostgreSQL/Supabase backup, restore, scheduler, error handling  
> **Files referenced**: `backend/src/services/backupService.js`, `backupRecoveryService.js`, `backupScheduler.js`, `routes/devRoutes.js`

---

## 1. Backup Methods

The system supports three backup methods:

| Method | Tool | Output | Use Case |
|--------|------|--------|----------|
| **Entire Database** | `pg_dump` custom | `.dump` | Full daily snapshots |
| **Specific Tables** | `pg_dump` custom | `.dump` | Targeted table backups |
| **Specific Rows** | `SELECT * FROM` query | `.csv` | On-demand row export |

### 1.1 Full Database / Specific Tables (`createPostgresDumpFile`)

```
pg_dump --format=custom --no-owner --no-privileges --no-comments --schema=public --file=backup.dump
```

- Uses `pg_dump` child process (requires PostgreSQL client tools installed)
- Custom format is compressed, supports selective restore
- Tables specified via `--table=public.{name}` flags

### 1.2 Row-Level CSV (`createPostgresCsvFile`)

- Executes `SELECT * FROM {table} WHERE {condition}` via `pg` pool
- Writes standard CSV with `\N` for NULLs, quoted fields for commas/newlines
- No `pg_dump` dependency

## 2. Recovery Methods

The system supports **two** recovery types (Logical Backup was removed):

| Input | Type | Behavior |
|-------|------|----------|
| `.dump` | **PostgreSQL Dump** | Full: Drops + recreates `public` schema (`restoreFullDump`). Table: merges via staging schema (`restoreTableDump`) |
| `.csv` | **Row Level CSV** | Row-by-row `INSERT ... ON CONFLICT DO NOTHING` via `restoreCsvFile` |

### 2.1 Full Dump Recovery (`restoreFullDump`)

1. `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
2. `CREATE EXTENSION postgis; CREATE EXTENSION pgcrypto;`
3. `pg_restore --single-transaction --exit-on-error`

> ⚠ Destructive — all existing data in `public` schema is replaced. No safety backup is taken.

### 2.2 Table Dump Recovery (`restoreTableDump`)

1. Create staging schema `restore_{uuid}`
2. `CREATE TABLE LIKE` for target tables in staging
3. `pg_restore --data-only` → SQL file
4. Rewrite `COPY public.{t}` → `COPY restore_{uuid}.{t}`
5. `psql` runs the rewritten SQL
6. Merge staging → public with `ON CONFLICT DO NOTHING`
7. Drop staging schema

### 2.3 CSV Recovery (`restoreCsvFile`)

1. Parse header row, validate columns against `information_schema.columns`
2. Begin transaction, insert rows one-at-a-time with `ON CONFLICT DO NOTHING`
3. `\N` → NULL, empty → NULL for non-text columns

## 3. Scheduler

- `setInterval` polling every 60 seconds
- `claimDueProfiles` uses `FOR UPDATE SKIP LOCKED` (limit 5) to prevent duplicate execution
- Profiles are simple: `is_enabled`, `last_backup_at`, `next_backup_at`
- No state machine, no `run_count`, no `run_started_at`, no `updated_at`

### Profile Columns

```sql
backup_profiles (
  id, profile_name, method, scope,
  schedule_interval, schedule_unit,
  is_enabled, last_error,
  last_backup_at, next_backup_at, created_at
)
```

## 4. API Endpoints

### Backup Profiles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dev/backups` | List profiles |
| POST | `/api/dev/backups` | Create profile |
| PATCH | `/api/dev/backups/:id` | Update profile |
| DELETE | `/api/dev/backups/:id` | Delete profile + files |
| GET | `/api/dev/backups/:id/download` | Generate + download backup |
| POST | `/api/dev/backups/:id/pause` | Disable schedule |
| POST | `/api/dev/backups/:id/resume` | Enable schedule |

### Scheduled Backups

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dev/backups/scheduled` | List scheduled backups |
| GET | `/api/dev/backups/scheduled/:id/download` | Download file |
| DELETE | `/api/dev/backups/scheduled/:id` | Delete + remove file |

### Recovery

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/dev/recovery` | Upload & restore dump or CSV |

Requires confirmation text (per type):
| Type | Expected Text |
|------|---------------|
| PostgreSQL Dump | `RESTORE POSTGRES DUMP` |
| Row Level CSV | `RECOVER` |

## 5. Security

- All routes gated by `[GLOBAL_ADMIN, DEVELOPER_ADMIN]` roles
- JWT authentication via `authMiddleware`
- File validation: magic bytes (`PGDMP` for dumps), extension whitelist (`.dump`, `.backup`, `.pgdump`, `.csv`), 100 MB size limit
- Recovery type validation: only `"PostgreSQL Dump"` and `"Row Level CSV"` accepted (`RECOVERY_TYPES` set)
- Identifier validation: `^[a-z_][a-z0-9_]*$`
- Row conditions: no `;`, `--`, `/* */`, or DDL keywords

## 6. Error Handling

| Scenario | Behavior |
|----------|----------|
| Database offline | `runPostgresTool` fails with stderr message → `AppError(500)` |
| Disk full | Temp dir cleaned up in `catch` → `AppError(500)` |
| Permission denied | `ENOENT` → install instructions; `EACCES` → spawn error |
| Corrupted dump | `PGDMP` magic byte check at upload; `pg_restore --exit-on-error` |
| Interrupted backup | Temp dir leaked (acceptable); scheduler retries on next tick |
| Interrupted recovery | `pg_restore --single-transaction` rolls back; CSV wrapped in `BEGIN/COMMIT` |

## 7. Best Practices

- **Full backups daily**, specific tables hourly, row-level on-demand
- **No automatic retention** — use `DELETE /backups/scheduled/:id` for cleanup
- **Safe download names**: lowercase, hyphens, max 80 chars
- **Test restores regularly** on a staging database
- **BACKUP_STORAGE_DIR** should be outside web root
- **No encryption at rest** — encrypt the filesystem volume or add application-level AES-256-GCM

---

*Document version 2.0 — reflects simplified system after July 2026 consolidation. Removed: logical JSON backup, safety backup workflow, state machine, backupToc inspection, TOC parsing, ordered table lists.*
