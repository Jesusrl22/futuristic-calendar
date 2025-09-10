-- Insert admin user
INSERT INTO users (
    id,
    name,
    email,
    language,
    theme,
    is_premium,
    is_pro,
    premium_expiry,
    onboarding_completed,
    pomodoro_sessions,
    work_duration,
    short_break_duration,
    long_break_duration,
    sessions_until_long_break,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Administrator',
    'admin',
    'es',
    'default',
    true,
    true,
    NOW() + INTERVAL '10 years',
    true,
    0,
    25,
    5,
    15,
    4,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    is_premium = true,
    is_pro = true,
    premium_expiry = NOW() + INTERVAL '10 years',
    updated_at = NOW();

-- Insert admin credentials (password: 535353-Jrlsalt)
INSERT INTO user_credentials (
    id,
    user_id,
    email,
    password_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'admin'),
    'admin',
    encode(digest('535353-Jrlsalt', 'sha256'), 'base64'),
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    password_hash = encode(digest('535353-Jrlsalt', 'sha256'), 'base64'),
    updated_at = NOW();

-- Add some admin tasks
INSERT INTO tasks (user_id, text, description, completed, time, date, category, priority) VALUES
((SELECT id FROM users WHERE email = 'admin'), 'Revisar métricas del sistema', 'Analizar uso de la aplicación y rendimiento', false, '09:00', CURRENT_DATE, 'work', 'high'),
((SELECT id FROM users WHERE email = 'admin'), 'Actualizar documentación', 'Mantener la documentación técnica actualizada', false, '14:00', CURRENT_DATE, 'work', 'medium'),
((SELECT id FROM users WHERE email = 'admin'), 'Backup de base de datos', 'Verificar que los backups automáticos funcionen', false, '16:00', CURRENT_DATE, 'work', 'high'),
((SELECT id FROM users WHERE email = 'admin'), 'Revisar feedback de usuarios', 'Analizar comentarios y sugerencias de mejora', false, '11:00', CURRENT_DATE + INTERVAL '1 day', 'work', 'medium');

-- Add admin notes
INSERT INTO notes (user_id, title, content) VALUES
((SELECT id FROM users WHERE email = 'admin'), 'Configuración del servidor', 'Configuraciones importantes:\n- Puerto: 3000\n- Base de datos: PostgreSQL\n- Cache: Redis\n- CDN: Cloudflare\n\nCredenciales en variables de entorno.'),
((SELECT id FROM users WHERE email = 'admin'), 'Roadmap de funcionalidades', 'Próximas funcionalidades a implementar:\n\n🔄 En desarrollo:\n- Sistema de notificaciones push\n- Integración con Google Calendar\n- Modo offline\n\n📋 Planificado:\n- App móvil nativa\n- Colaboración en tiempo real\n- Integraciones con Slack/Teams\n\n💡 Ideas futuras:\n- IA para sugerencias de tareas\n- Análisis de productividad\n- Gamificación'),
((SELECT id FROM users WHERE email = 'admin'), 'Métricas importantes', 'KPIs a monitorear:\n\n📊 Usuarios:\n- Usuarios activos diarios (DAU)\n- Usuarios activos mensuales (MAU)\n- Tasa de retención\n- Tiempo promedio de sesión\n\n💰 Negocio:\n- Conversión a Premium\n- Churn rate\n- LTV (Lifetime Value)\n- CAC (Customer Acquisition Cost)\n\n🔧 Técnicas:\n- Tiempo de respuesta API\n- Uptime del servidor\n- Errores por minuto\n- Uso de recursos');
