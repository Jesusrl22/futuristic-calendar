import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseAvailable = !!(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseAvailable ? createClient(supabaseUrl!, supabaseAnonKey!) : null

console.log("🔗 Supabase status:", isSupabaseAvailable ? "Connected" : "Using mock data")

// Admin client for server-side operations
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

// Type definitions
export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string
  is_admin: boolean
  is_pro: boolean
  premium_expiry: string | null
  ai_credits: number
  ai_credits_used: number
  ai_total_cost_eur: number
  created_at: string
  updated_at: string
  last_login: string | null
  pomodoro_work_duration: number
  pomodoro_break_duration: number
  pomodoro_long_break_duration: number
  pomodoro_sessions_until_long_break: number
  theme_preference: string
  notification_preferences: Record<string, any>
  subscription_status?: "active" | "cancelled" | "inactive"
  subscription_cancelled_at?: string | null
  subscription_ends_at?: string | null
  email_verified?: boolean
  email_verification_token?: string | null
  email_verification_expires?: string | null
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  category: string | null
  tags: string[]
  created_at: string
  updated_at: string
  completed_at: string | null
  estimated_duration: number | null
  actual_duration: number | null
}

export interface WishlistItem {
  id: string
  user_id: string
  title: string
  description: string | null
  priority: "low" | "medium" | "high"
  category: string | null
  target_date: string | null
  estimated_cost: number | null
  status: "active" | "achieved" | "cancelled"
  created_at: string
  updated_at: string
  achieved_at: string | null
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  category: string | null
  tags: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  type: string
  title: string
  description: string
  icon: string
  earned_at: string
  metadata: Record<string, any>
}

// Database status functions
export async function getDatabaseStatus() {
  if (!isSupabaseAvailable) {
    return { connected: false, message: "Supabase not configured" }
  }

  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    if (error) throw error
    return { connected: true, message: "Connected to Supabase" }
  } catch (error) {
    return { connected: false, message: "Connection failed" }
  }
}

export async function testSupabaseConnection() {
  return getDatabaseStatus()
}
