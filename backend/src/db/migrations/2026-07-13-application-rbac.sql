BEGIN;

ALTER TABLE "role"
  ADD COLUMN IF NOT EXISTS base_scope TEXT,
  ADD COLUMN IF NOT EXISTS system_capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE "role"
SET base_scope = CASE
  WHEN name IN ('CONSUMER','VENDOR','GLOBAL_ADMIN','DEVELOPER_ADMIN','BUSINESS_ASSISTANCE') THEN name
  ELSE 'GLOBAL_ADMIN'
END
WHERE base_scope IS NULL;

UPDATE "role"
SET is_system = TRUE
WHERE name IN ('CONSUMER','VENDOR','GLOBAL_ADMIN','DEVELOPER_ADMIN','BUSINESS_ASSISTANCE');

UPDATE "role" SET table_privileges = CASE name
  WHEN 'CONSUMER' THEN '{"users":["SELECT","UPDATE"],"places":["SELECT"],"menu_items":["SELECT"],"place_menu_items":["SELECT"],"reviews":["SELECT","INSERT","UPDATE","DELETE"],"routes":["SELECT","INSERT","UPDATE","DELETE"],"bookmarks":["SELECT","INSERT","UPDATE","DELETE"],"search_history":["SELECT","INSERT","DELETE"]}'::jsonb
  WHEN 'VENDOR' THEN '{"users":["SELECT","UPDATE"],"places":["SELECT","INSERT","UPDATE","DELETE"],"place_categories":["SELECT"],"place_hours":["SELECT","INSERT","UPDATE","DELETE"],"place_images":["SELECT","INSERT","UPDATE","DELETE"],"menu_items":["SELECT","INSERT","UPDATE","DELETE"],"menu_item_images":["SELECT","INSERT","UPDATE","DELETE"],"place_menu_items":["SELECT","INSERT","UPDATE","DELETE"],"reviews":["SELECT"]}'::jsonb
  WHEN 'BUSINESS_ASSISTANCE' THEN '{"users":["SELECT","INSERT","UPDATE"],"places":["SELECT","INSERT","UPDATE","DELETE"],"place_categories":["SELECT"],"place_hours":["SELECT","INSERT","UPDATE","DELETE"],"place_images":["SELECT","INSERT","UPDATE","DELETE"],"menu_items":["SELECT","INSERT","UPDATE","DELETE"],"menu_item_images":["SELECT","INSERT","UPDATE","DELETE"],"place_menu_items":["SELECT","INSERT","UPDATE","DELETE"],"reviews":["SELECT","UPDATE","DELETE"],"onboarding_config":["SELECT","UPDATE"],"audit_log":["SELECT"]}'::jsonb
  WHEN 'GLOBAL_ADMIN' THEN '{"users":["SELECT","INSERT","UPDATE","DELETE"],"places":["SELECT","INSERT","UPDATE","DELETE"],"place_categories":["SELECT","INSERT","UPDATE","DELETE"],"place_hours":["SELECT","INSERT","UPDATE","DELETE"],"place_images":["SELECT","INSERT","UPDATE","DELETE"],"menu_items":["SELECT","INSERT","UPDATE","DELETE"],"menu_item_images":["SELECT","INSERT","UPDATE","DELETE"],"place_menu_items":["SELECT","INSERT","UPDATE","DELETE"],"reviews":["SELECT","INSERT","UPDATE","DELETE"],"routes":["SELECT","INSERT","UPDATE","DELETE"],"bookmarks":["SELECT","INSERT","UPDATE","DELETE"],"search_history":["SELECT","DELETE"],"onboarding_config":["SELECT","UPDATE"],"audit_log":["SELECT"],"role":["SELECT","INSERT","UPDATE","DELETE"],"backup_profiles":["SELECT","INSERT","UPDATE","DELETE"],"scheduled_backups":["SELECT","INSERT","UPDATE","DELETE"],"recovery_operations":["SELECT","INSERT"],"query_presets":["SELECT","INSERT","UPDATE","DELETE"],"database_activity_log":["SELECT","INSERT"]}'::jsonb
  ELSE table_privileges
END
WHERE name IN ('CONSUMER','VENDOR','GLOBAL_ADMIN','BUSINESS_ASSISTANCE');

UPDATE "role" SET system_capabilities = '["BACKUP","RECOVERY","QUERY","MAINTENANCE"]'::jsonb
WHERE name IN ('GLOBAL_ADMIN','DEVELOPER_ADMIN') AND system_capabilities = '[]'::jsonb;

ALTER TABLE "role" ALTER COLUMN base_scope SET NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'role_base_scope_check') THEN
    ALTER TABLE "role" ADD CONSTRAINT role_base_scope_check
      CHECK (base_scope IN ('CONSUMER','VENDOR','GLOBAL_ADMIN','DEVELOPER_ADMIN','BUSINESS_ASSISTANCE'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'role_name_format_check') THEN
    ALTER TABLE "role" ADD CONSTRAINT role_name_format_check
      CHECK (name ~ '^[A-Z][A-Z0-9_]{2,39}$');
  END IF;
END
$migration$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_role_name_case_insensitive ON "role" (UPPER(name));

ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID;

UPDATE users u SET role_id = r.id
FROM "role" r
WHERE u.role_id IS NULL AND r.name = u.role_scope;

DO $migration$
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE role_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot enable application RBAC: users exist without a matching role row';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_id_fkey') THEN
    ALTER TABLE users ADD CONSTRAINT users_role_id_fkey
      FOREIGN KEY (role_id) REFERENCES "role"(id) ON DELETE RESTRICT;
  END IF;
END
$migration$;

ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_scope_check;
ALTER TABLE users ADD CONSTRAINT users_role_scope_check
  CHECK (role_scope IN ('CONSUMER','VENDOR','GLOBAL_ADMIN','DEVELOPER_ADMIN','BUSINESS_ASSISTANCE'));

CREATE OR REPLACE FUNCTION prevent_role_base_scope_change()
RETURNS TRIGGER AS $function$
BEGIN
  IF NEW.base_scope IS DISTINCT FROM OLD.base_scope THEN
    RAISE EXCEPTION 'Role base_scope is immutable';
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_role_base_scope_immutable ON "role";
CREATE TRIGGER trg_role_base_scope_immutable
BEFORE UPDATE ON "role"
FOR EACH ROW EXECUTE FUNCTION prevent_role_base_scope_change();

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

COMMIT;
