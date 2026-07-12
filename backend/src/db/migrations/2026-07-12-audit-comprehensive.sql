BEGIN;

-- 1. CHECK constraint on users.role_scope (prevents invalid role names)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_role_scope_check'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_role_scope_check
      CHECK (role_scope IN ('CONSUMER','VENDOR','GLOBAL_ADMIN','DEVELOPER_ADMIN','BUSINESS_ASSISTANCE'));
  END IF;
END $$;

-- 2. deleted_at for soft deletion of places
ALTER TABLE places ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 3. Partial unique index: one primary image per place
CREATE UNIQUE INDEX IF NOT EXISTS idx_place_images_one_primary
  ON place_images (place_id) WHERE is_primary = TRUE;

-- 4. updated_at trigger for menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_menu_items_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
    RETURNS TRIGGER AS $function$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $function$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_menu_items_updated_at
      BEFORE UPDATE ON menu_items
      FOR EACH ROW
      EXECUTE FUNCTION update_menu_items_updated_at();
  END IF;
END $$;

COMMIT;
