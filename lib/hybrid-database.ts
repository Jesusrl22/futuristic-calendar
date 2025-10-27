import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  name?: string
  theme?: string
  language?: string
  subscription_tier?: string
  ai_credits?: number
  [key: string]: any
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category?: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at?: string
  updated_at?: string
}

export interface WishlistItem {
  id: string
  user_id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  created_at?: string
  updated_at?: string
}

// Browser-compatible UUID generation
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback UUID generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

class HybridDatabase {
  private isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    return !!(url && key && url !== "your-supabase-url" && key !== "your-supabase-anon-key")
  }

  // Task Methods
  async getTasks(userId: string): Promise<Task[]> {
    if (!userId || userId === "undefined") {
      console.error("Invalid userId in getTasks:", userId)
      return []
    }

    try {
      if (!this.isSupabaseConfigured()) {
        return this.getTasksFromLocalStorage(userId)
      }

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.getTasksFromLocalStorage(userId)
      }

      return data || []
    } catch (error) {
      console.error("Error getting tasks:", error)
      return this.getTasksFromLocalStorage(userId)
    }
  }

  private getTasksFromLocalStorage(userId: string): Task[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(`tasks_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return []
    }
  }

  async createTask(
    userId: string,
    task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">,
  ): Promise<Task | null> {
    if (!userId || userId === "undefined") {
      console.error("Invalid userId in createTask:", userId)
      return null
    }

    try {
      const taskWithUserId = {
        ...task,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (!this.isSupabaseConfigured()) {
        return this.createTaskInLocalStorage(userId, task)
      }

      const { data, error } = await supabase.from("tasks").insert([taskWithUserId]).select().single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.createTaskInLocalStorage(userId, task)
      }

      return data
    } catch (error) {
      console.error("Error creating task:", error)
      return this.createTaskInLocalStorage(userId, task)
    }
  }

  private createTaskInLocalStorage(
    userId: string,
    task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">,
  ): Task {
    const newTask: Task = {
      ...task,
      id: generateUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const tasks = this.getTasksFromLocalStorage(userId)
    tasks.push(newTask)
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
    return newTask
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    if (!taskId) {
      console.error("Invalid taskId in updateTask:", taskId)
      return null
    }

    try {
      if (!this.isSupabaseConfigured()) {
        return this.updateTaskInLocalStorage(taskId, updates)
      }

      const { data, error } = await supabase
        .from("tasks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .select()
        .single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.updateTaskInLocalStorage(taskId, updates)
      }

      return data
    } catch (error) {
      console.error("Error updating task:", error)
      return this.updateTaskInLocalStorage(taskId, updates)
    }
  }

  private updateTaskInLocalStorage(taskId: string, updates: Partial<Task>): Task | null {
    if (typeof window === "undefined") return null

    try {
      const allTasksKeys = Object.keys(localStorage).filter((key) => key.startsWith("tasks_"))

      for (const key of allTasksKeys) {
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
    } catch (error) {
      console.error("Error updating task in localStorage:", error)
    }

    return null
  }

  async deleteTask(taskId: string): Promise<boolean> {
    if (!taskId) {
      console.error("Invalid taskId in deleteTask:", taskId)
      return false
    }

    try {
      if (!this.isSupabaseConfigured()) {
        return this.deleteTaskFromLocalStorage(taskId)
      }

      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.deleteTaskFromLocalStorage(taskId)
      }

      return true
    } catch (error) {
      console.error("Error deleting task:", error)
      return this.deleteTaskFromLocalStorage(taskId)
    }
  }

  private deleteTaskFromLocalStorage(taskId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const allTasksKeys = Object.keys(localStorage).filter((key) => key.startsWith("tasks_"))

      for (const key of allTasksKeys) {
        const tasks = JSON.parse(localStorage.getItem(key) || "[]")
        const filteredTasks = tasks.filter((t: Task) => t.id !== taskId)

        if (filteredTasks.length !== tasks.length) {
          localStorage.setItem(key, JSON.stringify(filteredTasks))
          return true
        }
      }
    } catch (error) {
      console.error("Error deleting task from localStorage:", error)
    }

    return false
  }

  // User Methods
  async getUser(userId: string): Promise<User | null> {
    if (!userId || userId === "undefined") {
      console.error("Invalid userId in getUser:", userId)
      return null
    }

    try {
      if (!this.isSupabaseConfigured()) {
        return this.getUserFromLocalStorage(userId)
      }

      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.getUserFromLocalStorage(userId)
      }

      return data
    } catch (error) {
      console.error("Error getting user:", error)
      return this.getUserFromLocalStorage(userId)
    }
  }

  private getUserFromLocalStorage(userId: string): User | null {
    if (typeof window === "undefined") return null
    try {
      const stored = localStorage.getItem(`user_${userId}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error reading user from localStorage:", error)
      return null
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    if (!userId || userId === "undefined") {
      console.error("Invalid userId in updateUser:", userId)
      return null
    }

    try {
      console.log("Updating user:", userId, "with data:", updates)

      if (!this.isSupabaseConfigured()) {
        return this.updateUserInLocalStorage(userId, updates)
      }

      const validUpdates: any = {}

      const coreFields = ["theme", "language", "name", "email"]

      const extendedFields = [
        "work_duration",
        "short_break_duration",
        "long_break_duration",
        "sessions_until_long_break",
        "notifications_enabled",
        "sound_enabled",
        "volume",
        "font_size",
        "compact_mode",
      ]

      for (const field of coreFields) {
        if (updates[field] !== undefined) {
          validUpdates[field] = updates[field]
        }
      }

      for (const field of extendedFields) {
        if (updates[field] !== undefined) {
          validUpdates[field] = updates[field]
        }
      }

      validUpdates.updated_at = new Date().toISOString()

      console.log("Attempting to update with fields:", Object.keys(validUpdates))

      const { data, error } = await supabase.from("users").update(validUpdates).eq("id", userId).select().single()

      if (error) {
        console.error("Supabase error:", error)

        if (error.message.includes("column") && error.message.includes("does not exist")) {
          console.log("Some columns don't exist, trying with core fields only...")

          const coreUpdates: any = {
            updated_at: new Date().toISOString(),
          }

          for (const field of coreFields) {
            if (updates[field] !== undefined) {
              coreUpdates[field] = updates[field]
            }
          }

          const { data: coreData, error: coreError } = await supabase
            .from("users")
            .update(coreUpdates)
            .eq("id", userId)
            .select()
            .single()

          if (coreError) {
            console.error("Core update also failed, falling back to localStorage:", coreError)
            return this.updateUserInLocalStorage(userId, updates)
          }

          console.log("Core update succeeded, some settings were not saved")
          return coreData
        }

        console.error("Falling back to localStorage")
        return this.updateUserInLocalStorage(userId, updates)
      }

      console.log("User updated successfully in Supabase")
      return data
    } catch (error) {
      console.error("Error updating user:", error)
      return this.updateUserInLocalStorage(userId, updates)
    }
  }

  private updateUserInLocalStorage(userId: string, updates: Partial<User>): User | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(`user_${userId}`)
      const user = stored ? JSON.parse(stored) : { id: userId }

      const updatedUser = {
        ...user,
        ...updates,
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser))
      console.log("User updated in localStorage")
      return updatedUser
    } catch (error) {
      console.error("Error updating user in localStorage:", error)
      return null
    }
  }

  // Note Methods
  async getNotes(userId: string): Promise<Note[]> {
    if (!userId || userId === "undefined") {
      console.error("Invalid userId in getNotes:", userId)
      return []
    }

    try {
      if (!this.isSupabaseConfigured()) {
        return this.getNotesFromLocalStorage(userId)
      }

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.getNotesFromLocalStorage(userId)
      }

      return data || []
    } catch (error) {
      console.error("Error getting notes:", error)
      return this.getNotesFromLocalStorage(userId)
    }
  }

  private getNotesFromLocalStorage(userId: string): Note[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(`notes_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading notes from localStorage:", error)
      return []
    }
  }

  async createNote(note: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note | null> {
    try {
      const newNote = {
        ...note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (!this.isSupabaseConfigured()) {
        return this.createNoteInLocalStorage(newNote)
      }

      const { data, error } = await supabase.from("notes").insert([newNote]).select().single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.createNoteInLocalStorage(newNote)
      }

      return data
    } catch (error) {
      console.error("Error creating note:", error)
      return null
    }
  }

  private createNoteInLocalStorage(note: Omit<Note, "id">): Note {
    const newNote: Note = {
      ...note,
      id: generateUUID(),
    }

    const notes = this.getNotesFromLocalStorage(note.user_id)
    notes.push(newNote)
    localStorage.setItem(`notes_${note.user_id}`, JSON.stringify(notes))
    return newNote
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<Note | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      if (!this.isSupabaseConfigured()) {
        return this.updateNoteInLocalStorage(noteId, updateData)
      }

      const { data, error } = await supabase.from("notes").update(updateData).eq("id", noteId).select().single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.updateNoteInLocalStorage(noteId, updateData)
      }

      return data
    } catch (error) {
      console.error("Error updating note:", error)
      return null
    }
  }

  private updateNoteInLocalStorage(noteId: string, updates: Partial<Note>): Note | null {
    if (typeof window === "undefined") return null

    try {
      const allNotesKeys = Object.keys(localStorage).filter((key) => key.startsWith("notes_"))

      for (const key of allNotesKeys) {
        const notes = JSON.parse(localStorage.getItem(key) || "[]")
        const noteIndex = notes.findIndex((n: Note) => n.id === noteId)

        if (noteIndex !== -1) {
          notes[noteIndex] = {
            ...notes[noteIndex],
            ...updates,
          }
          localStorage.setItem(key, JSON.stringify(notes))
          return notes[noteIndex]
        }
      }
    } catch (error) {
      console.error("Error updating note in localStorage:", error)
    }

    return null
  }

  async deleteNote(noteId: string): Promise<boolean> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.deleteNoteFromLocalStorage(noteId)
      }

      const { error } = await supabase.from("notes").delete().eq("id", noteId)

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.deleteNoteFromLocalStorage(noteId)
      }

      return true
    } catch (error) {
      console.error("Error deleting note:", error)
      return false
    }
  }

  private deleteNoteFromLocalStorage(noteId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const allNotesKeys = Object.keys(localStorage).filter((key) => key.startsWith("notes_"))

      for (const key of allNotesKeys) {
        const notes = JSON.parse(localStorage.getItem(key) || "[]")
        const filteredNotes = notes.filter((n: Note) => n.id !== noteId)

        if (filteredNotes.length !== notes.length) {
          localStorage.setItem(key, JSON.stringify(filteredNotes))
          return true
        }
      }
    } catch (error) {
      console.error("Error deleting note from localStorage:", error)
    }

    return false
  }

  // Wishlist Methods - FIXED: Changed table name from 'wishlist' to 'wishlist_items'
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    if (!userId || userId === "undefined") {
      console.error("Invalid userId in getWishlistItems:", userId)
      return []
    }

    try {
      if (!this.isSupabaseConfigured()) {
        return this.getWishlistFromLocalStorage(userId)
      }

      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.getWishlistFromLocalStorage(userId)
      }

      return data || []
    } catch (error) {
      console.error("Error getting wishlist items:", error)
      return this.getWishlistFromLocalStorage(userId)
    }
  }

  private getWishlistFromLocalStorage(userId: string): WishlistItem[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(`wishlist_${userId}`)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading wishlist from localStorage:", error)
      return []
    }
  }

  async createWishlistItem(item: Omit<WishlistItem, "id" | "created_at" | "updated_at">): Promise<WishlistItem | null> {
    try {
      const newItem = {
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (!this.isSupabaseConfigured()) {
        return this.createWishlistItemInLocalStorage(newItem)
      }

      const { data, error } = await supabase.from("wishlist_items").insert([newItem]).select().single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.createWishlistItemInLocalStorage(newItem)
      }

      return data
    } catch (error) {
      console.error("Error creating wishlist item:", error)
      return null
    }
  }

  private createWishlistItemInLocalStorage(item: Omit<WishlistItem, "id">): WishlistItem {
    const newItem: WishlistItem = {
      ...item,
      id: generateUUID(),
    }

    const items = this.getWishlistFromLocalStorage(item.user_id)
    items.push(newItem)
    localStorage.setItem(`wishlist_${item.user_id}`, JSON.stringify(items))
    return newItem
  }

  async updateWishlistItem(itemId: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      if (!this.isSupabaseConfigured()) {
        return this.updateWishlistItemInLocalStorage(itemId, updateData)
      }

      const { data, error } = await supabase
        .from("wishlist_items")
        .update(updateData)
        .eq("id", itemId)
        .select()
        .single()

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.updateWishlistItemInLocalStorage(itemId, updateData)
      }

      return data
    } catch (error) {
      console.error("Error updating wishlist item:", error)
      return null
    }
  }

  private updateWishlistItemInLocalStorage(itemId: string, updates: Partial<WishlistItem>): WishlistItem | null {
    if (typeof window === "undefined") return null

    try {
      const allWishlistKeys = Object.keys(localStorage).filter((key) => key.startsWith("wishlist_"))

      for (const key of allWishlistKeys) {
        const items = JSON.parse(localStorage.getItem(key) || "[]")
        const itemIndex = items.findIndex((i: WishlistItem) => i.id === itemId)

        if (itemIndex !== -1) {
          items[itemIndex] = {
            ...items[itemIndex],
            ...updates,
          }
          localStorage.setItem(key, JSON.stringify(items))
          return items[itemIndex]
        }
      }
    } catch (error) {
      console.error("Error updating wishlist item in localStorage:", error)
    }

    return null
  }

  async deleteWishlistItem(itemId: string): Promise<boolean> {
    try {
      if (!this.isSupabaseConfigured()) {
        return this.deleteWishlistItemFromLocalStorage(itemId)
      }

      const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

      if (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        return this.deleteWishlistItemFromLocalStorage(itemId)
      }

      return true
    } catch (error) {
      console.error("Error deleting wishlist item:", error)
      return false
    }
  }

  private deleteWishlistItemFromLocalStorage(itemId: string): boolean {
    if (typeof window === "undefined") return false

    try {
      const allWishlistKeys = Object.keys(localStorage).filter((key) => key.startsWith("wishlist_"))

      for (const key of allWishlistKeys) {
        const items = JSON.parse(localStorage.getItem(key) || "[]")
        const filteredItems = items.filter((i: WishlistItem) => i.id !== itemId)

        if (filteredItems.length !== items.length) {
          localStorage.setItem(key, JSON.stringify(filteredItems))
          return true
        }
      }
    } catch (error) {
      console.error("Error deleting wishlist item from localStorage:", error)
    }

    return false
  }
}

export const hybridDb = new HybridDatabase()
export const db = hybridDb
export default hybridDb
