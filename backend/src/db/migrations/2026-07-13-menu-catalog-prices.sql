BEGIN;

DROP INDEX IF EXISTS idx_menu_item_images_one_primary;

ALTER TABLE place_menu_items ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

UPDATE place_menu_items pmi
SET price = mi.price
FROM menu_items mi
WHERE mi.id = pmi.menu_item_id AND pmi.price IS NULL;

CREATE TEMP TABLE menu_merge_map ON COMMIT DROP AS
WITH item_links AS (
  SELECT mi.id,
         mi.owner_id,
         lower(regexp_replace(trim(mi.name), '[[:space:]]+', ' ', 'g')) AS normalized_name,
         COUNT(pmi.place_id)::int AS link_count,
         mi.created_at
  FROM menu_items mi
  LEFT JOIN place_menu_items pmi ON pmi.menu_item_id = mi.id
  GROUP BY mi.id
)
SELECT id AS source_id,
       first_value(id) OVER (
         PARTITION BY owner_id, normalized_name
         ORDER BY link_count DESC, created_at ASC NULLS LAST, id
       ) AS canonical_id,
       COUNT(*) OVER (PARTITION BY owner_id, normalized_name)::int AS group_size
FROM item_links;

CREATE TEMP TABLE merged_menu_links ON COMMIT DROP AS
SELECT DISTINCT ON (pmi.place_id, map.canonical_id)
       pmi.place_id,
       map.canonical_id AS menu_item_id,
       pmi.is_available,
       pmi.price,
       pmi.created_at,
       pmi.updated_at
FROM place_menu_items pmi
JOIN menu_merge_map map ON map.source_id = pmi.menu_item_id
WHERE map.group_size > 1
ORDER BY pmi.place_id, map.canonical_id, pmi.updated_at DESC NULLS LAST,
         pmi.created_at DESC NULLS LAST, pmi.menu_item_id;

DELETE FROM place_menu_items pmi
USING menu_merge_map map
WHERE map.source_id = pmi.menu_item_id AND map.group_size > 1;

INSERT INTO place_menu_items (place_id, menu_item_id, is_available, price, created_at, updated_at)
SELECT place_id, menu_item_id, is_available, price, created_at, updated_at
FROM merged_menu_links
ON CONFLICT (place_id, menu_item_id) DO UPDATE
SET is_available = EXCLUDED.is_available,
    price = EXCLUDED.price,
    updated_at = EXCLUDED.updated_at;

UPDATE menu_item_images image
SET menu_item_id = map.canonical_id
FROM menu_merge_map map
WHERE image.menu_item_id = map.source_id
  AND map.source_id <> map.canonical_id;

WITH ranked_images AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY menu_item_id
           ORDER BY is_primary DESC, sort_order ASC, created_at ASC, id
         ) AS position
  FROM menu_item_images
)
UPDATE menu_item_images image
SET is_primary = (ranked.position = 1)
FROM ranked_images ranked
WHERE image.id = ranked.id;

DELETE FROM menu_items item
USING menu_merge_map map
WHERE item.id = map.source_id AND map.source_id <> map.canonical_id;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'menu_items' AND column_name = 'price'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'menu_items' AND column_name = 'default_price'
  ) THEN
    ALTER TABLE menu_items RENAME COLUMN price TO default_price;
  END IF;
END
$migration$;

ALTER TABLE place_menu_items ALTER COLUMN price SET NOT NULL;
ALTER TABLE place_menu_items DROP CONSTRAINT IF EXISTS place_menu_items_price_check;
ALTER TABLE place_menu_items ADD CONSTRAINT place_menu_items_price_check CHECK (price >= 0);
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_default_price_check;
ALTER TABLE menu_items ADD CONSTRAINT menu_items_default_price_check CHECK (default_price >= 0);

CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_items_owner_normalized_name
  ON menu_items (owner_id, lower(regexp_replace(trim(name), '[[:space:]]+', ' ', 'g')));
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_item_images_one_primary
  ON menu_item_images (menu_item_id) WHERE is_primary = TRUE;

COMMIT;
