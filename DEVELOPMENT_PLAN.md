# PathEats Finalization, Role Management, and Data Integrity Plan

## Summary

PathEats will retain useful behavior from `origin/database` while keeping the current branch simpler, safer, and easier to maintain. Restore behavior rather than copying old files wholesale. Application roles are enforced by PathEats; PostgreSQL login-role impersonation is out of scope.

## Phase 1 - Branch-Parity Baseline

- Use `origin/database` for comparison because the local `database` branch currently points to the same commit as `bug-less`.
- Compare role/user management, stalls, menus, authentication, backup/recovery, and admin profile behavior.
- Keep current improvements including token revocation, deletion-impact warnings, normalized place statuses, MapLibre lifecycle handling, and local PostgreSQL dump backups.
- Do not restore generated assets, committed backup artifacts, obsolete documentation, logical JSON recovery, unused UI primitives, or the unwired old Admin Profile page.

## Phase 2 - Clean Application Role Model

- Extend `role` with `is_system` and `updated_at`. `base_scope` remains an internal routing field and is never selected in the custom-role form.
- Add `users.role_id` as a foreign key and backfill it from the five built-in roles.
- Keep `users.role_scope` limited to `CONSUMER`, `VENDOR`, `GLOBAL_ADMIN`, `DEVELOPER_ADMIN`, and `BUSINESS_ASSISTANCE` so existing routing and ownership rules remain correct.
- Custom roles expose only a name, a per-table privilege matrix, and one role-wide Grant Option. They use a hidden `GLOBAL_ADMIN` application scope so current portal routing remains valid while privileges limit what each role can do.
- Keep `users.role_scope` as the fixed internal portal type used by routing and ownership rules; administrators do not choose it separately when assigning a role.
- Built-in roles cannot be renamed or deleted. Global Admin keeps minimum anti-lockout privileges.
- User role assignment writes `role_id` and derives `role_scope` from the selected role in one transaction.

## Phase 3 - Privilege Registry and Enforcement

- Define one small registry of manageable application tables and CRUD actions.
- Keep `BACKUP`, `RECOVERY`, `QUERY`, and `MAINTENANCE` as separate system capabilities.
- Exclude refresh tokens, OTPs, sessions, PostGIS internals, and other sensitive implementation tables from custom role editing.
- Add `requirePrivileges` middleware and retain base-role, ownership, field-level, and IDOR checks.
- Load current role data in `authMiddleware` on every request; do not store the full matrix in JWTs.
- Return safe `403 ROLE_PRIVILEGE_REQUIRED` errors.
- Global Admin can manage roles. A grantable custom administrator may delegate only a subset of its own privileges and cannot modify system roles.

## Phase 4 - Admin Role and User Management

- Restore a clean custom-role editor with role name, searchable tables, per-table CRUD checkboxes, Select All/Clear, and one Grant Option toggle.
- Do not restore the old hard-coded database selector or invalid per-table `CREATE`, `ALTER`, and `DROP` choices.
- Create and edit users using `roleId`, not an arbitrary role string.
- Assign users by role only; the selected role supplies the hidden portal scope. Filter by role ID and refresh role counts and filters after changes.
- Block unknown roles, role deletion while assigned, and unsafe vendor-to-non-vendor reassignment when stalls remain owned.

## Phase 5 - Stall Editing Alignment

- Make admin inline edit mode reachable and remove the duplicate management edit workflow.
- Bind map clicks, marker drag, and latitude/longitude fields to edit state.
- Keep view-mode markers non-draggable.
- Show visible dirty, saving, success, and server-error states and use the server response after saving.
- Apply the same page to Global Admin and Business Assistant and validate coordinate order/ranges server-side.

## Phase 6 - Shared Menu Catalog and Stall Links

- Keep `menu_items` as the vendor catalog and `place_menu_items` as the association.
- Store stall-specific price and availability on `place_menu_items`; catalog price becomes `default_price`.
- Enforce one normalized menu identity per vendor.
- Add Existing inserts only a link. Create New creates one catalog record and one link transactionally.
- Return `409 MENU_ITEM_DUPLICATE` for duplicate catalog identities.
- Unlinking affects one stall; catalog deletion warns about and removes all links.
- Shared fields affect every linked stall, while link price and availability affect only the selected stall.
- Consolidate existing duplicates without losing effective per-stall prices, links, or images.

## Phase 7 - Simplified Backup and Strict Recovery

- Keep PostgreSQL custom dumps for full/selected-table backup and CSV only for explicit row repair.
- Files remain on the user's local machine; no logical JSON format or database selector.
- Generate and download the first backup immediately when a profile is created.
- Run full recovery in a single PostgreSQL transaction without requiring session-termination privileges; a failed restore must commit no changes.
- For Supabase/PostGIS, remove only the `SCHEMA public` restore-list entry before `pg_restore --clean`; preserve the managed schema while restoring its application objects.
- The PostgreSQL report's `pg_dumpall`/`psql` plain-SQL workflow is treated as a local PostgreSQL reference. PathEats remains a single Supabase database, so custom-format `pg_dump`/`pg_restore` is the safer matching format.
- Restore strict TOC inspection, dangerous-object rejection, real full/partial detection, file/signature/table/column validation, typed confirmation, a pre-restore safety dump, single-flight recovery, and safe audit logging.
- Never expose credentials or local server paths to the client.

## Phase 8 - Cleanup and Maintainability

- Remove `forkItem`, copy-based menu paths, dead assignment/onboarding tracking code, and unused `approval_status` work.
- Keep Telegram configuration as onboarding support.
- Repair the pending audit migration and replace runtime role-table mutation with explicit migrations.
- Keep routes thin, services responsible for validation/transactions, and repositories responsible for SQL.
- Add no global-state framework, validation framework, PostgreSQL role impersonation system, or duplicate authorization table.

## Test and Acceptance Plan

- Verify custom role creation, editing, user assignment, filters, counts, privilege enforcement, navigation visibility, ownership boundaries, immediate role updates, delegation limits, and protected built-in roles.
- Verify Vendor, Global Admin, and Business Assistant map edits persist.
- Verify existing menu items link without increasing catalog count, prices remain stall-specific, unlink is local, catalog deletion reports impact, and consumer views update.
- Verify full/table dumps and CSV repair, rejection of unsafe/corrupt files, typed confirmation, and safety backup.
- Run migration validation, backend syntax/lint/tests, frontend lint/tests/build, and browser smoke tests for every built-in role plus a custom-role user.
- Report pre-existing failures separately and do not mark a changed workflow complete while it remains unverified.
