-- RLS policies and data integrity constraints.
-- Always safe to apply: if Supabase Auth (auth.uid()) is not present,
-- a NULL-returning shim is created so RLS defaults to deny for browser clients.

DO $auth_shim$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'auth' AND p.proname = 'uid'
  ) THEN
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE OR REPLACE FUNCTION auth.uid()
    RETURNS UUID LANGUAGE sql STABLE AS $$ SELECT NULL::uuid $$;
  END IF;
END
$auth_shim$;

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_preferences_owner_all ON user_preferences;
CREATE POLICY user_preferences_owner_all ON user_preferences
  FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS user_profile_images_owner_all ON user_profile_images;
CREATE POLICY user_profile_images_owner_all ON user_profile_images
  FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS routes_owner_all ON routes;
CREATE POLICY routes_owner_all ON routes
  FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS bookmarks_owner_all ON bookmarks;
CREATE POLICY bookmarks_owner_all ON bookmarks
  FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS search_history_owner_all ON search_history;
CREATE POLICY search_history_owner_all ON search_history
  FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS reviews_public_read ON reviews;
CREATE POLICY reviews_public_read ON reviews
  FOR SELECT
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS reviews_owner_insert ON reviews;
CREATE POLICY reviews_owner_insert ON reviews
  FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS reviews_owner_update ON reviews;
CREATE POLICY reviews_owner_update ON reviews
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id AND deleted_at IS NULL)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS reviews_owner_delete ON reviews;
CREATE POLICY reviews_owner_delete ON reviews
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS place_images_public_read ON place_images;
CREATE POLICY place_images_public_read ON place_images
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS place_images_owner_write ON place_images;
CREATE POLICY place_images_owner_write ON place_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM places p
      WHERE p.id = place_images.place_id
        AND p.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM places p
      WHERE p.id = place_images.place_id
        AND p.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS menu_item_images_public_read ON menu_item_images;
CREATE POLICY menu_item_images_public_read ON menu_item_images
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS place_menu_items_public_read ON place_menu_items;
CREATE POLICY place_menu_items_public_read ON place_menu_items
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS place_menu_items_owner_write ON place_menu_items;
CREATE POLICY place_menu_items_owner_write ON place_menu_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM places p
      WHERE p.id = place_menu_items.place_id
        AND p.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM places p
      JOIN menu_items mi ON mi.id = place_menu_items.menu_item_id
      WHERE p.id = place_menu_items.place_id
        AND p.owner_id = (SELECT auth.uid())
        AND mi.owner_id = p.owner_id
    )
  );

DROP POLICY IF EXISTS menu_item_images_owner_write ON menu_item_images;
CREATE POLICY menu_item_images_owner_write ON menu_item_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM menu_items mi
      WHERE mi.id = menu_item_images.menu_item_id
        AND mi.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM menu_items mi
      WHERE mi.id = menu_item_images.menu_item_id
        AND mi.owner_id = (SELECT auth.uid())
    )
  );

-- =====================================================================
-- Data Integrity Constraints
-- =====================================================================

-- Prevent contradictory place state: a closed stall cannot be open.
DO $integrity$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'places_consistent_open_status') THEN
    ALTER TABLE places ADD CONSTRAINT places_consistent_open_status
      CHECK (NOT (status = 'closed' AND is_open = TRUE));
  END IF;
END
$integrity$;
