# Frontend Completion Guide

## Current State

**Real API integration exists only for auth and vendor stall CRUD.** Everything else — consumer vendor search, reviews, menu items, dashboard stats, all admin/developer pages — operates on client-side mock data with no persistence.

## Domain Architecture

```
App.tsx
  → AuthProvider (useAuth context — real API)
  → ThemeProvider (useTheme context — CSS tokens)
  → BrowserRouter
    → /user/*  → UserSearchPage (main consumer app)
    → /vendor/* → VendorLayout + 10 pages
    → /admin/* → AdminMainLayout + 5 pages
    → /developer/* → DeveloperLayout + 4 pages
  → Toaster (sonner notifications)
```

### Styling Strategy by Domain

| Domain | Method | Dark Mode |
|--------|--------|-----------|
| User (`/user/*`) | Theme context + inline styles | ✅ yes, via `useTheme` tokens |
| Vendor | CSS variables (`var(--brand-)`) + hardcoded | ❌ no |
| Admin/Dev | Hardcoded hex colors | ❌ no |

---

## Consumer Domain (`/user/*`)

### Pages & Flow

```
UserSearchPage.tsx (main consumer page)
  ├── NavRail — tab navigation (route, favorites, history, settings, profile)
  ├── RouteInputPanel — origin/dest input → Find Path → calls routeService
  ├── FilterPanel — cuisine, price, open-now, search, range slider
  ├── FavoritesPanel — saved vendors (in-memory Set, lost on reload)
  ├── HistoryPanel — recent route searches (in-memory, lost on reload)
  ├── Search results strip — scored vendor cards
  ├── VendorDetail — full vendor info + menu + reviews (slide-in panel)
  ├── UserProfileModal — view/edit profile (fake save)
  ├── AuthModal — login/signup tabs (real API)
  └── Map (useMaplibreMap) — route line + vendor markers

UserVendorDetailPage.tsx (direct link)
  └── VendorDetail — same component, reads vendorId from URL
```

### Data Flow

```
UserSearchPage state (all local useState):
  originPlace / destPlace → routeService.getRoute() → routePoints
  routePoints → useVendors → scoredVendors (by distance, cuisine, price, open, search)
  scoredVendors → useMaplibreMap → map markers
  selectedVendor → VendorDetail → useReviews → review list + submit
  favorites: Set<id> — in-memory only
  searchHistory: array — in-memory only
```

### Hooks

| Hook | What it does | API vs Mock |
|------|-------------|-------------|
| `useVendors` | Filters 30 mock vendors by distance/price/cuisine/search/open, scores and sorts | 🟡 Mock — operates on `ALL_VENDORS` |
| `useMaplibreMap` | Creates Maplibre GL map, draws route polyline, places vendor markers | ✅ Real (but marker data comes from mock) |
| `useReviews` | In-memory review store (4 seed reviews), submit adds to array | 🟡 Mock — no persistence |
| `useAuth` | Login/signup via POST `/api/auth/*` | ✅ Real API |

### Services

| Service | What it does | API vs Mock |
|---------|-------------|-------------|
| `routeService.js` | Calls OSRM public API, fallback to interpolated route | ✅ Real API (third-party) |
| `vendorService.js` | Duplicates `useVendors` filter/score logic — used only for `getVendorById` | 🟡 Mock |
| `reviewService.js` | In-memory review array with concurrency guard | 🟡 Mock |

### What's Lacking

#### 1. Vendor search — replace mock with real API

**Current:** `useVendors.tsx` filters `ALL_VENDORS` (30 hardcoded objects) by criteria.

**Needed:** Backend `/api/vendors/search` endpoint + frontend switch from mock to API.

```ts
// frontend/src/user/hooks/useVendors.tsx — replace mock filter with API call

import { useState, useEffect } from "react";
import api from "../../shared/services/axiosService";

export function useVendors({ routePoints, vendorRange, filterCuisine, filterMaxPrice, filterOpenNow, vendorSearch }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!routePoints || routePoints.length < 2) {
      setVendors([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    api.post("/vendors/search", {
      route: routePoints.map(p => ({ lat: p[0], lng: p[1] })),
      range: vendorRange,
      cuisine: filterCuisine !== "All" ? filterCuisine : undefined,
      maxPrice: filterMaxPrice,
      openNow: filterOpenNow || undefined,
      search: vendorSearch || undefined,
    }).then(({ data }) => {
      if (!cancelled) setVendors(data.data);
    }).catch(() => {
      if (!cancelled) setVendors([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [routePoints, vendorRange, filterCuisine, filterMaxPrice, filterOpenNow, vendorSearch]);

  return vendors;
}
```

#### 2. Favorites — persist to backend

**Current:** `favorites: Set<id>` in UserSearchPage — lost on reload.

**Needed:** Use POST/GET/DELETE `/api/user/favorites` and hydrate on mount.

```ts
// example: in UserSearchPage.tsx

const [favorites, setFavorites] = useState(new Set());

// Load on mount
useEffect(() => {
  if (!isLoggedIn) return;
  api.get("/user/favorites").then(({ data }) => {
    setFavorites(new Set(data.data.map(f => f.id)));
  });
}, [isLoggedIn]);

// Toggle with persistence
async function toggleFavorite(id) {
  if (favorites.has(id)) {
    await api.delete(`/user/favorites/${id}`);
    setFavorites(prev => { const n = new Set(prev); n.delete(id); return n; });
  } else {
    await api.post("/user/favorites", { placeId: id });
    setFavorites(prev => new Set(prev).add(id));
  }
}
```

#### 3. Search history — persist to backend or localStorage

**Current:** In-memory array, lost on reload.

**Minimal fix (no backend needed):** Write to localStorage.

```ts
// In UserSearchPage.tsx, replace handleFindRoute history push:

const entry = { id: Date.now(), origin, dest, originPlace, destPlace, searchedAt };
setSearchHistory(prev => {
  const next = [entry, ...prev.filter(s => !(s.origin === entry.origin && s.dest === entry.dest))].slice(0, 50);
  localStorage.setItem("patheat_search_history", JSON.stringify(next));
  return next;
});

// On mount:
useEffect(() => {
  const saved = localStorage.getItem("patheat_search_history");
  if (saved) setSearchHistory(JSON.parse(saved));
}, []);
```

#### 4. User profile modal — real save

**Current:** `UserProfileModal.tsx` — fake save button with 2-second timer, static form, no API call.

**Needed:** Call `PUT /api/user/profile` with actual form data.

```tsx
// In UserProfileModal.tsx — replace fake save handler

async function handleSave() {
  setSaving(true);
  try {
    await api.put("/user/profile", { firstName, lastName, phone });
    toast.success("Profile updated");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update");
    setSaving(false);
  }
}
```

#### 5. Reviews — real API

**Current:** In-memory array in `reviewService.js`. 4 seed reviews.

**Needed:** Backend `/api/vendors/:id/reviews` endpoint + frontend switch.

#### 6. Unused `vendorService.js` — clean up

`vendorService.js` duplicates the filter/score logic in `useVendors.tsx`. Only `getVendorById` is actually used.

**Fix:** Inline the `getVendorById` function or import from `vendorData.ts` directly:

```ts
// In UserVendorDetailPage.tsx — current import
// import { getVendorById } from "../services/vendorService";

// Replace with direct lookup:
import { ALL_VENDORS } from "../../shared/constants/vendorData";
const vendor = ALL_VENDORS.find(v => v.id === id);
```

---

## Vendor Domain (`/vendor/*`)

### Pages

| Page | Path | State |
|------|------|-------|
| DashboardPage | `/vendor` | 🟡 Hardcoded stats + chart |
| StallListPage | `/vendor/stalls` | ✅ Real API via `useStalls` |
| StallCreatePage | `/vendor/stalls/new` | ✅ Real API via `useStalls` |
| StallDetailPage | `/vendor/stalls/:id` | ✅ Real API via `useStalls` |
| StallViewPage | `/vendor/stalls/:id/view` | 🟡 Real data but read-only |
| LocationPinpointPage | `/vendor/stalls/:id/location` | 🟡 Map, but no save API |
| MenuItemsPage | `/vendor/menu` | 🟡 Mock — `useMenuItems`, no API |
| ReviewsPage | `/vendor/reviews` | 🟡 Hardcoded reviews array |
| SupportPage | `/vendor/support` | 🟡 Local state only, no API |
| SettingsPage | `/vendor/settings` | 🟡 Local state only, no API |

### What's Lacking

#### 1. Menu items CRUD — needs backend

**Current:** `useMenuItems.ts` — 7 hardcoded items in an `INITIAL` array, all mutations lost on reload.

**Needed:** `menu_items` table + `/api/vendor/menu-items` CRUD endpoints + frontend switch.

```ts
// frontend/src/shared/hooks/useMenuItems.ts — replace mock with API

import { useState, useEffect } from "react";
import api from "../services/axiosService";

export function useMenuItems(stallId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stallId) return;
    setLoading(true);
    api.get(`/vendor/stalls/${stallId}/menu`)
      .then(({ data }) => setItems(data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [stallId]);

  async function addItem(item) {
    const { data } = await api.post(`/vendor/menu-items`, { ...item, stallId });
    setItems(prev => [...prev, data.data]);
  }

  async function updateItem(id, updates) {
    const { data } = await api.put(`/vendor/menu-items/${id}`, updates);
    setItems(prev => prev.map(i => i.id === id ? data.data : i));
  }

  async function removeItem(id) {
    await api.delete(`/vendor/menu-items/${id}`);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return { items, loading, addItem, updateItem, removeItem };
}
```

#### 2. Dashboard — real metrics

**Current:** `DashboardPage.tsx` — hardcoded $12,430 sales, 342 orders, etc.

**Needed:** The backend `GET /api/vendor/dashboard` already returns real metrics. Wire it:

```tsx
// In DashboardPage.tsx — add data fetching

import { useState, useEffect } from "react";
import api from "../../shared/services/axiosService";

function DashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    api.get("/vendor/dashboard").then(({ data }) => setMetrics(data.data));
  }, []);

  // Replace hardcoded numbers with:
  // metrics?.total_stalls, metrics?.open_stalls, metrics?.avg_rating
}
```

#### 3. Reviews — real data

**Current:** `ReviewsPage.tsx` — `ALL_REVIEWS` hardcoded array with 8 reviews.

**Needed:** Call `GET /api/vendor/feed` (stub) or `GET /api/vendor/reviews`.

#### 4. Settings + Support — persist forms

**Current:** Local state only, no save to API.

**Minimal fix:** Since there's no backend for vendor profile/settings yet, at minimum persist to localStorage. Or build the backend endpoints.

#### 5. Unused `stallService.ts`

`vendor/services/stallService.ts` is a complete mock CRUD with in-memory `db` array. It is **never imported**. The app uses `useStalls` from shared hooks which calls the real API. Delete the file.

---

## Admin & Developer Domains

### Current State

All pages render static mock data from `adminData.ts`:

| Page | Data Source |
|------|-------------|
| Admin Dashboard | `MOCK_USERS` (10), `GROWTH_DATA` (7 days), `MOCK_SYSTEM_ACTIVITY` (4 items) |
| User Management | `MOCK_USERS` (10 rows) |
| Restaurant Management | `MOCK_PENDING_RESTAURANTS` (4), `MOCK_ACTIVE_RESTAURANTS` (8) |
| System Settings | All local state, no persistence |
| Dev Dashboard | Hardcoded uptime 99.97%, API response 124ms |
| Database Management | Hardcoded table list (6 tables) |
| Error Logs | `ALL_ERROR_LOGS` (6 entries) |
| Backup Recovery | 4 hardcoded backups |

### What's Lacking

Everything needs backend endpoints. See `backend-guide.md` for the corresponding API stubs. Priority order:

1. **GET /api/admin/users** — replace `MOCK_USERS` with real DB data
2. **GET /api/admin/vendors** + **POST /api/admin/vendors/:id/approve** — replace restaurant lists
3. **GET /api/admin/telemetry** — replace dashboard metrics
4. **GET /api/dev/database** — replace DB stats
6. **GET /api/dev/health** — add real DB check

### Example: Connecting Admin Users to API

```tsx
// In UserManagementPage.tsx — replace MOCK_USERS import with API call

import { useState, useEffect } from "react";
import api from "../../shared/services/axiosService";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/users", { params: { page, limit: 20 } })
      .then(({ data }) => {
        setUsers(data.data.users);
        setTotal(data.data.total);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page]);

  // Render with real data instead of mock
  // Paginate with total/page from API
}
```

---

## Cross-Cutting Concerns

### Persistence Strategy

| Data | Current | Recommended |
|------|---------|-------------|
| Auth token | localStorage.patheat_user | ✅ Keep |
| User profile | In-memory | API `GET/PUT /api/user/profile` |
| Favorites | In-memory Set | API `GET/POST/DELETE /api/user/favorites` |
| Search history | In-memory array | localStorage `patheat_search_history` |
| Saved routes | In-memory array | localStorage or API |
| Reviews | In-memory array | API |
| Menu items | In-memory array | API `CRUD /api/vendor/menu-items` |
| Cart/orders | None yet | Future |

### Priority Order for Completion

1. **Favorites persistence** (localStorage or API) — user-facing, minimal effort
2. **Search history persistence** (localStorage) — user-facing, one-liner
3. **Dashboard real metrics** — backend already has the endpoint, frontend just needs to call it
4. **Menu items API** — needs backend + frontend, core vendor feature
5. **User profile API** — needs backend + frontend
6. **Admin/Dev API integration** — each page replaces mock data with API calls
7. **Reviews API** — needs backend + frontend

### File Cleanup

Delete unused file:
- `frontend/src/vendor/services/stallService.ts` — mock CRUD, never imported
