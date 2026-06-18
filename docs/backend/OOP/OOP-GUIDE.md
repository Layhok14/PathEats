# PathEat Backend — OOP Architecture Guide

## Architecture (Layered Pattern)

```
routes/          → HTTP routing + validation
controllers/     → Parse request, call service, send response
services/        → Business logic (rules, calculations, orchestration)
repositories/    → Database queries only (extends BaseRepository)
models/          → Plain data structures / schemas (not ORM)
config/          → Singleton database pool, env, external clients
middlewares/     → Auth, RBAC, error handling
```

**Rule of thumb:** Each layer talks only to the layer **directly below** it.

```
Controller → Service → Repository → Database
```

---

## 1. Database — Singleton Connection Pool

**File: `config/db.js`** (already done)

The `Database` class is a **singleton**. Import it anywhere and you always
get the **same** connection pool. Never `new Database()` more than once.

```js
import db from "../config/db.js";

// Simple query
const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// Transaction (auto rollback on error)
const result = await db.transaction(async (client) => {
  const user = await client.query("INSERT INTO users ... RETURNING *");
  const profile = await client.query("INSERT INTO profiles ...");
  return user.rows[0];
});
```

---

## 2. Models — Plain Data Shape

**Dir: `models/`**

Models are **plain JS objects** or **simple classes** that represent the
shape of your data. They live here so everyone agrees on what a "User" or
"Vendor" looks like.

```js
// models/userModel.js
export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.roleScope = data.role_scope;  // CONSUMER | VENDOR | GLOBAL_ADMIN | ...
    this.phone = data.phone;
    this.isBanned = data.is_banned ?? false;
    this.createdAt = data.created_at;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin() {
    return this.roleScope === "GLOBAL_ADMIN";
  }
}
```

```js
// models/vendorModel.js
export class Vendor {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.cuisine = data.cuisine;
    this.priceRange = data.price_range;  // 1–4
    this.rating = data.rating;
    this.waitTimeEst = data.wait_time_est;  // minutes
    this.lat = data.lat;
    this.lng = data.lng;
    this.description = data.description;
    this.openNow = data.open_now;
    this.hours = data.hours;
    this.address = data.address;
    this.photoUrl = data.photo_url;
    this.ownerId = data.owner_id;       // FK → users.id
    this.isApproved = data.is_approved;  // Admin approval
    this.createdAt = data.created_at;
  }

  get priceSymbols() {
    return "$".repeat(this.priceRange);
  }

  isOpen() {
    // Check current time against this.hours
    return this.openNow;
  }
}
```

---

## 3. Repositories — Database Access Layer

**Dir: `repositories/`**

All database queries go here. Extend `BaseRepository` (which already
provides `findAll`, `findById`, `create`, `update`, `remove`).

```js
// repositories/UserRepository.js
import BaseRepository from "./BaseRepository.js";
import { User } from "../models/UserModel.js";

class UserRepository extends BaseRepository {
  constructor() {
    super("users"); // Supabase/Postgres table name
  }

  /**
   * Find by email (used in login + registration).
   */
  async findByEmail(email) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? new User(data) : null;
  }

  /**
   * Override create to return a User instance.
   */
  async create(payload) {
    const raw = await super.create(payload);
    return new User(raw);
  }
}

export default new UserRepository(); // ← singleton instance
```

```js
// repositories/VendorRepository.js
import BaseRepository from "./BaseRepository.js";
import { Vendor } from "../models/VendorModel.js";

class VendorRepository extends BaseRepository {
  constructor() {
    super("vendors");
  }

  /** Find all approved vendors */
  async findApproved() {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("is_approved", true);
    if (error) throw error;
    return data.map((row) => new Vendor(row));
  }

  /** Find vendor by owner ID */
  async findByOwner(ownerId) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq("owner_id", ownerId)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? new Vendor(data) : null;
  }
}

export default new VendorRepository();
```

---

## 4. Services — Business Logic Layer

**Dir: `services/`**

Services contain all **business rules**. They call repositories, not the
database directly.

```js
// services/VendorService.js
import vendorRepo from "../repositories/VendorRepository.js";
import AppError from "../utils/AppError.js";

class VendorService {
  /** Get a vendor's public-facing profile */
  async getPublicProfile(vendorId) {
    const vendor = await vendorRepo.findById(vendorId);
    if (!vendor) throw new AppError("Vendor not found", 404);
    return vendor;
  }

  /** Update vendor operating hours */
  async updateHours(vendorId, hours, ownerId) {
    const vendor = await vendorRepo.findById(vendorId);
    if (!vendor) throw new AppError("Vendor not found", 404);
    if (vendor.ownerId !== ownerId) {
      throw new AppError("Not your vendor", 403);
    }
    return vendorRepo.update(vendorId, { hours });
  }
}

export default new VendorService(); // ← singleton instance
```

---

## 5. Controllers — Request/Response Layer

**Dir: `controllers/`**

Controllers are **thin**. They parse the request, call a service, and send
the response. No database calls, no business logic.

```js
// controllers/vendorController.js
import vendorService from "../services/VendorService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getProfile = catchAsync(async (req, res) => {
  const vendor = await vendorService.getPublicProfile(req.params.id);
  res.json({ success: true, data: vendor });
});

export const updateHours = catchAsync(async (req, res) => {
  const { hours } = req.body;
  const vendor = await vendorService.updateHours(
    req.params.id,
    hours,
    req.user.sub   // JWT subject = user ID
  );
  res.json({ success: true, data: vendor });
});
```

---

## 6. Routes — Wire HTTP to Controllers

**Dir: `routes/`**

Routes connect HTTP verbs + paths to controller methods. Middleware (auth,
RBAC) is applied here.

```js
// routes/vendorRoutes.js (real implementation replacing the placeholder)
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { restrictToRoles } from "../middlewares/rbacGuard.js";
import { getProfile, updateHours } from "../controllers/VendorController.js";

const router = Router();

router.use(authMiddleware);
router.use(restrictToRoles("VENDOR"));

router.get("/profile/:id", getProfile);
router.put("/hours", updateHours);

export default router;
```

---

## Summary: What Goes Where

| Concern | File | Example |
|---|---|---|
| DB connection | `config/db.js` | `db.query("SELECT ...")` |
| Data shape | `models/*.js` | `new User({...})` |
| DB queries | `repositories/*.js` | `userRepo.findByEmail(...)` |
| Business rules | `services/*.js` | `vendorService.updateHours(...)` |
| Parse request, send response | `controllers/*.js` | `getProfile(req, res)` |
| HTTP routing | `routes/*.js` | `router.get("/profile", getProfile)` |

## Existing Files Already Using This Pattern (Reference)

| Layer | File | Status |
|---|---|---|
| Config + Singleton | `config/db.js` | ✅ Done |
| Abstract Base | `repositories/BaseRepository.js` | ✅ Done |
| Service | `services/AuthService.js` | ✅ Done (uses placeholder repo) |
| Controller | `controllers/AuthController.js` | ✅ Done |
| Route | `routes/authRoutes.js` | ✅ Done |
| Model | `models/` | ❌ Needs implementation |
| Repository | `repositories/` | ❌ Only Base exists |
| Service | `services/` | ❌ Only AuthService exists |
| Controller | `controllers/` | ❌ Only authController exists |

## What Each Team Member Should Build

1. **User domain:** `UserModel.js` → `UserRepository.js` → `UserService.js` → `UserController.js`
2. **Vendor domain:** `VendorModel.js` → `VendorRepository.js` → `VendorService.js` → `VendorController.js`
3. **Menu domain:** `MenuItemModel.js` → `MenuItemRepository.js` → `MenuService.js` → (attached to vendor routes)
4. **Order domain:** `OrderModel.js` → `OrderRepository.js` → `OrderService.js` → `OrderController.js`
5. **Review domain:** `ReviewModel.js` → `ReviewRepository.js` → `ReviewService.js` → `ReviewController.js`
6. **Favorites domain:** `FavoriteModel.js` → `FavoriteRepository.js` → `FavoriteService.js` → (attached to user routes)
