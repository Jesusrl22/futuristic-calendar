import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  name: string
  subscription_tier: "free" | "premium" | "pro"
  subscription_status?: string
  subscription_end_date?: string
  theme?: string
  language?: string
  ai_credits?: number
  ai_credits_used?: number
  pomodoro_work_time?: number
  pomodoro_break_time?: number
  pomodoro_long_break_time?: number
  pomodoro_sessions_until_long_break?: number
  enable_notifications?: boolean
  notification_sound?: boolean
  compact_mode?: boolean
  font_size?: string
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  due_date?: string
  created_at: string
  updated_at?: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  color?: string
  created_at: string
  updated_at?: string
}

export interface WishlistItem {
  id: string
  user_id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  completed: boolean
  created_at: string
  updated_at?: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  duration: number
  completed: boolean
  created_at: string
}

class HybridDatabase {
  private isSupabaseAvailable = false

  constructor() {
    this.checkSupabaseConnection()
  }

  private async checkSupabaseConnection() {
    try {
      const { data, error } = await supabase.from("users").select("id").limit(1)
      this.isSupabaseAvailable = !error
    } catch (error) {
      console.warn("Supabase not available, using localStorage fallback")
      this.isSupabaseAvailable = false
    }
  }

  private generateUUID(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // USER METHODS
  async getUser(userId: string): Promise<User | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

        if (error) throw error
        return data as User
      }

      const localData = localStorage.getItem(`user_${userId}`)
      return localData ? JSON.parse(localData) : null
    } catch (error) {
      console.error("Error getting user:", error)
      const localData = localStorage.getItem(`user_${userId}`)
      return localData ? JSON.parse(localData) : null
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      // Columnas básicas que sabemos que existen en Supabase
      const basicColumns = ["theme", "language", "name", "email"]
      const supabaseUpdates: any = {}
      const extendedUpdates: any = {}

      // Separar actualizaciones básicas de extendidas
      Object.keys(updates).forEach((key) => {
        if (basicColumns.includes(key)) {
          supabaseUpdates[key] = updates[key as keyof User]
        } else {
          extendedUpdates[key] = updates[key as keyof User]
        }
      })

      if (this.isSupabaseAvailable && Object.keys(supabaseUpdates).length > 0) {
        const { data, error } = await supabase.from("users").update(supabaseUpdates).eq("id", userId).select().single()

        if (error) {
          console.warn("Supabase update failed, using localStorage:", error.message)
        }
      }

      // Guardar ajustes extendidos en localStorage
      if (Object.keys(extendedUpdates).length > 0) {
        const currentSettings = localStorage.getItem(`user_settings_${userId}`)
        const settings = currentSettings ? JSON.parse(currentSettings) : {}
        const updatedSettings = { ...settings, ...extendedUpdates }
        localStorage.setItem(`user_settings_${userId}`, JSON.stringify(updatedSettings))
      }

      // Actualizar cache local completo
      const currentUser = await this.getUser(userId)
      const updatedUser = { ...currentUser, ...updates } as User
      localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser))

      return updatedUser
    } catch (error) {
      console.error("Error updating user:", error)

      // Fallback completo a localStorage
      const currentUser = await this.getUser(userId)
      const updatedUser = { ...currentUser, ...updates } as User
      localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser))
      return updatedUser
    }
  }

  // TASK METHODS
  async getTasks(userId: string): Promise<Task[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as Task[]
      }

      const localData = localStorage.getItem(`tasks_${userId}`)
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error("Error getting tasks:", error)
      const localData = localStorage.getItem(`tasks_${userId}`)
      return localData ? JSON.parse(localData) : []
    }
  }

  async createTask(
    userId: string,
    title: string,
    description?: string,
    priority: "low" | "medium" | "high" = "medium",
    dueDate?: string,
  ): Promise<Task> {
    const newTask: Task = {
      id: this.generateUUID(),
      user_id: userId,
      title,
      description,
      completed: false,
      priority,
      due_date: dueDate,
      created_at: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("tasks").insert(newTask).select().single()

        if (error) throw error
        return data as Task
      }

      const tasks = await this.getTasks(userId)
      tasks.unshift(newTask)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
      return newTask
    } catch (error) {
      console.error("Error creating task:", error)
      const tasks = await this.getTasks(userId)
      tasks.unshift(newTask)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
      return newTask
    }
  }

  async updateTask(taskId: string, userId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()

        if (error) throw error
        return data as Task
      }

      const tasks = await this.getTasks(userId)
      const index = tasks.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates }
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
        return tasks[index]
      }
      return null
    } catch (error) {
      console.error("Error updating task:", error)
      const tasks = await this.getTasks(userId)
      const index = tasks.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates }
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
        return tasks[index]
      }
      return null
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await supabase.from("tasks").delete().eq("id", taskId)

        if (error) throw error
        return true
      }

      const tasks = await this.getTasks(userId)
      const filtered = tasks.filter((t) => t.id !== taskId)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Error deleting task:", error)
      const tasks = await this.getTasks(userId)
      const filtered = tasks.filter((t) => t.id !== taskId)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(filtered))
      return true
    }
  }

  // NOTE METHODS
  async getNotes(userId: string): Promise<Note[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as Note[]
      }

      const localData = localStorage.getItem(`notes_${userId}`)
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error("Error getting notes:", error)
      const localData = localStorage.getItem(`notes_${userId}`)
      return localData ? JSON.parse(localData) : []
    }
  }

  async createNote(userId: string, title: string, content: string, color?: string): Promise<Note> {
    const newNote: Note = {
      id: this.generateUUID(),
      user_id: userId,
      title,
      content,
      color,
      created_at: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("notes").insert(newNote).select().single()

        if (error) throw error
        return data as Note
      }

      const notes = await this.getNotes(userId)
      notes.unshift(newNote)
      localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
      return newNote
    } catch (error) {
      console.error("Error creating note:", error)
      const notes = await this.getNotes(userId)
      notes.unshift(newNote)
      localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
      return newNote
    }
  }

  async updateNote(noteId: string, userId: string, updates: Partial<Note>): Promise<Note | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("notes").update(updates).eq("id", noteId).select().single()

        if (error) throw error
        return data as Note
      }

      const notes = await this.getNotes(userId)
      const index = notes.findIndex((n) => n.id === noteId)
      if (index !== -1) {
        notes[index] = { ...notes[index], ...updates }
        localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
        return notes[index]
      }
      return null
    } catch (error) {
      console.error("Error updating note:", error)
      const notes = await this.getNotes(userId)
      const index = notes.findIndex((n) => n.id === noteId)
      if (index !== -1) {
        notes[index] = { ...notes[index], ...updates }
        localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
        return notes[index]
      }
      return null
    }
  }

  async deleteNote(noteId: string, userId: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await supabase.from("notes").delete().eq("id", noteId)

        if (error) throw error
        return true
      }

      const notes = await this.getNotes(userId)
      const filtered = notes.filter((n) => n.id !== noteId)
      localStorage.setItem(`notes_${userId}`, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Error deleting note:", error)
      const notes = await this.getNotes(userId)
      const filtered = notes.filter((n) => n.id !== noteId)
      localStorage.setItem(`notes_${userId}`, JSON.stringify(filtered))
      return true
    }
  }

  // WISHLIST METHODS
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase
          .from("wishlist_items")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as WishlistItem[]
      }

      const localData = localStorage.getItem(`wishlist_${userId}`)
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error("Error getting wishlist items:", error)
      const localData = localStorage.getItem(`wishlist_${userId}`)
      return localData ? JSON.parse(localData) : []
    }
  }

  async createWishlistItem(
    userId: string,
    title: string,
    description?: string,
    priority: "low" | "medium" | "high" = "medium",
  ): Promise<WishlistItem> {
    const newItem: WishlistItem = {
      id: this.generateUUID(),
      user_id: userId,
      title,
      description,
      priority,
      completed: false,
      created_at: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("wishlist_items").insert(newItem).select().single()

        if (error) throw error
        return data as WishlistItem
      }

      const items = await this.getWishlistItems(userId)
      items.unshift(newItem)
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items))
      return newItem
    } catch (error) {
      console.error("Error creating wishlist item:", error)
      const items = await this.getWishlistItems(userId)
      items.unshift(newItem)
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items))
      return newItem
    }
  }

  async updateWishlistItem(
    itemId: string,
    userId: string,
    updates: Partial<WishlistItem>,
  ): Promise<WishlistItem | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("wishlist_items").update(updates).eq("id", itemId).select().single()

        if (error) throw error
        return data as WishlistItem
      }

      const items = await this.getWishlistItems(userId)
      const index = items.findIndex((i) => i.id === itemId)
      if (index !== -1) {
        items[index] = { ...items[index], ...updates }
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items))
        return items[index]
      }
      return null
    } catch (error) {
      console.error("Error updating wishlist item:", error)
      const items = await this.getWishlistItems(userId)
      const index = items.findIndex((i) => i.id === itemId)
      if (index !== -1) {
        items[index] = { ...items[index], ...updates }
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(items))
        return items[index]
      }
      return null
    }
  }

  async deleteWishlistItem(itemId: string, userId: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

        if (error) throw error
        return true
      }

      const items = await this.getWishlistItems(userId)
      const filtered = items.filter((i) => i.id !== itemId)
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Error deleting wishlist item:", error)
      const items = await this.getWishlistItems(userId)
      const filtered = items.filter((i) => i.id !== itemId)
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(filtered))
      return true
    }
  }

  // POMODORO METHODS
  async getPomodoroSessions(userId: string): Promise<PomodoroSession[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase
          .from("pomodoro_sessions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as PomodoroSession[]
      }

      const localData = localStorage.getItem(`pomodoro_${userId}`)
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error("Error getting pomodoro sessions:", error)
      const localData = localStorage.getItem(`pomodoro_${userId}`)
      return localData ? JSON.parse(localData) : []
    }
  }

  async createPomodoroSession(userId: string, duration: number, completed: boolean): Promise<PomodoroSession> {
    const newSession: PomodoroSession = {
      id: this.generateUUID(),
      user_id: userId,
      duration,
      completed,
      created_at: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await supabase.from("pomodoro_sessions").insert(newSession).select().single()

        if (error) throw error
        return data as PomodoroSession
      }

      const sessions = await this.getPomodoroSessions(userId)
      sessions.unshift(newSession)
      localStorage.setItem(`pomodoro_${userId}`, JSON.stringify(sessions))
      return newSession
    } catch (error) {
      console.error("Error creating pomodoro session:", error)
      const sessions = await this.getPomodoroSessions(userId)
      sessions.unshift(newSession)
      localStorage.setItem(`pomodoro_${userId}`, JSON.stringify(sessions))
      return newSession
    }
  }
}

// Crear instancia única
const hybridDb = new HybridDatabase()

// Exportar tanto como db como hybridDb para compatibilidad
export const db = hybridDb
export { hybridDb }
export default hybridDb
