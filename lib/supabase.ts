import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️  Supabase environment variables not found. Using localStorage fallback.")
}

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseUrl.includes(".supabase.co") &&
    supabaseKey.length > 20,
)

// Create Supabase client
let supabaseClient: any = null

if (hasValidSupabaseConfig) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // We handle our own auth
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
    })
    console.log("✅ Supabase client created successfully")
    console.log("🔗 Connected to:", supabaseUrl)
  } catch (error) {
    console.error("❌ Error creating Supabase client:", error)
    supabaseClient = null
  }
} else {
  console.log("📦 Using localStorage fallback - Supabase not configured")
}

// Export the client and availability flag
export const supabase = supabaseClient
export const isSupabaseAvailable = hasValidSupabaseConfig && supabaseClient !== null

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

// Test connection function
export const testSupabaseConnection = async () => {
  if (!supabaseClient) {
    console.log("❌ Supabase client not available")
    return false
  }

  try {
    const { data, error } = await supabaseClient.from("users").select("count(*)").limit(1)

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
