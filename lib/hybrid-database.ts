"use client"

import { createClient } from "@supabase/supabase-js"

// Types
export interface User {
  id: string
  email: string
  password: string
  name: string
  plan: "free" | "premium" | "pro"
  isAdmin: boolean
  settings: {
    theme: string
    notifications: boolean
    language: string
    pomodoroTime: number
    shortBreakTime: number
    longBreakTime: number
  }
  stats: {
    tasksCompleted: number
    notesCreated: number
    wishlistItems: number
    achievementsUnlocked: number
    totalSessions: number
    streakDays: number
  }
  achievements: string[]
  aiCredits: number
  createdAt?: string
  updatedAt?: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: string | null
  category: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface WishlistItem {
  id: string
  userId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  estimatedCost: number
  category: string
  achieved: boolean
  createdAt: string
  updatedAt: string
}

// Database class
class HybridDatabase {
  private supabase: any = null
  private isSupabaseAvailable = false

  constructor() {
    this.initializeSupabase()
    this.initializeLocalData()
  }

  private initializeSupabase() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Validate Supabase configuration
      if (supabaseUrl && supabaseKey && this.isValidUrl(supabaseUrl)) {
        this.supabase = createClient(supabaseUrl, supabaseKey)
        this.isSupabaseAvailable = true
        console.log("✅ Supabase initialized successfully")
      } else {
        console.log("⚠️ Supabase not configured, using localStorage only")
        this.isSupabaseAvailable = false
      }
    } catch (error) {
      console.warn("⚠️ Supabase initialization failed, falling back to localStorage:", error)
      this.isSupabaseAvailable = false
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  private initializeLocalData() {
    if (typeof window === "undefined") return

    // Initialize with demo users if no users exist
    const existingUsers = this.getLocalData("users")
    if (!existingUsers || existingUsers.length === 0) {
      const demoUsers: User[] = [
        {
          id: "admin-1",
          email: "admin@futuretask.com",
          password: "admin123",
          name: "Admin User",
          plan: "pro",
          isAdmin: true,
          settings: {
            theme: "system",
            notifications: true,
            language: "es",
            pomodoroTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
          },
          stats: {
            tasksCompleted: 150,
            notesCreated: 75,
            wishlistItems: 25,
            achievementsUnlocked: 15,
            totalSessions: 200,
            streakDays: 30,
          },
          achievements: ["first_task", "task_master", "note_taker", "wishlist_creator", "streak_week"],
          aiCredits: 1000,
        },
        {
          id: "premium-1",
          email: "premium@futuretask.com",
          password: "premium123",
          name: "Premium User",
          plan: "premium",
          isAdmin: false,
          settings: {
            theme: "dark",
            notifications: true,
            language: "es",
            pomodoroTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
          },
          stats: {
            tasksCompleted: 50,
            notesCreated: 25,
            wishlistItems: 10,
            achievementsUnlocked: 8,
            totalSessions: 75,
            streakDays: 7,
          },
          achievements: ["first_task", "note_taker", "wishlist_creator"],
          aiCredits: 0,
        },
        {
          id: "demo-1",
          email: "demo@futuretask.com",
          password: "demo123",
          name: "Demo User",
          plan: "free",
          isAdmin: false,
          settings: {
            theme: "light",
            notifications: true,
            language: "es",
            pomodoroTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
          },
          stats: {
            tasksCompleted: 10,
            notesCreated: 5,
            wishlistItems: 0,
            achievementsUnlocked: 2,
            totalSessions: 15,
            streakDays: 3,
          },
          achievements: ["first_task"],
          aiCredits: 0,
        },
      ]

      this.setLocalData("users", demoUsers)
    }
  }

  getConnectionStatus(): boolean {
    return this.isSupabaseAvailable
  }

  private getLocalData(key: string): any[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(`futuretask_${key}`)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private setLocalData(key: string, data: any[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(`futuretask_${key}`, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    return this.getUserById(id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("users").select("*").eq("email", email).single()

        if (!error && data) return data
      }
    } catch (error) {
      console.warn("Supabase query failed, using localStorage:", error)
    }

    const users = this.getLocalData("users")
    return users.find((user: User) => user.email === email) || null
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("users").select("*").eq("id", id).single()

        if (!error && data) return data
      }
    } catch (error) {
      console.warn("Supabase query failed, using localStorage:", error)
    }

    const users = this.getLocalData("users")
    return users.find((user: User) => user.id === id) || null
  }

  async getAllUsers(): Promise<User[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("users").select("*").order("createdAt", { ascending: false })

        if (!error && data) return data
      }
    } catch (error) {
      console.warn("Supabase query failed, using localStorage:", error)
    }

    return this.getLocalData("users")
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("users").insert([user]).select().single()

        if (!error && data) {
          // Also save to localStorage as backup
          const users = this.getLocalData("users")
          users.push(user)
          this.setLocalData("users", users)
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase insert failed, using localStorage:", error)
    }

    // Fallback to localStorage
    const users = this.getLocalData("users")
    users.push(user)
    this.setLocalData("users", users)
    return user
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("users").update(updatedData).eq("id", id).select().single()

        if (!error && data) {
          // Also update localStorage
          const users = this.getLocalData("users")
          const index = users.findIndex((user: User) => user.id === id)
          if (index !== -1) {
            users[index] = { ...users[index], ...updatedData }
            this.setLocalData("users", users)
          }
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase update failed, using localStorage:", error)
    }

    // Fallback to localStorage
    const users = this.getLocalData("users")
    const index = users.findIndex((user: User) => user.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData }
      this.setLocalData("users", users)
      return users[index]
    }
    return null
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await this.supabase.from("users").delete().eq("id", id)

        if (!error) {
          const users = this.getLocalData("users")
          const filtered = users.filter((user: User) => user.id !== id)
          this.setLocalData("users", filtered)
          return true
        }
      }
    } catch (error) {
      console.warn("Supabase delete failed, using localStorage:", error)
    }

    const users = this.getLocalData("users")
    const filtered = users.filter((user: User) => user.id !== id)
    this.setLocalData("users", filtered)
    return true
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("tasks")
          .select("*")
          .eq("userId", userId)
          .order("createdAt", { ascending: false })

        if (!error && data) return data
      }
    } catch (error) {
      console.warn("Supabase query failed, using localStorage:", error)
    }

    const tasks = this.getLocalData("tasks")
    return tasks.filter((task: Task) => task.userId === userId)
  }

  async createTask(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    const task: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("tasks").insert([task]).select().single()

        if (!error && data) {
          const tasks = this.getLocalData("tasks")
          tasks.push(task)
          this.setLocalData("tasks", tasks)
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase insert failed, using localStorage:", error)
    }

    const tasks = this.getLocalData("tasks")
    tasks.push(task)
    this.setLocalData("tasks", tasks)
    return task
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("tasks").update(updatedData).eq("id", id).select().single()

        if (!error && data) {
          const tasks = this.getLocalData("tasks")
          const index = tasks.findIndex((task: Task) => task.id === id)
          if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedData }
            this.setLocalData("tasks", tasks)
          }
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase update failed, using localStorage:", error)
    }

    const tasks = this.getLocalData("tasks")
    const index = tasks.findIndex((task: Task) => task.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedData }
      this.setLocalData("tasks", tasks)
      return tasks[index]
    }
    return null
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await this.supabase.from("tasks").delete().eq("id", id)

        if (!error) {
          const tasks = this.getLocalData("tasks")
          const filtered = tasks.filter((task: Task) => task.id !== id)
          this.setLocalData("tasks", filtered)
          return true
        }
      }
    } catch (error) {
      console.warn("Supabase delete failed, using localStorage:", error)
    }

    const tasks = this.getLocalData("tasks")
    const filtered = tasks.filter((task: Task) => task.id !== id)
    this.setLocalData("tasks", filtered)
    return true
  }

  // Note methods
  async getNotes(userId: string): Promise<Note[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("notes")
          .select("*")
          .eq("userId", userId)
          .order("createdAt", { ascending: false })

        if (!error && data) return data
      }
    } catch (error) {
      console.warn("Supabase query failed, using localStorage:", error)
    }

    const notes = this.getLocalData("notes")
    return notes.filter((note: Note) => note.userId === userId)
  }

  async createNote(noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const note: Note = {
      ...noteData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("notes").insert([note]).select().single()

        if (!error && data) {
          const notes = this.getLocalData("notes")
          notes.push(note)
          this.setLocalData("notes", notes)
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase insert failed, using localStorage:", error)
    }

    const notes = this.getLocalData("notes")
    notes.push(note)
    this.setLocalData("notes", notes)
    return note
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("notes").update(updatedData).eq("id", id).select().single()

        if (!error && data) {
          const notes = this.getLocalData("notes")
          const index = notes.findIndex((note: Note) => note.id === id)
          if (index !== -1) {
            notes[index] = { ...notes[index], ...updatedData }
            this.setLocalData("notes", notes)
          }
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase update failed, using localStorage:", error)
    }

    const notes = this.getLocalData("notes")
    const index = notes.findIndex((note: Note) => note.id === id)
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updatedData }
      this.setLocalData("notes", notes)
      return notes[index]
    }
    return null
  }

  async deleteNote(id: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await this.supabase.from("notes").delete().eq("id", id)

        if (!error) {
          const notes = this.getLocalData("notes")
          const filtered = notes.filter((note: Note) => note.id !== id)
          this.setLocalData("notes", filtered)
          return true
        }
      }
    } catch (error) {
      console.warn("Supabase delete failed, using localStorage:", error)
    }

    const notes = this.getLocalData("notes")
    const filtered = notes.filter((note: Note) => note.id !== id)
    this.setLocalData("notes", filtered)
    return true
  }

  // Wishlist methods
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("wishlist_items")
          .select("*")
          .eq("userId", userId)
          .order("createdAt", { ascending: false })

        if (!error && data) return data
      }
    } catch (error) {
      console.warn("Supabase query failed, using localStorage:", error)
    }

    const items = this.getLocalData("wishlist_items")
    return items.filter((item: WishlistItem) => item.userId === userId)
  }

  async createWishlistItem(itemData: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">): Promise<WishlistItem> {
    const item: WishlistItem = {
      ...itemData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("wishlist_items").insert([item]).select().single()

        if (!error && data) {
          const items = this.getLocalData("wishlist_items")
          items.push(item)
          this.setLocalData("wishlist_items", items)
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase insert failed, using localStorage:", error)
    }

    const items = this.getLocalData("wishlist_items")
    items.push(item)
    this.setLocalData("wishlist_items", items)
    return item
  }

  async updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("wishlist_items")
          .update(updatedData)
          .eq("id", id)
          .select()
          .single()

        if (!error && data) {
          const items = this.getLocalData("wishlist_items")
          const index = items.findIndex((item: WishlistItem) => item.id === id)
          if (index !== -1) {
            items[index] = { ...items[index], ...updatedData }
            this.setLocalData("wishlist_items", items)
          }
          return data
        }
      }
    } catch (error) {
      console.warn("Supabase update failed, using localStorage:", error)
    }

    const items = this.getLocalData("wishlist_items")
    const index = items.findIndex((item: WishlistItem) => item.id === id)
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedData }
      this.setLocalData("wishlist_items", items)
      return items[index]
    }
    return null
  }

  async deleteWishlistItem(id: string): Promise<boolean> {
    try {
      if (this.isSupabaseAvailable) {
        const { error } = await this.supabase.from("wishlist_items").delete().eq("id", id)

        if (!error) {
          const items = this.getLocalData("wishlist_items")
          const filtered = items.filter((item: WishlistItem) => item.id !== id)
          this.setLocalData("wishlist_items", filtered)
          return true
        }
      }
    } catch (error) {
      console.warn("Supabase delete failed, using localStorage:", error)
    }

    const items = this.getLocalData("wishlist_items")
    const filtered = items.filter((item: WishlistItem) => item.id !== id)
    this.setLocalData("wishlist_items", filtered)
    return true
  }
}

export const db = new HybridDatabase()
