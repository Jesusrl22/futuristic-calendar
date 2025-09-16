-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('basic', 'premium', 'pro')),
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INTEGER NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    achievement_key VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    FOREIGN KEY (achievement_key) REFERENCES achievements(key),
    UNIQUE(user_id, achievement_key)
);

-- Insert basic achievements
INSERT INTO achievements (key, name, description, icon, category, requirement_type, requirement_value, points) VALUES
('first_goal', 'Primera Meta', 'Completa tu primera meta en la lista de deseos', '🎯', 'basic', 'wishlist_completed', 1, 10),
('goal_master', 'Maestro de Metas', 'Completa 5 metas en la lista de deseos', '🏆', 'basic', 'wishlist_completed', 5, 25),
('dream_achiever', 'Realizador de Sueños', 'Completa 10 metas en la lista de deseos', '⭐', 'basic', 'wishlist_completed', 10, 50),
('first_task', 'Primer Paso', 'Completa tu primera tarea', '✅', 'basic', 'tasks_completed', 1, 5),
('productive_day', 'Día Productivo', 'Completa 5 tareas en un día', '🚀', 'basic', 'daily_tasks', 5, 15),
('task_master', 'Maestro de Tareas', 'Completa 50 tareas en total', '🎖️', 'basic', 'tasks_completed', 50, 40),
('early_bird', 'Madrugador', 'Inicia sesión antes de las 7:00 AM', '🌅', 'basic', 'early_login', 1, 10),
('night_owl', 'Búho Nocturno', 'Usa la app después de las 11:00 PM', '🦉', 'basic', 'late_usage', 1, 10);

-- Insert premium achievements
INSERT INTO achievements (key, name, description, icon, category, requirement_type, requirement_value, points) VALUES
('welcome_premium', 'Bienvenido Premium', 'Actualiza a Premium por primera vez', '👑', 'premium', 'upgrade_premium', 1, 20),
('note_taker', 'Tomador de Notas', 'Crea tu primera nota', '📝', 'premium', 'notes_created', 1, 15),
('organized_mind', 'Mente Organizada', 'Crea 20 notas', '🧠', 'premium', 'notes_created', 20, 35),
('goal_setter', 'Establecedor de Metas', 'Crea 3 metas en la lista de deseos', '🎯', 'premium', 'wishlist_created', 3, 20),
('persistent', 'Persistente', 'Usa Premium durante 30 días', '💪', 'premium', 'premium_days', 30, 50),
('dedicated', 'Dedicado', 'Usa Premium durante 90 días', '🔥', 'premium', 'premium_days', 90, 100);

-- Insert pro achievements
INSERT INTO achievements (key, name, description, icon, category, requirement_type, requirement_value, points) VALUES
('welcome_pro', 'Bienvenido Pro', 'Actualiza a Pro por primera vez', '✨', 'pro', 'upgrade_pro', 1, 30),
('ai_explorer', 'Explorador IA', 'Usa el asistente IA por primera vez', '🤖', 'pro', 'ai_requests', 1, 20),
('ai_enthusiast', 'Entusiasta IA', 'Realiza 10 consultas al asistente IA', '🧠', 'pro', 'ai_requests', 10, 40),
('ai_master', 'Maestro IA', 'Realiza 100 consultas al asistente IA', '🎓', 'pro', 'ai_requests', 100, 80),
('efficiency_expert', 'Experto en Eficiencia', 'Usa todas las funciones Pro en un día', '⚡', 'pro', 'pro_features_used', 1, 60),
('future_visionary', 'Visionario del Futuro', 'Usa Pro durante 365 días', '🔮', 'pro', 'pro_days', 365, 200);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_key ON user_achievements(achievement_key);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
