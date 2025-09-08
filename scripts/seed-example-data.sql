-- Insert example data (optional)
-- This script can be run to add some sample data for testing

-- Example user (password: demo123)
INSERT INTO users (id, name, email, password, language, theme, is_premium, onboarding_completed)
VALUES (
    'demo-user-123',
    'Usuario Demo',
    'demo@example.com',
    'demo123',
    'es',
    'default',
    false,
    true
) ON CONFLICT (email) DO NOTHING;

-- Example tasks
INSERT INTO tasks (id, user_id, text, description, completed, date, category, priority)
VALUES 
    ('task-1', 'demo-user-123', 'Revisar emails', 'Revisar y responder emails importantes', false, '2024-01-15', 'work', 'medium'),
    ('task-2', 'demo-user-123', 'Hacer ejercicio', 'Rutina de ejercicios de 30 minutos', true, '2024-01-15', 'health', 'high'),
    ('task-3', 'demo-user-123', 'Estudiar JavaScript', 'Completar curso de JavaScript avanzado', false, '2024-01-16', 'learning', 'high')
ON CONFLICT (id) DO NOTHING;

-- Example wishlist items
INSERT INTO wishlist_items (id, user_id, text, description, completed)
VALUES 
    ('wish-1', 'demo-user-123', 'Aprender React Native', 'Crear una app móvil', false),
    ('wish-2', 'demo-user-123', 'Viajar a Japón', 'Visitar Tokio y Kioto', false)
ON CONFLICT (id) DO NOTHING;

-- Example notes
INSERT INTO notes (id, user_id, title, content)
VALUES 
    ('note-1', 'demo-user-123', 'Ideas para el proyecto', 'Lista de funcionalidades:\n- Autenticación\n- Dashboard\n- Notificaciones'),
    ('note-2', 'demo-user-123', 'Receta favorita', 'Ingredientes:\n- 2 huevos\n- 1 taza de harina\n- Leche')
ON CONFLICT (id) DO NOTHING;
