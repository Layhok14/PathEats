# Database Design, Table Ownership, ERD, and RM Guide

## Purpose

This file separates:

- tables defined by the team
- platform-managed tables not defined by the team
- customer-facing business tables
- internal or administrative tables

Its job is to help the team defend the database design clearly, choose the correct tables for ERD and RM, and answer questions about which parts of the database belong to the real product domain.

## Source Of Truth

This guide is based on:

- `backend/src/db/seed.sql`
- `backend/src/db/migrations/*.sql`
- `backend/src/repositories/OtpRepository.js`
- `backend/src/db/policies.sql`

Important rule:

- the current schema is not only `seed.sql`
- migrations extend the schema
- `otps` is created at runtime by `OtpRepository`

## The First Separation To Explain In Presentation

Not every table should appear in the main ERD for business presentation.

There are three different categories:

1. Core business tables
2. Internal application support tables
3. External platform-managed tables

If those categories are mixed together in one small 10-minute presentation, the ERD becomes noisy and harder to defend.

## Tables Defined By The Team

These are application-defined tables in the `public` schema.

### Core business and customer-facing domain

- `users`
- `place_categories`
- `places`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `reviews`
- `place_images`
- `menu_item_images`
- `bookmarks`
- `routes`
- `search_history`
- `user_preferences`
- `user_profile_images`

### Internal security, admin, and system support

- `refresh_tokens`
- `session_events`
- `audit_log`
- `onboarding_config`
- `"role"`
- `backup_profiles`
- `scheduled_backups`
- `recovery_operations`
- `query_presets`
- `database_activity_log`
- `otps`

## Tables Not Defined By The Team

These are not your business-domain tables even if they exist in the same Supabase database environment.

### Supabase-managed or external platform schemas

- `auth.*`
  - example: `auth.users` if Supabase Auth is used
- `storage.*`
  - example: `storage.buckets`, `storage.objects`

### PostgreSQL and PostGIS system metadata

- `pg_catalog.*`
- `information_schema.*`
- `spatial_ref_sys`
- `geometry_columns`
- `geography_columns`

These should not be drawn as your project ERD unless the teacher explicitly asks about platform internals.

## Important Clarifications

### `"role"` is user-defined, not built-in

Even though the name looks generic, the `"role"` table is created by this project in `seed.sql` and extended by `2026-07-13-application-rbac.sql`.

It is part of your application design.

### `otps` is also user-defined

`otps` is not created in `seed.sql`. It is created lazily in `backend/src/repositories/OtpRepository.js`.

It is still an application-defined table because your code creates and uses it.

### Supabase Storage objects are not stored only in your tables

The application stores image metadata in:

- `place_images`
- `menu_item_images`
- `user_profile_images`

But the actual binary files may live in Supabase Storage under `storage.objects` or in local fallback storage, depending on configuration.

So image metadata belongs to your ERD, but Supabase Storage internal tables do not need to appear in the main ERD.

## Which Tables Are Customer-Facing vs Internal

## Directly related to target users and app features

These represent the real product domain the customer interacts with:

- `users`
- `place_categories`
- `places`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `reviews`
- `place_images`
- `menu_item_images`
- `bookmarks`
- `routes`
- `search_history`
- `user_preferences`
- `user_profile_images`

These are the strongest candidates for the main ERD and RM.

## Mostly internal, admin, security, or maintenance

These support administration, authentication, session control, backup, or developer tooling:

- `refresh_tokens`
- `session_events`
- `audit_log`
- `onboarding_config`
- `"role"`
- `backup_profiles`
- `scheduled_backups`
- `recovery_operations`
- `query_presets`
- `database_activity_log`
- `otps`

These are real tables in your system, but most of them are not part of the customer-facing business workflow.

## The Best ERD Choice For Presentation

## Recommended main ERD

For a 10-minute database presentation, the main ERD should focus on the business domain:

- `users`
- `"role"`
- `place_categories`
- `places`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `reviews`

Optional if you have space:

- `place_images`
- `menu_item_images`
- `bookmarks`
- `routes`
- `search_history`

Reason:

- this set explains ownership
- it explains role-based access
- it explains vendor stall and menu management
- it explains consumer interaction with reviews and saved data
- it stays understandable within presentation time

## Recommended appendix ERD

Use a second diagram or appendix if the teacher asks about internals:

- `refresh_tokens`
- `session_events`
- `audit_log`
- `backup_profiles`
- `scheduled_backups`
- `recovery_operations`
- `query_presets`
- `database_activity_log`
- `otps`

This shows that the project also has operational and security depth without cluttering the main business ERD.

## Recommended RM Tables To Present

Use the following relational model set as the main one:

- `ROLE(role_id PK, name, base_scope, table_privileges, system_capabilities, grant_option, is_system, created_at, updated_at)`
- `USERS(user_id PK, role_id FK -> ROLE.role_id, email, password_hash, first_name, last_name, phone_number, role_scope, is_banned, created_at, updated_at)`
- `PLACE_CATEGORIES(category_id PK, slug, name, description, created_at)`
- `PLACES(place_id PK, owner_id FK -> USERS.user_id, category_id FK -> PLACE_CATEGORIES.category_id, name, description, location, address, photo_url, price_range, rating_avg, rating_count, is_open, status, is_admin_managed, created_at, updated_at)`
- `PLACE_HOURS(id PK, place_id FK -> PLACES.place_id, day_of_week, opens_at, closes_at, is_closed)`
- `MENU_ITEMS(menu_item_id PK, owner_id FK -> USERS.user_id, name, description, default_price, category, image_url, created_at)`
- `PLACE_MENU_ITEMS(place_id FK -> PLACES.place_id, menu_item_id FK -> MENU_ITEMS.menu_item_id, price, is_available, created_at, updated_at, PK(place_id, menu_item_id))`
- `REVIEWS(review_id PK, place_id FK -> PLACES.place_id, user_id FK -> USERS.user_id, rating, body, is_moderated, flagged_at, deleted_at, created_at, updated_at)`

Optional extension:

- `PLACE_IMAGES(id PK, place_id FK -> PLACES.place_id, bucket_name, object_path, uploaded_by FK -> USERS.user_id, mime_type, size_bytes, alt_text, sort_order, is_primary, created_at, updated_at)`
- `MENU_ITEM_IMAGES(id PK, menu_item_id FK -> MENU_ITEMS.menu_item_id, bucket_name, object_path, uploaded_by FK -> USERS.user_id, mime_type, size_bytes, alt_text, sort_order, is_primary, created_at, updated_at)`

## Most Important Relationships To Explain

These are the strongest relationships to say out loud during presentation:

1. `places.owner_id -> users.id`
   - each stall belongs to one vendor user
2. `places.category_id -> place_categories.id`
   - each stall belongs to one category
3. `place_hours.place_id -> places.id`
   - one stall has many schedule rows
4. `menu_items.owner_id -> users.id`
   - menu catalog belongs to vendor
5. `place_menu_items` bridges `places` and `menu_items`
   - one vendor menu item can appear in multiple owned stalls
6. `reviews.place_id -> places.id`
   - reviews belong to stalls
7. `users.role_id -> role.id`
   - user privileges are tied to role records

## Business Rules That Shape The Design

These are not just table links. They are design decisions.

- `places.owner_id` must reference a vendor user, enforced by trigger logic in `seed.sql`
- a vendor role cannot be changed away from `VENDOR` while they still own places
- `place_menu_items` prevents duplication by using a composite primary key
- review soft deletion is tracked by `deleted_at`
- place rating is denormalized into `places.rating_avg` and `places.rating_count`, then refreshed by trigger/function
- role permissions are stored in the `"role"` table through JSON privileges and system capabilities

## What To Exclude From The Main ERD

Do not put these in the main customer/business ERD unless the teacher asks:

- `refresh_tokens`
- `session_events`
- `audit_log`
- `backup_profiles`
- `scheduled_backups`
- `recovery_operations`
- `query_presets`
- `database_activity_log`
- `otps`

Reason:

- they are important for system operation
- but they do not explain the customer-facing business workflow
- including them in the main ERD makes the design look more complex than necessary

## Member Focus

## Layhok: Global Admin + Developer Interface

Must understand best:

- `"role"`
- `users`
- `audit_log`
- `backup_profiles`
- `scheduled_backups`
- `recovery_operations`
- `query_presets`
- `database_activity_log`

Best contribution angle:

- explain privileges and access control
- explain audit, backup, and operational tables
- explain why some tables are internal and not part of customer ERD

## Pav: Vendor + Business Assistance

Must understand best:

- `users`
- `places`
- `place_categories`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `place_images`
- `menu_item_images`
- `onboarding_config`

Best contribution angle:

- explain stall ownership
- explain menu catalog versus stall-specific linking
- explain why business assistance touches vendor management but does not own all admin privileges

## Smey: Consumer

Must understand best:

- `places`
- `reviews`
- `bookmarks`
- `routes`
- `search_history`
- `user_preferences`

Best contribution angle:

- explain how the consumer reads public place data
- explain review ownership and soft delete behavior
- explain personal data tables that support the consumer experience

## Final Recommendation

For defense presentation:

1. Use one main ERD for business tables.
2. Keep internal and backup tables in an appendix or separate slide.
3. Explicitly say that Supabase-managed schemas such as `auth` and `storage` are platform internals, not the team’s core ERD.
4. Explicitly say that `"role"` and `otps` are still project-defined tables, even though one is generic and one is runtime-created.
