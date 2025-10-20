-- Verificar el estado de la cuenta Pro
SELECT 
  id,
  email,
  full_name,
  is_premium,
  is_pro,
  ai_credits,
  subscription_tier,
  billing_cycle,
  subscription_status,
  subscription_start_date,
  subscription_end_date,
  created_at
FROM users
WHERE email = 'jesusrayaleon1@gmail.com';

-- Actualizar la cuenta a Pro si es necesario
UPDATE users 
SET 
  is_pro = true,
  is_premium = false,
  subscription_tier = 'pro',
  billing_cycle = 'monthly',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '1 year',
  ai_credits = GREATEST(COALESCE(ai_credits, 0), 1000),
  updated_at = NOW()
WHERE email = 'jesusrayaleon1@gmail.com';

-- Verificar el resultado
SELECT 
  email,
  subscription_tier,
  is_pro,
  ai_credits,
  subscription_status,
  subscription_end_date
FROM users
WHERE email = 'jesusrayaleon1@gmail.com';
