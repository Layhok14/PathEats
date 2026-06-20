# PathEats — PostgreSQL Features Guide

How the application uses built-in PostgreSQL functionality.

---

## PostGIS

PostGIS enables location-aware queries for finding vendors along a route.

### ST_DWithin

Filter vendors within a given radius of a route or point:

```sql
SELECT *
FROM places
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(104.9282, 11.5564), 4326)::geography,
  2000  -- meters
);
```

Used in vendor scoring — find stalls within the user's configured range.

### ST_Distance

Calculate exact distance between a vendor and a point:

```sql
SELECT ST_Distance(
  location,
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
) AS distance_m
FROM places;
```

### GIST Index

`places.location` uses a GIST (Generalized Search Tree) index for efficient spatial queries:

```sql
CREATE INDEX idx_places_location ON places USING GIST (location);
```

Without this, every `ST_DWithin` query would require a full table scan.

---

## JSONB

Two tables use JSONB for flexible, schema-less data:

| Table | Column | Purpose |
|-------|--------|---------|
| `routes` | `origin` | Start point (lat/lng/name) |
| `routes` | `destination` | End point (lat/lng/name) |
| `routes` | `waypoints` | Intermediate route points (optional) |
| `search_history` | `filters` | Saved filter state (cuisine, price, range) |

JSONB is chosen over separate columns because:
- Route waypoints have variable length
- Filter payload structure depends on which filters are active
- No need to query inside these JSONB structures (filters are read back as-is)

---

## Constraints

### CHECK

Used for enum-like validation at the database level:

```sql
-- User roles (no separate roles table needed)
CHECK (role_scope IN ('CONSUMER', 'VENDOR', 'GLOBAL_ADMIN', 'DEVELOPER_ADMIN'))

-- Place moderation status
CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'))

-- Rating bounds
CHECK (rating BETWEEN 1 AND 5)

-- Menu item categories
CHECK (category IN ('drinks', 'appetizer', 'main course', 'dessert', 'snacks'))

-- Operating hours
CHECK (day_of_week BETWEEN 0 AND 6)

-- Price range
CHECK (price_range BETWEEN 1 AND 4)
```

### UNIQUE

```sql
-- One preferences row per user
UNIQUE (user_id)

-- One hours entry per day per stall
UNIQUE (place_id, day_of_week)

-- One bookmark per user per place
UNIQUE (user_id, place_id)

-- Unique email login
UNIQUE (email)

-- Category slugs for URL-safe identifiers
UNIQUE (slug)
```

### FOREIGN KEY

```sql
ON DELETE CASCADE  — user deleted → preferences, routes, bookmarks, search_history removed
ON DELETE CASCADE  — place deleted → hours, menu items, reviews, images removed
ON DELETE SET NULL — review user deleted → review stays (user_id becomes null)
ON DELETE SET NULL — place owner deleted → place stays (owner_id becomes null)
ON DELETE RESTRICT — category can't be deleted if places reference it
```

---

## Transactions

Used for multi-step operations that must succeed or fail together.

### Via `db.transaction()`

```javascript
await db.transaction(async (client) => {
  await client.query("INSERT INTO users ...");
  await client.query("INSERT INTO user_preferences ...");
});
```

### Use cases

- User registration (create user + preferences in one unit)
- Seed script (creates all test data atomically)
- Creating a stall with hours and menu items (future)

---

## Aggregates

### Pre-computed rating columns

`places` has `rating_avg` and `rating_count` columns updated by a dedicated function:

```sql
CREATE OR REPLACE FUNCTION refresh_place_rating(p_place_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE places
  SET rating_avg = COALESCE(
    (SELECT ROUND(AVG(rating)::numeric, 2)
     FROM reviews WHERE place_id = p_place_id AND deleted_at IS NULL),
    0
  ),
  rating_count = COALESCE(
    (SELECT COUNT(*)::integer
     FROM reviews WHERE place_id = p_place_id AND deleted_at IS NULL),
    0
  )
  WHERE id = p_place_id;
END;
$$ LANGUAGE plpgsql;
```

Called when reviews are created, updated, or soft-deleted instead of computing `AVG()` on every request.

### Dashboard metrics

```sql
SELECT
  COUNT(*)::int AS total_stalls,
  COUNT(*) FILTER (WHERE status = 'active' AND is_open = TRUE)::int AS open_stalls,
  COALESCE(AVG(rating_avg), 0)::float AS avg_rating
FROM places
WHERE owner_id = $1;
```

---

## Full Text Search (Future)

When search needs to support

```sql
-- Add a tsvector column
ALTER TABLE places ADD COLUMN search_vector tsvector;

-- Populate with weighted fields
UPDATE places SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B');

-- Create GIN index
CREATE INDEX idx_places_search ON places USING GIN(search_vector);

-- Query with ranking
SELECT name, ts_rank(search_vector, query) AS rank
FROM places, to_tsquery('english', 'chicken & rice') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

Not implemented yet — search currently uses client-side filtering on 30 mock vendors.

---

## Views (Future)

Example — popular vendors view:

```sql
CREATE VIEW popular_vendors AS
SELECT
  p.id,
  p.name,
  p.rating_avg,
  p.rating_count,
  COUNT(b.id) AS bookmark_count
FROM places p
LEFT JOIN bookmarks b ON b.place_id = p.id
WHERE p.status = 'APPROVED'
GROUP BY p.id
ORDER BY bookmark_count DESC;
```

---

## Materialized Views (Future)

For admin analytics that don't need real-time freshness:

```sql
CREATE MATERIALIZED VIEW admin_daily_metrics AS
SELECT
  date_trunc('day', created_at) AS day,
  count(*) FILTER (WHERE role_scope = 'CONSUMER') AS new_consumers,
  count(*) FILTER (WHERE role_scope = 'VENDOR') AS new_vendors
FROM users
GROUP BY day
ORDER BY day DESC;
```

Refresh on a schedule or on-demand, not on every page load.

---

## Extensions

| Extension | Purpose |
|-----------|---------|
| `postgis` | Spatial data types and queries for vendor location |

`pg_stat_statements` was removed — not needed at current scale.

---

## Intentionally NOT Implemented

| Feature | Why omitted |
|---------|-------------|
| **RLS (Row-Level Security)** | Authorization is at the application layer (JWT + middleware). RLS adds complexity without benefit for a single-pool architecture. |
| **Triggers (other than updated_at)** | Business logic lives in application services, not the database. The `refresh_place_rating` function is called explicitly, not via trigger, to avoid surprising side effects. |
| **Stored procedures** | Application code is easier to version, test, and debug. |
| **pgAudit** | Not needed at current scale. Audit is done via application logging. |
| **Table partitioning** | None of the tables approach partitioning scale (all < 1M rows). |
| **Role hierarchy / BYPASSRLS** | Removed. A single application pool user with full GRANTs is simpler. Route-level RBAC is the sole gate. |

These features become relevant if the application grows significantly in scale or compliance requirements.
