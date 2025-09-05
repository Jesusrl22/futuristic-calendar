-- Add Pomodoro configuration columns to users table
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
  sessions_until_long_break = COALESCE(sessions_until_long_break, 4)
WHERE work_duration IS NULL 
   OR short_break_duration IS NULL 
   OR long_break_duration IS NULL 
   OR sessions_until_long_break IS NULL;
