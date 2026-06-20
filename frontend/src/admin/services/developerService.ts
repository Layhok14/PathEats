import api from "../../shared/services/axiosService";
import type { AdminPlaceCategory, AdminRestaurant, AdminUser } from "./adminDashboardService";

export interface DeveloperBackup {
  id: string;
  name: string;
  scope: "database" | "table" | "row";
  tableName: string | null;
  rowId: string | null;
  rowCount: number;
  createdAt: string;
  recoveredAt: string | null;
  status: "COMPLETED" | "RECOVERED";
}

export const PROJECT_TABLES = [
  "bookmarks",
  "menu_items",
  "place_categories",
  "place_hours",
  "place_images",
  "places",
  "reviews",
  "role",
  "routes",
  "search_history",
  "user_preferences",
  "users",
];

export async function getDeveloperUsers(): Promise<AdminUser[]> {
  const response = await api.get<{ success: boolean; data: AdminUser[] }>("/dev/users");
  return response.data.data;
}

export async function createDeveloperUser(payload: {
  name: string;
  email: string;
  phone?: string;
  role: string;
  password?: string;
}): Promise<AdminUser> {
  const response = await api.post<{ success: boolean; data: AdminUser }>("/dev/users", payload);
  return response.data.data;
}

export async function updateDeveloperUser(id: string, payload: Partial<AdminUser> & { phone?: string }): Promise<AdminUser> {
  const response = await api.patch<{ success: boolean; data: AdminUser }>(`/dev/users/${id}`, payload);
  return response.data.data;
}

export async function banDeveloperUser(id: string): Promise<void> {
  await api.post(`/dev/users/${id}/ban`);
}

export async function unbanDeveloperUser(id: string): Promise<void> {
  await api.post(`/dev/users/${id}/unban`);
}

export async function deleteDeveloperUser(id: string): Promise<void> {
  await api.delete(`/dev/users/${id}`);
}

export async function getDeveloperVendors(): Promise<AdminRestaurant[]> {
  const response = await api.get<{ success: boolean; data: AdminRestaurant[] }>("/dev/vendors");
  return response.data.data;
}

export async function getDeveloperPlaceCategories(): Promise<AdminPlaceCategory[]> {
  const response = await api.get<{ success: boolean; data: AdminPlaceCategory[] }>("/dev/place-categories");
  return response.data.data;
}

export async function createDeveloperVendor(payload: {
  name: string;
  location?: string;
  category_id?: string;
}): Promise<AdminRestaurant> {
  const response = await api.post<{ success: boolean; data: AdminRestaurant }>("/dev/vendors", payload);
  return response.data.data;
}

export async function updateDeveloperVendor(id: string, payload: {
  name?: string;
  location?: string;
  category_id?: string;
}): Promise<AdminRestaurant> {
  const response = await api.patch<{ success: boolean; data: AdminRestaurant }>(`/dev/vendors/${id}`, payload);
  return response.data.data;
}

export async function banDeveloperVendor(id: string): Promise<void> {
  await api.post(`/dev/vendors/${id}/ban`);
}

export async function unbanDeveloperVendor(id: string): Promise<void> {
  await api.post(`/dev/vendors/${id}/unban`);
}

export async function deleteDeveloperVendor(id: string): Promise<void> {
  await api.delete(`/dev/vendors/${id}`);
}

export async function getDeveloperBackups(): Promise<DeveloperBackup[]> {
  const response = await api.get<{ success: boolean; data: DeveloperBackup[] }>("/dev/backups");
  return response.data.data;
}

export async function createDeveloperBackup(payload: {
  scope: "database" | "table" | "row";
  tableName?: string;
  rowId?: string;
}): Promise<DeveloperBackup> {
  const response = await api.post<{ success: boolean; data: DeveloperBackup }>("/dev/backups", payload);
  return response.data.data;
}

export async function recoverDeveloperBackup(id: string): Promise<DeveloperBackup> {
  const response = await api.post<{ success: boolean; data: DeveloperBackup }>(`/dev/backups/${id}/recover`);
  return response.data.data;
}
