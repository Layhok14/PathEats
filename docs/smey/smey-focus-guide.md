# Smey Focus Guide

Purpose: help Smey focus on consumer flow and user-facing data movement after learning the shared system picture.

How to use later: start here after the team overview video, then open the shared docs only when you need more database or backend detail.

## Your main job in presentation

You should be strongest at:

- consumer flow
- how users search, view places, and interact with reviews
- how consumer actions reach the backend and database
- which tables matter for consumer-facing features

## What to understand first

### 1. Consumer data flow

Read:

- [system-data-flow-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\system-data-flow-guide.md)

Focus on:

- search nearby places
- place detail flow
- review create/update/delete flow

### 2. Customer-facing tables

Read:

- [database-design-and-erd-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\database-design-and-erd-guide.md)

Focus on:

- `users`
- `places`
- `place_categories`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `reviews`
- `bookmarks`
- `routes`

### 3. Light backend understanding

Read:

- [system-data-flow-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\system-data-flow-guide.md)

Focus on:

- controller, service, repository meaning
- why backend is where validation happens
- why frontend alone is not enough

## Code areas to know

- `frontend/src/user/pages/UserSearchPage.tsx`
- `frontend/src/user/pages/UserVendorDetailPage.tsx`
- `frontend/src/user/hooks/useBookmarks.tsx`
- `frontend/src/user/hooks/useSavedRoutes.tsx`
- `backend/src/routes/placesRoutes.js`
- `backend/src/controllers/placesController.js`
- `backend/src/services/PlaceService.js`
- `backend/src/repositories/PlaceRepository.js`

## Simple questions you should be able to answer

- How does a consumer search for places?
- Which tables matter most for consumer features?
- Where do reviews get saved?
- Why is backend validation important?
- How does the system return data back to the page?

## AI prompt if you need help

Use this with an agent:

```text
Teach me the consumer side of this PathEats project in simple language.
My role is Smey.
Focus on:
1. how consumer actions go from page to backend to database
2. search, place detail, and review flow
3. important consumer-facing tables
4. easy teacher questions I may get

Use these docs first:
- docs/shared/system-data-flow-guide.md
- docs/shared/database-design-and-erd-guide.md

Keep it short and practical.
Show the main files and simple explanations only.
```
