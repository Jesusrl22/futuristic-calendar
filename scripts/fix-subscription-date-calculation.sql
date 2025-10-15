-- Fix the subscription status function to properly handle date calculations
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
$$ language 'plpgsql';

-- Recreate trigger
DROP TRIGGER IF EXISTS update_subscription_status_trigger ON users;
CREATE TRIGGER update_subscription_status_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_status();
