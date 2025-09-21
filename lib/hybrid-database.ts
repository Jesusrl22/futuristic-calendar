"use client"

import { createClient } from "@/lib/supabase"

// Types
export interface User {
  id: string
  email: string
  name: string
  password?: string
  plan: "free" | "premium" | "pro"
  billing: "monthly" | "yearly"
  aiCredits: number
  createdAt: string
  updatedAt: string
  isAdmin?: boolean
  theme?: "light" | "dark"
  pomodoroSettings?: {
    workDuration: number
    shortBreak: number
    longBreak: number
    longBreakInterval: number
  }
  subscriptionExpiry?: string
  emailVerified?: boolean
  lastLogin?: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  estimatedTime?: number
  actualTime?: number
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  isPinned?: boolean
  color?: string
}

export interface WishlistItem {
  id: string
  userId: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  category?: string
  estimatedCost?: number
  targetDate?: string
  completed: boolean
  createdAt: string
  updatedAt: string
  url?: string
  notes?: string
}

export interface Achievement {
  id: string
  userId: string
  type: string
  title: string
  description: string
  unlockedAt: string
  progress?: number
  maxProgress?: number
}

// In-memory storage as fallback
const users: User[] = [
  {
    id: "admin-user-id",
    email: "admin@futuretask.com",
    name: "Admin User",
    password: "admin123",
    plan: "pro",
    billing: "yearly",
    aiCredits: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAdmin: true,
    theme: "dark",
    pomodoroSettings: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
    },
    subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    emailVerified: true,
  },
  {
    id: "premium-user-id",
    email: "premium@futuretask.com",
    name: "Premium User",
    password: "premium123",
    plan: "premium",
    billing: "monthly",
    aiCredits: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: "dark",
    pomodoroSettings: {
      workDuration: 30,
      shortBreak: 5,
      longBreak: 20,
      longBreakInterval: 3,
    },
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    emailVerified: true,
  },
  {
    id: "demo-user-id",
    email: "demo@futuretask.com",
    name: "Demo User",
    password: "demo123",
    plan: "free",
    billing: "monthly",
    aiCredits: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: "light",
    pomodoroSettings: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
    },
    emailVerified: true,
  },
]

const tasks: Task[] = []
const notes: Note[] = []
const wishlistItems: WishlistItem[] = []
const achievements: Achievement[] = []

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj
  if (Array.isArray(obj)) return obj.map(toSnakeCase)

  const converted: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    converted[snakeKey] = toSnakeCase(value)
  }
  return converted
}

// Helper function to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj
  if (Array.isArray(obj)) return obj.map(toCamelCase)

  const converted: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    converted[camelKey] = toCamelCase(value)
  }
  return converted
}

// Database class with Supabase integration and fallback
class HybridDatabase {
  private supabase = createClient()
  private useSupabase = true
  private connectionStatus = false
  private lastSyncTime = 0
  private syncQueue: any[] = []

  constructor() {
    // Test Supabase connection
    this.testConnection()
  }

  private async testConnection() {
    try {
      const { error } = await this.supabase.from("users").select("count").limit(1)
      if (error) {
        console.warn("Supabase connection failed, using in-memory storage:", error.message)
        this.useSupabase = false
        this.connectionStatus = false
      } else {
        this.connectionStatus = true
        this.useSupabase = true
      }
    } catch (error) {
      console.warn("Supabase connection failed, using in-memory storage:", error)
      this.useSupabase = false
      this.connectionStatus = false
    }
  }

  // Connection status methods
  getConnectionStatus(): boolean {
    return this.connectionStatus
  }

  async forceSync(): Promise<void> {
    console.log("Forcing database synchronization...")
    await this.testConnection()

    if (this.connectionStatus && this.syncQueue.length > 0) {
      // Process sync queue
      for (const operation of this.syncQueue) {
        try {
          await this.executeOperation(operation)
        } catch (error) {
          console.error("Error syncing operation:", error)
        }
      }
      this.syncQueue = []
    }

    this.lastSyncTime = Date.now()
  }

  private async executeOperation(operation: any): Promise<void> {
    // Execute queued operations when connection is restored
    const { type, table, data, id } = operation

    try {
      switch (type) {
        case "insert":
          await this.supabase.from(table).insert([data])
          break
        case "update":
          await this.supabase.from(table).update(data).eq("id", id)
          break
        case "delete":
          await this.supabase.from(table).delete().eq("id", id)
          break
      }
    } catch (error) {
      console.error(`Error executing ${type} operation:`, error)
    }
  }

  private queueOperation(type: string, table: string, data?: any, id?: string): void {
    if (!this.connectionStatus) {
      this.syncQueue.push({ type, table, data, id, timestamp: Date.now() })
    }
  }

  // User operations
  async getAllUsers(): Promise<User[]> {
    if (!this.useSupabase) {
      return users
    }

    try {
      const { data, error } = await this.supabase.from("users").select("*")
      if (error) throw error
      return data ? data.map(toCamelCase) : []
    } catch (error) {
      console.error("Error fetching users from Supabase:", error)
      return users
    }
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.useSupabase) {
      return users.find((user) => user.id === id) || null
    }

    try {
      const { data, error } = await this.supabase.from("users").select("*").eq("id", id).single()
      if (error) throw error
      return data ? toCamelCase(data) : null
    } catch (error) {
      console.error("Error fetching user from Supabase:", error)
      return users.find((user) => user.id === id) || null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.useSupabase) {
      return users.find((user) => user.email === email) || null
    }

    try {
      const { data, error } = await this.supabase.from("users").select("*").eq("email", email).single()
      if (error) throw error
      return data ? toCamelCase(data) : null
    } catch (error) {
      console.error("Error fetching user by email from Supabase:", error)
      return users.find((user) => user.email === email) || null
    }
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User | null> {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      users.push(newUser)
      this.queueOperation("insert", "users", toSnakeCase(newUser))
      return newUser
    }

    try {
      const { data, error } = await this.supabase
        .from("users")
        .insert([toSnakeCase(newUser)])
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : newUser
    } catch (error) {
      console.error("Error creating user in Supabase:", error)
      users.push(newUser)
      this.queueOperation("insert", "users", toSnakeCase(newUser))
      return newUser
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex === -1) return null
      users[userIndex] = { ...users[userIndex], ...updatedData }
      this.queueOperation("update", "users", toSnakeCase(updatedData), id)
      return users[userIndex]
    }

    try {
      const { data, error } = await this.supabase
        .from("users")
        .update(toSnakeCase(updatedData))
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : null
    } catch (error) {
      console.error("Error updating user in Supabase:", error)
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex === -1) return null
      users[userIndex] = { ...users[userIndex], ...updatedData }
      this.queueOperation("update", "users", toSnakeCase(updatedData), id)
      return users[userIndex]
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex === -1) return false
      users.splice(userIndex, 1)
      this.queueOperation("delete", "users", null, id)
      return true
    }

    try {
      const { error } = await this.supabase.from("users").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting user from Supabase:", error)
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex === -1) return false
      users.splice(userIndex, 1)
      this.queueOperation("delete", "users", null, id)
      return true
    }
  }

  // Task operations
  async getTasksByUserId(userId: string): Promise<Task[]> {
    if (!this.useSupabase) {
      return tasks.filter((task) => task.userId === userId)
    }

    try {
      const { data, error } = await this.supabase.from("tasks").select("*").eq("user_id", userId)
      if (error) throw error
      return data ? data.map(toCamelCase) : []
    } catch (error) {
      console.error("Error fetching tasks from Supabase:", error)
      return tasks.filter((task) => task.userId === userId)
    }
  }

  async createTask(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task | null> {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      tasks.push(newTask)
      this.queueOperation("insert", "tasks", toSnakeCase(newTask))
      return newTask
    }

    try {
      const { data, error } = await this.supabase
        .from("tasks")
        .insert([toSnakeCase(newTask)])
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : newTask
    } catch (error) {
      console.error("Error creating task in Supabase:", error)
      tasks.push(newTask)
      this.queueOperation("insert", "tasks", toSnakeCase(newTask))
      return newTask
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      const taskIndex = tasks.findIndex((task) => task.id === id)
      if (taskIndex === -1) return null
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
      this.queueOperation("update", "tasks", toSnakeCase(updatedData), id)
      return tasks[taskIndex]
    }

    try {
      const { data, error } = await this.supabase
        .from("tasks")
        .update(toSnakeCase(updatedData))
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : null
    } catch (error) {
      console.error("Error updating task in Supabase:", error)
      const taskIndex = tasks.findIndex((task) => task.id === id)
      if (taskIndex === -1) return null
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData }
      this.queueOperation("update", "tasks", toSnakeCase(updatedData), id)
      return tasks[taskIndex]
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      const taskIndex = tasks.findIndex((task) => task.id === id)
      if (taskIndex === -1) return false
      tasks.splice(taskIndex, 1)
      this.queueOperation("delete", "tasks", null, id)
      return true
    }

    try {
      const { error } = await this.supabase.from("tasks").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting task from Supabase:", error)
      const taskIndex = tasks.findIndex((task) => task.id === id)
      if (taskIndex === -1) return false
      tasks.splice(taskIndex, 1)
      this.queueOperation("delete", "tasks", null, id)
      return true
    }
  }

  // Note operations
  async getNotesByUserId(userId: string): Promise<Note[]> {
    if (!this.useSupabase) {
      return notes.filter((note) => note.userId === userId)
    }

    try {
      const { data, error } = await this.supabase.from("notes").select("*").eq("user_id", userId)
      if (error) throw error
      return data ? data.map(toCamelCase) : []
    } catch (error) {
      console.error("Error fetching notes from Supabase:", error)
      return notes.filter((note) => note.userId === userId)
    }
  }

  async createNote(noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note | null> {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      notes.push(newNote)
      this.queueOperation("insert", "notes", toSnakeCase(newNote))
      return newNote
    }

    try {
      const { data, error } = await this.supabase
        .from("notes")
        .insert([toSnakeCase(newNote)])
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : newNote
    } catch (error) {
      console.error("Error creating note in Supabase:", error)
      notes.push(newNote)
      this.queueOperation("insert", "notes", toSnakeCase(newNote))
      return newNote
    }
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      const noteIndex = notes.findIndex((note) => note.id === id)
      if (noteIndex === -1) return null
      notes[noteIndex] = { ...notes[noteIndex], ...updatedData }
      this.queueOperation("update", "notes", toSnakeCase(updatedData), id)
      return notes[noteIndex]
    }

    try {
      const { data, error } = await this.supabase
        .from("notes")
        .update(toSnakeCase(updatedData))
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : null
    } catch (error) {
      console.error("Error updating note in Supabase:", error)
      const noteIndex = notes.findIndex((note) => note.id === id)
      if (noteIndex === -1) return null
      notes[noteIndex] = { ...notes[noteIndex], ...updatedData }
      this.queueOperation("update", "notes", toSnakeCase(updatedData), id)
      return notes[noteIndex]
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      const noteIndex = notes.findIndex((note) => note.id === id)
      if (noteIndex === -1) return false
      notes.splice(noteIndex, 1)
      this.queueOperation("delete", "notes", null, id)
      return true
    }

    try {
      const { error } = await this.supabase.from("notes").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting note from Supabase:", error)
      const noteIndex = notes.findIndex((note) => note.id === id)
      if (noteIndex === -1) return false
      notes.splice(noteIndex, 1)
      this.queueOperation("delete", "notes", null, id)
      return true
    }
  }

  // Wishlist operations
  async getWishlistByUserId(userId: string): Promise<WishlistItem[]> {
    if (!this.useSupabase) {
      return wishlistItems.filter((item) => item.userId === userId)
    }

    try {
      const { data, error } = await this.supabase.from("wishlist_items").select("*").eq("user_id", userId)
      if (error) throw error
      return data ? data.map(toCamelCase) : []
    } catch (error) {
      console.error("Error fetching wishlist from Supabase:", error)
      return wishlistItems.filter((item) => item.userId === userId)
    }
  }

  async createWishlistItem(
    itemData: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<WishlistItem | null> {
    const newItem: WishlistItem = {
      ...itemData,
      id: `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      wishlistItems.push(newItem)
      this.queueOperation("insert", "wishlist_items", toSnakeCase(newItem))
      return newItem
    }

    try {
      const { data, error } = await this.supabase
        .from("wishlist_items")
        .insert([toSnakeCase(newItem)])
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : newItem
    } catch (error) {
      console.error("Error creating wishlist item in Supabase:", error)
      wishlistItems.push(newItem)
      this.queueOperation("insert", "wishlist_items", toSnakeCase(newItem))
      return newItem
    }
  }

  async updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (!this.useSupabase) {
      const itemIndex = wishlistItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return null
      wishlistItems[itemIndex] = { ...wishlistItems[itemIndex], ...updatedData }
      this.queueOperation("update", "wishlist_items", toSnakeCase(updatedData), id)
      return wishlistItems[itemIndex]
    }

    try {
      const { data, error } = await this.supabase
        .from("wishlist_items")
        .update(toSnakeCase(updatedData))
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : null
    } catch (error) {
      console.error("Error updating wishlist item in Supabase:", error)
      const itemIndex = wishlistItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return null
      wishlistItems[itemIndex] = { ...wishlistItems[itemIndex], ...updatedData }
      this.queueOperation("update", "wishlist_items", toSnakeCase(updatedData), id)
      return wishlistItems[itemIndex]
    }
  }

  async deleteWishlistItem(id: string): Promise<boolean> {
    if (!this.useSupabase) {
      const itemIndex = wishlistItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return false
      wishlistItems.splice(itemIndex, 1)
      this.queueOperation("delete", "wishlist_items", null, id)
      return true
    }

    try {
      const { error } = await this.supabase.from("wishlist_items").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting wishlist item from Supabase:", error)
      const itemIndex = wishlistItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return false
      wishlistItems.splice(itemIndex, 1)
      this.queueOperation("delete", "wishlist_items", null, id)
      return true
    }
  }

  // Achievement operations
  async getAchievementsByUserId(userId: string): Promise<Achievement[]> {
    if (!this.useSupabase) {
      return achievements.filter((achievement) => achievement.userId === userId)
    }

    try {
      const { data, error } = await this.supabase.from("achievements").select("*").eq("user_id", userId)
      if (error) throw error
      return data ? data.map(toCamelCase) : []
    } catch (error) {
      console.error("Error fetching achievements from Supabase:", error)
      return achievements.filter((achievement) => achievement.userId === userId)
    }
  }

  async createAchievement(achievementData: Omit<Achievement, "id">): Promise<Achievement | null> {
    const newAchievement: Achievement = {
      ...achievementData,
      id: `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    if (!this.useSupabase) {
      achievements.push(newAchievement)
      this.queueOperation("insert", "achievements", toSnakeCase(newAchievement))
      return newAchievement
    }

    try {
      const { data, error } = await this.supabase
        .from("achievements")
        .insert([toSnakeCase(newAchievement)])
        .select()
        .single()
      if (error) throw error
      return data ? toCamelCase(data) : newAchievement
    } catch (error) {
      console.error("Error creating achievement in Supabase:", error)
      achievements.push(newAchievement)
      this.queueOperation("insert", "achievements", toSnakeCase(newAchievement))
      return newAchievement
    }
  }

  // Authentication methods
  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email)
    if (user && user.password === password) {
      // Update last login
      await this.updateUser(user.id, { lastLogin: new Date().toISOString() })
      return user
    }
    return null
  }

  async registerUser(email: string, password: string, name: string): Promise<User | null> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(email)
    if (existingUser) {
      return null
    }

    // Create new user
    return await this.createUser({
      email,
      password,
      name,
      plan: "free",
      billing: "monthly",
      aiCredits: 50, // Free tier gets 50 credits
      theme: "light",
      pomodoroSettings: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakInterval: 4,
      },
      emailVerified: false,
    })
  }

  async logoutUser(): Promise<void> {
    // In a real app, you'd clear tokens, sessions, etc.
    console.log("User logged out")
  }

  // Subscription management
  async updateUserSubscription(
    userId: string,
    plan: "free" | "premium" | "pro",
    billing: "monthly" | "yearly",
  ): Promise<User | null> {
    const credits = plan === "free" ? 50 : plan === "premium" ? 150 : 1000
    const expiryDays = billing === "yearly" ? 365 : 30
    const subscriptionExpiry = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()

    return await this.updateUser(userId, {
      plan,
      billing,
      aiCredits: credits,
      subscriptionExpiry,
    })
  }

  // Process expired subscriptions
  async processExpiredSubscriptions(): Promise<void> {
    try {
      const allUsers = await this.getAllUsers()
      const now = new Date()

      for (const user of allUsers) {
        if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) < now && user.plan !== "free") {
          // Downgrade to free plan
          await this.updateUser(user.id, {
            plan: "free",
            aiCredits: 50,
            subscriptionExpiry: undefined,
          })
          console.log(`Downgraded user ${user.email} to free plan due to expired subscription`)
        }
      }
    } catch (error) {
      console.error("Error processing expired subscriptions:", error)
    }
  }

  // Send expiration warnings
  async sendExpirationWarnings(): Promise<void> {
    try {
      const allUsers = await this.getAllUsers()
      const now = new Date()
      const warningDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

      for (const user of allUsers) {
        if (
          user.subscriptionExpiry &&
          new Date(user.subscriptionExpiry) < warningDate &&
          new Date(user.subscriptionExpiry) > now &&
          user.plan !== "free"
        ) {
          // In a real app, you'd send an email here
          console.log(`Sending expiration warning to ${user.email}`)
        }
      }
    } catch (error) {
      console.error("Error sending expiration warnings:", error)
    }
  }
}

// Create and export database instance
export const db = new HybridDatabase()

// Export individual functions for compatibility
export const getAllUsers = () => db.getAllUsers()
export const getUserById = (id: string) => db.getUserById(id)
export const getUserByEmail = (email: string) => db.getUserByEmail(email)
export const createUser = (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => db.createUser(userData)
export const updateUser = (id: string, updates: Partial<User>) => db.updateUser(id, updates)
export const deleteUser = (id: string) => db.deleteUser(id)

export const getTasksByUserId = (userId: string) => db.getTasksByUserId(userId)
export const createTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => db.createTask(taskData)
export const updateTask = (id: string, updates: Partial<Task>) => db.updateTask(id, updates)
export const deleteTask = (id: string) => db.deleteTask(id)

export const getNotesByUserId = (userId: string) => db.getNotesByUserId(userId)
export const createNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => db.createNote(noteData)
export const updateNote = (id: string, updates: Partial<Note>) => db.updateNote(id, updates)
export const deleteNote = (id: string) => db.deleteNote(id)

export const getWishlistByUserId = (userId: string) => db.getWishlistByUserId(userId)
export const createWishlistItem = (itemData: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">) =>
  db.createWishlistItem(itemData)
export const updateWishlistItem = (id: string, updates: Partial<WishlistItem>) => db.updateWishlistItem(id, updates)
export const deleteWishlistItem = (id: string) => db.deleteWishlistItem(id)

export const getAchievementsByUserId = (userId: string) => db.getAchievementsByUserId(userId)
export const createAchievement = (achievementData: Omit<Achievement, "id">) => db.createAchievement(achievementData)

export const loginUser = (email: string, password: string) => db.loginUser(email, password)
export const registerUser = (email: string, password: string, name: string) => db.registerUser(email, password, name)
export const logoutUser = () => db.logoutUser()

export const updateUserSubscription = (
  userId: string,
  plan: "free" | "premium" | "pro",
  billing: "monthly" | "yearly",
) => db.updateUserSubscription(userId, plan, billing)
export const processExpiredSubscriptions = () => db.processExpiredSubscriptions()
export const sendExpirationWarnings = () => db.sendExpirationWarnings()

// Export types
export type { User, Task, Note, WishlistItem, Achievement }

// Additional compatibility exports
export const database = db
export default db
