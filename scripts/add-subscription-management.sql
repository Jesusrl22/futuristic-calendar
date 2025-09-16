-- Add subscription management columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to have proper subscription status
UPDATE users 
SET subscription_status = CASE 
  WHEN is_pro = true OR is_premium = true THEN 'active'
  ELSE 'inactive'
END
WHERE subscription_status IS NULL OR subscription_status = 'inactive';

-- Create index for better performance on subscription queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_subscription_ends_at ON users(subscription_ends_at);

-- Add constraint to ensure valid subscription statuses
ALTER TABLE users 
ADD CONSTRAINT check_subscription_status 
CHECK (subscription_status IN ('active', 'cancelled', 'inactive'));

-- Create a function to automatically update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If user becomes premium/pro and status is inactive, make it active
  IF (NEW.is_pro = true OR NEW.is_premium = true) AND OLD.subscription_status = 'inactive' THEN
    NEW.subscription_status = 'active';
    NEW.subscription_cancelled_at = NULL;
    NEW.subscription_ends_at = NULL;
  END IF;
  
  -- If user loses premium/pro status, make it inactive
  IF NEW.is_pro = false AND NEW.is_premium = false AND OLD.subscription_status != 'cancelled' THEN
    NEW.subscription_status = 'inactive';
    NEW.subscription_cancelled_at = NULL;
    NEW.subscription_ends_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update subscription status
DROP TRIGGER IF EXISTS trigger_update_subscription_status ON users;
CREATE TRIGGER trigger_update_subscription_status
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_status();

-- Create a view for subscription analytics
CREATE OR REPLACE VIEW subscription_analytics AS
SELECT 
  subscription_status,
  COUNT(*) as user_count,
  COUNT(CASE WHEN is_pro THEN 1 END) as pro_users,
  COUNT(CASE WHEN is_premium THEN 1 END) as premium_users,
  AVG(CASE WHEN subscription_cancelled_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (subscription_cancelled_at - created_at))/86400 
    END) as avg_days_before_cancellation
FROM users 
GROUP BY subscription_status;

COMMENT ON TABLE users IS 'Users table with subscription management';
COMMENT ON COLUMN users.subscription_status IS 'Current subscription status: active, cancelled, or inactive';
COMMENT ON COLUMN users.subscription_cancelled_at IS 'When the subscription was cancelled';
COMMENT ON COLUMN users.subscription_ends_at IS 'When the subscription benefits will end';
