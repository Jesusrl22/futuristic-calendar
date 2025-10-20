-- Script para actualizar la cuenta jesusrayaleon1@gmail.com a Pro
-- Mantiene la misma contraseña y actualiza el plan

-- Primero verificamos que el usuario existe
DO $$
DECLARE
  user_exists BOOLEAN;
  user_id_var UUID;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM users WHERE email = 'jesusrayaleon1@gmail.com'
  ) INTO user_exists;

  IF user_exists THEN
    -- Obtener el ID del usuario
    SELECT id INTO user_id_var FROM users WHERE email = 'jesusrayaleon1@gmail.com';
    
    -- Actualizar a plan Pro
    UPDATE users 
    SET 
      is_premium = FALSE,
      is_pro = TRUE,
      ai_credits = 1000,
      subscription_tier = 'pro',
      subscription_status = 'active',
      subscription_start_date = NOW(),
      subscription_end_date = NOW() + INTERVAL '1 year',
      updated_at = NOW()
    WHERE email = 'jesusrayaleon1@gmail.com';

    RAISE NOTICE 'Usuario actualizado exitosamente a Plan Pro';
    RAISE NOTICE 'Email: jesusrayaleon1@gmail.com';
    RAISE NOTICE 'Plan: Pro';
    RAISE NOTICE 'Créditos IA: 1000';
    RAISE NOTICE 'Válido hasta: %', (NOW() + INTERVAL '1 year')::DATE;
  ELSE
    RAISE EXCEPTION 'Usuario con email jesusrayaleon1@gmail.com no existe';
  END IF;
END $$;

-- Verificar la actualización
SELECT 
  email,
  is_pro,
  is_premium,
  ai_credits,
  subscription_tier,
  subscription_status,
  subscription_end_date
FROM users 
WHERE email = 'jesusrayaleon1@gmail.com';
