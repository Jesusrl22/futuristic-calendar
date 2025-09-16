import { supabase, isSupabaseAvailable } from "./supabase"

// Mock data for when Supabase is not available
const mockUsers = [
  {
    id: "admin-1",
    name: "Admin",
    email: "admin@futuretask.com",
    password: "535353-Jrl",
    language: "es",
    theme: "dark",
    is_premium: true,
    is_pro: true,
    onboarding_completed: true,
    pomodoro_sessions: 0,
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    created_at: new Date().toISOString(),
    premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    ai_credits: 1000,
    ai_credits_used: 0,
    ai_total_cost_eur: 0,
  },
  {
    id: "demo-1",
    name: "Demo User",
    email: "demo@futuretask.com",
    password: "demo123",
    language: "es",
    theme: "dark",
    is_premium: false,
    is_pro: false,
    onboarding_completed: true,
    pomodoro_sessions: 0,
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    created_at: new Date().toISOString(),
    premium_expiry: null,
    ai_credits: 0,
    ai_credits_used: 0,
    ai_total_cost_eur: 0,
  },
  {
    id: "jesus-1",
    name: "Jesus Raya",
    email: "jesusrayaleon1@gmail.com",
    password: "jesus123",
    language: "es",
    theme: "dark",
    is_premium: true,
    is_pro: true,
    onboarding_completed: true,
    pomodoro_sessions: 0,
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    created_at: new Date().toISOString(),
    premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    ai_credits: 1000,
    ai_credits_used: 0,
    ai_total_cost_eur: 0,
  },
]

export interface User {
  id: string
  name: string
  email: string
  password: string
  language: string
  theme: string
  is_premium: boolean
  is_pro: boolean
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  created_at: string
  premium_expiry?: string | null
  ai_credits?: number
  ai_credits_used?: number
  ai_total_cost_eur?: number
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
      if (error) return null
      return data
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  }

  // Fallback to mock data
  return mockUsers.find((user) => user.email === email) || null
}

export async function getAllUsers(): Promise<User[]> {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching users:", error)
      return mockUsers
    }
  }

  return mockUsers
}

export async function createUser(userData: Omit<User, "id" | "created_at">): Promise<User> {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([{ ...userData, created_at: new Date().toISOString() }])
        .select()
        .single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  // Fallback to mock data
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  mockUsers.push(newUser)
  return newUser
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating user:", error)
      return null
    }
  }

  // Fallback to mock data
  const userIndex = mockUsers.findIndex((user) => user.id === id)
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    return mockUsers[userIndex]
  }
  return null
}

export async function cancelUserSubscription(userId: string): Promise<User | null> {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const updates = {
    subscription_status: "cancelled",
    subscription_cancelled_at: new Date().toISOString(),
    subscription_ends_at: nextMonth.toISOString(),
  }

  return updateUser(userId, updates)
}

export async function initializeAdminUser(): Promise<void> {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data: existingAdmin } = await supabase
        .from("users")
        .select("*")
        .eq("email", "admin@futuretask.com")
        .single()

      if (!existingAdmin) {
        await supabase.from("users").insert([
          {
            name: "Admin",
            email: "admin@futuretask.com",
            password: "535353-Jrl",
            language: "es",
            theme: "dark",
            is_premium: true,
            is_pro: true,
            onboarding_completed: true,
            pomodoro_sessions: 0,
            work_duration: 25,
            short_break_duration: 5,
            long_break_duration: 15,
            sessions_until_long_break: 4,
            premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            ai_credits: 1000,
            ai_credits_used: 0,
            ai_total_cost_eur: 0,
          },
        ])
        console.log("✅ Admin user created in Supabase")
      }
    } catch (error) {
      console.error("Error initializing admin user:", error)
    }
  }
}
