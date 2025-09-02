import { supabase, isSupabaseAvailable } from "./supabase"
import type { User, Task, WishlistItem, Note, Achievement } from "./supabase"

// Helper function to safely use Supabase with localStorage fallback
const safeSupabaseCall = async (
  operation: () => Promise<any>,
  fallback: () => any,
  operationName: string,
): Promise<any> => {
  // Use fallback if Supabase is not available or we're on server-side
  if (!isSupabaseAvailable || typeof window === "undefined" || !supabase) {
    console.log(`📦 Using localStorage fallback for ${operationName}`)
    return fallback()
  }

  try {
    const result = await operation()
    console.log(`✅ Supabase operation successful: ${operationName}`)
    return result
  } catch (error) {
    console.error(`❌ Supabase operation failed: ${operationName}`, error)
    console.log(`📦 Falling back to localStorage for ${operationName}`)
    return fallback()
  }
}

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem(key) : null
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value)
      }
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

// ==================== FALLBACK FUNCTIONS ====================

const createUserFallback = (userData: Omit<User, "id" | "created_at" | "updated_at">): User => {
  const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  users.push(newUser)
  safeLocalStorage.setItem("futureTask_users", JSON.stringify(users))
  return newUser
}

const getUserByEmailFallback = (email: string, password: string): User | null => {
  const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
  return users.find((u: User) => u.email === email && u.password === password) || null
}

const updateUserFallback = (userId: string, updates: Partial<User>): User => {
  const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
  const userIndex = users.findIndex((u: User) => u.id === userId)
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date().toISOString() }
    safeLocalStorage.setItem("futureTask_users", JSON.stringify(users))
    return users[userIndex]
  }
  throw new Error("User not found")
}

const getAllUsersFallback = (): User[] => {
  return JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
}

const deleteUserFallback = (userId: string): boolean => {
  const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
  const filteredUsers = users.filter((u: User) => u.id !== userId)
  safeLocalStorage.setItem("futureTask_users", JSON.stringify(filteredUsers))
  return true
}

const getUserTasksFallback = (userId: string): Task[] => {
  return JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${userId}`) || "[]")
}

const createTaskFallback = (taskData: Omit<Task, "id" | "created_at" | "updated_at">): Task => {
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  const tasks = getUserTasksFallback(taskData.user_id)
  tasks.push(newTask)
  safeLocalStorage.setItem(`futureTask_tasks_${taskData.user_id}`, JSON.stringify(tasks))
  return newTask
}

const updateTaskFallback = (taskId: string, updates: Partial<Task>): Task => {
  const users = getAllUsersFallback()
  for (const user of users) {
    const tasks = getUserTasksFallback(user.id)
    const taskIndex = tasks.findIndex((t: Task) => t.id === taskId)
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updated_at: new Date().toISOString() }
      safeLocalStorage.setItem(`futureTask_tasks_${user.id}`, JSON.stringify(tasks))
      return tasks[taskIndex]
    }
  }
  throw new Error("Task not found")
}

const deleteTaskFallback = (taskId: string): boolean => {
  const users = getAllUsersFallback()
  for (const user of users) {
    const tasks = getUserTasksFallback(user.id)
    const filteredTasks = tasks.filter((t: Task) => t.id !== taskId)
    if (filteredTasks.length !== tasks.length) {
      safeLocalStorage.setItem(`futureTask_tasks_${user.id}`, JSON.stringify(filteredTasks))
      return true
    }
  }
  return false
}

const getUserWishlistFallback = (userId: string): WishlistItem[] => {
  return JSON.parse(safeLocalStorage.getItem(`futureTask_wishlist_${userId}`) || "[]")
}

const getUserNotesFallback = (userId: string): Note[] => {
  return JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${userId}`) || "[]")
}

// ==================== USUARIOS ====================

export const createUser = async (userData: Omit<User, "id" | "created_at" | "updated_at">) => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase.from("users").insert([userData]).select().single()
      if (error) throw error
      return data
    },
    () => createUserFallback(userData),
    "createUser",
  )
}

export const getUserByEmail = async (email: string, password: string): Promise<User | null> => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        throw error
      }
      return data
    },
    () => getUserByEmailFallback(email, password),
    "getUserByEmail",
  )
}

export const updateUser = async (userId: string, updates: Partial<User>) => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()
      if (error) throw error
      return data
    },
    () => updateUserFallback(userId, updates),
    "updateUser",
  )
}

export const getAllUsers = async (): Promise<User[]> => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    },
    () => getAllUsersFallback(),
    "getAllUsers",
  )
}

export const deleteUser = async (userId: string) => {
  return safeSupabaseCall(
    async () => {
      const { error } = await supabase.from("users").delete().eq("id", userId)
      if (error) throw error
      return true
    },
    () => deleteUserFallback(userId),
    "deleteUser",
  )
}

// ==================== TAREAS ====================

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true })
      if (error) throw error
      return data || []
    },
    () => getUserTasksFallback(userId),
    "getUserTasks",
  )
}

export const createTask = async (taskData: Omit<Task, "id" | "created_at" | "updated_at">) => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()
      if (error) throw error
      return data
    },
    () => createTaskFallback(taskData),
    "createTask",
  )
}

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()
      if (error) throw error
      return data
    },
    () => updateTaskFallback(taskId, updates),
    "updateTask",
  )
}

export const deleteTask = async (taskId: string) => {
  return safeSupabaseCall(
    async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)
      if (error) throw error
      return true
    },
    () => deleteTaskFallback(taskId),
    "deleteTask",
  )
}

// ==================== WISHLIST ====================

export const getUserWishlist = async (userId: string): Promise<WishlistItem[]> => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    },
    () => getUserWishlistFallback(userId),
    "getUserWishlist",
  )
}

// ==================== NOTAS ====================

export const getUserNotes = async (userId: string): Promise<Note[]> => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    },
    () => getUserNotesFallback(userId),
    "getUserNotes",
  )
}

// ==================== ACHIEVEMENTS ====================

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  return safeSupabaseCall(
    async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false })
      if (error) throw error
      return data || []
    },
    () => [],
    "getUserAchievements",
  )
}

export const unlockAchievement = async (userId: string, achievementKey: string) => {
  return safeSupabaseCall(
    async () => {
      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", userId)
        .eq("achievement_key", achievementKey)
        .single()

      if (existing) {
        return existing
      }

      const { data, error } = await supabase
        .from("achievements")
        .insert([{ user_id: userId, achievement_key: achievementKey }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    () => null,
    "unlockAchievement",
  )
}

// ==================== UTILIDADES ====================

export const getStats = async () => {
  return safeSupabaseCall(
    async () => {
      const [usersResult, tasksResult] = await Promise.all([
        supabase.from("users").select("id, is_premium, created_at, onboarding_completed"),
        supabase.from("tasks").select("id, completed, user_id"),
      ])

      if (usersResult.error) throw usersResult.error
      if (tasksResult.error) throw tasksResult.error

      const users = usersResult.data || []
      const tasks = tasksResult.data || []

      return {
        totalUsers: users.length,
        premiumUsers: users.filter((u) => u.is_premium).length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.completed).length,
        activeUsers: users.filter((u) => u.onboarding_completed).length,
      }
    },
    () => {
      const users = getAllUsersFallback()
      let allTasks: Task[] = []
      users.forEach((user) => {
        const userTasks = getUserTasksFallback(user.id)
        allTasks = [...allTasks, ...userTasks]
      })

      return {
        totalUsers: users.length,
        premiumUsers: users.filter((u) => u.is_premium).length,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter((t) => t.completed).length,
        activeUsers: users.filter((u) => u.onboarding_completed).length,
      }
    },
    "getStats",
  )
}
