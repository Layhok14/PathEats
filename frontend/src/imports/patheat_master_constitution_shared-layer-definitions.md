# PathEat Shared Layer Definitions
## Understanding the 'Shared' Directory Utility

In our architecture, the `src/shared/` directory is the single source of truth for the entire application. It prevents code duplication by centralizing logic that is needed by multiple domains (User, Vendor, Admin).

### 1.1 `shared/constants/`
* **Purpose**: Holds immutable configuration values that never change during runtime.
* **Examples**:
    * `roles.js`: `export const ROLES = { ADMIN: 'GLOBAL_ADMIN', VENDOR: 'VENDOR', ... }`
    * `apiEndpoints.js`: URL path arrays for all API hooks to ensure consistent routing.
    * `appConfig.js`: Default map coordinates for Phnom Penh, system version strings, etc.
* **Why**: Prevents "magic strings" (e.g., repeating `'GLOBAL_ADMIN'` in 20 different files).

### 1.2 `shared/types/`
* **Purpose**: Defines the shape of data objects. Since PathEat uses React, we use JSDoc comments or TypeScript interface files to document our data structures.
* **Examples**:
    * `vendor.js`: Documentation of what a `Vendor` object looks like (id, name, location, menu_items array).
    * `route.js`: Definition of the route object (origin, destination, geometry).
* **Why**: Provides IntelliSense/autocomplete in your editor so you know what properties an object has without checking the database schema.

### 1.3 `shared/utils/`
* **Purpose**: Contains "pure functions"—code that takes input and returns output without side effects.
* **Examples**:
    * `geoCalculator.js`: Functions to compute distance between two points (PostGIS distance converters).
    * `formatters.js`: Currency formatters (KHR/USD), date formatters for the dashboard.
    * `validators.js`: Regex checks for emails, phone numbers, or password strength.
* **Why**: Keeps your UI components clean. Instead of putting a 20-line math formula inside a component, you just call `distance(a, b)`.