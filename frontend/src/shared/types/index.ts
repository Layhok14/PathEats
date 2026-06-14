// Central TypeScript type definitions for PathEat.
// Merge of vendor-domain (Stall) and user-domain (Vendor) types.

// ── Enumerations ──────────────────────────────────────────────────────────────
export type Cuisine =
  | "Khmer" | "Noodles" | "BBQ" | "Rice" | "Banh Mi"
  | "Chinese" | "Dessert" | "Drinks";

// ── User-domain types (consumer search, vendor detail, reviews) ───────────
export interface Place {
  name: string;
  lat: number;
  lng: number;
}

export interface MenuItem {
  name: string;
  price: number;
  desc?: string;
  category?: string;
}

export interface Vendor {
  id: number;
  name: string;
  cuisine: Cuisine;
  price_range: number;
  rating: number;
  wait_time_est: number;
  lat: number;
  lng: number;
  photo_url: string;
  description: string;
  open_now: boolean;
  hours: string;
  address: string;
  menu: MenuItem[];
  dist_m?: number;
  final_score?: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role_scope: string;
}

export interface Review {
  id: string;
  vendor_id: number;
  user_id: string;
  user_name: string;
  stars: number;
  body: string;
  created_at: string;
}

export interface SavedRoute {
  id: number;
  label: string;
  origin: string;
  dest: string;
  points: [number, number][];
  savedAt: string;
}

// ── Vendor-domain types (stall management, location pinning) ──────────────
export interface OperatingHours {
  open: string;
  close: string;
}

export interface OperatingSchedule {
  weekdays: OperatingHours;
  weekends: OperatingHours;
}

export type StallCategory =
  | "Rice Bowls" | "Noodles & Stir-fry" | "Snacks"
  | "Beverages" | "Desserts" | "Other";

export type StallStatus = "open" | "closed";

export interface StallLocation {
  landmark: string;
  latitude: number;
  longitude: number;
}

export interface Stall {
  id: string;
  name: string;
  photoUrl: string;
  category: StallCategory;
  description: string;
  operatingHours: OperatingSchedule;
  status: StallStatus;
  location: StallLocation;
  rating: number;
  reviewCount: number;
  menuItemIds: string[];
}

export type MenuCategory =
  | "All" | "Rice" | "Noodles" | "Drinks" | "Snacks" | "Desserts";

export interface VendorMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: MenuCategory;
  isAvailable: boolean;
}

export interface StallFormData {
  name: string;
  photoUrl: string;
  category: StallCategory;
  description: string;
  operatingHours: OperatingSchedule;
  status: StallStatus;
  location: StallLocation;
  menuItemIds: string[];
}
