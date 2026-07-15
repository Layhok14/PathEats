# Team Quiz

Purpose: help you check whether the team understands the main backend and database points before presentation.

How to use later: ask these after everyone finishes the video and their own role guide. This is meant to be light, not hard.

## How to run it

- Ask each person 2 to 3 questions from database
- Ask each person 2 to 3 questions from backend
- Ask 1 role-specific question based on their part
- Keep the whole check-in under 15 minutes

---

# Database section

## Q1

Why do we not put every table in the main ERD?

## Q2

Name 4 important business tables we should be ready to explain.

## Q3

What is the difference between a PostgreSQL dump backup and a CSV row backup?

## Q4

Why can some internal tables still appear in backup table choices?

## Q5

What can happen if someone chooses the wrong table for row recovery?

## Q6

Why is backup and recovery important for presentation?

---

# Backend section

## Q7

What is the simple request flow from frontend to database?

## Q8

Which backend layer is the real security boundary: frontend page or backend middleware?

## Q9

What do controllers usually do in this project?

## Q10

Where do more of the real business rules usually live: controller, service, or repository?

## Q11

Why is it important to understand the service and repository layer for presentation?

## Q12

What does Axios do in the frontend flow?

## Q13

What is the difference between authentication and authorization?

## Q14

What is the JWT access token used for?

## Q15

What happens to old sessions after forgot-password reset succeeds?

---

# Role-specific quick checks

## For Layhok

- How is a user connected to a role in the admin system?
- Why is row backup downloaded as CSV?
- Why are selector tables and ERD tables not always the same?

## For Pav

- What links menu items to places?
- Why is ownership checking important for vendor features?
- Which tables matter most for vendor flow?

## For Smey

- How does a consumer search request reach the database?
- Where do reviews get saved?
- Which tables matter most for consumer-facing features?

---

# Short answer key for you

## Database answers

### A1

Because the main ERD should focus on core business design, not every internal support table.

### A2

Any 4 strong examples:

- `users`
- `role`
- `places`
- `place_categories`
- `place_hours`
- `menu_items`
- `place_menu_items`
- `reviews`

### A3

- dump backup is for full database or table-level restore
- CSV is for selected row-level backup and restore

### A4

Because they are still real tables in the application schema, even if they are internal or support tables.

### A5

Recovery may fail, or it may restore data into the wrong logical place if the table is technically compatible.

### A6

Because teachers asked about reliability, backup method, and recovery method.

## Backend answers

### A7

Frontend -> Axios -> route -> middleware -> controller -> service -> repository/SQL -> database -> response back

### A8

Backend middleware

### A9

Controllers receive the request and pass work to services.

### A10

Mostly service and repository

### A11

Because those layers explain the real logic and database behavior, which is what teachers usually ask about.

### A12

It sends HTTP requests and helps attach auth tokens / handle API communication.

### A13

Authentication proves who the user is. Authorization checks what that user is allowed to do.

### A14

It proves the logged-in user identity for protected backend requests. The backend verifies it before allowing the request to continue.

### A15

The password is updated, OTPs are invalidated, and old refresh tokens are revoked so old sessions cannot continue.
