# Backend Completion Guide

## Current State

**9 endpoints implemented** out of **40 defined routes** across 6 routers. Only `auth` and `vendor` domains have working logic. The `user`, `admin`, `cs`, and `dev` routers return stubs. The `osrmService` is never wired to any route. The `VendorRepository.update()` method exists but no route or service calls it.

## Architecture Pattern

```
authRoutes.js / vendorRoutes.js
  → imports Service class
  → handler calls service.method()
  → wraps in catchAsync

userRoutes.js / adminRoutes.js / csRoutes.js / devRoutes.js
  → inline stub handlers (no service imported)
  → wraps in catchAsync
```

Every new feature follows this pattern:
1. Create/extend a **Repository** class with SQL queries
2. Create/extend a **Service** class with business logic
3. Add a **route handler** in the appropriate route file

---

## Auth Domain — 5/5 endpoints implemented (100%)

### Endpoints

| Method | Path | What it does |
|--------|------|-------------|
| POST | `/api/auth/register` | Creates user, returns JWT |
| POST | `/api/auth/login` | Authenticates, returns JWT |
| POST | `/api/auth/forgot-password` | Sends OTP email |
| POST | `/api/auth/verify-otp` | Validates OTP |
| POST | `/api/auth/reset-password` | Resets password after OTP |

### Data Flow

```
authRoutes.js → AuthService → UserRepository + OtpRepository + bcrypt + JWT
```

### What's Lacking

Nothing — auth is complete. Verify the `JWT_SECRET` / `JWT_ACCESS_SECRET` env vars match in production.

### Example: Adding a refresh token endpoint

```js
// backend/src/routes/authRoutes.js — add after resetPassword handler

router.post("/refresh-token", catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "Refresh token required" });
  }
  const result = await authService.refreshToken(refreshToken);
  res.json({ success: true, data: result });
}));

// backend/src/services/AuthService.js — add method

async refreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await this.userRepo.findById(decoded.sub);
    if (!user) throw new AppError("User not found", 404);
    const token = this._signToken(user.id, user.email, user.role_scope);
    return { token };
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }
}
```

---

## Vendor Domain — 4/5 endpoints implemented (80%)

### Endpoints

| Method | Path | What it does | Status |
|--------|------|-------------|--------|
| GET | `/api/vendor/dashboard` | Stall + order metrics | ✅ |
| GET | `/api/vendor/stalls` | List stalls | ✅ |
| POST | `/api/vendor/stalls` | Create stall | ✅ |
| GET | `/api/vendor/stalls/:id` | Get single stall | ✅ |
| PUT | `/api/vendor/stalls/:id` | Update stall | ❌ |

### Data Flow

```
vendorRoutes.js → VendorService → VendorRepository + VendorModel
```

### What's Lacking

#### 1. PUT /api/vendor/stalls/:id — update stall

The `VendorRepository.update()` method already exists (`VendorRepository.js:67-101`). Only the route and service call are missing.

**Code to add:**

```js
// backend/src/routes/vendorRoutes.js — add after GET /stalls/:id

/**
 * @swagger
 * /api/vendor/stalls/{id}:
 *   put:
 *     tags: [Vendor]
 *     summary: Update a stall
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:        { type: string }
 *               category_id: { type: string, format: uuid }
 *               description: { type: string }
 *               address:     { type: string }
 *               photo_url:   { type: string }
 *               price_range: { type: integer }
 *               latitude:    { type: number }
 *               longitude:   { type: number }
 *               status:      { type: string }
 *               is_open:     { type: boolean }
 *     responses:
 *       200:
 *         description: Stall updated
 *       404:
 *         description: Stall not found
 */
router.put("/stalls/:id", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const stall = await vendorService.updateStall(ownerId, req.params.id, req.body);
  res.json({ success: true, data: stall });
}));
```

```js
// backend/src/services/VendorService.js — add method

async updateStall(ownerId, stallId, data) {
  const { valid, errors } = VendorModel.validateUpdate(data);
  if (!valid) throw new AppError(errors.join("; "), 400);
  const stall = await this.vendorRepo.update(stallId, { ...data, owner_id: ownerId });
  if (!stall) throw new AppError("Stall not found", 404);
  return VendorModel.toResponse(stall);
}
```

#### 2. DELETE /api/vendor/stalls/:id — delete stall

Needs a new repository method, service method, and route.

**Code:**

```js
// backend/src/repositories/VendorRepository.js — add method

async remove(id, ownerId) {
  const { rows } = await db.query(
    `DELETE FROM places WHERE id = $1 AND owner_id = $2 RETURNING id`,
    [id, ownerId]
  );
  return rows[0] || null;
}
```

```js
// backend/src/services/VendorService.js — add method

async deleteStall(ownerId, stallId) {
  const result = await this.vendorRepo.remove(stallId, ownerId);
  if (!result) throw new AppError("Stall not found", 404);
  return { message: "Stall deleted" };
}
```

```js
// backend/src/routes/vendorRoutes.js — add

router.delete("/stalls/:id", catchAsync(async (req, res) => {
  const ownerId = req.user.sub;
  const result = await vendorService.deleteStall(ownerId, req.params.id);
  res.json({ success: true, data: result });
}));
```

---

## User Domain — 0/7 endpoints implemented (0%)

### Endpoints (All Stubs)

| Method | Path | What it should do |
|--------|------|-------------------|
| GET | `/api/user/profile` | Return authenticated user's profile |
| PUT | `/api/user/profile` | Update user profile (name, phone, preferences) |
| GET | `/api/user/favorites` | List user's favorite vendors |
| POST | `/api/user/favorites` | Add a vendor to favorites |
| DELETE | `/api/user/favorites/:id` | Remove a vendor from favorites |
| GET | `/api/user/routes/log` | Route search history |
| GET | `/api/user/alerts` | User notifications |

### Data Flow (to build)

```
userRoutes.js → [UserService] → [UserRepository] + [FavoritesRepository] + [RouteHistoryRepository]
```

### What's Needed

#### Repository level

Create `backend/src/repositories/FavoritesRepository.js`:

```js
import db from "../config/db.js";

class FavoritesRepository {
  async findByUser(userId) {
    const { rows } = await db.query(
      `SELECT p.* FROM favorites f JOIN places p ON p.id = f.place_id WHERE f.user_id = $1`,
      [userId]
    );
    return rows;
  }

  async add(userId, placeId) {
    const { rows } = await db.query(
      `INSERT INTO favorites (user_id, place_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING id`,
      [userId, placeId]
    );
    return rows[0];
  }

  async remove(userId, placeId) {
    const { rows } = await db.query(
      `DELETE FROM favorites WHERE user_id = $1 AND place_id = $2 RETURNING id`,
      [userId, placeId]
    );
    return rows[0];
  }
}

export default FavoritesRepository;
```

#### Service level

Create `backend/src/services/UserService.js`:

```js
import UserRepository from "../repositories/UserRepository.js";
import FavoritesRepository from "../repositories/FavoritesRepository.js";
import AppError from "../utils/AppError.js";

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
    this.favRepo = new FavoritesRepository();
  }

  async getProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async updateProfile(userId, data) {
    // TODO: implement UPDATE in UserRepository
    throw new AppError("Not implemented", 501);
  }

  async getFavorites(userId) {
    return this.favRepo.findByUser(userId);
  }

  async addFavorite(userId, placeId) {
    return this.favRepo.add(userId, placeId);
  }

  async removeFavorite(userId, placeId) {
    const result = await this.favRepo.remove(userId, placeId);
    if (!result) throw new AppError("Favorite not found", 404);
    return { message: "Removed from favorites" };
  }
}

export default UserService;
```

#### Route level

Replace the stub handlers in `userRoutes.js`:

```js
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { catchAsync } from "../utils/catchAsync.js";
import UserService from "../services/UserService.js";

const userService = new UserService();
const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("CONSUMER"));

router.get("/profile", catchAsync(async (req, res) => {
  const profile = await userService.getProfile(req.user.sub);
  res.json({ success: true, data: profile });
}));

router.put("/profile", catchAsync(async (req, res) => {
  const profile = await userService.updateProfile(req.user.sub, req.body);
  res.json({ success: true, data: profile });
}));

router.get("/favorites", catchAsync(async (req, res) => {
  const favorites = await userService.getFavorites(req.user.sub);
  res.json({ success: true, data: favorites });
}));

router.post("/favorites", catchAsync(async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ success: false, message: "placeId required" });
  const fav = await userService.addFavorite(req.user.sub, placeId);
  res.status(201).json({ success: true, data: fav });
}));

router.delete("/favorites/:id", catchAsync(async (req, res) => {
  const result = await userService.removeFavorite(req.user.sub, req.params.id);
  res.json({ success: true, data: result });
}));

// Routes/log and alerts remain stubs until requirements clarify
router.get("/routes/log", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

router.get("/alerts", catchAsync(async (req, res) => {
  res.json({ success: true, data: [] });
}));

export default router;
```

---

## Admin Domain — 0/9 endpoints implemented (0%)

### Endpoints (Stubs)

`GET /api/admin/telemetry`, `GET /api/admin/users`, `PATCH /api/admin/users/:id/role`, `POST /api/admin/users/:id/ban`, `GET /api/admin/vendors`, `POST /api/admin/vendors/:id/approve`, `GET /api/admin/settings`, `PUT /api/admin/settings`, `GET /api/admin/audit`

### What's Needed

Create `backend/src/services/AdminService.js` and wire each endpoint to real DB queries:

```js
// Example: GET /api/admin/users — list all users with pagination
// backend/src/routes/adminRoutes.js — replace stub

router.get("/users", catchAsync(async (req, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  const result = await adminService.listUsers({ page: +page, limit: +limit, role, status, search });
  res.json({ success: true, data: result });
}));

// backend/src/services/AdminService.js

async listUsers({ page, limit, role, status, search }) {
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = [];
  let idx = 1;

  if (role) { conditions.push(`role_scope = $${idx++}`); params.push(role); }
  if (search) { conditions.push(`(LOWER(first_name) LIKE $${idx++} OR LOWER(email) LIKE $${idx})`); params.push(`%${search}%`, `%${search}%`); idx++; }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const countResult = await db.query(`SELECT COUNT(*) FROM users ${where}`, params);
  const dataResult = await db.query(
    `SELECT id, email, first_name, last_name, role_scope, is_banned, created_at FROM users ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
    [...params, limit, offset]
  );

  return { users: dataResult.rows, total: +countResult.rows[0].count, page, limit };
}
```

---

## Customer Service Domain — 0/8 endpoints implemented (0%)

### Endpoints (Stubs)

Tickets CRUD, disputes (user/vendor), vendor verification, review moderation.

### What's Needed

Create `backend/src/services/CustomerService.js`. Start with the `otps` table for verification and a new `support_tickets` table for tickets. Review moderation needs a `reviews` table query.

---

## Developer Domain — 0/7 endpoints implemented (0%)

### Endpoints (Stubs)

Health (hardcoded), backups, database stats, logs, seed, API metrics.

### What's Needed

The `/health` endpoint should check DB connectivity. `/database` should return table stats from `information_schema`. `/seed` should invoke the seed script.

```js
// Example: backend/src/routes/devRoutes.js — improved health check

router.get("/health", catchAsync(async (req, res) => {
  let dbOk = false;
  try {
    await db.query("SELECT 1");
    dbOk = true;
  } catch {}
  res.json({
    success: true,
    data: {
      status: dbOk ? "healthy" : "degraded",
      uptime: process.uptime(),
      database: dbOk ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    },
  });
}));
```

---

## Fix Known Bugs

### 1. AppError.isOperational (breaks all error messages)

**File:** `backend/src/utils/AppError.js`

Current:
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

Fix:
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

### 2. JWT env var mismatch

Ensure both env vars match:
```
JWT_SECRET=your-secret-key
JWT_ACCESS_SECRET=your-secret-key
```

---

## Wire osrmService to a Route

`backend/src/services/osrmService.js` is fully implemented but never imported anywhere. Wire it to a new route:

```js
// backend/src/routes/api.js — add import and route

import { getRouteHandler } from "../controllers/mapController.js";

router.get("/route", getRouteHandler);
```

Or just inline it since mapController was deleted:

```js
// backend/src/routes/api.js — add

import { getRoute } from "../services/osrmService.js";

router.get("/route", catchAsync(async (req, res) => {
  const { origin, destination } = req.query;
  const [oLng, oLat] = origin.split(",").map(Number);
  const [dLng, dLat] = destination.split(",").map(Number);
  const route = await getRoute(oLat, oLng, dLat, dLng);
  res.json({ success: true, data: route });
}));
```

Note: the frontend currently calls OSRM directly from `routeService.js`, so this endpoint is only needed if you want the backend to proxy OSRM requests.
