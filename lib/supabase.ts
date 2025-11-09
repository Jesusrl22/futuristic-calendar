import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          theme: string | null
          language: string | null
          ai_credits: number | null
          subscription_plan: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          priority: string | null
          category: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          created_at: string
          updated_at: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          price: number | null
          priority: string | null
          url: string | null
          created_at: string
          updated_at: string
        }
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string
          duration: number
          completed: boolean
          created_at: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          icon: string | null
          achievement_type: string | null
          unlocked_at: string | null
          created_at: string
        }
      }
    }
  }
}
