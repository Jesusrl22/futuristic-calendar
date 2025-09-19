import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          subscription_plan: string
          ai_credits: number
          created_at: string
          updated_at: string
          tasks_completed: number
          notes_created: number
          wishlist_items: number
          ai_queries_used: number
          streak_days: number
          early_tasks_completed: number
          late_tasks_completed: number
          categories_created: number
          events_created: number
          credits_purchased: number
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscription_plan?: string
          ai_credits?: number
          created_at?: string
          updated_at?: string
          tasks_completed?: number
          notes_created?: number
          wishlist_items?: number
          ai_queries_used?: number
          streak_days?: number
          early_tasks_completed?: number
          late_tasks_completed?: number
          categories_created?: number
          events_created?: number
          credits_purchased?: number
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscription_plan?: string
          ai_credits?: number
          created_at?: string
          updated_at?: string
          tasks_completed?: number
          notes_created?: number
          wishlist_items?: number
          ai_queries_used?: number
          streak_days?: number
          early_tasks_completed?: number
          late_tasks_completed?: number
          categories_created?: number
          events_created?: number
          credits_purchased?: number
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
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: string
          estimated_cost: number | null
          target_date: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: string
          estimated_cost?: number | null
          target_date?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: string
          estimated_cost?: number | null
          target_date?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
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

// Check if Supabase environment variables are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate Supabase configuration
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http") && supabaseUrl.includes("supabase"),
)

// Create Supabase client or mock client
export const supabase = isSupabaseConfigured
  ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
  : {
      // Mock client for demo mode
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ error: null }),
        eq: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Demo mode" } }),
        signUp: () => Promise.resolve({ data: null, error: { message: "Demo mode" } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      rpc: () => Promise.resolve({ data: null, error: null }),
    }

// Helper function to check connection status
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured) return false

  try {
    const { error } = await supabase.from("users").select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

// Server-side client with service role key
export const createServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!isSupabaseConfigured || !supabaseServiceKey) {
    return supabase // Return mock client
  }

  return createSupabaseClient(supabaseUrl!, supabaseServiceKey!)
}

// Client-side singleton
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = supabase
  }
  return clientInstance
}

export default supabase

// Export createClient for compatibility
export { createClient }
