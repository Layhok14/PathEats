# Memory

## Project Overview
See @README.md for project overview and @package.json for available npm/pnpm commands for this project.

## Code Style Guidelines
- Use descriptive variable names
- Follow existing patterns in the codebase
- Extract complex conditions into meaningful boolean variables

## Architecture Notes
Add important architectural decisions and patterns here.

## Common Workflows
Document frequently used workflows and commands here.
# AGENTS.md

## Project Context

This project is a multi-role geospatial place and menu management application built with:

* Supabase PostgreSQL
* PostGIS
* Supabase Storage
* React and TypeScript frontend
* Express and JavaScript backend
* JWT and refresh-token authentication

Primary application roles may include:

* Consumer
* Vendor
* Global Admin
* Business Assistant

Agents must inspect the current implementation before assuming that a role, feature, state, API, table, or workflow exists.

The current database schema is the source of truth for persisted data. Frontend interfaces, mock data, TypeScript types, and documentation must not introduce unsupported fields without an explicit migration.

---

# 1. Core Working Rules

Before changing code:

1. Inspect the relevant frontend page, component, hook, service, backend route, controller, middleware, database query, and schema.
2. Trace the complete request lifecycle.
3. Identify the actual source of truth.
4. Determine whether the requested behavior already exists partially.
5. Reuse existing abstractions where they are correct.
6. Avoid large rewrites unless the current architecture prevents a safe fix.
7. Preserve working behavior unrelated to the task.
8. Do not invent database fields or API properties.
9. Do not silently change role permissions.
10. Do not modify generated files, lockfiles, migrations, or configuration unless required.

Every change must be justified by a verified issue.

---

# 2. Database Source of Truth

Important tables include:

```text
users
places
place_categories
place_hours
place_images
menu_items
menu_item_images
place_menu_items
onboarding_config
backup_profiles
scheduled_backups
recovery_operations
audit_log
reviews
bookmarks
routes
role
refresh_tokens
session_events
```

Important ownership relationships:

```text
places.owner_id → users.id
menu_items.owner_id → users.id
place_menu_items.place_id → places.id
place_menu_items.menu_item_id → menu_items.id
```

Agents must preserve these relationships.

A vendor-managed store is represented by `places`.

Do not create a separate `stores` table or a duplicated store model unless the task explicitly requires a reviewed migration.

---

# 3. Place and Menu Ownership

Vendor operations must be ownership-scoped.

For vendor requests:

```text
places.owner_id = authenticated_user.id
menu_items.owner_id = authenticated_user.id
```

Never trust `owner_id` from the client without validating it.

Before linking a menu item to a place, verify:

```text
places.owner_id = menu_items.owner_id
```

unless an explicitly authorized Global Admin workflow permits otherwise.

The composite primary key on:

```text
place_menu_items(place_id, menu_item_id)
```

must be respected.

Do not duplicate a `menu_items` row when adding an existing menu item to another place. Insert only into `place_menu_items`.

---

# 4. Role Authorization

Frontend visibility is not authorization.

Every protected operation must be enforced in backend middleware, service logic, or database policy.

Agents must verify the actual `role_scope` values used in the application.

Do not assume that the separate `role` table controls application authorization. Inspect its usage first.

Expected permission principles:

## Consumer

* Read public place and menu data
* Cannot use administrative or vendor write operations
* Cannot read internal onboarding, audit, or credential data

## Vendor

* Manage only owned places
* Manage only owned menu items
* Link only authorized menu items to owned places
* Cannot modify administrative fields
* Cannot ban users
* Cannot change ownership
* Cannot edit ratings directly

## Global Admin

* Manage all users, places, and menu items as defined by project requirements
* Perform restricted administrative actions
* View operation impact before destructive actions
* Actions should be audited

## Business Assistant

* Access must follow the actual implemented permission model
* Do not grant Global Admin permissions by default
* Assignment-based access must not be assumed unless schema and backend support it

For every route, verify:

* Authentication
* Role authorization
* Resource ownership
* Field-level authorization
* IDOR protection

---

# 5. Schema Gaps That Must Not Be Hidden

The current schema does not clearly provide:

* Per-vendor onboarding progress
* Business Assistant assignments
* Place approval state
* Place suspension state
* Place rejection state
* Soft deletion for places
* Soft deletion for menu items
* Store-specific menu price
* Global menu item availability
* One-primary-image database constraint
* One-place-hour-row-per-day constraint

Do not simulate these as fully implemented features using only frontend state.

When a task depends on one of these features:

1. Identify the gap.
2. Explain the required persistence model.
3. Propose a migration.
4. Describe migration impact.
5. Do not apply the migration unless the task authorizes it.

---

# 6. Place State Rules

The current `places` table contains:

```text
is_open boolean
status active|closed
```

Do not assume additional statuses exist.

Inspect how `is_open` and `status` are currently interpreted before changing logic.

Prevent contradictory behavior such as:

```text
status = closed
is_open = true
```

Consumer visibility must use a centralized rule rather than separate inconsistent filters across pages.

Vendor bans use:

```text
users.is_banned
```

Inspect whether banning a vendor should:

* Block authentication
* Block mutation
* Hide owned places
* Disable menu items
* Affect only administrative access

Apply one consistent policy across backend and consumer queries.

---

# 7. Form and Validation Alignment

Equivalent Vendor, Global Admin, and Business Assistant forms should use consistent:

* Field names
* Labels
* Input types
* Required rules
* Validation messages
* Category options
* Location representation
* Image rules
* Hours rules
* Menu selection behavior
* Confirmation dialogs

Prefer shared components and validation schemas.

Possible shared components:

```text
PlaceForm
PlaceBasicInfoSection
PlaceLocationField
PlaceCategorySelect
PlaceHoursEditor
PlaceImageUploader
MenuItemForm
MenuItemSelector
MenuItemImageUploader
DeleteConfirmationDialog
```

Do not force identical layouts where role-specific controls differ.

Backend validation is mandatory even when frontend validation exists.

---

# 8. Location and PostGIS

The `places.location` field is required and uses a PostGIS spatial type.

Agents must verify:

* Input format
* Longitude/latitude order
* SRID
* Coordinate range
* Geometry versus geography
* GeoJSON conversion
* Distance-query compatibility

Never interchange:

```text
(latitude, longitude)
```

with:

```text
(longitude, latitude)
```

without checking the backend conversion.

Do not cast spatial values through unsafe string concatenation.

Use parameterized queries and PostGIS functions.

---

# 9. Images and Supabase Storage

Image metadata is stored in:

```text
place_images
menu_item_images
user_profile_images
```

Legacy or duplicate URL fields also exist:

```text
places.photo_url
menu_items.image_url
```

Agents must determine which source is currently authoritative before changing image logic.

Do not update only one source if different interfaces read different sources.

Storage operations must account for both:

1. Supabase Storage object
2. PostgreSQL metadata row

Required behavior:

* Validate MIME type
* Validate size
* Sanitize paths
* Restrict ownership
* Upload object
* Persist metadata
* Roll back or clean up on partial failure
* Remove replaced objects when appropriate
* Avoid orphaned metadata
* Avoid orphaned storage objects

A database backup does not automatically back up actual Supabase Storage objects.

---

# 10. Place Hours

The database supports:

```text
day_of_week = 0..6
opens_at
closes_at
is_closed
```

Agents must identify the established day mapping before changing it.

Validate:

* Duplicate day rows
* Invalid time order
* Closed-day behavior
* Overnight hours
* Missing days
* Multiple periods per day

Do not assume multiple periods per day are supported.

If the UI supports only one period per day, propose a unique constraint on:

```text
(place_id, day_of_week)
```

instead of relying only on frontend logic.

---

# 11. Backup and Recovery Rules

Backup-related tables:

```text
backup_profiles
scheduled_backups
recovery_operations
audit_log
```

Interpretation:

* `backup_profiles`: backup configuration and schedule state
* `scheduled_backups`: backup execution and artifact records
* `recovery_operations`: recovery history
* `audit_log`: actor and administrative event history

Do not assume that all UI options are implemented.

For backup or recovery tasks, inspect:

* Actual `pg_dump` command
* Actual `pg_restore` or `psql` command
* Artifact format
* File storage path
* Scheduler implementation
* File validation
* Authorization
* History logging
* Error handling
* Concurrency protection

CSV, JSON, SQL, and PostgreSQL dump files are different formats and must not be passed to the wrong recovery engine.

A CSV file must never be sent directly to `pg_restore`.

A PostgreSQL database dump does not automatically contain Supabase Storage objects.

---

# 12. Scheduled Backup State

The schedule configuration uses fields including:

```text
status
is_enabled
last_backup_at
next_backup_at
run_started_at
last_error
run_count
```

Agents must inspect the actual supported states before changing behavior.

Do not treat the following as equivalent without verification:

* Configured
* Enabled
* Disabled
* Paused
* Running
* Failed
* Completed

Editing or deleting a schedule must not silently delete historical backup artifacts unless the product explicitly requires it.

Manual backup execution should not change the next scheduled run unless this is an intentional business rule.

Prevent duplicate runs caused by:

* Multiple backend instances
* Multiple clicks
* Server restart
* Overdue schedules
* Manual and scheduled runs overlapping

Use a database-backed lock or atomic state transition where required.

---

# 13. Destructive Operations

Before destructive operations, inspect all dependent data.

## Deleting a place may affect:

```text
place_hours
place_images
place_menu_items
reviews
bookmarks
```

## Deleting a menu item may affect:

```text
menu_item_images
place_menu_items
```

## Deleting a backup profile may affect:

```text
scheduled_backups
backup files on disk
```

Do not assume cascading behavior.

Inspect foreign keys and application code.

Required interface behavior:

* Explain impact
* Show affected counts where practical
* Require explicit confirmation
* Prevent accidental repeated submission
* Handle foreign-key failure clearly
* Preserve historical data where required

Prefer soft deletion or deactivation where historical references matter.

---

# 14. Transactions

Use database transactions for multi-step operations.

Examples:

```text
Create place
Insert place hours
Insert place images metadata
Insert place-menu links
```

```text
Delete menu item links
Delete menu item images
Delete menu item
```

```text
Create backup execution
Run backup
Update profile state
Complete execution record
```

If one required step fails, the operation must not leave inconsistent partial state.

External storage operations cannot always participate in a PostgreSQL transaction. Implement compensating cleanup.

---

# 15. API and Error Handling

All API endpoints must:

* Validate request shape
* Validate identifiers
* Reject unsupported fields
* Use parameterized queries
* Return consistent status codes
* Return safe error messages
* Avoid leaking internal paths, SQL, secrets, or credentials
* Log detailed server-side errors safely
* Prevent duplicate submissions where relevant

Do not expose:

* Password hashes
* Refresh-token hashes
* Database credentials
* Raw stack traces
* Filesystem paths
* Supabase service-role keys
* Internal SQL commands

Use one consistent response structure where the project already defines one.

---

# 16. Audit Logging

Administrative and sensitive actions should use `audit_log` when audit logging is part of the current project scope.

Relevant actions include:

```text
PLACE_CREATE
PLACE_UPDATE
PLACE_DELETE
PLACE_CLOSE
PLACE_OWNER_CHANGE
MENU_ITEM_CREATE
MENU_ITEM_UPDATE
MENU_ITEM_DELETE
MENU_ITEM_LINK
MENU_ITEM_UNLINK
USER_BAN
USER_UNBAN
ONBOARDING_CONFIG_UPDATE
BACKUP_PROFILE_CREATE
BACKUP_PROFILE_UPDATE
BACKUP_PROFILE_DELETE
BACKUP_RUN
RECOVERY_RUN
```

Do not store secrets or large binary content in `details`.

Prefer:

```text
actor_id
role_scope
target_type
target_id
action
safe structured details
```

---

# 17. Cleanup and Refactoring Rules

When cleaning code:

1. Remove only confirmed dead code.
2. Search all imports and references before deletion.
3. Check dynamic imports, route registration, string-based references, cron jobs, environment variables, and build scripts.
4. Consolidate duplicated logic only when behavior is equivalent.
5. Do not combine different authorization paths merely because forms look similar.
6. Remove stale mock data.
7. Remove unsupported fields from forms and API payloads.
8. Remove unused dependencies only after verifying build and runtime usage.
9. Preserve public API compatibility unless migration is planned.
10. Avoid unrelated formatting changes that obscure the real diff.

A cleanup task is not permission to redesign the system.

---

# 18. Required Verification After Changes

Run the relevant available checks:

```text
lint
type-check
unit tests
integration tests
build
database migration validation
API tests
```

Also verify manually:

* Vendor ownership restrictions
* Admin access
* Business Assistant boundaries
* Consumer visibility
* Image upload and cleanup
* Place-menu linking
* Place hours
* Backup scheduling
* Recovery validation
* Error messages
* Loading states
* Cache invalidation

Do not report a task as complete when tests fail.

If a test cannot run, report:

* The exact command
* The failure reason
* Whether it is caused by the change
* What remains unverified

---

# 19. Expected Agent Output

For implementation tasks, provide:

1. Findings
2. Root cause
3. Files changed
4. Database impact
5. Security impact
6. Behavior before
7. Behavior after
8. Tests executed
9. Remaining risks
10. Follow-up work

For audit-only tasks, do not modify files.

Classify findings as:

```text
Critical
High
Medium
Low
```

Avoid vague claims such as “fixed synchronization” or “improved security.” State the exact condition that was corrected.
