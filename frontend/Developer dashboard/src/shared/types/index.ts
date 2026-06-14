export type UserRole = "Student" | "Vendor" | "Commuter" | "Admin";
export type UserStatus = "Active" | "Pending" | "Suspended";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type RestaurantStatus = "Active" | "Suspended" | "Inactive" | "Pending";
export type RestaurantCategory = "Noodles" | "Rice" | "Cafe" | "Dessert" | "Fine Dining" | "Fast Casual" | "Artisan Coffee" | "Street Food";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarColor?: string;
  joinedAt: string;
}

export interface Ticket {
  id: string;
  user: string;
  userType: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  timeOpen: string;
  assignedTo?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  email: string;
  category: RestaurantCategory;
  status: RestaurantStatus;
  rating: number | null;
  submittedAt: string;
  imageUrl?: string;
}

export interface ActivityItem {
  id: string;
  type: "user" | "restaurant" | "error" | "backup" | "info";
  title: string;
  description: string;
  time: string;
}

export interface GrowthDataPoint {
  day: string;
  orders: number;
}
