-- Prevent duplicate active reviews per user per place at the database level.
-- The application already checks via SELECT-then-INSERT, but this eliminates race conditions.

-- Step 1: Soft-delete older duplicate reviews (keep the most recent per user per place)
UPDATE reviews r
SET deleted_at = r.created_at
FROM (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY place_id, user_id
      ORDER BY created_at DESC
    ) AS rn
  FROM reviews
  WHERE deleted_at IS NULL
) dup
WHERE r.id = dup.id
  AND dup.rn > 1;

-- Step 2: Create the partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_active
  ON reviews (place_id, user_id)
  WHERE deleted_at IS NULL;
