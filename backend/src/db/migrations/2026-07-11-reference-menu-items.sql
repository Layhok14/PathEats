BEGIN;

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'menu_items' AND column_name = 'place_id'
  ) THEN
    UPDATE menu_items mi
    SET owner_id = p.owner_id
    FROM places p
    WHERE mi.owner_id IS NULL
      AND p.id = mi.place_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM menu_items WHERE owner_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot migrate menu_items: one or more rows have no vendor owner';
  END IF;
END $$;

ALTER TABLE menu_items
  ALTER COLUMN owner_id SET NOT NULL;

CREATE TABLE IF NOT EXISTS place_menu_items (
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (place_id, menu_item_id)
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'menu_items' AND column_name = 'place_id'
  ) THEN
    INSERT INTO place_menu_items (place_id, menu_item_id, is_available)
    SELECT place_id, id, COALESCE(is_available, TRUE)
    FROM menu_items
    WHERE place_id IS NOT NULL
    ON CONFLICT (place_id, menu_item_id) DO UPDATE
    SET is_available = EXCLUDED.is_available;
  END IF;
END $$;

ALTER TABLE menu_items DROP COLUMN IF EXISTS place_id;
ALTER TABLE menu_items DROP COLUMN IF EXISTS is_available;

CREATE INDEX IF NOT EXISTS idx_menu_items_owner ON menu_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_place_menu_items_item ON place_menu_items(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_place_menu_items_available
  ON place_menu_items(place_id, is_available);

COMMIT;
