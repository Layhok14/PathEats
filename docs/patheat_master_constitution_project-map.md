# PathEat Master Project Map Index
## Absolute Source of Truth (Pre-Mapping 43 Distinct Framework Pages)

This master matrix serves as the single immutable coordination center for the PathEat platform architecture. It contains precisely 43 structural pages to satisfy the 42+ page capstone scope criteria, mapping code paths, network endpoints, operational role boundaries, and interface mechanics.

| Page Name | Client Router URI | Module Owner | Target RBAC Profile Permission | Backend API Endpoint Network Call | UI Action Links & Triggers Connected | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **UserHomePage** | `/` | Layhok | CONSUMER | `None (Static Bootstrap)` | Set Origin, Destination, Trigger Route Mapping | Not Started |
| **UserSearchPage** | `/search` | Layhok | CONSUMER | `POST /api/search/spatial` | Click Filter Chips, Pick Vendor Card | Not Started |
| **UserVendorDetailPage** | `/vendor/:id` | Layhok | CONSUMER | `GET /api/vendors/:id/profile` | Add to Favorites, Open Review Modal | Not Started |
| **UserFavoritesPage** | `/favorites` | Layhok | CONSUMER | `GET /api/user/favorites` | Unfavorite Item, Forward to Route View | Not Started |
| **UserProfilePage** | `/profile` | Layhok | CONSUMER | `GET/PUT /api/user/account` | Save Profile Info, Log Out | Not Started |
| **UserReviewsPage** | `/reviews` | Layhok | CONSUMER | `GET /api/user/reviews` | Delete Review Entry | Not Started |
| **UserHistoryPage** | `/history` | Layhok | CONSUMER | `GET /api/user/routes/log` | Reuse Previous Route Trajectory | Not Started |
| **UserNotificationPage** | `/notifications` | Layhok | CONSUMER | `GET /api/user/alerts` | Mark Notification As Read | Not Started |
| **UserSettingsPage** | `/settings` | Layhok | CONSUMER | `PUT /api/user/preferences` | Toggle Accessibility/Localization Modality | Not Started |
| **UserRoutePlannerPage**| `/route-planner` | Layhok | CONSUMER | `GET /api/spatial/routing` | Redraw Path Vector Canvas | Not Started |
| **UserHelpCenterPage** | `/help` | Layhok | CONSUMER | `POST /api/support/ticket` | Fire New Customer Complaint | Not Started |
| **VendorDashboardPage** | `/vendor/dashboard` | Smey | VENDOR | `GET /api/vendor/metrics` | View Daily Conversion Rates, Trends | Not Started |
| **VendorMenuPage** | `/vendor/menu` | Smey | VENDOR | `GET/POST /api/vendor/menu` | Add New Menu Product, Update Active State | Not Started |
| **VendorProfilePage** | `/vendor/profile` | Smey | VENDOR | `GET/PUT /api/vendor/details` | Drop Geolocation Map Pin, Edit Banner | Not Started |
| **VendorAnalyticsPage** | `/vendor/analytics` | Smey | VENDOR | `GET /api/vendor/stats/long` | Export Performance Spreadsheet | Not Started |
| **VendorOrdersPage** | `/vendor/orders` | Smey | VENDOR | `GET/PATCH /api/vendor/orders` | Toggle Cooking Status (Received -> Cooking -> Ready) | Not Started |
| **VendorReviewsMgmt** | `/vendor/reviews` | Smey | VENDOR | `GET/POST /api/vendor/feed` | Submit Official Response to Reviewer | Not Started |
| **VendorPromotionPage** | `/vendor/promos` | Smey | VENDOR | `GET/POST /api/vendor/deals` | Toggle Promo Banner Visibility | Not Started |
| **VendorSettingsPage** | `/vendor/settings` | Smey | VENDOR | `PUT /api/vendor/config` | Adjust Operational Hours Rules | Not Started |
| **VendorNotificationPage**| `/vendor/alerts` | Smey | VENDOR | `GET /api/vendor/pings` | Dismiss Operational Alerts | Not Started |
| **VendorOnboardingPage** | `/vendor/register` | Smey | VENDOR | `POST /api/vendor/onboard` | Submit Merchant Application Package | Not Started |
| **AdminDashboardPage** | `/admin/dashboard`| Seavpav | GLOBAL_ADMIN, CS_ADMIN | `GET /api/admin/telemetry/main` | View Multi-Actor Overview Metrics | Not Started |
| **AdminUserMgmtPage** | `/admin/users` | Seavpav | GLOBAL_ADMIN | `GET/POST /api/admin/users/mod`| Restrict User Token (Ban System Action) | Not Started |
| **AdminVendorMgmtPage** | `/admin/vendors` | Seavpav | GLOBAL_ADMIN | `GET/POST /api/admin/vendors/mod`| Revoke Stall Compliance Rights | Not Started |
| **AdminRoleAssignPage** | `/admin/roles` | Seavpav | GLOBAL_ADMIN | `POST /api/admin/roles/grant` | Mutate Access Token Privilege (Assign Role) | Not Started |
| **AdminAuditLogsPage** | `/admin/audit` | Seavpav | GLOBAL_ADMIN | `GET /api/admin/security/logs` | Search Security Event Index Rows | Not Started |
| **AdminSystemPrefsPage**| `/admin/settings` | Seavpav | GLOBAL_ADMIN | `PUT /api/admin/system/config` | Toggle Registration Portal State | Not Started |
| **AdminPlatformFeesPage**| `/admin/pricing` | Seavpav | GLOBAL_ADMIN | `PUT /api/admin/billing/rules` | Readjust Multi-Tier Vendor Rates | Not Started |
| **CustomerTicketsPage** | `/cs/tickets` | Seavpav | CUSTOMER_SERVICE | `GET /api/cs/ticket/queue` | Claim Target Operational Support Ticket | Not Started |
| **TicketDetailPage** | `/cs/tickets/:id` | Seavpav | CUSTOMER_SERVICE | `GET/POST /api/cs/ticket/:id` | Append Message Entry, Reassign Queue | Not Started |
| **UserComplaintsPage** | `/cs/complaints/user`| Seavpav | CUSTOMER_SERVICE | `GET /api/cs/user-disputes` | Flag Account Profile for Direct Escalation | Not Started |
| **VendorComplaintsPage**| `/cs/complaints/shop`| Seavpav | CUSTOMER_SERVICE | `GET /api/cs/vendor-disputes` | Initiate Vendor Operational Field Audit Request | Not Started |
| **ReviewModerationPage**| `/cs/reviews/mod` | Seavpav | CUSTOMER_SERVICE | `DELETE /api/cs/reviews/purge` | Strip Spammed Content Rows from Application | Not Started |
| **FAQManagementPage** | `/cs/knowledge-base`| Seavpav | CUSTOMER_SERVICE | `GET/POST /api/cs/faq` | Publish Macro Response Document | Not Started |
| **OnboardingReviewPage**| `/cs/applications` | Seavpav | CUSTOMER_SERVICE | `GET/PATCH /api/cs/verify` | Approve Fresh Vendor Registration Packet | Not Started |
| **DevDashboardPage** | `/dev/dashboard` | Seavpav | DEVELOPER_ADMIN | `GET /api/dev/health/system` | View Server Vitals, CPU/Memory Gauges | Not Started |
| **AdminBackupPage** | `/dev/backups` | Seavpav | DEVELOPER_ADMIN | `POST /api/dev/db/backup` | Trigger Explicit Programmatic Shell pg_dump | Not Started |
| **DatabaseSeedingPage** | `/dev/seeding` | Seavpav | DEVELOPER_ADMIN | `POST /api/dev/db/seed` | Run Python Target Generator Engine | Not Started |
| **ServerLogsPage** | `/dev/logs/server` | Seavpav | DEVELOPER_ADMIN | `GET /api/dev/streams/stdout` | Read Live Microservice Terminal Outflow | Not Started |
| **ErrorTrackerPage** | `/dev/logs/errors` | Seavpav | DEVELOPER_ADMIN | `GET /api/dev/streams/stderr` | Clear Active Target Exception Logs Queue | Not Started |
| **ETLExecutionPage** | `/dev/etl` | Seavpav | DEVELOPER_ADMIN | `POST /api/dev/jobs/run` | Force Re-index of OpenFreeMap Node Buffers | Not Started |
| **APIMonitoringPage** | `/dev/api-metrics` | Seavpav | DEVELOPER_ADMIN | `GET /api/dev/network/latency` | Inspect Network Pipeline Latency Gauges | Not Started |
| **PerformanceMetricsPage**| `/dev/db-perf` | Seavpav | DEVELOPER_ADMIN | `GET /api/dev/database/indexes` | Analyze Spatial GiST Scan Efficiency | Not Started |

---

## Maintenance Guardrails
* Before commanding an AI agent to engineer interface code, the developer must verify that the corresponding page entry exists in this map.
* Upon code generation, compiling, and validation, the status marker of the respective page must step forward (`Not Started` -> `In Progress` -> `Testing` -> `Done`).