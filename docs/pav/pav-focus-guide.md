# Pav Focus Guide

Purpose: help Pav focus on vendor flow and business assistance understanding after learning the shared system picture.

How to use later: begin here after the team overview video, then return to shared docs only when you need backup detail or deeper backend context.

## Your main job in presentation

You should be strongest at:

- vendor flow
- how data moves when a vendor creates or manages stalls
- how business-side/admin-side support connects to vendor operations
- which database tables matter for vendor-facing features

## What to understand first

### 1. Vendor data flow

Read:

- [system-data-flow-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\system-data-flow-guide.md)

Focus on:

- vendor create stall flow
- vendor menu and place ownership
- how backend validates and saves vendor actions

### 2. Business tables that matter most

Read:

- [database-design-and-erd-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\database-design-and-erd-guide.md)

Focus on:

- `users`
- `places`
- `place_categories`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `place_images`
- `menu_item_images`
- `reviews`

### 3. Light backup understanding

Read:

- [backup-recovery-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\backup-recovery-guide.md)

Focus on:

- why backup matters for data reliability
- simple difference between dump and CSV
- why wrong table choice matters for business data

### 4. Light login and permission understanding

Read:

- [authentication-authorization-password-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\authentication-authorization-password-guide.md)

Focus on:

- authentication means proving who the user is
- authorization means checking what the vendor or business-side user can do
- backend permission checks matter more than frontend menu visibility

## Code areas to know

- `frontend/src/vendor/pages/StallCreatePage.tsx`
- `frontend/src/vendor/pages/StallDetailPage.tsx`
- `frontend/src/vendor/pages/MenuItemsPage.tsx`
- `backend/src/routes/vendorRoutes.js`
- `backend/src/controllers/vendorController.js`
- `backend/src/services/VendorService.js`
- `backend/src/repositories/VendorRepository.js`
- `backend/src/repositories/PlaceRepository.js`
- `backend/src/middlewares/authMiddleware.js`
- `backend/src/middlewares/privilegeGuard.js`

## Simple questions you should be able to answer

- How does a vendor create a stall?
- Which tables are most important for vendor features?
- Why is ownership checking important?
- What links menu items to places?
- What is the difference between login and permission checking?
- Why should not every internal table appear in the main ERD?

## AI prompt if you need help

Use this with an agent:

```text
Teach me the vendor and business-side flow of this PathEats project in simple language.
My role is Pav.
Focus on:
1. how vendor actions go from frontend to backend to database
2. the important vendor-related tables
3. how place and menu ownership works
4. easy teacher questions I may get

Use these docs first:
- docs/shared/system-data-flow-guide.md
- docs/shared/database-design-and-erd-guide.md
- docs/shared/backup-recovery-guide.md
- docs/shared/authentication-authorization-password-guide.md

Do not make it long.
I want the important flow, files, and likely questions only.
```
