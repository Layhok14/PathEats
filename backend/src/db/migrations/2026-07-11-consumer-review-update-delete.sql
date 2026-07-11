-- Update CONSUMER role to allow editing and deleting their own reviews.

UPDATE "role"
SET table_privileges = '{"users": ["SELECT"], "reviews": ["SELECT", "INSERT", "UPDATE", "DELETE"]}'::jsonb
WHERE name = 'CONSUMER';
