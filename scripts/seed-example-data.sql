-- Insert example user
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
    'Usuario Demo',
    'demo@futuretask.com',
    'es',
    'default',
    true,
    true,
    NOW() + INTERVAL '1 year',
    true,
    15,
    25,
    5,
    15,
    4,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert example credentials for demo user
INSERT INTO user_credentials (
    id,
    user_id,
    email,
    password_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'demo@futuretask.com'),
    'demo@futuretask.com',
    encode(digest('demo123', 'sha256'), 'base64'),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert example tasks
INSERT INTO tasks (user_id, text, description, completed, time, date, category, priority) VALUES
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Revisar emails matutinos', 'Revisar y responder emails importantes', false, '09:00', CURRENT_DATE, 'work', 'high'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Sesión de ejercicio', 'Rutina de cardio de 30 minutos', false, '07:00', CURRENT_DATE, 'health', 'medium'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Planificar la semana', 'Organizar tareas y objetivos semanales', false, '20:00', CURRENT_DATE, 'personal', 'high'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Estudiar inglés', 'Practicar vocabulario y gramática', true, '19:00', CURRENT_DATE - INTERVAL '1 day', 'learning', 'medium'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Llamar al dentista', 'Agendar cita para revisión', false, '11:00', CURRENT_DATE + INTERVAL '1 day', 'personal', 'low');

-- Insert example wishlist items
INSERT INTO wishlist (user_id, text, description, completed) VALUES
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Aprender programación Python', 'Completar curso online de Python para principiantes', false),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Viajar a Japón', 'Planificar y ahorrar para un viaje de 2 semanas a Japón', false),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Leer 12 libros este año', 'Meta de lectura: un libro por mes', false),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Correr una maratón', 'Entrenar y participar en la maratón de la ciudad', false),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Aprender a tocar guitarra', 'Tomar clases y practicar regularmente', true);

-- Insert example notes
INSERT INTO notes (user_id, title, content) VALUES
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Ideas para el proyecto', 'Lista de funcionalidades a implementar:\n- Sistema de notificaciones\n- Integración con calendario\n- Modo oscuro\n- Exportar datos'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Receta de pasta italiana', 'Ingredientes:\n- 400g pasta\n- 200g tomates cherry\n- 100g queso parmesano\n- Albahaca fresca\n- Aceite de oliva\n\nPreparación:\n1. Hervir la pasta\n2. Saltear tomates\n3. Mezclar con queso y albahaca'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Objetivos del mes', 'Objetivos para este mes:\n✓ Completar proyecto de trabajo\n• Hacer ejercicio 3 veces por semana\n• Leer 2 libros\n• Organizar el escritorio\n• Planificar vacaciones'),
((SELECT id FROM users WHERE email = 'demo@futuretask.com'), 'Frases motivacionales', '"El éxito es la suma de pequeños esfuerzos repetidos día tras día." - Robert Collier\n\n"No esperes por el momento perfecto, toma el momento y hazlo perfecto."\n\n"La disciplina es el puente entre metas y logros."');
