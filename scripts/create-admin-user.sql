-- Create admin user
INSERT INTO users (
    id, 
    name, 
    email, 
    password, 
    language, 
    theme, 
    is_premium, 
    premium_expiry,
    onboarding_completed, 
    pomodoro_sessions, 
    work_duration, 
    short_break_duration, 
    long_break_duration, 
    sessions_until_long_break
) VALUES (
    'admin-user-535353',
    'Administrator',
    'admin',
    '535353-Jrl',
    'es',
    'default',
    true,
    '2025-12-31 23:59:59',
    true,
    0,
    25,
    5,
    15,
    4
) ON CONFLICT (email) DO UPDATE SET
    is_premium = EXCLUDED.is_premium,
    premium_expiry = EXCLUDED.premium_expiry,
    updated_at = CURRENT_TIMESTAMP;
