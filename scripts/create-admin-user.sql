-- Create admin user with credentials: admin / 535353-Jrl
-- This script will create the admin user if it doesn't exist

INSERT INTO users (
  id,
  name,
  email,
  password,
  language,
  theme,
  is_premium,
  premium_expiry,
  onboarding_completed,
  pomodoro_sessions,
  work_duration,
  short_break_duration,
  long_break_duration,
  sessions_until_long_break,
  created_at,
  updated_at
) VALUES (
  'admin-user-001',
  'Administrator',
  'admin@admin.com',
  '535353-Jrl',
  'en',
  'dark',
  true,
  '2025-12-31T23:59:59.000Z',
  true,
  0,
  25,
  5,
  15,
  4,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify admin user was created
SELECT 
  id,
  name,
  email,
  is_premium,
  onboarding_completed
FROM users 
WHERE email = 'admin@admin.com';
