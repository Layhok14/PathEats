// Spatial constants, UI enums, and named place list for Phnom Penh.
// Vendor seed data lives in vendorData.ts to keep this file scannable.

export { ALL_VENDORS } from "./vendorData";

export const PHNOM_PENH_CENTER = [11.5572, 104.918];
export const ROADMAP_TILE =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const DARK_TILE =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export const VENDOR_RANGE_DEFAULT = 300;
export const VENDOR_RANGE_MIN = 10;
export const VENDOR_RANGE_MAX = 500;

export const CUISINES = [
  "Khmer",
  "Noodles",
  "BBQ",
  "Rice",
  "Banh Mi",
  "Chinese",
  "Dessert",
  "Drinks",
];
export const PRICE_LABELS = ["", "$", "$$", "$$$", "$$$$"];

export const PLACES = [
  { name: "Central Market (Phsar Thmei)", lat: 11.5699, lng: 104.917 },
  {
    name: "Russian Market (Phsar Toul Tom Poung)",
    lat: 11.5445,
    lng: 104.9186,
  },
  { name: "Royal Palace", lat: 11.5642, lng: 104.9302 },
  { name: "Independence Monument", lat: 11.5533, lng: 104.9283 },
  { name: "Olympic Stadium", lat: 11.553, lng: 104.9139 },
  { name: "BKK1 (Boeung Keng Kang 1)", lat: 11.5564, lng: 104.9282 },
  { name: "Riverside (Sisowath Quay)", lat: 11.57, lng: 104.9313 },
  { name: "AEON Mall 1", lat: 11.5425, lng: 104.9025 },
  { name: "Wat Phnom", lat: 11.5769, lng: 104.9214 },
  { name: "Toul Sleng Museum", lat: 11.5494, lng: 104.9186 },
  { name: "Phnom Penh International Airport", lat: 11.5466, lng: 104.844 },
  { name: "Night Market (Sisowath Quay)", lat: 11.564, lng: 104.9307 },
  { name: "Sorya Shopping Center", lat: 11.5677, lng: 104.9167 },
  { name: "Toul Kork Market", lat: 11.5783, lng: 104.9227 },
];
