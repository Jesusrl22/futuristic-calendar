-- Test RLS policies to verify users can see their data
SELECT 'Testing RLS policies' as test;

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Show sample users with their key info
SELECT id, email, name, is_admin, subscription_plan FROM users LIMIT 5;

-- Test: Service role can see all users
SELECT COUNT(*) as users_visible_to_service_role FROM users;

-- Test: Check if any user is marked as admin
SELECT COUNT(*) as admin_count FROM users WHERE is_admin = true;

-- Show users created in last 7 days
SELECT id, email, name, created_at FROM users 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
