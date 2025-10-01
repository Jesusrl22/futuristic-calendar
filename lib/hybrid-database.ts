import { createClient } from "@supabase/supabase-js"

// Browser-compatible UUID generation
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface User {
  id: string
  name: string
  email: string
  language: string
  theme: string
  is_premium: boolean
  is_pro: boolean
  plan?: string
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  ai_credits: number
  ai_credits_used: number
  ai_credits_reset_date?: string
  ai_total_tokens_used: number
  ai_total_cost_eur: number
  ai_monthly_limit: number
  ai_plan_type: string
  subscription_status?: string
  subscription_end_date?: string
  subscription_tier?: string
  created_at: string
  updated_at: string
}

interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category?: string
  date?: string
  due_date?: string
  created_at: string
  updated_at: string
  estimatedTime?: number
}

interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface WishlistItem {
  id: string
  user_id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

class HybridDatabase {
  private supabase: any
  private isSupabaseAvailable = false
  private currentUser: User | null = null
  private userCache = new Map<string, User>()

  constructor() {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        this.isSupabaseAvailable = true
        console.log("✅ Supabase client initialized")
      } else {
        console.warn("⚠️ Supabase environment variables not found")
      }
    } catch (error) {
      console.warn("⚠️ Supabase not available, using localStorage fallback:", error)
      this.isSupabaseAvailable = false
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log("🔍 Getting current user from database...")

      const isDemoUser = localStorage.getItem("isDemoUser")
      if (isDemoUser === "true") {
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            this.currentUser = user
            console.log("✅ Demo user loaded:", user.name)
            return user
          } catch (error) {
            console.error("❌ Error parsing demo user:", error)
            localStorage.removeItem("isDemoUser")
            localStorage.removeItem("currentUser")
          }
        }
      }

      if (this.isSupabaseAvailable && isDemoUser !== "true") {
        console.log("🔍 Getting user from Supabase...")

        const {
          data: { user },
          error: authError,
        } = await this.supabase.auth.getUser()

        if (authError) {
          console.error("❌ Auth error:", authError)
          this.currentUser = null
          this.userCache.clear()
          return null
        }

        if (!user) {
          console.log("❌ No authenticated user found")
          this.currentUser = null
          this.userCache.clear()
          return null
        }

        console.log("✅ Authenticated user found:", user.email)

        return await this.getUserById(user.id)
      }

      if (isDemoUser !== "true") {
        console.log("💾 Using localStorage fallback")
        const userData = localStorage.getItem("currentUser")
        if (userData) {
          try {
            const user = JSON.parse(userData)
            this.currentUser = user
            console.log("✅ User loaded from localStorage:", user.name)
            return user
          } catch (error) {
            console.error("❌ Error parsing user data from localStorage:", error)
            localStorage.removeItem("currentUser")
          }
        }
      }

      console.log("❌ No user found")
      this.currentUser = null
      return null
    } catch (error) {
      console.error("❌ Error getting current user:", error)
      this.currentUser = null
      return null
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase.from("users").select("*").eq("id", userId).maybeSingle()

        if (error) {
          console.error("❌ Error fetching user:", error)
          return null
        }

        if (data) {
          this.currentUser = data
          this.userCache.set(userId, data)
          return data
        }
      }

      return null
    } catch (error) {
      console.error("❌ Error in getUserById:", error)
      return null
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: userData.id || generateUUID(),
      name: userData.name || "Demo User",
      email: userData.email || "demo@example.com",
      language: userData.language || "es",
      theme: userData.theme || "default",
      is_premium: userData.is_premium || false,
      is_pro: userData.is_pro || false,
      plan: userData.plan || "free",
      premium_expiry: userData.premium_expiry,
      onboarding_completed: userData.onboarding_completed || true,
      pomodoro_sessions: userData.pomodoro_sessions || 0,
      work_duration: userData.work_duration || 25,
      short_break_duration: userData.short_break_duration || 5,
      long_break_duration: userData.long_break_duration || 15,
      sessions_until_long_break: userData.sessions_until_long_break || 4,
      ai_credits: userData.ai_credits || 0,
      ai_credits_used: userData.ai_credits_used || 0,
      ai_credits_reset_date: userData.ai_credits_reset_date,
      ai_total_tokens_used: userData.ai_total_tokens_used || 0,
      ai_total_cost_eur: userData.ai_total_cost_eur || 0,
      ai_monthly_limit: userData.ai_monthly_limit || 0,
      ai_plan_type: userData.ai_plan_type || "none",
      subscription_status: userData.subscription_status,
      subscription_end_date: userData.subscription_end_date,
      subscription_tier: userData.subscription_tier || "free",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      console.log("💾 Saving demo user to localStorage...")
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      this.currentUser = newUser
      return newUser
    }

    if (this.isSupabaseAvailable) {
      try {
        console.log("💾 Saving user to Supabase...")
        const { data, error } = await this.supabase.from("users").upsert(newUser).select().single()

        if (error) {
          console.error("❌ Error creating user in Supabase:", error)
          throw error
        }

        console.log("✅ User saved to Supabase:", data.name)
        this.currentUser = data
        this.userCache.set(data.id, data)
        return data
      } catch (error) {
        console.error("❌ Supabase error, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    console.log("💾 Saving user to localStorage...")
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    this.currentUser = newUser
    return newUser
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const currentUser = this.currentUser
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updatedData }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        this.currentUser = updatedUser
        return updatedUser
      }
      throw new Error("Demo user not found")
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase.from("users").update(updatedData).eq("id", userId).select().single()

        if (error) throw error

        this.currentUser = data
        this.userCache.set(userId, data)
        return data
      } catch (error) {
        console.error("Supabase error, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const currentUser = this.currentUser
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updatedData }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      this.currentUser = updatedUser
      return updatedUser
    }

    throw new Error("User not found")
  }

  clearUserCache(): void {
    console.log("🗑️ Clearing user cache")
    this.currentUser = null
    this.userCache.clear()
  }

  async logout(): Promise<void> {
    try {
      const isDemoUser = localStorage.getItem("isDemoUser")

      if (isDemoUser === "true") {
        localStorage.clear()
      } else if (this.isSupabaseAvailable) {
        await this.supabase.auth.signOut()
      }

      this.clearUserCache()
    } catch (error) {
      console.error("Error logging out:", error)
      localStorage.clear()
      this.clearUserCache()
    }
  }

  async getTasks(userId: string): Promise<Task[]> {
    try {
      const isDemoUser = localStorage.getItem("isDemoUser")
      if (isDemoUser === "true") {
        const tasks = localStorage.getItem(`tasks_${userId}`)
        return tasks ? JSON.parse(tasks) : []
      }

      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data || []
      }
    } catch (error) {
      console.error("Supabase error loading tasks, falling back to localStorage:", error)
      this.isSupabaseAvailable = false
    }

    const tasks = localStorage.getItem(`tasks_${userId}`)
    return tasks ? JSON.parse(tasks) : []
  }

  async createTask(
    userId: string,
    taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Task> {
    const now = new Date().toISOString()
    const newTask: Task = {
      id: generateUUID(),
      user_id: userId,
      created_at: now,
      updated_at: now,
      date: taskData.due_date ? taskData.due_date.split("T")[0] : now.split("T")[0],
      ...taskData,
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const existingTasks = await this.getTasks(userId)
      const updatedTasks = [newTask, ...existingTasks]
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
      return newTask
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase.from("tasks").insert(newTask).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase error creating task, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const existingTasks = await this.getTasks(userId)
    const updatedTasks = [newTask, ...existingTasks]
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
    return newTask
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    if (updatedData.due_date) {
      updatedData.date = updatedData.due_date.split("T")[0]
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const allKeys = Object.keys(localStorage)
      for (const key of allKeys) {
        if (key.startsWith("tasks_")) {
          const tasks: Task[] = JSON.parse(localStorage.getItem(key) || "[]")
          const taskIndex = tasks.findIndex((t) => t.id === taskId)
          if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
            localStorage.setItem(key, JSON.stringify(tasks))
            return tasks[taskIndex]
          }
        }
      }
      throw new Error("Task not found")
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase.from("tasks").update(updatedData).eq("id", taskId).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase error updating task, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const allKeys = Object.keys(localStorage)
    for (const key of allKeys) {
      if (key.startsWith("tasks_")) {
        const tasks: Task[] = JSON.parse(localStorage.getItem(key) || "[]")
        const taskIndex = tasks.findIndex((t) => t.id === taskId)
        if (taskIndex !== -1) {
          tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
          localStorage.setItem(key, JSON.stringify(tasks))
          return tasks[taskIndex]
        }
      }
    }

    throw new Error("Task not found")
  }

  async deleteTask(taskId: string): Promise<void> {
    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const allKeys = Object.keys(localStorage)
      for (const key of allKeys) {
        if (key.startsWith("tasks_")) {
          const tasks: Task[] = JSON.parse(localStorage.getItem(key) || "[]")
          const filteredTasks = tasks.filter((t) => t.id !== taskId)
          if (filteredTasks.length !== tasks.length) {
            localStorage.setItem(key, JSON.stringify(filteredTasks))
            return
          }
        }
      }
      return
    }

    if (this.isSupabaseAvailable) {
      try {
        const { error } = await this.supabase.from("tasks").delete().eq("id", taskId)

        if (error) throw error
        return
      } catch (error) {
        console.error("Supabase error deleting task, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const allKeys = Object.keys(localStorage)
    for (const key of allKeys) {
      if (key.startsWith("tasks_")) {
        const tasks: Task[] = JSON.parse(localStorage.getItem(key) || "[]")
        const filteredTasks = tasks.filter((t) => t.id !== taskId)
        if (filteredTasks.length !== tasks.length) {
          localStorage.setItem(key, JSON.stringify(filteredTasks))
          return
        }
      }
    }
  }

  async getNotes(userId: string): Promise<Note[]> {
    try {
      const isDemoUser = localStorage.getItem("isDemoUser")
      if (isDemoUser === "true") {
        const notes = localStorage.getItem(`notes_${userId}`)
        return notes ? JSON.parse(notes) : []
      }

      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("notes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data || []
      }
    } catch (error) {
      console.error("Supabase error loading notes, falling back to localStorage:", error)
      this.isSupabaseAvailable = false
    }

    const notes = localStorage.getItem(`notes_${userId}`)
    return notes ? JSON.parse(notes) : []
  }

  async createNote(noteData: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
    const newNote: Note = {
      id: generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...noteData,
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const existingNotes = await this.getNotes(noteData.user_id)
      const updatedNotes = [newNote, ...existingNotes]
      localStorage.setItem(`notes_${noteData.user_id}`, JSON.stringify(updatedNotes))
      return newNote
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase.from("notes").insert(newNote).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase error creating note, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const existingNotes = await this.getNotes(noteData.user_id)
    const updatedNotes = [newNote, ...existingNotes]
    localStorage.setItem(`notes_${noteData.user_id}`, JSON.stringify(updatedNotes))
    return newNote
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const allKeys = Object.keys(localStorage)
      for (const key of allKeys) {
        if (key.startsWith("notes_")) {
          const notes: Note[] = JSON.parse(localStorage.getItem(key) || "[]")
          const noteIndex = notes.findIndex((n) => n.id === noteId)
          if (noteIndex !== -1) {
            notes[noteIndex] = { ...notes[noteIndex], ...updatedData }
            localStorage.setItem(key, JSON.stringify(notes))
            return notes[noteIndex]
          }
        }
      }
      throw new Error("Note not found")
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase.from("notes").update(updatedData).eq("id", noteId).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase error updating note, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const allKeys = Object.keys(localStorage)
    for (const key of allKeys) {
      if (key.startsWith("notes_")) {
        const notes: Note[] = JSON.parse(localStorage.getItem(key) || "[]")
        const noteIndex = notes.findIndex((n) => n.id === noteId)
        if (noteIndex !== -1) {
          notes[noteIndex] = { ...notes[noteIndex], ...updatedData }
          localStorage.setItem(key, JSON.stringify(notes))
          return notes[noteIndex]
        }
      }
    }

    throw new Error("Note not found")
  }

  async deleteNote(noteId: string): Promise<void> {
    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const allKeys = Object.keys(localStorage)
      for (const key of allKeys) {
        if (key.startsWith("notes_")) {
          const notes: Note[] = JSON.parse(localStorage.getItem(key) || "[]")
          const filteredNotes = notes.filter((n) => n.id !== noteId)
          if (filteredNotes.length !== notes.length) {
            localStorage.setItem(key, JSON.stringify(filteredNotes))
            return
          }
        }
      }
      return
    }

    if (this.isSupabaseAvailable) {
      try {
        const { error } = await this.supabase.from("notes").delete().eq("id", noteId)

        if (error) throw error
        return
      } catch (error) {
        console.error("Supabase error deleting note, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const allKeys = Object.keys(localStorage)
    for (const key of allKeys) {
      if (key.startsWith("notes_")) {
        const notes: Note[] = JSON.parse(localStorage.getItem(key) || "[]")
        const filteredNotes = notes.filter((n) => n.id !== noteId)
        if (filteredNotes.length !== notes.length) {
          localStorage.setItem(key, JSON.stringify(filteredNotes))
          return
        }
      }
    }
  }

  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    try {
      const isDemoUser = localStorage.getItem("isDemoUser")
      if (isDemoUser === "true") {
        const items = localStorage.getItem(`wishlist_${userId}`)
        return items ? JSON.parse(items) : []
      }

      if (this.isSupabaseAvailable) {
        const { data, error } = await this.supabase
          .from("wishlist_items")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        return data || []
      }
    } catch (error) {
      console.error("Supabase error loading wishlist, falling back to localStorage:", error)
      this.isSupabaseAvailable = false
    }

    const items = localStorage.getItem(`wishlist_${userId}`)
    return items ? JSON.parse(items) : []
  }

  async createWishlistItem(itemData: Omit<WishlistItem, "id" | "created_at" | "updated_at">): Promise<WishlistItem> {
    const newItem: WishlistItem = {
      id: generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...itemData,
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const existingItems = await this.getWishlistItems(itemData.user_id)
      const updatedItems = [newItem, ...existingItems]
      localStorage.setItem(`wishlist_${itemData.user_id}`, JSON.stringify(updatedItems))
      return newItem
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase.from("wishlist_items").insert(newItem).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase error creating wishlist item, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const existingItems = await this.getWishlistItems(itemData.user_id)
    const updatedItems = [newItem, ...existingItems]
    localStorage.setItem(`wishlist_${itemData.user_id}`, JSON.stringify(updatedItems))
    return newItem
  }

  async updateWishlistItem(itemId: string, updates: Partial<WishlistItem>): Promise<WishlistItem> {
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const allKeys = Object.keys(localStorage)
      for (const key of allKeys) {
        if (key.startsWith("wishlist_")) {
          const items: WishlistItem[] = JSON.parse(localStorage.getItem(key) || "[]")
          const itemIndex = items.findIndex((i) => i.id === itemId)
          if (itemIndex !== -1) {
            items[itemIndex] = { ...items[itemIndex], ...updatedData }
            localStorage.setItem(key, JSON.stringify(items))
            return items[itemIndex]
          }
        }
      }
      throw new Error("Wishlist item not found")
    }

    if (this.isSupabaseAvailable) {
      try {
        const { data, error } = await this.supabase
          .from("wishlist_items")
          .update(updatedData)
          .eq("id", itemId)
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase error updating wishlist item, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const allKeys = Object.keys(localStorage)
    for (const key of allKeys) {
      if (key.startsWith("wishlist_")) {
        const items: WishlistItem[] = JSON.parse(localStorage.getItem(key) || "[]")
        const itemIndex = items.findIndex((i) => i.id === itemId)
        if (itemIndex !== -1) {
          items[itemIndex] = { ...items[itemIndex], ...updatedData }
          localStorage.setItem(key, JSON.stringify(items))
          return items[itemIndex]
        }
      }
    }

    throw new Error("Wishlist item not found")
  }

  async deleteWishlistItem(itemId: string): Promise<void> {
    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const allKeys = Object.keys(localStorage)
      for (const key of allKeys) {
        if (key.startsWith("wishlist_")) {
          const items: WishlistItem[] = JSON.parse(localStorage.getItem(key) || "[]")
          const filteredItems = items.filter((i) => i.id !== itemId)
          if (filteredItems.length !== items.length) {
            localStorage.setItem(key, JSON.stringify(filteredItems))
            return
          }
        }
      }
      return
    }

    if (this.isSupabaseAvailable) {
      try {
        const { error } = await this.supabase.from("wishlist_items").delete().eq("id", itemId)

        if (error) throw error
        return
      } catch (error) {
        console.error("Supabase error deleting wishlist item, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const allKeys = Object.keys(localStorage)
    for (const key of allKeys) {
      if (key.startsWith("wishlist_")) {
        const items: WishlistItem[] = JSON.parse(localStorage.getItem(key) || "[]")
        const filteredItems = items.filter((i) => i.id !== itemId)
        if (filteredItems.length !== items.length) {
          localStorage.setItem(key, JSON.stringify(filteredItems))
          return
        }
      }
    }
  }

  async clearAllData(): Promise<void> {
    const isDemoUser = localStorage.getItem("isDemoUser")
    if (isDemoUser === "true") {
      const keysToRemove = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("tasks_") || key.startsWith("notes_") || key.startsWith("wishlist_") || key === "currentUser",
      )
      keysToRemove.forEach((key) => localStorage.removeItem(key))
      this.clearUserCache()
      return
    }

    if (this.isSupabaseAvailable) {
      try {
        const user = this.currentUser
        if (user) {
          await Promise.all([
            this.supabase.from("tasks").delete().eq("user_id", user.id),
            this.supabase.from("notes").delete().eq("user_id", user.id),
            this.supabase.from("wishlist_items").delete().eq("user_id", user.id),
          ])
        }
        return
      } catch (error) {
        console.error("Supabase error clearing data, falling back to localStorage:", error)
        this.isSupabaseAvailable = false
      }
    }

    const keysToRemove = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("tasks_") || key.startsWith("notes_") || key.startsWith("wishlist_") || key === "currentUser",
    )
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    this.clearUserCache()
  }

  async createDemoData(userId: string): Promise<void> {
    console.log("🎯 Creating demo data for user:", userId)

    const demoTasks = [
      {
        user_id: userId,
        title: "Revisar emails matutinos",
        description: "Revisar y responder emails importantes",
        completed: false,
        priority: "medium" as const,
        category: "trabajo",
        due_date: new Date().toISOString(),
        estimatedTime: 30,
      },
      {
        user_id: userId,
        title: "Planificar reunión de equipo",
        description: "Preparar agenda y materiales",
        completed: true,
        priority: "high" as const,
        category: "trabajo",
        due_date: new Date(Date.now() + 86400000).toISOString(),
        estimatedTime: 60,
      },
      {
        user_id: userId,
        title: "Actualizar documentación",
        description: "Revisar y actualizar docs del proyecto",
        completed: false,
        priority: "low" as const,
        category: "trabajo",
        estimatedTime: 45,
      },
    ]

    const demoNotes = [
      {
        user_id: userId,
        title: "Ideas para el proyecto",
        content:
          "- Implementar notificaciones push\n- Mejorar la interfaz de usuario\n- Añadir integración con calendario",
      },
      {
        user_id: userId,
        title: "Notas de la reunión",
        content: "Puntos clave discutidos:\n1. Objetivos del Q4\n2. Recursos necesarios\n3. Timeline del proyecto",
      },
    ]

    const demoWishlist = [
      {
        user_id: userId,
        title: "Aprender TypeScript avanzado",
        description: "Profundizar en tipos avanzados y patrones",
        priority: "high" as const,
      },
      {
        user_id: userId,
        title: "Configurar CI/CD pipeline",
        description: "Automatizar despliegues y testing",
        priority: "medium" as const,
      },
    ]

    try {
      await Promise.all([
        ...demoTasks.map((task) => this.createTask(userId, task)),
        ...demoNotes.map((note) => this.createNote(note)),
        ...demoWishlist.map((item) => this.createWishlistItem(item)),
      ])
      console.log("✅ Demo data created successfully")
    } catch (error) {
      console.error("❌ Error creating demo data:", error)
    }
  }
}

export const hybridDb = new HybridDatabase()
export const db = hybridDb // Export as 'db' alias
export type { User, Task, Note, WishlistItem }
