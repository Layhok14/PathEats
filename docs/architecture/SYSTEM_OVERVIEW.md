# PathEats — System Overview

## Table of Contents

1. [Product Concept](#1-product-concept)
2. [Architecture Overview](#2-architecture-overview)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Schema](#5-database-schema)
6. [Security & Roles](#6-security--roles)
7. [Routing & Navigation (OSRM)](#7-routing--navigation-osrm)
8. [Development & Deployment](#8-development--deployment)
9. [Known Gaps & Future Work](#9-known-gaps--future-work)

---

## 1. Product Concept

PathEats is a route-aware food discovery platform for Phnom Penh. A consumer enters a start point and destination, and the system returns food vendors along that route sorted by a composite score (distance from route, price, rating, wait time). Users can filter, favorite, and review vendors. Vendors register and manage their stalls and menus. Admins oversee the platform; developers manage backups and system health.

---

## 2. Architecture Overview

Monorepo with two independent packages:

```
PathEats/
├── backend/         Express ESM + PostgreSQL + PostGIS
├── frontend/        React 18 + Vite 6 + Tailwind CSS 4
├── SYSTE_OVERVIEW.md
└── AGENTS.md        Agent-specific conventions
```

- **No monorepo tool** (Turborepo, Nx) — root is clean, each package manages itself.
- **Backend port**: 4000
- **Frontend port**: 5173 (dev server)
- **API prefix**: `/api`
- **API documentation**: Swagger UI at `/api-docs`

---

## 3. Frontend Architecture

### Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18.3 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | react-router 7 |
| Map | MapLibre GL JS 4 |
| Animations | motion (framer-motion successor) |
| Charts | recharts (admin dashboard) |
| Icons | lucide-react |
| HTTP | axios |
| UI primitives | @radix-ui (dialog, label, slot, switch) |
| Toasts | sonner |

### Route Domains

| Prefix | Domain | Auth |
|--------|--------|------|
| `/user/*` | Consumer experience | Optional (JWT) |
| `/vendor/*` | Vendor stall management | Vendor JWT |
| `/admin/*` | Global admin panel | GLOBAL_ADMIN JWT |
| `/customer-service/*` | CS moderation | CUSTOMER_SERVICE_ADMIN JWT |
| `/developer/*` | System ops | DEVELOPER_ADMIN JWT |
| `/` | Redirects to `/user` | — |

### Frontend Directory Layout

```
frontend/src/
├── app/              Root: App.tsx, layout components
├── user/             Consumer pages & components
│   ├── pages/        Full-page views (UserSearchPage, UserVendorDetailPage)
│   ├── components/   Reusable UI (RouteInputPanel, FilterPanel, VendorCard, VendorDetail, NavRail, etc.)
│   ├── hooks/        useMaplibreMap, useVendors, useReviews
│   └── routes/       Route definitions
├── vendor/           Vendor pages & components
│   ├── pages/        Stall management
│   ├── components/   Stall forms, photo upload, map view
│   └── routes/       Route definitions
├── admin/            Admin & CS panels
│   └── routes/       Route definitions (lazy-loaded pages)
├── shared/           Cross-domain code
│   ├── constants/    appConfig.js, vendorData.ts
│   ├── hooks/        useAuth, useTheme, useStalls, useMenuItems
│   ├── services/     axiosService, routeService
│   ├── utils/        geoUtils
│   └── types/        TypeScript type definitions
└── styles/           Global CSS
```

### Key User Flow

1. User lands on **RouteInputPanel** — enters origin/destination via autocomplete
2. Frontend calls OSRM routing service → gets polyline points
3. Map renders route, **useVendors** hook scores ALL_VENDORS (30 mock vendors) by:
   - `distToRouteM()` — perpendicular distance from vendor to route polyline
   - `calcScore()` — weighted composite of price_range, distance, rating, wait_time_est
4. **FilterPanel** lets user filter by cuisine, max price, open-now, name/menu search
5. User selects a vendor → **VendorDetail** slide-in with reviews, menu, hours
6. Users can save routes, favorite vendors, and review (mock data)

### Current State

- **All vendor data is mock** (30 vendors in `vendorData.ts` centered on Phnom Penh)
- **Reviews are mock** (in-memory store in `useReviews.tsx`)
- **Routing falls back** to straight-line interpolation when OSRM is unreachable
- **No real API integration** for vendor/stall/review data — endpoints exist but return stubs

---

## 4. Backend Architecture

### Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js (ESM) |
| Framework | Express 4 |
| Database | PostgreSQL + PostGIS |
| Auth | JWT (access + refresh) |
| Password | bcryptjs |
| Email | nodemailer (SMTP) |
| API docs | swagger-jsdoc + swagger-ui-express |
| ORM | None (raw SQL via pg) |

### Layered Pattern

```
Route (inline handler) → Service → Repository → DB (pg.Pool)
```

Each layer is a separate file. All imports use `.js` extension (ESM requirement).

### Directory Layout

```
backend/src/
├── server.js              Express app setup, middleware, routes
├── config/
│   └── db.js              pg.Pool wrapper (query, transaction, getClient)
├── routes/
│   ├── api.js             Mounts all sub-routers under /api
│   ├── authRoutes.js      Register, login, forgot-password, verify-otp, reset-password
│   ├── userRoutes.js       Consumer profile, favorites, history (WIP)
│   ├── vendorRoutes.js     Dashboard, stalls CRUD
│   ├── adminRoutes.js      User list, ban, role change, settings, audit (WIP)
│   ├── csRoutes.js         Customer service moderation (WIP)
│   └── devRoutes.js        System health, backups, logs, database stats (WIP)
├── middlewares/
│   ├── authMiddleware.js   JWT verification → req.user
│   ├── rbacGuard.js        restrictToRoles("GLOBAL_ADMIN", ...)
│   └── errorMiddleware.js  Global error handler + 404
├── services/
│   ├── AuthService.js       Auth logic (register, login, OTP, reset)
│   ├── VendorService.js     Vendor/business operations
│   ├── osrmService.js       OSRM routing client
│   └── emailService.js      Nodemailer wrapper
├── repositories/
│   ├── UserRepository.js    User CRUD
│   ├── VendorRepository.js  Stall/place CRUD
│   └── OtpRepository.js     OTP storage/validation
├── models/
│   └── vendorModel.js       Validation + serialization
├── db/
│   ├── seed-data.sql        Full schema DDL + all seed data
│   ├── roles.sql            PostgreSQL roles + GRANT permissions
│   ├── indexing.sql         All indexes
│   └── seed.js              Node script that runs seed-data.sql
├── swagger/
│   └── swagger.js           Swagger setup
└── utils/
    └── catchAsync.js        Async error wrapper
```

### API Endpoints

| Method | Path               | Auth               | Description                     |
|--------|--------------------|--------------------|---------------------------------|
| GET    | /api/health        | Public             | Health check                    |
| POST   | /api/auth/register | Public             | Register new user               |
| POST   | /api/auth/login    | Public             | Login                           |
| POST   | /api/auth/forgot-password | Public       | Request password reset          |
| POST   | /api/auth/verify-otp | Public          | Verify OTP                      |
| POST   | /api/auth/reset-password | Public        | Reset password                  |
| GET    | /api/user/profile  | CONSUMER           | Get own profile (WIP)           |
| PUT    | /api/user/profile  | CONSUMER           | Update profile (WIP)            |
| GET    | /api/user/favorites | CONSUMER          | List favorites (WIP)            |
| POST   | /api/user/favorites | CONSUMER          | Add favorite (WIP)              |
| GET    | /api/vendor/stalls | VENDOR             | List own stalls                 |
| POST   | /api/vendor/stalls | VENDOR             | Create stall                    |
| GET    | /api/admin/users   | GLOBAL_ADMIN       | List users (WIP)                |
| POST   | /api/admin/users/:id/ban | GLOBAL_ADMIN | Ban/unban user (WIP)            |
| GET    | /api/dev/backups   | DEVELOPER_ADMIN    | List backups (WIP)              |
| GET    | /api/dev/database  | DEVELOPER_ADMIN    | Database table stats (WIP)      |

### Response Envelope

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error description" }
```

---

## 5. Database Schema

### Platform

- **PostgreSQL** with **PostGIS** extension (GEOGRAPHY type for location queries)
- Connection via `pg.Pool` in `backend/src/config/db.js`
- `.env` at project root, `DATABASE_URL` connection string

### 12 Tables

| # | Table | Purpose | Key Columns |
|---|-------|---------|-------------|
| 1 | `users` | Auth + profile | role_scope CHECK (CONSUMER/VENDOR/GLOBAL_ADMIN/DEVELOPER_ADMIN), is_banned |
| 2 | `user_preferences` | Theme, search radius per user | UNIQUE user_id |
| 3 | `place_categories` | Vendor/stall type taxonomy | slug UNIQUE |
| 4 | `places` | Stalls + venues | GEOGRAPHY(POINT, 4326), owner_id FK, category_id FK, status CHECK, rating_avg, rating_count |
| 5 | `place_hours` | Operating hours (0-6 days) | UNIQUE(place_id, day_of_week) |
| 6 | `menu_items` | Menu items per stall | place_id FK, price DECIMAL, category CHECK |
| 7 | `routes` | Saved consumer routes | origin/dest/waypoints JSONB |
| 8 | `bookmarks` | Favorites | UNIQUE(user_id, place_id) |
| 9 | `search_history` | Consumer route searches | filters JSONB |
| 10 | `reviews` | Ratings + moderation + soft delete | rating 1-5, is_moderated, deleted_at |
| 11 | `place_images` | Image metadata (files live in Supabase Storage) | place_id FK, storage_path, display_order |

### Key Design Decisions

- **No orders table** — e-commerce/ordering was out of scope
- **No support_tickets** — customer service domain removed after scoping
- **No RLS/BYPASSRLS** — authorization handled entirely at the application layer (JWT → authMiddleware → restrictToRoles → pg.Pool)
- **`users.role_scope`** — hard CHECK on exactly 4 values; no FK to separate `roles` table (table removed)
- **`status` replaces `is_approved`** — places use a TEXT CHECK (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`) instead of a boolean
- **`rating_avg` / `rating_count`** — pre-computed aggregate columns on `places`; updated via `refresh_place_rating()` function instead of AVG() on every query
- **`reviews.deleted_at`** — soft delete support; rating aggregates filter `WHERE deleted_at IS NULL`
- **`place_hours` UNIQUE(place_id, day_of_week)** — one row per day per stall
- **`place_images` stores metadata only** — actual image files live in Supabase Storage; table stores `storage_path` and `display_order`
- **`reviews.user_id` ON DELETE SET NULL** — user can be deleted without losing review content
- **`places.owner_id` ON DELETE SET NULL** — vendor deleted without losing stall data
- **No `backups`, `backup_schedules`, `audit_logs`, `general_logs`, `roles` tables** — removed as unnecessary (backups use pg_dump/cron, audit is at application level)

### Indexing

- GIST index on `places.location` for spatial queries
- Indexes on all FK columns
- Composite indexes: `reviews(place_id, created_at DESC)`, `search_history(user_id, created_at DESC)`, `reviews(deleted_at)`
- 20 indexes total across all tables
- Partial index on `reviews(is_moderated)` for moderation queries

### Seed Data

The `seed.sql` script seeds:
- 4 place categories
- 50 vendors + 50 consumers + 1 global admin + 1 developer admin
- 100 venues (places) with hours, menu items, reviews, images

---

## 6. Security & Roles

### Authorization Model

Authentication and authorization are handled entirely at the application layer:

```
JWT → authMiddleware → restrictToRoles() → single pg.Pool → PostgreSQL
```

No PostgreSQL roles, RLS policies, BYPASSRLS, or database-level user hierarchy is implemented. The `roles.sql` file grants all privileges to `PUBLIC` — the application pool user has full CRUD access. All access control is enforced by:

1. **authMiddleware** — verifies JWT → attaches `req.user` (sub, role_scope, email)
2. **rbacGuard** — `restrictToRoles("GLOBAL_ADMIN")` checks `req.user.role_scope`
3. **Route separation** — each domain routes file gates with its own role check:
   - `/api/user/*` → CONSUMER
   - `/api/vendor/*` → VENDOR
   - `/api/admin/*` → GLOBAL_ADMIN
   - `/api/dev/*` → DEVELOPER_ADMIN
   - `/api/auth/*` → Public

This keeps the database simple and the security logic auditable in one place.

### Ban System

Users have `is_banned BOOLEAN` column. The auth middleware should reject banned users at login. Admin routes include `POST /admin/users/:id/ban`. Currently both exist in schema but are not wired in application code.

---

## 7. Routing & Navigation (OSRM)

- Route calculation uses **OSRM** (Open Source Routing Machine) public API
- Request: `GET https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}`
- Returns polyline coordinates rendered on the MapLibre map
- **Fallback**: when OSRM is unreachable, generates a straight-line interpolated route between origin and destination
- Vendor scoring uses `distToRouteM()` to calculate perpendicular distance from each vendor to the route polyline
- Currently no backend proxy — frontend calls OSRM directly via `routeService.js` (configured via `VITE_API_URL` but OSRM URL is hardcoded in `appConfig.js`)

---

## 8. Development & Deployment

### Environment

- `.env` at **project root** (loaded by both packages)
- Backend variables: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, SMTP config
- Frontend: `VITE_API_URL` (defaults to `http://localhost:4000/api`)

### Commands

```sh
# Backend
cd backend && npm run dev     # node --watch server.js (port 4000)
cd backend && npm run start   # node server.js
cd backend && npm run seed    # Run database seed

# Frontend
cd frontend && npm run dev    # Vite dev server (port 5173)
cd frontend && npm run build  # Vite production build
```

### Testing & Linting

- **No test framework installed** — no unit, integration, or E2E tests
- **No linter/formatter** — no ESLint, Prettier, or equivalent
- **No type checker** — `frontend/` uses TypeScript but only via Vite's transpilation (`tsc --noEmit` not available)
- `npm run build` on frontend is the only automated validation

### Deployment Considerations

- Backend requires PostgreSQL with PostGIS extension
- Frontend builds to static files (Vite output in `frontend/dist/`)
- SMTP credentials needed for password reset flow
- OSRM public API has rate limits — production should either self-host OSRM or use a paid routing API

---

## 9. Known Gaps & Future Work

### High Priority

- **Real API integration** — all vendor/stall/review/route data is currently mock. Backend endpoints exist but are stubs. The `useVendors` hook and `vendorService.js` both operate on hardcoded mock data. This is the single biggest gap.
- **Auth flow completion** — `UserSearchPage` calls real login/signup API, but token storage and role-based redirect are not fully wired.
- **Ban enforcement** — `is_banned` column exists but `authMiddleware` does not check it.
- **Admin route implementation** — all admin routes return stubs (`{ message: "implement" }`).
- **Vendor registration** — vendor signup endpoint exists in `useAuth.tsx` but backend route is not written.

### Medium Priority

- **Map performance** — `useMaplibreMap.tsx` is a monolithic hook dominating the frontend hook usage (7 useRef, 5 useEffect). Could benefit from splitting vendor markers and route rendering into separate concerns.
- **State management** — `UserSearchPage.tsx` has 25 useState calls, indicating it should be split or migrated to a lighter state pattern.
- **No test coverage** — no tests exist anywhere in the project.
- **No linting** — no ESLint, no Prettier. Code style is inconsistent across files.

### Low Priority / Already Scoped Out

- **No orders/support-tickets** — e-commerce was explicitly removed from scope.
- **Image upload endpoint** — `place_images` table and Supabase Storage schema exist, but the upload API endpoint is not implemented. Images are referenced by `storage_path` only.
