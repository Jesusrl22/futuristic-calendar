// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseUrl.includes(".supabase.co") &&
    supabaseAnonKey.length > 20,
)

// Export a flag to check if Supabase is available
export const isSupabaseAvailable = hasValidSupabaseConfig

// Create Supabase client only if we have valid configuration
let supabaseClient: any = null

// Only create client in browser environment
if (typeof window !== "undefined" && hasValidSupabaseConfig) {
  try {
    const { createClient } = require("@supabase/supabase-js")
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    supabaseClient = null
  }
}

export const supabase = supabaseClient

// Log configuration status (only in development and client-side)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔧 Supabase Configuration Status:")
  console.log("  URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
  console.log("  Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing")
  console.log("  Valid Config:", hasValidSupabaseConfig ? "✅ Yes" : "❌ No")
  console.log("  Client Created:", supabaseClient ? "✅ Yes" : "❌ No (using localStorage fallback)")
}

// Types for TypeScript
export interface User {
  id: string
  name: string
  email: string
  password: string
  language: "es" | "en" | "fr" | "de" | "it"
  theme: string
  is_premium: boolean
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  text: string
  description?: string
  completed: boolean
  date: string
  time?: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completed_at?: string
  notification_enabled?: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  text: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_key: string
  unlocked_at: string
}

// Types for the database
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
