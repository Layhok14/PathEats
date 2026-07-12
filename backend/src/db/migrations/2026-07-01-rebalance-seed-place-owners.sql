BEGIN;

DO $$
DECLARE
  overloaded_seed_vendor_places INTEGER;
BEGIN
  SELECT COUNT(*)::int
  INTO overloaded_seed_vendor_places
  FROM places p
  JOIN users owner_user ON owner_user.id = p.owner_id
  WHERE owner_user.email = 'vendor@patheat.app'
    AND p.created_at = (SELECT MIN(created_at) FROM places)
    AND p.name ~ ' [0-9]+$';

  IF overloaded_seed_vendor_places >= 500 THEN
    WITH seed_places AS (
      SELECT
        p.id,
        ROW_NUMBER() OVER (ORDER BY p.name ASC, p.id ASC) AS place_rank
      FROM places p
      JOIN users owner_user ON owner_user.id = p.owner_id
      WHERE owner_user.email = 'vendor@patheat.app'
        AND p.created_at = (SELECT MIN(created_at) FROM places)
        AND p.name ~ ' [0-9]+$'
    ),
    seed_vendors AS (
      SELECT
        id,
        ROW_NUMBER() OVER (
          ORDER BY
            CASE
              WHEN email = 'vendor@patheat.app' THEN 1
              WHEN email = 'vendor2@patheat.app' THEN 2
              ELSE 3
            END,
            email ASC
        ) AS vendor_rank,
        COUNT(*) OVER () AS vendor_count
      FROM users
      WHERE role_scope = 'VENDOR'
        AND (
          email IN ('vendor@patheat.app', 'vendor2@patheat.app')
          OR email ~ '^vendor[0-9]+@patheat\.app$'
        )
    )
    UPDATE places p
    SET owner_id = seed_vendors.id,
        updated_at = NOW()
    FROM seed_places
    JOIN seed_vendors
      ON seed_vendors.vendor_rank = ((seed_places.place_rank - 1) % seed_vendors.vendor_count) + 1
    WHERE p.id = seed_places.id;
  END IF;
END $$;

COMMIT;
