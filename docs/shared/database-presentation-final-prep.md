# PathEats Database Presentation: Final Preparation Guide

## Purpose

Use this guide for the 15 July 2026 database presentation. The presentation has two parts:

- 10 minutes: explain the database design and demonstrate the most important evidence.
- 5 minutes: answer questions about the implementation.

Only present database-related work. The target outcome is that the teacher can see that PathEats has a structured relational model, backend-enforced access control, practical performance decisions, and a safe recovery path.

## Main Message

Say this near the beginning and repeat the idea in the conclusion:

> PathEats stores vendor-owned places and menu data in PostgreSQL/PostGIS, protects changes with role and ownership checks, keeps common queries efficient with filtering and indexes, and provides validated backup and recovery for database data.

## 10-Minute Run Sheet

| Slide | Time | Main point | What to show |
|---|---:|---|---|
| 1. Title and focus | 0:25 | This is a database-focused defense. | Project name and the four required topics. |
| 2. Architecture and source of truth | 0:55 | The backend is the control point; PostgreSQL/PostGIS is the source of truth. | Four clients -> Express API -> PostgreSQL/PostGIS; note that Storage holds image objects separately. |
| 3. ERD and relational model | 2:30 | Ownership and the junction table make the business model consistent. | Focused eight-table ERD/RM only. |
| 4. Roles and access control | 1:25 | A hidden button is not security; backend authorization is. | Role matrix and one owner-scoped example. |
| 5. Query optimization | 1:15 | The system reduces query cost before joins and pages results. | Three query patterns and their indexes/filters. |
| 6. Backup and recovery | 2:10 | Recovery validates artifacts and restores without dropping the connected database. | Backup types, restore checks, schedule lifecycle, limitation. |
| 7. Conclusion and short demo | 1:00 | The design is organized, role-aware, performance-conscious, and recoverable. | Four takeaway points and one backup/recovery or ownership demo. |

Keep a 20-30 second buffer. Do not read SQL line-by-line, explain every column, or present general frontend features.

## Slide-by-Slide Content and Speaker Guidance

### Slide 1: PathEats Database Design

Put on the slide:

- `PathEats Database Design`
- A small subtitle: `Role-aware geospatial place and menu management`
- Four focus words: `Model`, `Access`, `Performance`, `Recovery`

Say:

> We will focus only on the database: how the data is structured, who can change it, how important queries stay efficient, and how we recover safely after data loss.

Do not explain every application feature here.

### Slide 2: One Source of Truth

Put on the slide:

- Consumer, Vendor, Business Assistant, and Global Admin clients
- Express API with JWT authentication, authorization, validation, and business rules
- PostgreSQL + PostGIS as the persistent source of truth
- Supabase Storage as separate storage for image files

Say:

> Client interfaces send requests to the Express API. The API authenticates the user, checks the role and ownership, validates the request, then changes PostgreSQL/PostGIS. This is important because frontend visibility alone cannot authorize a database change.

Highlight:

- PostGIS supports geospatial place data and nearby-place queries.
- Image metadata belongs in database tables, but actual Storage objects are separate from a PostgreSQL dump.

### Slide 3: ERD and Relational Model

Show only these eight core tables:

- `ROLE`
- `USERS`
- `PLACE_CATEGORIES`
- `PLACES`
- `PLACE_HOURS`
- `MENU_ITEMS`
- `PLACE_MENU_ITEMS`
- `REVIEWS`

Highlight these relationships, in this order:

1. `users.role_id -> role.id`: privileges come from role records.
2. `places.owner_id -> users.id`: a place is owned by one vendor user.
3. `menu_items.owner_id -> users.id`: menu items are owner-scoped too.
4. `place_menu_items(place_id, menu_item_id)`: this is the junction table between places and menu items.
5. `reviews.user_id` and `reviews.place_id`: a review connects a consumer to a place.

Best explanation of the junction table:

> We do not duplicate a menu item each time it is used in another place. `PLACE_MENU_ITEMS` stores the relationship and place-specific fields such as price and availability. Its composite primary key prevents the same menu item from being linked to the same place twice.

Mention two integrity decisions:

- Foreign keys prevent references to missing users, places, categories, or menu items.
- Review removal is tracked by `deleted_at`, preserving history rather than destroying it immediately.

Do not show platform-managed `auth.*`, `storage.*`, PostgreSQL system tables, or every internal operational table in the main ERD. Keep `audit_log`, `backup_profiles`, `scheduled_backups`, and `recovery_operations` as an appendix answer if asked.

### Slide 4: Privileges and Access Control

Use a compact role matrix:

| Role | Database-relevant responsibility |
|---|---|
| Consumer | Reads public places/menu data; writes only their own allowed actions such as reviews/bookmarks. |
| Vendor | Creates and updates only owned places and owned menu items. |
| Business Assistant | Uses only explicitly implemented business-assistant operations; does not automatically receive Global Admin power. |
| Global Admin | Performs privileged administration and sensitive operations, with audit logging where applicable. |

Say:

> Authorization is enforced on the backend. For a vendor update, the server verifies the JWT identity, verifies the role, and checks that `places.owner_id` or `menu_items.owner_id` equals the authenticated user. This prevents insecure direct object reference attacks.

Strong evidence to mention:

- JWT establishes identity.
- The backend reloads role privileges instead of trusting only the frontend user object.
- Backup and recovery routes require both a privileged role (`GLOBAL_ADMIN` or `DEVELOPER_ADMIN`) and a capability such as `BACKUP` or `RECOVERY`.

Avoid saying Business Assistant has full admin rights unless the current assignment model and route policy prove it.

### Slide 5: Query Optimization

Choose only three query patterns:

1. Place discovery: filter by category/location before broader joins; use PostGIS for distance-related work.
2. Vendor management: always filter by `owner_id` before loading or updating places/menu items.
3. Place menus: join `places`, `place_menu_items`, and `menu_items` only for the requested page.

Say:

> We optimize the common paths rather than every possible query. We filter early, use indexes on ownership and foreign-key access paths, apply pagination to list endpoints, and use parameterized queries so query safety and performance work together.

Be ready to point to actual index or query evidence in the project if asked. Do not invent response-time numbers.

### Slide 6: Backup and Recovery

Use this sequence:

`Profile -> Artifact -> Validation -> Safety Backup -> Restore -> History`

Put these backup types on the slide:

- Full database: PostgreSQL custom `.dump` file using `pg_dump`.
- Selected tables: PostgreSQL custom `.dump` file using `pg_dump`.
- Selected rows: `.csv` export with validated table and `WHERE` filter.

Say:

> The recovery process validates the uploaded format before modifying data. PostgreSQL dumps are inspected through their table of contents and restored with `pg_restore`; CSV recovery validates headers against the target table and performs transactional insert/upsert behavior. Before dump recovery, the system creates a safety dump.

Important recovery statement:

> We restore into the existing database. We do not drop the connected database, because that would destroy the connection target needed by the recovery command.

Scheduler points:

- Profiles can be active, paused, running, failed, or manual.
- The scheduler checks due profiles every 60 seconds.
- `FOR UPDATE SKIP LOCKED` claims due work so concurrent scheduler workers do not run the same profile twice.
- A scheduled artifact is stored and recorded in `scheduled_backups`.

State the limitation honestly:

> PostgreSQL backups include database data and image metadata, but not the actual Supabase Storage objects. Storage requires a separate backup strategy.

### Slide 7: Conclusion and Demo Summary

Put only four short takeaways:

- Structured relational model
- Backend-enforced role boundaries
- Efficient, parameterized query patterns
- Validated, recoverable backups

Say:

> Our design keeps business data connected through keys and constraints, protects writes through roles and ownership, optimizes the main data paths, and provides a controlled recovery process. The result is organized, role-aware, performance-conscious, and recoverable.

For the short demonstration, choose one safe flow only:

- Vendor attempts to manage only an owned place/menu item, or
- Developer/Admin creates a backup profile, pauses/resumes it, and shows recovery history.

Do not run a destructive restore live unless a disposable environment is ready.

## What to Prepare Before Presenting

- Open the focused ERD/RM in a readable view before the presentation starts.
- Have one screenshot or a working page ready for the backup profile list, schedule status, and recovery history.
- Have the developer route/service files searchable in case the teacher asks for implementation proof.
- Know one example place, menu item, and owner relationship for the demo.
- Ensure all presenters can explain the first three slides, not only their assigned slide.
- Keep the full internal/operational ERD available as an appendix, not in the main 10-minute story.

## Suggested Three-Person Split

| Presenter | Time | Responsibility |
|---|---:|---|
| Presenter 1 | 3:50 | Slides 1-3: architecture, ERD/RM, keys, ownership, junction table. |
| Presenter 2 | 2:40 | Slides 4-5: role boundaries, IDOR protection, query patterns, indexing. |
| Presenter 3 | 3:30 | Slides 6-7: backup/recovery, scheduler, limitation, conclusion/demo. |

Use the same words for the core concepts. For example, everyone should say `owner-scoped`, `junction table`, `backend authorization`, and `validated recovery` consistently.

## Five-Minute Teacher Questions: Rehearsal Answers

### ERD and relational model

**Why is `PLACE_MENU_ITEMS` needed instead of storing menu items directly in `PLACES`?**

It resolves the many-to-many relationship. A menu item can be reused by the same owner across places without copying its main record. The junction table stores the relationship plus place-specific price and availability, and its composite primary key prevents duplicates.

**Why do you not show every table in the ERD?**

The main ERD is intentionally the core business model: users, roles, places, categories, hours, menu items, place-menu links, and reviews. Backup, audit, session, and platform-managed tables are real but operational; including them would hide the main business relationships in a 10-minute presentation.

**How do you prevent invalid or orphaned data?**

Primary keys identify rows and foreign keys enforce valid references. For example, a place cannot point to a non-existing owner or category. The backend also validates ownership before linking a menu item to a place.

**Why is rating stored in `PLACES` if reviews already exist?**

`rating_avg` and `rating_count` are denormalized summary values for faster listing. They are refreshed by trigger/function logic, rather than manually edited by users.

### Privileges and access control

**Is hiding a menu item in the frontend enough to protect data?**

No. The backend authenticates the JWT, checks role/capability, validates fields, and checks ownership before any protected operation. Frontend visibility is only usability; it is not authorization.

**How do you prevent a vendor from editing another vendor's place?**

The route uses the authenticated user identity and verifies that the resource owner is the same user, such as `places.owner_id = authenticated_user.id`. The client cannot choose an arbitrary owner ID.

**Why use refresh tokens?**

Access tokens can be short-lived. Refresh tokens allow a new access token without requiring repeated login. The application stores refresh-token hashes rather than raw tokens.

**What happens if a role changes while the user is logged in?**

The backend reloads current privileges for authorization. The frontend display may require refresh or re-login to reflect the changed menu visibility, but it does not bypass the backend check.

### Query optimization

**What did you optimize?**

The highest-value paths: nearby/category place discovery, owner-scoped vendor management, and place-menu retrieval. The approach is filtering early, indexing ownership/foreign-key paths, using PostGIS where location is involved, paginating lists, and avoiding unnecessary joins.

**Which indexes would you justify first?**

Indexes supporting `places.owner_id`, `menu_items.owner_id`, foreign-key joins, and spatial location access are the strongest first choices because they support the frequent ownership and discovery paths. Show the actual migration/index definitions if the teacher requests exact SQL.

**Why parameterized queries if you already validate input?**

Validation checks business rules; parameterization prevents values from being interpreted as SQL. Both are needed.

### Backup and recovery

**Why are whole/table backups `.dump` files but row backups `.csv` files?**

Whole and table backups use PostgreSQL custom dumps because `pg_dump`/`pg_restore` preserve PostgreSQL structure and data efficiently. A selected-row export is CSV because it is simple to inspect and selectively restore into one validated table.

**How do you stop the old recovery failure where the database was dropped before restore?**

Recovery targets the existing database. The system does not drop the connected database. It inspects the dump, creates a pre-restore safety dump, filters unsafe objects, and runs `pg_restore` with controlled options such as `--clean`, `--if-exists`, `--exit-on-error`, and `--single-transaction`.

**Can a CSV be sent to `pg_restore`?**

No. CSV and PostgreSQL custom dumps are different formats. The recovery flow validates the type first: dump signature/TOC for a dump, CSV parsing and column validation for a row recovery.

**How do you stop scheduled backups from running twice?**

The scheduler claims due profiles with a database transaction using `FOR UPDATE SKIP LOCKED`, marks a profile as running, and processes a limited batch. This prevents concurrent workers from claiming the same due backup.

**Does database backup restore uploaded images too?**

It restores image metadata stored in PostgreSQL, but it does not automatically restore actual Supabase Storage objects. Storage requires a separate backup process.

**Can the system prevent a user from choosing the wrong but compatible table for CSV recovery?**

It blocks missing tables and unsupported columns, and it uses transactions. It cannot fully infer human business intent when a chosen table is technically compatible, so the operator must verify scope before recovery.

## Questions You Should Answer Carefully

- Do not claim storage files are included in a database dump.
- Do not claim the main ERD includes every live table.
- Do not claim Business Assistant has Global Admin permissions by default.
- Do not claim a measured query speedup unless you have benchmark evidence.
- Do not claim logical mistakes in a valid row filter are automatically detected.
- Do not describe a CSV backup as a PostgreSQL dump.

## Implementation Evidence to Keep Open

- `backend/src/services/backupService.js`: full/table dump and row-level CSV creation.
- `backend/src/services/backupRecoveryService.js`: dump/CSV restore validation and transaction behavior.
- `backend/src/services/backupScheduler.js`: due-profile claims and scheduler lifecycle.
- `backend/src/routes/devRoutes.js`: role and capability gates for backup/recovery.
- `backend/src/middlewares/authMiddleware.js`: JWT authentication.
- `backend/src/db/migrations/` and `backend/src/db/seed.sql`: keys, constraints, roles, and indexes.

## Source Notes

This guide is grounded in:

- `GEN 11 - Cross Disciplinary Project - HANDBOOK.pdf`, Database Administration requirements.
- `docs/shared/database-design-and-erd-guide.md`.
- `docs/shared/authentication-authorization-password-guide.md`.
- `docs/shared/backup-recovery-guide.md`.
- `docs/shared/database-presentation-qa-guide.md`.
