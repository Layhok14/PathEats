-- Add role_scope column to audit_log for role-scoped activity tracking
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS role_scope VARCHAR(30);
CREATE INDEX IF NOT EXISTS idx_audit_log_role_scope ON audit_log(role_scope);
