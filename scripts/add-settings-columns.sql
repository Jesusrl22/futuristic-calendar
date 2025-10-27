-- Add all missing settings columns to users table
-- This script is idempotent - safe to run multiple times

-- Theme settings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'theme'
  ) THEN
    ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'dark';
  END IF;
END $$;

-- Language settings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'language'
  ) THEN
    ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'es';
  END IF;
END $$;

-- Pomodoro work duration
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'work_duration'
  ) THEN
    ALTER TABLE users ADD COLUMN work_duration INTEGER DEFAULT 25;
  END IF;
END $$;

-- Pomodoro short break duration
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'short_break_duration'
  ) THEN
    ALTER TABLE users ADD COLUMN short_break_duration INTEGER DEFAULT 5;
  END IF;
END $$;

-- Pomodoro long break duration
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'long_break_duration'
  ) THEN
    ALTER TABLE users ADD COLUMN long_break_duration INTEGER DEFAULT 15;
  END IF;
END $$;

-- Sessions until long break
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'sessions_until_long_break'
  ) THEN
    ALTER TABLE users ADD COLUMN sessions_until_long_break INTEGER DEFAULT 4;
  END IF;
END $$;

-- Notifications enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'notifications_enabled'
  ) THEN
    ALTER TABLE users ADD COLUMN notifications_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Sound enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'sound_enabled'
  ) THEN
    ALTER TABLE users ADD COLUMN sound_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Volume
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'volume'
  ) THEN
    ALTER TABLE users ADD COLUMN volume INTEGER DEFAULT 50;
  END IF;
END $$;

-- Font size
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'font_size'
  ) THEN
    ALTER TABLE users ADD COLUMN font_size TEXT DEFAULT 'medium';
  END IF;
END $$;

-- Compact mode
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'compact_mode'
  ) THEN
    ALTER TABLE users ADD COLUMN compact_mode BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update existing users with default values if any columns were NULL
UPDATE users 
SET 
  theme = COALESCE(theme, 'dark'),
  language = COALESCE(language, 'es'),
  work_duration = COALESCE(work_duration, 25),
  short_break_duration = COALESCE(short_break_duration, 5),
  long_break_duration = COALESCE(long_break_duration, 15),
  sessions_until_long_break = COALESCE(sessions_until_long_break, 4),
  notifications_enabled = COALESCE(notifications_enabled, false),
  sound_enabled = COALESCE(sound_enabled, true),
  volume = COALESCE(volume, 50),
  font_size = COALESCE(font_size, 'medium'),
  compact_mode = COALESCE(compact_mode, false)
WHERE 
  theme IS NULL 
  OR language IS NULL 
  OR work_duration IS NULL 
  OR short_break_duration IS NULL 
  OR long_break_duration IS NULL 
  OR sessions_until_long_break IS NULL
  OR notifications_enabled IS NULL
  OR sound_enabled IS NULL
  OR volume IS NULL
  OR font_size IS NULL
  OR compact_mode IS NULL;

-- Verify the columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN (
  'theme', 'language', 'work_duration', 'short_break_duration', 
  'long_break_duration', 'sessions_until_long_break', 'notifications_enabled',
  'sound_enabled', 'volume', 'font_size', 'compact_mode'
)
ORDER BY column_name;
