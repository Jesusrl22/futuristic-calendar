-- Script para crear usuario Pro con el email jesusrayaleon1@gmail.com
-- Este script debe ejecutarse en Supabase SQL Editor

-- Contraseña temporal: Admin123!
-- IMPORTANTE: Cambiar contraseña después del primer login

-- Crear el usuario (si no existe)
INSERT INTO public.users (
  id,
  email,
  password_hash,
  name,
  is_premium,
  is_pro,
  ai_credits,
  subscription_status,
  subscription_start_date,
  subscription_end_date,
  preferred_language,
  theme_color,
  dark_mode,
  email_verified,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'jesusrayaleon1@gmail.com',
  '$2a$10$YourHashedPasswordHere', -- Hash de "Admin123!" - cambiar por el hash real
  'Jesus Raya León',
  false, -- no premium
  true,  -- sí pro
  1000,  -- 1000 créditos IA iniciales
  'active',
  NOW(),
  NOW() + INTERVAL '1 year', -- 1 año de suscripción
  'es',
  'purple',
  true,
  true, -- email verificado
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET
  is_premium = false,
  is_pro = true,
  ai_credits = 1000,
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '1 year',
  updated_at = NOW();

-- Verificar que el usuario fue creado/actualizado correctamente
SELECT 
  email,
  name,
  is_pro,
  ai_credits,
  subscription_status,
  subscription_end_date,
  email_verified
FROM public.users
WHERE email = 'jesusrayaleon1@gmail.com';
