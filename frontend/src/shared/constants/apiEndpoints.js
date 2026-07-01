const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const ENDPOINTS = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,

  USER_PROFILE: `${API_BASE}/user/account`,
  USER_PREFERENCES: `${API_BASE}/user/preferences`,
  USER_FAVORITES: `${API_BASE}/user/favorites`,
  USER_REVIEWS: `${API_BASE}/user/reviews`,
  USER_HISTORY: `${API_BASE}/user/routes/log`,
  USER_ALERTS: `${API_BASE}/user/alerts`,

  SEARCH_SPATIAL: `${API_BASE}/search/spatial`,
  VENDOR_DETAIL: (id) => `${API_BASE}/vendors/${id}/profile`,
  ROUTING: `${API_BASE}/spatial/routing`,

  VENDOR_DASHBOARD: `${API_BASE}/vendor/metrics`,

  VENDOR_PROFILE: `${API_BASE}/vendor/details`,
  VENDOR_ORDERS: `${API_BASE}/vendor/orders`,
  VENDOR_REVIEWS: `${API_BASE}/vendor/feed`,
  VENDOR_PROMOS: `${API_BASE}/vendor/deals`,
  VENDOR_CONFIG: `${API_BASE}/vendor/config`,
  VENDOR_ONBOARD: `${API_BASE}/vendor/onboard`,

  ADMIN_TELEMETRY: `${API_BASE}/admin/telemetry`,
  ADMIN_USERS: `${API_BASE}/admin/users/mod`,
  ADMIN_VENDORS: `${API_BASE}/admin/vendors/mod`,
  ADMIN_ROLES: `${API_BASE}/admin/roles/grant`,
  ADMIN_AUDIT: `${API_BASE}/admin/security/logs`,
  ADMIN_SETTINGS: `${API_BASE}/admin/system/config`,
  ADMIN_PRICING: `${API_BASE}/admin/billing/rules`,

  CS_TICKETS: `${API_BASE}/cs/ticket/queue`,
  CS_TICKET: (id) => `${API_BASE}/cs/ticket/${id}`,
  CS_USER_DISPUTES: `${API_BASE}/cs/user-disputes`,
  CS_VENDOR_DISPUTES: `${API_BASE}/cs/vendor-disputes`,
  CS_REVIEWS_MOD: `${API_BASE}/cs/reviews/purge`,
  CS_FAQ: `${API_BASE}/cs/faq`,
  CS_VERIFY: `${API_BASE}/cs/verify`,

  DEV_HEALTH: `${API_BASE}/dev/health/system`,
  DEV_BACKUP: `${API_BASE}/dev/db/backup`,
  DEV_SEED: `${API_BASE}/dev/db/seed`,
  DEV_LOGS: `${API_BASE}/dev/streams/stdout`,
  DEV_ERRORS: `${API_BASE}/dev/streams/stderr`,
  DEV_ETL: `${API_BASE}/dev/jobs/run`,
  DEV_API_METRICS: `${API_BASE}/dev/network/latency`,
  DEV_DB_PERF: `${API_BASE}/dev/database/indexes`,
};
