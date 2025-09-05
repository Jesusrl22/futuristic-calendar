-- Add Pomodoro settings columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS work_duration INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS short_break_duration INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS long_break_duration INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS sessions_until_long_break INTEGER DEFAULT 4;

-- Update existing users with default Pomodoro settings
UPDATE users 
SET 
  work_duration = COALESCE(work_duration, 25),
  short_break_duration = COALESCE(short_break_duration, 5),
  long_break_duration = COALESCE(long_break_duration, 15),
  sessions_until_long_break = COALESCE(sessions_until_long_break, 4),
  updated_at = NOW()
WHERE 
  work_duration IS NULL 
  OR short_break_duration IS NULL 
  OR long_break_duration IS NULL 
  OR sessions_until_long_break IS NULL;

-- Create admin user with credentials: admin / 535353-Jrl
INSERT INTO users (
  id,
  name,
  email,
  password,
  language,
  theme,
  is_premium,
  onboarding_completed,
  pomodoro_sessions,
  work_duration,
  short_break_duration,
  long_break_duration,
  sessions_until_long_break,
  created_at,
  updated_at
) VALUES (
  'admin-user-id-12345',
  'Administrator',
  'admin',
  '535353-Jrl',
  'es',
  'default',
  true,
  true,
  0,
  25,
  5,
  15,
  4,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  is_premium = EXCLUDED.is_premium,
  updated_at = NOW();
