BEGIN;

ALTER TABLE places
  ADD COLUMN IF NOT EXISTS is_admin_managed BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE places
SET is_admin_managed = TRUE
WHERE owner_id IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'places_owner_or_admin_managed_check'
  ) THEN
    ALTER TABLE places
      ADD CONSTRAINT places_owner_or_admin_managed_check
      CHECK (owner_id IS NOT NULL OR is_admin_managed = TRUE);
  END IF;
END $$;

COMMENT ON COLUMN places.owner_id IS 'Vendor owner for vendor-managed stalls. May be NULL only when places.is_admin_managed is TRUE.';
COMMENT ON COLUMN places.is_admin_managed IS 'Marks public/admin-managed places that are not owned by a vendor account.';

CREATE INDEX IF NOT EXISTS idx_places_admin_managed ON places(is_admin_managed);

COMMIT;
