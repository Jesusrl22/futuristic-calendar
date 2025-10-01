-- Fix Supabase schema to match application requirements
-- Run this script in your Supabase SQL editor

-- First, let's add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_credits_reset_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ai_total_tokens_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_total_cost_eur DECIMAL(10,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_monthly_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_plan_type VARCHAR(20) DEFAULT 'none';

-- Fix tasks table - rename 'text' to 'title' and add missing columns
DO $$ 
BEGIN
    -- Check if 'text' column exists and 'title' doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'text') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'title') THEN
        ALTER TABLE tasks RENAME COLUMN text TO title;
    END IF;
    
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'title') THEN
        ALTER TABLE tasks ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add missing columns to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium';

-- Fix notes table - ensure it has the right structure
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT 'Untitled',
ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';

-- Update notes that might have NULL titles
UPDATE notes SET title = 'Untitled' WHERE title IS NULL;

-- Fix wishlist table - rename if needed and add missing columns
DO $$ 
BEGIN
    -- Check if wishlist table exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlist_items') THEN
        CREATE TABLE wishlist_items (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            priority VARCHAR(10) DEFAULT 'medium',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
    
    -- If wishlist table exists instead of wishlist_items, rename it
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlist') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlist_items') THEN
        ALTER TABLE wishlist RENAME TO wishlist_items;
    END IF;
END $$;

-- Add missing columns to wishlist_items
ALTER TABLE wishlist_items 
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium';

-- Fix wishlist_items - rename 'text' to 'title' if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wishlist_items' AND column_name = 'text') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wishlist_items' AND column_name = 'title') THEN
        ALTER TABLE wishlist_items RENAME COLUMN text TO title;
    END IF;
    
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wishlist_items' AND column_name = 'title') THEN
        ALTER TABLE wishlist_items ADD COLUMN title TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Update RLS policies for wishlist_items if they don't exist
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist_items;
    DROP POLICY IF EXISTS "Users can update own wishlist" ON wishlist_items;
    DROP POLICY IF EXISTS "Users can insert own wishlist" ON wishlist_items;
    DROP POLICY IF EXISTS "Users can delete own wishlist" ON wishlist_items;
    
    -- Create new policies
    CREATE POLICY "Users can view own wishlist" ON wishlist_items FOR SELECT USING (true);
    CREATE POLICY "Users can update own wishlist" ON wishlist_items FOR UPDATE USING (true);
    CREATE POLICY "Users can insert own wishlist" ON wishlist_items FOR INSERT WITH CHECK (true);
    CREATE POLICY "Users can delete own wishlist" ON wishlist_items FOR DELETE USING (true);
END $$;

-- Enable RLS on wishlist_items if not already enabled
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_priority ON wishlist_items(priority);

-- Update any existing data to have proper defaults
UPDATE users SET ai_credits = 0 WHERE ai_credits IS NULL;
UPDATE users SET ai_credits_used = 0 WHERE ai_credits_used IS NULL;
UPDATE users SET ai_total_tokens_used = 0 WHERE ai_total_tokens_used IS NULL;
UPDATE users SET ai_total_cost_eur = 0 WHERE ai_total_cost_eur IS NULL;
UPDATE users SET ai_monthly_limit = 0 WHERE ai_monthly_limit IS NULL;
UPDATE users SET ai_plan_type = 'none' WHERE ai_plan_type IS NULL;

UPDATE tasks SET priority = 'medium' WHERE priority IS NULL;
UPDATE wishlist_items SET priority = 'medium' WHERE priority IS NULL;

-- Verify the schema
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'tasks', 'notes', 'wishlist_items')
ORDER BY table_name, ordinal_position;
