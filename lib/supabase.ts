import { createClient } from "@supabase/supabase-js"

// Types
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
  notification_preferences: any
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
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
  metadata: any
}

export interface DatabaseStatus {
  connected: boolean
  message: string
  lastChecked: string
  tablesExist: boolean
  userCount: number
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseAvailable = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey.length > 20
)

// Create Supabase client only if properly configured
export const supabase = isSupabaseAvailable ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// Database status functions
export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  console.log("🔍 Checking database status...")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Supabase not configured - using mock data")
    return {
      connected: false,
      message: "Supabase not configured - using mock data",
      lastChecked: new Date().toISOString(),
      tablesExist: false,
      userCount: 3, // Mock users
    }
  }

  try {
    const { data, error } = await supabase.from("users").select("id", { count: "exact", head: true })

    if (error) {
      console.error("❌ Database connection error:", error)
      return {
        connected: false,
        message: `Database error: ${error.message}`,
        lastChecked: new Date().toISOString(),
        tablesExist: false,
        userCount: 0,
      }
    }

    console.log("✅ Database connected successfully")
    return {
      connected: true,
      message: "Connected to Supabase",
      lastChecked: new Date().toISOString(),
      tablesExist: true,
      userCount: data?.length || 0,
    }
  } catch (error) {
    console.error("❌ Database status check failed:", error)
    return {
      connected: false,
      message: `Connection failed: ${error}`,
      lastChecked: new Date().toISOString(),
      tablesExist: false,
      userCount: 0,
    }
  }
}

export async function testSupabaseConnection(): Promise<boolean> {
  console.log("🧪 Testing Supabase connection...")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Supabase not available for testing")
    return false
  }

  try {
    const { error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      console.error("❌ Connection test failed:", error)
      return false
    }

    console.log("✅ Connection test successful")
    return true
  } catch (error) {
    console.error("❌ Connection test error:", error)
    return false
  }
}
