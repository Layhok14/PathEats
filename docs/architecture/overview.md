# PathEats — System Architecture Overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + TypeScript |
| Bundler | Vite 6 (esbuild transpilation — no `tsc`) |
| Styling | Tailwind CSS 4 + CSS custom properties + inline styles |
| Map | Maplibre GL JS 4 (vector tiles from MapTiler) |
| Charts | Lucide icons + MetricCard components (no charting library used) |
| Backend runtime | Node.js + Express 4 (ESM, `"type": "module"`) |
| Database | PostgreSQL + PostGIS (via `pg` driver) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer (SMTP) |
| API docs | Swagger via swagger-jsdoc + swagger-ui-express |

## Repository Structure

```
patheat/
├── backend/           # Express API server (port 4000)
│   ├── app.js         # Server entry — listens on PORT
│   └── src/
│       ├── server.js  # Express app setup (middleware stack + routes)
│       ├── config/    # Database pool
│       ├── middlewares/ # Auth, RBAC, error handling
│       ├── routes/    # Route handlers (no controller layer)
│       ├── services/  # Business logic
│       ├── repositories/ # Database queries
│       ├── models/    # Validation + serialization
│       ├── db/        # SQL schema files + seed script
│       ├── swagger/   # Swagger UI setup
│       └── utils/     # AppError, catchAsync
├── frontend/          # React SPA (port 5173)
│   ├── index.html
│   ├── index.css      # Tailwind entry + shadcn fallback
│   └── src/
│       ├── main.tsx   # DOM entry
│       ├── app/       # App.tsx root with providers + routes
│       ├── shared/    # Reusable code across domains
│       ├── user/      # Consumer domain
│       ├── vendor/    # Vendor domain
│       └── admin/     # Admin, Developer domains
└── docs/              # Documentation
    └── architecture/  # Architecture docs (this directory)
```

## Data Flow

```
┌──────────────┐     HTTP/JSON      ┌──────────────────────┐
│   Frontend   │ ◄─────────────────► │   Backend (Express)  │
│  (React SPA) │     JWT in header  │   localhost:4000     │
└──────┬───────┘                    └──────────┬───────────┘
       │                                       │
       │ Route (OSRM public API)               │ pg.Pool
       ▼                                       ▼
┌──────────────┐                    ┌──────────────────────┐
│ OSRM Server  │                    │  PostgreSQL + PostGIS│
│ router.osrm  │                    │  (Supabase or local) │
└──────────────┘                    └──────────────────────┘
```

### Request Lifecycle (Backend)

```
HTTP Request
  → cors + express.json
  → [authMiddleware]  (JWT verify → req.user)
  → [restrictToRoles] (check req.user.role_scope)
  → Route Handler     (async, wrapped in catchAsync)
      → Service method (business logic)
          → Repository method (SQL via db.query / db.transaction)
              → PostgreSQL
          ← Row(s)
      ← Result
  → Response JSON  ({ success, data } or { success, message })
  → [errorHandler]  (if any error thrown)
```

### Request Lifecycle (Frontend — User Domain)

```
UserSearchPage
  → useVendors (real API: POST /places/search)
  → useMaplibreMap (creates map, draws route + markers)
  → routeService.getRoute() (calls OSRM API or falls back to interpolation)
  → useAuth (login/signup via real API /api/auth/*)
  → useReviews (real API: GET/POST /places/:id/reviews)
```

## Authentication Flow

```
Login → POST /api/auth/login
  → AuthService.login(email, password)
    → UserRepository.findByEmailWithPassword(email)
    → bcrypt.compare(password, hash)
    → jwt.sign({ sub: userId, email, role_scope }, JWT_ACCESS_SECRET, { expiresIn })
  ← { success, data: { user, token } }

Frontend stores token in localStorage.patheat_user
  → axiosService interceptor attaches Authorization: Bearer <token>
  → 401 response → clear localStorage → redirect to /user
```

## File-by-File Reference

### Backend Key Files

| File | Role | Status |
|------|------|--------|
| `backend/app.js` | Server entry (port 4000) | ✅ |
| `backend/src/server.js` | Express app, middleware stack, route mounts | ✅ |
| `backend/src/config/db.js` | `pg.Pool` wrapper (query, transaction, getClient) | ✅ |
| `backend/src/middlewares/authMiddleware.js` | JWT → `req.user` | ✅ |
| `backend/src/middlewares/rbacGuard.js` | `restrictToRoles(...)` | ✅ |
| `backend/src/middlewares/errorMiddleware.js` | Global error handler + 404 | ✅ |
| `backend/src/routes/api.js` | Mounts all sub-routers at `/api` | ✅ |
| `backend/src/routes/authRoutes.js` | 5 endpoints — login, register, forgot-pwd, verify-otp, reset-pwd | ✅ |
| `backend/src/routes/vendorRoutes.js` | 4 endpoints — dashboard, stalls CRUD | ✅ |
| `backend/src/routes/userRoutes.js` | 7 endpoints — consumer profile, bookmarks, saved routes, search history | ✅ |
| `backend/src/routes/adminRoutes.js` | ~40 endpoints — user/vendor/stall/role CRUD, audit, telemetry, moderation, onboarding | ✅ |
| `backend/src/routes/devRoutes.js` | ~25 endpoints — health, DB stats, query runner, backups, recovery, logs | ✅ |
| `backend/src/services/AuthService.js` | Auth logic (register, login, OTP, password reset) | ✅ |
| `backend/src/services/VendorService.js` | Stall CRUD + dashboard | ✅ |
| `backend/src/services/emailService.js` | Send OTP via SMTP | ✅ |
| `backend/src/services/osrmService.js` | OSRM API client with 5-min cache | ✅ (unused by routes) |
| `backend/src/repositories/UserRepository.js` | User DB queries | ✅ |
| `backend/src/repositories/VendorRepository.js` | Stall DB queries (has `update` but no route/service calls it) | ✅ |
| `backend/src/repositories/OtpRepository.js` | OTP store/verify/invalidate | ✅ |
| `backend/src/models/vendorModel.js` | Stall validation + serialization | ✅ |
| `backend/src/utils/AppError.js` | Custom error class | ✅ |
| `backend/src/utils/catchAsync.js` | Async handler wrapper | ✅ |
| `backend/db/seed-data.sql` | Full DDL + seed data | ✅ |

### Frontend Key Files

| File | Role | Status |
|------|------|--------|
| `App.tsx` | Root: providers + routes | ✅ |
| `shared/services/axiosService.ts` | Axios instance with JWT interceptor | ✅ |
| `shared/services/routeService.ts` | OSRM client + fallback interpolated route | ✅ |
| `shared/hooks/useAuth.tsx` | Auth context + real API calls | ✅ |
| `shared/hooks/useTheme.tsx` | Dark/light theme context | ✅ |
| `shared/hooks/useStalls.ts` | Vendor stall CRUD (real API) | ✅ |
| `shared/hooks/useMenuItems.ts` | Menu items CRUD (real API) | ✅ |
| `user/hooks/useVendors.tsx` | Vendor filter + score (real API: POST /places/search) | ✅ |
| `user/hooks/useMaplibreMap.tsx` | Map lifecycle + markers + route | ✅ |
| `user/hooks/useReviews.tsx` | Reviews CRUD (real API) | ✅ |
| `user/services/vendorService.js` | Fetches vendor by ID (/places/:id) | ✅ |
| `user/services/reviewService.js` | Review CRUD service | ✅ |

## Database Schema

### Tables (from `seed-data.sql`)

- **users** — id, email, password_hash, first_name, last_name, phone_number, role_scope, is_banned, created_at, updated_at
- **otps** — id, email, otp_code, type, expires_at, is_used, created_at
- **place_categories** — id, slug, name
- **places** — id, owner_id, category_id, name, description, address, photo_url, price_range, location (GEOGRAPHY), status, is_open, is_approved, rating, created_at, updated_at
- **reviews** — id, place_id, user_id, rating, text, created_at

## Code Conventions

- Backend: ESM only — all imports include `.js` extension
- Backend: Response envelope `{ success: true/false, data? }` or `{ success: true/false, message? }`
- Backend: Route handlers are async, wrapped with `catchAsync`
- Frontend: `@/` path alias → `frontend/src/`
- Frontend: Domain directories own their routes, pages, hooks, components, services
- Frontend: No global state manager — state lives in page components
