import { supabase, isSupabaseConfigured } from "./supabase"

// Demo users for testing
const DEMO_USERS = {
  "demo@futuretask.com": {
    id: "demo-user-1",
    email: "demo@futuretask.com",
    name: "Usuario Demo",
    subscription_plan: "free",
    subscription_status: "active",
    ai_credits: 0,
    created_at: new Date().toISOString(),
  },
  "premium@futuretask.com": {
    id: "demo-user-2",
    email: "premium@futuretask.com",
    name: "Usuario Premium",
    subscription_plan: "premium",
    subscription_status: "active",
    ai_credits: 0,
    created_at: new Date().toISOString(),
  },
  "pro@futuretask.com": {
    id: "demo-user-3",
    email: "pro@futuretask.com",
    name: "Usuario Pro",
    subscription_plan: "pro",
    subscription_status: "active",
    ai_credits: 500,
    created_at: new Date().toISOString(),
  },
}

class HybridDatabase {
  private currentUser: any = null

  constructor() {
    // Initialize with demo user if no Supabase
    if (!isSupabaseConfigured) {
      this.currentUser = DEMO_USERS["demo@futuretask.com"]
    }
  }

  // User Management
  async getUser(userId?: string): Promise<any> {
    if (!isSupabaseConfigured) {
      return this.currentUser || DEMO_USERS["demo@futuretask.com"]
    }

    try {
      if (userId) {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
        return error ? null : data
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()
        return error ? null : data
      }
    } catch (error) {
      console.error("Error getting user:", error)
      return null
    }
  }

  async loginUser(email: string, password: string): Promise<{ user: any; error: any }> {
    if (!isSupabaseConfigured) {
      // Demo login
      const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]
      if (demoUser && password === "demo123") {
        this.currentUser = demoUser
        localStorage.setItem("currentUser", JSON.stringify(demoUser))
        return { user: demoUser, error: null }
      } else if (demoUser && password === "premium123") {
        this.currentUser = DEMO_USERS["premium@futuretask.com"]
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
        return { user: this.currentUser, error: null }
      } else if (demoUser && password === "pro123") {
        this.currentUser = DEMO_USERS["pro@futuretask.com"]
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
        return { user: this.currentUser, error: null }
      }
      return { user: null, error: { message: "Invalid credentials" } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return { user: null, error }

      const userData = await this.getUser(data.user?.id)
      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  async registerUser(email: string, password: string, name: string): Promise<{ user: any; error: any }> {
    if (!isSupabaseConfigured) {
      // Demo registration - just return demo user
      const newUser = {
        id: `demo-${Date.now()}`,
        email,
        name,
        subscription_plan: "free",
        subscription_status: "active",
        ai_credits: 0,
        created_at: new Date().toISOString(),
      }
      this.currentUser = newUser
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      return { user: newUser, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) return { user: null, error }

      // Create user profile
      const { data: userData, error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user?.id,
            email,
            name,
            subscription_plan: "free",
            subscription_status: "active",
            ai_credits: 0,
          },
        ])
        .select()
        .single()

      if (profileError) return { user: null, error: profileError }

      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  async logoutUser(): Promise<{ error: any }> {
    if (!isSupabaseConfigured) {
      this.currentUser = null
      localStorage.removeItem("currentUser")
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  }

  async updateUserSubscription(userId: string, plan: string, status: string): Promise<{ data: any; error: any }> {
    if (!isSupabaseConfigured) {
      // Update demo user
      if (this.currentUser) {
        this.currentUser.subscription_plan = plan
        this.currentUser.subscription_status = status
        if (plan === "pro") {
          this.currentUser.ai_credits = 500
        }
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
        return { data: this.currentUser, error: null }
      }
      return { data: null, error: { message: "User not found" } }
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          subscription_plan: plan,
          subscription_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Task Management
  async getTasks(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured) {
      const tasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || "[]")
      return tasks
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      return error ? [] : data
    } catch (error) {
      console.error("Error getting tasks:", error)
      return []
    }
  }

  async createTask(userId: string, task: any): Promise<{ data: any; error: any }> {
    if (!isSupabaseConfigured) {
      const tasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || "[]")
      const newTask = {
        ...task,
        id: Date.now().toString(),
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      tasks.push(newTask)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
      return { data: newTask, error: null }
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...task, user_id: userId }])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  async updateTask(taskId: string, updates: any): Promise<{ data: any; error: any }> {
    if (!isSupabaseConfigured) {
      // Update in localStorage
      const userId = this.currentUser?.id
      if (!userId) return { data: null, error: { message: "User not found" } }

      const tasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || "[]")
      const taskIndex = tasks.findIndex((t: any) => t.id === taskId)
      if (taskIndex >= 0) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
        return { data: tasks[taskIndex], error: null }
      }
      return { data: null, error: { message: "Task not found" } }
    }

    try {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  async deleteTask(taskId: string): Promise<{ error: any }> {
    if (!isSupabaseConfigured) {
      const userId = this.currentUser?.id
      if (!userId) return { error: { message: "User not found" } }

      const tasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || "[]")
      const filteredTasks = tasks.filter((t: any) => t.id !== taskId)
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(filteredTasks))
      return { error: null }
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Notes Management
  async getNotes(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured) {
      const notes = JSON.parse(localStorage.getItem(`notes_${userId}`) || "[]")
      return notes
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })

      return error ? [] : data
    } catch (error) {
      console.error("Error getting notes:", error)
      return []
    }
  }

  async createNote(userId: string, note: any): Promise<{ data: any; error: any }> {
    if (!isSupabaseConfigured) {
      const notes = JSON.parse(localStorage.getItem(`notes_${userId}`) || "[]")
      const newNote = {
        ...note,
        id: Date.now().toString(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      notes.push(newNote)
      localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
      return { data: newNote, error: null }
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ ...note, user_id: userId }])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Wishlist Management
  async getWishlistItems(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured) {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || "[]")
      return wishlist
    }

    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      return error ? [] : data
    } catch (error) {
      console.error("Error getting wishlist:", error)
      return []
    }
  }

  async createWishlistItem(userId: string, item: any): Promise<{ data: any; error: any }> {
    if (!isSupabaseConfigured) {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || "[]")
      const newItem = {
        ...item,
        id: Date.now().toString(),
        user_id: userId,
        created_at: new Date().toISOString(),
      }
      wishlist.push(newItem)
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist))
      return { data: newItem, error: null }
    }

    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .insert([{ ...item, user_id: userId }])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Achievements Management
  async getUserAchievements(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured) {
      const achievements = JSON.parse(localStorage.getItem(`achievements_${userId}`) || "[]")
      return achievements
    }

    try {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievements(*)")
        .eq("user_id", userId)

      return error ? [] : data
    } catch (error) {
      console.error("Error getting achievements:", error)
      return []
    }
  }

  // Statistics
  async getUserStats(userId: string): Promise<any> {
    if (!isSupabaseConfigured) {
      const tasks = await this.getTasks(userId)
      const completedTasks = tasks.filter((t) => t.completed).length
      const totalTasks = tasks.length

      return {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        completion_rate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        streak_days: 0,
        total_pomodoros: 0,
      }
    }

    try {
      const { data, error } = await supabase.rpc("get_user_stats", { user_id: userId })

      return error ? {} : data
    } catch (error) {
      console.error("Error getting stats:", error)
      return {}
    }
  }
}

// Create singleton instance
const hybridDb = new HybridDatabase()

// Export the db instance
export const db = hybridDb

// Export functions
export const getUser = (userId?: string) => hybridDb.getUser(userId)
export const loginUser = (email: string, password: string) => hybridDb.loginUser(email, password)
export const registerUser = (email: string, password: string, name: string) =>
  hybridDb.registerUser(email, password, name)
export const logoutUser = () => hybridDb.logoutUser()
export const updateUserSubscription = (userId: string, plan: string, status: string) =>
  hybridDb.updateUserSubscription(userId, plan, status)

export const getTasks = (userId: string) => hybridDb.getTasks(userId)
export const createTask = (userId: string, task: any) => hybridDb.createTask(userId, task)
export const updateTask = (taskId: string, updates: any) => hybridDb.updateTask(taskId, updates)
export const deleteTask = (taskId: string) => hybridDb.deleteTask(taskId)

export const getNotes = (userId: string) => hybridDb.getNotes(userId)
export const createNote = (userId: string, note: any) => hybridDb.createNote(userId, note)

export const getWishlistItems = (userId: string) => hybridDb.getWishlistItems(userId)
export const createWishlistItem = (userId: string, item: any) => hybridDb.createWishlistItem(userId, item)

export const getUserAchievements = (userId: string) => hybridDb.getUserAchievements(userId)
export const getUserStats = (userId: string) => hybridDb.getUserStats(userId)

export default hybridDb
