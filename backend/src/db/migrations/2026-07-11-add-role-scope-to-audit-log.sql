-- Audit log table + role_scope column for role-scoped activity tracking.
-- Self-contained: creates the table if a fresh migration run precedes seed.
BEGIN;

CREATE TABLE IF NOT EXISTS audit_log (
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

ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS role_scope VARCHAR(30);
CREATE INDEX IF NOT EXISTS idx_audit_log_role_scope ON audit_log(role_scope);

COMMIT;
