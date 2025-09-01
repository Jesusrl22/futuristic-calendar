import { supabase } from "./supabase"
import type { User, Task, WishlistItem, Note, Achievement } from "./supabase"

// ==================== USUARIOS ====================

export const createUser = async (userData: Omit<User, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }
  return data
}

export const getUserByEmail = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("password", password).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    console.error("Error getting user by email:", error)
    throw error
  }
  return data
}

export const updateUser = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user:", error)
    throw error
  }
  return data
}

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error getting all users:", error)
    throw error
  }
  return data || []
}

export const deleteUser = async (userId: string) => {
  const { error } = await supabase.from("users").delete().eq("id", userId)

  if (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// ==================== TAREAS ====================

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error getting user tasks:", error)
    throw error
  }
  return data || []
}

export const createTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

  if (error) {
    console.error("Error creating task:", error)
    throw error
  }
  return data
}

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()

  if (error) {
    console.error("Error updating task:", error)
    throw error
  }
  return data
}

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId)

  if (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export const getAllTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error getting all tasks:", error)
    throw error
  }
  return data || []
}

// ==================== WISHLIST ====================

export const getUserWishlist = async (userId: string): Promise<WishlistItem[]> => {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error getting user wishlist:", error)
    throw error
  }
  return data || []
}

export const createWishlistItem = async (itemData: Omit<WishlistItem, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("wishlist_items").insert([itemData]).select().single()

  if (error) {
    console.error("Error creating wishlist item:", error)
    throw error
  }
  return data
}

export const updateWishlistItem = async (itemId: string, updates: Partial<WishlistItem>) => {
  const { data, error } = await supabase.from("wishlist_items").update(updates).eq("id", itemId).select().single()

  if (error) {
    console.error("Error updating wishlist item:", error)
    throw error
  }
  return data
}

export const deleteWishlistItem = async (itemId: string) => {
  const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

  if (error) {
    console.error("Error deleting wishlist item:", error)
    throw error
  }
}

// ==================== NOTAS ====================

export const getUserNotes = async (userId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error getting user notes:", error)
    throw error
  }
  return data || []
}

export const createNote = async (noteData: Omit<Note, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase.from("notes").insert([noteData]).select().single()

  if (error) {
    console.error("Error creating note:", error)
    throw error
  }
  return data
}

export const updateNote = async (noteId: string, updates: Partial<Note>) => {
  const { data, error } = await supabase.from("notes").update(updates).eq("id", noteId).select().single()

  if (error) {
    console.error("Error updating note:", error)
    throw error
  }
  return data
}

export const deleteNote = async (noteId: string) => {
  const { error } = await supabase.from("notes").delete().eq("id", noteId)

  if (error) {
    console.error("Error deleting note:", error)
    throw error
  }
}

// ==================== ACHIEVEMENTS ====================

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false })

  if (error) {
    console.error("Error getting user achievements:", error)
    throw error
  }
  return data || []
}

export const unlockAchievement = async (userId: string, achievementKey: string) => {
  // Verificar si ya está desbloqueado
  const { data: existing } = await supabase
    .from("achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_key", achievementKey)
    .single()

  if (existing) {
    return existing // Ya está desbloqueado
  }

  const { data, error } = await supabase
    .from("achievements")
    .insert([{ user_id: userId, achievement_key: achievementKey }])
    .select()
    .single()

  if (error) {
    console.error("Error unlocking achievement:", error)
    throw error
  }
  return data
}

// ==================== UTILIDADES ====================

export const migrateFromLocalStorage = async () => {
  try {
    console.log("🔄 Iniciando migración desde localStorage...")

    // Migrar usuarios
    const localUsers = localStorage.getItem("futureTask_users")
    if (localUsers) {
      const users = JSON.parse(localUsers)
      console.log(`📊 Migrando ${users.length} usuarios...`)

      for (const user of users) {
        try {
          await createUser({
            name: user.name,
            email: user.email,
            password: user.password,
            language: user.language || "es",
            theme: user.theme || "default",
            is_premium: user.isPremium || false,
            premium_expiry: user.premiumExpiry || null,
            onboarding_completed: user.onboardingCompleted || false,
            pomodoro_sessions: user.pomodoroSessions || 0,
          })
          console.log(`✅ Usuario migrado: ${user.email}`)
        } catch (error) {
          console.log(`⚠️ Usuario ya existe o error: ${user.email}`)
        }
      }
    }

    console.log("✅ Migración completada!")
    return true
  } catch (error) {
    console.error("❌ Error en migración:", error)
    return false
  }
}

export const getStats = async () => {
  try {
    const [usersResult, tasksResult] = await Promise.all([
      supabase.from("users").select("id, is_premium, created_at"),
      supabase.from("tasks").select("id, completed, user_id"),
    ])

    const users = usersResult.data || []
    const tasks = tasksResult.data || []

    return {
      totalUsers: users.length,
      premiumUsers: users.filter((u) => u.is_premium).length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.completed).length,
      activeUsers: users.length, // Simplificado
    }
  } catch (error) {
    console.error("Error getting stats:", error)
    return {
      totalUsers: 0,
      premiumUsers: 0,
      totalTasks: 0,
      completedTasks: 0,
      activeUsers: 0,
    }
  }
}
