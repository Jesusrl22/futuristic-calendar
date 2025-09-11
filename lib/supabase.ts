import { createClient } from "@supabase/supabase-js"

// Types
export interface User {
  id: string
  name: string
  email: string
  password?: string
  language: "es" | "en" | "fr" | "de" | "it"
  theme: string
  is_premium: boolean
  is_pro: boolean
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  created_at: string
  updated_at: string
  ai_credits?: number
  ai_credits_used?: number
  ai_total_cost_eur?: number
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

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// Validate URL format
function isValidUrl(url: string | undefined): boolean {
  if (!url || typeof url !== "string") return false
  try {
    const urlObj = new URL(url.trim())
    return urlObj.protocol === "https:" || urlObj.protocol === "http:"
  } catch {
    return false
  }
}

// Check if Supabase is available - THIS IS THE MISSING EXPORT
export const isSupabaseAvailable = Boolean(
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && supabaseAnonKey.length > 10,
)

// Create Supabase client only if we have valid credentials
let supabaseClient: ReturnType<typeof createClient> | null = null

if (isSupabaseAvailable) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
  } catch (error) {
    console.warn("Failed to initialize Supabase client:", error)
    supabaseClient = null
  }
} else {
  console.warn("Supabase credentials not configured properly. Using mock data.")
}

export const supabase = supabaseClient

// Test Supabase connection
export async function testSupabaseConnection(): Promise<{
  connected: boolean
  error?: string
  latency?: number
}> {
  if (!supabase) {
    return {
      connected: false,
      error: "Supabase client not initialized",
    }
  }

  try {
    const startTime = Date.now()
    const { error } = await supabase.from("users").select("count").limit(1)
    const latency = Date.now() - startTime

    if (error) {
      return {
        connected: false,
        error: error.message,
        latency,
      }
    }

    return {
      connected: true,
      latency,
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Get database status
export function getDatabaseStatus() {
  return {
    supabaseAvailable: isSupabaseAvailable,
    hasCredentials: Boolean(supabaseUrl && supabaseAnonKey),
    clientInitialized: Boolean(supabase),
    validUrl: supabaseUrl ? isValidUrl(supabaseUrl) : false,
    initializationError: isSupabaseAvailable ? null : "Missing or invalid Supabase credentials",
  }
}

export default supabase
