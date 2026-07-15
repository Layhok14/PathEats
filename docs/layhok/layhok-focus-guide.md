# Layhok Focus Guide

Purpose: help Layhok focus on the global admin and developer-side explanation without drowning in too much detail.

How to use later: start here after watching the team overview video, then use the shared docs only when you need more detail.

## Your main job in presentation

You should be strongest at:

- overall backend structure
- admin management flow
- backup and recovery logic
- why table choices and ERD scope are different

## What to understand first

### 1. The full request flow

Read:

- [system-data-flow-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\system-data-flow-guide.md)

Focus on:

- Axios -> route -> middleware -> controller -> service -> repository -> database
- why backend is the real security layer

### 2. Admin role and user management

Read:

- [admin-role-user-management-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\admin-role-user-management-guide.md)
- [authentication-authorization-password-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\authentication-authorization-password-guide.md)

Focus on:

- how roles define privileges
- how users are assigned by `roleId`
- how backend derives `role_scope`
- which files own create role, create user, update role, update user
- why editing an existing role affects backend permission checks on the next API request
- why frontend menu visibility may need refresh or re-login after role changes
- why custom roles use existing interfaces instead of creating a new interface automatically
- how JWT, refresh token, and SMTP forgot-password flow work at a simple level

### 3. Backup and recovery

Read:

- [backup-recovery-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\backup-recovery-guide.md)
- [database-presentation-qa-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\database-presentation-qa-guide.md)

Focus on:

- full dump vs specific table vs specific row
- why row backup is CSV
- why many tables may appear
- what happens if wrong table or wrong condition is chosen

## Code areas to know

- `frontend/src/admin/pages/global/AdminManagementPage.tsx`
- `frontend/src/admin/pages/developer/BackupManagerPage.tsx`
- `backend/src/routes/adminRoutes.js`
- `backend/src/routes/devRoutes.js`
- `backend/src/controllers/adminController.js`
- `backend/src/services/AdminService.js`
- `backend/src/services/AuthService.js`
- `backend/src/services/emailService.js`
- `backend/src/middlewares/authMiddleware.js`
- `backend/src/middlewares/privilegeGuard.js`
- `backend/src/services/backupService.js`
- `backend/src/services/backupRecoveryService.js`
- `backend/src/repositories/adminRepository.js`
- `backend/src/repositories/TokenRepository.js`
- `backend/src/repositories/OtpRepository.js`

## Simple questions you should be able to answer

- Where does real permission checking happen?
- How is a user linked to a role?
- Why is backend more important than frontend for security?
- If an existing role is edited, what updates immediately and what may need refresh?
- Do new custom roles get a brand-new interface automatically?
- What is JWT used for?
- What does SMTP do in forgot password?
- Why is row backup downloaded as CSV?
- Why are some tables real but not shown in the main ERD?

## AI prompt if you need help

Use this with an agent:

```text
Teach me the admin and developer side of this PathEats project in simple language.
My role is Layhok.
Focus on:
1. request flow from frontend to database
2. admin role and user management
3. backup and recovery
4. common teacher questions

Use these docs first:
- docs/shared/system-data-flow-guide.md
- docs/shared/admin-role-user-management-guide.md
- docs/shared/authentication-authorization-password-guide.md
- docs/shared/backup-recovery-guide.md
- docs/shared/database-presentation-qa-guide.md

Do not be too technical.
Explain the important files and functions.
Give me likely questions and simple answers.
```
