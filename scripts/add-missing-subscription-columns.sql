-- Verificar y agregar columnas faltantes a la tabla users
DO $$ 
BEGIN
    -- Agregar subscription_tier si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'subscription_tier'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;

    -- Agregar subscription_status si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'active';
    END IF;

    -- Agregar billing_cycle si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'billing_cycle'
    ) THEN
        ALTER TABLE users ADD COLUMN billing_cycle TEXT DEFAULT 'monthly';
    END IF;

    -- Agregar ai_credits si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'ai_credits'
    ) THEN
        ALTER TABLE users ADD COLUMN ai_credits INTEGER DEFAULT 0;
    END IF;

    -- Agregar ai_credits_used si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'ai_credits_used'
    ) THEN
        ALTER TABLE users ADD COLUMN ai_credits_used INTEGER DEFAULT 0;
    END IF;
END $$;

-- Actualizar tu usuario a Pro con créditos
UPDATE users 
SET 
    subscription_tier = 'pro',
    subscription_status = 'active',
    billing_cycle = 'monthly',
    ai_credits = 500,
    ai_credits_used = 0,
    updated_at = NOW()
WHERE email = 'jesusrayaleon1@gmail.com';

-- Verificar la actualización
SELECT 
    id,
    email,
    subscription_tier,
    subscription_status,
    billing_cycle,
    ai_credits,
    ai_credits_used,
    created_at,
    updated_at
FROM users 
WHERE email = 'jesusrayaleon1@gmail.com';
