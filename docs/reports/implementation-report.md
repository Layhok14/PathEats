# Implementation Report — Auth & Vendor Backend + Frontend Connection

> **Date:** 2026-06-18
> **Author:** Layhok (Auth + Vendor Domain)
> **Scope:** Register, Login, Password Hashing, OTP Forgot Password, 3 Vendor Endpoints, Frontend Integration

---

## Files Created / Modified

### Backend — New Files

| # | File | Purpose |
|---|------|---------|
| 1 | `backend/src/repositories/UserRepository.js` | Database queries for `users` table — `findByEmail`, `create`, `findByEmailWithPassword`, `updatePassword` |
| 2 | `backend/src/repositories/OtpRepository.js` | OTP storage in `otps` table — `store`, `verify`, `invalidateAll`. Auto-creates table via `CREATE TABLE IF NOT EXISTS` |
| 3 | `backend/src/repositories/VendorRepository.js` | Stall queries — `findByOwner`, `findOwnedById`, `create` (with PostGIS point), `getDashboardMetrics` |
| 4 | `backend/src/services/emailService.js` | Nodemailer transporter adapted from `reference/email.js` — sends branded OTP emails with 15-min expiry |
| 5 | `backend/src/services/AuthService.js` | **Rewritten** — real bcrypt (12 salt rounds), `crypto.randomInt()` OTP generation, JWT signing with `sub`/`email`/`role_scope` payload, full OTP flow |
| 6 | `backend/src/services/VendorService.js` | Business logic for vendor dashboard, stall listing, stall creation with model validation |
| 7 | `backend/src/controllers/vendorController.js` | `getDashboard`, `getStalls`, `createStall`, `getStallById` — thin handlers wrapping vendor service |
| 8 | `backend/src/models/VendorModel.js` | `validateCreate`, `validateUpdate`, `toResponse` — input validation + response shape |

### Backend — Modified Files

| # | File | Changes |
|---|------|---------|
| 9 | `backend/src/controllers/authController.js` | **Rewritten** — added `forgotPassword`, `verifyOtp`, `resetPassword` handlers with field validation |
| 10 | `backend/src/routes/authRoutes.js` | **Rewritten** — added 3 new POST routes (`/forgot-password`, `/verify-otp`, `/reset-password`) with full Swagger JSDoc schemas |
| 11 | `backend/src/routes/vendorRoutes.js` | **Rewritten** — wired real controller functions (`getDashboard`, `getStalls`, `createStall`, `getStallById`) instead of inline stubs, with Swagger docs |

### Backend — Removed Files

| # | File | Reason |
|---|------|--------|
| 12 | `backend/src/controllers/venderController.js` | Typo in filename (missing "o"). Replaced by `vendorController.js` |

### Frontend — Modified Files

| # | File | Changes |
|---|------|---------|
| 13 | `frontend/src/shared/hooks/useAuth.tsx` | **Rewritten** — `login()` and `signup()` now call `POST /api/auth/login` and `POST /api/auth/register` via axios. Added `vendorSignup()` for VENDOR role. Token stored in session and automatically attached by axios interceptor |
| 14 | `frontend/src/shared/hooks/useStalls.ts` | **Rewritten** — replaced mock in-memory array with real API calls (`GET /vendor/stalls`, `POST /vendor/stalls`, `PUT /vendor/stalls/:id`, `DELETE /vendor/stalls/:id`). Added error state, `refetch()` function |

---

## Architecture Decisions

### 1. Repository Layer Uses Raw SQL (not Supabase SDK chaining)

The `config/db.js` exports a `pg.Pool`-based `Database` class with `query()`, not a Supabase JS client. The existing `BaseRepository` calls `this.supabase.from().select()` which cannot work with a raw `pg.Pool`.

**Decision:** All new repositories (`UserRepository`, `VendorRepository`, `OtpRepository`) use `db.query("SQL...", [params])` directly. This is consistent with the actual database connection and avoids the broken Supabase-style abstraction.

### 2. OTP Stored in Dedicated `otps` Table

Instead of adding OTP fields to the `users` table (which would clutter the user schema) or using in-memory storage (which doesn't survive server restarts), OTPs are stored in a dedicated `otps` table with:
- `email` — who requested it
- `otp_code` — the 6-digit code
- `type` — discriminator for future use cases (`password_reset`, `email_verify`)
- `expires_at` — TIMESTAMPTZ for SQL-level expiry checking
- `is_used` — prevents replay attacks

The table is auto-created via `CREATE TABLE IF NOT EXISTS` in the OTP repository constructor.

### 3. bcrypt with 12 Salt Rounds

The blueprint specifies bcrypt for password hashing. 12 rounds provides a good security-to-performance tradeoff — ~250ms per hash on modern hardware, resistant to GPU-based brute force.

### 4. JWT Payload Structure

```json
{
  "sub": "uuid",        // User ID
  "email": "...",       // For quick identification
  "role_scope": "...",  // CONSUMER | VENDOR | GLOBAL_ADMIN | etc.
  "iat": 1700000000,   // Issued at
  "exp": 1700086400    // Expiry (15m by default, configurable)
}
```

Matches the blueprint exactly. The `authMiddleware` decodes this and attaches it as `req.user`.

### 5. 3 Vendor Endpoints

Chosen based on what the frontend vendor portal actually uses:

| Endpoint | Method | Purpose | Frontend Page |
|----------|--------|---------|---------------|
| `/api/vendor/dashboard` | GET | Dashboard metrics (stall count, rating, orders) | `DashboardPage.tsx` |
| `/api/vendor/stalls` | GET | List all stalls owned by vendor | `StallListPage.tsx` |
| `/api/vendor/stalls` | POST | Register a new stall | `StallCreatePage.tsx` |
| `/api/vendor/stalls/:id` | GET | Get single stall details | `StallDetailPage.tsx` |

### 6. Frontend Connection Strategy

The axios interceptor in `axiosService.ts` already handles JWT attachment and 401 redirects. The frontend hooks (`useAuth`, `useStalls`) were rewritten to use `api.get()`/`api.post()` instead of mock data. No new dependencies were needed.

---

## Data Flow

### Registration
```
POST /api/auth/register
  → authController.register()
    → AuthService.register()
      → UserRepository.findByEmail() — check duplicate
      → bcrypt.genSalt(12) + bcrypt.hash(password, salt)
      → UserRepository.create() — INSERT into users
      → jwt.sign() — return token
    ← { user, token }
```

### Login
```
POST /api/auth/login
  → authController.login()
    → AuthService.login()
      → UserRepository.findByEmailWithPassword() — includes password_hash
      → bcrypt.compare(password, user.password_hash)
      → jwt.sign() — return token
    ← { user, token }
```

### Forgot Password (OTP Flow)
```
POST /api/auth/forgot-password { email }
  → AuthService.forgotPassword()
    → UserRepository.findByEmail() — verify user exists
    → crypto.randomInt(100000, 999999) — generate 6-digit OTP
    → OtpRepository.store() — INSERT into otps (expires 15 min)
    → emailService.sendOTPEmail() — send via nodemailer
    ← { message: "OTP sent" }

POST /api/auth/verify-otp { email, otp }
  → AuthService.verifyOtp()
    → OtpRepository.verify() — check valid, unused, not expired
    → Mark as used
    ← { message: "OTP verified" }

POST /api/auth/reset-password { email, otp, newPassword }
  → AuthService.resetPassword()
    → OtpRepository.verify() — re-verify OTP
    → bcrypt.hash(newPassword, 12)
    → UserRepository.updatePassword()
    → OtpRepository.invalidateAll() — clear remaining OTPs
    ← { message: "Password reset" }
```

### Vendor Stall Creation
```
POST /api/vendor/stalls (auth + VENDOR role required)
  → authMiddleware decodes JWT → req.user = { sub, email, role_scope }
  → restrictToRoles("VENDOR") checks req.user.role_scope
  → vendorController.createStall()
    → VendorService.createStall()
      → VendorModel.validateCreate() — validate input
      → VendorRepository.create() — INSERT into places with PostGIS point
    ← { stall data }
```

---

## Postman / curl Test Examples

### Register a Vendor
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@patheat.app",
    "password": "SecurePass123!",
    "firstName": "Sophea",
    "lastName": "Meng",
    "roleScope": "VENDOR"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "vendor@patheat.app", "password": "SecurePass123!"}'
```

### Forgot Password
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "vendor@patheat.app"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "vendor@patheat.app", "otp": "123456"}'
```

### Reset Password
```bash
curl -X POST http://localhost:4000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "vendor@patheat.app", "otp": "123456", "newPassword": "NewSecurePass456!"}'
```

### Get Vendor Dashboard (with token)
```bash
curl -X GET http://localhost:4000/api/vendor/dashboard \
  -H "Authorization: Bearer <your-token>"
```

### Create a Stall (with token)
```bash
curl -X POST http://localhost:4000/api/vendor/stalls \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Spice & Wok Haven", "category_id": "<category-uuid>", "description": "Fresh rice bowls", "latitude": 11.5564, "longitude": 104.9282}'
```

---

## Notes

- **Email sending requires SMTP config** — set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in `.env`. Without valid SMTP credentials, the forgot-password flow will throw a 500 error. In development, check server logs for the OTP value.
- **PostGIS requirement** — the `places` table uses `GEOGRAPHY(POINT, 4326)`. Ensure the PostGIS extension is enabled in Supabase: `CREATE EXTENSION IF NOT EXISTS postgis;`
- **OTP table auto-creation** — the `otps` table is created on first `OtpRepository` instantiation. The `CREATE TABLE IF NOT EXISTS` approach avoids needing a separate migration step.
- **Database schema** — the `users` and `places` tables must already exist with the schema defined in `docs/database/database-schema (2).md`. The `otps` table is created automatically.
