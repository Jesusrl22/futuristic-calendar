-- Add language column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'language'
    ) THEN
        ALTER TABLE users ADD COLUMN language VARCHAR(10) DEFAULT 'es';
        CREATE INDEX idx_users_language ON users(language);
        UPDATE users SET language = 'es' WHERE language IS NULL;
        
        COMMENT ON COLUMN users.language IS 'User preferred language (es, en, fr)';
    END IF;
END $$;
