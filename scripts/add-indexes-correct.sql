-- Add performance indexes to existing tables only
-- This script is safe and will not modify any data

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Notes table indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

-- AI Conversations table indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);

-- User Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_rating ON user_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_user_reviews_created_at ON user_reviews(created_at);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(timestamp);

-- Push Subscriptions table indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Teams table indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- Team Members table indexes
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);

-- Team Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id ON team_tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to ON team_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_team_tasks_status ON team_tasks(status);
CREATE INDEX IF NOT EXISTS idx_team_tasks_due_date ON team_tasks(due_date);

-- Wishlist Items table indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_priority ON wishlist_items(priority);

-- Pomodoro Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_created_at ON pomodoro_sessions(created_at);

-- Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_created_at ON achievements(created_at);
