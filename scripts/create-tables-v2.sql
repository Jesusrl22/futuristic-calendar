-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS user_credentials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table FIRST
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    language VARCHAR(10) DEFAULT 'es',
    theme VARCHAR(50) DEFAULT 'default',
    is_premium BOOLEAN DEFAULT false,
    is_pro BOOLEAN DEFAULT false,
    premium_expiry TIMESTAMP,
    onboarding_completed BOOLEAN DEFAULT false,
    pomodoro_sessions INTEGER DEFAULT 0,
    work_duration INTEGER DEFAULT 25,
    short_break_duration INTEGER DEFAULT 5,
    long_break_duration INTEGER DEFAULT 15,
    sessions_until_long_break INTEGER DEFAULT 4,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    email_verification_expires TIMESTAMP WITH TIME ZONE,
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    subscription_cancelled_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT check_subscription_status CHECK (subscription_status IN ('active', 'cancelled', 'inactive'))
);

-- Create user_credentials table
CREATE TABLE user_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    time VARCHAR(10),
    date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(50) DEFAULT 'personal',
    priority VARCHAR(10) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notes table
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create email logs table
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_credentials_email ON user_credentials(email);
CREATE INDEX idx_users_verification_token ON users(email_verification_token);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_subscription_ends_at ON users(subscription_ends_at);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If subscription is cancelled and end date has passed, set to inactive
    IF NEW.subscription_status = 'cancelled' 
       AND NEW.subscription_ends_at IS NOT NULL 
       AND NEW.subscription_ends_at < CURRENT_TIMESTAMP THEN
        NEW.subscription_status = 'inactive';
        NEW.is_premium = FALSE;
        NEW.is_pro = FALSE;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subscription status updates
CREATE TRIGGER update_subscription_status_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_status();

-- Create view for subscription analytics
CREATE OR REPLACE VIEW subscription_analytics AS
SELECT 
    subscription_status,
    COUNT(*) as user_count,
    COUNT(CASE WHEN is_premium THEN 1 END) as premium_count,
    COUNT(CASE WHEN is_pro THEN 1 END) as pro_count
FROM users 
GROUP BY subscription_status;
