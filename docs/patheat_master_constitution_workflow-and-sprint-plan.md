# PathEat Team Operations Manual
## Hybrid Scrum-XP Framework, Sprint Master Plan, and Team Governance

This operating protocol defines how work moves through the development loop, tracking features from conception to deployment. It establishes clear accountability and engineering loops to manage code generation for the team.

---

## 1. Team Working Agreement

### 1.1 Individual Area Ownership
* **Leng Layhok**: End-to-end Consumer Domain (11 pages). Focuses on spatial calculation interfaces, route trace overlays via OpenFreeMap, search matrices, and user profile management.
* **Kong Leak Smey**: End-to-end Vendor Domain (10 pages). Focuses on registration pipelines, inventory control states, sales metric dashboards, and real-time mapping hooks.
* **Keo Seavpav**: Complete Three-Tier Administrative Domain (22 pages). Focuses on core dashboards, support queue workflows, validation operations, and developer sub-shell utilities.

### 1.2 Core Integration Principles
1.  **No Solo Branches**: Direct deployment or force pushing to the `main` or `develop` branches is strictly prohibited.
2.  **Continuous Synchronization**: Code sync loops must be executed daily. Do not warehouse disconnected local workspaces for more than 48 hours to minimize merge conflicts.
3.  **Strict Context Alignment**: Before generating features using an AI assistant, you must use the latest unified file baseline tree.

---

## 2. 4-Week Sprint Master Plan

```text
  WEEK 1: Core Scaffolding          WEEK 2: Interaction Engine        WEEK 3: RBAC & Governance        WEEK 4: Hardening & Defense
┌───────────────────────────────┐ ┌───────────────────────────────┐ ┌───────────────────────────────┐ ┌───────────────────────────────┐
│ • Baseline DB Schema Modeling │ │ • User Map Canvas Engine      │ │ • Split 3 Admin Roles Pages   │ │ • Global System Cross-Testing │
│ • App Directory Structural Tree│ │ • Vendor Onboarding Pipeline  │ │ • Shell Backup Scripts Integration│ • Purge Internal Console Logs │
│ • Shared Core Layout Modules  │ │ • PostGIS Spatial Proximity   │ │ • Support Ticket Dispatcher   │ │ • Production Render Containers│
│ • Token Security Setup (JWT)  │ │   Join Queries Architecture   │ │   Queue Workflows Integration │ │ • Academic Term Deliverables │
└───────────────────────────────┘ └───────────────────────────────┘ └───────────────────────────────┘ └───────────────────────────────┘
```

### 2.1 Sprint 1 (Foundation & Baseline Modeling)
* **Goal**: Establish system infrastructure and setup common workspace layers.
* **Deliverables**: Database layout migration, JWT auth middleware configuration, base Axios client generation, and layout setups for all actors.

### 2.2 Sprint 2 (Core Interaction & Proximity Architecture)
* **Goal**: Ship core product search systems for users and business entryways for street vendors.
* **Deliverables**: User OpenFreeMap route interface canvas integration, vendor map-pin capture, and spatial database optimization.

### 2.3 Sprint 3 (Administrative RBAC & Operations Integration)
* **Goal**: Deploy admin operational capabilities across three explicit internal subdivisions.
* **Deliverables**: Global settings tables, customer dispute queues, and developer shell tools (`pg_dump`/`pg_restore`).

### 2.4 Sprint 4 (Hardening, Cloud Deployment, and Project Defense)
* **Goal**: Comprehensive optimization, quality assurance testing, and cloud delivery.
* **Deliverables**: Complete automated data seeding validation, frontend delivery to Vercel, API orchestration deployment to Render, console trace cleanup, and generation of documentation.

---

## 3. Daily Extreme Programming (XP) Coordination Loop

### 3.1 Lightweight Status Sync (5-Minute Sync Rules)
The team executes a rapid coordination check daily to identify blockers. Each member answers three concise questions:
1.  *Which specific page id or backend route did I fully integrate and test yesterday?*
2.  *Which exact cell row inside the Master Project Map index am I tackling today?*
3.  *What technical roadblocks are currently halting my pipeline?*

### 3.2 Iterative Refactoring Mandate
AI code generators can produce redundant blocks. Code cleanup must happen continuously:
* **The Guardrail**: Refactor code immediately after it is generated. Never pile unverified code blocks on top of each other.
* **The Routine**: Review variables for consistency, remove boilerplate code, and clean up formatting immediately after generation.

---

## 4. Quality Gateways & Checklists

### 4.1 Definition of Done (DoD) Checklist
A feature entry is considered complete only after passing these local verification steps:
* [ ] **Code Isolation**: Code is successfully compiled and registered in the project directory tree without duplication.
* [ ] **Layout Responsiveness**: Page interfaces display correctly across both mobile displays and desktop environments.
* [ ] **HCI Adaptation**: Interfaces change cleanly when light/dark theme switches are triggered.
* [ ] **Terminal Cleanliness**: Browser console streams and runtime service shells are free of warnings and error traces.
* [ ] **Operational Connectivity**: Active navigation components, interactive buttons, links, and forms map directly to live backend route hooks or valid system views.
* [ ] **Database Integration**: Relational operations handle data properly through PostGIS query buffers.
* [ ] **Source of Truth Sync**: The corresponding feature status row in the master `project-map.md` has been moved to `Done`.

### 4.2 Merge Review Gateway Checklist
Before a team member approves a GitHub Pull Request to merge a feature branch into `develop`, they must verify:
* [ ] The branch has pulled the latest changes from `develop` and resolved any merge conflicts locally.
* [ ] No raw SQL syntax strings exist outside the `repositories/` layer.
* [ ] All authorization check points implement explicit role verification arrays via `restrictToRoles()`.
* [ ] Active troubleshooting logs (`console.log`) have been removed from the file modifications list.