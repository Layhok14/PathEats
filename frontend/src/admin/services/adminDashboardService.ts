import api from "../../shared/services/axiosService";

export interface AdminMetricSummary {
  totalUsers: number;
  activeRestaurants: number;
  openComplaints: number;
  totalRoutes: number;
}

export interface AdminGrowthPoint {
  day: string;
  orders: number;
}

export interface AdminActivityItem {
  id: string;
  type: "user" | "restaurant" | "error" | "backup" | "info";
  title: string;
  description: string;
  time: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarInitials?: string;
  avatarColor?: string;
}

export interface AdminRestaurant {
  id: string;
  name: string;
  location: string;
  email: string;
  category: string;
  status: string;
  rating: number | null;
  submittedAt: string;
}

export interface AdminPlaceCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface AdminRole {
  id: string;
  name: string;
  privileges: string[];
  tables: string[];
  grantOption: boolean;
  createdAt: string;
}

export interface AdminDashboardTelemetry {
  metrics: AdminMetricSummary;
  growth: AdminGrowthPoint[];
  activity: AdminActivityItem[];
}

export async function getAdminDashboardTelemetry(): Promise<AdminDashboardTelemetry> {
  const response = await api.get<{ success: boolean; data: AdminDashboardTelemetry }>("/admin/telemetry");
  return response.data.data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get<{ success: boolean; data: { users: AdminUser[] } }>("/admin/users");
  return response.data.data.users;
}

export async function createAdminUser(user: {
  name: string;
  email: string;
  role: string;
  password?: string;
}): Promise<AdminUser> {
  const response = await api.post<{ success: boolean; data: AdminUser }>("/admin/users", user);
  return response.data.data;
}

export async function updateAdminUserRole(id: string, role: string): Promise<void> {
  await api.patch(`/admin/users/${id}/role`, { role });
}

export async function updateAdminUserStatus(id: string, status: string): Promise<void> {
  await api.patch(`/admin/users/${id}/status`, { status });
}

export async function getAdminRestaurants(): Promise<AdminRestaurant[]> {
  const response = await api.get<{ success: boolean; data: AdminRestaurant[] }>("/admin/vendors");
  return response.data.data;
}

export async function getAdminPlaceCategories(): Promise<AdminPlaceCategory[]> {
  const response = await api.get<{ success: boolean; data: AdminPlaceCategory[] }>("/admin/place-categories");
  return response.data.data;
}

export async function updateRestaurantApproval(id: string, approved: boolean): Promise<void> {
  await api.post(`/admin/vendors/${id}/approve`, { approved });
}

export async function getAdminRoles(): Promise<AdminRole[]> {
  const response = await api.get<{ success: boolean; data: AdminRole[] }>("/admin/roles");
  return response.data.data;
}

export async function checkAdminDatabase(): Promise<{ connected: boolean; checkedAt: string | null }> {
  const response = await api.get<{ success: boolean; data: { connected: boolean; checkedAt: string | null } }>("/admin/db/check");
  return response.data.data;
}
