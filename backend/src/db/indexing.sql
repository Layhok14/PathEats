BEGIN;

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_scope);
CREATE INDEX IF NOT EXISTS idx_user_profile_images_user ON user_profile_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profile_images_uploaded_by ON user_profile_images(uploaded_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_images_storage_object_unique
  ON user_profile_images(bucket_name, object_path);

-- Session and auth lifecycle
CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_hash_unique ON refresh_tokens(token_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_jti_unique ON refresh_tokens(jti);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_active
  ON refresh_tokens(user_id, expires_at DESC)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_session_events_user_created
  ON session_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_events_family ON session_events(family_id);
CREATE INDEX IF NOT EXISTS idx_session_events_type_created
  ON session_events(event_type, created_at DESC);

-- Places & categories
CREATE INDEX IF NOT EXISTS idx_places_location ON places USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
CREATE INDEX IF NOT EXISTS idx_places_owner ON places(owner_id);
CREATE INDEX IF NOT EXISTS idx_places_admin_managed ON places(is_admin_managed);
CREATE INDEX IF NOT EXISTS idx_places_status ON places(status);
CREATE INDEX IF NOT EXISTS idx_place_hours_place ON place_hours(place_id);
CREATE INDEX IF NOT EXISTS idx_place_hours_open_lookup
  ON place_hours(place_id, day_of_week, is_closed);

-- Menu items
CREATE INDEX IF NOT EXISTS idx_menu_items_place ON menu_items(place_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);

-- User data
CREATE INDEX IF NOT EXISTS idx_routes_user ON routes(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_place ON bookmarks(place_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_created
  ON search_history(user_id, created_at DESC);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_place_created
  ON reviews(place_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deleted_at ON reviews(deleted_at);
CREATE INDEX IF NOT EXISTS idx_reviews_moderated ON reviews(is_moderated)
  WHERE is_moderated = FALSE;

-- Place images
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

COMMIT;
