# System Governance and Administrative Account Policy

## Purpose

The system intentionally separates business administration from technical maintenance. Administrative operations are performed through the application layer rather than direct database access to preserve security, consistency, and traceability.

---

## Administrative Roles

The system contains three administrative roles:

- `GLOBAL_ADMIN`
- `BUSINESS_ASSISTANCE`
- `DEVELOPER_ADMIN`

These roles are predefined and implemented in software. No dynamic role creation is supported. Adding a new role requires source code modifications, permission updates, and corresponding interface implementation.

---

## Administrative Account Creation

Global administrators are allowed to create new administrative accounts. However, they may only assign one of the two existing administrative roles:

- `GLOBAL_ADMIN`
- `DEVELOPER_ADMIN`

Global administrators cannot create arbitrary roles. Administrative account creation is intended only for expanding the existing administration team.

---

## Role and Interface Relationship

Administrative accounts inherit the interface corresponding to their assigned role.

For example:

- A newly created `GLOBAL_ADMIN` account receives access to the existing global administration interface.
- A newly created `DEVELOPER_ADMIN` account receives access to the existing developer interface.

Since only predefined roles are supported, every administrative account always has a corresponding interface. There is no concept of an administrative role without an implemented UI.

---

## Direct Database Access Policy

Administrative staff are prohibited from interacting directly with the production database through:

- pgAdmin
- psql
- Supabase SQL Editor
- external database clients

Business and administrative operations must always follow:

```
Frontend → API → Service Layer → Repository Layer → PostgreSQL
```

This guarantees:

- validation,
- centralized authorization,
- enforcement of business rules,
- consistent application behavior,
- traceability of administrative actions.

---

## Global Admin Responsibilities

Global administrators perform business management.

They may:

- view users,
- suspend and reactivate users,
- approve or suspend vendors,
- moderate content,
- manage categories,
- create administrative accounts,
- assign `GLOBAL_ADMIN` or `DEVELOPER_ADMIN` roles.

They may not:

- create arbitrary roles,
- modify user passwords,
- edit user profile information,
- bypass application workflows,
- directly manipulate production data through database tools.

---

## Business Assistance Responsibilities

Business assistants perform vendor-facing operational tasks.

They may:

- configure vendor onboarding (Telegram link, message),
- create, update, and delete stalls for any vendor,
- flag, unflag, and remove reviews,
- view vendor and stall information.

They may not:

- manage users or roles,
- access developer or system-level tools,
- modify system settings outside onboarding configuration.

---

## Developer Admin Responsibilities

Developer administrators perform technical maintenance.

They may:

- inspect system health,
- monitor logs,
- maintain infrastructure,
- perform migrations,
- diagnose application issues.

Developer administrators should not perform ordinary business moderation unless explicitly required by system policy.

---

## Traceability Principle

Administrative actions must always be performed through the application.

Examples:

- `GLOBAL_ADMIN` suspends a user/vendor.
- `GLOBAL_ADMIN` creates a `DEVELOPER_ADMIN` account.
- `DEVELOPER_ADMIN` performs a database migration.

Because all actions pass through the application layer, they can be consistently recorded and traced.

---

## Design Principle

The system intentionally favors controlled administration over unrestricted flexibility. Administrative accounts may be created as needed, but the set of administrative roles is fixed. New types of roles require software changes rather than being dynamically created by administrators. This ensures predictable authorization behavior, easier maintenance, and stronger security.
