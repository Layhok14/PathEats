# Agent Approach — PathEats Backend

This document describes how an AI agent should approach, understand, and contribute to this codebase. Follow these conventions to match the existing style and architecture.

## Project Identity

- **Name:** PathEats Backend
- **Stack:** Node.js (ESM) + Express + PostgreSQL (with PostGIS) + JWT auth
- **Purpose:** API backend for a food discovery / route-planning app (places, menus, reviews, directions)
- **Status:** Pre-production — many routes return placeholder responses, models are stubs

## Architecture

Strict **Controller → Service → Repository → Database** layered architecture:

```
Request → Route → Middlewares (auth, RBAC) → Controller → Service → Repository → Database
```

| Layer     | Responsibility                                              | File Location     |
|-----------|-------------------------------------------------------------|-------------------|
| Route     | HTTP method + path, middleware chain, Swagger JSDoc         | `routes/*.js`     |
| Controller| Validate input, call service, send response                 | `controllers/*.js`|
| Service   | Business logic, throw `AppError`, call repository           | `services/*.js`   |
| Repository| Database queries (extends `BaseRepository`)                 | `repositories/*.js`|
| Config/DB | Singleton PostgreSQL pool, transaction helper               | `config/db.js`    |

## Coding Conventions

### Module System
- **ESM only** — `import`/`export` syntax, `"type": "module"` in package.json
- **Always include `.js` extensions** in import paths: `import db from "../config/db.js"`

### Naming
| What                | Style            | Examples                              |
|---------------------|------------------|---------------------------------------|
| Files               | `kebab-case.js`  | `authMiddleware.js`, `osrmService.js` |
| Classes             | `PascalCase`     | `AuthService`, `BaseRepository`       |
| Functions/variables | `camelCase`      | `register`, `restrictToRoles`         |
| Constants           | `UPPER_SNAKE_CASE`| `JWT_SECRET`, `CACHE_TTL`            |
| DB columns          | `snake_case`     | `role_scope`, `password_hash`         |

### Export Patterns
- **Default export** for classes, router instances, and db: `export default class AuthService`
- **Named export** for utility functions and controller handlers: `export const register = ...`
- Router always: `const router = Router(); ... ; export default router`

### Route Patterns
```js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";

const router = Router();
router.use(authMiddleware);
router.use(restrictToRoles("CONSUMER"));

router.get("/profile", catchAsync(async (req, res) => {
  res.json({ success: true, data: { ... } });
}));

export default router;
```

Always add **Swagger JSDoc** above each route handler.

### Controller Patterns
- Keep them **thin** — validate, call service, respond
- Always wrap with `catchAsync`
- Validate required fields explicitly, return 400 with descriptive message
- Response format: `res.status(code).json({ success: true, data: result })`

### Service Patterns
- Business logic lives here
- Throw `AppError` for known/expected failures
- Use `_methodName` for private/internal helpers
- Call repository methods (or inline placeholder queries for now)

### Response Envelope
```json
// Success
{ "success": true, "data": { ... } }
// Error
{ "success": false, "message": "Human-readable message" }
```

### Error Handling
- **Custom errors:** `throw new AppError("message", 400)` — sets `isOperational = true`
- **Async wrapper:** `catchAsync(fn)` catches rejected promises and forwards to error middleware
- **Global handler:** `errorHandler()` returns JSON with stack trace in development only
- **404 handler:** `notFoundHandler()` catches unmatched routes
- Use `AppError` for all user-facing errors; let unexpected errors hit the global handler

### Authentication & Authorization
- **Auth:** JWT Bearer token in `Authorization` header → decoded payload on `req.user`
- **RBAC:** `restrictToRoles("GLOBAL_ADMIN", "DEVELOPER_ADMIN")` checks `req.user.role_scope`
- **Public routes:** no middleware (e.g., register, login)
- **Protected routes:** apply `authMiddleware` via `router.use()` then `restrictToRoles(...)` at router level

### Database Patterns
- Use `db.query(text, params)` for standard queries
- Use `db.transaction(async (client) => { ... })` for multi-step operations
- Use `db.getClient()` + manual transaction control only when the helper doesn't fit
- All tables use UUID primary keys, `created_at`/`updated_at` timestamps, snake_case naming
- Location data uses `GEOGRAPHY(POINT, 4326)` via PostGIS

## Key Files to Know

| File | Why It Matters |
|------|----------------|
| `server.js` | Express entry point, middleware registration, server start |
| `config/db.js` | Singleton `Database` class with `query`, `transaction`, `getClient` |
| `routes/api.js` | Central router that mounts all sub-routers under `/api` |
| `middlewares/authMiddleware.js` | JWT verification, attaches `req.user` |
| `middlewares/rbacGuard.js` | `restrictToRoles()` middleware factory |
| `middlewares/errorMiddleware.js` | Global `errorHandler` + `notFoundHandler` |
| `services/AuthService.js` | Registration, login, JWT signing/refresh |
| `repositories/BaseRepository.js` | Generic CRUD base class |
| `utils/AppError.js` | Custom operational error class |
| `utils/catchAsync.js` | Async error wrapper |
| `utils/path.js` | Centralized path resolution |

## Role Scopes (Hierarchical Access)

```
CONSUMER            → /api/user/*
VENDOR              → /api/vendor/*
GLOBAL_ADMIN        → /api/admin/*
CUSTOMER_SERVICE    → /api/cs/*
DEVELOPER_ADMIN     → /api/dev/*
```

## Common Gotchas

- **File extension required:** All imports must include `.js` (ESM requirement)
- **Empty stubs exist:** `models/userModel.js`, `models/vendorModel.js`, `controllers/venderController.js` are placeholders
- **Typo in codebase:** `venderController.js` (missing "o") — match the existing name or fix both sides
- **Repository layer not yet used:** Services still use inline `// TODO` queries instead of repository classes
- **Supabase-like abstraction, not Supabase SDK:** `BaseRepository` uses Supabase-style chaining over raw `pg.Pool`, not the Supabase JS client
- **RLS bypassed:** Node.js connects as superuser/service_role, so Supabase RLS policies are not enforced from the app layer
- **No tests:** Don't look for test files — they don't exist yet
- **Environment:** `.env` file is at project root (not in `src/`), resolved via `utils/path.js`

## When Adding New Features

1. Understand which route layer the endpoint belongs to (auth, user, vendor, admin, cs, dev)
2. Follow the layered pattern: Route → Controller → Service → Repository
3. Add Swagger JSDoc to the route handler
4. Wrap async handlers with `catchAsync`
5. Use `AppError` for business logic failures
6. Follow the response envelope format
7. Add DB queries via `config/db.js` helpers
8. Register the new route in `routes/api.js`

## When Fixing Bugs

1. Trace the request path: Route → Middleware → Controller → Service → Repository
2. Check if the error is operational (thrown `AppError`) or unexpected (uncaught exception)
3. Verify request validation in the controller
4. Check `catchAsync` wrapping on all async handlers
5. Verify environment variables are loaded (look in `utils/path.js` for `.env` resolution)
6. Check response format consistency
