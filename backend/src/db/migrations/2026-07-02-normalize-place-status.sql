-- Normalize places.status to the only supported lifecycle values:
-- active  = visible to consumers when the owner is not banned
-- closed  = retained for vendor/admin records but hidden from consumers

ALTER TABLE places
  ADD COLUMN IF NOT EXISTS is_admin_managed BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_attribute a
      ON a.attrelid = c.conrelid
     AND a.attnum = ANY(c.conkey)
    WHERE c.conrelid = 'places'::regclass
      AND c.contype = 'c'
      AND a.attname = 'status'
  LOOP
    EXECUTE format('ALTER TABLE places DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

UPDATE places
SET is_admin_managed = TRUE
WHERE LOWER(status) IN ('rejected', 'suspended')
   OR (LOWER(status) = 'closed' AND is_admin_managed = TRUE);

UPDATE places
SET status = CASE
  WHEN LOWER(status) IN ('active', 'approved', 'open') AND COALESCE(is_open, TRUE) = TRUE THEN 'active'
  ELSE 'closed'
END;

UPDATE places
SET is_open = (status = 'active');

ALTER TABLE places
  ALTER COLUMN status SET DEFAULT 'active',
  ALTER COLUMN status SET NOT NULL;

ALTER TABLE places
  ADD CONSTRAINT places_status_active_closed_check
  CHECK (status IN ('active', 'closed'));

COMMENT ON COLUMN places.status IS 'Only active or closed. Closed stalls remain in admin/vendor records but are hidden from consumers.';
COMMENT ON COLUMN places.is_admin_managed IS 'True when an admin closed or controls the stall lifecycle; false when the owner controls it.';
