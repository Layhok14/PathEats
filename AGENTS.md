# PathEats — Agent Guide

## Project

Monorepo with two packages: `frontend/` (React 18 + Vite 6 + Tailwind CSS 4) and `backend/` (Express ESM + PostgreSQL). Root has no dependencies.

## Commands

```sh
# Frontend
npm run dev      # Vite dev server (port 5173)
npm run build    # Vite production build (only validation available — no lint/typecheck)

# Backend
npm run dev      # node --watch server.js (port 4000)
npm run start    # node server.js
npm run seed     # Run database seed script
```

There are no lint, typecheck, or test scripts. `npm run build` is the only automated validation.

## Architecture

**Backend** — Layered pattern: Route (inline handler) → Service → Repository → DB. Route handlers are defined directly in route files (no controller layer). All imports must include `.js` extension (ESM). Routes mounted at `/api` in `backend/src/routes/api.js`. Swagger UI at `/api-docs`. Response envelope: `{ success, data }` or `{ success, message }`.

**Frontend** — Domain-separated routes: `/user/*`, `/vendor/*`, `/admin/*`, `/developer/*`. Default redirect to `/user`. Shared code in `frontend/src/shared/` (constants, utils, hooks, services). `@/` path alias maps to `frontend/src/`. Dark mode only applies on `/user/*` routes (see `useTheme`).

**Data** — Currently mock. `ALL_VENDORS` (30 vendors) in `frontend/src/shared/constants/vendorData.ts`. The `useVendors` hook and `vendorService.js` both operate on mock data. Real API integration is TODO.

## Key backend files

| File | Role |
|------|------|
| `backend/app.js` | Server entry (listens on PORT 4000) |
| `backend/src/server.js` | Express app setup, middleware, routes |
| `backend/src/routes/api.js` | Mounts all sub-routers under `/api` |
| `backend/src/routes/authRoutes.js` | Auth endpoints: register, login, forgot-password, verify-otp, reset-password |
| `backend/src/routes/vendorRoutes.js` | Vendor endpoints: dashboard, stalls CRUD |
| `backend/src/config/db.js` | `pg.Pool` wrapper (query, transaction, getClient) |
| `backend/src/middlewares/authMiddleware.js` | JWT verification → `req.user` |
| `backend/src/middlewares/rbacGuard.js` | Role check: `restrictToRoles("CONSUMER")` |
| `backend/src/db/seed-data.sql` | Full schema DDL + seed data (15 tables) |
| `backend/src/db/roles.sql` | PostgreSQL roles + GRANT permissions |
| `backend/src/db/indexing.sql` | All indexes on all tables |

## Key frontend files

| File | Role |
|------|------|
| `frontend/src/app/App.tsx` | Root: BrowserRouter + AuthProvider + ThemeProvider + Routes |
| `frontend/src/shared/services/axiosService.ts` | Axios instance, auto-attaches JWT from `localStorage.patheat_user`, handles 401 |
| `frontend/src/shared/constants/appConfig.js` | PLACES, CUISINES, vendor range, OSRM URL, style URLs |
| `frontend/src/shared/constants/vendorData.ts` | 30 mock vendors with lat/lng, menu, hours |
| `frontend/src/shared/hooks/useAuth.tsx` | login/signup/vendorSignup call real API, token in localStorage |
| `frontend/src/shared/hooks/useTheme.tsx` | Light/dark, dark only on `/user/*` |
| `frontend/src/user/hooks/useMaplibreMap.tsx` | Maplibre map lifecycle, route polyline, vendor markers, edit mode |
| `frontend/src/user/hooks/useVendors.tsx` | Vendor scoring/filtering along route |

## Environment

- `.env` file at **project root**, loaded via `backend/src/config/db.js`
- Frontend: `VITE_API_URL` env var defaults to `http://localhost:4000/api`
- Backend: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` required
- See `backend/.env.example` for all variables

## Database schema (11 tables)

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `users` | Auth + profiles | role_scope CHECK (CONSUMER/VENDOR/GLOBAL_ADMIN/DEVELOPER_ADMIN) |
| `user_preferences` | Theme, radius per user | UNIQUE per user_id |
| `place_categories` | Stall type taxonomy | slug UNIQUE |
| `places` | Stalls + venues | GEOGRAPHY(POINT, 4326), owner_id, category_id, status CHECK, rating_avg, rating_count |
| `place_hours` | Operating hours | day_of_week 0-6, UNIQUE(place_id, day_of_week) |
| `menu_items` | Menu items per stall | place_id FK, price DECIMAL, category CHECK |
| `routes` | Saved consumer routes | origin/dest/waypoints as JSONB |
| `bookmarks` | Favorites | UNIQUE(user_id, place_id) |
| `search_history` | Consumer route searches | filters JSONB |
| `reviews` | Ratings + moderation + soft delete | rating 1-5, is_moderated, deleted_at |
| `place_images` | Image metadata (files in Supabase Storage) | place_id FK, storage_path, display_order |

## Gotchas

- **No tests exist** — do not look for test files
- **No TypeScript compiler** in devDependencies — Vite handles transpilation, no `tsc --noEmit` available
- **Many backend routes return stubs** — `userRoutes`, `adminRoutes`, `devRoutes` are scaffolding
- **`models/` folder** — only `vendorModel.js` is active (validation + serialization); `userModel.js` was empty and deleted
- **No controller layer** — controllers were collapsed into route files; route handlers call services directly
- **PostGIS required** — `places` table uses `GEOGRAPHY(POINT, 4326)`
- **Route fallback** — OSRM routing falls back to interpolated straight-line route when offline
- **Vendor data is mock only** — location data centers on Phnom Penh (~11.55–11.57, 104.91–104.92)
- **`patheat_user`** localStorage key holds serialized user with `token`; cleared on 401
- **Map markers** use an in-memory marker pool (ID-based diffing) — markers are updated in-place instead of destroyed/recreated; event listeners on route-line are cleaned up on every route change to prevent leaks
- **No RLS, BYPASSRLS, or role hierarchy** — authorization is application-layer only (JWT → middleware → pg.Pool).
- **`places.status` replaces `is_approved`** — uses TEXT CHECK (PENDING/APPROVED/REJECTED/SUSPENDED).
- **`places.rating_avg` / `rating_count`** — pre-computed, updated via `refresh_place_rating()`.
- **`reviews.deleted_at`** — soft delete; rating aggregates filter `WHERE deleted_at IS NULL`.
- **Place images store paths only** — actual files live in Supabase Storage.
- **Backup tables removed** — backups use `pg_dump` + cron + Supabase built-in features.
- **`roles`, `audit_logs`, `general_logs` tables removed** — unused.
- **No `orders` or `support_tickets` tables** — `VendorRepository.getOrderStats()` was removed. CS domain is eliminated (no more `/customer-service/*` routes).
