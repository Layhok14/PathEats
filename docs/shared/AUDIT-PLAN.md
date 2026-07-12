# PathEats Cross-Role Audit & Alignment Plan

**Date:** 2026-07-12
**Scope:** Vendor, Global Admin, Business Assistant, Consumer interfaces
**Database:** Supabase PostgreSQL with PostGIS

---

## Table of Contents

1. [Role Model](#1-role-model)
2. [Place/Store Model](#2-placestore-model)
3. [Vendor Store Management Audit](#3-vendor-store-management-audit)
4. [Global Admin Place Management](#4-global-admin-place-management)
5. [Business Assistant Place Management](#5-business-assistant-place-management)
6. [Field-Level Place Form Alignment](#6-field-level-place-form-alignment)
7. [Place Categories](#7-place-categories)
8. [Spatial Location Alignment](#8-spatial-location-alignment)
9. [Place Hours Alignment](#9-place-hours-alignment)
10. [Place Images](#10-place-images)
11. [Menu Item Ownership Model](#11-menu-item-ownership-model)
12. [Menu Item Images](#12-menu-item-images)
13. [Place-Menu Item Relationship](#13-place-menu-item-relationship)
14. [Ownership Consistency for Menu Linking](#14-ownership-consistency-for-menu-linking)
15. [Menu Item CRUD Behavior](#15-menu-item-crud-behavior)
16. [Removing a Menu Item From One Place](#16-removing-a-menu-item-from-one-place)
17. [Deleting a Master Menu Item](#17-deleting-a-master-menu-item)
18. [Deleting a Place](#18-deleting-a-place)
19. [is_open Versus status](#19-is_open-versus-status)
20. [Vendor Ban Effects](#20-vendor-ban-effects)
21. [Consumer Visibility](#21-consumer-visibility)
22. [Synchronization Model](#22-synchronization-model)
23. [Onboarding Configuration](#23-onboarding-configuration)
24. [Business Assistant Onboarding Limitation](#24-business-assistant-onboarding-limitation)
25. [Audit Logging](#25-audit-logging)
26. [Shared Validation](#26-shared-validation)
27. [Interface Layout Comparison](#27-interface-layout-comparison)
28. [Authorization Tests](#28-authorization-tests)
29. [Database Integrity Risks](#29-database-integrity-risks)
30. [Required Test Scenarios](#30-required-test-scenarios)
31. [Deliverables](#31-deliverables)

---

## 1. Current Role Model

### 1.1 Actual Role Values

**Confirmed `users.role_scope` values:**
- `CONSUMER`
- `VENDOR`
- `GLOBAL_ADMIN`
- `DEVELOPER_ADMIN`
- `BUSINESS_ASSISTANCE`

Defined in `backend/src/utils/roles.js` as a frozen `ROLES` constant. Five roles total.

### 1.2 The Separate `role` Table

The `role` table exists (`seed-data.sql:903-917`) with columns: `id`, `name`, `table_privileges` (JSONB), `grant_option`, `created_at`.

**Current usage:**
- Managed via Admin UI (`frontend/src/admin/components/AddRole.tsx`)
- `adminRepository.js:ensureRoleTable()` auto-creates/migrates it
- Used purely for **admin UI display** of table-level privileges
- **Not referenced by `rbacGuard.js` or `authMiddleware.js`** for actual access control

### 1.3 Dual-System Assessment

| Aspect | `users.role_scope` | `role` table |
|--------|-------------------|--------------|
| Authentication | **Active** - JWT payload, login validation | Not used |
| Authorization | **Active** - `rbacGuard.js` checks this | Not used |
| UI display | Sidebar role badge | Admin role management page |
| FK constraint | None (TEXT column) | None to users |
| Enforcement | DB triggers (`enforce_place_owner_role`) | None |

**Finding [HIGH]:** The `role` table is an **admin UI-only metadata store**. It has no enforcement relationship with `users.role_scope`. A user could have `role_scope = 'VENDOR'` while the `role` table shows VENDOR with restricted privileges, but the actual access control ignores the `role` table entirely.

**Finding [MEDIUM]:** `users.role_scope` is `TEXT NOT NULL DEFAULT 'CONSUMER'` with **no CHECK constraint** (migration `2026-07-11-drop-role-scope-check.sql` explicitly dropped it). Invalid role names can be stored. The `enforce_place_owner_role()` trigger only validates for places, not for general access.

### 1.4 Recommendations

| Priority | Action |
|----------|--------|
| **High** | Add a CHECK constraint on `users.role_scope` with the five valid values, OR use a foreign key to `role.name` |
| **Medium** | Decide whether `role.table_privileges` should be enforced at the middleware level or remain display-only |
| **Low** | Remove `role` table if it will never be enforced, or document its display-only purpose |

---

## 2. Place/Store Model

### 2.1 Schema: `places` Table

```sql
places (
  id UUID PK,
  owner_id UUID NOT NULL FK -> users(id) RESTRICT,
  is_admin_managed BOOLEAN NOT NULL DEFAULT FALSE,
  category_id UUID NOT NULL FK -> place_categories(id) RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  address TEXT,
  photo_url TEXT,                          -- LEGACY
  price_range INT CHECK (BETWEEN 1 AND 4),
  rating_avg NUMERIC(3,2) DEFAULT 0,       -- System-managed
  rating_count INTEGER DEFAULT 0,          -- System-managed
  is_open BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (IN ('active', 'closed')),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### 2.2 Field Usage Across Roles

| Field | Vendor | Global Admin | Business Assistant | Consumer |
|-------|--------|-------------|-------------------|----------|
| `owner_id` | Set to self on create. Read-only. | Editable (owner reassignment). Required on create. | Editable (owner reassignment). Required on create. | Not visible |
| `is_admin_managed` | Read-only. Set to FALSE on vendor update. Shown as `adminManaged` badge. | Editable in `updateStall()`. Auto-set to TRUE on close/ban. | Editable in `updateStall()`. Auto-set to TRUE on close/ban. | Not visible |
| `category_id` | Editable via `place_categories` lookup. Required. | Editable. Required. | Editable. Required. | Displayed as category name |
| `name` | Editable. Required (validated by `VendorModel.validateCreate`). | Editable. Required. | Editable. Required. | Displayed |
| `description` | Editable. Optional. | Editable. Optional. | Editable. Optional. | Displayed |
| `location` | Set via map (PostGIS). Required (NOT NULL in DB). | Set via map. Required. | Set via map. Required. | Used for distance calculations |
| `address` | Editable. Optional. | Editable. Optional. | Editable. Optional. | Displayed |
| `photo_url` | Legacy fallback. Set by `imageDisplayUrlFromStorageInput`. | Legacy fallback. Same logic. | Legacy fallback. Same logic. | Used as fallback if no `place_images` |
| `price_range` | Editable. Integer 1-4. Optional in DB. | Editable. Integer 1-4. | Editable. Integer 1-4. | Displayed as `$`/`$$`/`$$$`/`$$$$` |
| `rating_avg` | Read-only. Auto-calculated by `refresh_place_rating()` trigger. | Read-only. | Read-only. | Displayed |
| `rating_count` | Read-only. Auto-calculated. | Read-only. | Read-only. | Displayed |
| `is_open` | Toggleable. Disabled if `is_admin_managed`. | Toggleable. Sets `is_admin_managed = FALSE` when reopening. | Toggleable. | Used for visibility + `open_now` display |
| `status` | Derived from `is_open`. | Editable directly. | Editable directly. | Must be `active` for visibility |

### 2.3 Missing Fields

The schema **does not** contain:
- Approval status / rejection status
- Suspension status (separate from ban)
- Onboarding status
- Deletion state (soft delete)
- Archived state
- Suspension/rejection reason
- Business Assistant assignment
- Vendor verification state

**Finding [MEDIUM]:** `is_admin_managed` serves multiple overlapping purposes:
1. Auto-set `TRUE` when vendor is banned (in `adminRepository.updateStatus`)
2. Auto-set `TRUE` when place is closed by admin (in `updateStallStatus`)
3. Auto-set `TRUE` when place is rejected (in `approveVendor`)
4. Set to `FALSE` when vendor reopens or admin reopens
5. Prevents vendor from toggling open/closed (checked in `VendorService.js`)

The DB comment says: `'Legacy/admin display flag only. It does not bypass the required vendor owner.'` but the code actively uses it as a **control flag** that affects vendor permissions.

### 2.4 Recommendations

| Priority | Action |
|----------|--------|
| **High** | Add an explicit `approval_status` column (e.g., `pending`, `approved`, `rejected`, `suspended`) to separate approval lifecycle from `is_admin_managed` |
| **Medium** | Add `deleted_at` for soft deletion of places to preserve review history |
| **Medium** | Clarify `is_admin_managed` semantics in code comments and documentation |
| **Low** | Consider adding `suspension_reason TEXT` for audit trail |

---

## 3. Vendor Store Management Audit

### 3.1 Vendor Capabilities (Current)

| Action | Supported | Route | Backend | Notes |
|--------|-----------|-------|---------|-------|
| View owned places | Yes | `GET /vendor/stalls` | `VendorRepository.findByOwner` | Owner-scoped query |
| View place details | Yes | `GET /vendor/stalls/:id` | `VendorRepository.findOwnedById` | Owner-scoped |
| Create place | Yes | `POST /vendor/stalls` | `VendorRepository.create` | Transaction: insert + image + hours + menu items |
| Edit place | Yes | `PUT /vendor/stalls/:id` | `VendorRepository.update` | Transaction: update + image + hours + menu sync |
| Delete place | Yes | `DELETE /vendor/stalls/:id` | `VendorRepository.deleteStall` | Transaction: cascade delete dependent rows |
| Open/close place | Yes | `PUT /vendor/stalls/:id` | Via `update()` with `status`/`is_open` | Disabled if `is_admin_managed` (frontend check) |
| Set category | Yes | Via create/edit | FK lookup on `place_categories` | Slug or name resolution |
| Set name | Yes | Via create/edit | Required | Sanitized via `sanitizeText` |
| Set description | Yes | Via create/edit | Optional | Sanitized |
| Set location | Yes | Via create/edit map | PostGIS geography | lng/lat via `ST_MakePoint` |
| Set address | Yes | Via create/edit | Optional text | |
| Set price range | Yes | Via create/edit | Integer 1-4 | Optional |
| Upload place images | Yes | `POST /vendor/uploads/images` | `storageService` + `upsertPrimaryPlaceImage` | Supabase Storage or local |
| Configure hours | Yes | Via create/edit | `replacePlaceHours` (delete-all + reinsert) | 7-day array |
| Select menu items | Yes | Via create/edit + stall detail | `place_menu_items` junction | Owner-matched |
| Remove menu items | Yes | `DELETE /vendor/stalls/:id/items/:itemId` | `VendorRepository.deleteMenuItem` | Unlinks only, does not delete item |
| View consumer representation | Yes | `GET /vendor/stalls/:id/view` | `StallViewPage.tsx` | Read-only consumer-like view |

### 3.2 Ownership Enforcement

**Vendor-side:** Every query filters by `WHERE owner_id = $1` using `req.user.sub` from JWT.

**Finding [HIGH - PASS]:** The vendor route handler derives `ownerId` from `req.user.sub`, not from the request body. The `VendorRepository.update()` uses `WHERE id = $1 AND owner_id = $2` with both values from the server side. This is correct IDOR protection.

**Finding [LOW]:** The frontend `StallDetailPage.tsx` disables the open/closed toggle when `adminManaged` is true (line ~check). This is a UI-only guard; the backend `VendorService.updateStall()` also checks this:
```js
if (stall.is_admin_managed && status === PLACE_STATUS.ACTIVE) {
  throw new AppError("This stall was closed by an administrator", 403, { code: "STALL_ADMIN_CLOSED" });
}
```

### 3.3 Transaction Behavior

Both vendor create and update use `db.transaction()`:
1. Insert/Update `places` row
2. Upsert primary `place_images` row
3. Delete all + reinsert `place_hours` rows
4. Sync `place_menu_items` (delete-all + reinsert with owner check)

**Finding [MEDIUM]:** The menu item linking in `VendorRepository.linkMenuItemsToPlace()` checks `mi.owner_id = $2` (the vendor's ID) but does NOT verify the `is_available` flag is preserved during reinsert. On update, all links are deleted and reinserted with `is_available = TRUE`, which could reset a previously disabled item's availability.

**Finding [LOW]:** Old Supabase Storage objects are NOT deleted when a new primary image is uploaded via `upsertPrimaryPlaceImage`. The old row is marked `is_primary = FALSE`, but the storage object remains. This could lead to orphaned storage objects.

---

## 4. Global Admin Place Management

### 4.1 Admin Capabilities (Current)

| Action | Route | Permission | Notes |
|--------|-------|-----------|-------|
| View all places | `GET /admin/stalls` | businessOrGlobal | `findAllStalls()` with pagination |
| Filter by owner | `GET /admin/stalls/owner/:ownerId` | businessOrGlobal | `findStallsByOwner()` |
| View place details | `GET /admin/stalls/:id` | businessOrGlobal | `findStallById()` |
| Create place for user | `POST /admin/stalls` | businessOrGlobal | `createStall()` with owner selection |
| Edit any place | `PATCH /admin/stalls/:id` | businessOrGlobal | `updateStall()` with ownership reassignment |
| Toggle open/closed | `PATCH /admin/stalls/:id/toggle` | businessOrGlobal | `updateStallStatus()` |
| Delete place | `DELETE /admin/stalls/:id` | businessOrGlobal | `deleteStall()` cascading |
| Set hours (individual) | `POST /admin/stalls/:placeId/place-hours` | globalAdminOnly | `createStallPlaceHour()` |
| Delete hours (individual) | `DELETE /admin/stalls/place-hours/:id` | globalAdminOnly | `deleteStallPlaceHour()` |
| Create menu item for stall | `POST /admin/stalls/:placeId/menu-items` | businessOrGlobal | `createStallMenuItem()` |
| Edit menu item | `PATCH /admin/menu-items/:id` | businessOrGlobal | `updateMenuItem()` |
| Delete menu item from stall | `DELETE /admin/stalls/menu-items/:id` | businessOrGlobal | `deleteStallMenuItem()` |
| Create category | `POST /admin/stalls/place-categories` | globalAdminOnly | `createStallCategory()` |
| Delete category | `DELETE /admin/stalls/place-categories/:id` | globalAdminOnly | `deleteStallCategory()` |
| Approve/reject vendor | `POST /admin/vendors/:id/approve` | globalAdminOnly | `approveVendor()` |
| Edit onboarding config | `PUT /admin/vendors/onboarding` | businessOrGlobal | `updateOnboardingConfig()` |
| Ban/unban user | `PUT /admin/users/:id/status` | globalAdminOnly | `updateStatus()` |
| Add review to stall | `POST /admin/stalls/:placeId/reviews` | globalAdminOnly | `createStallReview()` |
| Delete review | `DELETE /admin/stalls/reviews/:id` | globalAdminOnly | `deleteStallReview()` |
| Flag/unflag review | `PATCH /admin/stalls/reviews/:id/flag` | globalAdminOnly | `flagReview()`/`unflagReview()` |
| Remove review | `DELETE /admin/stalls/reviews/:id/remove` | businessOrGlobal | `removeReview()` |

### 4.2 How `is_admin_managed` Is Used

| Operation | `is_admin_managed` Set To | Meaning |
|-----------|--------------------------|---------|
| Admin creates place | `FALSE` | Normal place |
| Admin closes place (`updateStallStatus`) | `TRUE` | Admin locked the place |
| Admin rejects vendor (`approveVendor` with `approved=false`) | `TRUE` | Place rejected |
| Admin opens place (`updateStallStatus` reopen) | `FALSE` | Admin released it |
| Admin approves vendor (`approveVendor` with `approved=true`) | `FALSE` | Place approved |
| Admin bans vendor (`updateStatus`) | `TRUE` + `status=closed` + `is_open=FALSE` | Vendor banned, all places locked |
| Vendor tries to reopen admin-closed place | BLOCKED | `VendorService` checks `is_admin_managed` |
| Vendor updates normally | Set to `FALSE` | Vendor regains control |

**Finding [MEDIUM]:** `is_admin_managed` conflates three concepts:
1. Admin override lock (prevent vendor from toggling)
2. Admin-created flag (informational)
3. Banned/rejected state indicator

A cleaner model would separate these into distinct fields.

### 4.3 No Separate Admin/Vendor Copies

**Finding [HIGH - PASS]:** Both admin and vendor routes operate on the same `places` table. There is no separate admin copy. The `adminRepository.updateStall()` and `VendorRepository.update()` both write to the same rows.

### 4.4 Ownership Change

Admin can change `owner_id` via `updateStall()` by including `ownerId` in the payload. The backend validates:
1. `ensureVendorOwner()` - new owner must be a VENDOR role user
2. DB trigger `enforce_place_owner_role()` - double-checks
3. DB trigger `prevent_place_owner_role_change()` - prevents demoting a vendor who owns places

**Finding [MEDIUM]:** The admin `updateStall()` does NOT validate that the new owner_id is not the same as the current one, which is harmless but unnecessary.

---

## 5. Business Assistant Place Management

### 5.1 Current Access Model

**Finding [HIGH]:** Business Assistant access is **role-scope based**, NOT assignment-based.

```js
// adminRoutes.js line 32
router.use(restrictToRoles("GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"));
```

The `businessOrGlobal` guard allows both GLOBAL_ADMIN and BUSINESS_ASSISTANCE on most stall operations. The only operations restricted to `globalAdminOnly` are:
- Category create/delete
- Individual place hours create/delete (POST/DELETE)
- User ban/unban
- Review add/delete
- Vendor approve/reject
- Audit log access
- Role management

**Finding [CRITICAL]:** A Business Assistant can:
- View ALL vendors and ALL places (no assignment filtering)
- Create stalls for ANY vendor
- Edit ANY stall
- Delete stalls
- Edit onboarding configuration
- Flag/remove reviews
- Toggle any stall's open/closed status

There is **no `business_assistant_assignments` table**, no `business_assistant_id` on places, and no assignment-based filtering. The Business Assistant has essentially the same place management access as Global Admin minus user management and category management.

### 5.2 Missing Schema Support

Required for assignment-based access:
```sql
CREATE TABLE business_assistant_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES users(id),
  vendor_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(assistant_id, vendor_id)
);
```

**Recommendation:** If the Business Assistant should only manage assigned vendors, this table is required. All queries in `adminRepository` would need to filter through this junction.

### 5.3 Business Assistant Permissions

| Action | Current | Expected |
|--------|---------|----------|
| View vendors | ALL vendors | Only assigned vendors |
| View stalls | ALL stalls | Only assigned vendor stalls |
| Create stalls | ANY vendor's stall | Only assigned vendor stalls |
| Edit stalls | ANY stall | Only assigned vendor stalls |
| Delete stalls | ANY stall | **Should NOT be allowed** |
| Change ownership | YES | Only within assigned vendors |
| Ban users | NO | Correct |
| Edit onboarding config | YES | Expected |
| Manage categories | NO | Correct |
| Delete reviews | YES | Unclear intent |
| Approve/reject vendors | NO | Correct |

---

## 6. Field-Level Place Form Alignment

### 6.1 Place Field Matrix

| DB Field | Vendor Create | Vendor Edit | Admin Create | Admin Edit | BA Create | BA Edit | Consumer |
|----------|--------------|-------------|-------------|-----------|-----------|---------|----------|
| `owner_id` | Auto (self) | Read-only | Select dropdown | Editable | Select dropdown | Editable | Hidden |
| `is_admin_managed` | Auto FALSE | Read-only | Auto FALSE | Editable | Auto FALSE | Editable | Hidden |
| `category_id` | Required, select | Required, select | Required, select | Required, select | Required, select | Required, select | Displayed as name |
| `name` | Required, text | Required, text | Required, text | Required, text | Required, text | Required, text | Displayed |
| `description` | Optional, textarea | Optional, textarea | Optional, textarea | Optional, textarea | Optional, textarea | Optional, textarea | Displayed |
| `location` | Required, map | Required, map | Required, map | Required, map | Required, map | Required, map | Used for distance |
| `address` | Optional, text | Optional, text | Optional, text | Optional, text | Optional, text | Optional, text | Displayed |
| `photo_url` | Via image upload | Via image upload | Via image upload | Via image upload | Via image upload | Via image upload | Displayed (primary) |
| `price_range` | Optional, 1-4 | Optional, 1-4 | Optional, 1-4 | Optional, 1-4 | Optional, 1-4 | Optional, 1-4 | Displayed as `$` |
| `rating_avg` | Read-only (0) | Read-only | Read-only | Read-only | Read-only | Read-only | Displayed |
| `rating_count` | Read-only (0) | Read-only | Read-only | Read-only | Read-only | Read-only | Displayed |
| `is_open` | Auto TRUE | Toggleable | Auto TRUE | Toggleable | Auto TRUE | Toggleable | Filter + display |
| `status` | Derived | Derived | Editable | Editable | Editable | Editable | Filter |

### 6.2 Frontend Forms

| Form | Location | Vendor | Admin | BA | Shared? |
|------|----------|--------|-------|----|---------|
| Stall create | `StallCreatePage.tsx` | mode=`vendor` | mode=`management` (same component) | mode=`management` | **YES** - single component with mode detection |
| Stall edit | `StallDetailPage.tsx` | `vendor/stalls/:id` | N/A | N/A | Vendor-only |
| Stall info edit | `AdminStallDetailPage.tsx` | N/A | Info tab | Info tab | Admin/BA share component |
| Menu item form | `MenuItemModal` in StallDetailPage + AdminStallDetailPage | Dialog pattern | Dialog pattern | Dialog pattern | Separate implementations |

**Finding [MEDIUM]:** `StallCreatePage.tsx` is shared between vendor and admin/BA (detects `managementMode` from URL path). But `StallDetailPage.tsx` (vendor) and `AdminStallDetailPage.tsx` (admin/BA) are completely separate implementations with duplicated form logic.

**Finding [LOW]:** The vendor `StallDetailPage.tsx` does NOT show `address` as a separate editable field - it shows `landmark` (which maps to `address` in the DB). The admin `AdminStallDetailPage.tsx` shows both a name field and uses `address` directly.

---

## 7. Place Categories

### 7.1 Schema

```sql
place_categories (
  id UUID PK,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ
)
```

Seed categories: Rice, Nom Banh Chok, Kuytev, Nompang, Chek Chen, Cafe, Banh Sung, Banh Xeo, Others (9 total).

### 7.2 Category Usage

| Interface | Source | Editable |
|-----------|--------|----------|
| Vendor create/edit | `GET /admin/stall-management/options` (returns categories) | No |
| Admin create/edit | Same endpoint | Yes (Global Admin only: create/delete) |
| BA create/edit | Same endpoint | No (route blocked by `globalAdminOnly`) |
| Consumer filter | **Hardcoded** `CUISINE_OPTIONS` in `appConfig.js` | No |
| Consumer display | From API response `category_name` | No |

**Finding [HIGH]:** The consumer interface uses **hardcoded** `CUISINE_OPTIONS` in `appConfig.js` and `STALL_CATEGORIES` in `categories.ts`, while the database stores categories in `place_categories`. If an admin creates, renames, or deletes a category, the consumer filter list will be out of sync.

**Finding [MEDIUM]:** `category_id` is `NOT NULL` in the `places` table but the FK allows `ON DELETE RESTRICT`. If a category is deleted that has places, the delete will fail. The admin `deleteStallCategory()` does not check for references before deleting.

### 7.3 Recommendations

| Priority | Action |
|----------|--------|
| **High** | Consumer filter should fetch categories from the API (`GET /admin/place-categories`), not hardcoded |
| **Medium** | `deleteStallCategory` should check for places using the category before deleting |
| **Low** | Add `is_active BOOLEAN` to categories to allow soft-disable |

---

## 8. Spatial Location Alignment

### 8.1 Storage Format

- **DB type:** `GEOGRAPHY(POINT, 4326)` (PostGIS geography)
- **SRID:** 4326 (WGS 84)
- **Insert:** `ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography`
- **Extract:** `ST_Y(p.location::geometry) AS lat`, `ST_X(p.location::geometry) AS lng`

### 8.2 Coordinate Convention

All interfaces use **(lat, lng)** order in API payloads and **(lng, lat)** order for PostGIS (consistent with GeoJSON spec).

| Interface | Input Method | Convention |
|-----------|-------------|------------|
| Vendor create/edit | MapLibre GL map + draggable pin | lat/lng from map event |
| Admin create/edit | MapLibre GL map + draggable pin | lat/lng from map event |
| BA create/edit | Same as admin | lat/lng from map event |
| Consumer display | MapLibre GL markers | lat/lng from API response |

**Finding [HIGH - PASS]:** All interfaces consistently use the same coordinate convention. The PostGIS insert order `(lng, lat)` is correct for `ST_MakePoint`.

**Finding [LOW]:** The `VendorRepository.create()` has fallback defaults `lat = 11.5564, lng = 104.9282` (Phnom Penh center) when coordinates are not provided. The admin `adminRepository.createStall()` has the same defaults. This means a stall could be created at the default location if the frontend fails to send coordinates.

---

## 9. Place Hours Alignment

### 9.1 Schema

```sql
place_hours (
  id UUID PK,
  place_id UUID NOT NULL FK -> places(id) CASCADE,
  day_of_week INT NOT NULL CHECK (BETWEEN 0 AND 6),
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  UNIQUE(place_id, day_of_week)
)
```

### 9.2 Day Mapping

- `0` = **Sunday** (PostgreSQL `EXTRACT(DOW FROM ...)`)
- `1` = Monday through `6` = Saturday

The `normalizeOperatingSchedule()` in `placeHours.js` creates entries for days 0-6, where days 0 and 6 are weekends.

The `scheduleToResponse()` groups days into `weekdays` (1-5) and `weekends` (0, 6) for the API response.

### 9.3 Consistency

| Interface | Day Input | Format |
|-----------|----------|--------|
| Vendor form | 7-row array (day 0-6) | `{ dayOfWeek, opensAt, closesAt, isClosed }` |
| Admin form | Same structure | Same |
| BA form | Same structure | Same |
| Consumer display | Grouped weekdays/weekends | `{ open, close }` per group |

**Finding [MEDIUM]:** The consumer display groups days into only two buckets (weekdays/weekends). If a vendor has different hours for Monday vs Friday, only the first non-closed day's hours are shown for each group. This loses information.

**Finding [LOW - PASS]:** The `UNIQUE(place_id, day_of_week)` constraint is present. Duplicate day entries are prevented at the DB level.

**Finding [LOW]:** The `replacePlaceHours()` function does a delete-all + reinsert pattern. If the delete succeeds but a reinsert fails (e.g., invalid time), the hours could be lost. The transaction wrapping should handle this, but the function itself does not begin a transaction - it relies on the caller passing a `client` from a transaction.

---

## 10. Place Images

### 10.1 Dual Source of Truth

**Finding [HIGH]:** Two image sources coexist:

1. **`places.photo_url`** (TEXT) - Legacy field. Set by `imageDisplayUrlFromStorageInput()`. DB comment: `'Legacy display fallback. New uploads must use place_images.'`
2. **`place_images` table** - Modern implementation with bucket, path, MIME type, sort order, primary flag.

Both are updated during create/update operations. Queries use `LATERAL` joins to get the primary image from `place_images`, but also select `photo_url` from `places`.

### 10.2 Primary Image Handling

**Finding [MEDIUM]:** The schema does NOT enforce a unique constraint for `is_primary = TRUE` per place. Multiple rows can have `is_primary = TRUE` for the same `place_id`.

However, the `upsertPrimaryPlaceImage()` function in `storageImageMetadata.js` handles this correctly:
1. Sets all existing primary images to `is_primary = FALSE`
2. Inserts the new image with `is_primary = TRUE`

So the application logic prevents duplicates, but the DB schema does not enforce it.

### 10.3 Consumer Image Resolution

Consumer queries use `LATERAL` joins to get the primary image from `place_images`, then `PlaceService.toVendor()` builds a `storage_image` object and falls back to `photo_url`.

### 10.4 Image Cleanup

**Finding [LOW]:** When a new primary image is uploaded, the old `place_images` row is set to `is_primary = FALSE` but is NOT deleted. Old rows accumulate. The Supabase Storage object is also not deleted.

### 10.5 Recommendations

| Priority | Action |
|----------|--------|
| **High** | Deprecate `places.photo_url` and stop writing to it. Use `place_images` exclusively |
| **Medium** | Add a partial unique index: `CREATE UNIQUE INDEX idx_place_images_one_primary ON place_images (place_id) WHERE is_primary = TRUE` |
| **Low** | Delete old Supabase Storage objects when replacing images |

---

## 11. Menu Item Ownership Model

### 11.1 Schema

```sql
menu_items (
  id UUID PK,
  owner_id UUID NOT NULL FK -> users(id) CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'snack' CHECK (IN ('snack', 'dessert', 'main course', 'drink')),
  image_url TEXT,           -- LEGACY
  created_at TIMESTAMPTZ
)
```

### 11.2 Ownership Enforcement

| Operation | Owner Check |
|-----------|-------------|
| Vendor: list global items | `WHERE mi.owner_id = $1` (from JWT) |
| Vendor: create global item | `INSERT ... VALUES (ownerId, ...)` |
| Vendor: update global item | `WHERE mi.id = $1 AND mi.owner_id = $2` |
| Vendor: delete global item | `WHERE mi.id = $1 AND mi.owner_id = $2` |
| Vendor: create stall item | CTE: `FROM owned_place SELECT owner_id` |
| Vendor: update stall item | JOIN: `p.owner_id = $3` (from JWT) |
| Vendor: delete stall item | JOIN: `p.owner_id = $3` AND `mi.owner_id = p.owner_id` |
| Admin: create stall item | CTE: `FROM target_place SELECT owner_id` (uses place's owner) |
| Admin: update stall item | No explicit owner check on `menu_items` |
| Admin: delete stall item | `DELETE FROM place_menu_items` only (unlink) |

**Finding [HIGH]:** When the admin creates a menu item for a stall via `adminRepository.createStallMenuItem()`, the item's `owner_id` is set to the **place's owner** (via CTE), which is correct. However, `adminRepository.updateMenuItem()` does NOT verify that the `menu_items.owner_id` matches the place's owner or the admin's target. It updates any menu item by ID without ownership verification.

### 11.3 Category System

Menu items use a **text enum**: `snack`, `dessert`, `main course`, `drink`

Place categories use a **separate UUID-based table**: `place_categories`

**Finding [LOW - PASS]:** These are correctly kept separate. The frontend uses `MenuCategory` type for menu items and `StallCategory`/`Cuisine` type for place categories. The backend normalizes menu item categories via `menuItemCategory()`.

---

## 12. Menu Item Images

### 12.1 Dual Source

Same pattern as place images:
1. `menu_items.image_url` (TEXT) - Legacy
2. `menu_item_images` table - Modern

**Finding [MEDIUM]:** Same issues as place images:
- No unique constraint on `is_primary = TRUE` per menu item
- Old rows/storage objects not cleaned up
- Both `image_url` and `menu_item_images` are written

---

## 13. Place-Menu Item Relationship

### 13.1 Junction Table

```sql
place_menu_items (
  place_id UUID FK -> places(id) CASCADE,
  menu_item_id UUID FK -> menu_items(id) CASCADE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  PRIMARY KEY (place_id, menu_item_id)
)
```

**Finding [HIGH - PASS]:** The composite primary key `(place_id, menu_item_id)` prevents duplicate links. The design correctly uses a many-to-many junction without duplicating menu items.

### 13.2 Cascade Behavior

Both FKs use `ON DELETE CASCADE`:
- Deleting a place removes all its menu item links
- Deleting a menu item removes all its place links

---

## 14. Ownership Consistency for Menu Linking

### 14.1 Current Checks

| Operation | Owner Match Check |
|-----------|------------------|
| Vendor: link items to stall | `WHERE mi.owner_id = $2 AND mi.id::text = ANY($3)` |
| Vendor: create stall | `linkMenuItemsToPlace(client, placeId, ownerId, itemIds)` |
| Admin: create stall | `WHERE mi.owner_id = $2 AND mi.id::text = ANY($3)` - uses place's owner_id |
| Admin: update stall | Same pattern - uses current place owner_id |

**Finding [HIGH - PASS]:** All menu item linking operations verify that `menu_items.owner_id` matches the place's `owner_id`. A vendor cannot link another vendor's menu item.

---

## 15. Menu Item CRUD Behavior

### 15.1 Vendor Capabilities

| Action | Route | Notes |
|--------|-------|-------|
| View global items | `GET /vendor/items` | Owner-scoped |
| Create global item | `POST /vendor/items` | Creates standalone item |
| Update global item | `PUT /vendor/items/:itemId` | Owner-scoped |
| Delete global item | `DELETE /vendor/items/:itemId` | Owner-scoped, CASCADE deletes links |
| View stall items | `GET /vendor/stalls/:id/items` | Via place_menu_items join |
| Create stall item | `POST /vendor/stalls/:id/items` | Creates AND links in one CTE |
| Update stall item | `PUT /vendor/stalls/:id/items/:itemId` | Updates menu_items + availability |
| Delete stall item | `DELETE /vendor/stalls/:id/items/:itemId` | Unlinks only (place_menu_items) |

### 15.2 Schema Limitations

The current schema does **NOT** support:
- Global menu item availability (only per-place via `place_menu_items.is_available`)
- Store-specific pricing (only `menu_items.price`)
- Display order for menu items within a place
- Preparation time
- Dietary information
- Soft deletion
- Archived state

**Finding [LOW]:** `menu_items` has no `updated_at` column. Updates are not tracked.

---

## 16. Removing a Menu Item From One Place

### 16.1 Vendor Implementation

```sql
DELETE FROM place_menu_items pmi
USING places p, menu_items mi
WHERE pmi.menu_item_id = $1 AND pmi.place_id = $2
  AND p.id = pmi.place_id AND p.owner_id = $3
  AND mi.id = pmi.menu_item_id AND mi.owner_id = p.owner_id
```

**Finding [HIGH - PASS]:** This only deletes the `place_menu_items` row. The `menu_items` row is NOT deleted. Other places linked to the same item remain unaffected.

### 16.2 Admin Implementation

```sql
DELETE FROM place_menu_items WHERE menu_item_id::text = $1 AND place_id::text = $2
```

**Finding [MEDIUM]:** The admin `deleteStallMenuItem()` does NOT verify ownership. It unlinks any menu item from any place.

---

## 17. Deleting a Master Menu Item

### 17.1 Cascade Behavior

```sql
menu_items.owner_id UUID FK -> users(id) ON DELETE CASCADE
place_menu_items.menu_item_id UUID FK -> menu_items(id) ON DELETE CASCADE
```

**Finding [HIGH]:** Deleting a `menu_items` row **automatically cascades** through `place_menu_items` via `ON DELETE CASCADE`. All place-menu links are silently removed. No impact warning is shown.

The frontend delete confirmation in `MenuItemsPage.tsx` says:
```
"Delete {name}? This removes it from the catalog and all linked stalls."
```

### 17.2 Recommendations

| Priority | Action |
|----------|--------|
| **Medium** | Before deletion, query count of affected places and include in confirmation dialog |
| **Low** | Consider soft deletion for menu items to preserve history |

---

## 18. Deleting a Place

### 18.1 Vendor Implementation

```sql
DELETE FROM place_menu_items WHERE place_id = $1;
DELETE FROM place_hours WHERE place_id = $1;
DELETE FROM place_images WHERE place_id = $1;
DELETE FROM places WHERE id = $1 AND owner_id = $2;
```

**Note:** Does NOT explicitly delete `reviews` or `bookmarks` (handled by CASCADE).

### 18.2 Admin Implementation

```sql
DELETE FROM place_menu_items WHERE place_id::text = $1;
DELETE FROM place_hours WHERE place_id::text = $1;
DELETE FROM reviews WHERE place_id::text = $1;     -- Explicit
DELETE FROM place_images WHERE place_id::text = $1;
DELETE FROM places WHERE id::text = $1;
```

**Finding [HIGH]:**
1. **Vendor does NOT explicitly delete reviews** - CASCADE handles it but behavior is inconsistent with admin
2. **Admin delete is NOT owner-scoped** - any GLOBAL_ADMIN or BUSINESS_ASSISTANT can delete any place
3. **No soft deletion** - permanent data loss

### 18.2 Recommendations

| Priority | Action |
|----------|--------|
| **High** | Add `deleted_at TIMESTAMPTZ` to `places` for soft deletion |
| **Medium** | Show deletion impact count in confirmation dialog |
| **Low** | Make vendor delete a "close" operation instead of physical delete |

---

## 19. is_open Versus status

### 19.1 Current Behavior

| Field | Values | Meaning |
|-------|--------|---------|
| `status` | `'active'` or `'closed'` | Lifecycle state |
| `is_open` | `TRUE` or `FALSE` | Currently operational |

### 19.2 Synchronization Rules

The application enforces that `is_open = TRUE` implies `status = 'active'` and `is_open = FALSE` implies `status = 'closed'`.

**Finding [HIGH - PASS]:** The code prevents conflicting combinations through synchronization logic in both vendor and admin update operations.

### 19.3 Consumer Query Logic

Consumer queries require both:
```sql
WHERE p.status = 'active' AND p.is_open = TRUE
```

**Finding [LOW]:** The consumer `getCount` endpoint checks `status = 'active' AND is_open = TRUE` but does NOT check time-based hours. The count may include places that are currently "open" by flag but whose hours have passed for the day.

---

## 20. Vendor Ban Effects

### 20.1 Current Implementation

When a vendor is banned (`adminRepository.updateStatus()`):

```js
if (user?.role_scope === "VENDOR" && banned) {
  await client.query(
    `UPDATE places
     SET status = 'closed', is_open = FALSE, is_admin_managed = TRUE, updated_at = NOW()
     WHERE owner_id::text = $1`,
    [id]
  );
}
```

### 20.2 Effects

| Effect | Implemented |
|--------|-------------|
| Prevent login | Yes |
| Prevent editing | Yes (403 from authMiddleware) |
| Hide their places | Yes (consumer queries join `WHERE is_banned = FALSE`) |
| Auto-close owned places | Yes (transaction in `updateStatus`) |
| Revoke active sessions | **Yes** — `tokenRepo.revokeAllForUser(id)` called after ban, password reset, and password change |

**Finding [FIXED]:** Ban now calls `tokenRepo.revokeAllForUser(id)` in `adminRepository.updateStatus()`. Same revoke added to `AuthService.resetPassword()` and `AuthService.changePassword()`. All active refresh tokens for the user are immediately revoked (access tokens remain valid until their 15m expiry).

**Finding [MEDIUM]:** When unbanned, places remain closed. No automatic restoration.

---

## 21. Consumer Visibility

### 21.1 Consumer Query Conditions

All consumer-facing queries use:
```sql
JOIN users owner_user
  ON owner_user.id = p.owner_id
 AND owner_user.role_scope = 'VENDOR'
 AND owner_user.is_banned = FALSE
WHERE p.status = 'active'
  AND p.is_open = TRUE
```

**Finding [HIGH - PASS]:** Consumer visibility is consistently filtered through the same conditions across all consumer endpoints.

---

## 22. Synchronization Model

### 22.1 Current Approach

| Interface | Sync Method |
|-----------|-------------|
| Vendor stalls | `useStalls` hook: local state updates after mutations |
| Vendor menu items | `useMenuItems` hook: local state updates after mutations |
| Admin stalls | Direct API calls, no automatic refetch |
| Consumer | Fetch per search, no mutation |

**Finding [MEDIUM]:** Admin stall management does not refetch after mutations on the list page.

---

## 23. Onboarding Configuration

### 23.1 Schema

```sql
onboarding_config (
  id UUID PK,
  telegram_link TEXT,
  message TEXT,
  steps JSONB,
  safety_tips JSONB,
  footer TEXT,
  updated_at TIMESTAMPTZ
)
```

**Finding [HIGH]:** This is a **global singleton** configuration table. It does NOT contain per-vendor onboarding data.

**Finding [MEDIUM]:** No uniqueness constraint on `onboarding_config`. Multiple rows could theoretically exist.

---

## 24. Business Assistant Onboarding Limitation

**Finding [CRITICAL]:** The onboarding configuration is purely **instructional content**. It does NOT track:
- Per-vendor onboarding progress
- Vendor verification status
- Submission dates
- Reviewer assignment
- Approval/rejection workflow
- Document uploads
- Business Assistant assignments

### 24.2 Missing Schema

```sql
CREATE TABLE vendor_onboarding (
  id UUID PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_assistant_id UUID REFERENCES users(id),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE vendor_onboarding_steps (
  id UUID PRIMARY KEY,
  vendor_onboarding_id UUID REFERENCES vendor_onboarding(id),
  step_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE business_assistant_assignments (
  id UUID PRIMARY KEY,
  assistant_id UUID NOT NULL REFERENCES users(id),
  vendor_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(assistant_id, vendor_id)
);

CREATE TABLE onboarding_documents (
  id UUID PRIMARY KEY,
  vendor_onboarding_id UUID REFERENCES vendor_onboarding(id),
  document_type TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  object_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 25. Audit Logging

### 25.1 Current Logging

Audit logging is only performed for **admin/BA operations**. Vendor-side operations are NOT logged.

**Finding [MEDIUM]:** Vendor create/update/delete operations are not logged to `audit_log`.

---

## 26. Shared Validation

**Finding [MEDIUM]:** Validation is duplicated across `VendorModel.validateCreate()`, `AdminService.createStall()`, and `vendorController.validatePrice()`. These could be consolidated.

**Finding [LOW]:** `sanitizeText()` is used by vendor operations but not explicitly by admin operations.

---

## 27. Interface Layout Comparison

**Finding [LOW - PASS]:** The stall creation form (`StallCreatePage.tsx`) is shared between all roles.

**Finding [MEDIUM]:** `StallDetailPage.tsx` (vendor) and `AdminStallDetailPage.tsx` (admin/BA) are separate implementations with duplicated form logic.

---

## 28. Authorization Tests

**Finding [HIGH - PASS]:** Frontend `AuthGuard` prevents route access, and backend `rbacGuard` prevents API access. Both layers are present.

---

## 29. Database Integrity Risks

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | No constraint linking `users.role_scope` to `role` table | High | No FK, no CHECK |
| 2 | No Business Assistant assignment relation | High | Missing schema |
| 3 | No per-vendor onboarding data model | High | Only global config |
| 4 | No approval/suspension state for places | High | Only `active`/`closed` |
| 5 | No soft deletion for places or menu items | Medium | Physical deletion |
| 6 | `places.photo_url` vs `place_images` dual source | Medium | Both updated |
| 7 | `menu_items.image_url` vs `menu_item_images` dual source | Medium | Both updated |
| 8 | No single-primary-image constraint | Medium | App logic handles |
| 9 | No uniqueness constraint for place hours by day | Low | **FIXED** |
| 10 | No owner-match constraint between place and menu item | Medium | App logic checks |
| 11 | CASCADE on FKs | Low | Intentional |
| 12 | `is_open`/`status` ambiguity | Low | Synced by app |
| 13 | No `updated_at` on `menu_items` | Low | Missing trigger |
| 14 | No global menu item availability | Low | Schema limitation |
| 15 | No store-specific menu price | Low | Schema limitation |

---

## 30. Required Test Scenarios

| # | Scenario | Status |
|---|----------|--------|
| 1 | Vendor creates a place | PASS |
| 2 | Vendor creates a place with hours | PASS |
| 3 | Vendor uploads multiple images | PARTIAL (only primary tracked) |
| 4 | Vendor selects existing menu item | PASS |
| 5 | Vendor adds item to multiple places | PASS |
| 6 | Vendor links same item twice | PASS (PK prevents) |
| 7 | Vendor links another vendor's item | PASS (ownership check) |
| 8 | Vendor removes item from one place | PASS |
| 9 | Vendor deletes item linked to multiple places | NEEDS FIX (silent cascade) |
| 10 | Vendor deletes place with dependent rows | NEEDS FIX (silent cascade) |
| 11 | Admin edits vendor-owned place | PASS |
| 12 | Admin changes place ownership | PASS |
| 13 | BA creates/edits place | PASS (no assignment filtering) |
| 14 | BA attempts unauthorized delete | NEEDS FIX (currently allowed) |
| 15 | Vendor banned | PASS |
| 16 | Consumer views banned vendor's place | PASS |
| 17 | Place changed active to closed | PASS |
| 18 | is_open conflicts with status | PASS (prevented) |
| 19 | Vendor updates hours | PASS |
| 20 | Consumer sees updated hours | PASS |
| 21 | Vendor replaces image | NEEDS IMPROVEMENT (old not cleaned) |
| 22 | Consumer sees new primary image | PASS |
| 23 | Multiple primary images exist | NEEDS FIX (DB constraint missing) |
| 24 | Place category renamed | NEEDS FIX (consumer filter hardcoded) |
| 25 | Consumer category display updates | PASS |
| 26 | Admin edits onboarding config | PASS |
| 27 | Vendor sees updated onboarding | PASS |
| 28 | Concurrent vendor and admin edit | RISK (last-write-wins) |
| 29 | Invalid coordinates submitted | NEEDS FIX (defaults to Phnom Penh) |
| 30 | Failed storage upload | PASS (transaction rollback) |

---

## 31. Deliverables

### 31.1 Prioritized Implementation Plan

#### Phase 1: Critical Fixes

| # | Task | Files | Est. |
|---|------|-------|------|
| 1.1 | Add CHECK constraint on `users.role_scope` | Migration | 1h |
| 1.2 | Create `business_assistant_assignments` table | Migration | 2h |
| 1.3 | Create `vendor_onboarding` + steps tables | Migration | 4h |
| 1.4 | Add `approval_status` column to `places` | Migration + queries | 4h |
| 1.5 | Update BA queries to filter by assignments | adminRepository.js | 4h |

#### Phase 2: High Priority

| # | Task | Files | Est. |
|---|------|-------|------|
| 2.1 | Deprecate `places.photo_url` writes | VendorRepository, adminRepository | 2h |
| 2.2 | Deprecate `menu_items.image_url` writes | VendorRepository, adminRepository | 2h |
| 2.3 | Add primary image unique constraint | Migration | 1h |
| 2.4 | Consumer fetches categories from API | FilterPanel, appConfig | 2h |
| 2.5 | Add deletion impact warnings | StallDetailPage, AdminStallDetailPage, MenuItemsPage | 4h |
| 2.6 | Add `deleted_at` for soft deletion | Migration + queries | 4h |
| 2.7 | Validate category exists before delete | adminRepository | 1h |
| 2.8 | Add vendor audit logging | VendorService, VendorRepository | 4h |
| 2.9 | Validate coordinates in valid range | VendorModel, AdminService | 2h |

#### Phase 3: Medium Priority

| # | Task | Files | Est. |
|---|------|-------|------|
| 3.1 | Preserve menu item availability on update | VendorRepository, adminRepository | 2h |
| 3.2 | Clean up old Supabase Storage objects | storageImageMetadata.js | 3h |
| 3.3 | Add `updated_at` trigger for `menu_items` | Migration | 1h |
| 3.4 | Admin `updateMenuItem` ownership check | adminRepository.js | 2h |
| 3.5 | BA cannot delete places (only close) | adminRoutes.js | 1h |
| 3.6 | Menu item deletion shows link count | MenuItemsPage.tsx | 2h |
| 3.7 | Consolidate validation into shared utils | New module | 4h |
| 3.8 | Admin mutation refetching | AdminStallManagePage | 2h |
| 3.9 | Consumer categories endpoint | placesRoutes, PlaceRepository | 2h |
| 3.10 | Review count in delete confirmation | StallDetailPage, AdminStallDetailPage | 2h |

#### Phase 4: Low Priority

| # | Task | Files | Est. |
|---|------|-------|------|
| 4.1 | Extract shared form components | New components | 8h |
| 4.2 | Consumer count uses time-based hours | placesController.js | 1h |
| 4.3 | Supabase Realtime for consumer view | UserSearchPage | 4h |
| 4.4 | Unban restores place statuses | adminRepository | 2h |
| 4.5 | Reject invalid coordinates | VendorRepository, adminRepository | 1h |
| 4.6 | Admin sanitize text inputs | AdminService | 1h |

### 31.2 New Migration Files Required

| File | Purpose |
|------|---------|
| `2026-07-12-role-scope-constraint.sql` | CHECK constraint on `users.role_scope` |
| `2026-07-12-place-approval-status.sql` | `approval_status` column |
| `2026-07-12-soft-delete-places.sql` | `deleted_at` on places |
| `2026-07-12-primary-image-unique.sql` | Partial unique index for primary images |
| `2026-07-12-menu-items-updated-at.sql` | `updated_at` trigger for menu_items |
| `2026-07-12-ba-assignments.sql` | `business_assistant_assignments` table |
| `2026-07-12-vendor-onboarding.sql` | `vendor_onboarding` + steps tables |
| `2026-07-12-consumer-categories.sql` | Consumer categories endpoint |

### 31.3 Backend Files to Modify

| File | Changes |
|------|---------|
| `adminRepository.js` | BA filtering, ownership check, soft delete, category delete check |
| `VendorRepository.js` | Preserve availability, soft delete, coordinate validation |
| `PlaceRepository.js` | Filter soft-deleted, categories endpoint |
| `AdminService.js` | Audit logging, coordinate validation |
| `VendorService.js` | Audit logging, coordinate validation |
| `PlaceService.js` | Filter soft-deleted |
| `adminController.js` | BA delete restriction |
| `adminRoutes.js` | Restrict BA delete |
| `placesRoutes.js` | Categories endpoint |
| `storageImageMetadata.js` | Clean up old objects |
| `placeStatus.js` | Soft delete support |

### 31.4 Frontend Files to Modify

| File | Changes |
|------|---------|
| `appConfig.js` | Remove hardcoded CUISINE_OPTIONS |
| `categories.ts` | Fetch from API |
| `FilterPanel.tsx` | Fetch categories from API |
| `MenuItemsPage.tsx` | Link count in delete confirmation |
| `StallDetailPage.tsx` | Deletion impact warning |
| `AdminStallDetailPage.tsx` | Deletion impact warning, BA restriction |
| `AdminStallManagePage.tsx` | Refetch after mutations |
| `types/index.ts` | approval_status type |

### 31.5 Regression Tests

| # | Test |
|---|------|
| 1 | Vendor CRUD stall with all fields |
| 2 | Vendor stall with hours (7-day array) |
| 3 | Vendor image upload + primary image upsert |
| 4 | Vendor link existing menu item to stall |
| 5 | Vendor add same item to multiple places |
| 6 | Vendor link duplicate item (PK constraint) |
| 7 | Vendor link another vendor's item (blocked) |
| 8 | Vendor unlink item from one place |
| 9 | Vendor delete item linked to multiple places |
| 10 | Vendor delete place with dependencies |
| 11 | Admin edit vendor-owned place |
| 12 | Admin change place ownership |
| 13 | BA create/edit place (assignment filtered) |
| 14 | BA attempt unauthorized delete (blocked) |
| 15 | Vendor ban cascades to places |
| 16 | Consumer hidden from banned vendor |
| 17 | Place status lifecycle |
| 18 | is_open/status sync |
| 19 | Hours replace-all pattern |
| 20 | Consumer time-based open_now |
| 21 | Image replacement cleanup |
| 22 | Primary image uniqueness constraint |
| 23 | Category rename propagation |
| 24 | Onboarding config UPSERT |
| 25 | Concurrent edit handling |

---

*End of Audit Plan*
