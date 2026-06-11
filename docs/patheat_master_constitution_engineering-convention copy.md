# PathEat Engineering Convention v2.1
## Integrated Code Architecture & Design System Rules

This binding engineering protocol governs the PathEat source tree repository. It incorporates code directory layers, authorization boundaries, PostGIS optimization routines, and our unified design system.

---

## 1. Directory Tree Architecture Maps

### 1.1 Frontend Structure Layout (React 18 + Vite + Tailwind)
Development operations are organized around explicit functional boundaries. This architecture separates actor concerns to prevent merge friction:

```text
src/
├── user/                  # Owner: Leng Layhok (Consumer Page Views)
│   ├── pages/             
│   ├── components/        
│   ├── routes/            
│   ├── services/          
│   └── layouts/           
├── vendor/                # Owner: Kong Leak Smey (Merchant Interfaces)
│   ├── pages/             
│   ├── components/        
│   ├── routes/            
│   ├── services/          
│   └── layouts/           
├── admin/                 # Owner: Keo Seavpav (Administrative Control Subdivisions)
│   ├── pages/
│   │   ├── global/        # System configuration management controllers
│   │   ├── customer-service/ # Dispute tickets trackers and queue listings
│   │   └── developer/     # Technical telemetry panel views and shells access
│   ├── components/        
│   ├── routes/            
│   └── layouts/           
├── shared/                # Collective Code Team Space Assets
│   ├── components/        # Input, Modal, and Button primitives
│   ├── hooks/             # useAuth, useTheme, usePostGIS
│   ├── services/          # Base network interceptor instances (Axios)
│   ├── styles/            # STYLE HIERARCHY LAYER
│   │   ├── style.css      # Core token attributes file (style.css Variables Hub)
│   │   └── components.css # Abstract layout utility primitives definitions
│   ├── constants/         
│   ├── utils/             
│   └── types/             
├── App.jsx                
└── main.jsx               
```

### 1.2 Backend System Patterns (Node.js + Express)
The backend enforces a strict **Route-Controller-Service-Repository** pattern. Direct data interaction shortcuts between non-adjacent layers are prohibited:
* `Route Layer`: Validates incoming network params and authenticates user roles.
* `Controller Layer`: Parses protocol properties, extracting request payloads and formatting response schemas.
* `Service Layer`: Executes functional business logic, matching geofences, and computing routes.
* `Repository Layer`: Manages data access and executes optimized SQL queries against PostGIS hooks.

---

## 2. Naming Systems Standard

* **Component Files**: Written in `PascalCase` containing matching visual context suffixes: `UserSearchPage.jsx`, `VendorMenuTable.jsx`, `AdminBackupPage.jsx`.
* **Program Modules**: All services, backend sub-routes, utility helpers, and configuration files use `camelCase`: `authService.js`, `spatialCalculator.js`.
* **Relational Database Identifiers**: Schema definitions, tables, and column naming attributes are strictly mapped in lowercase `snake_case`: `menu_items`, `vendor_id`, `is_stall_active`.

---

## 3. Coding Style Constraints & Commenting Framework

### 3.1 Practical "Beginner-Style" Commenting Rules
To match developer preferences and ensure clear code tracking, documentation must follow a **concise, beginner-friendly commenting style** with natural human-like spacing variations, avoiding overly formal enterprise formatting:
* Focus comments on **why** a block exists (such as explaining coordinate transformations or spatial radius limits) rather than explaining basic JavaScript syntax.
* Keep comments short, clear, and direct.

### 3.2 Production Cleanup Gate
* Before pushing branch updates or generating pull requests to merge into `develop`, all debugging console logs (`console.log`, `console.error`) must be systematically removed from modified files.

---

## 4. UI/UX Global Design Architecture Enforcement (HCI Compliance)

### 4.1 Automated Color Token Exploitations
Components must match the centralized definitions inside `src/shared/styles/style.css` by utilizing extended theme tokens via the Tailwind engine. Hardcoded color entries are prohibited.
* Root App Shell: `bg-appBg text-textMain transition-colors duration-200`
* Accent Container Outlines: `border-appBorder`
* Secondary Information Content tags: `text-textSub font-sans`

### 4.2 High-Density Data Display Standards
To support efficient reviews inside management interfaces and tracking lists, all listings must implement the global table zebra-striping utility: `<table className="patheat-zebra-table">`.

---

## 5. Decoupled Spatial Database & Query Configurations (PostGIS Optimization)

To protect container performance thresholds on cloud instances (Render deployment configurations) during coordinate operations across transit route envelopes, queries must implement these spatial rules:
1. All geographic operations must look up spatial paths via structural `GiST` database indexes using `location::geography` attributes.
2. An explicit limit constraint (`LIMIT 10;`) must accompany proximity lookups to keep execution bounds safe.
3. **Gold Standard Spatial Query Structure Template**:
```sql
SELECT v.id, v.name AS merchant_name, v.category, v.rating,
       ST_Distance(v.location::geography, ST_GeomFromGeoJSON($1)::geography) AS separation_m,
       m.item_name, m.price
FROM vendors v
INNER JOIN menu_items m ON v.id = m.vendor_id
WHERE ST_DWithin(v.location::geography, ST_GeomFromGeoJSON($1)::geography, 100) -- 100m travel trail geofence envelope
  AND (v.name ILIKE $2 OR m.item_name ILIKE $2)
ORDER BY separation_m ASC
LIMIT 10;
```