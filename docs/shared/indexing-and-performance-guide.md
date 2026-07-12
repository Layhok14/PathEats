# Indexing and Performance Guide

## Purpose

This file explains the indexing decisions in the current system, why they improve performance, where the indexed queries appear in code, and where the current implementation still has gaps.

Use this for:

- the database performance section of the presentation
- team study on query optimization
- honest explanation of what is already optimized and what still can improve

## Source Of Truth

This guide is based on:

- `backend/src/db/indexes.sql`
- `backend/src/repositories/*.js`
- `backend/src/controllers/*.js`
- `backend/src/utils/placeHours.js`

## Slide-Safe Performance Message

Use this short explanation on slides:

- indexes reduce full table scans
- they speed up filtering, joins, ordering, and frequent lookups
- the project uses indexes for auth/session tables, geospatial place lookup, ownership joins, reviews, media metadata, audit logs, and backup scheduling
- some heavy text-search patterns still have room for future optimization

## What Indexing Does In This Project

In this codebase, indexes mainly support five performance patterns:

1. authentication and session lookup
2. geospatial place search
3. vendor ownership and menu linking
4. review and personal-history lookup
5. admin, audit, and backup operations

## Current Index Groups

## 1. Authentication and session lifecycle

Defined indexes:

- `idx_users_email`
- `idx_users_role`
- `idx_users_role_id`
- `idx_refresh_tokens_hash_unique`
- `idx_refresh_tokens_jti_unique`
- `idx_refresh_tokens_user`
- `idx_refresh_tokens_family`
- `idx_refresh_tokens_active`
- `idx_session_events_user_created`
- `idx_session_events_family`
- `idx_session_events_type_created`

Why they help:

- login and session refresh depend on fast token lookups
- family-based refresh-token revocation should not scan the whole token table
- session history screens and audits often sort by recent activity

Code paths:

- `backend/src/services/AuthService.js`
- `backend/src/repositories/UserRepository.js`
- `backend/src/repositories/TokenRepository.js`
- `backend/src/middlewares/authMiddleware.js`

Important honesty note:

- current login queries use `LOWER(email) = LOWER($1)` in `UserRepository`
- the current index is on `users(email)`, not on `LOWER(email)`
- this means the current email index may not be fully used for case-insensitive login lookup
- if the user table grows, a functional index on `LOWER(email)` would be a justified next improvement

## 2. Geospatial search and place filtering

Defined indexes:

- `idx_places_location` using `GIST(location)`
- `idx_places_category`
- `idx_places_owner`
- `idx_places_admin_managed`
- `idx_places_status`
- `idx_place_hours_place`
- `idx_place_hours_open_lookup`

Why they help:

- location search is one of the most expensive query types in the system
- category, owner, and status filters are used repeatedly in consumer, vendor, and admin flows
- open-now logic repeatedly checks `place_hours` by `place_id`, `day_of_week`, and `is_closed`

Code paths:

- `backend/src/repositories/PlaceRepository.js` -> `search`, `findAllApproved`, `findById`
- `backend/src/repositories/VendorRepository.js` -> `findNearbyStalls`, `findByOwner`
- `backend/src/utils/placeHours.js` -> `OPEN_NOW_SQL`

Important honesty note:

- geospatial filtering currently uses `ST_Distance(...) <= range`
- the GiST index on `location` is the correct direction for geospatial optimization
- however, `ST_DWithin(...)` is usually a better pattern for direct index-friendly radius checks
- this is a valid future optimization to mention if asked

## 3. Vendor menu and link-table performance

Defined indexes:

- `idx_menu_items_owner`
- `idx_menu_items_category`
- `idx_place_menu_items_item`
- `idx_place_menu_items_available`
- `idx_menu_items_owner_normalized_name`

Why they help:

- vendors frequently load their own menu catalog
- stalls frequently load linked items by place and availability
- ownership checks between `places` and `menu_items` happen often
- the normalized unique index on item name prevents duplicate catalog items per vendor

Code paths:

- `backend/src/repositories/VendorRepository.js`
  - `getAllMenuItems`
  - `getMenuItems`
  - `createMenuItemGlobal`
  - `createMenuItem`
  - `linkExistingMenuItem`
  - `updateMenuItem`
- `backend/src/repositories/PlaceRepository.js`
  - `getMenuItems`
  - `getMenuItemsForPlaces`

## 4. Reviews and consumer personal-data lookup

Defined indexes:

- `idx_reviews_place_created`
- `idx_reviews_user`
- `idx_reviews_deleted_at`
- `idx_reviews_moderated`
- `idx_reviews_unique_active`
- `idx_routes_user`
- `idx_bookmarks_user`
- `idx_bookmarks_place`
- `idx_search_history_user_created`

Why they help:

- place detail screens read reviews by place, ordered by newest first
- consumer features load bookmarks, routes, and search history by user
- soft-deleted reviews are filtered through `deleted_at`
- one active review per user per place is enforced by a partial unique index

Code paths:

- `backend/src/repositories/PlaceRepository.js` -> `getReviews`, `createReview`, `updateReview`, `deleteReview`
- `backend/src/controllers/userController.js`
- `backend/src/repositories/adminRepository.js` -> review and user overview queries

## 5. Media metadata lookup

Defined indexes:

- `idx_user_profile_images_user`
- `idx_user_profile_images_uploaded_by`
- `idx_user_profile_images_storage_object_unique`
- `idx_place_images_place`
- `idx_place_images_place_primary`
- `idx_place_images_uploaded_by`
- `idx_place_images_storage_object_unique`
- `idx_menu_item_images_menu_item`
- `idx_menu_item_images_menu_item_primary`
- `idx_menu_item_images_uploaded_by`
- `idx_menu_item_images_storage_object_unique`

Why they help:

- the UI often needs only the primary image for a place or menu item
- joins on image metadata should be fast even when the object store grows
- unique storage object indexes prevent duplicate metadata rows for the same object path

Code paths:

- `backend/src/repositories/PlaceRepository.js`
- `backend/src/repositories/VendorRepository.js`
- `backend/src/repositories/UserRepository.js`
- `backend/src/utils/storageImageMetadata.js`

## 6. Admin, audit, and backup tooling

Defined indexes:

- `idx_audit_log_created`
- `idx_audit_log_action`
- `idx_audit_log_admin`
- `idx_audit_log_actor`
- `idx_audit_log_role_scope`
- `idx_dal_event_type`
- `idx_dal_executed_at`
- `idx_dal_actor`
- `idx_backup_profiles_due`
- `idx_scheduled_backups_profile_created`

Why they help:

- admin screens load recent actions and filter by role scope
- developer screens inspect recent activity and query history
- backup scheduling must find due profiles quickly
- scheduled backup history is usually loaded by profile and newest-first order

Code paths:

- `backend/src/repositories/adminRepository.js` -> `getAuditLogs`, `getAuditLogsByRoleScope`, `getAuditActivity`
- `backend/src/routes/devRoutes.js`
- `backend/src/services/backupScheduler.js`

## Query Pattern To Index Mapping

| Query pattern | Code path | Indexes that support it | Why it matters |
|---|---|---|---|
| Refresh-token lookup and revocation | `TokenRepository` | `idx_refresh_tokens_hash_unique`, `idx_refresh_tokens_family`, `idx_refresh_tokens_active` | Fast auth and safe session lifecycle |
| Consumer nearby search | `PlaceRepository.search` | `idx_places_location`, `idx_places_status`, `idx_place_hours_open_lookup` | Avoid expensive full scans on place search |
| Vendor stall listing | `VendorRepository.findByOwner` | `idx_places_owner` | Owner-scoped dashboard operations |
| Menu link lookup | `PlaceRepository.getMenuItems`, `VendorRepository.getMenuItems` | `idx_place_menu_items_available`, `idx_place_menu_items_item`, `idx_menu_items_owner` | Fast stall-menu rendering |
| Review list by place | `PlaceRepository.getReviews` | `idx_reviews_place_created`, `idx_reviews_deleted_at` | Common detail-page query |
| User search history | `userController.getHistory` | `idx_search_history_user_created` | Fast newest-first personal history |
| Audit log by role | `adminRepository.getAuditLogsByRoleScope` | `idx_audit_log_role_scope`, `idx_audit_log_created` | Role-based admin oversight |
| Due backup scheduling | `backupScheduler.claimDueProfiles` | `idx_backup_profiles_due` | Prevent slow scheduler scans |

## What Performance Decisions Are Good To Say In Presentation

Use these points:

1. We indexed foreign keys and repeated filter columns because those are used constantly in joins and ownership checks.
2. We indexed recent-first activity tables by timestamp because admin and session flows read newest records often.
3. We added a GiST index for location because geospatial search is a core feature.
4. We used partial and unique indexes for business rules, such as one active review per user per place and one storage-object metadata row per object.
5. We separated menu catalog data from stall-menu links, then indexed the link table for efficient many-to-many access.

## Honest Performance Gaps

These are worth knowing before the defense.

### Case-insensitive email lookup

Current code:

- `LOWER(email) = LOWER($1)`

Current index:

- `idx_users_email ON users(email)`

Issue:

- a normal b-tree index on `email` is not the ideal shape for a `LOWER(email)` query

Possible improvement:

- add `CREATE INDEX ... ON users (LOWER(email))`

### Text search with `ILIKE`

Current code uses `ILIKE` on:

- place names
- menu item names
- user names and email in admin search

Issue:

- no trigram or full-text search index is currently defined for these patterns

Possible improvement:

- `pg_trgm` indexes for heavy text search workloads

### Geospatial radius filter pattern

Current code uses:

- `ST_Distance(...) <= range`

Possible improvement:

- use `ST_DWithin(...)` for more directly index-friendly radius filtering

## Member Focus

## Layhok: Global Admin + Developer Interface

Focus on these index groups:

- audit log indexes
- database activity log indexes
- backup scheduler indexes
- user role and session indexes

Best explanation angle:

- indexes keep admin dashboards, audit lookup, and backup scheduling responsive as operational data grows

## Pav: Vendor + Business Assistance

Focus on these index groups:

- `places` ownership and status indexes
- `place_hours` lookup indexes
- `menu_items` owner index
- `place_menu_items` availability and item indexes

Best explanation angle:

- indexes support vendor ownership queries, stall management, and menu linking without scanning all data

## Smey: Consumer

Focus on these index groups:

- geospatial place search index
- reviews indexes
- bookmarks, routes, and search-history indexes

Best explanation angle:

- indexes improve the consumer experience by making search, detail pages, and personal saved data load faster

## Final Takeaway

The indexing strategy is strongest where the product is strongest:

- auth and session control
- geospatial search
- vendor ownership queries
- review retrieval
- admin and backup operations

The system already uses practical indexes, and the team can also honestly discuss future improvements for case-insensitive email lookup, `ILIKE` search, and geospatial radius filtering.
