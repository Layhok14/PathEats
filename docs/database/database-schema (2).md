# PathEats Unified Database Schema

> A single, normalized schema that consolidates the old `Database_Relationship_Documentation.md` and `supabase-connection.md` schemas.

---

## Design Principles

| Principle | How It's Achieved |
|-----------|-------------------|
| **Single user model** | One `users` table with `role_scope` instead of separate `user_info`/`seller_info` |
| **Pluggable business types** | `place_categories` table + generic `places` table — add new categories without DDL |
| **Unified support** | One `support_tickets` table replaces 4 separate ticket/request tables |
| **Unified search history** | One `search_history` table for all user types, differentiated by `user_id` |
| **Consistent naming** | All tables plural, PK always `id`, FKs always `{table}_id`, timestamps always `created_at`/`updated_at` |
| **Normalized hours** | `place_hours` as a separate table enables "open now" queries without parsing text |
| **Composite scores stored** | `places.rating` caches the computed average from `reviews` |

---

## Entity Relationship Diagram

```
place_categories (1) ──── (n) places ──────── (n) menu_items
                                  │
users (1) ──── (1) user_preferences           │
   │                                          │
   ├── (n) routes                             │
   ├── (n) bookmarks ─────────────────────────┘
   ├── (n) search_history
   ├── (n) reviews ───────────────────────────┘
   ├── (n) support_tickets
   └── (n) audit_logs (as actor)
```

---

## 1. users

Replaces `user_info` + `seller_info` (old DB doc) and `users` (Supabase schema).

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  role_scope TEXT NOT NULL DEFAULT 'CONSUMER'
    CHECK (role_scope IN (
      'CONSUMER', 'VENDOR', 'GLOBAL_ADMIN',
      'CUSTOMER_SERVICE_ADMIN', 'DEVELOPER_ADMIN'
    )),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_scope);
```

| Column | Purpose | Old Equivalent |
|--------|---------|---------------|
| `id` | UUID PK | `user_info.user_id` / `seller_info.seller_id` |
| `email` | Login identifier, unique | `user_info.user_email` / `seller_info.seller_email` |
| `password_hash` | bcrypt hash | `user_info.password` / `seller_info.password` |
| `first_name`, `last_name` | Split name | `user_info.username` (was single field) |
| `role_scope` | RBAC role (5 roles) | ❌ Missing in old DB doc |
| `is_banned` | Ban flag for admin | ❌ Missing in old DB doc |

---

## 2. user_preferences

Replaces `app_info` (old DB doc). Keeps user-level app settings.

```sql
CREATE TABLE user_preferences (
  up_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_radius INT DEFAULT 100,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

- 1-to-1 with `users` (enforced by `UNIQUE` on `user_id`)
- `is_active` replaces `login_status` — tracks whether the user wants to be findable/active
- `search_radius` in meters (default 100, min 10, max 500 — frontend range slider)

---

## 3. place_categories

**New table** — enables adding future business types without schema changes.

```sql
CREATE TABLE place_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO place_categories (slug, name, description) VALUES
  ('restaurant', 'Restaurant', 'Food vendors and eateries'),
  ('cafe', 'Cafe', 'Coffee shops and beverage spots'),
  ('library', 'Library', 'Study spaces and libraries'),
  ('study_space', 'Study Space', 'Co-working and study areas');
```

To add a new business type later (e.g., `pharmacy`, `bookstore`), just insert a row — no schema migration needed.

---

## 4. places

Replaces `place_info` (old DB doc) + `vendors` (Supabase schema). Single table for all location-based entities.

```sql
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES place_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  address TEXT, 
  photo_url TEXT,
  price_range INT CHECK (price_range BETWEEN 1 AND 4),  -- NULL for non-food
  rating REAL DEFAULT 0,
  is_open BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'pending', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_places_location ON places USING GIST (location::geography);
CREATE INDEX idx_places_category ON places(category_id);
CREATE INDEX idx_places_owner ON places(owner_id);
CREATE INDEX idx_places_status ON places(status);
CREATE INDEX idx_places_category_status ON places(category_id, status)
  WHERE status = 'active';
```

| Column | Purpose | Old Equivalent |
|--------|---------|---------------|
| `owner_id` | Vendor who owns/claims this place | `place_info.seller_id` |
| `category_id` | FK to `place_categories` | `place_info.restaurant_type` (was rigid ENUM) |
| `location` | PostGIS geography point | `place_info.restaurant_geom` |
| `price_range` | 1-4 ($ signs), nullable | `place_info.price_range` |
| `rating` | Cached avg from `reviews` | ❌ Computed per-query before |
| `avg_wait_time` | Minutes, nullable | `vendors.wait_time_est` (Supabase) |
| `is_open` | Open/closed toggle | `vendors.open_now` (Supabase) |
| `is_approved` | Admin approval flag | `vendors.is_approved` (Supabase) |
| `status` | Lifecycle: active/inactive/pending/closed | ❌ New |

**Why nullable `price_range` and `avg_wait_time`?** A library or study space doesn't have prices or wait times. Nullable fields keep the schema clean without separate tables per business type.

---

## 5. place_hours

**New table** — normalized operating hours enables "Open Now" queries via SQL instead of parsing text.

```sql
CREATE TABLE place_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  UNIQUE(place_id, day_of_week)
);

CREATE INDEX idx_place_hours_place ON place_hours(place_id);
```

**"Open Now" query:**
```sql
SELECT p.* FROM places p
JOIN place_hours h ON h.place_id = p.id
WHERE h.day_of_week = EXTRACT(DOW FROM NOW())
  AND h.is_closed = FALSE
  AND NOW()::TIME BETWEEN h.opens_at AND h.closes_at
  AND p.is_open = TRUE
  AND p.status = 'active';
```

---

## 6. menu_items

Replaces `menu_item_info` (old DB doc) + `menu_items` (Supabase schema). Only relevant for food-related places.

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'snacks' CHECK (category IN ('drinks', 'appetizer', 'main course', 'dessert', 'snacks')),
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_place ON menu_items(place_id);
CREATE INDEX idx_menu_items_category ON menu_items(place_id, category);
```

- Dropped `user_history_id` FK (old DB doc) — a menu item belongs to a place, not to a search session
- Dropped rigid ENUM (`drinks, appetizer, main course, dessert`) — now free text matching frontend's 5 categories
- `category` values frontend uses: `drinks`, `appetizer`, `main course`, `Snacks`

## 7. routes

Replaces `saved_routes` (old DB doc). Renamed for brevity.

```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  waypoints JSONB,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_routes_user ON routes(user_id);
```

- Changed `geom` (old DB doc) → `origin`/`destination`/`waypoints` as JSONB, matching what the frontend and OSRM API actually use
- `waypoints` enables multi-stop routes (future feature)

---

## 8. bookmarks

Replaces `bookmarked_place` (old DB doc). The frontend calls this "Favorites."

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
```

- Added `notes` field so users can annotate bookmarks
- `UNIQUE(user_id, place_id)` prevents duplicate bookmarks
- Dropped `b_place_geom` (old DB doc) — the place's location is already in `places.location`

---

## 9. search_history

Replaces both `user_search_history` + `seller_search_history` (old DB doc). Since all users are in one table, one search history table is sufficient.

```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB,
  results_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
```

- `filters` as JSONB captures the filter state at search time (cuisine, price range, open now toggle) — enables "replay search" feature
- Dropped FK links from `place_info`/`menu_item_info` (old DB doc) — search history is a log, not a join path

---

## 10. reviews

Replaces `reviews` from both old schemas. Mostly unchanged, with additions.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_place ON reviews(place_id, created_at DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```

- Added `is_moderated` for CS moderation (from Supabase schema — was missing in old DB doc)
- CASCADE on `place_id` delete, SET NULL on `user_id` delete (preserves review content even if user deletes account)

---

## 11. support_tickets

Replaces `user_support_questions`, `vendor_support_questions`, `vendor_onboard_request`, and `tickets` (Supabase schema) — all unified into one table with a `ticket_type` discriminator.

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  place_id UUID REFERENCES places(id),
  ticket_type TEXT NOT NULL
    CHECK (ticket_type IN ('question', 'complaint', 'onboarding', 'technical', 'other')),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_assigned ON support_tickets(assigned_to);
```

| Old Table | New Representation |
|-----------|-------------------|
| `user_support_questions` | `support_tickets` WHERE `ticket_type = 'question'` |
| `vendor_support_questions` | `support_tickets` WHERE `ticket_type = 'question'` |
| `vendor_onboard_request` | `support_tickets` WHERE `ticket_type = 'onboarding'` |
| `tickets` (Supabase) | `support_tickets` with any ticket_type + `assigned_to` |

---

## 12. support_tips

Renamed from `user_support_tips` (old DB doc). Now applies to all users.

```sql
CREATE TABLE support_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 13. audit_logs

From Supabase schema. No equivalent in old DB doc.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

---

## Update Trigger (for all mutable tables)

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_places_updated_at BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_support_tips_updated_at BEFORE UPDATE ON support_tips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Table Summary

| # | Table | Role | Old Sources |
|---|-------|------|-------------|
| 1 | `users` | Core auth + identity | `user_info` + `seller_info` (old doc) + `users` (Supabase) |
| 2 | `user_preferences` | Per-user app settings | `app_info` (old doc) |
| 3 | `place_categories` | **New** — extensible business types | — |
| 4 | `places` | All locations (food + future) | `place_info` (old doc) + `vendors` (Supabase) |
| 5 | `place_hours` | **New** — normalized hours | Embedded in `vendors.hours` (Supabase, text) |
| 6 | `menu_items` | Food menu items | `menu_item_info` (old doc) + `menu_items` (Supabase) |
| 7 | `routes` | Saved user routes | `saved_routes` (old doc) |
| 8 | `bookmarks` | Favorites/bookmarks | `bookmarked_place` (old doc) |
| 9 | `search_history` | Search logs (all roles) | `user_search_history` + `seller_search_history` (old doc) |
| 10 | `reviews` | Place reviews | `reviews` (both sources) |
| 11 | `support_tickets` | Unified support | `user_support_questions` + `vendor_support_questions` + `vendor_onboard_request` (old doc) + `tickets` (Supabase) |
| 12 | `support_tips` | Help content | `user_support_tips` (old doc) |
| 13 | `audit_logs` | Admin audit trail | `audit_logs` (Supabase) |

---

## Comparison: New Schema vs. Old Files

### What was removed (and why)

| Removed Table | Reason |
|---------------|--------|
| `user_info` | Merged into `users` — no need for split user tables |
| `seller_info` | Merged into `users` — `role_scope` differentiates roles |
| `app_info` | Renamed to `user_preferences` — more descriptive |
| `place_info` | Merged into `places` + `place_categories` |
| `bookmarked_place` | Renamed to `bookmarks` — cleaner |
| `saved_routes` | Renamed to `routes` — shorter |
| `user_search_history` | Merged into `search_history` with `user_id` discriminator |
| `seller_search_history` | Merged into `search_history` |
| `user_support_questions` | Merged into `support_tickets` with `ticket_type` |
| `vendor_support_questions` | Merged into `support_tickets` |
| `vendor_onboard_request` | Merged into `support_tickets` |
| `user_support_tips` | Renamed to `support_tips` |
| `menu_item_info` | Renamed to `menu_items` |
| `vendors` (Supabase) | Merged into `places` + `place_categories` |
| `tickets` (Supabase) | Merged into `support_tickets` |

### What was added (new)

| New Concept | Benefit |
|-------------|---------|
| `place_categories` | Add libraries, study spaces, cafes without DDL |
| `place_hours` | Query "open now" programmatically |
| `users.is_banned` | Admin ban feature was impossible before |
| `users.role_scope` | RBAC with 5 roles (was missing in old DB doc) |
| `places.rating` | Cached avg rating avoids expensive per-query computation |
| `places.status` | Place lifecycle: active → inactive → closed |
| `reviews.is_moderated` | CS moderation flag |
| `audit_logs` | Full audit trail for admin actions |
| `search_history.filters` | JSONB captures filter state for replay |

### What was improved

| Issue in Old Docs | Fix in New Schema |
|-------------------|-------------------|
| Rigid ENUMs (5 cuisine types, 4 menu categories) | Free-text fields + `place_categories` join table |
| `username` as single field | Split into `first_name`/`last_name` (matching frontend forms) |
| `geom` for routes (not practical) | JSONB `origin`/`destination`/`waypoints` (matching OSRM) |
| No `updated_at` anywhere | All mutable tables have `updated_at` via trigger |
| Inconsistent FK delete rules (some unspecified) | All FKs have explicit `ON DELETE CASCADE`/`SET NULL` |
| `user_history_id` in place/menu tables (over-engineered) | Removed — search history is a log, not a join dependency |
| Mixed naming (`user_info.user_id` vs `user_info.user_email`) | Every table: PK = `id`, FK = `{table}_id`, timestamps = `created_at`/`updated_at` |
| 22 tables between two conflicting docs | 14 tables in one authoritative schema |
