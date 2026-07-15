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
  roleId: string;
  roleScope: string;
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
  places: Array<{ id: string; name: string; owner_id: string; owner_email: string }>;
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
  baseScope?: string | null;
  tablePrivileges: Record<string, string[]>;
  systemCapabilities: string[];
  grantOption: boolean;
  isSystem: boolean;
  userCount?: number;
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
  const response = await api.get<{ success: boolean; data: { users: AdminUser[] } }>("/admin/users", {
    params: { limit: 1000 },
  });
  return response.data.data.users;
}

export async function getAdminUserManagementOverview(search = "", roleScope?: string): Promise<AdminUserOverviewRow[]> {
  const response = await api.get<{ success: boolean; data: AdminUserOverviewRow[] }>("/admin/user-management/overview", {
    params: { ...(search ? { search } : {}), ...(roleScope ? { role_scope: roleScope } : {}) },
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
  latitude?: number;
  longitude?: number;
  status?: string;
  operatingHours?: import("../../shared/types").OperatingSchedule;
  menuItemIds?: string[];
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

export async function deleteAdminStallMenuItem(id: string, placeId?: string): Promise<void> {
  await api.delete(`/admin/stalls/menu-items/${id}`, { params: placeId ? { placeId } : {} });
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
  roleId: string;
  password?: string;
}): Promise<AdminUser> {
  const response = await api.post<{ success: boolean; data: AdminUser }>("/admin/users", user);
  return response.data.data;
}

export async function updateAdminUserRole(id: string, roleId: string): Promise<void> {
  await api.patch(`/admin/users/${id}/role`, { roleId });
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

export async function createAdminRole(role: {
  name: string;
  tablePrivileges: Record<string, string[]>;
  systemCapabilities: string[];
  grantOption: boolean;
}): Promise<AdminRole> {
  const response = await api.post<{ success: boolean; data: AdminRole }>("/admin/roles", role);
  return response.data.data;
}

export async function updateAdminRole(
  id: string,
  role: {
    name?: string;
    tablePrivileges: Record<string, string[]>;
    systemCapabilities: string[];
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
  storageImage?: import("../../shared/types").StorageImage | null;
  isAdminManaged: boolean;
  isOpen: boolean;
  status: string;
  isApproved: boolean;
  rating: number | null;
  ratingAvg: number | null;
  ratingCount: number;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  category: { id: string; name: string; slug: string } | null;
  location: { type: string; coordinates: [number, number] } | null;
  operatingHours?: Array<{ dayOfWeek: number; opensAt: string; closesAt: string; isClosed: boolean }>;
}

export interface AdminMenuItemRow {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: string;
  imageUrl: string | null;
  storageImage?: import("../../shared/types").StorageImage | null;
  isAvailable: boolean;
  placeId?: string | null;
  placeName?: string | null;
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
  const response = await api.get<{ success: boolean; data: AdminStallRow[] }>("/admin/stalls", {
    params: { limit: 1000 },
  });
  return response.data.data;
}

export async function getAdminStallsByOwner(ownerId: string): Promise<AdminStallRow[]> {
  const response = await api.get<{ success: boolean; data: AdminStallRow[] }>(`/admin/stalls/owner/${ownerId}`, {
    params: { limit: 1000 },
  });
  return response.data.data;
}

export async function getAdminUsersByRole(role: string): Promise<AdminUser[]> {
  const response = await api.get<{ success: boolean; data: { users: AdminUser[] } }>("/admin/users", {
    params: { role_scope: role, limit: 1000 },
  });
  return response.data.data.users;
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

export async function postAdminKillQuery(pid: number): Promise<{ message: string }> {
  const response = await api.post<{ success: boolean; data: { message: string } }>("/admin/audit/kill-query", { pid });
  return response.data.data;
}

export async function getAdminAuditActivity(): Promise<AuditActivityRow[]> {
  const response = await api.get<{ success: boolean; data: AuditActivityRow[] }>("/admin/audit/activity");
  return response.data.data;
}

// ── Audit Logs ──────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  adminId: string | null;
  actorId?: string | null;
  actorEmail?: string | null;
  actorFirstName?: string | null;
  actorLastName?: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  details: Record<string, unknown> | null;
  roleScope?: string | null;
  createdAt: string;
}

export async function getAdminAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  const response = await api.get<{ success: boolean; data: AuditLogEntry[] }>("/admin/audit/logs", {
    params: { limit },
  });
  return response.data.data;
}

export async function getAuditLogsByRole(roleScope: string, limit = 100): Promise<AuditLogEntry[]> {
  const isDevPortal = window.location.pathname.startsWith("/developer");
  const url = isDevPortal ? "/dev/audit/by-role" : "/admin/audit/logs/by-role";
  const response = await api.get<{ success: boolean; data: AuditLogEntry[] }>(url, {
    params: { role_scope: roleScope, limit },
  });
  return response.data.data;
}

// ── User CRUD ───────────────────────────────────────────────────────────

export interface AdminUserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  roleId: string;
  roleScope: string;
  isBanned: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminUserById(id: string): Promise<AdminUserDetail> {
  const response = await api.get<{ success: boolean; data: AdminUserDetail }>(`/admin/users/${id}`);
  return response.data.data;
}

export async function updateAdminUser(
  id: string,
  data: { firstName?: string; lastName?: string; email?: string; roleId?: string }
): Promise<AdminUserDetail> {
  const response = await api.patch<{ success: boolean; data: AdminUserDetail }>(`/admin/users/${id}`, data);
  return response.data.data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

// ── Database Tables ─────────────────────────────────────────────────────

export interface RolePolicyCatalog {
  tables: Array<{ name: string; actions: string[] }>;
  systemCapabilities: string[];
  basePolicies: Record<string, Record<string, string[]>>;
  baseSystemCapabilities: Record<string, string[]>;
}

export async function getAdminDatabaseTables(): Promise<RolePolicyCatalog> {
  const response = await api.get<{ success: boolean; data: RolePolicyCatalog }>("/admin/tables");
  return response.data.data;
}

// ── Onboarding Config ────────────────────────────────────────────────────

export interface OnboardingConfig {
  id: string;
  telegram_link: string;
  message: string;
  steps: string[];
  safety_tips: string[];
  footer: string;
  updated_at: string;
}

export async function getAdminOnboardingConfig(): Promise<OnboardingConfig> {
  const response = await api.get<{ success: boolean; data: OnboardingConfig }>("/admin/onboarding");
  return response.data.data;
}

export async function updateAdminOnboardingConfig(data: { telegramLink?: string; message?: string; steps?: string[]; safetyTips?: string[]; footer?: string }): Promise<OnboardingConfig> {
  const response = await api.put<{ success: boolean; data: OnboardingConfig }>("/admin/onboarding", data);
  return response.data.data;
}

// ── Review Moderation ─────────────────────────────────────────────────────

export interface AdminReview {
  id: string;
  stars: number;
  body: string;
  created_at: string;
  user_name: string;
  place_name: string;
  place_id: string;
  flagged_at?: string | null;
  deleted_at?: string | null;
}

export async function getAdminAllReviews(): Promise<AdminReview[]> {
  const response = await api.get<{ success: boolean; data: AdminReview[] }>("/admin/reviews", {
    params: { limit: 2000 },
  });
  return response.data.data;
}

export async function flagAdminReview(id: string): Promise<void> {
  await api.patch(`/admin/stalls/reviews/${id}/flag`);
}

export async function unflagAdminReview(id: string): Promise<void> {
  await api.patch(`/admin/stalls/reviews/${id}/unflag`);
}

export async function removeAdminReview(id: string): Promise<void> {
  await api.delete(`/admin/stalls/reviews/${id}/remove`);
}

// ── Profile ─────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roleScope: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const isDevPortal = window.location.pathname.startsWith("/developer");
  const url = isDevPortal ? "/dev/profile" : "/admin/profile";
  const response = await api.get<{ success: boolean; data: AdminProfile }>(url);
  return response.data.data;
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post("/auth/change-password", { currentPassword, newPassword });
}
