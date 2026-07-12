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

-- 2. approval_status on places (separate from is_admin_managed)
ALTER TABLE places ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved';
UPDATE places SET approval_status = 'approved' WHERE approval_status IS DISTINCT FROM 'rejected';

-- 3. deleted_at for soft deletion of places
ALTER TABLE places ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 4. Partial unique index: one primary image per place
CREATE UNIQUE INDEX IF NOT EXISTS idx_place_images_one_primary
  ON place_images (place_id) WHERE is_primary = TRUE;

-- 5. updated_at trigger for menu_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_menu_items_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_menu_items_updated_at
      BEFORE UPDATE ON menu_items
      FOR EACH ROW
      EXECUTE FUNCTION update_menu_items_updated_at();
  END IF;
END $$;

-- 6. business_assistant_assignments table
CREATE TABLE IF NOT EXISTS business_assistant_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  UNIQUE(assistant_id, vendor_id)
);
CREATE INDEX IF NOT EXISTS idx_baa_assistant ON business_assistant_assignments(assistant_id);
CREATE INDEX IF NOT EXISTS idx_baa_vendor ON business_assistant_assignments(vendor_id);

-- 7. vendor_onboarding tracking
CREATE TABLE IF NOT EXISTS vendor_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','submitted','approved','rejected')),
  assigned_assistant_id UUID REFERENCES users(id),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vendor_onboarding_vendor ON vendor_onboarding(vendor_id);

CREATE TABLE IF NOT EXISTS vendor_onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_onboarding_id UUID NOT NULL REFERENCES vendor_onboarding(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','skipped')),
  completed_at TIMESTAMPTZ,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_vos_onboarding ON vendor_onboarding_steps(vendor_onboarding_id);

COMMIT;
