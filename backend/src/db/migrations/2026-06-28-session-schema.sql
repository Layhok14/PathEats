BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID,
  jti TEXT,
  token_hash TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by UUID,
  created_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS family_id UUID;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS jti TEXT;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS token_hash TEXT;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS replaced_by UUID;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS created_ip TEXT;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'refresh_tokens'
      AND column_name = 'token'
  ) THEN
    EXECUTE 'UPDATE refresh_tokens SET token_hash = encode(digest(token, ''sha256''), ''hex'') WHERE token_hash IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'refresh_tokens'
      AND column_name = 'revoked'
  ) THEN
    EXECUTE 'UPDATE refresh_tokens SET revoked_at = COALESCE(revoked_at, NOW()) WHERE revoked = TRUE';
  END IF;
END $$;

UPDATE refresh_tokens
SET family_id = gen_random_uuid()
WHERE family_id IS NULL;

UPDATE refresh_tokens
SET jti = id::text
WHERE jti IS NULL;

UPDATE refresh_tokens
SET token_hash = encode(digest(id::text || ':' || user_id::text || ':' || created_at::text, 'sha256'), 'hex')
WHERE token_hash IS NULL;

ALTER TABLE refresh_tokens ALTER COLUMN family_id SET NOT NULL;
ALTER TABLE refresh_tokens ALTER COLUMN jti SET NOT NULL;
ALTER TABLE refresh_tokens ALTER COLUMN token_hash SET NOT NULL;

ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS token;
ALTER TABLE refresh_tokens DROP COLUMN IF EXISTS revoked;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'refresh_tokens_replaced_by_fkey'
  ) THEN
    ALTER TABLE refresh_tokens
      ADD CONSTRAINT refresh_tokens_replaced_by_fkey
      FOREIGN KEY (replaced_by) REFERENCES refresh_tokens(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_hash_unique ON refresh_tokens(token_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_jti_unique ON refresh_tokens(jti);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_active
  ON refresh_tokens(user_id, expires_at DESC)
  WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);

CREATE TABLE IF NOT EXISTS session_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  refresh_token_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
  family_id UUID,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'login_success',
      'login_failed',
      'register_success',
      'refresh_success',
      'refresh_failed',
      'refresh_reuse_detected',
      'logout',
      'logout_all'
    )
  ),
  ip_address TEXT,
  user_agent TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_events_user_created
  ON session_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_events_family ON session_events(family_id);
CREATE INDEX IF NOT EXISTS idx_session_events_type_created
  ON session_events(event_type, created_at DESC);

COMMIT;
