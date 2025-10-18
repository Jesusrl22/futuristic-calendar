import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are not configured")
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export function createClient() {
  return supabase
}

export default supabase

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          language: string
          theme: string
          is_premium: boolean
          is_pro: boolean
          plan: string | null
          premium_expiry: string | null
          onboarding_completed: boolean
          pomodoro_sessions: number
          work_duration: number
          short_break_duration: number
          long_break_duration: number
          sessions_until_long_break: number
          ai_credits: number
          ai_credits_used: number
          ai_credits_reset_date: string | null
          ai_total_tokens_used: number
          ai_total_cost_eur: number
          ai_monthly_limit: number
          ai_plan_type: string
          subscription_status: string | null
          subscription_end_date: string | null
          subscription_tier: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          language?: string
          theme?: string
          is_premium?: boolean
          is_pro?: boolean
          plan?: string | null
          premium_expiry?: string | null
          onboarding_completed?: boolean
          pomodoro_sessions?: number
          work_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          sessions_until_long_break?: number
          ai_credits?: number
          ai_credits_used?: number
          ai_credits_reset_date?: string | null
          ai_total_tokens_used?: number
          ai_total_cost_eur?: number
          ai_monthly_limit?: number
          ai_plan_type?: string
          subscription_status?: string | null
          subscription_end_date?: string | null
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          language?: string
          theme?: string
          is_premium?: boolean
          is_pro?: boolean
          plan?: string | null
          premium_expiry?: string | null
          onboarding_completed?: boolean
          pomodoro_sessions?: number
          work_duration?: number
          short_break_duration?: number
          long_break_duration?: number
          sessions_until_long_break?: number
          ai_credits?: number
          ai_credits_used?: number
          ai_credits_reset_date?: string | null
          ai_total_tokens_used?: number
          ai_total_cost_eur?: number
          ai_monthly_limit?: number
          ai_plan_type?: string
          subscription_status?: string | null
          subscription_end_date?: string | null
          subscription_tier?: string | null
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
          priority: "low" | "medium" | "high"
          category: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: "low" | "medium" | "high"
          category?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: "low" | "medium" | "high"
          category?: string | null
          due_date?: string | null
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
          priority: "low" | "medium" | "high"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

export async function updateUserProfile(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()
  return { data, error }
}

export async function getUserTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  return { data, error }
}

export async function createTask(userId: string, task: any) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id: userId, ...task }])
    .select()
    .single()
  return { data, error }
}

export async function updateTask(taskId: string, updates: any) {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()
  return { data, error }
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId)
  return { error }
}

export async function getUserEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: true })
  return { data, error }
}

export async function createEvent(userId: string, event: any) {
  const { data, error } = await supabase
    .from("events")
    .insert([{ user_id: userId, ...event }])
    .select()
    .single()
  return { data, error }
}

export async function updateEvent(eventId: string, updates: any) {
  const { data, error } = await supabase.from("events").update(updates).eq("id", eventId).select().single()
  return { data, error }
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase.from("events").delete().eq("id", eventId)
  return { error }
}
