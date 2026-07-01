# PathEats Development Plan

## Summary

Develop PathEats through small, reviewable phases. Each phase must prioritize database correctness, security, performance, maintainable code, and clear UX. After every phase, perform a direct self-evaluation before moving to the next phase.

Vendor onboarding/help communication must use Telegram. Do not design new internal message, report, chat, or support-thread tables unless a future requirement explicitly changes this.

When implementation starts, write this plan to root as `DEVELOPMENT_PLAN.md`.

## Global Development Rules

- Keep code easy for humans to read, debug, and modify later.
- Keep implementation style straightforward enough that another developer can safely maintain or modify it later.
- Prefer clear names, small functions, simple data flow, and existing project patterns.
- Avoid clever abstractions unless they remove real duplication or complexity.
- Search the existing code before adding new helpers, APIs, schemas, or UI patterns.
- Use local `open-design/` only as inspiration for design systems, layout hierarchy, interaction patterns, and polish.
- Do not copy large unrelated code or introduce Open Design architecture into PathEats.
- Use browsing only when needed for current framework/package APIs, official docs, or design inspiration not available locally.
- Use browsing selectively when local code is insufficient to confirm framework/package behavior or when external design references are necessary.
- Performance is priority one; maintainable clean code is priority two.
- Every phase must include security, error handling, database-fit, and test/build checks.
- Work in small PRs; each PR should solve one focused issue.

## Phase Progression and Self-Evaluation

- At the end of every phase, run a no-bias self-evaluation against that phase's goals, rules, and test expectations.
- Self-evaluation must explicitly state what is complete, what is incomplete, what risk remains, and whether the next phase is justified.
- Continue to the next phase automatically after self-evaluation when the phase is sufficiently complete and no blocking decision is required.
- Do not continue automatically if the next work requires destructive operations, external credentials, live database recovery, or a product decision that cannot be inferred safely.
- Keep each implementation slice readable and reviewable even when continuing automatically across phases.

## Phase 0 - Baseline Verification

Goal: verify what is already complete before implementing.

Actions:
- Inspect schema, migrations, seed files, Supabase assumptions, auth flow, route protection, user/vendor/admin features, uploads, backup/recovery, and current worktree changes.
- Compare actual implementation against `plan-instruction.md`, `addtional-check.md`, and current app behavior.
- Identify broken, duplicated, static, unused, or disconnected features.

Rules:
- Do not assume Phase 1 or Phase 2 is complete.
- Prefer current app behavior as baseline when docs conflict with implementation.
- No feature implementation during this phase.

Self-assessment:
- Can each feature be mapped to code, API, database table, and role access?
- Are there orphan records, unused tables, fake UI sections, or missing security checks?
- Is the first implementation PR small and obvious?

## Phase 1 - Database and Supabase Fit

Goal: make the data model reliable before more feature work.

Actions:
- Verify users, roles, vendors, places/stalls, menu items, images, routes, saved routes, reviews, search history, admin activity, backup/recovery, and onboarding config.
- Ensure every store/stall ownership rule is deliberate and enforced.
- Align image handling with Supabase Storage metadata tables.
- Clarify or remove ambiguous image URL fields such as `photo_url` and `image_url` where they conflict with uploaded-file storage.

Rules:
- Database stores image metadata only; files belong in Supabase Storage.
- Avoid orphan records and duplicate table responsibilities.
- Do not add internal messaging/reporting tables for onboarding; use Telegram.
- Migrations must be runnable through a clear process.

Self-assessment:
- Do schema relationships still fit the app?
- Are foreign keys and ownership rules logical?
- Are Supabase Auth, app users, roles, and RLS assumptions aligned?
- Are upload paths, bucket names, and metadata handled correctly?

## Phase 2 - Authentication and Authorization

Goal: make access control consistent across backend and frontend.

Actions:
- Review login, registration, session refresh, logout, middleware, frontend guards, and redirects.
- Restrict public registration to allowed public roles only.
- Enforce role boundaries server-side and mirror them in UI routing.
- Remove or tightly gate development auth bypass behavior.

Rules:
- Backend authorization is the source of truth.
- Guests only access public features.
- Developer cannot create consumer accounts except through controlled, logged repair workflows.
- Business Assistant access must stay vendor/business-support focused.
- Multiple accounts per role must remain supported.

Self-assessment:
- Can each role access only its allowed APIs and pages?
- Are unauthorized attempts blocked server-side?
- Are auth failures clear and safe for users?
- Do frontend guards match backend permissions?

## Phase 3 - User App Completion

Goal: make the consumer experience reliable and database-connected.

Actions:
- Improve route customization, current location, source/destination validation, route validation, map markers, vendor details, menus, saved routes, history, reviews, and comments if required.
- Ensure guest vs registered-user permissions are clear.
- Use real database-connected vendor/store/menu data.

Rules:
- Avoid fake production-facing data.
- Avoid loading huge datasets; use scoped queries or pagination.
- Keep map interactions performant and readable.

Self-assessment:
- Can users search routes, inspect vendors, view menus, save routes/history, and review places without broken states?
- Are failed routes, invalid inputs, and missing data handled gracefully?
- Is the UI responsive and understandable?

## Phase 4 - Vendor App and Telegram Onboarding

Goal: make vendor workflows usable and synchronized with user-facing data.

Actions:
- Improve vendor layout, navigation, responsiveness, dashboard clarity, full-screen map rendering, and pinpoint selection.
- Ensure vendor-entered store/menu data appears correctly in the user app.
- Use Telegram link/message config for onboarding support.

Rules:
- Remove the analytics chart from the vendor dashboard.
- Apply map fixes consistently to Vendor and Admin where relevant.
- Telegram is the onboarding/support channel.
- Do not add message/report/support-thread tables.

Self-assessment:
- Can vendors manage stall details, location, images, and menu data end to end?
- Does user-facing data update after vendor changes?
- Is onboarding clear through Telegram without internal messaging scope creep?

## Phase 5 - Global Admin Redesign

Goal: make admin pages operational, not static or confusing.

Actions:
- Review every admin page for purpose, role access, records managed, actions, and database dependency.
- Simplify overloaded pages, merge duplicates, remove unclear sections, and add useful actions.
- Use `open-design/` and browsing only when useful for layout hierarchy, density, accessibility, and polished interaction patterns.

Rules:
- One admin app first, with role-based page/action visibility.
- Each page or tab must have one clear goal.
- Admin UI must connect to real backend/database logic.
- Design changes must stay consistent with PathEats branding and existing frontend style.

Self-assessment:
- Does each admin page clearly answer what it manages and what action can be taken?
- Are Global Admin, Developer, and Business Assistant boundaries clear?
- Are tables searchable, scoped, and performant?
- Is the design easier to scan and maintain?

## Phase 6 - Developer Backup and Recovery

Goal: make operational tools safe before treating them as complete.

Actions:
- Review or implement manual backup, scheduled backup, recovery, retention, status, logs, and validation.
- Use PostgreSQL custom-format dumps (`pg_dump --format=custom`) for database backup downloads.
- Keep backup files on the user's local machine after browser download; do not store generated dump files permanently on the server.
- Recover from local files selected by the user through the browser upload flow.
- Add confirmation and validation before recovery.
- Prevent incompatible, corrupt, or wrong backup files from being restored.

Rules:
- Backup/recovery is high risk.
- Backup/recovery endpoints must be Developer Admin-only.
- PostgreSQL dump recovery must require the exact confirmation text `RESTORE POSTGRES DUMP`.
- PostgreSQL dump files must be inspected with PostgreSQL tooling before restore.
- Restore should run in a constrained, fail-safe mode and must not run arbitrary uploaded SQL.
- Recovery requires explicit confirmation.
- Failed backup/recovery must fail safely with clear errors.
- Prevent accidental full database loss.
- Do not use app-specific local JSON as the main database backup/recovery format.

Self-assessment:
- Can backup and recovery fail safely?
- Are files validated before use?
- Are recovery actions logged and visible to proper roles?
- Is human judgment required at the right point?
- Does the implementation avoid arbitrary SQL execution and accidental destructive full-database restore?

## Phase 7 - Cross-System Polish and Release

Goal: make the system consistent, fast, and reviewable.

Actions:
- Align spacing, typography, icons, headers, sidebars, forms, tables, error states, and responsive behavior.
- Run cleanup after functionality works.
- Split release work into focused PRs.

Rules:
- Use Open Design references for inspiration only.
- Do not introduce unnecessary packages or global state.
- If using a framework/package API, inspect local source or official docs first.
- Run available checks before each PR.

Self-assessment:
- What changed?
- What was tested?
- What files, APIs, database objects, and UI areas changed?
- What risks remain?
- What still needs human judgment?
- What is the recommended next phase?

## Test Plan

- Backend: syntax checks, auth route checks, role access checks, repository/service smoke tests where possible.
- Frontend: build check when safe, route guard checks, user/vendor/admin smoke tests.
- Database: schema fit, FK behavior, ownership checks, migration/seed verification.
- Storage: file type, file size, failed upload, metadata correctness, missing file behavior.
- Security: invalid input, missing auth, wrong role, expired session, failed refresh, unsafe recovery attempt.
- UI: desktop/mobile layout, table density, form errors, map behavior, onboarding clarity.
- PR review: small scope, readable code, no unrelated artifacts, no accidental docs/assets unless intended.

## Current Assumptions

- `DEVELOPMENT_PLAN.md` exists at the project root and is the active implementation plan.
- Phase 1 and Phase 2 are not complete yet; they are partially implemented and need focused fixes.
- `open-design/` is available as a local reference source for design improvement.
- Browsing is optional and should be used only when local code/docs are insufficient.
- Implementation should continue automatically after each phase only after unbiased self-evaluation confirms it is appropriate.
