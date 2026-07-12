BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS user_profile_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bucket_name TEXT NOT NULL DEFAULT 'profile-images',
  object_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  mime_type TEXT NOT NULL CHECK (mime_type LIKE 'image/%'),
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS place_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  bucket_name TEXT NOT NULL DEFAULT 'place-images',
  object_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  mime_type TEXT NOT NULL CHECK (mime_type LIKE 'image/%'),
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE place_images ADD COLUMN IF NOT EXISTS bucket_name TEXT;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS object_path TEXT;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS mime_type TEXT;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS size_bytes BIGINT;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;
ALTER TABLE place_images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'place_images'
      AND column_name = 'storage_path'
  ) THEN
    UPDATE place_images
    SET object_path = storage_path
    WHERE object_path IS NULL
      AND storage_path IS NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'place_images'
      AND column_name = 'display_order'
  ) THEN
    UPDATE place_images
    SET sort_order = display_order
    WHERE sort_order IS NULL
       OR sort_order = 0;
  END IF;
END $$;

UPDATE place_images SET bucket_name = 'place-images' WHERE bucket_name IS NULL;
UPDATE place_images SET object_path = CONCAT('legacy/place-images/', id::text) WHERE object_path IS NULL;
UPDATE place_images SET mime_type = 'image/unknown' WHERE mime_type IS NULL;
UPDATE place_images SET size_bytes = 1 WHERE size_bytes IS NULL OR size_bytes <= 0;
UPDATE place_images SET sort_order = 0 WHERE sort_order IS NULL OR sort_order < 0;
UPDATE place_images SET is_primary = FALSE WHERE is_primary IS NULL;
UPDATE place_images SET updated_at = COALESCE(updated_at, created_at, NOW());

ALTER TABLE place_images ALTER COLUMN bucket_name SET DEFAULT 'place-images';
ALTER TABLE place_images ALTER COLUMN bucket_name SET NOT NULL;
ALTER TABLE place_images ALTER COLUMN object_path SET NOT NULL;
ALTER TABLE place_images ALTER COLUMN mime_type SET NOT NULL;
ALTER TABLE place_images ALTER COLUMN size_bytes SET NOT NULL;
ALTER TABLE place_images ALTER COLUMN sort_order SET DEFAULT 0;
ALTER TABLE place_images ALTER COLUMN sort_order SET NOT NULL;
ALTER TABLE place_images ALTER COLUMN is_primary SET DEFAULT FALSE;
ALTER TABLE place_images ALTER COLUMN is_primary SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'place_images_mime_type_image_check'
  ) THEN
    ALTER TABLE place_images
      ADD CONSTRAINT place_images_mime_type_image_check CHECK (mime_type LIKE 'image/%');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'place_images_size_bytes_positive_check'
  ) THEN
    ALTER TABLE place_images
      ADD CONSTRAINT place_images_size_bytes_positive_check CHECK (size_bytes > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'place_images_sort_order_nonnegative_check'
  ) THEN
    ALTER TABLE place_images
      ADD CONSTRAINT place_images_sort_order_nonnegative_check CHECK (sort_order >= 0);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS menu_item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  bucket_name TEXT NOT NULL DEFAULT 'menu-item-images',
  object_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  mime_type TEXT NOT NULL CHECK (mime_type LIKE 'image/%'),
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN places.photo_url IS 'Legacy display fallback. New uploads must use place_images.bucket_name + place_images.object_path.';
COMMENT ON COLUMN menu_items.image_url IS 'Legacy display fallback. New uploads must use menu_item_images.bucket_name + menu_item_images.object_path.';

WITH ranked_place_images AS (
  SELECT
    ctid,
    id::text AS id_text,
    object_path,
    ROW_NUMBER() OVER (
      PARTITION BY bucket_name, object_path
      ORDER BY id::text
    ) AS duplicate_rank
  FROM place_images
)
UPDATE place_images p
SET object_path = CONCAT(r.object_path, '-', r.id_text)
FROM ranked_place_images r
WHERE p.ctid = r.ctid
  AND r.duplicate_rank > 1;

CREATE INDEX IF NOT EXISTS idx_user_profile_images_user ON user_profile_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profile_images_uploaded_by ON user_profile_images(uploaded_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_images_storage_object_unique
  ON user_profile_images(bucket_name, object_path);

CREATE INDEX IF NOT EXISTS idx_place_images_place ON place_images(place_id);
CREATE INDEX IF NOT EXISTS idx_place_images_place_primary
  ON place_images(place_id, is_primary, sort_order);
CREATE INDEX IF NOT EXISTS idx_place_images_uploaded_by ON place_images(uploaded_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_place_images_storage_object_unique
  ON place_images(bucket_name, object_path);

CREATE INDEX IF NOT EXISTS idx_menu_item_images_menu_item ON menu_item_images(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_images_menu_item_primary
  ON menu_item_images(menu_item_id, is_primary, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_item_images_uploaded_by ON menu_item_images(uploaded_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_item_images_storage_object_unique
  ON menu_item_images(bucket_name, object_path);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_profile_images_updated_at'
    ) THEN
      CREATE TRIGGER set_user_profile_images_updated_at
        BEFORE UPDATE ON user_profile_images
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_place_images_updated_at'
    ) THEN
      CREATE TRIGGER set_place_images_updated_at
        BEFORE UPDATE ON place_images
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_menu_item_images_updated_at'
    ) THEN
      CREATE TRIGGER set_menu_item_images_updated_at
        BEFORE UPDATE ON menu_item_images
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END IF;
END $$;

COMMIT;
