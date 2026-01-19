-- Fix RLS policies for users table to allow authenticated users to view their own data

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "users_own_profile" ON users;
DROP POLICY IF EXISTS "admin_all_users" ON users;
DROP POLICY IF EXISTS "Users can view own profile (SELECT)" ON users;
DROP POLICY IF EXISTS "Admins can view all users (SELECT)" ON users;

-- Create new, more permissive policies

-- Allow authenticated users to SELECT their own profile
CREATE POLICY "users_view_own_profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to view all users
CREATE POLICY "admin_view_all_users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() AND u.is_admin = true
    )
  );

-- Allow users to UPDATE their own profile
CREATE POLICY "users_update_own_profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to INSERT (signup)
CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow service role to manage all users (for admin operations)
CREATE POLICY "service_role_all_users" ON users
  FOR ALL
  USING (current_role = 'service_role')
  WITH CHECK (current_role = 'service_role');

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Test: Verify policies are working
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
