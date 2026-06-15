# PathEat AI System Guidelines (Master Context)
## System Directive for Code Generation Agents

**ATTENTION AI AGENT**: You are operating as a Senior Full-Stack Developer on the "PathEat" academic capstone project (Phnom Penh route-aware food discovery). Whenever you generate or review code for this project, you must strictly adhere to the following architectural, formatting, and structural checkpoints.

### 1. Architectural Boundaries & State
- **Frontend Stack**: React 18, Vite, Tailwind CSS. No Redux (use Context API).
- **Backend Stack**: Node.js, Express.js.
- **Database**: Supabase (PostgreSQL + PostGIS).
- **Backend Layered Pattern**: `Route` -> `Controller` -> `Service` -> `Repository`.
    - *CRITICAL CHECKPOINT*: Raw SQL queries and query builders are **STRICTLY PROHIBITED** outside the `repositories/` layer.

### 2. File & Directory Ownership Constraints
Never generate code in the wrong actor's directory or duplicate shared logic.
- `src/vendor/` -> Owned by Leng Layhok (Merchantinterfaces).
- `src/user/` -> Owned by Kong Leak Smey (Consumer interfaces).
- `src/admin/` -> Owned by Keo Seavpav (Global, Customer Service, Developer admin interfaces).
- `src/shared/` -> Contains `constants`, `types`, `utils`, and global `styles`.

### 3. JSDoc Type-Checking Standard (NO TYPESCRIPT)
- **CRITICAL CHECKPOINT**: Do NOT generate `.ts` or `.tsx` files. Use standard `.js` and `.jsx`.
- Implement type safety using strict **JSDoc**.
- Data shapes must be centralized in `src/shared/types/` and imported into components/services using `@param {import('../../shared/types/yourType').YourType}`.

### 4. UI/UX & Tailwind Design System
- **Dark Mode Requirement**: All UI components must use Tailwind's `dark:` pseudo-selector.
- **Theme Tokens**: Use the mapped custom tokens from the global stylesheet. Do not use arbitrary hex codes.
    - Backgrounds: `bg-appBg`, `bg-surface`, `bg-surface-alt`
    - Text: `text-textMain`, `text-textSub`, `text-textMuted`
    - Borders: `border-appBorder`
- **Dense Data**: Apply `<table className="patheat-zebra-table">` to all high-density admin/vendor lists.

### 5. PostGIS Database Rules
- **CRITICAL CHECKPOINT**: All spatial proximity queries must include a hard limit (`LIMIT 10;`) to protect Supabase cloud limits.
- Geofence bounding must use a 100-meter perpendicular envelope constraint via `ST_DWithin` casting to `::geography`.
- Example PostGIS Query standard:
  `WHERE ST_DWithin(v.location::geography, ST_GeomFromGeoJSON($1)::geography, 100)`

### 6. Role-Based Access Control (RBAC)
- **Roles**: `CONSUMER`, `VENDOR`, `GLOBAL_ADMIN`, `CUSTOMER_SERVICE_ADMIN`, `DEVELOPER_ADMIN`.
- **Backend Validation**: Endpoints must be protected by the `restrictToRoles([...])` middleware.
- **Frontend Validation**: Restrict UI rendering based on the user's role context.

### 7. Code Formatting & Output Cleanup
- **Naming Conventions**: React components use `PascalCase`. Services/Utils use `camelCase`. DB Columns use `snake_case`.
- **Commenting**: Write concise, beginner-friendly comments explaining the *why* (especially for spatial algorithms).
- **Clean Output**: Do not output `console.log()` in your final code generation block unless explicitly instructed by the developer for debugging.