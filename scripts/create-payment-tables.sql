-- Crear tablas para el sistema de pagos
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'credit_purchase', 'subscription', 'subscription_renewal'
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    
    -- PayPal específico
    paypal_order_id VARCHAR(100),
    paypal_capture_id VARCHAR(100),
    paypal_subscription_id VARCHAR(100),
    
    -- Detalles del producto
    package_id VARCHAR(50), -- Para packs de créditos
    plan_id VARCHAR(50), -- Para suscripciones
    credits_added INTEGER DEFAULT 0,
    ai_credits_added INTEGER DEFAULT 0,
    
    -- Metadatos
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    INDEX idx_payment_user_id (user_id),
    INDEX idx_payment_paypal_order (paypal_order_id),
    INDEX idx_payment_paypal_subscription (paypal_subscription_id),
    INDEX idx_payment_status (status),
    INDEX idx_payment_type (type)
);

-- Tabla para eventos de webhook
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    resource_id VARCHAR(100),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB,
    
    INDEX idx_webhook_event_type (event_type),
    INDEX idx_webhook_event_id (event_id),
    INDEX idx_webhook_resource_id (resource_id)
);

-- Tabla para eventos de suscripción
CREATE TABLE IF NOT EXISTS subscription_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'created', 'activated', 'cancelled', 'suspended', 'payment_failed'
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_subscription_events_user (user_id),
    INDEX idx_subscription_events_subscription (subscription_id),
    INDEX idx_subscription_events_type (event_type)
);

-- Actualizar tabla de usuarios para suscripciones
ALTER TABLE users ADD COLUMN IF NOT EXISTS paypal_subscription_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_activated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_suspended_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_cancel_reason TEXT;

-- Índices adicionales para usuarios
CREATE INDEX IF NOT EXISTS idx_users_paypal_subscription ON users(paypal_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
