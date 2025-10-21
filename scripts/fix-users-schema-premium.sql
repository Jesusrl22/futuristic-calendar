-- Script para agregar las columnas faltantes en la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna is_premium si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT false;
    RAISE NOTICE 'Columna is_premium agregada';
  ELSE
    RAISE NOTICE 'Columna is_premium ya existe';
  END IF;
END $$;

-- 2. Agregar columna subscription_expires_at si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Columna subscription_expires_at agregada';
  ELSE
    RAISE NOTICE 'Columna subscription_expires_at ya existe';
  END IF;
END $$;

-- 3. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_is_premium ON users(is_premium);
CREATE INDEX IF NOT EXISTS idx_users_is_pro ON users(is_pro);
CREATE INDEX IF NOT EXISTS idx_users_subscription_expires_at ON users(subscription_expires_at);

-- 4. Actualizar usuarios existentes con is_pro a tener subscription_tier correcto
UPDATE users 
SET subscription_tier = 'pro',
    is_premium = false
WHERE is_pro = true AND subscription_tier != 'pro';

-- 5. Actualizar usuarios premium
UPDATE users 
SET subscription_tier = 'premium',
    is_pro = false  
WHERE is_premium = true AND subscription_tier != 'premium';

-- 6. Verificar el resultado
SELECT 
  id,
  email,
  subscription_tier,
  is_premium,
  is_pro,
  ai_credits,
  subscription_expires_at
FROM users
WHERE email = 'jesusrayaleon1@gmail.com';

RAISE NOTICE 'Script de actualización completado exitosamente';
