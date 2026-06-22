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

export interface AdminUserOverviewCell {
  label: string;
  subLabel?: string | null;
  details: Record<string, unknown> | null;
}

export interface AdminUserOverviewRow {
  id: string;
  status: string;
  user: AdminUserOverviewCell;
  preference: AdminUserOverviewCell;
  search: AdminUserOverviewCell;
}

export interface AdminVendorOverviewRow {
  id: string;
  placeName: string;
  user: AdminUserOverviewCell;
  menuItem: AdminUserOverviewCell;
  placeCategory: AdminUserOverviewCell;
  placeHour: AdminUserOverviewCell;
  review: AdminUserOverviewCell;
}

export interface StallManagementOptions {
  vendors: Array<{ id: string; name: string; email: string }>;
  categories: Array<{ id: string; name: string; slug?: string; description?: string | null }>;
  places: Array<{ id: string; name: string; owner_id?: string; owner_email?: string }>;
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

export async function getAdminUserManagementOverview(search = ""): Promise<AdminUserOverviewRow[]> {
  const response = await api.get<{ success: boolean; data: AdminUserOverviewRow[] }>("/admin/user-management/overview", {
    params: search ? { search } : undefined,
  });
  return response.data.data;
}

export async function getAdminVendorManagementOverview(search = ""): Promise<AdminVendorOverviewRow[]> {
  const response = await api.get<{ success: boolean; data: AdminVendorOverviewRow[] }>("/admin/vendor-management/overview", {
    params: search ? { search } : undefined,
  });
  return response.data.data;
}

export async function getStallManagementOptions(): Promise<StallManagementOptions> {
  const response = await api.get<{ success: boolean; data: StallManagementOptions }>("/admin/stall-management/options");
  return response.data.data;
}

export async function createAdminStall(payload: {
  ownerId: string;
  categoryId: string;
  name: string;
  description?: string;
  address?: string;
  priceRange?: string;
  photoUrl?: string;
}): Promise<{ id: string; name: string }> {
  const response = await api.post<{ success: boolean; data: { id: string; name: string } }>("/admin/stalls", payload);
  return response.data.data;
}

export async function deleteAdminStall(id: string): Promise<void> {
  await api.delete(`/admin/stalls/${id}`);
}

export async function createAdminStallMenuItem(placeId: string, payload: {
  name: string;
  price: string;
  category?: string;
  description?: string;
  imageUrl?: string;
}): Promise<void> {
  await api.post(`/admin/stalls/${placeId}/menu-items`, payload);
}

export async function deleteAdminStallMenuItem(id: string): Promise<void> {
  await api.delete(`/admin/stalls/menu-items/${id}`);
}

export async function createAdminStallCategory(payload: {
  name: string;
  slug?: string;
  description?: string;
}): Promise<void> {
  await api.post("/admin/stalls/place-categories", payload);
}

export async function deleteAdminStallCategory(id: string): Promise<void> {
  await api.delete(`/admin/stalls/place-categories/${id}`);
}

export async function createAdminStallPlaceHour(placeId: string, payload: {
  dayOfWeek: string;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}): Promise<void> {
  await api.post(`/admin/stalls/${placeId}/place-hours`, payload);
}

export async function deleteAdminStallPlaceHour(id: string): Promise<void> {
  await api.delete(`/admin/stalls/place-hours/${id}`);
}

export async function createAdminStallReview(placeId: string, payload: {
  userId?: string;
  rating: string;
  body?: string;
}): Promise<void> {
  await api.post(`/admin/stalls/${placeId}/reviews`, payload);
}

export async function deleteAdminStallReview(id: string): Promise<void> {
  await api.delete(`/admin/stalls/reviews/${id}`);
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

export async function updateAdminRole(
  id: string,
  role: {
    name: string;
    privileges: string[];
    tables: string[];
    grantOption: boolean;
  }
): Promise<AdminRole> {
  const response = await api.patch<{ success: boolean; data: AdminRole }>(`/admin/roles/${id}`, role);
  return response.data.data;
}

export async function deleteAdminRole(id: string): Promise<void> {
  await api.delete(`/admin/roles/${id}`);
}

export async function checkAdminDatabase(): Promise<{ connected: boolean; checkedAt: string | null }> {
  const response = await api.get<{ success: boolean; data: { connected: boolean; checkedAt: string | null } }>("/admin/db/check");
  return response.data.data;
}

export interface AdminStallRow {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  priceRange: string | null;
  photoUrl: string | null;
  isOpen: boolean;
  status: string;
  isApproved: boolean;
  rating: number | null;
  ratingAvg: number | null;
  ratingCount: number;
  ownerId: string | null;
  ownerEmail: string;
  ownerName: string;
  category: { id: string; name: string; slug: string } | null;
  location: { type: string; coordinates: [number, number] } | null;
}

export interface AdminMenuItemRow {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: string;
  imageUrl: string | null;
  isAvailable: boolean;
  placeId: string;
  placeName: string;
}

export interface AuditActivityRow {
  pid: number;
  username: string;
  application_name: string;
  client_addr: string | null;
  state: string;
  query_start: string;
  state_change: string;
  wait_event_type: string | null;
  wait_event: string | null;
  query: string;
}

export async function getAdminAllStalls(): Promise<AdminStallRow[]> {
  const response = await api.get<{ success: boolean; data: AdminStallRow[] }>("/admin/stalls");
  return response.data.data;
}

export async function getAdminStallById(id: string): Promise<AdminStallRow> {
  const response = await api.get<{ success: boolean; data: AdminStallRow }>(`/admin/stalls/${id}`);
  return response.data.data;
}

export async function updateAdminStall(id: string, payload: Partial<AdminStallRow>): Promise<void> {
  await api.patch(`/admin/stalls/${id}`, payload);
}

export async function toggleAdminStallStatus(id: string): Promise<void> {
  await api.patch(`/admin/stalls/${id}/toggle`);
}

export async function getAdminAllMenuItems(): Promise<AdminMenuItemRow[]> {
  const response = await api.get<{ success: boolean; data: AdminMenuItemRow[] }>("/admin/menu-items");
  return response.data.data;
}

export async function updateAdminMenuItem(id: string, payload: Partial<AdminMenuItemRow>): Promise<void> {
  await api.patch(`/admin/menu-items/${id}`, payload);
}

export async function getAdminAuditActivity(): Promise<AuditActivityRow[]> {
  const response = await api.get<{ success: boolean; data: AuditActivityRow[] }>("/admin/audit/activity");
  return response.data.data;
}
