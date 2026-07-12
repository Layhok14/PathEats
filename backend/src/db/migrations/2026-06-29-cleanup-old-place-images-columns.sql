ALTER TABLE place_images
  DROP COLUMN IF EXISTS storage_path,
  DROP COLUMN IF EXISTS display_order;
