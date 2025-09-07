import {
  supabase,
  isSupabaseAvailable,
  type User,
  type Task,
  type WishlistItem,
  type Note,
  type Achievement,
} from "./supabase"

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

// User Management
export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  const user: User = {
    ...userData,
    id: generateId(),
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("users").insert([user])
      if (error) {
        console.warn("Supabase insert failed, using localStorage:", error.message)
        throw error
      }
      console.log("✅ User created in Supabase")
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const users = getLocalUsers()
    users.push(user)
    localStorage.setItem("users", JSON.stringify(users))
    console.log("📱 User created in localStorage")
  }

  return user
}

export async function getUser(id: string): Promise<User | null> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
      if (error) throw error
      return data as User
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const users = getLocalUsers()
    return users.find((user) => user.id === id) || null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
      if (error) throw error
      return data as User
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const users = getLocalUsers()
    return users.find((user) => user.email === email) || null
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const updatedData = {
    ...updates,
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("users").update(updatedData).eq("id", id).select().single()
      if (error) throw error

      // Also update localStorage for consistency
      const users = getLocalUsers()
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData }
        localStorage.setItem("users", JSON.stringify(users))
      }

      return data as User
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const users = getLocalUsers()
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData }
      localStorage.setItem("users", JSON.stringify(users))
      return users[userIndex]
    }
    return null
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data as User[]
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    return getLocalUsers()
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("users").delete().eq("id", id)
      if (error) throw error

      // Also remove from localStorage
      const users = getLocalUsers()
      const filteredUsers = users.filter((user) => user.id !== id)
      localStorage.setItem("users", JSON.stringify(filteredUsers))

      return true
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const users = getLocalUsers()
    const filteredUsers = users.filter((user) => user.id !== id)
    localStorage.setItem("users", JSON.stringify(filteredUsers))
    return true
  }
}

// Task Management
export async function createTask(taskData: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const task: Task = {
    ...taskData,
    id: generateId(),
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("tasks").insert([task])
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const tasks = getLocalTasks()
    tasks.push(task)
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  return task
}

export async function getTasks(userId: string): Promise<Task[]> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Task[]
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const tasks = getLocalTasks()
    return tasks.filter((task) => task.user_id === userId)
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const updatedData = {
    ...updates,
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("tasks").update(updatedData).eq("id", id).select().single()
      if (error) throw error
      return data as Task
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const tasks = getLocalTasks()
    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
      localStorage.setItem("tasks", JSON.stringify(tasks))
      return tasks[taskIndex]
    }
    return null
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("tasks").delete().eq("id", id)
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const tasks = getLocalTasks()
    const filteredTasks = tasks.filter((task) => task.id !== id)
    localStorage.setItem("tasks", JSON.stringify(filteredTasks))
  }

  return true
}

// Wishlist Management
export async function createWishlistItem(
  itemData: Omit<WishlistItem, "id" | "created_at" | "updated_at">,
): Promise<WishlistItem> {
  const item: WishlistItem = {
    ...itemData,
    id: generateId(),
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("wishlist_items").insert([item])
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const items = getLocalWishlistItems()
    items.push(item)
    localStorage.setItem("wishlist_items", JSON.stringify(items))
  }

  return item
}

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as WishlistItem[]
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const items = getLocalWishlistItems()
    return items.filter((item) => item.user_id === userId)
  }
}

export async function updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
  const updatedData = {
    ...updates,
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("wishlist_items").update(updatedData).eq("id", id).select().single()
      if (error) throw error
      return data as WishlistItem
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const items = getLocalWishlistItems()
    const itemIndex = items.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...updatedData }
      localStorage.setItem("wishlist_items", JSON.stringify(items))
      return items[itemIndex]
    }
    return null
  }
}

export async function deleteWishlistItem(id: string): Promise<boolean> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", id)
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const items = getLocalWishlistItems()
    const filteredItems = items.filter((item) => item.id !== id)
    localStorage.setItem("wishlist_items", JSON.stringify(filteredItems))
  }

  return true
}

// Notes Management
export async function createNote(noteData: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  const note: Note = {
    ...noteData,
    id: generateId(),
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("notes").insert([note])
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const notes = getLocalNotes()
    notes.push(note)
    localStorage.setItem("notes", JSON.stringify(notes))
  }

  return note
}

export async function getNotes(userId: string): Promise<Note[]> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
      if (error) throw error
      return data as Note[]
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const notes = getLocalNotes()
    return notes.filter((note) => note.user_id === userId)
  }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
  const updatedData = {
    ...updates,
    updated_at: getCurrentTimestamp(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase.from("notes").update(updatedData).eq("id", id).select().single()
      if (error) throw error
      return data as Note
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const notes = getLocalNotes()
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], ...updatedData }
      localStorage.setItem("notes", JSON.stringify(notes))
      return notes[noteIndex]
    }
    return null
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("notes").delete().eq("id", id)
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const notes = getLocalNotes()
    const filteredNotes = notes.filter((note) => note.id !== id)
    localStorage.setItem("notes", JSON.stringify(filteredNotes))
  }

  return true
}

// Achievement Management
export async function createAchievement(achievementData: Omit<Achievement, "id">): Promise<Achievement> {
  const achievement: Achievement = {
    ...achievementData,
    id: generateId(),
  }

  try {
    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.from("achievements").insert([achievement])
      if (error) throw error
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const achievements = getLocalAchievements()
    achievements.push(achievement)
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }

  return achievement
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  try {
    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false })
      if (error) throw error
      return data as Achievement[]
    } else {
      throw new Error("Supabase not available")
    }
  } catch (error) {
    // Fallback to localStorage
    const achievements = getLocalAchievements()
    return achievements.filter((achievement) => achievement.user_id === userId)
  }
}

// Sync functions
export async function syncLocalToSupabase(userId: string): Promise<void> {
  if (!isSupabaseAvailable || !supabase) {
    console.log("Supabase not available, skipping sync")
    return
  }

  try {
    // Sync tasks
    const localTasks = getLocalTasks().filter((task) => task.user_id === userId)
    for (const task of localTasks) {
      const { error } = await supabase.from("tasks").upsert([task])
      if (error) console.warn("Failed to sync task:", error.message)
    }

    // Sync wishlist items
    const localWishlistItems = getLocalWishlistItems().filter((item) => item.user_id === userId)
    for (const item of localWishlistItems) {
      const { error } = await supabase.from("wishlist_items").upsert([item])
      if (error) console.warn("Failed to sync wishlist item:", error.message)
    }

    // Sync notes
    const localNotes = getLocalNotes().filter((note) => note.user_id === userId)
    for (const note of localNotes) {
      const { error } = await supabase.from("notes").upsert([note])
      if (error) console.warn("Failed to sync note:", error.message)
    }

    // Sync achievements
    const localAchievements = getLocalAchievements().filter((achievement) => achievement.user_id === userId)
    for (const achievement of localAchievements) {
      const { error } = await supabase.from("achievements").upsert([achievement])
      if (error) console.warn("Failed to sync achievement:", error.message)
    }

    console.log("✅ Local data synced to Supabase")
  } catch (error) {
    console.error("❌ Failed to sync local data to Supabase:", error)
  }
}

export async function syncSupabaseToLocal(userId: string): Promise<void> {
  if (!isSupabaseAvailable || !supabase) {
    console.log("Supabase not available, skipping sync")
    return
  }

  try {
    // Sync tasks
    const { data: tasks } = await supabase.from("tasks").select("*").eq("user_id", userId)
    if (tasks) {
      const localTasks = getLocalTasks().filter((task) => task.user_id !== userId)
      localStorage.setItem("tasks", JSON.stringify([...localTasks, ...tasks]))
    }

    // Sync wishlist items
    const { data: wishlistItems } = await supabase.from("wishlist_items").select("*").eq("user_id", userId)
    if (wishlistItems) {
      const localItems = getLocalWishlistItems().filter((item) => item.user_id !== userId)
      localStorage.setItem("wishlist_items", JSON.stringify([...localItems, ...wishlistItems]))
    }

    // Sync notes
    const { data: notes } = await supabase.from("notes").select("*").eq("user_id", userId)
    if (notes) {
      const localNotes = getLocalNotes().filter((note) => note.user_id !== userId)
      localStorage.setItem("notes", JSON.stringify([...localNotes, ...notes]))
    }

    // Sync achievements
    const { data: achievements } = await supabase.from("achievements").select("*").eq("user_id", userId)
    if (achievements) {
      const localAchievements = getLocalAchievements().filter((achievement) => achievement.user_id !== userId)
      localStorage.setItem("achievements", JSON.stringify([...localAchievements, ...achievements]))
    }

    console.log("✅ Supabase data synced to local")
  } catch (error) {
    console.error("❌ Failed to sync Supabase data to local:", error)
  }
}

// LocalStorage helper functions
function getLocalUsers(): User[] {
  if (typeof window === "undefined") return []
  try {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Error parsing users from localStorage:", error)
    return []
  }
}

function getLocalTasks(): Task[] {
  if (typeof window === "undefined") return []
  try {
    const tasks = localStorage.getItem("tasks")
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error)
    return []
  }
}

function getLocalWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const items = localStorage.getItem("wishlist_items")
    return items ? JSON.parse(items) : []
  } catch (error) {
    console.error("Error parsing wishlist items from localStorage:", error)
    return []
  }
}

function getLocalNotes(): Note[] {
  if (typeof window === "undefined") return []
  try {
    const notes = localStorage.getItem("notes")
    return notes ? JSON.parse(notes) : []
  } catch (error) {
    console.error("Error parsing notes from localStorage:", error)
    return []
  }
}

function getLocalAchievements(): Achievement[] {
  if (typeof window === "undefined") return []
  try {
    const achievements = localStorage.getItem("achievements")
    return achievements ? JSON.parse(achievements) : []
  } catch (error) {
    console.error("Error parsing achievements from localStorage:", error)
    return []
  }
}
