export interface OperatingHours {
  open: string;
  close: string;
}

export interface OperatingSchedule {
  weekdays: OperatingHours;
  weekends: OperatingHours;
}

export type StallCategory =
  | "Rice Bowls"
  | "Noodles & Stir-fry"
  | "Snacks"
  | "Beverages"
  | "Desserts"
  | "Other";

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
  | "All"
  | "Rice"
  | "Noodles"
  | "Drinks"
  | "Snacks"
  | "Desserts";

export interface MenuItem {
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
