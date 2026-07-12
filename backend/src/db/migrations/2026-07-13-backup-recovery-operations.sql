BEGIN;

CREATE TABLE IF NOT EXISTS backup_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_name VARCHAR(255) NOT NULL,
  method VARCHAR(50) NOT NULL,
  scope TEXT DEFAULT 'full',
  schedule_interval VARCHAR(50),
  schedule_unit VARCHAR(20),
  status VARCHAR(20) DEFAULT 'CONFIGURED',
  size VARCHAR(50) DEFAULT 'N/A',
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_error TEXT,
  run_count INTEGER NOT NULL DEFAULT 0,
  run_started_at TIMESTAMPTZ,
  last_backup_at TIMESTAMPTZ,
  next_backup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheduled_backups (
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

CREATE TABLE IF NOT EXISTS recovery_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recovery_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) DEFAULT 'N/A',
  scope TEXT,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'COMPLETED',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS last_backup_at TIMESTAMPTZ;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS next_backup_at TIMESTAMPTZ;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS run_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS run_started_at TIMESTAMPTZ;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE scheduled_backups ADD COLUMN IF NOT EXISTS artifact_format VARCHAR(50);
ALTER TABLE scheduled_backups ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE recovery_operations ADD COLUMN IF NOT EXISTS scope TEXT;
ALTER TABLE recovery_operations ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES users(id) ON DELETE SET NULL;

COMMIT;
