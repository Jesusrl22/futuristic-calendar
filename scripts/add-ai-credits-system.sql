-- Add AI credits system to users table
ALTER TABLE users 
ADD COLUMN ai_credits INTEGER DEFAULT 0,
ADD COLUMN ai_credits_used INTEGER DEFAULT 0,
ADD COLUMN ai_credits_reset_date TIMESTAMP,
ADD COLUMN ai_total_tokens_used INTEGER DEFAULT 0,
ADD COLUMN ai_total_cost_eur DECIMAL(10,4) DEFAULT 0.00;

-- Create AI usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    request_text TEXT NOT NULL,
    response_text TEXT,
    tokens_used INTEGER DEFAULT 0,
    credits_consumed INTEGER DEFAULT 1,
    cost_eur DECIMAL(8,4) DEFAULT 0.0000,
    model_used VARCHAR(50) DEFAULT 'gpt-4o-mini',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);

-- Update existing Pro users to have initial credits
UPDATE users 
SET 
    ai_credits = 100,
    ai_credits_used = 0,
    ai_credits_reset_date = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
WHERE is_pro = true AND (ai_credits IS NULL OR ai_credits = 0);
