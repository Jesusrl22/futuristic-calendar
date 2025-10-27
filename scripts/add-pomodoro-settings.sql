-- Add missing Pomodoro and UI settings columns to users table

-- Add work_duration column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'work_duration'
  ) THEN
    ALTER TABLE users ADD COLUMN work_duration INTEGER DEFAULT 25;
  END IF;
END $$;

-- Add short_break_duration column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'short_break_duration'
  ) THEN
    ALTER TABLE users ADD COLUMN short_break_duration INTEGER DEFAULT 5;
  END IF;
END $$;

-- Add long_break_duration column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'long_break_duration'
  ) THEN
    ALTER TABLE users ADD COLUMN long_break_duration INTEGER DEFAULT 15;
  END IF;
END $$;

-- Add sessions_until_long_break column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'sessions_until_long_break'
  ) THEN
    ALTER TABLE users ADD COLUMN sessions_until_long_break INTEGER DEFAULT 4;
  END IF;
END $$;

-- Add sound_enabled column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'sound_enabled'
  ) THEN
    ALTER TABLE users ADD COLUMN sound_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add volume column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'volume'
  ) THEN
    ALTER TABLE users ADD COLUMN volume INTEGER DEFAULT 50;
  END IF;
END $$;

-- Add font_size column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'font_size'
  ) THEN
    ALTER TABLE users ADD COLUMN font_size VARCHAR(10) DEFAULT 'medium';
  END IF;
END $$;

-- Add compact_mode column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'compact_mode'
  ) THEN
    ALTER TABLE users ADD COLUMN compact_mode BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update existing users with default values
UPDATE users 
SET 
  work_duration = COALESCE(work_duration, 25),
  short_break_duration = COALESCE(short_break_duration, 5),
  long_break_duration = COALESCE(long_break_duration, 15),
  sessions_until_long_break = COALESCE(sessions_until_long_break, 4),
  sound_enabled = COALESCE(sound_enabled, true),
  volume = COALESCE(volume, 50),
  font_size = COALESCE(font_size, 'medium'),
  compact_mode = COALESCE(compact_mode, false)
WHERE 
  work_duration IS NULL 
  OR short_break_duration IS NULL 
  OR long_break_duration IS NULL 
  OR sessions_until_long_break IS NULL
  OR sound_enabled IS NULL
  OR volume IS NULL
  OR font_size IS NULL
  OR compact_mode IS NULL;
