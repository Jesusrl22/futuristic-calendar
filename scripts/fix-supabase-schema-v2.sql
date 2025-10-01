-- Fix Supabase schema issues
-- Add missing columns and fix constraints

-- First, let's add the missing is_pro column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'is_pro') THEN
        ALTER TABLE users ADD COLUMN is_pro BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Make the date column nullable in tasks table to avoid constraint violations
ALTER TABLE tasks ALTER COLUMN date DROP NOT NULL;

-- Clean up any orphaned records that might cause foreign key violations
DELETE FROM tasks WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM notes WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM wishlist_items WHERE user_id NOT IN (SELECT id FROM users);

-- Update RLS policies to be more permissive during development
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

CREATE POLICY "Users can manage own data" ON users
    FOR ALL USING (auth.uid()::text = id OR auth.uid()::text = auth_id);

-- Similar for tasks
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;

CREATE POLICY "Users can manage own tasks" ON tasks
    FOR ALL USING (auth.uid()::text = user_id);

-- Similar for notes
DROP POLICY IF EXISTS "Users can view own notes" ON notes;
DROP POLICY IF EXISTS "Users can manage own notes" ON notes;

CREATE POLICY "Users can manage own notes" ON notes
    FOR ALL USING (auth.uid()::text = user_id);

-- Similar for wishlist_items
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist_items;

CREATE POLICY "Users can manage own wishlist" ON wishlist_items
    FOR ALL USING (auth.uid()::text = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- Ensure ai_credits defaults to 0 for free users
UPDATE users SET ai_credits = 0 WHERE ai_credits IS NULL AND (is_pro = false OR is_pro IS NULL);

-- Add a function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (
        id,
        auth_id,
        name,
        email,
        language,
        theme,
        is_premium,
        is_pro,
        onboarding_completed,
        ai_credits,
        ai_credits_used,
        ai_total_tokens_used,
        ai_total_cost_eur,
        ai_monthly_limit,
        ai_plan_type,
        created_at,
        updated_at
    ) VALUES (
        NEW.id::text,
        NEW.id::text,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        'es',
        'default',
        false,
        false,
        false,
        0, -- Free users start with 0 credits
        0,
        0,
        0,
        0,
        'none',
        NOW()::text,
        NOW()::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
