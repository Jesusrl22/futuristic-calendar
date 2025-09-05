import { createClient } from "@supabase/supabase-js"

// Types
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
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
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

// Supabase configuration with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate URL format
function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// Create Supabase client with proper error handling
let supabaseClient: ReturnType<typeof createClient> | null = null

try {
  if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client initialized successfully")
  } else {
    console.warn("⚠️ Supabase credentials missing or invalid URL format")
    console.warn("URL:", supabaseUrl ? "Present" : "Missing")
    console.warn("Key:", supabaseAnonKey ? "Present" : "Missing")
    console.warn("Valid URL:", supabaseUrl ? isValidUrl(supabaseUrl) : false)
  }
} catch (error) {
  console.warn("Failed to initialize Supabase client:", error)
}

// Export the client
export const supabase = supabaseClient

// Check if Supabase is available
export const isSupabaseAvailable = Boolean(supabaseClient && supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))

// Helper function to get Supabase client
export function getSupabaseClient() {
  return supabaseClient
}

// Database status
export function getDatabaseStatus() {
  return {
    supabaseAvailable: isSupabaseAvailable,
    hasCredentials: Boolean(supabaseUrl && supabaseAnonKey),
    validUrl: supabaseUrl ? isValidUrl(supabaseUrl) : false,
    client: Boolean(supabaseClient),
  }
}
