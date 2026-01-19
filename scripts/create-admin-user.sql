-- Create admin user with your email
-- Replace 'your-email@example.com' with your actual email

INSERT INTO users (id, email, name, is_admin, subscription_plan, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@calendar-app.com',
  'Admin User',
  true,
  'pro',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET is_admin = true;

-- Verify admin was created
SELECT id, email, name, is_admin, subscription_plan FROM users WHERE is_admin = true;

-- Show total admin count
SELECT COUNT(*) as admin_count FROM users WHERE is_admin = true;
