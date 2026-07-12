BEGIN;

ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS run_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS run_started_at TIMESTAMPTZ;
ALTER TABLE backup_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE backup_profiles
SET is_enabled = schedule_interval IS NOT NULL
  AND schedule_interval <> ''
  AND schedule_interval <> '0'
  AND schedule_unit IS NOT NULL
WHERE is_enabled = FALSE AND status <> 'PAUSED';

UPDATE backup_profiles
SET status = CASE
  WHEN status = 'PAUSED' THEN 'PAUSED'
  WHEN is_enabled THEN 'ACTIVE'
  ELSE 'MANUAL'
END;

ALTER TABLE scheduled_backups ADD COLUMN IF NOT EXISTS artifact_format VARCHAR(50);
ALTER TABLE scheduled_backups ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_backup_profiles_due
  ON backup_profiles(is_enabled, next_backup_at)
  WHERE is_enabled = TRUE;
CREATE INDEX IF NOT EXISTS idx_scheduled_backups_profile_created
  ON scheduled_backups(profile_id, created_at DESC);

COMMIT;
