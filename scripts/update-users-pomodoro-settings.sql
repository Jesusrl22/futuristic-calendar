-- Update users table to include Pomodoro settings if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS work_duration INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS short_break_duration INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS long_break_duration INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS sessions_until_long_break INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS pomodoro_sessions INTEGER DEFAULT 0;

-- Update existing users with default Pomodoro settings
UPDATE users 
SET 
    work_duration = COALESCE(work_duration, 25),
    short_break_duration = COALESCE(short_break_duration, 5),
    long_break_duration = COALESCE(long_break_duration, 15),
    sessions_until_long_break = COALESCE(sessions_until_long_break, 4),
    pomodoro_sessions = COALESCE(pomodoro_sessions, 0)
WHERE work_duration IS NULL 
   OR short_break_duration IS NULL 
   OR long_break_duration IS NULL 
   OR sessions_until_long_break IS NULL 
   OR pomodoro_sessions IS NULL;

-- Add comment explaining the Pomodoro settings
COMMENT ON COLUMN users.work_duration IS 'Duration of work sessions in minutes (default: 25)';
COMMENT ON COLUMN users.short_break_duration IS 'Duration of short breaks in minutes (default: 5)';
COMMENT ON COLUMN users.long_break_duration IS 'Duration of long breaks in minutes (default: 15)';
COMMENT ON COLUMN users.sessions_until_long_break IS 'Number of work sessions before a long break (default: 4)';
COMMENT ON COLUMN users.pomodoro_sessions IS 'Total number of completed Pomodoro sessions';
