-- Check users table
SELECT COUNT(*) as total_users FROM users;

-- List all users
SELECT id, email, name, subscription_tier, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- Check auth users
SELECT COUNT(*) as total_auth_users FROM auth.users;

-- List auth users
SELECT id, email, created_at FROM auth.users LIMIT 10;
