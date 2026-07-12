# PathEats — Audit Plan Flow Guide (Backend & DBA)

> **Purpose**: Explains what the Audit Plan (`AUDIT-PLAN.md`) wants to achieve, maps every finding to the current code, and shows the Backend Developer and DBA what is resolved, what is broken, and what to do next.

---

## Table of Contents

1. [What the Audit Plan Is](#1-what-the-audit-plan-is)
2. [Backup & Recovery Assessment](#2-backup--recovery-assessment)
3. [Audit Plan Issues — Resolved vs Unresolved](#3-audit-plan-issues--resolved-vs-unresolved)
4. [Backend Developer Flow](#4-backend-developer-flow)
5. [DBA Flow](#5-dba-flow)
6. [Phase-by-Phase Action Items](#6-phase-by-phase-action-items)
7. [File Reference Map](#7-file-reference-map)

---

## 1. What the Audit Plan Is

The audit plan (`docs/AUDIT-PLAN.md`) is a **cross-role consistency and integrity audit** of the entire PathEats system. It answers one question:

> **"Do Vendor, Global Admin, Business Assistant, and Consumer interfaces all operate on the same data model, with proper ownership, authorization, and data integrity?"**

It covers 31 sections across these categories:

| Category | Sections | Goal |
|----------|----------|------|
| Role & Access Control | 1, 4, 5, 25, 28 | Ensure roles are enforced at both middleware and DB level |
| Place/Store Model | 2, 3, 6, 7, 8, 9, 10 | Ensure all interfaces create/edit/read the same fields consistently |
| Menu Items | 11, 12, 13, 14, 15, 16, 17 | Ensure ownership, cascading, and linking are correct |
| Lifecycle & Visibility | 18, 19, 20, 21, 22, 23, 24 | Ensure ban/close/open/approve workflows work end-to-end |
| Data Integrity | 26, 27, 29 | DB-level constraints, shared validation, no dual sources of truth |
| Testing | 30, 31 | 30 test scenarios + 4-phase implementation plan |

---

## 2. Backup & Recovery Assessment

### Status: MOSTLY RESOLVED

The backup and recovery system was consolidated in July 2026. Here is what exists now:

### 2.1 What Works

| Component | File | Status | Details |
|-----------|------|--------|---------|
| Backup Service | `backend/src/services/backupService.js` | Working | 3 methods: Entire DB, Specific Tables, Specific Rows (CSV) |
| Recovery Service | `backend/src/services/backupRecoveryService.js` | Working | 3 methods: Full dump restore, Table dump merge, CSV import |
| Scheduler | `backend/src/services/backupScheduler.js` | Working | 60s polling, `FOR UPDATE SKIP LOCKED`, auto-retry on FAILED |
| Migration | `migrations/2026-07-12-backup-lifecycle.sql` | Applied | Adds `is_enabled`, `run_count`, `run_started_at`, `updated_at` |
| API Endpoints | `routes/devRoutes.js` | Working | CRUD for profiles, download, pause/resume, scheduled list, recovery upload |
| Documentation | `docs/backup-recovery-guide.md` | Current | v2.0, reflects simplified system |
| Security | `backupService.js:44-78` | Working | Identifier validation, row condition SQL injection protection |
| File Validation | `devRoutes.js` | Working | Magic bytes (`PGDMP`), extension whitelist, 100MB limit |

### 2.2 Backup Methods — How They Flow

```
Admin creates profile via API
  → backupService.validateBackupProfile()
    → parseScope() extracts table names or row conditions
    → validateIdentifier() ensures safe SQL identifiers
    → validateRowCondition() blocks injection

Scheduler picks up due profile (every 60s)
  → claimDueProfiles()
    → FOR UPDATE SKIP LOCKED prevents double-run
    → Sets status = 'RUNNING', run_started_at = NOW()
  → generateScheduledBackup()
    → backupService.generateBackupForProfile()
      → "Entire Database" / "Specific Tables" → createPostgresDumpFile()
        → pg_dump --format=custom --no-owner --no-privileges
      → "Specific Rows" → createPostgresCsvFile()
        → SELECT * FROM table WHERE condition → CSV
    → Copies temp file to BACKUP_STORAGE_DIR
    → Inserts into scheduled_backups table
    → Updates profile: last_backup_at, next_backup_at, run_count++
    → On error: status = 'FAILED', last_error = message
```

### 2.3 Recovery Methods — How They Flow

```
Admin uploads file via POST /api/dev/recovery
  → Validates type ∈ RECOVERY_TYPES (["PostgreSQL Dump", "Row Level CSV"])
  → Validates file extension (magic bytes for .dump, .csv for CSV)
  → Validates confirmation text:
      "PostgreSQL Dump" → "RESTORE POSTGRES DUMP"
      "Row Level CSV"  → "RECOVER"

PostgreSQL Dump — Full Restore (restoreFullDump):
  → pg_terminate_backend() kills active connections
  → DROP SCHEMA public CASCADE; CREATE SCHEMA public;
  → CREATE EXTENSION postgis; CREATE EXTENSION pgcrypto;
  → pg_restore --single-transaction --exit-on-error
  → DANGEROUS: Drops entire public schema, all data replaced

PostgreSQL Dump — Table Restore (restoreTableDump):
  → Creates staging schema restore_{uuid}
  → CREATE TABLE LIKE for target tables in staging
  → pg_restore --data-only → SQL file
  → Rewrites COPY public.{t} → COPY restore_{uuid}.{t}
  → psql runs rewritten SQL
  → Merges staging → public with ON CONFLICT DO NOTHING
  → Drops staging schema

CSV Restore (restoreCsvFile):
  → Parse header row, validate columns against information_schema.columns
  → BEGIN transaction
  → INSERT rows one-at-a-time with ON CONFLICT DO NOTHING
  → \N → NULL, empty → NULL for non-text columns
  → COMMIT
```

Confirmation text is per-type via `expectedRecoveryConfirmation()`:
```js
function expectedRecoveryConfirmation(type) {
  return type === "PostgreSQL Dump" ? "RESTORE POSTGRES DUMP" : "RECOVER";
}
```

### 2.4 Remaining Backup Gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| No automatic retention policy | Medium | Old backups accumulate; must manually DELETE via API |
| No encrypted off-site backup | Low | Documented as best practice; filesystem-level encryption recommended |
| No backup integrity verification | Low | No post-backup checksum validation |
| Scheduler has no health check endpoint | Low | Must check logs for `[BackupScheduler]` messages |

---

## 3. Audit Plan Issues — Resolved vs Unresolved

### 3.1 PASS Findings (Already Correct)

| Section | Finding | Why It Passes |
|---------|---------|---------------|
| 3.2 | Vendor ownership enforcement | `WHERE owner_id = $2` from JWT, not request body |
| 4.3 | No separate admin/vendor copies | Both write to same `places` table |
| 8.2 | Coordinate convention | All interfaces use (lat,lng) → PostGIS (lng,lat) |
| 9.3 | Place hours unique constraint | `UNIQUE(place_id, day_of_week)` present |
| 13.1 | Place-menu junction PK | Composite PK prevents duplicate links |
| 14.1 | Menu linking owner match | All linking verifies `menu_items.owner_id` |
| 16.1 | Unlink does not delete item | Only `place_menu_items` row removed |
| 19.2 | is_open/status sync | Application prevents conflicting combinations |
| 21.1 | Consumer visibility | Consistent `is_banned = FALSE` + `status = 'active'` + `is_open = TRUE` |
| 27 | Stall creation form shared | Single `StallCreatePage.tsx` with mode detection |
| 28 | Authorization tests | Frontend `AuthGuard` + backend `rbacGuard` both present |

### 3.2 FIXED Findings (Resolved by Migrations)

| # | Section | Finding | Migration | Status |
|---|---------|---------|-----------|--------|
| 9.3 | No unique constraint on place hours | `2026-07-11-add-review-unique-index.sql` + PK in seed | **FIXED** |
| 29 #9 | Place hours uniqueness | Seed DDL has `UNIQUE(place_id, day_of_week)` | **FIXED** |
| 29 | Backup lifecycle columns | `2026-07-12-backup-lifecycle.sql` | **FIXED** |

### 3.2b FIXED Findings (Resolved by Code Changes, July 12)

| Finding | File(s) | Fix |
|---------|---------|-----|
| 20.1: Ban does not revoke active JWT | `adminRepository.js:419` | Added `tokenRepo.revokeAllForUser(id)` when `banned=true` |
| 20.1: Password reset doesn't revoke sessions | `AuthService.js:321` | Added `tokenRepo.revokeAllForUser(user.id)` |
| 20.1: Password change doesn't revoke sessions | `AuthService.js:337` | Added `tokenRepo.revokeAllForUser(userId)` |
| `findNearbyStalls` includes non-active stalls | `VendorRepository.js:549` | Changed `status != 'deleted'` → `status = 'active'` |
| "Logical Backup" recovery type still accepted | `devRoutes.js` | Removed from `RECOVERY_TYPES` set + removed dead code blocks |
| Consumer image ignores `storage_image` fallback | `VendorPhoto.tsx:17`, `MenuGallery.tsx:28` | Added `storage_image` fallback chain |

Backend lint: 0 errors. Frontend build: passed.

### 3.3 UNRESOLVED Findings (Still Broken)

#### HIGH Severity

| # | Section | Issue | Current State | What To Do |
|---|---------|-------|---------------|------------|
| 1 | 1.3 | No CHECK constraint on `users.role_scope` | `TEXT NOT NULL DEFAULT 'CONSUMER'`, CHECK explicitly dropped in migration | Add CHECK constraint migration or FK to `role.name` |
| 2 | 5.1 | No `business_assistant_assignments` table | BA sees ALL vendors/places (same as Global Admin) | Create assignments table + filter all BA queries |
| 3 | 23-24 | No per-vendor onboarding data model | `onboarding_config` is global instructional text only | Create `vendor_onboarding`, `vendor_onboarding_steps`, `onboarding_documents` tables |
| 4 | 2.4 | No `approval_status` column on places | Only `active`/`closed` via `status`; `is_admin_managed` conflates 3 concepts | Add `approval_status TEXT` column + update queries |
| 5 | 7.2 | Consumer categories hardcoded | `CUISINE_OPTIONS` in `appConfig.js` ignores DB `place_categories` | Create API endpoint, fetch in frontend |
| 6 | 11.2 | Admin `updateMenuItem` has no ownership check | Updates any menu item by ID without verifying `owner_id` | Add owner-match verification |
| 7 | 17.1 | Menu item deletion silent cascade | Deleting item removes all place links with no warning | Show affected link count in confirmation |
| 8 | 18.2 | Place deletion not soft-delete | Physical `DELETE` with permanent data loss | Add `deleted_at TIMESTAMPTZ` column |

#### MEDIUM Severity

| # | Section | Issue | Current State | What To Do |
|---|---------|-------|---------------|------------|
| 9 | 2.4 | `is_admin_managed` conflates 3 purposes | Used as: admin lock, admin-created flag, ban indicator | Separate into distinct fields or document clearly |
| 10 | 3.3 | Menu item availability reset on update | `linkMenuItemsToPlace` reinserts with `is_available = TRUE` always | Preserve existing availability during reinsert |
| 11 | 10.1 | Dual image source (`photo_url` + `place_images`) | Both written during create/update | Deprecate `photo_url` writes |
| 12 | 10.2 | No primary image unique constraint | App logic handles, but DB allows multiple primaries | Add partial unique index |
| 13 | 12.1 | Dual menu item image source | Same issue as place images | Deprecate `image_url` writes |
| 14 | 16.2 | Admin `deleteStallMenuItem` no ownership check | Unlinks any item from any place | Add owner verification |
| 15 | ~~20.1~~ | ~~Ban does not revoke active JWT~~ | **FIXED** — `adminRepository.updateStatus()` now calls `tokenRepo.revokeAllForUser()` on ban. Also fixed: `resetPassword` and `changePassword` in `AuthService.js` revoke all sessions | ✅ |
| 16 | 20.2 | Unban does not restore places | Places stay closed after unbanning | Auto-restore on unban |
| 17 | 25 | Vendor operations not logged to audit_log | Only admin/BA operations logged | Add vendor audit logging |
| 18 | 26 | Validation duplicated across roles | `VendorModel`, `AdminService`, `vendorController` | Consolidate into shared utils |
| 19 | 22 | Admin mutations don't refetch list | No automatic list refresh after edits | Add refetch after mutations |
| 20 | 18.2 | BA can delete places | Should only close, not delete | Restrict BA delete route |

#### LOW Severity

| # | Section | Issue | What To Do |
|---|---------|-------|------------|
| 21 | 3.3 | Orphaned Supabase Storage objects on image replace | Delete old objects |
| 22 | 15 | `menu_items` has no `updated_at` | Add trigger |
| 23 | 9.3 | Consumer hours grouped into 2 buckets | Show per-day hours |
| 24 | 19.3 | Consumer count ignores time-based hours | Check place_hours for current time |
| 25 | 4.4 | Admin updateStall doesn't check self-assignment | Harmless, skip |
| 26 | 8.2 | Default coordinates (Phnom Penh center) on missing input | Validate or reject |
| 27 | 26 | `sanitizeText` not used by admin | Add to admin operations |

### 3.4 Unresolved Test Scenarios

| # | Scenario | Status | Blocker |
|---|----------|--------|---------|
| 3 | Vendor uploads multiple images | PARTIAL | No primary image constraint |
| 9 | Vendor deletes item linked to multiple places | NEEDS FIX | Silent cascade, no warning |
| 10 | Vendor deletes place with dependencies | NEEDS FIX | No soft delete |
| 14 | BA attempts unauthorized delete | NEEDS FIX | Currently allowed |
| 21 | Vendor replaces image | NEEDS IMPROVEMENT | Old image not cleaned |
| 23 | Multiple primary images exist | NEEDS FIX | DB constraint missing |
| 24 | Place category renamed | NEEDS FIX | Consumer filter hardcoded |
| 28 | Concurrent vendor and admin edit | RISK | Last-write-wins |
| 29 | Invalid coordinates submitted | NEEDS FIX | Defaults to Phnom Penh |

---

## 4. Backend Developer Flow

### 4.1 Authentication & Authorization Flow

```
Request arrives
  → authMiddleware.js: Validates JWT, attaches req.user = { sub, role_scope, ... }
  → rbacGuard.js: Checks req.user.role_scope against route permission
  → restrictToRoles(): Enforces GLOBAL_ADMIN / BUSINESS_ASSISTANCE / VENDOR / CONSUMER
```

**Key files:**
- `backend/src/middlewares/authMiddleware.js` — JWT verification
- `backend/src/middlewares/rbacGuard.js` — Role-based access control
- `backend/src/utils/roles.js` — Frozen `ROLES` constant (5 values)
- `backend/src/services/AuthService.js` — Login/register, token generation (`_generateTokens` at line 339)

### 4.2 Place/Store CRUD Flow

```
Vendor creates stall:
  POST /vendor/stalls
  → VendorService.createStall()
    → Validates owner_id = req.user.sub (from JWT)
    → VendorRepository.create() — transaction:
      1. INSERT INTO places (owner_id = vendor ID)
      2. UPSERT place_images (primary image)
      3. DELETE all + INSERT place_hours (7 days)
      4. Link menu_items via place_menu_items

Admin creates stall:
  POST /admin/stalls
  → AdminService.createStall()
    → Validates new owner is VENDOR role
    → adminRepository.createStall() — transaction:
      1. INSERT INTO places (owner_id = selected vendor)
      2. UPSERT place_images
      3. DELETE all + INSERT place_hours
      4. Link menu_items
```

**Key files:**
- `backend/src/services/VendorService.js` — Vendor business logic
- `backend/src/services/AdminService.js` — Admin business logic
- `backend/src/repositories/VendorRepository.js` — Vendor DB queries
- `backend/src/repositories/adminRepository.js` — Admin DB queries
- `backend/src/repositories/PlaceRepository.js` — Shared place queries

### 4.3 Menu Item Ownership Flow

```
Vendor links item to stall:
  VendorRepository.linkMenuItemsToPlace(client, placeId, ownerId, itemIds)
    → Verifies mi.owner_id = ownerId (vendor's own items only)
    → DELETE existing links + INSERT new links
    → Uses place's owner_id for verification

Admin creates item for stall:
  adminRepository.createStallMenuItem()
    → CTE: Gets place's owner_id from places table
    → INSERT INTO menu_items (owner_id = place's owner)
    → Links via place_menu_items

Admin updates item:
  adminRepository.updateMenuItem()
    → ⚠ NO ownership check — updates any item by ID
```

### 4.4 Backup & Recovery Flow

```
Backup:
  POST /api/dev/backups
  → Creates backup profile (method + scope)
  → Scheduler picks up → pg_dump or SELECT → file stored
  → GET /api/dev/backups/:id/download → stream file

Recovery:
  POST /api/dev/recovery
  → Uploads .dump or .csv file
  → Full: pg_restore (destructive)
  → Table: staging schema merge (safe)
  → CSV: TRUNCATE + COPY FROM STDIN
```

**Key files:**
- `backend/src/routes/devRoutes.js` — All backup/recovery endpoints
- `backend/src/services/backupService.js` — Backup generation
- `backend/src/services/backupRecoveryService.js` — Restore operations
- `backend/src/services/backupScheduler.js` — Automated scheduling

---

## 5. DBA Flow

### 5.1 Database Schema Overview

**Core tables (from seed-data.sql):**

```
users ──────────────────── authentication + roles
  ├── refresh_tokens       JWT refresh token storage
  ├── audit_log            Admin/BA operation log
  └── session_events       Login/logout tracking

places ──────────────────── stores/stalls
  ├── place_categories     9 seed categories
  ├── place_hours          7-day schedule per place
  ├── place_images         Modern image storage
  └── place_menu_items     Junction: places ↔ menu_items

menu_items ──────────────── food catalog
  └── menu_item_images     Modern image storage

reviews ──────────────────── consumer reviews
onboarding_config ─────────── global instructional text
role ──────────────────────── admin UI display only
backup_profiles ───────────── backup configuration
scheduled_backups ─────────── backup history
database_activity_log ─────── admin/BA activity log
```

### 5.2 Migration System

```bash
# Apply all migrations in sort order
npm run migrate

# Apply migrations + RLS policies
npm run migrate:with-rls

# Seed fresh database
npm run seed
```

**Migration runner** (`backend/src/db/migrate.js`):
1. Reads all `.sql` files from `backend/src/db/migrations/`
2. Applies them in filename sort order (date-prefixed)
3. Then applies `indexing.sql` for performance indexes
4. Optionally applies `supabase-rls-policies.sql`

**Current migrations (14 files):**
- `2026-06-28` through `2026-07-12`
- Cover: session schema, media ownership, place ownership rules, status normalization, review constraints, menu item references, backup lifecycle

### 5.3 Backup & Recovery Operations

**Manual backup (via API):**
```
POST /api/dev/backups
{
  "profile_name": "daily-full",
  "method": "Entire Database",
  "scope": "schema:public",
  "schedule_interval": "1",
  "schedule_unit": "Days"
}
```

**Scheduler runs automatically** — checks every 60 seconds, picks up due profiles using `FOR UPDATE SKIP LOCKED` (max 5 concurrent).

**Manual restore:**
```
POST /api/dev/recovery
Body: multipart/form-data with file + confirmation text
```

**Recovery safety:**
- Full restore: terminates all connections, drops + recreates public schema
- Table restore: staging schema merge, non-destructive
- CSV restore: TRUNCATE + COPY, transactional

### 5.4 DBA Responsibilities (Per Audit Plan)

| Task | Frequency | Command/Action |
|------|-----------|----------------|
| Run migrations after schema changes | On deploy | `npm run migrate` |
| Apply RLS policies | After auth setup | `npm run migrate:with-rls` |
| Verify backup scheduler running | Daily | Check logs for `[BackupScheduler]` |
| Clean up old scheduled backups | Weekly | `DELETE /api/dev/backups/scheduled/:id` |
| Test restore on staging | Monthly | Upload dump to staging recovery endpoint |
| Monitor `backup_profiles.last_error` | Daily | `SELECT * FROM backup_profiles WHERE last_error IS NOT NULL` |
| Check `backup_profiles.status` | Daily | Ensure no profiles stuck in `RUNNING` |

### 5.5 Pending Schema Changes (Audit Plan)

These migrations need to be created and applied:

| Migration File | Purpose | Priority |
|----------------|---------|----------|
| `2026-07-12-role-scope-constraint.sql` | CHECK constraint on `users.role_scope` | HIGH |
| `2026-07-12-place-approval-status.sql` | `approval_status` column on places | HIGH |
| `2026-07-12-ba-assignments.sql` | `business_assistant_assignments` table | HIGH |
| `2026-07-12-vendor-onboarding.sql` | `vendor_onboarding` + steps tables | HIGH |
| `2026-07-12-soft-delete-places.sql` | `deleted_at` on places | HIGH |
| `2026-07-12-primary-image-unique.sql` | Partial unique index for primary images | MEDIUM |
| `2026-07-12-menu-items-updated-at.sql` | `updated_at` trigger for menu_items | MEDIUM |

---

## 6. Phase-by-Phase Action Items

### Phase 1: Critical (Blocks Other Work)

| # | Task | Owner | Files |
|---|------|-------|-------|
| 1.1 | Add CHECK constraint on `users.role_scope` | DBA | New migration |
| 1.2 | Create `business_assistant_assignments` table | DBA + Backend | New migration + `adminRepository.js` |
| 1.3 | Create `vendor_onboarding` + steps tables | DBA + Backend | New migration + new service |
| 1.4 | Add `approval_status` column to places | DBA + Backend | New migration + queries |
| 1.5 | Update BA queries to filter by assignments | Backend | `adminRepository.js` |

### Phase 2: High (Data Integrity)

| # | Task | Owner | Files |
|---|------|-------|-------|
| 2.1 | Stop writing to `places.photo_url` | Backend | `VendorRepository.js`, `adminRepository.js` |
| 2.2 | Stop writing to `menu_items.image_url` | Backend | Same |
| 2.3 | Add primary image unique constraint | DBA | New migration |
| 2.4 | Consumer fetches categories from API | Frontend + Backend | `FilterPanel.tsx`, new endpoint |
| 2.5 | Deletion impact warnings | Frontend | `StallDetailPage.tsx`, `MenuItemsPage.tsx` |
| 2.6 | Add `deleted_at` for soft deletion | DBA + Backend | New migration + queries |
| 2.7 | Validate category before delete | Backend | `adminRepository.js` |
| 2.8 | Add vendor audit logging | Backend | `VendorService.js` |
| 2.9 | Validate coordinates range | Backend | `VendorModel.js`, `AdminService.js` |

### Phase 3: Medium (Polish)

| # | Task | Owner |
|---|------|-------|
| 3.1 | Preserve menu item availability on update | Backend |
| 3.2 | Clean old Supabase Storage objects | Backend |
| 3.3 | Add `updated_at` trigger for menu_items | DBA |
| 3.4 | Admin `updateMenuItem` ownership check | Backend |
| 3.5 | BA cannot delete places (only close) | Backend |
| 3.6 | Menu item deletion shows link count | Frontend |
| 3.7 | Consolidate validation into shared utils | Backend |
| 3.8 | Admin mutation refetching | Frontend |
| 3.9 | Consumer categories endpoint | Backend |
| 3.10 | Review count in delete confirmation | Frontend |

### Phase 4: Low (Nice-to-Have)

| # | Task | Owner |
|---|------|-------|
| 4.1 | Extract shared form components | Frontend |
| 4.2 | Consumer count uses time-based hours | Backend |
| 4.3 | Supabase Realtime for consumer view | Frontend |
| 4.4 | Unban restores place statuses | Backend |
| 4.5 | Reject invalid coordinates | Backend |
| 4.6 | Admin sanitize text inputs | Backend |

---

## 7. File Reference Map

### Backend Services

| File | Purpose |
|------|---------|
| `backend/src/services/AuthService.js` | JWT generation, login, register, token refresh |
| `backend/src/services/VendorService.js` | Vendor stall/menu business logic |
| `backend/src/services/AdminService.js` | Admin stall/menu/user business logic |
| `backend/src/services/PlaceService.js` | Shared place queries + consumer view |
| `backend/src/services/backupService.js` | Backup generation (pg_dump + CSV) |
| `backend/src/services/backupRecoveryService.js` | Restore operations |
| `backend/src/services/backupScheduler.js` | Automated backup scheduling |

### Backend Repositories

| File | Purpose |
|------|---------|
| `backend/src/repositories/VendorRepository.js` | Vendor DB queries (owner-scoped) |
| `backend/src/repositories/adminRepository.js` | Admin DB queries (all-access) |
| `backend/src/repositories/PlaceRepository.js` | Shared place queries |

### Backend Middlewares

| File | Purpose |
|------|---------|
| `backend/src/middlewares/authMiddleware.js` | JWT verification, attaches `req.user` |
| `backend/src/middlewares/rbacGuard.js` | Role-based route protection |

### Database Files

| File | Purpose |
|------|---------|
| `backend/src/db/migrate.js` | Migration runner |
| `backend/src/db/seed.js` | Seed runner |
| `backend/src/db/seed-data.sql` | Full DDL + seed data |
| `backend/src/db/indexing.sql` | Performance indexes |
| `backend/src/db/indexes.sql` | Extended indexes (backup/activity log) |
| `backend/src/db/policies.sql` | Supabase RLS policies |
| `backend/src/db/role.js` | Post-seed password hashing |

### Migrations (Applied)

| File | Purpose |
|------|---------|
| `2026-06-28-session-schema.sql` | refresh_tokens, audit_log, session_events |
| `2026-06-29-cleanup-old-place-images-columns.sql` | Drop legacy columns |
| `2026-06-29-place-ownership-rules.sql` | is_admin_managed + CHECK constraint |
| `2026-06-29-supabase-media-ownership.sql` | Image tables with ownership |
| `2026-06-30-require-place-vendor-owner.sql` | owner_id NOT NULL + trigger |
| `2026-07-01-onboarding-config-extended.sql` | steps, safety_tips, footer |
| `2026-07-01-rebalance-seed-place-owners.sql` | Even vendor distribution |
| `2026-07-02-normalize-place-status.sql` | active/closed only |
| `2026-07-11-add-review-unique-index.sql` | One active review per user per place |
| `2026-07-11-add-role-scope-to-audit-log.sql` | role_scope column |
| `2026-07-11-consumer-review-update-delete.sql` | Consumer review CRUD |
| `2026-07-11-drop-role-scope-check.sql` | Dropped CHECK (needs re-add) |
| `2026-07-11-reference-menu-items.sql` | menu_items.owner_id + place_menu_items |
| `2026-07-12-backup-lifecycle.sql` | Backup profile lifecycle columns |

---

*Guide version 1.0 — Generated 2026-07-12. References AUDIT-PLAN.md v1.0 and backup-recovery-guide.md v2.0.*
