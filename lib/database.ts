import { supabase, isSupabaseAvailable } from "./supabase"
import type { User, UserCredentials, Task, WishlistItem, Note } from "./supabase"

// Helper function to generate UUID
function generateId(): string {
  return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Simple password hashing (for demo purposes - in production use bcrypt or similar)
function hashPassword(password: string): string {
  // Simple hash for demo - in production use proper hashing
  return btoa(password + "salt123")
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
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

// Helper function to safely use Supabase with localStorage fallback
async function safeSupabaseCall<T>(
  operation: () => Promise<{ data: T; error: any }>,
  fallback: () => T,
  operationName: string,
): Promise<T> {
  // Use fallback if Supabase is not available or we're on server-side
  if (!isSupabaseAvailable || typeof window === "undefined" || !supabase) {
    console.log(`📦 Using localStorage fallback for ${operationName}`)
    return fallback()
  }

  try {
    console.log(`🔄 Attempting Supabase operation: ${operationName}`)
    const result = await operation()

    // Check if result is null or undefined
    if (!result) {
      console.warn(`⚠️ Supabase operation returned null: ${operationName}`)
      throw new Error("Operation returned null")
    }

    const { data, error } = result

    if (error) {
      console.error(`❌ Supabase operation failed: ${operationName}`, error.message)
      throw error
    }

    console.log(`✅ Supabase operation successful: ${operationName}`)
    return data
  } catch (error) {
    console.error(`❌ Supabase operation failed: ${operationName}`, error)
    console.log(`📦 Falling back to localStorage for ${operationName}`)
    return fallback()
  }
}

// User functions - Updated to explicitly handle all columns including is_pro
export async function createUser(
  userData: Omit<User, "id" | "created_at" | "updated_at"> & { password: string },
): Promise<User> {
  const userId = generateId()
  const now = new Date().toISOString()

  // Create user object with all required fields explicitly
  const newUser: User = {
    id: userId,
    name: userData.name,
    email: userData.email,
    auth_id: undefined,
    language: userData.language,
    theme: userData.theme,
    is_premium: userData.is_premium,
    is_pro: userData.is_pro || false, // Add is_pro field
    premium_expiry: userData.premium_expiry,
    onboarding_completed: userData.onboarding_completed,
    pomodoro_sessions: userData.pomodoro_sessions,
    work_duration: userData.work_duration,
    short_break_duration: userData.short_break_duration,
    long_break_duration: userData.long_break_duration,
    sessions_until_long_break: userData.sessions_until_long_break,
    created_at: now,
    updated_at: now,
  }

  const credentials: UserCredentials = {
    id: generateId(),
    user_id: userId,
    email: userData.email,
    password_hash: hashPassword(userData.password),
    created_at: now,
    updated_at: now,
  }

  return safeSupabaseCall(
    async () => {
      // Insert user with explicit column specification
      const userInsert = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        auth_id: newUser.auth_id,
        language: newUser.language,
        theme: newUser.theme,
        is_premium: newUser.is_premium,
        is_pro: newUser.is_pro,
        premium_expiry: newUser.premium_expiry,
        onboarding_completed: newUser.onboarding_completed,
        pomodoro_sessions: newUser.pomodoro_sessions,
        work_duration: newUser.work_duration,
        short_break_duration: newUser.short_break_duration,
        long_break_duration: newUser.long_break_duration,
        sessions_until_long_break: newUser.sessions_until_long_break,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      }

      const userResult = await supabase!.from("users").insert([userInsert]).select().single()
      if (userResult.error) throw userResult.error

      // Insert credentials
      const credInsert = {
        id: credentials.id,
        user_id: credentials.user_id,
        email: credentials.email,
        password_hash: credentials.password_hash,
        created_at: credentials.created_at,
        updated_at: credentials.updated_at,
      }

      const credResult = await supabase!.from("user_credentials").insert([credInsert])
      if (credResult.error) throw credResult.error

      return { data: userResult.data, error: null }
    },
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      const userCredentials = JSON.parse(safeLocalStorage.getItem("futureTask_user_credentials") || "[]")

      // Check if user already exists
      const existingUser = users.find((u: User) => u.email === userData.email)
      if (existingUser) {
        throw new Error("User already exists")
      }

      users.push(newUser)
      userCredentials.push(credentials)

      safeLocalStorage.setItem("futureTask_users", JSON.stringify(users))
      safeLocalStorage.setItem("futureTask_user_credentials", JSON.stringify(userCredentials))

      return newUser
    },
    "createUser",
  )
}

export async function getUserByEmail(email: string, password: string): Promise<User | null> {
  return safeSupabaseCall(
    async () => {
      // First get credentials
      const credResult = await supabase!.from("user_credentials").select("*").eq("email", email).single()

      if (credResult.error || !credResult.data) {
        return { data: null, error: null }
      }

      // Verify password
      if (!verifyPassword(password, credResult.data.password_hash)) {
        return { data: null, error: null }
      }

      // Get user data
      const userResult = await supabase!.from("users").select("*").eq("id", credResult.data.user_id).single()

      if (userResult.error) {
        return { data: null, error: null }
      }

      return { data: userResult.data, error: null }
    },
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      const userCredentials = JSON.parse(safeLocalStorage.getItem("futureTask_user_credentials") || "[]")

      const credentials = userCredentials.find((c: UserCredentials) => c.email === email)
      if (!credentials || !verifyPassword(password, credentials.password_hash)) {
        return null
      }

      return users.find((u: User) => u.id === credentials.user_id) || null
    },
    "getUserByEmail",
  )
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("users").update(updatesWithTimestamp).eq("id", userId).select().single()

      if (result.error) throw result.error

      // También actualizar localStorage para sincronización inmediata
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      const userIndex = users.findIndex((u: User) => u.id === userId)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatesWithTimestamp }
        safeLocalStorage.setItem("futureTask_users", JSON.stringify(users))
      }

      return { data: result.data, error: null }
    },
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      const userIndex = users.findIndex((u: User) => u.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      users[userIndex] = { ...users[userIndex], ...updatesWithTimestamp }
      safeLocalStorage.setItem("futureTask_users", JSON.stringify(users))
      return users[userIndex]
    },
    "updateUser",
  )
}

// Task functions
export async function getUserTasks(userId: string): Promise<Task[]> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      return { data: result.data || [], error: result.error }
    },
    () => {
      // Fallback to localStorage
      const tasks = JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${userId}`) || "[]")
      return tasks
    },
    "getUserTasks",
  )
}

export async function createTask(taskData: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const now = new Date().toISOString()
  const newTask: Task = {
    ...taskData,
    id: generateId(),
    created_at: now,
    updated_at: now,
  }

  return safeSupabaseCall(
    async () => {
      // Insert with explicit column specification
      const taskInsert = {
        id: newTask.id,
        user_id: newTask.user_id,
        text: newTask.text,
        description: newTask.description,
        completed: newTask.completed,
        date: newTask.date,
        time: newTask.time,
        category: newTask.category,
        priority: newTask.priority,
        completed_at: newTask.completed_at,
        notification_enabled: newTask.notification_enabled,
        created_at: newTask.created_at,
        updated_at: newTask.updated_at,
      }

      const result = await supabase!.from("tasks").insert([taskInsert]).select().single()
      return { data: result.data, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const tasks = JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${taskData.user_id}`) || "[]")
      tasks.push(newTask)
      safeLocalStorage.setItem(`futureTask_tasks_${taskData.user_id}`, JSON.stringify(tasks))
      return newTask
    },
    "createTask",
  )
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("tasks").update(updatesWithTimestamp).eq("id", taskId).select().single()
      return { data: result.data, error: result.error }
    },
    () => {
      // Fallback to localStorage - need to find task across all users
      const allUsers = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      for (const user of allUsers) {
        const tasks = JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${user.id}`) || "[]")
        const taskIndex = tasks.findIndex((t: Task) => t.id === taskId)

        if (taskIndex !== -1) {
          tasks[taskIndex] = { ...tasks[taskIndex], ...updatesWithTimestamp }
          safeLocalStorage.setItem(`futureTask_tasks_${user.id}`, JSON.stringify(tasks))
          return tasks[taskIndex]
        }
      }

      throw new Error("Task not found")
    },
    "updateTask",
  )
}

export async function deleteTask(taskId: string): Promise<void> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("tasks").delete().eq("id", taskId)
      return { data: undefined, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const allUsers = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      for (const user of allUsers) {
        const tasks = JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${user.id}`) || "[]")
        const filteredTasks = tasks.filter((t: Task) => t.id !== taskId)

        if (filteredTasks.length !== tasks.length) {
          safeLocalStorage.setItem(`futureTask_tasks_${user.id}`, JSON.stringify(filteredTasks))
          return
        }
      }
    },
    "deleteTask",
  )
}

// Wishlist functions
export async function getUserWishlist(userId: string): Promise<WishlistItem[]> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      return { data: result.data || [], error: result.error }
    },
    () => {
      // Fallback to localStorage
      const wishlist = JSON.parse(safeLocalStorage.getItem(`futureTask_wishlist_${userId}`) || "[]")
      return wishlist
    },
    "getUserWishlist",
  )
}

export async function createWishlistItem(
  itemData: Omit<WishlistItem, "id" | "created_at" | "updated_at">,
): Promise<WishlistItem> {
  const now = new Date().toISOString()
  const newItem: WishlistItem = {
    ...itemData,
    id: generateId(),
    created_at: now,
    updated_at: now,
  }

  return safeSupabaseCall(
    async () => {
      const itemInsert = {
        id: newItem.id,
        user_id: newItem.user_id,
        text: newItem.text,
        description: newItem.description,
        completed: newItem.completed,
        created_at: newItem.created_at,
        updated_at: newItem.updated_at,
      }

      const result = await supabase!.from("wishlist_items").insert([itemInsert]).select().single()
      return { data: result.data, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const wishlist = JSON.parse(safeLocalStorage.getItem(`futureTask_wishlist_${itemData.user_id}`) || "[]")
      wishlist.push(newItem)
      safeLocalStorage.setItem(`futureTask_wishlist_${itemData.user_id}`, JSON.stringify(wishlist))
      return newItem
    },
    "createWishlistItem",
  )
}

export async function updateWishlistItem(itemId: string, updates: Partial<WishlistItem>): Promise<WishlistItem> {
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    async () => {
      const result = await supabase!
        .from("wishlist_items")
        .update(updatesWithTimestamp)
        .eq("id", itemId)
        .select()
        .single()
      return { data: result.data, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const allUsers = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      for (const user of allUsers) {
        const wishlist = JSON.parse(safeLocalStorage.getItem(`futureTask_wishlist_${user.id}`) || "[]")
        const itemIndex = wishlist.findIndex((item: WishlistItem) => item.id === itemId)

        if (itemIndex !== -1) {
          wishlist[itemIndex] = { ...wishlist[itemIndex], ...updatesWithTimestamp }
          safeLocalStorage.setItem(`futureTask_wishlist_${user.id}`, JSON.stringify(wishlist))
          return wishlist[itemIndex]
        }
      }

      throw new Error("Wishlist item not found")
    },
    "updateWishlistItem",
  )
}

export async function deleteWishlistItem(itemId: string): Promise<void> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("wishlist_items").delete().eq("id", itemId)
      return { data: undefined, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const allUsers = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      for (const user of allUsers) {
        const wishlist = JSON.parse(safeLocalStorage.getItem(`futureTask_wishlist_${user.id}`) || "[]")
        const filteredWishlist = wishlist.filter((item: WishlistItem) => item.id !== itemId)

        if (filteredWishlist.length !== wishlist.length) {
          safeLocalStorage.setItem(`futureTask_wishlist_${user.id}`, JSON.stringify(filteredWishlist))
          return
        }
      }
    },
    "deleteWishlistItem",
  )
}

// Notes functions
export async function getUserNotes(userId: string): Promise<Note[]> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      return { data: result.data || [], error: result.error }
    },
    () => {
      // Fallback to localStorage
      const notes = JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${userId}`) || "[]")
      return notes
    },
    "getUserNotes",
  )
}

export async function createNote(noteData: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  const now = new Date().toISOString()
  const newNote: Note = {
    ...noteData,
    id: generateId(),
    created_at: now,
    updated_at: now,
  }

  return safeSupabaseCall(
    async () => {
      const noteInsert = {
        id: newNote.id,
        user_id: newNote.user_id,
        title: newNote.title,
        content: newNote.content,
        created_at: newNote.created_at,
        updated_at: newNote.updated_at,
      }

      const result = await supabase!.from("notes").insert([noteInsert]).select().single()
      return { data: result.data, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const notes = JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${noteData.user_id}`) || "[]")
      notes.push(newNote)
      safeLocalStorage.setItem(`futureTask_notes_${noteData.user_id}`, JSON.stringify(notes))
      return newNote
    },
    "createNote",
  )
}

export async function updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
  const updatesWithTimestamp = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("notes").update(updatesWithTimestamp).eq("id", noteId).select().single()
      return { data: result.data, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const allUsers = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      for (const user of allUsers) {
        const notes = JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${user.id}`) || "[]")
        const noteIndex = notes.findIndex((note: Note) => note.id === noteId)

        if (noteIndex !== -1) {
          notes[noteIndex] = { ...notes[noteIndex], ...updatesWithTimestamp }
          safeLocalStorage.setItem(`futureTask_notes_${user.id}`, JSON.stringify(notes))
          return notes[noteIndex]
        }
      }

      throw new Error("Note not found")
    },
    "updateNote",
  )
}

export async function deleteNote(noteId: string): Promise<void> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("notes").delete().eq("id", noteId)
      return { data: undefined, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const allUsers = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      for (const user of allUsers) {
        const notes = JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${user.id}`) || "[]")
        const filteredNotes = notes.filter((note: Note) => note.id !== noteId)

        if (filteredNotes.length !== notes.length) {
          safeLocalStorage.setItem(`futureTask_notes_${user.id}`, JSON.stringify(filteredNotes))
          return
        }
      }
    },
    "deleteNote",
  )
}

// Migration function
export async function migrateLocalStorageToSupabase(userId: string): Promise<boolean> {
  if (!isSupabaseAvailable || !supabase) {
    return false
  }

  try {
    // Migrate tasks
    const localTasks = JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${userId}`) || "[]")
    if (localTasks.length > 0) {
      const { error: tasksError } = await supabase.from("tasks").insert(localTasks)

      if (tasksError) throw tasksError
      safeLocalStorage.removeItem(`futureTask_tasks_${userId}`)
    }

    // Migrate wishlist
    const localWishlist = JSON.parse(safeLocalStorage.getItem(`futureTask_wishlist_${userId}`) || "[]")
    if (localWishlist.length > 0) {
      const { error: wishlistError } = await supabase.from("wishlist_items").insert(localWishlist)

      if (wishlistError) throw wishlistError
      safeLocalStorage.removeItem(`futureTask_wishlist_${userId}`)
    }

    // Migrate notes
    const localNotes = JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${userId}`) || "[]")
    if (localNotes.length > 0) {
      const { error: notesError } = await supabase.from("notes").insert(localNotes)

      if (notesError) throw notesError
      safeLocalStorage.removeItem(`futureTask_notes_${userId}`)
    }

    return true
  } catch (error) {
    console.error("Migration error:", error)
    return false
  }
}

// Admin functions - Get all users
export async function getAllUsers(): Promise<User[]> {
  return safeSupabaseCall(
    async () => {
      const result = await supabase!.from("users").select("*").order("created_at", { ascending: false })
      return { data: result.data || [], error: result.error }
    },
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      return users
    },
    "getAllUsers",
  )
}

// Admin functions - Delete user
export async function deleteUser(userId: string): Promise<void> {
  return safeSupabaseCall(
    async () => {
      // First delete all related data
      await Promise.all([
        supabase!.from("tasks").delete().eq("user_id", userId),
        supabase!.from("wishlist_items").delete().eq("user_id", userId),
        supabase!.from("notes").delete().eq("user_id", userId),
        supabase!.from("achievements").delete().eq("user_id", userId),
        supabase!.from("user_credentials").delete().eq("user_id", userId),
      ])

      // Then delete the user
      const result = await supabase!.from("users").delete().eq("id", userId)
      return { data: undefined, error: result.error }
    },
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      const userCredentials = JSON.parse(safeLocalStorage.getItem("futureTask_user_credentials") || "[]")

      const filteredUsers = users.filter((u: User) => u.id !== userId)
      const filteredCredentials = userCredentials.filter((c: UserCredentials) => c.user_id !== userId)

      safeLocalStorage.setItem("futureTask_users", JSON.stringify(filteredUsers))
      safeLocalStorage.setItem("futureTask_user_credentials", JSON.stringify(filteredCredentials))

      // Also remove user's data from localStorage
      safeLocalStorage.removeItem(`futureTask_tasks_${userId}`)
      safeLocalStorage.removeItem(`futureTask_wishlist_${userId}`)
      safeLocalStorage.removeItem(`futureTask_notes_${userId}`)

      return undefined
    },
    "deleteUser",
  )
}

// Initialize admin user - Simplified to avoid schema issues
export async function initializeAdminUser(): Promise<void> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Initializing admin user...")
    }

    // Check if admin user already exists
    const existingAdmin = await getUserByEmail("admin", "535353-Jrl")

    if (!existingAdmin) {
      if (process.env.NODE_ENV === "development") {
        console.log("👤 Creating admin user...")
      }

      // Create admin user with Pro access
      await createUser({
        name: "Administrator",
        email: "admin",
        password: "535353-Jrl",
        language: "es",
        theme: "default",
        is_premium: true,
        is_pro: true, // Admin gets Pro access
        premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        onboarding_completed: true,
        pomodoro_sessions: 0,
        work_duration: 25,
        short_break_duration: 5,
        long_break_duration: 15,
        sessions_until_long_break: 4,
      })

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Admin user created successfully with Pro access")
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Admin user already exists")
      }
    }
  } catch (error) {
    // Don't throw the error, just log it so the app can continue
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Error initializing admin user:", error)
      console.log("📦 App will continue with localStorage fallback")
    }
  }
}
