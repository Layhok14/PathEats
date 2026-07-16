const define = (tag, secured, definitions) => definitions.trim().split("\n").map((line) => {
  const [method, path] = line.trim().split(/\s+/, 2);
  return { method: method.toLowerCase(), path, tag, secured };
});

const publicRoutes = define("Public", false, `
GET /api/health
GET /api/storage/images/{token}
GET /api/vendor/onboarding
GET /api/places
POST /api/places/search
POST /api/places/score
POST /api/places/route
GET /api/places/count
GET /api/places/categories
GET /api/places/reviews/all
GET /api/places/{id}
GET /api/places/{id}/reviews
`);

const authPublicRoutes = define("Auth", false, `
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/verify-otp
POST /api/auth/reset-password
`);

const authProtectedRoutes = define("Auth", true, `
POST /api/auth/logout-all
POST /api/auth/change-password
`);

const consumerRoutes = define("User", true, `
GET /api/user/profile
PUT /api/user/profile
POST /api/user/profile/image
GET /api/user/preferences
PUT /api/user/preferences
GET /api/user/bookmarks
POST /api/user/bookmarks
DELETE /api/user/bookmarks/{placeId}
GET /api/user/routes
POST /api/user/routes
DELETE /api/user/routes
PATCH /api/user/routes/{id}
DELETE /api/user/routes/{id}
GET /api/user/history
POST /api/user/history
DELETE /api/user/history
DELETE /api/user/history/{id}
POST /api/places/{id}/reviews
PATCH /api/places/{id}/reviews/{reviewId}
DELETE /api/places/{id}/reviews/{reviewId}
`);

const vendorRoutes = define("Vendor", true, `
GET /api/vendor/onboarding
POST /api/vendor/uploads/images
GET /api/vendor/profile
PUT /api/vendor/profile
POST /api/vendor/profile/image
POST /api/vendor/change-password
GET /api/vendor/dashboard
GET /api/vendor/stalls/nearby
GET /api/vendor/stalls
POST /api/vendor/stalls
GET /api/vendor/stalls/{id}
PUT /api/vendor/stalls/{id}
GET /api/vendor/stalls/{id}/impact
DELETE /api/vendor/stalls/{id}
GET /api/vendor/items
GET /api/vendor/items/{itemId}/links
POST /api/vendor/items
PUT /api/vendor/items/{itemId}
DELETE /api/vendor/items/{itemId}
GET /api/vendor/reviews
GET /api/vendor/stalls/{id}/items
POST /api/vendor/stalls/{id}/items
PUT /api/vendor/stalls/{id}/item-links/{itemId}
PUT /api/vendor/stalls/{id}/items/{itemId}
DELETE /api/vendor/stalls/{id}/items/{itemId}
`);

const developerRoutes = define("Developer", true, `
GET /api/dev/health
GET /api/dev/database
GET /api/dev/logs
GET /api/dev/api-metrics
GET /api/dev/queries/presets
GET /api/dev/queries/presets/all
POST /api/dev/queries/presets
PUT /api/dev/queries/presets/{id}
DELETE /api/dev/queries/presets/{id}
PATCH /api/dev/queries/presets/{id}/used
POST /api/dev/query
GET /api/dev/query/history
GET /api/dev/maintenance
GET /api/dev/errors
GET /api/dev/activity-log
GET /api/dev/backups
GET /api/dev/backups/tables
POST /api/dev/backups
GET /api/dev/backups/{id}/download
PATCH /api/dev/backups/{id}
POST /api/dev/backups/{id}/pause
POST /api/dev/backups/{id}/resume
DELETE /api/dev/backups/{id}
GET /api/dev/backups/scheduled
GET /api/dev/backups/scheduled/{id}/download
DELETE /api/dev/backups/scheduled/{id}
GET /api/dev/recovery
POST /api/dev/recovery
GET /api/dev/reviews
GET /api/dev/user-management/overview
GET /api/dev/vendor-management/overview
GET /api/dev/audit/by-role
GET /api/dev/profile
`);

const adminRoutes = define("Admin", true, `
GET /api/admin/db/check
GET /api/admin/telemetry
GET /api/admin/roles
POST /api/admin/roles
PATCH /api/admin/roles/{id}
DELETE /api/admin/roles/{id}
GET /api/admin/users
POST /api/admin/users
GET /api/admin/user-management/overview
PATCH /api/admin/users/{id}/role
PATCH /api/admin/users/{id}/status
POST /api/admin/users/{id}/ban
GET /api/admin/users/{id}
PATCH /api/admin/users/{id}
DELETE /api/admin/users/{id}
GET /api/admin/vendors
GET /api/admin/vendor-management/overview
GET /api/admin/place-categories
POST /api/admin/vendors/{id}/approve
GET /api/admin/stall-management/options
GET /api/admin/audit/activity
GET /api/admin/audit/logs
GET /api/admin/audit/logs/by-role
GET /api/admin/tables
GET /api/admin/stalls
GET /api/admin/stalls/owner/{ownerId}
GET /api/admin/stalls/{id}
POST /api/admin/stalls
PATCH /api/admin/stalls/{id}
PATCH /api/admin/stalls/{id}/toggle
DELETE /api/admin/stalls/{id}
GET /api/admin/stalls/{id}/impact
GET /api/admin/menu-items
PATCH /api/admin/menu-items/{id}
POST /api/admin/stalls/{placeId}/menu-items
PUT /api/admin/stalls/{placeId}/menu-item-links/{itemId}
DELETE /api/admin/stalls/menu-items/{id}
GET /api/admin/menu-items/{id}/links
POST /api/admin/stalls/place-categories
DELETE /api/admin/stalls/place-categories/{id}
POST /api/admin/stalls/{placeId}/place-hours
DELETE /api/admin/stalls/place-hours/{id}
GET /api/admin/reviews
GET /api/admin/stalls/{placeId}/reviews
POST /api/admin/stalls/{placeId}/reviews
DELETE /api/admin/stalls/reviews/{id}
GET /api/admin/health
POST /api/admin/audit/kill-query
GET /api/admin/onboarding
PUT /api/admin/onboarding
PATCH /api/admin/stalls/reviews/{id}/flag
PATCH /api/admin/stalls/reviews/{id}/unflag
DELETE /api/admin/stalls/reviews/{id}/remove
GET /api/admin/categories
GET /api/admin/profile
`);

const routeCatalog = [
  ...publicRoutes,
  ...authPublicRoutes,
  ...authProtectedRoutes,
  ...consumerRoutes,
  ...vendorRoutes,
  ...developerRoutes,
  ...adminRoutes,
];

const displaySummary = (method, path) => {
  const action = { get: "Get", post: "Create or execute", put: "Replace", patch: "Update", delete: "Delete" }[method] || method;
  return `${action} ${path.replace(/^\/api\//, "").replaceAll("/", " ")}`;
};

export function applyRouteCatalog(specification) {
  specification.paths ||= {};
  for (const route of routeCatalog) {
    specification.paths[route.path] ||= {};
    if (specification.paths[route.path][route.method]) continue;
    const parameters = [...route.path.matchAll(/\{([^}]+)\}/g)].map((match) => ({
      in: "path",
      name: match[1],
      required: true,
      schema: { type: "string" },
    }));
    specification.paths[route.path][route.method] = {
      tags: [route.tag],
      summary: displaySummary(route.method, route.path),
      security: route.secured ? [{ BearerAuth: [] }] : [],
      ...(parameters.length > 0 && { parameters }),
      ...(["post", "put", "patch"].includes(route.method) && {
        requestBody: {
          required: false,
          content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
        },
      }),
      responses: {
        200: { description: "Successful response" },
        ...(["post"].includes(route.method) && { 201: { description: "Resource created" } }),
        ...(route.secured && { 401: { description: "Authentication required" }, 403: { description: "Insufficient permission" } }),
        400: { description: "Invalid request" },
      },
    };
  }
  return specification;
}

export { routeCatalog };
