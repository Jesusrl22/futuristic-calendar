import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          subscription_plan: string
          subscription_status: string
          ai_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscription_plan?: string
          subscription_status?: string
          ai_credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscription_plan?: string
          subscription_status?: string
          ai_credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: string
          due_date: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: string
          due_date?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Simple validation function
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

let supabaseClient: any = null

if (isSupabaseConfigured) {
  try {
    supabaseClient = createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
    console.log("✅ Supabase client initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error)
    supabaseClient = null
  }
} else {
  console.warn("⚠️ Supabase not configured - using memory storage fallback")
}

// Export the client as 'supabase' - this is what was missing
export const supabase = supabaseClient

// Export createClient function
export function createSupabaseClientFunction() {
  if (!isSupabaseConfigured) {
    console.warn("⚠️ Cannot create Supabase client - missing configuration")
    return null
  }

  try {
    return createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    return null
  }
}

// Export createClient as named export for compatibility
export const createClient = createSupabaseClientFunction

// Default export
export default supabaseClient
