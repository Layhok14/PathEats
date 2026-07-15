# Authentication, Authorization, JWT, And Forgot Password Guide

Purpose: give the team a short technical explanation of login, authorization, JWT tokens, refresh tokens, SMTP OTP email, and forgot-password flow.

Use this file when the team needs to explain backend security without reading every auth file.

## Short Status From Code Inspection

The current implementation is structurally correct from static inspection.

What is working in code:

- login checks email and password with bcrypt
- access tokens are JWTs
- refresh tokens are stored hashed in `refresh_tokens`
- refresh token rotation is implemented
- refresh token reuse detection revokes the token family
- protected routes reload the latest user role and privileges from the database
- forgot password uses OTP records in `otps`
- SMTP configuration is checked before sending email
- failed OTP email delivery invalidates the OTP
- password reset revokes all active refresh tokens for that user

What still depends on environment:

- forgot-password email only works if SMTP env values are real
- required SMTP values are in `backend/.env.example`
- actual email delivery cannot be confirmed only from code; it must be tested with real SMTP credentials

## Important Files

- `backend/src/routes/authRoutes.js`
  - auth API endpoints
- `backend/src/services/AuthService.js`
  - login, register, refresh token, logout, forgot password, reset password
- `backend/src/services/emailService.js`
  - SMTP setup and OTP email sending
- `backend/src/repositories/UserRepository.js`
  - user lookup and password update
- `backend/src/repositories/TokenRepository.js`
  - refresh token storage, hashing, rotation, revocation, session events
- `backend/src/repositories/OtpRepository.js`
  - OTP storage, verification, invalidation
- `backend/src/middlewares/authMiddleware.js`
  - JWT verification and attaching `req.user`
- `backend/src/middlewares/privilegeGuard.js`
  - authorization checks
- `frontend/src/shared/hooks/useAuth.tsx`
  - frontend session storage and login state
- `frontend/src/shared/services/axiosService.ts`
  - attaches access token and refreshes expired sessions
- `frontend/src/user/components/AuthModal.tsx`
  - forgot password UI flow

## Authentication

Authentication means proving who the user is.

In this project, the main login flow is:

1. frontend submits email and password to `POST /api/auth/login`
2. `authRoutes.js` calls `AuthService.login`
3. `AuthService.login` loads the user through `UserRepository.findByEmailWithPassword`
4. password is checked with `bcrypt.compare`
5. banned users are rejected
6. role mismatch is rejected if the user logs in from the wrong portal
7. access token and refresh token are generated
8. login event is written to `session_events`

Main functions:

- `AuthService.login`
- `AuthService._generateTokens`
- `AuthService._signAccessToken`
- `AuthService._signRefreshToken`
- `TokenRepository.store`
- `TokenRepository.logSessionEvent`

## JWT Access Token

The access token is a signed JWT.

Current code:

- `AuthService._signAccessToken`
- payload includes:
  - `sub`
  - `email`
  - `role_scope`
  - `role`
- default expiry is `15m`
- secret comes from `JWT_ACCESS_SECRET`

Important meaning:

- the access token proves the user identity for API requests
- the backend verifies it in `authMiddleware`
- the access token itself does not store the full privilege list
- after verifying the token, the backend reloads the latest role privileges from the database

This is a strong design point:

- role permission changes can affect future API requests without waiting for a new login

## Refresh Token

The refresh token is used to get a new access token when the access token expires.

Current code:

- `AuthService._signRefreshToken`
- default expiry is `7d`
- secret comes from `JWT_REFRESH_SECRET`
- payload includes:
  - `sub`
  - `family_id`
  - `jti`

The raw refresh token is not stored directly.

Instead:

- `TokenRepository.store` hashes the refresh token with SHA-256
- stores the hash in `refresh_tokens.token_hash`

Refresh behavior:

1. frontend calls `POST /api/auth/refresh`
2. `AuthService.refreshAccessToken` verifies refresh JWT signature
3. backend checks the hashed token exists in `refresh_tokens`
4. backend checks it is not revoked and not expired
5. backend creates a new access token and refresh token
6. old refresh token is revoked and linked to the new token

Security behavior:

- if an already revoked refresh token is reused, the whole refresh-token family is revoked
- this helps detect stolen or reused refresh tokens

Main functions:

- `AuthService.refreshAccessToken`
- `TokenRepository.findByToken`
- `TokenRepository.touch`
- `TokenRepository.revokeById`
- `TokenRepository.revokeFamily`

## Authorization

Authorization means checking what the user is allowed to do.

There are three layers:

### 1. Role scope check

Files:

- `backend/src/middlewares/rbacGuard.js`
- `frontend/src/shared/components/AuthGuard.tsx`

Example:

- vendor routes require `VENDOR`
- consumer routes require `CONSUMER`
- developer routes require `DEVELOPER_ADMIN` or `GLOBAL_ADMIN`

### 2. Table privilege check

File:

- `backend/src/middlewares/privilegeGuard.js`

Example:

- `requirePrivileges({ table: "places", action: "UPDATE" })`

This checks the role's `tablePrivileges`.

### 3. System capability check

File:

- `backend/src/middlewares/privilegeGuard.js`

Example:

- `requireSystemCapability("BACKUP")`
- `requireSystemCapability("RECOVERY")`
- `requireSystemCapability("QUERY")`
- `requireSystemCapability("MAINTENANCE")`

This is used for non-table developer/admin operations.

## Frontend Session Behavior

The frontend stores:

- access token
- refresh token
- user object

Main file:

- `frontend/src/shared/hooks/useAuth.tsx`

Axios attaches the access token:

- `frontend/src/shared/services/axiosService.ts`

If an API returns `401`, Axios tries to refresh:

1. get refresh token from local storage
2. call `/api/auth/refresh`
3. save the new access token and refresh token
4. retry the original request

Important limitation:

- frontend menu visibility uses the stored user object
- if a role is edited while the user is already logged in, the backend uses fresh privileges, but the frontend display may need refresh or re-login

## Forgot Password Flow

Forgot password uses email OTP.

Frontend path:

- `frontend/src/user/components/AuthModal.tsx`

Backend endpoints:

- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

Backend flow:

1. user enters email
2. `AuthService.forgotPassword` checks whether the account exists
3. if it exists, backend creates a 6-digit OTP
4. OTP is stored by `OtpRepository.store`
5. OTP expires after 15 minutes
6. `emailService.sendOTPEmail` sends the OTP by SMTP
7. user enters OTP
8. `AuthService.verifyOtp` checks OTP without marking it used
9. user submits new password
10. `AuthService.resetPassword` verifies OTP and marks it used
11. new password is hashed with bcrypt
12. all unused OTPs for the email are invalidated
13. all refresh tokens for the user are revoked

Main functions:

- `AuthService.forgotPassword`
- `AuthService.verifyOtp`
- `AuthService.resetPassword`
- `OtpRepository.store`
- `OtpRepository.verifyOnly`
- `OtpRepository.verify`
- `OtpRepository.invalidateAll`
- `sendOTPEmail`
- `TokenRepository.revokeAllForUser`

## SMTP Email

SMTP is used only for sending OTP email.

Main file:

- `backend/src/services/emailService.js`

Required env values:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Behavior:

- default host is `smtp.gmail.com`
- default port is `587`
- port `465` uses secure mode
- missing or placeholder credentials make SMTP invalid
- `sendOTPEmail` uses `nodemailer`
- if sending fails, the backend returns a safe error and invalidates the OTP

Important answer for presentation:

> Forgot password works through SMTP only when real SMTP credentials are configured. The code validates SMTP settings, stores OTPs with expiration, sends the OTP email, and revokes sessions after password reset.

## What To Say In Presentation

Use this short explanation:

> Authentication proves who the user is using email, password, bcrypt, JWT access tokens, and refresh tokens. Authorization controls what the user can do through role scope, table privileges, and system capabilities. Forgot password uses OTP email through SMTP; after reset, old sessions are revoked for safety.

## Likely Teacher Questions

### Where is JWT checked?

In `backend/src/middlewares/authMiddleware.js`.

### Does the JWT store all permissions?

No. The access token stores identity and role scope. The backend reloads full role privileges from the database.

### Why use refresh tokens?

Access tokens are short-lived. Refresh tokens allow new access tokens without logging in again.

### Are refresh tokens stored safely?

The raw token is not stored. `TokenRepository` stores a SHA-256 hash.

### What happens after password reset?

The new password is hashed, OTPs are invalidated, and all refresh tokens for the user are revoked.

### What can break forgot password?

Missing or wrong SMTP settings.
