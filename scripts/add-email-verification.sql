-- Add email verification columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token);

-- Update existing users to be verified (for backward compatibility)
UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Add subscription management columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_ends_at ON users(subscription_ends_at);

-- Add constraint for valid subscription statuses
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS chk_subscription_status;

ALTER TABLE users 
ADD CONSTRAINT chk_subscription_status 
CHECK (subscription_status IN ('active', 'cancelled', 'inactive'));

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
DROP TRIGGER IF EXISTS update_subscription_status_trigger ON users;
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
