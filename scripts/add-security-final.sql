-- Security indexes and performance optimizations for existing tables
-- Safe to run on production without breaking existing data

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Team tasks indexes
CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id ON team_tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to ON team_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_team_tasks_status ON team_tasks(status);
CREATE INDEX IF NOT EXISTS idx_team_tasks_due_date ON team_tasks(due_date) WHERE due_date IS NOT NULL;

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

-- Team notes indexes
CREATE INDEX IF NOT EXISTS idx_team_notes_team_id ON team_notes(team_id);
CREATE INDEX IF NOT EXISTS idx_team_notes_created_by ON team_notes(created_by);

-- AI conversations indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated_at ON ai_conversations(updated_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp);

-- Push subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_invite_token ON teams(invite_token);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);

-- Team events indexes
CREATE INDEX IF NOT EXISTS idx_team_events_team_id ON team_events(team_id);
CREATE INDEX IF NOT EXISTS idx_team_events_start_time ON team_events(start_time);
CREATE INDEX IF NOT EXISTS idx_team_events_created_by ON team_events(created_by);

-- User reviews indexes
CREATE INDEX IF NOT EXISTS idx_user_reviews_rating ON user_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_user_reviews_created_at ON user_reviews(created_at);

-- Wishlist items indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_priority ON wishlist_items(priority);

-- Pomodoro sessions indexes
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_created_at ON pomodoro_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed ON pomodoro_sessions(completed);

-- Credit purchases indexes
CREATE INDEX IF NOT EXISTS idx_credit_purchases_user_id ON credit_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_status ON credit_purchases(status);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_created_at ON credit_purchases(created_at);

-- Task comments indexes
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked_at ON achievements(unlocked_at);

-- Add safe constraints (only non-breaking ones)
-- Ensure rating is between 1 and 5 for user reviews
ALTER TABLE user_reviews DROP CONSTRAINT IF EXISTS user_reviews_rating_check;
ALTER TABLE user_reviews ADD CONSTRAINT user_reviews_rating_check CHECK (rating >= 1 AND rating <= 5);

-- Ensure subscription tier is valid
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE users ADD CONSTRAINT users_subscription_tier_check CHECK (subscription_tier IN ('free', 'premium', 'pro') OR subscription_tier IS NULL);

-- Ensure priority is valid
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check CHECK (priority IN ('low', 'medium', 'high') OR priority IS NULL);

ALTER TABLE team_tasks DROP CONSTRAINT IF EXISTS team_tasks_priority_check;
ALTER TABLE team_tasks ADD CONSTRAINT team_tasks_priority_check CHECK (priority IN ('low', 'medium', 'high') OR priority IS NULL);

ALTER TABLE wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_priority_check;
ALTER TABLE wishlist_items ADD CONSTRAINT wishlist_items_priority_check CHECK (priority IN ('low', 'medium', 'high') OR priority IS NULL);

-- Ensure status is valid
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('todo', 'in-progress', 'completed') OR status IS NULL);

ALTER TABLE team_tasks DROP CONSTRAINT IF EXISTS team_tasks_status_check;
ALTER TABLE team_tasks ADD CONSTRAINT team_tasks_status_check CHECK (status IN ('todo', 'in-progress', 'completed') OR status IS NULL);
