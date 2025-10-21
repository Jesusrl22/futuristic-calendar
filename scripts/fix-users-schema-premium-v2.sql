-- Script para agregar la columna is_premium a la tabla users
-- Ejecutar en Supabase SQL Editor

-- Verificar si la columna existe
DO $$ 
BEGIN
    -- Intentar agregar la columna is_premium
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'is_premium'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_premium BOOLEAN DEFAULT false;
        RAISE NOTICE 'Columna is_premium agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna is_premium ya existe';
    END IF;
    
    -- Intentar agregar la columna billing_cycle
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'billing_cycle'
    ) THEN
        ALTER TABLE public.users ADD COLUMN billing_cycle TEXT;
        RAISE NOTICE 'Columna billing_cycle agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna billing_cycle ya existe';
    END IF;

    -- Intentar agregar la columna subscription_expires_at
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'subscription_expires_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Columna subscription_expires_at agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna subscription_expires_at ya existe';
    END IF;
END $$;

-- Actualizar usuarios existentes
UPDATE public.users 
SET is_premium = CASE 
    WHEN subscription_tier = 'premium' THEN true
    WHEN subscription_tier = 'pro' THEN false
    ELSE false
END
WHERE subscription_tier IN ('premium', 'pro');

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_is_premium ON public.users(is_premium);
CREATE INDEX IF NOT EXISTS idx_users_subscription_expires_at ON public.users(subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_billing_cycle ON public.users(billing_cycle);

-- Mostrar el esquema actual de la tabla users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name IN (
    'id', 
    'email', 
    'subscription_tier', 
    'is_premium', 
    'is_pro', 
    'ai_credits',
    'subscription_status',
    'subscription_expires_at',
    'billing_cycle'
)
ORDER BY ordinal_position;

-- Mostrar el usuario específico
SELECT 
    id,
    email,
    subscription_tier,
    is_premium,
    is_pro,
    ai_credits,
    subscription_status,
    subscription_expires_at,
    billing_cycle
FROM public.users
WHERE email = 'jesusrayaleon1@gmail.com';
