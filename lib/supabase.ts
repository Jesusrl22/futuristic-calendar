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

// Create Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side client with service role key
export const createServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

// Client-side singleton
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createClient()
  }
  return clientInstance
}

export default createClient
