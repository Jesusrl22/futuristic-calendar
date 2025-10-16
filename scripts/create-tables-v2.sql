-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS subscription_events CASCADE;
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
    paypal_subscription_id VARCHAR(100),
    subscription_activated_at TIMESTAMP WITH TIME ZONE,
    subscription_suspended_at TIMESTAMP WITH TIME ZONE,
    subscription_cancel_reason TEXT,
    plan VARCHAR(50) DEFAULT 'free',
    ai_credits INTEGER DEFAULT 0,
    ai_credits_used INTEGER DEFAULT 0,
    ai_total_cost_eur DECIMAL(10,4) DEFAULT 0,
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

-- Create payment transactions table
CREATE TABLE payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending',
    paypal_order_id VARCHAR(100),
    paypal_capture_id VARCHAR(100),
    paypal_subscription_id VARCHAR(100),
    package_id VARCHAR(50),
    plan_id VARCHAR(50),
    credits_added INTEGER DEFAULT 0,
    ai_credits_added INTEGER DEFAULT 0,
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook events table
CREATE TABLE webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    resource_id VARCHAR(100),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB
);

-- Create subscription events table
CREATE TABLE subscription_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
CREATE INDEX idx_users_paypal_subscription ON users(paypal_subscription_id);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_payment_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_paypal_order ON payment_transactions(paypal_order_id);
CREATE INDEX idx_payment_paypal_subscription ON payment_transactions(paypal_subscription_id);
CREATE INDEX idx_payment_status ON payment_transactions(status);
CREATE INDEX idx_payment_type ON payment_transactions(type);
CREATE INDEX idx_webhook_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_event_id ON webhook_events(event_id);
CREATE INDEX idx_webhook_resource_id ON webhook_events(resource_id);
CREATE INDEX idx_subscription_events_user ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_subscription ON subscription_events(subscription_id);
CREATE INDEX idx_subscription_events_type ON subscription_events(event_type);

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

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
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
    COUNT(CASE WHEN is_pro THEN 1 END) as pro_count,
    AVG(CASE WHEN ai_total_cost_eur IS NOT NULL THEN ai_total_cost_eur ELSE 0 END) as avg_ai_cost
FROM users 
GROUP BY subscription_status;

COMMENT ON TABLE users IS 'Main users table with subscription and AI credits management';
COMMENT ON TABLE payment_transactions IS 'Payment transactions for credits and subscriptions';
COMMENT ON TABLE webhook_events IS 'PayPal webhook events log';
COMMENT ON TABLE subscription_events IS 'Subscription lifecycle events';
