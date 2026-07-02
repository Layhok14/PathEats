// Central TypeScript type definitions for PathEat.
// Merge of vendor-domain (Stall) and user-domain (Vendor) types.

// ── Enumerations ──────────────────────────────────────────────────────────────
export type Cuisine =
  | "Rice" | "Nom Banh Chok" | "Kuytev" | "Nompang" | "Chek Chen"
  | "Cafe" | "Banh Sung" | "Banh Xeo" | "Others";

export type StallCategory = Cuisine;

export type EntityId = string;

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
  image_url?: string;
  storage_image?: StorageImage | null;
}

export interface StorageImage {
  bucketName: string;
  objectPath: string;
  mimeType?: string | null;
  sizeBytes?: number;
  altText?: string;
}

export interface Vendor {
  id: string;
  name: string;
  cuisine: Cuisine;
  price_range: number;
  rating: number;
  wait_time_est: number;
  lat: number;
  lng: number;
  photo_url?: string | null;
  storage_image?: StorageImage | null;
  description: string;
  open_now: boolean;
  hours: string;
  address: string;
  menu: MenuItem[];
  /** Distance from vendor to route (metres) — computed server-side via PostGIS */
  dist_m?: number;
  /** Composite PathEats value score — computed server-side */
  final_score?: number;
  /** Search match metadata — populated server-side when search is active */
  _searchMatch?: {
    matchedByName: boolean;
    matchedMenuItems: string[];
  } | null;
  _searchActive?: boolean;
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
  vendor_id: string;
  user_id: string;
  user_name: string;
  stars: number;
  body: string;
  created_at: string;
}

export interface SavedRoute {
  id: string;
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
  storageImage?: StorageImage | null;
  category: StallCategory;
  description: string;
  operatingHours: OperatingSchedule;
  status: StallStatus;
  adminManaged?: boolean;
  location: StallLocation;
  rating: number;
  reviewCount: number;
  menuItemIds: string[];
}

export type MenuCategory =
  | "Main Course" | "Snack" | "Drink" | "Dessert";

export interface VendorMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storageImage?: StorageImage | null;
  category: MenuCategory;
  isAvailable: boolean;
}

export interface StallFormData {
  name: string;
  photoUrl: string;
  storageImage?: StorageImage | null;
  category: StallCategory;
  description: string;
  operatingHours: OperatingSchedule;
  status: StallStatus;
  location: StallLocation;
  menuItemIds: string[];
}
