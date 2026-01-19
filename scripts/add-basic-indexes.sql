-- Add basic performance indexes on commonly queried columns
-- This script only adds indexes on columns that exist in all tables

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Tasks table indexes  
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Team tasks indexes
CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id ON team_tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to ON team_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_team_tasks_due_date ON team_tasks(due_date);

-- Calendar events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Push subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- AI conversations indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);

-- Pomodoro sessions indexes
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_created_at ON pomodoro_sessions(created_at);

COMMENT ON INDEX idx_users_email IS 'Index for fast user lookups by email during authentication';
COMMENT ON INDEX idx_tasks_user_id IS 'Index for fast task queries by user';
COMMENT ON INDEX idx_notifications_user_id IS 'Index for fast notification queries by user';
