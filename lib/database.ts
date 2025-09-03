import { supabase, isSupabaseAvailable } from "./supabase"
import type { User, Task, WishlistItem, Note, Achievement } from "./supabase"

// Utility function to generate IDs
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// User functions
export const createUser = async (userData: {
  name: string
  email: string
  password: string
  language: "es" | "en" | "de" | "fr" | "it"
  theme: string
  is_premium: boolean
  onboarding_completed: boolean
  pomodoro_sessions: number
}): Promise<User> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("users").insert([userData]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating user in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const users = JSON.parse(localStorage.getItem("futureTask_users") || "[]")
  const existingUser = users.find((u: User) => u.email === userData.email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  const newUser: User = {
    id: generateId(),
    ...userData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("futureTask_users", JSON.stringify(users))
  return newUser
}

export const getUserByEmail = async (email: string, password: string): Promise<User | null> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // User not found
        }
        throw error
      }
      return data
    } catch (error) {
      console.error("Error getting user from Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const users = JSON.parse(localStorage.getItem("futureTask_users") || "[]")
  return users.find((u: User) => u.email === email && u.password === password) || null
}

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating user in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const users = JSON.parse(localStorage.getItem("futureTask_users") || "[]")
  const userIndex = users.findIndex((u: User) => u.id === userId)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  localStorage.setItem("futureTask_users", JSON.stringify(users))
  return users[userIndex]
}

// Task functions
export const getUserTasks = async (userId: string): Promise<Task[]> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting tasks from Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const tasks = JSON.parse(localStorage.getItem(`futureTask_tasks_${userId}`) || "[]")
  return tasks
}

export const createTask = async (taskData: {
  user_id: string
  text: string
  description?: string | null
  completed: boolean
  date: string
  category: "work" | "personal" | "health" | "learning" | "other"
  priority: "low" | "medium" | "high"
  time?: string | null
  notification_enabled?: boolean
}): Promise<Task> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating task in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const tasks = JSON.parse(localStorage.getItem(`futureTask_tasks_${taskData.user_id}`) || "[]")
  const newTask: Task = {
    id: generateId(),
    ...taskData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  tasks.push(newTask)
  localStorage.setItem(`futureTask_tasks_${taskData.user_id}`, JSON.stringify(tasks))
  return newTask
}

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating task in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback - need to find the task across all users
  const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("futureTask_tasks_"))

  for (const key of allKeys) {
    const tasks = JSON.parse(localStorage.getItem(key) || "[]")
    const taskIndex = tasks.findIndex((t: Task) => t.id === taskId)

    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem(key, JSON.stringify(tasks))
      return tasks[taskIndex]
    }
  }

  throw new Error("Task not found")
}

export const deleteTask = async (taskId: string): Promise<void> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error
      return
    } catch (error) {
      console.error("Error deleting task in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback - need to find the task across all users
  const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("futureTask_tasks_"))

  for (const key of allKeys) {
    const tasks = JSON.parse(localStorage.getItem(key) || "[]")
    const filteredTasks = tasks.filter((t: Task) => t.id !== taskId)

    if (filteredTasks.length !== tasks.length) {
      localStorage.setItem(key, JSON.stringify(filteredTasks))
      return
    }
  }
}

// Wishlist functions
export const getUserWishlist = async (userId: string): Promise<WishlistItem[]> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting wishlist from Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const wishlist = JSON.parse(localStorage.getItem(`futureTask_wishlist_${userId}`) || "[]")
  return wishlist
}

export const createWishlistItem = async (itemData: {
  user_id: string
  title: string
  description?: string
  price?: number
  url?: string
  priority: "low" | "medium" | "high"
  category: string
}): Promise<WishlistItem> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("wishlist_items").insert([itemData]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating wishlist item in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const wishlist = JSON.parse(localStorage.getItem(`futureTask_wishlist_${itemData.user_id}`) || "[]")
  const newItem: WishlistItem = {
    id: generateId(),
    ...itemData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  wishlist.push(newItem)
  localStorage.setItem(`futureTask_wishlist_${itemData.user_id}`, JSON.stringify(wishlist))
  return newItem
}

export const updateWishlistItem = async (itemId: string, updates: Partial<WishlistItem>): Promise<WishlistItem> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", itemId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating wishlist item in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback - need to find the item across all users
  const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("futureTask_wishlist_"))

  for (const key of allKeys) {
    const wishlist = JSON.parse(localStorage.getItem(key) || "[]")
    const itemIndex = wishlist.findIndex((item: WishlistItem) => item.id === itemId)

    if (itemIndex !== -1) {
      wishlist[itemIndex] = {
        ...wishlist[itemIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem(key, JSON.stringify(wishlist))
      return wishlist[itemIndex]
    }
  }

  throw new Error("Wishlist item not found")
}

export const deleteWishlistItem = async (itemId: string): Promise<void> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

      if (error) throw error
      return
    } catch (error) {
      console.error("Error deleting wishlist item in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback - need to find the item across all users
  const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("futureTask_wishlist_"))

  for (const key of allKeys) {
    const wishlist = JSON.parse(localStorage.getItem(key) || "[]")
    const filteredWishlist = wishlist.filter((item: WishlistItem) => item.id !== itemId)

    if (filteredWishlist.length !== wishlist.length) {
      localStorage.setItem(key, JSON.stringify(filteredWishlist))
      return
    }
  }
}

// Notes functions
export const getUserNotes = async (userId: string): Promise<Note[]> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting notes from Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const notes = JSON.parse(localStorage.getItem(`futureTask_notes_${userId}`) || "[]")
  return notes
}

export const createNote = async (noteData: {
  user_id: string
  title: string
  content: string
  color?: string
}): Promise<Note> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase.from("notes").insert([noteData]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating note in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const notes = JSON.parse(localStorage.getItem(`futureTask_notes_${noteData.user_id}`) || "[]")
  const newNote: Note = {
    id: generateId(),
    ...noteData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  notes.push(newNote)
  localStorage.setItem(`futureTask_notes_${noteData.user_id}`, JSON.stringify(notes))
  return newNote
}

export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<Note> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", noteId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating note in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback - need to find the note across all users
  const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("futureTask_notes_"))

  for (const key of allKeys) {
    const notes = JSON.parse(localStorage.getItem(key) || "[]")
    const noteIndex = notes.findIndex((note: Note) => note.id === noteId)

    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem(key, JSON.stringify(notes))
      return notes[noteIndex]
    }
  }

  throw new Error("Note not found")
}

export const deleteNote = async (noteId: string): Promise<void> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId)

      if (error) throw error
      return
    } catch (error) {
      console.error("Error deleting note in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback - need to find the note across all users
  const allKeys = Object.keys(localStorage).filter((key) => key.startsWith("futureTask_notes_"))

  for (const key of allKeys) {
    const notes = JSON.parse(localStorage.getItem(key) || "[]")
    const filteredNotes = notes.filter((note: Note) => note.id !== noteId)

    if (filteredNotes.length !== notes.length) {
      localStorage.setItem(key, JSON.stringify(filteredNotes))
      return
    }
  }
}

// Achievement functions
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting achievements from Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const achievements = JSON.parse(localStorage.getItem(`futureTask_achievements_${userId}`) || "[]")
  return achievements
}

export const unlockAchievement = async (userId: string, achievementKey: string): Promise<Achievement> => {
  if (isSupabaseAvailable && supabase) {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .insert([{ user_id: userId, achievement_key: achievementKey }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error unlocking achievement in Supabase:", error)
      // Fall back to localStorage
    }
  }

  // localStorage fallback
  const achievements = JSON.parse(localStorage.getItem(`futureTask_achievements_${userId}`) || "[]")
  const newAchievement: Achievement = {
    id: generateId(),
    user_id: userId,
    achievement_key: achievementKey,
    unlocked_at: new Date().toISOString(),
  }

  achievements.push(newAchievement)
  localStorage.setItem(`futureTask_achievements_${userId}`, JSON.stringify(achievements))
  return newAchievement
}

// Migration function
export const migrateLocalStorageToSupabase = async (userId: string): Promise<boolean> => {
  if (!isSupabaseAvailable || !supabase) {
    console.log("Supabase not available for migration")
    return false
  }

  try {
    console.log("Starting migration for user:", userId)

    // Migrate tasks
    const localTasks = JSON.parse(localStorage.getItem(`futureTask_tasks_${userId}`) || "[]")
    if (localTasks.length > 0) {
      const { error: tasksError } = await supabase.from("tasks").insert(
        localTasks.map((task: any) => ({
          ...task,
          user_id: userId,
        })),
      )

      if (tasksError) {
        console.error("Error migrating tasks:", tasksError)
        return false
      }
      console.log(`Migrated ${localTasks.length} tasks`)
    }

    // Migrate wishlist
    const localWishlist = JSON.parse(localStorage.getItem(`futureTask_wishlist_${userId}`) || "[]")
    if (localWishlist.length > 0) {
      const { error: wishlistError } = await supabase.from("wishlist_items").insert(
        localWishlist.map((item: any) => ({
          ...item,
          user_id: userId,
        })),
      )

      if (wishlistError) {
        console.error("Error migrating wishlist:", wishlistError)
        return false
      }
      console.log(`Migrated ${localWishlist.length} wishlist items`)
    }

    // Migrate notes
    const localNotes = JSON.parse(localStorage.getItem(`futureTask_notes_${userId}`) || "[]")
    if (localNotes.length > 0) {
      const { error: notesError } = await supabase.from("notes").insert(
        localNotes.map((note: any) => ({
          ...note,
          user_id: userId,
        })),
      )

      if (notesError) {
        console.error("Error migrating notes:", notesError)
        return false
      }
      console.log(`Migrated ${localNotes.length} notes`)
    }

    // Migrate achievements
    const localAchievements = JSON.parse(localStorage.getItem(`futureTask_achievements_${userId}`) || "[]")
    if (localAchievements.length > 0) {
      const { error: achievementsError } = await supabase.from("achievements").insert(
        localAchievements.map((achievement: any) => ({
          ...achievement,
          user_id: userId,
        })),
      )

      if (achievementsError) {
        console.error("Error migrating achievements:", achievementsError)
        return false
      }
      console.log(`Migrated ${localAchievements.length} achievements`)
    }

    // Clear local data after successful migration
    localStorage.removeItem(`futureTask_tasks_${userId}`)
    localStorage.removeItem(`futureTask_wishlist_${userId}`)
    localStorage.removeItem(`futureTask_notes_${userId}`)
    localStorage.removeItem(`futureTask_achievements_${userId}`)

    console.log("Migration completed successfully")
    return true
  } catch (error) {
    console.error("Migration failed:", error)
    return false
  }
}
