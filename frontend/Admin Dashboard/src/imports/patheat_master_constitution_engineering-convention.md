# PathEat Engineering Convention v2.0

## Reference: Academic Capstone Framework (CADT Term 3, 2025-2026)

This document establishes the binding structural and stylistic rules for the PathEat codebase. All development teams and AI generation agents must enforce these patterns strictly to avoid divergence.

---

## 1. Codebase Directory Architecture

### 1.1 Frontend Layout (React 18 + Vite + Tailwind CSS)

The frontend application uses a decentralized architectural pattern grouped by actor boundary domains to ensure isolation and clear individual ownership boundaries.

```text
src/
├── user/                  # Owner: Leng Layhok
│   ├── pages/             # Frontend Views/Screens for Consumers
│   ├── components/        # Isolated UI pieces (SearchBar, FilterChips)
│   ├── routes/            # React-Router-DOM sub-route mapping definitions
│   ├── services/          # HTTP request modules targeting user-facing endpoints
│   └── layouts/           # Page structural framing shells (UserMainLayout)
├── vendor/                # Owner: Kong Leak Smey
│   ├── pages/             # Operational dashboards & setup screens
│   ├── components/        # Interactive menu grids, sales charts, layout components
│   ├── routes/            # Vendor routing specifications
│   ├── services/          # Operational API endpoints triggers
│   └── layouts/           # Multi-tier navigational control frames
├── admin/                 # Owner: Keo Seavpav
│   ├── pages/
│   │   ├── global/        # System configuration and master admin screens
│   │   ├── customer-service/ # Dispute logs and platform ticket tracking
│   │   └── developer/     # Database backups, diagnostic utilities, telemetry dashboards
│   ├── components/        # Metric tables, log viewers, prompt overlays
│   ├── routes/            # RBAC routing control centers
│   └── layouts/           # Tiered administrative panels
├── shared/                # Collective Responsibility
│   ├── components/        # Design system base primitives (Buttons, Inputs, Modals)
│   ├── hooks/             # Reactive helper functions (useAuth, useTheme, usePostGIS)
│   ├── services/          # Central Axios instantiation with interceptors
│   ├── constants/         # Domain lookup indexes, system error definitions, enum arrays
│   ├── utils/             # Converters, geofence algorithms, mathematical formatters
│   └── types/             # Explicit Type/JSDoc structures
├── App.jsx                # Core router orchestration registry
└── main.jsx               # Application DOM mounting and environment bootstrap
```

### 1.2 Backend Layout (Node.js + Express + PostgreSQL + PostGIS)

The backend leverages a rigid decoupled multi-tier Layered Architecture Pattern (**Route-Controller-Service-Repository**).

```text
backend/
├── routes/                # Inbound HTTP routing and parameters declaration
├── controllers/          # Protocol level extraction (Express req/res mapping)
├── services/             # Pure functional application state logic and formulas
├── repositories/         # Exclusive layer handling SQL queries and connection pools
├── models/                # Static definitions matching DB relational topology
├── middleware/           # RBAC execution, JWT validation, error interception engines
├── config/                # Database pools, client coordinates mapping indexes
├── utils/                 # Spatial computation and shell execution hooks
└── app.js                 # Network engine orchestration initialization
```

- **Decoupled Flow Rule**: `Route` -> `Controller` -> `Service` -> `Repository` -> `PostgreSQL`.
- **Database Isolation Policy**: No SQL code, query builders, or raw text strings may appear outside the `repositories/` folder. Controllers and Services remain database-agnostic.

---

## 2. Naming Standards

### 2.1 Component & File Structure

- **React Component Files**: Must match `PascalCase` containing functional suffixes: `UserSearchPage.jsx`, `VendorMenuTable.jsx`, `AdminBackupPage.jsx`.
- **Code Scripts**: All services, routes, modules, utils, and internal components must use `camelCase`: `authService.js`, `geoDistanceCalculator.js`, `userController.js`.
- **Cascading Stylesheets**: Inline Tailwind system utility styles are exclusively permitted. Avoid standard `.css` modules completely.

### 2.2 Relational Elements

- **Database Entity Definitions**: Tables and database attribute column titles must be configured in `snake_case`: `menu_items`, `vendor_profiles`, `user_id`, `is_stall_active`.

---

## 3. Human-Style Coding & Code Formatting Constraints

### 3.1 Commenting Paradigm

To maintain a natural, realistic engineering output from automated systems and code-generation models, comments must follow a **concise, practical "beginner-style" framework** with occasional human-like spacing variations instead of sterile enterprise documentation blocks:

- Do not write highly verbose paragraph blocks or repeat obvious syntax explanations.
- Focus documentation explicitly on the **why** of spatial algorithms, token checks, or coordinate matrices.
- _Bad Example_: `// This increments the counter variable by one step`
- _Good Example_: `// offset necessary because openfreemap uses zero-based array bounds here`

### 3.2 Global Cleanliness Requirement

- Under penalty of automatic Pull Request rejection, all debugging console output logs (`console.log`, `console.error`) must be systematically stripped from any production code before submission.
  //For now, generate those logs for me as well to inspect.

---

## 4. UI/UX Rules & Ambient States (HCI Compliance)

### 4.1 Automated Color Token Exploitations

Components must match the centralized definitions inside `src/shared/styles/style.css` by utilizing extended theme tokens via the Tailwind engine. Hardcoded color entries are prohibited.

- Root App Shell: `bg-appBg text-textMain transition-colors duration-200`
- Accent Container Outlines: `border-appBorder`
- Secondary Information Content tags: `text-textSub font-sans`

### 4.2 High-Density Data Display Standards

To support fast human review operations inside administrative lists and menu indices, all tables and dense listing grids must use layout zebra-striping: `odd:bg-white even:bg-slate-50/50 dark:odd:bg-slate-900 dark:even:bg-slate-800/40`.

---

## 6. Spatial Database & Query Design Constraints (PostGIS Optimization)

To prevent resource depletion on cloud hosting environments (Render database tiers) when matching commuter route trajectories against physical local coordinate pairs, all geospatial queries must comply with these rigid rules:

1.  All operations must interact via `location::geography` mapping nodes leveraging structural `GiST` database indexes.
2.  An explicit boundary limit ceiling (`LIMIT 10;`) must accompany proximity sorting blocks to keep execution times under a safe bound.
3.  **Gold Standard Relational Geofence Syntax Blueprint**:

```sql
SELECT v.id, v.name AS merchant_name, v.category, v.rating,
       ST_Distance(v.location::geography, ST_GeomFromGeoJSON($1)::geography) AS separation_meters,
       m.item_name, m.price
FROM vendors v
INNER JOIN menu_items m ON v.id = m.vendor_id
WHERE ST_DWithin(v.location::geography, ST_GeomFromGeoJSON($1)::geography, 100) -- 100m perpendicular route envelope
  AND (v.name ILIKE $2 OR m.item_name ILIKE $2)
ORDER BY separation_meters ASC
LIMIT 10;
```
