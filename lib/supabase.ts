import { createClient } from "@supabase/supabase-js"

// Types - Updated User interface without password
export interface User {
  id: string
  name: string
  email: string
  auth_id?: string
  language: "es" | "en" | "fr" | "de" | "it"
  theme: string
  is_premium: boolean
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  created_at: string
  updated_at: string
}

export interface UserCredentials {
  id: string
  user_id: string
  email: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  text: string
  description?: string | null
  completed: boolean
  date: string
  time?: string | null
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  completed_at?: string | null
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
  type: string
  title: string
  description: string
  unlocked_at: string
}

// Get environment variables with better validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only log in development
if (process.env.NODE_ENV === "development") {
  console.log("🔧 Supabase Configuration:")
  console.log("URL:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "❌ Missing")
  console.log("Key:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "❌ Missing")
}

// Validate URL format
function isValidUrl(string: string): boolean {
  if (!string) return false
  try {
    const url = new URL(string)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

// Create Supabase client with better error handling
let supabaseClient: ReturnType<typeof createClient> | null = null
let initializationError: string | null = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    if (isValidUrl(supabaseUrl)) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // We handle our own session management
        },
      })

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Supabase client initialized successfully")
      }
    } else {
      initializationError = "Invalid Supabase URL format"
      console.warn("⚠️ Invalid Supabase URL format:", supabaseUrl)
    }
  } else {
    initializationError = "Missing Supabase credentials"
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Supabase credentials missing:")
      console.warn("- NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Present" : "❌ Missing")
      console.warn("- NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Present" : "❌ Missing")
    }
  }
} catch (error) {
  initializationError = `Failed to initialize: ${error}`
  console.error("❌ Failed to initialize Supabase client:", error)
}

// Export the client
export const supabase = supabaseClient

// Check if Supabase is available and working
export const isSupabaseAvailable = Boolean(supabaseClient && !initializationError)

// Test Supabase connection with better error handling
export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabaseClient) {
    if (process.env.NODE_ENV === "development") {
      console.log("❌ No Supabase client available for connection test")
    }
    return false
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Testing Supabase connection...")
    }

    const { data, error } = await supabaseClient.from("users").select("count", { count: "exact", head: true })

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Supabase connection test failed:", error.message)
      }
      return false
    }

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Supabase connection test successful")
    }
    return true
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Supabase connection test failed with exception:", error)
    }
    return false
  }
}

// Helper function to get Supabase client
export function getSupabaseClient() {
  return supabaseClient
}

// Database status with connection test
export function getDatabaseStatus() {
  return {
    supabaseAvailable: isSupabaseAvailable,
    hasCredentials: Boolean(supabaseUrl && supabaseAnonKey),
    clientInitialized: Boolean(supabaseClient),
    validUrl: supabaseUrl ? isValidUrl(supabaseUrl) : false,
    initializationError,
  }
}
