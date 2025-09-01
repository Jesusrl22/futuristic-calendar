-- Crear tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  language TEXT DEFAULT 'es',
  theme TEXT DEFAULT 'default',
  is_premium BOOLEAN DEFAULT false,
  premium_expiry TIMESTAMP,
  onboarding_completed BOOLEAN DEFAULT false,
  pomodoro_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de tareas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  date DATE NOT NULL,
  time TIME,
  category TEXT DEFAULT 'personal',
  priority TEXT DEFAULT 'medium',
  completed_at TIMESTAMP,
  notification_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de wishlist
CREATE TABLE wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de notas
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_notes_user ON notes(user_id);
