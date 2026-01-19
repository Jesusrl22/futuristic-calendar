-- Add security indexes and constraints for better performance and security

-- Index on users email for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on users is_admin for admin checks
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

-- Index on tasks user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Index on notes user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Index on notifications user_id and read status
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Index on push_subscriptions user_id
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

-- Index on ai_conversations user_id
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);

-- Index on team_members for faster team lookups
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Index on team_tasks for faster queries
CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id ON team_tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned ON team_tasks(assigned_to);

-- Add unique constraint on users email (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE(email);
  END IF;
END $$;

-- Add check constraint for email format validation
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_email_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

-- Add check constraint for subscription_tier values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_subscription_tier_valid'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_subscription_tier_valid 
    CHECK (subscription_tier IN ('free', 'premium', 'pro'));
  END IF;
END $$;

-- Ensure rating is between 1 and 5 for user_reviews
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_reviews_rating_range'
  ) THEN
    ALTER TABLE user_reviews ADD CONSTRAINT user_reviews_rating_range 
    CHECK (rating >= 1 AND rating <= 5);
  END IF;
END $$;

-- Add check for task priority values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_priority_valid'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_priority_valid 
    CHECK (priority IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- Add check for task status values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_status_valid'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_status_valid 
    CHECK (status IN ('todo', 'in_progress', 'done'));
  END IF;
END $$;

COMMIT;
