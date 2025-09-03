import { createClient } from "@supabase/supabase-js"

// Tipos de datos
export interface User {
  id: string
  name: string
  email: string
  password: string
  created_at: string
  updated_at: string
  theme: string
  language: "es" | "en" | "de" | "fr" | "it"
  is_premium: boolean
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
}

export interface Task {
  id: string
  user_id: string
  text: string
  description?: string
  completed: boolean
  date: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completed_at?: string
  time?: string
  notification_enabled?: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  title: string
  description?: string
  price?: number
  url?: string
  priority: "low" | "medium" | "high"
  category: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_key: string
  unlocked_at: string
}

// Configuración de Supabase - obtener variables de entorno de forma segura
const getSupabaseConfig = () => {
  // Solo en el cliente (browser)
  if (typeof window === "undefined") {
    return { url: null, key: null }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return { url, key }
}

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseConfig()

// Función para validar la configuración de Supabase
const isValidSupabaseConfig = (url: string | null | undefined, key: string | null | undefined): boolean => {
  if (!url || !key) {
    return false
  }

  // Verificar que la URL tenga el formato correcto de Supabase
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "https:" && urlObj.hostname.includes("supabase.co") && key.length > 20
  } catch {
    return false
  }
}

// Verificar si Supabase está configurado correctamente
export const isSupabaseAvailable = isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)

// Crear cliente de Supabase solo si está configurado correctamente
export const supabase = (() => {
  if (!isSupabaseAvailable || !supabaseUrl || !supabaseAnonKey) {
    console.log("📦 Supabase not configured - using localStorage fallback")
    return null
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
    })

    console.log("✅ Supabase client created successfully")
    console.log("🔗 Connected to:", supabaseUrl)
    return client
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error)
    return null
  }
})()

// Función para probar la conexión
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.log("📦 Supabase client not available - using localStorage fallback")
    return false
  }

  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("❌ Supabase connection test failed:", error.message)
      return false
    }

    console.log("✅ Supabase connection test successful")
    return true
  } catch (error) {
    console.error("❌ Supabase connection test error:", error)
    return false
  }
}

// Función para obtener información de configuración
export const getSupabaseInfo = () => {
  return {
    isAvailable: isSupabaseAvailable,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? supabaseUrl.replace(/\/+$/, "") : null, // Remove trailing slashes
  }
}

// Log de estado al cargar (solo en el cliente)
if (typeof window !== "undefined") {
  if (isSupabaseAvailable) {
    console.log("🟢 Supabase configured and ready")
    // Test connection after a short delay to avoid blocking
    setTimeout(() => {
      testSupabaseConnection()
    }, 1000)
  } else {
    console.log("📦 Using localStorage fallback - Supabase not configured")
    if (supabaseUrl && !supabaseAnonKey) {
      console.log("⚠️  Supabase URL found but missing ANON_KEY")
    } else if (!supabaseUrl && supabaseAnonKey) {
      console.log("⚠️  Supabase ANON_KEY found but missing URL")
    } else if (!supabaseUrl && !supabaseAnonKey) {
      console.log("ℹ️  No Supabase configuration found")
    } else {
      console.log("⚠️  Invalid Supabase configuration")
    }
  }
}

// Tipos para la base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Task, "id" | "created_at" | "updated_at">>
      }
      wishlist_items: {
        Row: WishlistItem
        Insert: Omit<WishlistItem, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<WishlistItem, "id" | "created_at" | "updated_at">>
      }
      notes: {
        Row: Note
        Insert: Omit<Note, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Note, "id" | "created_at" | "updated_at">>
      }
      achievements: {
        Row: Achievement
        Insert: Omit<Achievement, "id" | "unlocked_at">
        Update: Partial<Omit<Achievement, "id" | "unlocked_at">>
      }
    }
  }
}
