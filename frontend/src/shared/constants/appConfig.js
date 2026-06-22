// PathEat app-wide configuration constants

export const PHNOM_PENH_CENTER = [11.5564, 104.9282];

// Vector tile styles (MapLibre GL style JSON URLs)
export const LIGHT_VECTOR_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
export const DARK_VECTOR_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// OSRM routing backend
export const OSRM_BASE_URL = "https://router.project-osrm.org";

export const PLACES = [
  { name: "Phnom Penh International Airport", lat: 11.5466, lng: 104.8442 },
  { name: "Olympic Stadium", lat: 11.5589, lng: 104.9011 },
  { name: "Royal Palace", lat: 11.5631, lng: 104.9425 },
  { name: "Central Market (Psar Thmei)", lat: 11.5696, lng: 104.9187 },
  { name: "AEON Mall Phnom Penh", lat: 11.5394, lng: 104.9222 },
  { name: "Tuol Sleng Museum", lat: 11.5523, lng: 104.9177 },
  { name: "Independence Monument", lat: 11.5524, lng: 104.9222 },
  { name: "Riverside (Sisowath Quay)", lat: 11.5686, lng: 104.9305 },
  { name: "Orussey Market", lat: 11.5676, lng: 104.9067 },
  { name: "Boeung Kak Lake", lat: 11.5738, lng: 104.8956 },
  { name: "Tuol Kork", lat: 11.5846, lng: 104.8885 },
  { name: "Chbar Ampov", lat: 11.5305, lng: 104.9494 },
  { name: "Koh Pich (Diamond Island)", lat: 11.5432, lng: 104.9241 },
  { name: "Bak Touk", lat: 11.5761, lng: 104.8718 },
  { name: "Russian Market (Toul Tom Pong)", lat: 11.5398, lng: 104.9084 },
];

export const VENDOR_RANGE_DEFAULT = 300;
export const VENDOR_RANGE_MIN = 10;
export const VENDOR_RANGE_MAX = 1500;

export const PRICE_LABELS = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

export const CUISINE_OPTIONS = [
  "All", "Rice", "Nom Banh Chok", "Kuytev", "Nompang", "Chek Chen",
  "Cafe", "Banh Sung", "Banh Xeo", "Others",
];

export const CUISINES = [
  "Rice", "Nom Banh Chok", "Kuytev", "Nompang", "Chek Chen",
  "Cafe", "Banh Sung", "Banh Xeo", "Others",
];
