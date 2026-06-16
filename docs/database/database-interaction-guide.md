# PathEats Database Interaction Guide

> **Who this is for**: Backend developers writing repositories, services, and controllers.  
> **Who this is NOT for**: Frontend developers — frontend talks to the backend API, never directly to the database (except Supabase real-time subscriptions and storage — see section 6).

---

## Architecture Layer Rules

```
Request
  → Route (validates params, RBAC middleware)
    → Controller (extracts req/res, calls service, sends response)
      → Service (business logic, calls repo, throws AppError)
        → Repository (ONLY layer with Supabase queries)
          → PostgreSQL + PostGIS
```

| Layer | Can call Supabase? | Can call Axios? |
|-------|-------------------|-----------------|
| Repository | **Yes** — only layer | No |
| Service | No | **Yes** — for external APIs (OSRM, payments) |
| Controller | No | No |
| Route | No | No |

---

## 1. Repository Pattern (How to Query)

Every repository extends `BaseRepository` and is the **only** code that touches Supabase. Below are query patterns for every table.

### BaseRepository.js

```javascript
// src/repositories/BaseRepository.js
import supabase from "../config/db.js";

class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
    this.supabase = supabase;
  }

  async findAll() {
    const { data, error } = await this.supabase.from(this.table).select("*");
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
    return data;
  }

  async create(data) {
    const { data: result, error } = await this.supabase
      .from(this.table)
      .insert([{ ...data }])
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async update(id, updates) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.supabase.from(this.table).delete().eq("id", id);
    if (error) throw error;
  }
}

export default BaseRepository;
```

---

## 2. Feature-by-Feature Query Patterns

### 2.1 Authentication (AuthService → UserRepository)

```javascript
// UserRepository.js
class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  }
}

// AuthService.js — called during register
// 1. Check if email exists: await userRepo.findByEmail(email)
// 2. bcrypt.hash(password, 12)
// 3. await userRepo.create({ email, password_hash, first_name, last_name })
// 4. sign JWT: { sub: user.id, email, role_scope, iat, exp }
```

**Key tables**: `users`

---

### 2.2 Search & Map (UserService → PlaceRepository)

This is the most performance-critical query. Uses PostGIS spatial index.

```javascript
// PlaceRepository.js
class PlaceRepository extends BaseRepository {
  constructor() {
    super("places");
  }

  // Core spatial search: find active places near a route corridor
  async spatialSearch({ routePoints, radiusMeters, categories, maxPrice, openNow }) {
    let query = this.supabase
      .from("places")
      .select(`
        id, name, description, location, address, photo_url,
        price_range, rating, avg_wait_time, is_open, is_approved,
        category_id,
        menu_items (id, name, price, category, is_available)
      `)
      .eq("status", "active")
      .eq("is_approved", true)
      .limit(50);

    // Spatial filter: ST_DWithin on route corridor
    if (routePoints) {
      // PostGIS: find places within radius of any route point
      // Uses the GIST index on places.location
      const routeLine = this.#pointsToLineString(routePoints);
      query = query.filter(
        "location",
        "st_dwithin",
        { type: "Point", coordinates: [] }, // placeholder
        radiusMeters
      );
      // NOTE: Supabase JS client has limited PostGIS support.
      // For production, use a raw SQL RPC instead:
      // await supabase.rpc("find_places_along_route", { route_json, radius_meters, ... })
    }

    // Category filter (supports future types: library, study_space, etc.)
    if (categories && categories.length > 0) {
      query = query.in("category_id", categories);
    }

    // Price filter (only applies to places with price_range set)
    if (maxPrice) {
      query = query.lte("price_range", maxPrice);
    }

    // Open now filter (requires join to place_hours)
    if (openNow) {
      // See "Open Now" query in section 2.4 below
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  #pointsToLineString(points) {
    // Convert [{lat, lng}, ...] to PostGIS compatible format
    return {
      type: "LineString",
      coordinates: points.map(p => [p.lng, p.lat]),
    };
  }
}
```

**For production**, create a Supabase SQL function (`find_places_along_route`) to run the real PostGIS query:

```sql
CREATE OR REPLACE FUNCTION find_places_along_route(
  route_geojson JSONB,
  radius_meters INT DEFAULT 100,
  category_ids UUID[] DEFAULT NULL,
  max_price INT DEFAULT NULL,
  open_now_only BOOLEAN DEFAULT FALSE
) RETURNS TABLE (
  id UUID, name TEXT, description TEXT, address TEXT,
  photo_url TEXT, price_range INT, rating REAL, avg_wait_time INT,
  is_open BOOLEAN, category_id UUID, distance_meters FLOAT,
  lng DOUBLE PRECISION, lat DOUBLE PRECISION
) LANGUAGE SQL STABLE AS $$
  SELECT
    p.id, p.name, p.description, p.address,
    p.photo_url, p.price_range, p.rating, p.avg_wait_time,
    p.is_open, p.category_id,
    ST_Distance(p.location::geography, ST_GeomFromGeoJSON(route_geojson)::geography) AS distance_meters,
    ST_X(p.location::geometry) AS lng,
    ST_Y(p.location::geometry) AS lat
  FROM places p
  WHERE p.status = 'active'
    AND p.is_approved = TRUE
    AND ST_DWithin(
      p.location::geography,
      ST_GeomFromGeoJSON(route_geojson)::geography,
      radius_meters
    )
    AND (category_ids IS NULL OR p.category_id = ANY(category_ids))
    AND (max_price IS NULL OR p.price_range <= max_price)
    AND (open_now_only = FALSE OR EXISTS (
      SELECT 1 FROM place_hours h
      WHERE h.place_id = p.id
        AND h.day_of_week = EXTRACT(DOW FROM NOW())
        AND h.is_closed = FALSE
        AND NOW()::TIME BETWEEN h.opens_at AND h.closes_at
    ))
  ORDER BY distance_meters ASC
  LIMIT 50;
$$;
```

Call from repository:
```javascript
const { data, error } = await supabase.rpc("find_places_along_route", {
  route_geojson: { type: "LineString", coordinates: points.map(p => [p.lng, p.lat]) },
  radius_meters: 100,
  category_ids: ["uuid-of-restaurant", "uuid-of-library"],
  max_price: 3,
  open_now_only: true,
});
```

**Key tables**: `places`, `place_hours`, `place_categories`, `menu_items`

---

### 2.3 Routing (VendorService → OSRM + PlaceRepository)

Route computation is done via **OSRM** (external API via Axios in Service layer), then places are looked up via the spatial query above.

```
User submits origin/destination
  → VendorService calls OSRM: GET /route/v1/driving/{lng},{lat};{lng},{lat}
  → OSRM returns route geometry + distance + duration
  → VendorService calls PlaceRepository.spatialSearch(routePoints, filters)
  → Return route + places along it to frontend
```

---

### 2.4 Open Now Check (without parsing text)

```javascript
// PlaceRepository.js
async findOpenPlaces() {
  const { data, error } = await this.supabase
    .from("places")
    .select(`
      *,
      place_hours!inner(*)
    `)
    .eq("is_open", true)
    .eq("status", "active")
    .eq("place_hours.day_of_week", new Date().getDay())
    .eq("place_hours.is_closed", false)
    .gte("place_hours.opens_at", new Date().toTimeString().slice(0, 8))
    .lte("place_hours.closes_at", new Date().toTimeString().slice(0, 8));
  if (error) throw error;
  return data;
}
```

**Key tables**: `place_hours` (joined with `places`)

---

### 2.5 Bookmarks / Favorites (UserService → BookmarkRepository)

```javascript
// BookmarkRepository.js
class BookmarkRepository extends BaseRepository {
  constructor() {
    super("bookmarks");
  }

  async findByUser(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        id,
        created_at,
        notes,
        place:place_id (id, name, description, photo_url, price_range, rating, is_open)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  async toggle(userId, placeId) {
    // Check if exists
    const existing = await this.supabase
      .from(this.table)
      .select("id")
      .eq("user_id", userId)
      .eq("place_id", placeId)
      .single();

    if (existing.data) {
      // Remove
      await this.delete(existing.data.id);
      return { bookmarked: false };
    } else {
      // Add
      await this.create({ user_id: userId, place_id: placeId });
      return { bookmarked: true };
    }
  }
}
```

**Key tables**: `bookmarks`, `places`

---

### 2.6 Routes (saving & loading)

```javascript
// RouteRepository.js
class RouteRepository extends BaseRepository {
  constructor() {
    super("routes");
  }

  async findByUser(userId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order("saved_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  async save(userId, { label, origin, destination, waypoints }) {
    return this.create({
      user_id: userId,
      label: label || null,
      origin,
      destination,
      waypoints: waypoints || null,
    });
  }
}
```

**Key tables**: `routes`

---

### 2.7 Search History (logging & retrieval)

```javascript
// SearchHistoryRepository.js
class SearchHistoryRepository extends BaseRepository {
  constructor() {
    super("search_history");
  }

  async log(userId, { query, filters, resultsCount }) {
    return this.create({
      user_id: userId,
      query,
      filters: filters || null,
      results_count: resultsCount || 0,
    });
  }

  async getRecent(userId, limit = 5) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  }

  async clearForUser(userId) {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq("user_id", userId);
    if (error) throw error;
  }
}
```

**Key tables**: `search_history`

---

### 2.8 Reviews (reading & writing)

```javascript
// ReviewRepository.js
class ReviewRepository extends BaseRepository {
  constructor() {
    super("reviews");
  }

  async findByPlace(placeId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        id, rating, body, created_at,
        user:user_id (id, first_name, last_name)
      `)
      .eq("place_id", placeId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  async getRatingSummary(placeId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("rating")
      .eq("place_id", placeId);
    if (error) throw error;

    const total = data.length;
    if (total === 0) return { average: 0, count: 0, distribution: {} };

    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(r => distribution[r.rating]++);

    return {
      average: Math.round((sum / total) * 10) / 10,
      count: total,
      distribution,
    };
  }

  async createAndUpdatePlaceRating(reviewData) {
    // Insert review
    const review = await this.create(reviewData);

    // Recalculate and cache place rating
    const summary = await this.getRatingSummary(reviewData.place_id);
    await this.supabase
      .from("places")
      .update({ rating: summary.average })
      .eq("id", reviewData.place_id);

    return review;
  }
}
```

**Key tables**: `reviews`, `places` (for cached rating)

---

### 2.9 Order Management (VendorService → OrderRepository)

```javascript
// OrderRepository.js
class OrderRepository extends BaseRepository {
  constructor() {
    super("orders");
  }

  async findByPlace(placeId, status) {
    let query = this.supabase
      .from(this.table)
      .select(`
        *,
        user:user_id (id, first_name, last_name, phone)
      `)
      .eq("place_id", placeId)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateStatus(orderId, status) {
    return this.update(orderId, { status });
  }
}
```

**Key tables**: `orders`, `users`

---

### 2.10 Support Tickets (CsService → TicketRepository)

```javascript
// TicketRepository.js
class TicketRepository extends BaseRepository {
  constructor() {
    super("support_tickets");
  }

  async list({ status, priority, ticketType, page = 1, limit = 20 }) {
    let query = this.supabase
      .from(this.table)
      .select(`
        *,
        user:user_id (id, first_name, last_name, email),
        assignee:assigned_to (id, first_name, last_name)
      `)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    if (ticketType) query = query.eq("ticket_type", ticketType);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async assign(ticketId, userId) {
    return this.update(ticketId, { assigned_to: userId, status: "in_progress" });
  }

  async resolve(ticketId) {
    return this.update(ticketId, {
      status: "resolved",
      resolved_at: new Date().toISOString(),
    });
  }
}
```

**Key tables**: `support_tickets`, `users`

---

### 2.11 Admin Dashboard Metrics (AdminService)

```javascript
// AdminRepository.js (or inline in AdminService)
async getDashboardMetrics() {
  const { data: userCount } = await supabase
    .from("users").select("id", { count: "exact", head: true });

  const { data: placeCount } = await supabase
    .from("places").select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { data: openTickets } = await supabase
    .from("support_tickets").select("id", { count: "exact", head: true })
    .eq("status", "open");

  const { data: orderCount } = await supabase
    .from("orders").select("id", { count: "exact", head: true });

  return {
    total_users: userCount.count,
    active_places: placeCount.count,
    open_tickets: openTickets.count,
    total_orders: orderCount.count,
  };
}
```

---

### 2.12 Vendor Management (menu CRUD)

```javascript
// MenuItemRepository.js
class MenuItemRepository extends BaseRepository {
  constructor() {
    super("menu_items");
  }

  async findByPlace(placeId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("place_id", placeId)
      .order("category", { ascending: true });
    if (error) throw error;
    return data;
  }
}
```

**Key tables**: `menu_items`, `places`

---

### 2.13 Audit Logging

Every admin action should log to audit_logs:

```javascript
// AdminService.js
async banUser(adminId, userId) {
  // 1. Update user
  await this.userRepo.update(userId, { is_banned: true });

  // 2. Log
  await this.auditRepo.create({
    actor_id: adminId,
    action: "BAN_USER",
    target_type: "users",
    target_id: userId,
    details: { reason: "violated TOS" },
  });
}
```

---

## 3. Adding a New Business Type (e.g., Library)

No schema changes needed. Steps:

### 3.1 Insert a new category

```sql
INSERT INTO place_categories (slug, name, description)
VALUES ('library', 'Library', 'Study spaces and libraries');
```

### 3.2 Create a library listing

```javascript
await placeRepo.create({
  name: "Royal University Library",
  category_id: libraryCategoryId,
  description: "Quiet study space with free WiFi",
  location: { type: "Point", coordinates: [104.9282, 11.5564] },
  address: "Russian Federation Blvd, Phnom Penh",
  is_open: true,
  is_approved: true,
  status: "active",
  // price_range and avg_wait_time are NULL — library doesn't need them
});
```

### 3.3 Frontend filters automatically work

The existing cuisine chips become category chips once you set `category_id`. The frontend already has `FilterPanel` — just map `place_categories` to filter chips instead of hardcoded cuisine strings.

### 3.4 Spatial search already works

The `find_places_along_route` PostGIS function filters by `category_id` — pass the library's UUID and it returns libraries on the route. No code changes.

### 3.5 Bookmarks, reviews, routes all work

Users can bookmark a library, review it, and save routes to it — all tables use `places.id` generically.

---

## 4. Notes on Old DB Doc Features That Changed

| Old Pattern | What Happened | Why |
|-------------|---------------|-----|
| `user_history_id` FK in `place_info` | **Removed** | A place doesn't belong to a search session. Search history is a log only. |
| `user_history_id` FK in `menu_item_info` | **Removed** | Menu items belong to a place, not to a search. |
| `seller_history_id` FK in `place_info` | **Removed** | Same reason — history is a log, not a relationship. |
| `place_info` ENUM cuisine types | **Replaced** by `place_categories` | ENUMs can't scale. New cuisines/types = new row, not ALTER TYPE. |
| `menu_item_info.menu_category` ENUM (4 types) | **Replaced** by free text | Frontend uses 6 categories. Free text allows more without migrations. |
| `app_info.login_status` | **Replaced** by `user_preferences.is_active` | More descriptive. Login status is implicit from JWT expiry. |
| Single `username` field | **Split** to `first_name`/`last_name` | Matches frontend forms and Supabase schema. |
| `saved_routes.geom` | **Replaced** by JSONB fields | OSRM API returns JSON coordinates, not WKT geometry. |

---

## 5. Performance Rules

| Rule | Reason |
|------|--------|
| Always use `LIMIT` with PostGIS queries | Free-tier Supabase has limited memory |
| Always use `ST_DWithin` with indexed geography column | Enables index scan instead of full table scan |
| Always use `count: "exact", head: true` for counts | Supabase counts without this are expensive |
| Use `select("id").limit(1)` when you only need existence check | Faster than `select("*")` |
| Cache OSRM route results for 5 minutes | OSRM is rate-limited and routes don't change frequently |
| Use `BETWEEN` with index on `place_hours.day_of_week` | "Open Now" is a frequent query pattern |
| Cache `place_categories` in application memory | Almost never changes, queried on every page load |
| Avoid `SELECT *` in joins — name only the columns you need | Reduces payload size and parse time |

---

## 6. Frontend Direct Supabase Access (Limited)

These are the **only** operations the frontend should do directly against Supabase:

| Operation | Method | Why Frontend |
|-----------|--------|--------------|
| Real-time vendor location | `supabase.channel("places").on("postgres_changes", ...)` | Low-latency push |
| Image uploads | `supabase.storage.from("place-photos").upload(...)` | Large binaries don't need backend proxy |
| Public static read (categories) | `supabase.from("place_categories").select("*")` | Read-only, cached, no auth needed |

**Everything else** (CRUD, spatial search, auth-required reads) goes through the backend API.

---

## 7. Quick Reference: Table Access Patterns

| Table | Create | Read | Update | Delete | Primary Access Pattern |
|-------|--------|------|--------|--------|----------------------|
| `users` | Auth register | Auth/Self | Self/Admin | Admin soft-delete | `findByEmail`, self-profile |
| `user_preferences` | On user register | Self | Self | On user delete | `findByUserId` (1-to-1) |
| `place_categories` | Via seed/migration | Any (cached) | Rare | Never | `select *` → cache in app |
| `places` | Vendor | All | Vendor/Admin | Admin | Spatial search, `findByOwner` |
| `place_hours` | Vendor | All | Vendor | Vendor | Join with places for "open now" |
| `menu_items` | Vendor | All | Vendor | Vendor | `findByPlace(placeId)` |
| `routes` | User | Self (list) | User | User | `findByUser(userId)` |
| `bookmarks` | User | Self (list) | User | User | `findByUser(userId)`, toggle |
| `search_history` | User | Self (recent) | Never | User (clear) | `findByUser(userId, limit=5)` |
| `reviews` | User (auth) | All | User (own) | User (own)/Admin | `findByPlace(placeId)` |
| `orders` | User (checkout) | Vendor/User | Vendor (status) | Never | `findByPlace(placeId, status?)` |
| `support_tickets` | User/Vendor | CS/Admin | CS/Admin | Never | `list(status, priority, type)` |
| `support_tips` | Dev | All | Dev | Dev | `select * where is_published` |
| `audit_logs` | Backend | Admin/Dev | Never | Dev (purge) | `findByActor` or `findByAction` |
