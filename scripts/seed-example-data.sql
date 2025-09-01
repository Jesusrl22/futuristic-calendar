-- Insertar usuarios de ejemplo (solo para desarrollo)
INSERT INTO users (id, name, email, password, language, theme, is_premium, onboarding_completed, pomodoro_sessions) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Juan Pérez', 'juan@example.com', '123456', 'es', 'default', true, true, 25),
('550e8400-e29b-41d4-a716-446655440002', 'María García', 'maria@example.com', '123456', 'es', 'ocean', false, true, 8),
('550e8400-e29b-41d4-a716-446655440003', 'John Smith', 'john@example.com', '123456', 'en', 'forest', false, false, 3);

-- Insertar tareas de ejemplo
INSERT INTO tasks (user_id, text, description, completed, date, category, priority, time, notification_enabled) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Revisar emails', 'Revisar y responder emails importantes', true, CURRENT_DATE, 'work', 'medium', '09:00', true),
('550e8400-e29b-41d4-a716-446655440001', 'Hacer ejercicio', 'Rutina de ejercicios matutina', false, CURRENT_DATE, 'health', 'high', '07:00', true),
('550e8400-e29b-41d4-a716-446655440001', 'Estudiar React', 'Continuar con el curso de React', false, CURRENT_DATE + INTERVAL '1 day', 'learning', 'medium', '20:00', false),
('550e8400-e29b-41d4-a716-446655440002', 'Comprar groceries', 'Lista de compras para la semana', false, CURRENT_DATE, 'personal', 'low', NULL, false),
('550e8400-e29b-41d4-a716-446655440002', 'Llamar al médico', 'Agendar cita médica', false, CURRENT_DATE, 'health', 'high', '14:00', true);

-- Insertar items de wishlist de ejemplo
INSERT INTO wishlist_items (user_id, text, description, completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Viajar a Japón', 'Visitar Tokio y Kyoto en primavera', false),
('550e8400-e29b-41d4-a716-446655440001', 'Aprender japonés', 'Alcanzar nivel conversacional', false),
('550e8400-e29b-41d4-a716-446655440002', 'Comprar una bicicleta', 'Para hacer ejercicio y movilidad', false);

-- Insertar notas de ejemplo
INSERT INTO notes (user_id, title, content) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ideas para el proyecto', 'Implementar notificaciones push, mejorar UI/UX, agregar modo offline'),
('550e8400-e29b-41d4-a716-446655440001', 'Receta de pasta', 'Pasta con salsa de tomate casera: tomates, ajo, albahaca, aceite de oliva'),
('550e8400-e29b-41d4-a716-446655440002', 'Lista de libros', 'Libros por leer: 1984, El Principito, Cien años de soledad');
