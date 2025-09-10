import { supabase } from "./supabase"

export interface User {
  id: string
  name: string
  email: string
  password: string
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

// User functions
export async function createUser(userData: Omit<User, "id" | "created_at">): Promise<User> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("users").insert(userData).select().single()

  if (error) throw error
  return data
}

export async function getUserByEmail(email: string, password: string): Promise<User | null> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("password", password).single()

  if (error) return null
  return data
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("users").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

// Task functions
export async function getUserTasks(userId: string): Promise<Task[]> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTask(taskData: Omit<Task, "id">): Promise<Task> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("tasks").insert(taskData).select().single()

  if (error) throw error
  return data
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) throw error
}

// Wishlist functions
export async function getUserWishlist(userId: string): Promise<WishlistItem[]> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createWishlistItem(
  itemData: Omit<WishlistItem, "id" | "created_at" | "updated_at">,
): Promise<WishlistItem> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("wishlist").insert(itemData).select().single()

  if (error) throw error
  return data
}

export async function updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("wishlist").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteWishlistItem(id: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { error } = await supabase.from("wishlist").delete().eq("id", id)

  if (error) throw error
}

// Notes functions
export async function getUserNotes(userId: string): Promise<Note[]> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createNote(noteData: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("notes").insert(noteData).select().single()

  if (error) throw error
  return data
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("notes").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteNote(id: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { error } = await supabase.from("notes").delete().eq("id", id)

  if (error) throw error
}

// Admin functions
export async function getAllUsers(): Promise<User[]> {
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Initialize admin user
export async function initializeAdminUser(): Promise<void> {
  if (!supabase) {
    console.log("Supabase not available, skipping admin user initialization")
    return
  }

  try {
    // Check if admin user exists
    const { data: existingAdmin } = await supabase.from("users").select("id").eq("email", "admin").single()

    if (!existingAdmin) {
      // Create admin user
      await createUser({
        name: "Admin",
        email: "admin",
        password: "535353-Jrl",
        language: "es",
        theme: "default",
        is_premium: true,
        is_pro: true,
        onboarding_completed: true,
        pomodoro_sessions: 0,
        work_duration: 25,
        short_break_duration: 5,
        long_break_duration: 15,
        sessions_until_long_break: 4,
      })
      console.log("Admin user created successfully")
    }
  } catch (error) {
    console.error("Error initializing admin user:", error)
  }
}
