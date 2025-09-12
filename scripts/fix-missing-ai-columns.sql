-- Script para agregar las columnas faltantes de AI credits
-- Ejecuta esto en tu base de datos (Supabase SQL Editor o tu cliente SQL)

-- Agregar columnas de AI credits a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_credits_reset_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS ai_total_tokens_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_total_cost_eur DECIMAL(10,4) DEFAULT 0.0000,
ADD COLUMN IF NOT EXISTS ai_monthly_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_plan_type VARCHAR(10) DEFAULT 'monthly';

-- Crear tabla de uso de AI si no existe
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

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);

-- Actualizar usuarios existentes con créditos iniciales
UPDATE users 
SET 
    ai_credits = CASE 
        WHEN is_pro = true THEN 1000
        ELSE 0
    END,
    ai_credits_used = 0,
    ai_monthly_limit = CASE 
        WHEN is_pro = true THEN 1000
        ELSE 0
    END,
    ai_plan_type = 'monthly'
WHERE ai_credits IS NULL;

-- Verificar que las columnas se crearon correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name LIKE 'ai_%'
ORDER BY column_name;
