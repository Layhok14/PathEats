BEGIN;

UPDATE "role"
SET table_privileges = table_privileges || jsonb_build_object(
  'user_preferences', '["SELECT","INSERT","UPDATE"]'::jsonb,
  'user_profile_images', '["SELECT","INSERT","UPDATE","DELETE"]'::jsonb
),
updated_at = NOW()
WHERE name IN ('CONSUMER', 'VENDOR', 'GLOBAL_ADMIN');

COMMIT;
