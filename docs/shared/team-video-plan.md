# Team Video Plan

Purpose: help you record one short video that gives the team the overall picture first, then sends each member to the right files for deeper study.

How to use later: if someone joins late or feels lost, use this file as the fastest team alignment script.

## Target length

Keep the video around 8 to 10 minutes.

- 3 to 4 minutes: overall system picture
- 2 to 3 minutes: backend and data flow
- 2 to 3 minutes: database and presentation focus
- 1 minute: what each member should study next

Do not try to explain every file. The goal is alignment, not full teaching.

## Video goal

By the end of the video, each teammate should know:

- what the project does at a high level
- how frontend, backend, and database connect
- what the teachers are likely to ask
- what their own part is
- which docs they should study next

## Simple speaking flow

### Part 1 — Start with the big picture

Say:

- Our project is PathEats.
- It has multiple roles: consumer, vendor, global admin, and business assistance.
- For presentation, we need to explain not just screens, but how the system works underneath.
- The main focus is backend flow and database design, because that is what teachers usually ask us to defend.

### Part 2 — Explain the system in one simple line

Say:

- A user does something on the frontend.
- The request goes through Axios.
- It reaches Express routes.
- Middleware checks auth and role.
- Controller calls service.
- Service applies business logic.
- Repository or SQL talks to PostgreSQL.
- Then the response goes back to the frontend.

Main file to show:

- [system-data-flow-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\system-data-flow-guide.md)

### Part 3 — Explain backend clearly but simply

Say:

- The backend is the real control center.
- Frontend visibility is not real security.
- Backend middleware is what actually checks permission.
- The main backend layers are routes, middleware, controller, service, repository, and database.
- Authentication proves who the user is with email, password, JWT access token, and refresh token.
- Authorization checks what that user can do using role scope, table privileges, and system capabilities.
- Forgot password uses OTP email through SMTP, then revokes old sessions after password reset.

Important message:

- If teacher asks “where is the real logic,” the answer is mostly in service and repository, not just the page.

### Part 4 — Explain database scope for presentation

Say:

- Not every table in the database should appear in the main ERD.
- We need to separate business tables from internal support tables.
- Our main ERD should focus on user, role, places, menu items, place-menu relation, place hours, reviews, and category.

Main files to show:

- [database-design-and-erd-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\database-design-and-erd-guide.md)
- [database-presentation-qa-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\database-presentation-qa-guide.md)

### Part 5 — Explain backup and recovery in easy words

Say:

- Full database or specific-table backup uses PostgreSQL dump.
- Specific-row backup uses CSV.
- Recovery checks the file type and restores differently for dump and CSV.
- Teachers may ask why many tables appear, why row backup is CSV, or what happens if wrong table/condition is chosen.

Main file to show:

- [backup-recovery-guide.md](D:\Desktop\CADT\Year_2\Term3\Project\Food\Update\PathEats\docs\shared\backup-recovery-guide.md)

### Part 6 — Explain role assignment for the team

Say:

- Layhok focuses on global admin and developer-side understanding.
- Pav focuses on vendor and business assistance flow.
- Smey focuses on consumer flow.
- Everyone still needs the overall system picture first, then goes deeper into their own part.

### Part 7 — Give the team their next step

Say:

- After this video, each person should read only their own guide first.
- Then they can return to the shared docs when they need more detail.
- The goal is not to memorize everything, but to understand their path and answer simple questions confidently.

## Suggested screen order while recording

1. `docs/shared/team-collaboration-context.md`
2. `docs/shared/system-data-flow-guide.md`
3. `docs/shared/authentication-authorization-password-guide.md`
4. `docs/shared/database-design-and-erd-guide.md`
5. `docs/shared/backup-recovery-guide.md`
6. each member folder:
   - `docs/layhok`
   - `docs/pav`
   - `docs/smey`

## What not to do in the video

- do not read large paragraphs
- do not explain every SQL detail
- do not explain every table one by one
- do not spend too much time on UI
- do not go deep into edge cases unless a teacher is likely to ask it

## End the video with this

Say:

- First understand the full picture.
- Then go to your own guide and study your own role more deeply.
- After that, we will do a short quiz together before presentation.
