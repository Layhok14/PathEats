BEGIN;

WITH target_places AS (
  SELECT
    p.id,
    ROW_NUMBER() OVER (ORDER BY p.created_at ASC NULLS LAST, p.id ASC) AS place_rank
  FROM places p
  WHERE p.owner_id IS NULL
     OR NOT EXISTS (
       SELECT 1
       FROM users u
       WHERE u.id = p.owner_id
         AND u.role_scope = 'VENDOR'
     )
),
vendor_owners AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC NULLS LAST, email ASC) AS vendor_rank,
    COUNT(*) OVER () AS vendor_count
  FROM users
  WHERE role_scope = 'VENDOR'
)
UPDATE places p
SET owner_id = vendor_owners.id,
    is_admin_managed = FALSE,
    updated_at = NOW()
FROM target_places
JOIN vendor_owners
  ON vendor_owners.vendor_rank = ((target_places.place_rank - 1) % vendor_owners.vendor_count) + 1
WHERE p.id = target_places.id;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM places WHERE owner_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot require places.owner_id: no vendor account exists for orphan places.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM places p
    LEFT JOIN users u ON u.id = p.owner_id
    WHERE u.id IS NULL OR u.role_scope <> 'VENDOR'
  ) THEN
    RAISE EXCEPTION 'Cannot require vendor-owned places: some places are owned by non-vendor users.';
  END IF;
END $$;

ALTER TABLE places
  DROP CONSTRAINT IF EXISTS places_owner_or_admin_managed_check;

DO $$
DECLARE
  owner_fk_name TEXT;
BEGIN
  SELECT c.conname
  INTO owner_fk_name
  FROM pg_constraint c
  JOIN pg_attribute a
    ON a.attrelid = c.conrelid
   AND a.attnum = ANY(c.conkey)
  WHERE c.conrelid = 'places'::regclass
    AND c.contype = 'f'
    AND a.attname = 'owner_id'
  LIMIT 1;

  IF owner_fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE places DROP CONSTRAINT %I', owner_fk_name);
  END IF;
END $$;

ALTER TABLE places
  ALTER COLUMN owner_id SET NOT NULL;

ALTER TABLE places
  ADD CONSTRAINT places_owner_id_fkey
  FOREIGN KEY (owner_id)
  REFERENCES users(id)
  ON DELETE RESTRICT;

CREATE OR REPLACE FUNCTION enforce_place_owner_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    RAISE EXCEPTION 'places.owner_id is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM users
    WHERE id = NEW.owner_id
      AND role_scope = 'VENDOR'
  ) THEN
    RAISE EXCEPTION 'places.owner_id must reference a VENDOR user';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_places_owner_role ON places;
CREATE TRIGGER trg_places_owner_role
BEFORE INSERT OR UPDATE OF owner_id ON places
FOR EACH ROW
EXECUTE FUNCTION enforce_place_owner_role();

CREATE OR REPLACE FUNCTION prevent_place_owner_role_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.role_scope = 'VENDOR'
     AND NEW.role_scope <> 'VENDOR'
     AND EXISTS (SELECT 1 FROM places WHERE owner_id = OLD.id) THEN
    RAISE EXCEPTION 'Cannot change a vendor role while they own places';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_preserve_place_owner_role ON users;
CREATE TRIGGER trg_users_preserve_place_owner_role
BEFORE UPDATE OF role_scope ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_place_owner_role_change();

COMMENT ON COLUMN places.owner_id IS 'Required vendor owner for every place/stall.';
COMMENT ON COLUMN places.is_admin_managed IS 'Legacy/admin display flag only. It does not bypass the required vendor owner.';

COMMIT;
