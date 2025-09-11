-- Enhanced AI credits system with corrected business model
-- Run this after the basic tables are created

-- Add AI credits columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_credits_reset_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS ai_total_tokens_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_total_cost_eur DECIMAL(10,4) DEFAULT 0.0000,
ADD COLUMN IF NOT EXISTS ai_monthly_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_plan_type VARCHAR(10) DEFAULT 'monthly';

-- Create AI usage tracking table with detailed cost information
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    request_text TEXT NOT NULL,
    response_text TEXT,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    credits_consumed INTEGER NOT NULL DEFAULT 1,
    cost_eur DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    cost_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    model_used VARCHAR(50) DEFAULT 'gpt-4o-mini',
    request_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create AI cost tracking table for admin analytics
CREATE TABLE IF NOT EXISTS ai_cost_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_requests INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost_eur DECIMAL(10,4) DEFAULT 0.0000,
    total_cost_usd DECIMAL(10,4) DEFAULT 0.0000,
    active_users INTEGER DEFAULT 0,
    avg_tokens_per_request DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_model ON ai_usage(model_used);
CREATE INDEX IF NOT EXISTS idx_ai_usage_request_type ON ai_usage(request_type);

-- Update existing Pro users with initial credits based on corrected business model
UPDATE users 
SET 
    ai_credits = CASE 
        WHEN ai_plan_type = 'yearly' THEN 1200  -- €24 for AI + €6 profit = 1,200 credits
        ELSE 100  -- €2 for AI + €1 profit = 100 credits
    END,
    ai_credits_used = 0,
    ai_monthly_limit = 100, -- Same monthly limit for both plans
    ai_credits_reset_date = CASE 
        WHEN ai_plan_type = 'yearly' THEN (NOW() + INTERVAL '1 year')
        ELSE (NOW() + INTERVAL '1 month')
    END
WHERE is_pro = true AND (ai_credits = 0 OR ai_credits IS NULL);

-- Update existing Premium users (no AI credits)
UPDATE users 
SET 
    ai_credits = 0,
    ai_credits_used = 0,
    ai_credits_reset_date = NULL,
    ai_monthly_limit = 0
WHERE is_premium = true AND is_pro = false AND (ai_credits IS NULL);

-- Create function to automatically update daily analytics
CREATE OR REPLACE FUNCTION update_daily_ai_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO ai_cost_tracking (
        date,
        total_requests,
        total_tokens,
        total_cost_eur,
        total_cost_usd,
        active_users,
        avg_tokens_per_request
    )
    SELECT 
        CURRENT_DATE,
        COUNT(*),
        SUM(total_tokens),
        SUM(cost_eur),
        SUM(cost_usd),
        COUNT(DISTINCT user_id),
        AVG(total_tokens)
    FROM ai_usage 
    WHERE DATE(created_at) = CURRENT_DATE
    ON CONFLICT (date) 
    DO UPDATE SET
        total_requests = EXCLUDED.total_requests,
        total_tokens = EXCLUDED.total_tokens,
        total_cost_eur = EXCLUDED.total_cost_eur,
        total_cost_usd = EXCLUDED.total_cost_usd,
        active_users = EXCLUDED.active_users,
        avg_tokens_per_request = EXCLUDED.avg_tokens_per_request,
        created_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update analytics on new AI usage
CREATE TRIGGER trigger_update_ai_analytics
    AFTER INSERT ON ai_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_ai_analytics();

-- Create function to reset monthly credits for Pro users based on corrected business model
CREATE OR REPLACE FUNCTION reset_user_ai_credits(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
    new_credits INTEGER;
    new_limit INTEGER;
    reset_date TIMESTAMP;
BEGIN
    -- Get user info
    SELECT is_pro, ai_plan_type, premium_expiry INTO user_record
    FROM users WHERE id = user_uuid;
    
    -- Check if user is still Pro
    IF NOT user_record.is_pro OR (user_record.premium_expiry IS NOT NULL AND user_record.premium_expiry < NOW()) THEN
        RETURN FALSE;
    END IF;
    
    -- Calculate credits and limits based on corrected business model
    IF user_record.ai_plan_type = 'yearly' THEN
        new_credits := 1200; -- €24 for AI + €6 profit = 1,200 credits
        new_limit := 100; -- 100 per month limit
        reset_date := NOW() + INTERVAL '1 year';
    ELSE
        new_credits := 100; -- €2 for AI + €1 profit = 100 credits
        new_limit := 100; -- 100 per month limit
        reset_date := NOW() + INTERVAL '1 month';
    END IF;
    
    -- Update user credits
    UPDATE users SET
        ai_credits = new_credits,
        ai_credits_used = 0,
        ai_monthly_limit = new_limit,
        ai_credits_reset_date = reset_date
    WHERE id = user_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to get AI cost statistics
CREATE OR REPLACE FUNCTION get_ai_cost_stats()
RETURNS TABLE(
    total_users INTEGER,
    total_cost_eur DECIMAL(10,4),
    total_cost_usd DECIMAL(10,4),
    total_tokens INTEGER,
    total_requests INTEGER,
    avg_cost_per_user DECIMAL(10,4),
    avg_cost_per_request DECIMAL(10,4),
    monthly_projected_cost DECIMAL(10,4)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM users WHERE ai_total_cost_eur > 0),
        COALESCE(SUM(u.ai_total_cost_eur), 0)::DECIMAL(10,4),
        COALESCE(SUM(usage.cost_usd), 0)::DECIMAL(10,4),
        COALESCE(SUM(u.ai_total_tokens_used), 0)::INTEGER,
        (SELECT COUNT(*)::INTEGER FROM ai_usage),
        CASE 
            WHEN COUNT(u.id) > 0 THEN (COALESCE(SUM(u.ai_total_cost_eur), 0) / COUNT(u.id))::DECIMAL(10,4)
            ELSE 0::DECIMAL(10,4)
        END,
        CASE 
            WHEN (SELECT COUNT(*) FROM ai_usage) > 0 THEN 
                (COALESCE(SUM(u.ai_total_cost_eur), 0) / (SELECT COUNT(*) FROM ai_usage))::DECIMAL(10,4)
            ELSE 0::DECIMAL(10,4)
        END,
        (COALESCE(SUM(u.ai_total_cost_eur), 0) * 30)::DECIMAL(10,4) -- Rough monthly projection
    FROM users u
    LEFT JOIN ai_usage usage ON u.id = usage.user_id
    WHERE u.ai_total_cost_eur > 0;
END;
$$ LANGUAGE plpgsql;

-- Insert initial admin user with AI credits if not exists
INSERT INTO users (
    id,
    name,
    email,
    language,
    theme,
    is_premium,
    is_pro,
    premium_expiry,
    onboarding_completed,
    pomodoro_sessions,
    work_duration,
    short_break_duration,
    long_break_duration,
    sessions_until_long_break,
    ai_credits,
    ai_credits_used,
    ai_credits_reset_date,
    ai_monthly_limit,
    ai_plan_type,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Administrator',
    'admin',
    'es',
    'default',
    true,
    true,
    NOW() + INTERVAL '10 years',
    true,
    0,
    25,
    5,
    15,
    4,
    1000, -- Admin gets 1000 credits
    0,
    NOW() + INTERVAL '1 month',
    1000,
    'yearly',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    ai_credits = CASE 
        WHEN users.ai_credits < 1000 THEN 1000 
        ELSE users.ai_credits 
    END,
    ai_monthly_limit = 1000,
    ai_plan_type = 'yearly',
    updated_at = NOW();

-- Insert corresponding admin credentials
INSERT INTO user_credentials (
    id,
    user_id,
    email,
    password_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'admin'),
    'admin',
    encode(digest('535353-Jrlsalt', 'sha256'), 'base64'),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create view for AI usage analytics
CREATE OR REPLACE VIEW ai_usage_summary AS
SELECT 
    u.name,
    u.email,
    u.is_pro,
    u.ai_credits,
    u.ai_credits_used,
    u.ai_total_cost_eur,
    u.ai_total_tokens_used,
    COUNT(ai.id) as total_requests,
    AVG(ai.total_tokens) as avg_tokens_per_request,
    AVG(ai.cost_eur) as avg_cost_per_request,
    MAX(ai.created_at) as last_ai_request
FROM users u
LEFT JOIN ai_usage ai ON u.id = ai.user_id
WHERE u.ai_credits > 0 OR u.ai_credits_used > 0
GROUP BY u.id, u.name, u.email, u.is_pro, u.ai_credits, u.ai_credits_used, u.ai_total_cost_eur, u.ai_total_tokens_used
ORDER BY u.ai_total_cost_eur DESC;

-- Add comment explaining the corrected credit system
COMMENT ON TABLE ai_usage IS 'Tracks all AI requests with detailed cost and token usage';
COMMENT ON COLUMN users.ai_credits IS 'Total AI credits available to user (corrected business model)';
COMMENT ON COLUMN users.ai_credits_used IS 'AI credits consumed in current period';
COMMENT ON COLUMN users.ai_plan_type IS 'monthly or yearly - determines credit allocation';
COMMENT ON COLUMN ai_usage.cost_eur IS 'Actual cost in EUR based on OpenAI pricing';
COMMENT ON COLUMN ai_usage.cost_usd IS 'Actual cost in USD from OpenAI';

-- Business model explanation:
-- Monthly Pro: €4.99 - €1.99 (Premium) = €3.00 difference
-- €2.00 goes to AI credits (100 credits), €1.00 is profit
-- 
-- Yearly Pro: €50 - €20 (Premium) = €30 difference  
-- €24 goes to AI credits (1,200 credits), €6 is profit
--
-- Additional credit purchases maintain 20% profit margin
-- 1 credit = €0.02 (includes OpenAI cost + profit)
