-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS user_credentials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with explicit column definitions
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    auth_id TEXT,
    language TEXT DEFAULT 'es',
    theme TEXT DEFAULT 'default',
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expiry TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    pomodoro_sessions INTEGER DEFAULT 0,
    work_duration INTEGER DEFAULT 25,
    short_break_duration INTEGER DEFAULT 5,
    long_break_duration INTEGER DEFAULT 15,
    sessions_until_long_break INTEGER DEFAULT 4,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create user_credentials table for authentication
CREATE TABLE user_credentials (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    date TEXT NOT NULL,
    time TEXT,
    category TEXT DEFAULT 'personal',
    priority TEXT DEFAULT 'medium',
    completed_at TEXT,
    notification_enabled BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create wishlist_items table
CREATE TABLE wishlist_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create notes table
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create achievements table
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    unlocked_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_email ON user_credentials(email);
CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON user_credentials(user_id);

-- Enable Row Level Security (RLS) - but make it permissive for now
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all tables
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wishlist_items" ON wishlist_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on achievements" ON achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_credentials" ON user_credentials FOR ALL USING (true) WITH CHECK (true);

-- Insert admin user with explicit timestamps
INSERT INTO users (
    id, 
    name, 
    email, 
    language, 
    theme, 
    is_premium, 
    premium_expiry,
    onboarding_completed, 
    pomodoro_sessions, 
    work_duration, 
    short_break_duration, 
    long_break_duration, 
    sessions_until_long_break,
    created_at,
    updated_at
) VALUES (
    'admin-user-535353',
    'Administrator',
    'admin',
    'es',
    'default',
    true,
    '2025-12-31T23:59:59.000Z',
    true,
    0,
    25,
    5,
    15,
    4,
    '2024-01-01T00:00:00.000Z',
    '2024-01-01T00:00:00.000Z'
) ON CONFLICT (email) DO UPDATE SET
    is_premium = EXCLUDED.is_premium,
    premium_expiry = EXCLUDED.premium_expiry,
    updated_at = '2024-01-01T00:00:00.000Z';

-- Insert admin credentials (password: 535353-Jrl, hashed with simple base64)
INSERT INTO user_credentials (
    id,
    user_id,
    email,
    password_hash,
    created_at,
    updated_at
) VALUES (
    'admin-cred-535353',
    'admin-user-535353',
    'admin',
    'NTM1MzUzLUpybHNhbHQxMjM=',
    '2024-01-01T00:00:00.000Z',
    '2024-01-01T00:00:00.000Z'
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = '2024-01-01T00:00:00.000Z';
