-- Remove CHECK constraint on users.role_scope so any role from the "role" table can be assigned
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_scope_check;
