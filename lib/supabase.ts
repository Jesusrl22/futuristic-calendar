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

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate Supabase URL format
function isValidSupabaseUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: "URL is empty" }
  }

  // Remove trailing slash if present
  const cleanUrl = url.replace(/\/$/, "")

  try {
    const urlObj = new URL(cleanUrl)

    // Check protocol
    if (urlObj.protocol !== "https:" && urlObj.protocol !== "http:") {
      return { valid: false, error: "URL must use http:// or https://" }
    }

    // Check if it looks like a Supabase URL
    if (urlObj.hostname.includes("supabase.co") || urlObj.hostname.includes("supabase.")) {
      return { valid: true }
    }

    // Allow localhost for development
    if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
      return { valid: true }
    }

    // Allow any valid URL format (for custom domains)
    if (urlObj.hostname && urlObj.hostname.includes(".")) {
      return { valid: true }
    }

    return { valid: false, error: "Invalid hostname format" }
  } catch (error) {
    return { valid: false, error: `Invalid URL format: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

// Create Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null
let initializationError: string | null = null
let urlValidation: { valid: boolean; error?: string } = { valid: false }

try {
  if (supabaseUrl && supabaseAnonKey) {
    urlValidation = isValidSupabaseUrl(supabaseUrl)

    if (urlValidation.valid) {
      // Clean URL (remove trailing slash)
      const cleanUrl = supabaseUrl.replace(/\/$/, "")

      supabaseClient = createClient(cleanUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      })
      console.log("✅ Supabase client initialized successfully")
      console.log("📍 URL:", cleanUrl)
    } else {
      initializationError = `Invalid URL: ${urlValidation.error}`
      console.warn("⚠️ Invalid Supabase URL:", supabaseUrl)
      console.warn("❌ Error:", urlValidation.error)
    }
  } else {
    initializationError = "Missing credentials"
    console.warn("⚠️ Supabase credentials missing:")
    if (!supabaseUrl) console.warn("- NEXT_PUBLIC_SUPABASE_URL: ❌ Missing")
    if (!supabaseAnonKey) console.warn("- NEXT_PUBLIC_SUPABASE_ANON_KEY: ❌ Missing")
  }
} catch (error) {
  initializationError = `Initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`
  console.error("❌ Failed to initialize Supabase client:", error)
}

// Export the client
export const supabase = supabaseClient

// Check if Supabase is available and working
export const isSupabaseAvailable = Boolean(supabaseClient && !initializationError)

// Test Supabase connection
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  if (!supabaseClient) {
    return { success: false, error: "Client not initialized" }
  }

  try {
    // Try to query the users table
    const { error } = await supabaseClient.from("users").select("count", { count: "exact", head: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown connection error",
    }
  }
}

// Helper function to get Supabase client
export function getSupabaseClient() {
  return supabaseClient
}

// Database status with detailed information
export function getDatabaseStatus() {
  return {
    supabaseAvailable: isSupabaseAvailable,
    hasCredentials: Boolean(supabaseUrl && supabaseAnonKey),
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseAnonKey),
    clientInitialized: Boolean(supabaseClient),
    urlValidation,
    initializationError,
    currentUrl: supabaseUrl,
  }
}

// Get example URLs for help
export function getSupabaseUrlExamples() {
  return [
    "https://your-project.supabase.co",
    "https://abcdefghijklmnop.supabase.co",
    "https://localhost:54321 (for local development)",
  ]
}
