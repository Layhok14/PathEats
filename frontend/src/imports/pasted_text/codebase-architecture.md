## 1. Codebase Directory Architecture

### 1.1 Frontend Layout (React 18 + Vite + Tailwind CSS)

The frontend application uses a decentralized architectural pattern grouped by actor boundary domains to ensure isolation and clear individual ownership boundaries.

```text
src/
├── user/                  # Owner: Leaksmey
│   ├── pages/             # Frontend Views/Screens for Consumers
│   ├── components/        # Isolated UI pieces (SearchBar, FilterChips)
│   ├── routes/            # React-Router-DOM sub-route mapping definitions
│   ├── services/          # HTTP request modules targeting user-facing endpoints
│   └── layouts/           # Page structural framing shells (UserMainLayout)
├── vendor/                # Owner: Layhok
│   ├── pages/             # Operational dashboards & setup screens
│   ├── components/        # Interactive menu grids, sales charts, layout components
│   ├── routes/            # Vendor routing specifications
│   ├── services/          # Operational API endpoints triggers
│   └── layouts/           # Multi-tier navigational control frames
├── admin/                 # Owner: Keo Seavpav && Layhok
│   ├── pages/
│   │   ├── global/        # System configuration and master admin screens
│   │   ├── customer-service/ # Dispute logs and platform ticket tracking
│   │   └── developer/     # Database backups, diagnostic utilities, telemetry dashboards
│   ├── components/        # Metric tables, log viewers, prompt overlays
│   ├── routes/            # RBAC routing control centers
│   └── layouts/           # Tiered administrative panels
├   └── services/          # HTTP request modules 
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