-- Add language column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'es';

-- Add index for language queries
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language);

-- Update existing users to have Spanish as default language
UPDATE users SET language = 'es' WHERE language IS NULL;

-- Add comment
COMMENT ON COLUMN users.language IS 'User preferred language (es, en)';
