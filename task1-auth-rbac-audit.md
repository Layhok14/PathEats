# Task 1: Auth & RBAC Security Audit

## Frontend Side

### 1. Route Guards — Consumer Routes (`userRoutes.tsx`)

| Route | Page | AuthGuard Applied | requiredRole | Verdict |
|-------|------|-------------------|-------------|---------|
| `/user/login` | UserLoginPage | ❌ (public) | — | ✅ Correct |
| `/user` | UserSearchPage | **❌** | — | ⚠️ Missing |
| `/user/vendor/:id` | UserVendorDetailPage | **❌** | — | ⚠️ Missing |
| `/user/reviews` | UserReviewsPage | **❌** | — | ⚠️ Missing |

**Issue**: Consumer routes at `frontend/src/user/routes/userRoutes.tsx:15-20` have no AuthGuard wrapping. While the backend API is protected, the pages render UI (tabs, buttons) that may assume a logged-in user. `UserReviewsPage` is especially risky — if it tries to fetch user-specific reviews without auth, it renders broken UI.

**File**: `frontend/src/user/routes/userRoutes.tsx` — all authenticated routes lack `<AuthGuard>`.

### 2. Route Guards — Vendor Routes (`vendorRoutes.tsx`)

| Route | Page | AuthGuard Applied | requiredRole | Verdict |
|-------|------|-------------------|-------------|---------|
| `/vendor/login` | VendorLoginPage | ❌ (public) | — | ✅ Correct |
| `/vendor/register` | VendorRegisterPage | ❌ (public) | — | ✅ Correct |
| `/vendor` | DashboardPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/stalls` | StallListPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/stalls/new` | StallCreatePage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/stalls/:id` | StallDetailPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/stalls/:id/view` | StallViewPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/stalls/location-pinpoint` | LocationPinpointPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/stalls/:id/location` | LocationPinpointPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/menu` | MenuItemsPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/reviews` | ReviewsPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/onboarding` | OnboardingPage | ✅ | `VENDOR` | ✅ Correct |
| `/vendor/settings` | SettingsPage | ✅ | `VENDOR` | ✅ Correct |

**File**: `frontend/src/vendor/routes/vendorRoutes.tsx:51-61` — all correct.

### 3. Route Guards — Admin Routes (`adminRoutes.tsx`)

All routes wrapped with specific guards (globalAdmin, devOrGlobal, businessOrGlobal). The `AdminHomeRoute` function at line 24 redirects based on role. The `AdminGuard` in `App.tsx:18-32` provides a second layer.

**File**: `frontend/src/admin/routes/adminRoutes.tsx:38-52` — guard wrappers correct.

### 4. Route Guards — Developer Routes (`developerRoutes.tsx`)

All wrapped with `<AuthGuard requiredRole="DEVELOPER_ADMIN">`. However, these routes are **NOT mounted** in `App.tsx`. App redirects `/developer/*` to `/admin/developer/*`. The file exists but is orphaned.

**File**: `frontend/src/admin/routes/developerRoutes.tsx:15-62` — correctly guarded but unused.

### 5. JWT Interceptor — `axiosService.ts`

**Issues found**:

- **No retry-limit on refresh**: If `/auth/refresh` keeps returning 401 (e.g., corrupt token on server), the interceptor loops: failed refresh → `redirectToLoginForCurrentPath()` → but if the user is redirected to login and auth state is cleared, this is fine. However, line 58 shows: if refresh itself returns 401, it immediately redirects. This is correct.

- **Tokens in localStorage (XSS risk)**: Tokens stored as `auth_token`, `auth_refresh_token` in `localStorage` (plaintext), readable by any JS running on the page. An XSS vulnerability would expose both access and refresh tokens.

- **Queue mechanism**: Lines 12-13, 63-69 — the pending request queue properly waits for a fresh token. On failure, all queued requests are rejected. ✅

- **No token leakage to console/network**: No explicit logging of tokens found. ✅

**File**: `frontend/src/shared/services/axiosService.ts:36-42` (request interceptor), `:44-106` (response interceptor).

### 6. Token Storage — `useAuth.tsx`

- `auth_token`, `auth_refresh_token`, `auth_user` stored in localStorage (lines 60-63)
- On logout, tokens are cleared via `clearAuthStorage()` (line 95)
- Guest mode clears storage (line 101)
- No tokens are logged to console in normal operation (line 40 logs parse errors only — safe)

**File**: `frontend/src/shared/hooks/useAuth.tsx:59-65` (saveSession), `:90-98` (logout).

---

## Backend Side

### 7. Route Guard Coverage — ALL Backend Routes

#### `authRoutes.js` (`/api/auth`)

| Endpoint | authMiddleware | restrictToRoles | Verdict |
|----------|---------------|-----------------|---------|
| `POST /register` | ❌ (public) | ❌ | ✅ Correct |
| `POST /login` | ❌ (public) | ❌ | ✅ Correct |
| `POST /refresh` | ❌ (public) | ❌ | ✅ Correct |
| `POST /logout` | ❌ (public) | ❌ | ✅ Correct (revokes only provided token) |
| `POST /logout-all` | ✅ | ❌ | ✅ Correct (auth-only, any role) |
| `POST /forgot-password` | ❌ (public) | ❌ | ✅ Correct |
| `POST /verify-otp` | ❌ (public) | ❌ | ✅ Correct |
| `POST /reset-password` | ❌ (public) | ❌ | ✅ Correct |
| `POST /change-password` | ✅ | ❌ | ✅ Correct (auth-only, any role) |

**File**: `backend/src/routes/authRoutes.js` — all correct.

#### `userRoutes.js` (`/api/user`)

- ✅ `router.use(authMiddleware)` at line 13
- ✅ `router.use(restrictToRoles("CONSUMER"))` at line 14

All 13 endpoints under this router inherit guards. ✅ Correct.

**File**: `backend/src/routes/userRoutes.js:13-14`.

#### `vendorRoutes.js` (`/api/vendor`)

- ✅ `GET /onboarding` is public (registered before auth middleware at line 30)
- ✅ `router.use(authMiddleware)` at line 35
- ✅ `router.use(restrictToRoles("VENDOR"))` at line 36

All protected endpoints correctly inherit guards. ✅ Correct.

**File**: `backend/src/routes/vendorRoutes.js:30-36`.

#### `adminRoutes.js` (`/api/admin`)

- ✅ Uses `devAdminBypass` middleware at line 28 (custom bypass or authMiddleware)
- ✅ `router.use(restrictToRoles("GLOBAL_ADMIN", "BUSINESS_ASSISTANCE"))` at line 29
- Certain sensitive routes use `globalAdminOnly` for extra restriction:

| Endpoint | Roles Allowed | Should Be Restricted? |
|----------|--------------|----------------------|
| `GET /vendors` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ✅ Correct |
| `POST /vendors/:id/approve` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ⚠️ BUSINESS_ASSISTANCE may approve vendors |
| `GET /stalls` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ✅ Correct |
| `POST /stalls` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ⚠️ BUSINESS_ASSISTANCE can create stalls |
| `PATCH /stalls/:id` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ⚠️ BUSINESS_ASSISTANCE can edit any stall |
| **`DELETE /stalls/:id`** | **GLOBAL_ADMIN, BUSINESS_ASSISTANCE** | **❌ HIGH — BUSINESS_ASSISTANCE can delete stalls** |
| `GET /reviews` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ✅ Correct |
| `POST /stalls/:placeId/menu-items` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ⚠️ May be intentional |
| **`DELETE /stalls/reviews/:id`** | **GLOBAL_ADMIN, BUSINESS_ASSISTANCE** | **❌ HIGH — BUSINESS_ASSISTANCE can remove reviews** |
| `GET /onboarding` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ⚠️ May be OK |
| `PUT /onboarding` | GLOBAL_ADMIN, BUSINESS_ASSISTANCE | ⚠️ Onboarding config edit |

**⚠️ ROLE SCOPE ISSUE**: `BUSINESS_ASSISTANCE` has too much power — can delete stalls/reviews and approve vendors. These should require `globalAdminOnly`.

**File**: `backend/src/routes/adminRoutes.js:29` (router-level guard), `:338,394,463,531,579,598,611,671,689,790,836,854,901-908` (routes missing `globalAdminOnly`).

#### `devRoutes.js` (`/api/dev`)

- ✅ Uses `devAdminBypass` middleware at line 450
- ✅ `router.use(restrictToRoles("GLOBAL_ADMIN", "DEVELOPER_ADMIN"))` at line 451
- Endpoints like backup download/recovery have extra `devOrGlobalAdmin` guard

| Endpoint | Extra Guard | Verdict |
|----------|------------|---------|
| `GET /health` | ❌ (only blanket) | ✅ OK |
| `GET /database` | ❌ (only blanket) | ✅ OK |
| `GET /logs` | ❌ (only blanket) | ✅ OK |
| `POST /query` | ❌ (only blanket) | ⚠️ Any admin role can run SQL |
| `GET /backups` | ✅ `devOrGlobalAdmin` | ✅ |
| `POST /backups` | ✅ `devOrGlobalAdmin` | ✅ |
| `GET /backups/:id/download` | ✅ `devOrGlobalAdmin` | ✅ |
| `POST /recovery` | ✅ `devOrGlobalAdmin` | ✅ |
| `GET /reviews` | ❌ (only blanket) | ✅ OK |

**File**: `backend/src/routes/devRoutes.js:450-451`.

#### `placesRoutes.js` (`/api/places`)

| Endpoint | authMiddleware | restrictToRoles | Verdict |
|----------|---------------|-----------------|---------|
| `GET /` | ❌ (public) | ❌ | ✅ Correct (public data) |
| `GET /count` | ❌ (public) | ❌ | ✅ Correct |
| `GET /reviews/all` | ❌ (public) | ❌ | ✅ Correct (public reviews) |
| `GET /:id` | ❌ (public) | ❌ | ✅ Correct |
| `GET /:id/reviews` | ❌ (public) | ❌ | ✅ Correct |
| **`POST /:id/reviews`** | **✅** | **✅ CONSUMER** | **✅ Correct** |

**File**: `backend/src/routes/placesRoutes.js:46` — only POST review has auth+role guard. ✅

### 8. Dev Bypass Flags

#### `PATHEAT_ADMIN_BYPASS` — `adminRoutes.js:10-26`

```js
const isDevelopment = process.env.NODE_ENV !== "production";
const isBypassEnabled = process.env.PATHEAT_ADMIN_BYPASS === "true";
```

**Issues**:
1. **`NODE_ENV` check is fragile**: `process.env.NODE_ENV !== "production"` — if `NODE_ENV` is undefined, the check passes as `true`, meaning the bypass could activate in staging or QA environments.
2. **No IP whitelist**: Bypass works from any IP, any network.
3. **Hardcoded user**: `sub: "dev-admin"`, `email: "dev-admin@patheat.local"` — not a real user, no audit trail.

#### `PATHEAT_DEV_BYPASS` — `devRoutes.js:432-448`

Same pattern, same issues. Hardcoded user: `sub: "dev-admin"`, `email: "dev@patheat.app"`.

**File**: `backend/src/routes/adminRoutes.js:10-26`, `backend/src/routes/devRoutes.js:432-448`.

### 9. Refresh Token Rotation

**Status**: ✅ Correctly implemented with family revocation.

In `AuthService.js:139-233` (`refreshAccessToken` method):
1. JWT signature verified (line 151)
2. Token looked up by hash in DB (line 161)
3. **If revoked → revokes entire family** (line 174) — ✅ Family revocation on reuse
4. **If JWT claim mismatch (`jti`/`family_id`) → revokes entire family** (line 187) — ✅
5. If expired → revokes just this token (line 200)
6. On success → generates new tokens with same `family_id`, revokes old one (lines 217-222)

This detects and prevents refresh token replay attacks.

**File**: `backend/src/services/AuthService.js:139-233`.

### 10. Password Reset Flow — Rate Limiting

**Status**: ❌ **No rate limiting on OTP endpoints.**

- `POST /auth/forgot-password`: No rate limit → attacker can spam email with OTPs
- `POST /auth/verify-otp`: No rate limit → attacker can brute-force 6-digit OTP
- `POST /auth/reset-password`: No rate limit → attacker can attempt resets repeatedly

OTP stored in **plaintext** (`otp_code TEXT NOT NULL`) in `OtpRepository.js:15`.
OTP expiry: 15 minutes (`AuthService.js:269`).
OTP length: 6 digits (100,000–999,999) — 900,000 possibilities.

With no rate limiting:
- 10 attempts/second → 90,000 seconds (25 hours) to brute force all possibilities
- With rate limiting of 5 attempts/15min → effectively impossible

**File**: `backend/src/repositories/OtpRepository.js` — no rate limiting logic.
**File**: `backend/src/routes/authRoutes.js:233-308` — forgot-password, verify-otp, reset-password endpoints.
**File**: `backend/src/services/AuthService.js:264-306`.

---

## Summary

| # | Severity | Finding | File:Line |
|---|----------|---------|-----------|
| 1 | 🔴 **HIGH** | OTP endpoints lack rate limiting — brute force possible on password reset | `backend/src/routes/authRoutes.js:233-308`, `backend/src/repositories/OtpRepository.js` |
| 2 | 🔴 **HIGH** | `BUSINESS_ASSISTANCE` role can `DELETE /api/admin/stalls/:id` and `DELETE /api/admin/stalls/reviews/:id` | `backend/src/routes/adminRoutes.js:579,598,854` |
| 3 | 🟡 **MEDIUM** | Consumer routes lack AuthGuard — pages render without authentication check | `frontend/src/user/routes/userRoutes.tsx:15-20` |
| 4 | 🟡 **MEDIUM** | Dev bypass flags check `NODE_ENV !== "production"` — activates if NODE_ENV is undefined | `backend/src/routes/adminRoutes.js:11`, `backend/src/routes/devRoutes.js:433` |
| 5 | 🟡 **MEDIUM** | Tokens stored in localStorage plaintext — XSS would expose access + refresh tokens | `frontend/src/shared/hooks/useAuth.tsx:60-62` |
| 6 | 🟡 **MEDIUM** | OTP stored in plaintext in database | `backend/src/repositories/OtpRepository.js` |
| 7 | 🔵 **LOW** | Hardcoded dev bypass user IDs (`dev-admin`) — no real user context | `backend/src/routes/adminRoutes.js:17`, `backend/src/routes/devRoutes.js:439` |
| 8 | 🔵 **LOW** | `developerRoutes.tsx` routes are defined but unmounted (orphaned code) | `frontend/src/admin/routes/developerRoutes.tsx` |
| 9 | 🔵 **LOW** | No rate limiting on login endpoint — brute force possible | `backend/src/routes/authRoutes.js:138-152` |
