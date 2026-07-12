BEGIN;

CREATE TABLE IF NOT EXISTS query_presets (
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_query_presets_system_title
  ON query_presets (title)
  WHERE is_system_preset = TRUE;

CREATE TABLE IF NOT EXISTS database_activity_log (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(20) NOT NULL
    CHECK (event_type IN ('login_success', 'login_failed', 'query_execution')),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payload TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dal_event_type ON database_activity_log(event_type);
CREATE INDEX IF NOT EXISTS idx_dal_executed_at ON database_activity_log(executed_at DESC);

COMMIT;
