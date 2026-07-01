# Supabase, Database, Security, and Implementation Addendum

## Supabase-Specific Clarification

This project uses Supabase, so database design, authentication, file storage, and authorization must be compatible with Supabase.

The application should use:

* Supabase PostgreSQL for relational data
* Supabase Auth for user authentication
* Supabase Storage for uploaded images/files
* Row Level Security or backend authorization logic where suitable
* Proper foreign keys between users, roles, vendors, stores, places, menu items, images, routes, backups, and admin activity

## Image Upload Rule

Do not store uploaded image files directly inside database tables.

Do not design fields that expect external random image URLs as the main image source.

Users, vendors, and admins should upload images from their local machine.

The database should store image metadata only, such as:

* image id
* related entity id
* storage bucket name
* storage object path
* public URL or signed URL reference if needed
* uploaded by
* created at
* image type or purpose

For Supabase, a `place_images` table should usually reference the uploaded file stored in Supabase Storage.

Recommended structure:

* `id`
* `place_id`
* `storage_bucket`
* `storage_path`
* `alt_text`
* `is_primary`
* `uploaded_by`
* `created_at`

The actual image file should be stored in Supabase Storage, not PostgreSQL.

## About `place_url`

If `place_url` means an external website link, Google Maps link, or vendor website, it should only exist if the application truly needs it.

If the application uses uploaded images only, then `place_url` should not be used for images.

Rename or remove ambiguous fields.

Use clear field names instead:

* `website_url` only if the store has an external website
* `map_url` only if there is a reason to store an external map link
* `storage_path` for uploaded images
* `image_url` only if generated from Supabase Storage and clearly documented

Do not mix image storage paths with external website URLs.

## Admin Role Boundary Clarification

There are three admin-related roles:

* Global Admin
* Developer
* Business Assistant

These roles do not necessarily require three completely separate applications at first.

Recommended approach:

Use one admin application first, with role-based access control.

Then show or hide pages, tabs, and actions depending on the logged-in admin role.

Only split into separate Developer and Business Assistant interfaces later if the current admin application becomes too large or confusing.

## Admin Role Scope

Global Admin should have the highest control.

Global Admin can:

* manage admin roles
* manage Developer accounts
* manage Business Assistant accounts
* manage vendors
* manage stores
* view system status
* access all admin-side modules
* supervise database-related operations

Developer should focus on technical/system operations.

Developer can:

* manage database tools
* manage backup
* manage recovery
* inspect system logs
* inspect database health
* fix technical records
* support technical admin functions

Developer should not automatically have full business authority unless explicitly required.

Business Assistant should focus on vendor/business support.

Business Assistant can:

* support vendor onboarding
* review vendor/store information
* help manage vendor-related records
* assist with menu/store setup
* review business-facing support requests

## Can Developer Add User Clients?

This needs a deliberate decision.

Recommended default:

Developer should not create normal consumer/user-client accounts from the admin UI unless there is a specific support reason.

Reason:

* Consumer accounts should normally register themselves.
* Developer is a technical role, not a customer-management role.
* Allowing Developer to create user clients increases privacy/security risk.

Allowed exception:

Developer may create or repair user records only through a controlled technical support workflow, with logging and Global Admin visibility.

## Can Each Role Have Multiple Accounts?

Yes.

Database design should support many accounts per role.

Example:

* many Global Admin accounts if allowed by policy
* many Developer accounts
* many Business Assistant accounts
* many Vendor accounts
* many Consumer accounts

Do not design roles as one-user-only unless the project explicitly requires it.

Recommended structure:

* `users`
* `roles`
* `user_roles` or `profiles.role_id`

If users can only have one role, `profiles.role_id` is enough.

If users can have multiple roles, use `user_roles`.

For flexibility, use `user_roles`.

## Current Phase Verification

Before continuing, Codex should verify whether Phase 1 and Phase 2 are already completed.

It must check:

* database schema status
* authentication status
* authorization status
* implemented user-side features
* implemented vendor-side features
* implemented admin-side features
* backup/recovery status
* route protection status
* storage/upload status

Codex should not assume phases are complete.

It must inspect the actual code and database migration files.

## Security and Error Handling Requirement

Every phase must include security and error handling checks.

Required checks:

* input validation
* required field validation
* type validation
* file type validation
* file size validation
* safe image upload handling
* protected routes
* redirect unauthenticated users to login
* prevent unauthorized role access
* prevent broken database writes
* prevent orphan records
* handle failed uploads
* handle failed backup
* handle failed recovery
* prevent wrong backup file upload
* prevent recovery from corrupt or incompatible files
* prevent accidental full database loss
* show clear user-facing error messages

Backup and recovery must be treated as high-risk features.

Recovery must include confirmation and validation before execution.

## Database Fit Check Per Phase

At the end of every phase, Codex must verify:

* Does the database design still fit the application?
* Do new features require new tables?
* Are relationships still logical?
* Are foreign keys correct?
* Are any tables unused?
* Are any UI features disconnected from database logic?
* Are Supabase Auth and application roles still aligned?
* Are storage paths and uploaded files handled correctly?

No phase should be accepted without this check.

## Pull Request Rule

If changes are organized as pull requests, create many small PRs instead of large mixed PRs.

Each PR should solve one focused issue only.

Good PR examples:

* Fix full-screen map rendering
* Add Supabase Storage upload for place images
* Add vendor-store ownership foreign key
* Add protected route middleware
* Redesign admin query tool table health tab
* Add backup file validation

Bad PR example:

* Redesign admin, fix database, add backup, change auth, and update vendor UI all at once

## Admin Redesign Requirement

Admin-side pages must be reviewed critically.

Some pages are currently:

* too static
* overloaded
* unclear
* ambiguous
* hard to use
* not connected to meaningful actions

Codex should consider:

* removing unnecessary sections
* merging duplicate pages
* simplifying overloaded tabs
* adding meaningful actions
* adding useful summaries
* improving layout hierarchy
* making each tab have one clear goal

Each admin page should answer:

* What is this page for?
* What records does it manage?
* What actions can the admin take?
* What role should access it?
* What database tables does it depend on?

## Research and Pattern Requirement

Before redesigning complex admin features, Codex should inspect:

* existing project code
* local source files
* available open-source folder patterns
* official documentation if a package/framework API is needed

Do not guess APIs.

If using Zustand, inspect existing state management first.

If Zustand is not installed, Codex should confirm before adding it.

Use Zustand for suitable shared client state such as:

* authenticated profile state
* role/session UI state
* map interaction state
* selected store/place state
* admin filters
* temporary form state where appropriate

Do not overuse global state for simple local component state.

## Implementation Priority

Performance is the first priority.

Clean code is the second priority.

However, code must still remain understandable and maintainable.

Codex should:

* build the minimal working version first
* optimize obvious slow paths
* avoid unnecessary re-renders
* avoid duplicated queries
* use pagination for large tables
* avoid loading huge datasets at once
* clean up structure after functionality works

## Required Codex Rules

1. Keep every change small and reviewable.
2. Search the existing code before creating new abstractions.
3. If using a package/framework, reference its local source or official documentation before guessing APIs.
4. Build the minimal working version first.
5. After it works, run a code-structure cleanup pass.
6. Run relevant tests, typechecks, lint checks, and build checks where available.
7. Summarize:

   * what changed
   * what was tested
   * what still needs human judgment

## Confirmation Rule

After each phase, Codex must stop and ask for confirmation before continuing.

It should report:

* completed work
* files changed
* database changes
* auth/security changes
* UI changes
* tests/checks run
* risks
* unresolved questions
* recommended next phase

Codex must not continue automatically into the next phase.
