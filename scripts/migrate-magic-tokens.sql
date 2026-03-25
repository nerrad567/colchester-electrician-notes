-- Single-use magic link tokens (H3 security fix)
-- Run against the colchester-electrician Neon project

CREATE TABLE IF NOT EXISTS magic_tokens (
  jti TEXT PRIMARY KEY,
  consumed BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for cleanup of expired tokens
CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires_at ON magic_tokens (expires_at);
