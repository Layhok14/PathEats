BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cleanup
DROP TABLE IF EXISTS onboarding_config CASCADE;
DROP TABLE IF EXISTS menu_item_images CASCADE;
DROP TABLE IF EXISTS place_menu_items CASCADE;
DROP TABLE IF EXISTS place_images CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS place_hours CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS place_categories CASCADE;
DROP TABLE IF EXISTS user_profile_images CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS session_events CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS database_activity_log CASCADE;
DROP TABLE IF EXISTS query_presets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS scheduled_backups CASCADE;
DROP TABLE IF EXISTS backup_profiles CASCADE;
DROP TABLE IF EXISTS recovery_operations CASCADE;
DROP TABLE IF EXISTS "role" CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS refresh_place_rating(UUID) CASCADE;
DROP FUNCTION IF EXISTS refresh_place_rating_after_review() CASCADE;
DROP FUNCTION IF EXISTS enforce_place_owner_role CASCADE;
DROP FUNCTION IF EXISTS prevent_place_owner_role_change CASCADE;

-- =====================================================================
-- DDL
-- =====================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  role_scope TEXT NOT NULL DEFAULT 'CONSUMER',
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL,
  jti TEXT UNIQUE NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
  created_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  role_scope VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  refresh_token_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
  family_id UUID,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'login_success', 'login_failed', 'register_success',
      'refresh_success', 'refresh_failed', 'refresh_reuse_detected',
      'logout', 'logout_all'
    )
  ),
  ip_address TEXT,
  user_agent TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_radius INT DEFAULT 100,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profile_images (
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

CREATE TABLE place_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_admin_managed BOOLEAN NOT NULL DEFAULT FALSE,
  category_id UUID NOT NULL REFERENCES place_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  address TEXT,
  photo_url TEXT,
  price_range INT CHECK (price_range BETWEEN 1 AND 4),
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_open BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN places.owner_id IS 'Required vendor owner for every place/stall.';
COMMENT ON COLUMN places.is_admin_managed IS 'Legacy/admin display flag only.';
COMMENT ON COLUMN places.status IS 'Only active or closed. Closed stalls remain in admin/vendor records but are hidden from consumers.';
COMMENT ON COLUMN places.photo_url IS 'Legacy display fallback. New uploads use place_images.';

CREATE TABLE place_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  opens_at TIME NOT NULL,
  closes_at TIME NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  UNIQUE(place_id, day_of_week)
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT DEFAULT 'snack' CHECK (category IN ('snack', 'dessert', 'main course', 'drink')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON COLUMN menu_items.image_url IS 'Legacy display fallback. New uploads use menu_item_images.';

CREATE TABLE place_menu_items (
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (place_id, menu_item_id)
);

CREATE TABLE menu_item_images (
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

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  origin JSONB NOT NULL,
  destination JSONB NOT NULL,
  waypoints JSONB,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB,
  results_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  flagged_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE place_images (
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

CREATE TABLE backup_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_name VARCHAR(255) NOT NULL,
  method VARCHAR(50) NOT NULL,
  scope TEXT DEFAULT 'full',
  schedule_interval VARCHAR(50),
  schedule_unit VARCHAR(20),
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_error TEXT,
  last_backup_at TIMESTAMPTZ,
  next_backup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scheduled_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES backup_profiles(id) ON DELETE CASCADE,
  profile_name VARCHAR(255),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  method VARCHAR(50) NOT NULL,
  scope TEXT,
  size VARCHAR(50) DEFAULT 'N/A',
  status VARCHAR(20) DEFAULT 'COMPLETED',
  message TEXT,
  artifact_format VARCHAR(50),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recovery_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recovery_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) DEFAULT 'N/A',
  status VARCHAR(20) DEFAULT 'COMPLETED',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE query_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  query_string TEXT NOT NULL,
  category VARCHAR(20) NOT NULL DEFAULT 'viewing'
    CHECK (category IN ('viewing', 'altering', 'deleting', 'updating', 'creating')),
  is_system_preset BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE database_activity_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(20) NOT NULL
    CHECK (event_type IN ('login_success', 'login_failed', 'query_execution')),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payload TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "role" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  table_privileges JSONB DEFAULT '{}'::jsonb,
  grant_option BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- Functions & Triggers
-- =====================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_profile_images_updated_at
  BEFORE UPDATE ON user_profile_images FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_places_updated_at
  BEFORE UPDATE ON places FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_place_images_updated_at
  BEFORE UPDATE ON place_images FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_menu_item_images_updated_at
  BEFORE UPDATE ON menu_item_images FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION enforce_place_owner_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    RAISE EXCEPTION 'places.owner_id is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE id = NEW.owner_id AND role_scope = 'VENDOR'
  ) THEN
    RAISE EXCEPTION 'places.owner_id must reference a VENDOR user';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER trg_users_preserve_place_owner_role
BEFORE UPDATE OF role_scope ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_place_owner_role_change();

CREATE OR REPLACE FUNCTION refresh_place_rating(p_place_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE places
  SET rating_avg = COALESCE(
    (SELECT ROUND(AVG(rating)::numeric, 2)
     FROM reviews WHERE place_id = p_place_id AND deleted_at IS NULL),
    0
  ),
  rating_count = COALESCE(
    (SELECT COUNT(*)::integer
     FROM reviews WHERE place_id = p_place_id AND deleted_at IS NULL),
    0
  )
  WHERE id = p_place_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_place_rating_after_review()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_place_rating(OLD.place_id);
    RETURN OLD;
  END IF;
  PERFORM refresh_place_rating(NEW.place_id);
  IF TG_OP = 'UPDATE' AND OLD.place_id IS DISTINCT FROM NEW.place_id THEN
    PERFORM refresh_place_rating(OLD.place_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_refresh_place_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION refresh_place_rating_after_review();

-- =====================================================================
-- Seed Data
-- =====================================================================

DO $$
DECLARE
  v_consumer UUID;
  v_vendor_1 UUID;
  v_vendor_2 UUID;
  v_admin UUID;
  v_dev UUID;
  v_business UUID;
  v_new_vendor UUID;
  vendor_ids UUID[] := ARRAY[]::UUID[];
  stall_counts INT[] := ARRAY[1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5];
  owner_for_place UUID[];
  cat_ids UUID[] := ARRAY[]::UUID[];
  cat_id UUID;
  p_id UUID;
  i INT;
  j INT;
  v_idx INT;
  cnt INT;
  cat_idx INT;
  r FLOAT;
  lat FLOAT;
  lng FLOAT;
  place_name TEXT;
  place_desc TEXT;
  place_addr TEXT;
  photo_url TEXT;
  price INT;
  is_open BOOLEAN;
  item_count INT;
  item_cat TEXT;
  item_name TEXT;
  item_price DECIMAL(10,2);
  review_rating INT;
  review_body TEXT;
  review_bodies TEXT[] := ARRAY[
    'Absolutely delicious! Will come again.',
    'Great food at reasonable prices.',
    'The portion size was generous.',
    'One of the best spots in the area.',
    'Friendly service and tasty food.',
    'A hidden gem! Highly recommend.',
    'Good but could be better.',
    'Very authentic flavors, loved it!',
    'Quick service and fresh ingredients.',
    'My go-to place for lunch.',
    'The best I have had in Phnom Penh.',
    'Reasonable price for the quality.',
    'Nice atmosphere and good food.',
    'Would definitely recommend to friends.',
    'The portions were a bit small.',
    'Excellent value for money.',
    'Very crowded during peak hours.',
    'Taste reminds me of home cooking.',
    'Will be coming back for more!',
    'Fresh, hot, and delicious.'
  ];
  area_polygons TEXT[] := ARRAY[
    'POLYGON((104.8009747 11.6052091, 104.7574632 11.6600034, 104.816342 11.6630779, 104.8731786 11.6624793, 104.9520165 11.7178378, 104.9446827 11.6702601, 104.9189401 11.6264693, 105.0154527 11.4815096, 104.9597553 11.4892154, 104.9138868 11.4917839, 104.8018366 11.4532536, 104.8009747 11.6052091))',
    'POLYGON((104.9072491 11.6716314, 104.9137984 11.6531109, 104.9215712 11.6387017, 104.93759 11.5910448, 104.9388092 11.5678743, 104.9249106 11.5896116, 104.9022812 11.6080035, 104.8778242 11.6214788, 104.8103966 11.6462531, 104.8247536 11.6873094, 104.8732385 11.6712572, 104.9072491 11.6716314))',
    'POLYGON((104.9170941 11.7358878, 104.9612735 11.7111045, 104.9405644 11.648461, 104.9295196 11.6223178, 104.8950045 11.6529682, 104.8719944 11.6565739, 104.8844198 11.6673908, 104.9170941 11.7358878))',
    'POLYGON((104.7413367 11.6293162, 104.7233092 11.559748, 104.7992432 11.5345921, 104.80853 11.6191496, 104.7413367 11.6293162))',
    'POLYGON((104.7670035 11.5189186, 104.7445809 11.4647524, 104.8227992 11.4453318, 104.8984103 11.4391987, 104.9200507 11.4869822, 104.8639942 11.5081884, 104.7670035 11.5189186))'
  ];
  area_counts INT[] := ARRAY[120, 80, 100, 100, 100];
  point_lats FLOAT[] := ARRAY[]::FLOAT[];
  point_lngs FLOAT[] := ARRAY[]::FLOAT[];
  pt RECORD;
  found_pt geometry;
  test_pt geometry;
  water_geom geometry;
  attempt INT;

BEGIN

  water_geom := ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[104.8326693,11.7369436],[104.8371618,11.7376203],[104.8492358,11.69106],[104.8522735,11.685738],[104.8778115,11.6488575],[104.8866916,11.6432196],[104.9014371,11.6378531],[104.9068991,11.6343237],[104.9106515,11.6306952],[104.9158539,11.6242928],[104.9205167,11.6168971],[104.9216587,11.6151308],[104.9222598,11.6127463],[104.9228361,11.6100548],[104.9230361,11.6099413],[104.9230361,11.6090237],[104.9228131,11.6082595],[104.922852,11.6066771],[104.923192,11.6029814],[104.9229555,11.598652],[104.9227327,11.5947404],[104.9227646,11.5913096],[104.9240181,11.5885655],[104.9277337,11.5825611],[104.9313094,11.5780345],[104.9343316,11.5712811],[104.9353296,11.5682924],[104.9373404,11.5665744],[104.9378998,11.5675851],[104.9394935,11.5674938],[104.9404556,11.5689179],[104.9404981,11.5708285],[104.9377016,11.5912392],[104.9354601,11.5970962],[104.9320228,11.6041363],[104.9287279,11.6169721],[104.923542,11.6355176],[104.9158674,11.651707],[104.9145144,11.6566536],[104.9150729,11.6596814],[104.9162157,11.6662832],[104.9236767,11.6823643],[104.9288143,11.6911955],[104.9317537,11.6947555],[104.9379791,11.6994509],[104.9429982,11.7034173],[104.9491171,11.7094616],[104.9567506,11.7167273],[104.978441,11.7339054],[104.9865505,11.7274751],[104.9769094,11.7134907],[104.9723921,11.706048],[104.9706843,11.7018031],[104.9687137,11.6983687],[104.9673407,11.693286],[104.9654723,11.6818176],[104.9653357,11.6721694],[104.9639628,11.6652225],[104.9625915,11.6614839],[104.9613001,11.6590613],[104.9581951,11.6525855],[104.9556419,11.6456948],[104.9548289,11.6428447],[104.9535968,11.6403755],[104.9528975,11.6373953],[104.9510907,11.6322179],[104.9501496,11.6252915],[104.9490738,11.6167412],[104.9483032,11.6091725],[104.9415132,11.6090921],[104.9431973,11.6175051],[104.9448687,11.6271508],[104.9481899,11.6351971],[104.9500258,11.64335],[104.9518397,11.6486896],[104.9558201,11.6590025],[104.9577024,11.6639396],[104.9592082,11.66');

  -- Seed users
  INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
  VALUES ('consumer@patheat.app', 'pending', 'Sophea', 'Chea', 'CONSUMER')
  RETURNING id INTO v_consumer;

  INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
  VALUES ('vendor@patheat.app', 'pending', 'Layhok', 'Meng', 'VENDOR')
  RETURNING id INTO v_vendor_1;

  INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
  VALUES ('vendor2@patheat.app', 'pending', 'Sokunthea', 'Sok', 'VENDOR')
  RETURNING id INTO v_vendor_2;

  INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
  VALUES ('admin@patheat.app', 'pending', 'Sokun', 'Nuth', 'GLOBAL_ADMIN')
  RETURNING id INTO v_admin;

  INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
  VALUES ('dev@patheat.app', 'pending', 'Ravy', 'Touch', 'DEVELOPER_ADMIN')
  RETURNING id INTO v_dev;

  INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
  VALUES ('business@patheat.app', 'pending', 'Seavpav', 'Keo', 'BUSINESS_ASSISTANCE')
  RETURNING id INTO v_business;

  FOR i IN 3..30 LOOP
    INSERT INTO users (email, password_hash, first_name, last_name, role_scope)
    VALUES ('vendor' || i || '@patheat.app', 'pending', 'Vendor ' || i, 'Seed', 'VENDOR')
    RETURNING id INTO v_new_vendor;
    vendor_ids := vendor_ids || v_new_vendor;
  END LOOP;

  vendor_ids := ARRAY[v_vendor_1, v_vendor_2] || vendor_ids;

  owner_for_place := ARRAY[]::UUID[];
  FOR v_idx IN 1..30 LOOP
    FOR cnt IN 1..stall_counts[v_idx] LOOP
      owner_for_place := owner_for_place || vendor_ids[v_idx];
    END LOOP;
  END LOOP;
  FOR i IN 91..1000 LOOP
    owner_for_place := owner_for_place || vendor_ids[((i - 1) % array_length(vendor_ids, 1)) + 1];
  END LOOP;

  INSERT INTO user_preferences (user_id)
  VALUES (v_consumer), (v_vendor_1), (v_vendor_2), (v_admin), (v_dev);
  FOR i IN 3..30 LOOP
    INSERT INTO user_preferences (user_id) VALUES (vendor_ids[i]);
  END LOOP;

  FOR i IN 1..9 LOOP
    INSERT INTO place_categories (slug, name, description) VALUES (
      CASE i
        WHEN 1 THEN 'rice' WHEN 2 THEN 'nom-banh-chok' WHEN 3 THEN 'kuytev'
        WHEN 4 THEN 'nompang' WHEN 5 THEN 'chek-chen' WHEN 6 THEN 'cafe'
        WHEN 7 THEN 'banh-sung' WHEN 8 THEN 'banh-xeo' WHEN 9 THEN 'others'
      END,
      CASE i
        WHEN 1 THEN 'Rice' WHEN 2 THEN 'Nom Banh Chok' WHEN 3 THEN 'Kuytev'
        WHEN 4 THEN 'Nompang' WHEN 5 THEN 'Chek Chen' WHEN 6 THEN 'Cafe'
        WHEN 7 THEN 'Banh Sung' WHEN 8 THEN 'Banh Xeo' WHEN 9 THEN 'Others'
      END,
      CASE i
        WHEN 1 THEN 'Rice-based dishes' WHEN 2 THEN 'Traditional Cambodian rice noodles'
        WHEN 3 THEN 'Noodle soup with fresh herbs' WHEN 4 THEN 'Cambodian sandwiches and baguettes'
        WHEN 5 THEN 'Fried bananas and fritters' WHEN 6 THEN 'Coffee, tea, and beverages'
        WHEN 7 THEN 'Steamed rice rolls' WHEN 8 THEN 'Crispy Vietnamese-Cambodian crepes'
        WHEN 9 THEN 'Miscellaneous food items'
      END
    ) RETURNING id INTO cat_id;
    cat_ids := cat_ids || cat_id;
  END LOOP;

  FOR j IN 1..5 LOOP
    FOR pt IN SELECT (ST_Dump(ST_GeneratePoints(ST_SetSRID(area_polygons[j]::geometry, 4326), area_counts[j]))).geom LOOP
      found_pt := pt.geom;
      IF ST_Within(found_pt, water_geom) THEN
        FOR attempt IN 1..20 LOOP
          test_pt := ST_SetSRID(ST_MakePoint(104.72 + random() * 0.34, 11.43 + random() * 0.32), 4326);
          IF NOT ST_Within(test_pt, water_geom) THEN
            found_pt := test_pt;
            EXIT;
          END IF;
        END LOOP;
      END IF;
      point_lats := point_lats || ST_Y(found_pt);
      point_lngs := point_lngs || ST_X(found_pt);
    END LOOP;
  END LOOP;

  j := 0;
  WHILE j < 500 LOOP
    lat := 11.43 + random() * 0.30;
    lng := 104.72 + random() * 0.32;
    test_pt := ST_SetSRID(ST_MakePoint(lng, lat), 4326);
    IF NOT ST_Within(test_pt, water_geom) THEN
      point_lats := point_lats || lat;
      point_lngs := point_lngs || lng;
      j := j + 1;
    END IF;
  END LOOP;

  FOR i IN 1..1000 LOOP
    cat_idx := 1 + floor(random() * 9)::int;
    r := random();
    place_name := CASE cat_idx
      WHEN 1 THEN CASE WHEN r < 0.25 THEN 'Bai Sach Chrouk ' || i WHEN r < 0.45 THEN 'Chicken Rice Stall ' || i WHEN r < 0.65 THEN 'Pork Rice Shop ' || i WHEN r < 0.80 THEN 'Fried Rice House ' || i ELSE 'Coconut Rice ' || i END
      WHEN 2 THEN CASE WHEN r < 0.35 THEN 'Nom Banh Chok ' || i WHEN r < 0.60 THEN 'Fresh Rice Noodles ' || i WHEN r < 0.80 THEN 'Banh Chok Shop ' || i ELSE 'Rice Noodle House ' || i END
      WHEN 3 THEN CASE WHEN r < 0.30 THEN 'Kuyteav ' || i WHEN r < 0.55 THEN 'Noodle Soup ' || i WHEN r < 0.75 THEN 'Beef Noodle Shop ' || i ELSE 'Seafood Noodle ' || i END
      WHEN 4 THEN CASE WHEN r < 0.35 THEN 'Num Pang Shop ' || i WHEN r < 0.60 THEN 'Sandwich Stall ' || i WHEN r < 0.80 THEN 'Baguette House ' || i ELSE 'Pate Sandwich ' || i END
      WHEN 5 THEN CASE WHEN r < 0.40 THEN 'Chek Chen Stall ' || i WHEN r < 0.65 THEN 'Fried Bananas ' || i WHEN r < 0.85 THEN 'Banana Fritters ' || i ELSE 'Crispy Treats ' || i END
      WHEN 6 THEN CASE WHEN r < 0.25 THEN 'Cafe ' || i WHEN r < 0.45 THEN 'Coffee Shop ' || i WHEN r < 0.60 THEN 'Tea House ' || i WHEN r < 0.80 THEN 'Boba & Tea ' || i ELSE 'Smoothie Bar ' || i END
      WHEN 7 THEN CASE WHEN r < 0.40 THEN 'Banh Sung ' || i WHEN r < 0.65 THEN 'Steamed Rice Rolls ' || i WHEN r < 0.85 THEN 'Rice Roll Shop ' || i ELSE 'Fresh Rice Rolls ' || i END
      WHEN 8 THEN CASE WHEN r < 0.40 THEN 'Banh Xeo ' || i WHEN r < 0.65 THEN 'Crispy Crepe House ' || i WHEN r < 0.85 THEN 'Vietnamese Crepe ' || i ELSE 'Savory Crepe Shop ' || i END
      ELSE CASE WHEN r < 0.20 THEN 'Street Food ' || i WHEN r < 0.40 THEN 'Food Stall ' || i WHEN r < 0.60 THEN 'Local Eatery ' || i WHEN r < 0.80 THEN 'Quick Bite ' || i ELSE 'Snack Corner ' || i END
    END;
    lat := point_lats[i];
    lng := point_lngs[i];
    place_addr := 'Street ' || (100 + floor(random() * 900)::int) || ', Phnom Penh';
    photo_url := NULL;
    price := 1 + floor(random() * 4)::int;
    is_open := TRUE;

    INSERT INTO places (owner_id, is_admin_managed, category_id, name, description, location, address, photo_url, price_range, is_open, status)
    VALUES (owner_for_place[i], FALSE, cat_ids[cat_idx], place_name, 'Fresh and delicious ' || place_name || ' food.',
      ST_GeographyFromText('SRID=4326;POINT(' || lng || ' ' || lat || ')'),
      place_addr, photo_url, price, is_open, CASE WHEN is_open THEN 'active' ELSE 'closed' END)
    RETURNING id INTO p_id;

    FOR j IN 0..6 LOOP
      INSERT INTO place_hours (place_id, day_of_week, opens_at, closes_at)
      VALUES (p_id, j,
        CASE WHEN j = 6 THEN '08:00:00'::time ELSE '07:00:00'::time END,
        CASE WHEN j = 6 THEN '21:00:00'::time ELSE '22:00:00'::time END);
    END LOOP;

    item_count := 2 + floor(random() * 4)::int;
    FOR j IN 1..item_count LOOP
      r := random();
      IF j = 1 THEN
        item_cat := 'main course';
        item_name := CASE cat_idx
          WHEN 1 THEN CASE WHEN random() < 0.5 THEN 'Grilled Pork with Rice' ELSE 'Chicken Fried Rice' END
          WHEN 2 THEN CASE WHEN random() < 0.5 THEN 'Traditional Nom Banh Chok' ELSE 'Fish-based Nom Banh Chok' END
          WHEN 3 THEN CASE WHEN random() < 0.5 THEN 'Beef Kuyteav' ELSE 'Chicken Kuyteav' END
          WHEN 4 THEN CASE WHEN random() < 0.5 THEN 'Grilled Pork Num Pang' ELSE 'Chicken Baguette' END
          WHEN 5 THEN CASE WHEN random() < 0.5 THEN 'Classic Chek Chen' ELSE 'Mixed Fruit Fritters' END
          WHEN 6 THEN CASE WHEN random() < 0.5 THEN 'Cappuccino' ELSE 'Latte' END
          WHEN 7 THEN CASE WHEN random() < 0.5 THEN 'Traditional Banh Sung' ELSE 'Banh Sung with Pork' END
          WHEN 8 THEN CASE WHEN random() < 0.5 THEN 'Classic Banh Xeo' ELSE 'Shrimp Banh Xeo' END
          ELSE CASE WHEN random() < 0.5 THEN 'Daily Special' ELSE 'House Special' END
        END;
        item_price := 1.50 + random() * 4.0;
      ELSIF random() < 0.5 THEN
        item_cat := 'drink';
        item_name := CASE WHEN random() < 0.3 THEN 'Iced Coffee' WHEN random() < 0.5 THEN 'Lemonade' WHEN random() < 0.7 THEN 'Coconut Water' WHEN random() < 0.85 THEN 'Sugar Cane Juice' ELSE 'Iced Tea' END;
        item_price := 0.75 + random() * 2.0;
      ELSIF random() < 0.7 THEN
        item_cat := 'snack';
        item_name := CASE WHEN random() < 0.3 THEN 'Spring Rolls' WHEN random() < 0.55 THEN 'Fried Wontons' WHEN random() < 0.75 THEN 'Rice Crackers' ELSE 'Vegetable Fritters' END;
        item_price := 0.50 + random() * 2.0;
      ELSE
        item_cat := 'dessert';
        item_name := CASE WHEN random() < 0.35 THEN 'Fried Bananas' WHEN random() < 0.60 THEN 'Mango Sticky Rice' WHEN random() < 0.80 THEN 'Coconut Pudding' ELSE 'Sweet Rice Balls' END;
        item_price := 0.75 + random() * 2.5;
      END IF;

      WITH created_item AS (
        INSERT INTO menu_items (owner_id, name, description, price, category)
        VALUES (owner_for_place[i], item_name, 'Freshly prepared ' || item_name, round(item_price::numeric, 2), item_cat)
        RETURNING id
      )
      INSERT INTO place_menu_items (place_id, menu_item_id)
      SELECT p_id, id FROM created_item;
    END LOOP;

    IF random() > 0.6 THEN
      r := 1 + floor(random() * 5)::int;
      FOR j IN 1..r::int LOOP
        review_rating := 3 + floor(random() * 3)::int;
        review_body := review_bodies[1 + floor(random() * array_length(review_bodies, 1))::int];
        INSERT INTO reviews (place_id, user_id, rating, body, is_moderated)
        VALUES (p_id, v_consumer, review_rating, review_body, TRUE);
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- Onboarding config
CREATE TABLE onboarding_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_link TEXT DEFAULT '',
  message TEXT DEFAULT 'Connect your vendor account to Telegram for real-time notifications, support, and verification.',
  steps TEXT[] DEFAULT ARRAY[
    'Tap the button to open Telegram',
    'Bot guides your verification',
    'Account linked automatically',
    'Get real-time notifications'
  ],
  safety_tips TEXT[] DEFAULT ARRAY[
    'We never ask for your password or OTP on Telegram',
    'Always verify the account handle matches exactly',
    'Use only the official Telegram link shown on this page'
  ],
  footer TEXT DEFAULT 'Questions? Vendors should use the official Telegram channel configured here.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO onboarding_config (telegram_link, message)
VALUES ('', 'Connect your vendor account to Telegram for real-time notifications, support, and verification.');

-- Backfill rating aggregates
UPDATE places p
SET rating_avg = COALESCE(
  (SELECT ROUND(AVG(rating)::numeric, 2)
   FROM reviews r WHERE r.place_id = p.id AND r.deleted_at IS NULL),
  0
),
rating_count = COALESCE(
  (SELECT COUNT(*)::integer
   FROM reviews r WHERE r.place_id = p.id AND r.deleted_at IS NULL),
  0
);

-- Seed system preset queries
INSERT INTO query_presets (title, query_string, category, is_system_preset, last_used_at) VALUES
  ('Table Sizes', 'SELECT relname AS table_name, n_live_tup AS row_count, pg_size_pretty(pg_total_relation_size(relid)) AS total_size FROM pg_stat_user_tables ORDER BY n_live_tup DESC', 'viewing', TRUE, NOW()),
  ('Recent Registrations', 'SELECT id, email, first_name, last_name, role_scope, created_at FROM users WHERE created_at > NOW() - INTERVAL ''7 days'' ORDER BY created_at DESC', 'viewing', TRUE, NOW()),
  ('Top Rated Stalls', 'SELECT p.id, p.name, p.rating_avg, p.rating_count, c.name AS category FROM places p JOIN place_categories c ON c.id = p.category_id WHERE p.rating_count >= 3 ORDER BY p.rating_avg DESC LIMIT 20', 'viewing', TRUE, NOW()),
  ('Unhealthy Indexes', 'SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan < 10 ORDER BY idx_scan ASC LIMIT 20', 'viewing', TRUE, NOW()),
  ('Review Distribution', 'SELECT rating, COUNT(*)::int AS count FROM reviews GROUP BY rating ORDER BY rating', 'viewing', TRUE, NOW()),
  ('Stalls per Category', 'SELECT c.name AS category, COUNT(p.id)::int AS stall_count FROM place_categories c LEFT JOIN places p ON p.category_id = c.id GROUP BY c.id, c.name ORDER BY stall_count DESC', 'viewing', TRUE, NOW()),
  ('Banned Users', 'SELECT id, email, role_scope, created_at FROM users WHERE is_banned = TRUE ORDER BY created_at DESC', 'viewing', TRUE, NOW()),
  ('Idle Connections', 'SELECT pid, usename, application_name, state, query, state_change FROM pg_stat_activity WHERE state = ''idle'' ORDER BY state_change DESC LIMIT 20', 'viewing', TRUE, NOW()),
  ('Lock Waits', 'SELECT blocked.pid AS blocked_pid, blocked.query AS blocked_query, blocking.pid AS blocking_pid, blocking.query AS blocking_query FROM pg_locks blocked_l JOIN pg_stat_activity blocked ON blocked.pid = blocked_l.pid JOIN pg_locks blocking_l ON blocking_l.locktype = blocked_l.locktype AND blocking_l.database IS NOT DISTINCT FROM blocked_l.database AND blocking_l.relation IS NOT DISTINCT FROM blocked_l.relation AND blocking_l.pid != blocked_l.pid JOIN pg_stat_activity blocking ON blocking.pid = blocking_l.pid WHERE NOT blocked_l.granted', 'viewing', TRUE, NOW()),
  ('Dead Tuples', 'SELECT relname, n_dead_tup, n_live_tup, round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct FROM pg_stat_user_tables WHERE n_dead_tup > 0 ORDER BY n_dead_tup DESC', 'viewing', TRUE, NOW()),
  ('Recent Admin Actions', 'SELECT id, admin_id, action, target_type, target_id, details, created_at FROM audit_log ORDER BY created_at DESC LIMIT 50', 'viewing', TRUE, NOW()),
  ('Active User Sessions', 'SELECT pid, usename, application_name, state, query, state_change FROM pg_stat_activity WHERE state = ''active'' ORDER BY state_change DESC LIMIT 20', 'viewing', TRUE, NOW()),
  ('Clear Old Search History', 'DELETE FROM search_history WHERE created_at < NOW() - INTERVAL ''30 days'' RETURNING id', 'deleting', TRUE, NOW()),
  ('Delete Expired Activity Logs', 'DELETE FROM database_activity_log WHERE executed_at < NOW() - INTERVAL ''90 days'' RETURNING id', 'deleting', TRUE, NOW()),
  ('Cleanup Orphaned Reviews', 'DELETE FROM reviews WHERE place_id NOT IN (SELECT id FROM places) RETURNING id', 'deleting', TRUE, NOW()),
  ('Create Test Category', 'INSERT INTO place_categories (name, description) VALUES (''Quick Test'', ''Auto-generated test category'') RETURNING *', 'creating', TRUE, NOW()),
  ('VACUUM Full Database', 'VACUUM', 'altering', TRUE, NOW()),
  ('VACUUM ANALYZE', 'VACUUM ANALYZE', 'altering', TRUE, NOW()),
  ('ANALYZE Full Database', 'ANALYZE', 'updating', TRUE, NOW()),
  ('Update Stall Ratings', 'UPDATE places SET rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE place_id = places.id), rating_count = (SELECT COUNT(*) FROM reviews WHERE place_id = places.id) WHERE EXISTS (SELECT 1 FROM reviews WHERE place_id = places.id)', 'updating', TRUE, NOW())
ON CONFLICT DO NOTHING;

-- Seed roles
INSERT INTO "role" (name, table_privileges, grant_option) VALUES
  ('CONSUMER', '{"users": ["SELECT"], "reviews": ["SELECT", "INSERT", "UPDATE", "DELETE"]}'::jsonb, FALSE),
  ('VENDOR', '{"places": ["SELECT", "INSERT", "UPDATE", "DELETE"], "menu_items": ["SELECT", "INSERT", "UPDATE", "DELETE"], "reviews": ["SELECT"]}'::jsonb, FALSE),
  ('GLOBAL_ADMIN', '{"users": ["SELECT", "INSERT", "UPDATE", "DELETE"], "places": ["SELECT", "INSERT", "UPDATE", "DELETE"], "reviews": ["SELECT", "INSERT", "UPDATE", "DELETE"], "roles": ["SELECT", "INSERT", "UPDATE", "DELETE"]}'::jsonb, TRUE),
  ('BUSINESS_ASSISTANCE', '{"places": ["SELECT", "INSERT", "UPDATE", "DELETE"], "reviews": ["SELECT", "UPDATE", "DELETE"], "onboarding_config": ["SELECT", "UPDATE"]}'::jsonb, FALSE),
  ('DEVELOPER_ADMIN', '{"all_tables": ["SELECT"], "system": ["MAINTENANCE", "BACKUP", "QUERY"]}'::jsonb, TRUE)
ON CONFLICT (name) DO NOTHING;

COMMIT;
