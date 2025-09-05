import { supabase, isSupabaseAvailable } from "./supabase"
import type { User, Task, WishlistItem, Note } from "./supabase"

// Helper function to generate UUID
function generateId(): string {
  return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
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
    const { data, error } = await operation()
    if (error) throw error
    console.log(`✅ Supabase operation successful: ${operationName}`)
    return data
  } catch (error) {
    console.error(`❌ Supabase operation failed: ${operationName}`, error)
    console.log(`📦 Falling back to localStorage for ${operationName}`)
    return fallback()
  }
}

// User functions
export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  const newUser: User = {
    ...userData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    () => supabase!.from("users").insert([newUser]).select().single(),
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")

      // Check if user already exists
      const existingUser = users.find((u: User) => u.email === userData.email)
      if (existingUser) {
        throw new Error("User already exists")
      }

      users.push(newUser)
      safeLocalStorage.setItem("futureTask_users", JSON.stringify(users))
      return newUser
    },
    "createUser",
  )
}

export async function getUserByEmail(email: string, password: string): Promise<User | null> {
  return safeSupabaseCall(
    () => supabase!.from("users").select("*").eq("email", email).eq("password", password).single(),
    () => {
      // Fallback to localStorage
      const users = JSON.parse(safeLocalStorage.getItem("futureTask_users") || "[]")
      return users.find((u: User) => u.email === email && u.password === password) || null
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
    () => supabase!.from("users").update(updatesWithTimestamp).eq("id", userId).select().single(),
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
    () => supabase!.from("tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    () => {
      // Fallback to localStorage
      const tasks = JSON.parse(safeLocalStorage.getItem(`futureTask_tasks_${userId}`) || "[]")
      return tasks
    },
    "getUserTasks",
  )
}

export async function createTask(taskData: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const newTask: Task = {
    ...taskData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    () => supabase!.from("tasks").insert([newTask]).select().single(),
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
    () => supabase!.from("tasks").update(updatesWithTimestamp).eq("id", taskId).select().single(),
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
    () => supabase!.from("tasks").delete().eq("id", taskId),
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
    () => supabase!.from("wishlist_items").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
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
  const newItem: WishlistItem = {
    ...itemData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    () => supabase!.from("wishlist_items").insert([newItem]).select().single(),
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
    () => supabase!.from("wishlist_items").update(updatesWithTimestamp).eq("id", itemId).select().single(),
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
    () => supabase!.from("wishlist_items").delete().eq("id", itemId),
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
    () => supabase!.from("notes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    () => {
      // Fallback to localStorage
      const notes = JSON.parse(safeLocalStorage.getItem(`futureTask_notes_${userId}`) || "[]")
      return notes
    },
    "getUserNotes",
  )
}

export async function createNote(noteData: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  const newNote: Note = {
    ...noteData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return safeSupabaseCall(
    () => supabase!.from("notes").insert([newNote]).select().single(),
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
    () => supabase!.from("notes").update(updatesWithTimestamp).eq("id", noteId).select().single(),
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
    () => supabase!.from("notes").delete().eq("id", noteId),
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

// Initialize admin user
export async function initializeAdminUser(): Promise<void> {
  try {
    // Check if admin user already exists
    const existingAdmin = await getUserByEmail("admin", "535353-Jrl")

    if (!existingAdmin) {
      // Create admin user
      await createUser({
        name: "Administrator",
        email: "admin",
        password: "535353-Jrl",
        language: "es",
        theme: "default",
        is_premium: true,
        premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        onboarding_completed: true,
        pomodoro_sessions: 0,
        work_duration: 25,
        short_break_duration: 5,
        long_break_duration: 15,
        sessions_until_long_break: 4,
      })
      console.log("✅ Admin user created successfully")
    } else {
      console.log("✅ Admin user already exists")
    }
  } catch (error) {
    console.error("❌ Error initializing admin user:", error)
  }
}
