# PathEat Backend Blueprint — Developer Guide

> **Status**: Blueprint / Starter Code  
> **Stack**: Node.js + Express + Supabase (PostgreSQL/PostGIS)  
> **Pattern**: OOP with Route → Controller → Service → Repository  
> **Auth**: JWT + RBAC (5 roles)  
> **API Docs**: Swagger UI at `/api-docs`

---

## 1. Folder Architecture

```
backend/
├── .env                          # Environment variables (never commit)
├── .gitignore
├── package.json
├── server.js                     # Entry: loads env, starts Express
├── src/
│   ├── app.js                    # Express app: middleware + routes + error handler
│   ├── config/
│   │   └── db.js                 # Supabase client factory (singleton)
│   ├── models/
│   │   ├── BaseModel.js          # Abstract shape + validation helpers
│   │   ├── UserModel.js
│   │   ├── VendorModel.js
│   │   ├── OrderModel.js
│   │   └── ReviewModel.js
│   ├── repositories/
│   │   ├── BaseRepository.js     # Abstract: ONLY layer that calls Supabase
│   │   ├── UserRepository.js
│   │   ├── VendorRepository.js
│   │   ├── OrderRepository.js
│   │   └── ReviewRepository.js
│   ├── services/
│   │   ├── AuthService.js        # JWT, OTP, password hashing
│   │   ├── UserService.js        # Consumer domain
│   │   ├── VendorService.js      # Vendor domain + spatial search
│   │   ├── AdminService.js       # Global admin domain
│   │   ├── CsService.js          # Customer service domain
│   │   └── DevService.js         # Developer domain
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── VendorController.js
│   │   ├── AdminController.js
│   │   ├── CsController.js
│   │   └── DevController.js
│   ├── routes/
│   │   ├── api.js                # Aggregates all sub-routers under /api
│   │   ├── authRoutes.js         # Public: login, register, forgot-password
│   │   ├── userRoutes.js         # CONSUMER role
│   │   ├── vendorRoutes.js       # VENDOR role
│   │   ├── adminRoutes.js        # GLOBAL_ADMIN role
│   │   ├── csRoutes.js           # CUSTOMER_SERVICE_ADMIN role
│   │   └── devRoutes.js          # DEVELOPER_ADMIN role
│   ├── middleware/
│   │   ├── authMiddleware.js     # Verifies JWT, attaches req.user
│   │   ├── rbacGuard.js          # restrictToRoles(...) guard
│   │   ├── errorMiddleware.js    # Global Express error handler
│   │   └── validateMiddleware.js # Request body/param validation
│   ├── utils/
│   │   ├── AppError.js           # Custom operational error class
│   │   └── catchAsync.js         # Wraps async route handlers
│   └── swagger/
│       └── swagger.js            # Swagger JSdoc config + UI mount
└── docs/
    ├── backend-blueprint.md      # ← you are here
    └── supabase-connection.md    # Supabase integration rules
```

---

## 2. Architectural Rules (Non-Negotiable)

### 2.1 Data Flow

```
Request
  → Route (validates params, applies RBAC middleware)
    → Controller (extracts req/res, calls service, sends response)
      → Service (business logic, calls repository, throws AppError)
        → Repository (ONLY layer with Supabase queries)
          → Supabase (PostgreSQL + PostGIS)
```

### 2.2 Supabase Client Rules

| Operation | Allowed Layer | Notes |
|-----------|--------------|-------|
| Raw SQL writes | `repositories/` only | All INSERT/UPDATE/DELETE via repository |
| Complex reads (joins, spatial) | `repositories/` only | PostGIS queries live here |
| Simple reads (single row by PK) | `repositories/` only | Even simple reads go through repo |
| Real-time subscriptions | Frontend → Supabase Direct | `supabase.channel()` in frontend only |
| Storage uploads | Frontend → Supabase Direct | `supabase.storage.from()` in frontend |
| Auth helpers (reset password) | Frontend → Supabase Direct | `supabase.auth.resetPasswordForEmail()` |
| External 3rd-party APIs | `services/` via Axios | OSRM, maps, payments |

### 2.3 Axios Rule

Axios is reserved exclusively for **external third-party API calls** (OSRM, payment gateways, etc.).  
All database communication uses the Supabase client through repositories.

### 2.4 OOP Principles

- **Models** are plain classes with static validation methods
- **Repositories** extend `BaseRepository` which holds the Supabase client reference
- **Services** are instantiated with their repository dependency (dependency injection)
- **Controllers** are stateless — they receive req/res and delegate to services

---

## 3. JWT & RBAC

### 3.1 Roles

| Role | Constant | Domain |
|------|----------|--------|
| Consumer | `CONSUMER` | User-facing search, reviews, favorites |
| Vendor | `VENDOR` | Menu management, orders, analytics |
| Global Admin | `GLOBAL_ADMIN` | User/vendor management, system config |
| Customer Service | `CUSTOMER_SERVICE_ADMIN` | Tickets, disputes, onboarding review |
| Developer | `DEVELOPER_ADMIN` | Backups, logs, DB management, health |

### 3.2 Token Payload

```json
{
  "sub": "uuid",
  "email": "user@example.com",
  "role_scope": "CONSUMER",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### 3.3 Protecting Routes

```javascript
// Single role
router.get("/profile", authMiddleware, restrictToRoles("CONSUMER"), controller.getProfile);

// Multiple roles
router.get("/tickets", authMiddleware, restrictToRoles("GLOBAL_ADMIN", "CUSTOMER_SERVICE_ADMIN"), controller.listTickets);

// Public
router.post("/login", controller.login);
```

---

## 4. Environment Variables

```env
# backend/.env

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key  # for admin operations

# JWT
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development

# External APIs
OSRM_BASE_URL=https://router.project-osrm.org

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 5. Error Handling

### 5.1 Custom Error Class (`utils/AppError.js`)

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### 5.2 Global Error Middleware

```javascript
// middleware/errorMiddleware.js
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  console.error(`[${statusCode}] ${err.message}`);
  if (!err.isOperational) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
```

### 5.3 Async Handler Wrapper

```javascript
// utils/catchAsync.js
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### 5.4 HTTP Status Code Conventions

| Code | When |
|------|------|
| 200 | GET/PUT/PATCH success |
| 201 | POST created |
| 204 | DELETE success |
| 400 | Validation error, missing fields |
| 401 | No token / invalid token |
| 403 | Valid token but insufficient role |
| 404 | Resource not found |
| 409 | Duplicate / conflict |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

---

## 6. Swagger UI

Swagger auto-generates docs from JSDoc comments in route files.  
Mount: `GET /api-docs`

### 6.1 Adding Swagger to a Route

```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Returns JWT token and user profile
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", controller.login);
```

### 6.2 Testing in Swagger

1. Start backend: `cd backend && npm run dev`
2. Open `http://localhost:4000/api-docs`
3. For protected routes, click **Authorize** and paste your JWT:
   ```
   Bearer eyJhbGciOiJIUzI1NiIs...
   ```

---


## 8. Postman / Swagger Testing Examples

### 8.1 Register a User

```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "sophea@patheat.app",
  "password": "SecurePass123!",
  "firstName": "Sophea",
  "lastName": "Meng",
  "phone": "012-345-678"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "sophea@patheat.app", "role_scope": "CONSUMER" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 8.2 Login

```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "sophea@patheat.app",
  "password": "SecurePass123!"
}
```

### 8.3 Protected Route (with Token)

```
GET http://localhost:4000/api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 8.4 RBAC Failure Example

```
GET http://localhost:4000/api/admin/users
Authorization: Bearer <consumer-token>
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access Denied. Required: [GLOBAL_ADMIN]. Active: CONSUMER"
}
```

---

## 9. React Frontend Integration Notes

### 9.1 Base URL

```
// .env (frontend)
VITE_API_URL=http://localhost:4000/api
```

### 9.2 Token Storage

```javascript
// After login — store JWT
localStorage.setItem("patheat_token", data.token);

// In axios interceptor — attach to every request
import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("patheat_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 9.3 401 Handling

```javascript
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("patheat_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
```

---

## 10. Getting Started

```bash
# 1. Install dependencies
cd backend && npm install

# 2. Copy .env and fill in your Supabase credentials
cp .env.example .env

# 3. Link Supabase project
npx supabase link --project-ref your-project-ref

# 4. Push the database schema
npx supabase db push

# 5. Start development server
npm run dev

# 6. Open API docs
open http://localhost:4000/api-docs
```
