// Central JSDoc + TypeScript type definitions for PathEat.
// Import from here in all domains — never redeclare these shapes locally.

// ── Enumerations ──────────────────────────────────────────────────────────────

/** All cuisine categories supported by the seed data and filter chips */
export type Cuisine =
  | "Khmer"
  | "Noodles"
  | "BBQ"
  | "Rice"
  | "Banh Mi"
  | "Chinese"
  | "Dessert"
  | "Drinks";

// ── Primitives ────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Place
 * A named geographic waypoint selectable as route origin or destination.
 */
export interface Place {
  name: string;
  lat: number;
  lng: number;
}

/**
 * @typedef {Object} MenuItem
 * A single item on a vendor's menu, grouped by category in the detail panel.
 */
export interface MenuItem {
  name: string;
  price: number;
  desc?: string;
  /** Accordion grouping label shown in VendorDetail — defaults to "Menu" when absent */
  category?: string;
}

// ── Domain Entities ───────────────────────────────────────────────────────────

/**
 * @typedef {Object} Vendor
 * Core vendor record returned by GET /api/vendor/:id and POST /api/vendor/search.
 * dist_m and final_score are computed on the fly and attached before rendering.
 */
export interface Vendor {
  id: number;
  name: string;
  cuisine: Cuisine;
  /** 1 = $, 2 = $$, 3 = $$$, 4 = $$$$ — maps to PRICE_LABELS in appConfig */
  price_range: number;
  /** Average star rating (0–5) */
  rating: number;
  /** Estimated queue time in minutes */
  wait_time_est: number;
  lat: number;
  lng: number;
  photo_url: string;
  description: string;
  open_now: boolean;
  /** Human-readable hours string, e.g. "06:00 – 13:00" */
  hours: string;
  address: string;
  menu: MenuItem[];
  /** Populated by scoring pipeline — metres from the route polyline */
  dist_m?: number;
  /** Composite score 0–1 from calcScore(); drives map pin colour and list rank */
  final_score?: number;
}

/**
 * @typedef {Object} User
 * Session payload stored in localStorage. Matches the JWT decoded shape.
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** RBAC scope — CONSUMER for all users of this domain */
  role_scope: string;
}

/**
 * @typedef {Object} Review
 * A consumer-authored vendor review. Created via POST /api/review.
 */
export interface Review {
  id: string;
  vendor_id: number;
  user_id: string;
  /** Displayed name in the review card */
  user_name: string;
  /** Integer 1–5 */
  stars: number;
  body: string;
  /** ISO-8601 timestamp */
  created_at: string;
}

/**
 * @typedef {Object} SavedRoute
 * A user-bookmarked polyline. Persisted in React state; backed by localStorage
 * when the real backend is wired in via POST /api/user/routes.
 */
export interface SavedRoute {
  id: number;
  /** Human label shown in the history panel */
  label: string;
  origin: string;
  dest: string;
  /** Ordered lat/lng pairs forming the polyline */
  points: [number, number][];
  /** Formatted display timestamp, e.g. "Jun 13, 09:30 AM" */
  savedAt: string;
}
