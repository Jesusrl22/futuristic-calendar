import { createClient } from "@/lib/supabase"

// Types
export interface User {
  id: string
  email: string
  password: string
  name: string
  plan: "free" | "premium" | "pro"
  isAdmin: boolean
  createdAt: Date
  settings: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    language: "es" | "en"
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
  emailVerified?: boolean
  verificationToken?: string
  subscriptionId?: string
  subscriptionStatus?: string
  subscriptionExpiresAt?: Date
  billingCycle?: "monthly" | "yearly"
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate: Date | null
  createdAt: Date
  category: string
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  category: string
}

export interface WishlistItem {
  id: string
  userId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  estimatedCost: number
  category: string
  createdAt: Date
  achieved: boolean
}

export interface Subscription {
  id: string
  userId: string
  plan: "free" | "premium" | "pro"
  status: "active" | "cancelled" | "expired" | "pending"
  billingCycle: "monthly" | "yearly"
  amount: number
  currency: string
  paypalSubscriptionId?: string
  createdAt: Date
  expiresAt: Date
  cancelledAt?: Date
  renewalReminded?: boolean
}

// In-memory storage for fallback
const users: User[] = [
  {
    id: "1",
    email: "admin@futuretask.com",
    password: "admin123",
    name: "Administrador",
    plan: "pro",
    isAdmin: true,
    createdAt: new Date("2024-01-01"),
    emailVerified: true,
    settings: {
      theme: "system",
      notifications: true,
      language: "es",
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
    },
    stats: {
      tasksCompleted: 45,
      notesCreated: 23,
      wishlistItems: 8,
      achievementsUnlocked: 12,
      totalSessions: 89,
      streakDays: 7,
    },
    achievements: ["first_task", "task_master", "note_taker", "wishlist_creator", "streak_week"],
    aiCredits: 1000,
    subscriptionStatus: "active",
    billingCycle: "yearly",
  },
  {
    id: "2",
    email: "premium@futuretask.com",
    password: "premium123",
    name: "Usuario Premium",
    plan: "premium",
    isAdmin: false,
    createdAt: new Date("2024-01-15"),
    emailVerified: true,
    settings: {
      theme: "dark",
      notifications: true,
      language: "es",
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
    },
    stats: {
      tasksCompleted: 28,
      notesCreated: 15,
      wishlistItems: 5,
      achievementsUnlocked: 8,
      totalSessions: 45,
      streakDays: 5,
    },
    achievements: ["first_task", "task_master", "note_taker"],
    aiCredits: 150,
    subscriptionStatus: "active",
    billingCycle: "monthly",
  },
  {
    id: "3",
    email: "demo@futuretask.com",
    password: "demo123",
    name: "Usuario Demo",
    plan: "free",
    isAdmin: false,
    createdAt: new Date("2024-01-15"),
    emailVerified: true,
    settings: {
      theme: "light",
      notifications: true,
      language: "es",
      pomodoroTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
    },
    stats: {
      tasksCompleted: 12,
      notesCreated: 5,
      wishlistItems: 3,
      achievementsUnlocked: 4,
      totalSessions: 25,
      streakDays: 3,
    },
    achievements: ["first_task", "note_taker"],
    aiCredits: 50,
    subscriptionStatus: "active",
    billingCycle: "monthly",
  },
]

const tasks: Task[] = [
  {
    id: "1",
    userId: "1",
    title: "Revisar reportes mensuales",
    description: "Analizar los reportes de ventas del mes anterior",
    completed: false,
    priority: "high",
    dueDate: new Date("2024-12-25"),
    createdAt: new Date("2024-12-20"),
    category: "Trabajo",
  },
  {
    id: "2",
    userId: "1",
    title: "Planificar vacaciones",
    description: "Buscar destinos y hacer reservas",
    completed: false,
    priority: "medium",
    dueDate: new Date("2024-12-30"),
    createdAt: new Date("2024-12-18"),
    category: "Personal",
  },
  {
    id: "3",
    userId: "2",
    title: "Estudiar React",
    description: "Completar el curso de React avanzado",
    completed: true,
    priority: "high",
    dueDate: new Date("2024-12-22"),
    createdAt: new Date("2024-12-15"),
    category: "Educación",
  },
]

const notes: Note[] = [
  {
    id: "1",
    userId: "1",
    title: "Ideas para el proyecto",
    content: "Lista de funcionalidades nuevas para implementar en el próximo sprint.",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    category: "Trabajo",
  },
  {
    id: "2",
    userId: "2",
    title: "Receta de pasta",
    content: "Ingredientes: pasta, tomate, albahaca, ajo, aceite de oliva.",
    createdAt: new Date("2024-12-19"),
    updatedAt: new Date("2024-12-19"),
    category: "Cocina",
  },
]

const wishlistItems: WishlistItem[] = [
  {
    id: "1",
    userId: "1",
    title: "MacBook Pro M3",
    description: "Nueva laptop para desarrollo",
    priority: "high",
    estimatedCost: 2500,
    category: "Tecnología",
    createdAt: new Date("2024-12-15"),
    achieved: false,
  },
  {
    id: "2",
    userId: "2",
    title: "Curso de TypeScript",
    description: "Curso avanzado de TypeScript",
    priority: "medium",
    estimatedCost: 99,
    category: "Educación",
    createdAt: new Date("2024-12-18"),
    achieved: false,
  },
]

const subscriptions: Subscription[] = [
  {
    id: "sub_1",
    userId: "1",
    plan: "pro",
    status: "active",
    billingCycle: "yearly",
    amount: 99.99,
    currency: "EUR",
    createdAt: new Date("2024-01-01"),
    expiresAt: new Date("2025-01-01"),
  },
  {
    id: "sub_2",
    userId: "2",
    plan: "premium",
    status: "active",
    billingCycle: "monthly",
    amount: 9.99,
    currency: "EUR",
    createdAt: new Date("2024-01-15"),
    expiresAt: new Date("2024-12-31"),
  },
]

// Helper function to check if Supabase is available
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("users").select("count", { count: "exact", head: true })
    return !error
  } catch {
    return false
  }
}

// Database operations
export const db = {
  // Users
  async getUsers(): Promise<User[]> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("users").select("*")
        if (!error && data) {
          return data.map((user) => ({
            ...user,
            createdAt: new Date(user.created_at),
            settings: user.settings || {
              theme: "light",
              notifications: true,
              language: "es",
              pomodoroTime: 25,
              shortBreakTime: 5,
              longBreakTime: 15,
            },
            stats: user.stats || {
              tasksCompleted: 0,
              notesCreated: 0,
              wishlistItems: 0,
              achievementsUnlocked: 0,
              totalSessions: 0,
              streakDays: 0,
            },
            achievements: user.achievements || [],
            aiCredits: user.ai_credits || 0,
          }))
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return users
  },

  async getAllUsers(): Promise<User[]> {
    return await this.getUsers()
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("users").select("*").eq("id", id).single()
        if (!error && data) {
          return {
            ...data,
            createdAt: new Date(data.created_at),
            settings: data.settings || {
              theme: "light",
              notifications: true,
              language: "es",
              pomodoroTime: 25,
              shortBreakTime: 5,
              longBreakTime: 15,
            },
            stats: data.stats || {
              tasksCompleted: 0,
              notesCreated: 0,
              wishlistItems: 0,
              achievementsUnlocked: 0,
              totalSessions: 0,
              streakDays: 0,
            },
            achievements: data.achievements || [],
            aiCredits: data.ai_credits || 0,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return users.find((user) => user.id === id) || null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
        if (!error && data) {
          return {
            ...data,
            createdAt: new Date(data.created_at),
            settings: data.settings || {
              theme: "light",
              notifications: true,
              language: "es",
              pomodoroTime: 25,
              shortBreakTime: 5,
              longBreakTime: 15,
            },
            stats: data.stats || {
              tasksCompleted: 0,
              notesCreated: 0,
              wishlistItems: 0,
              achievementsUnlocked: 0,
              totalSessions: 0,
              streakDays: 0,
            },
            achievements: data.achievements || [],
            aiCredits: data.ai_credits || 0,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return users.find((user) => user.email === email) || null
  },

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date(),
    }

    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("users")
          .insert({
            email: newUser.email,
            password: newUser.password,
            name: newUser.name,
            plan: newUser.plan,
            is_admin: newUser.isAdmin,
            settings: newUser.settings,
            stats: newUser.stats,
            achievements: newUser.achievements,
            ai_credits: newUser.aiCredits,
            email_verified: newUser.emailVerified || false,
          })
          .select()
          .single()

        if (!error && data) {
          return {
            ...data,
            createdAt: new Date(data.created_at),
            isAdmin: data.is_admin,
            aiCredits: data.ai_credits,
            emailVerified: data.email_verified,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    users.push(newUser)
    return newUser
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const updateData: any = { ...updates }

        // Map field names for Supabase
        if (updates.isAdmin !== undefined) {
          updateData.is_admin = updates.isAdmin
          delete updateData.isAdmin
        }
        if (updates.aiCredits !== undefined) {
          updateData.ai_credits = updates.aiCredits
          delete updateData.aiCredits
        }
        if (updates.emailVerified !== undefined) {
          updateData.email_verified = updates.emailVerified
          delete updateData.emailVerified
        }

        const { data, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

        if (!error && data) {
          return {
            ...data,
            createdAt: new Date(data.created_at),
            isAdmin: data.is_admin,
            aiCredits: data.ai_credits,
            emailVerified: data.email_verified,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    return users[userIndex]
  },

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("tasks").select("*").eq("user_id", userId)
        if (!error && data) {
          return data.map((task) => ({
            ...task,
            userId: task.user_id,
            createdAt: new Date(task.created_at),
            dueDate: task.due_date ? new Date(task.due_date) : null,
          }))
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return tasks.filter((task) => task.userId === userId)
  },

  async createTask(taskData: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: (tasks.length + 1).toString(),
      createdAt: new Date(),
    }

    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            user_id: taskData.userId,
            title: taskData.title,
            description: taskData.description,
            completed: taskData.completed,
            priority: taskData.priority,
            due_date: taskData.dueDate?.toISOString(),
            category: taskData.category,
          })
          .select()
          .single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            createdAt: new Date(data.created_at),
            dueDate: data.due_date ? new Date(data.due_date) : null,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    tasks.push(newTask)
    return newTask
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const updateData: any = { ...updates }

        // Map field names for Supabase
        if (updates.userId !== undefined) {
          updateData.user_id = updates.userId
          delete updateData.userId
        }
        if (updates.dueDate !== undefined) {
          updateData.due_date = updates.dueDate?.toISOString()
          delete updateData.dueDate
        }

        const { data, error } = await supabase.from("tasks").update(updateData).eq("id", id).select().single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            createdAt: new Date(data.created_at),
            dueDate: data.due_date ? new Date(data.due_date) : null,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
    return tasks[taskIndex]
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { error } = await supabase.from("tasks").delete().eq("id", id)
        return !error
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return false

    tasks.splice(taskIndex, 1)
    return true
  },

  // Notes
  async getNotes(userId: string): Promise<Note[]> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("notes").select("*").eq("user_id", userId)
        if (!error && data) {
          return data.map((note) => ({
            ...note,
            userId: note.user_id,
            createdAt: new Date(note.created_at),
            updatedAt: new Date(note.updated_at),
          }))
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return notes.filter((note) => note.userId === userId)
  },

  async createNote(noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const newNote: Note = {
      ...noteData,
      id: (notes.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("notes")
          .insert({
            user_id: noteData.userId,
            title: noteData.title,
            content: noteData.content,
            category: noteData.category,
          })
          .select()
          .single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    notes.push(newNote)
    return newNote
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const updateData: any = { ...updates, updated_at: new Date().toISOString() }

        // Map field names for Supabase
        if (updates.userId !== undefined) {
          updateData.user_id = updates.userId
          delete updateData.userId
        }

        const { data, error } = await supabase.from("notes").update(updateData).eq("id", id).select().single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return null

    notes[noteIndex] = { ...notes[noteIndex], ...updates, updatedAt: new Date() }
    return notes[noteIndex]
  },

  async deleteNote(id: string): Promise<boolean> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { error } = await supabase.from("notes").delete().eq("id", id)
        return !error
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return false

    notes.splice(noteIndex, 1)
    return true
  },

  // Wishlist
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("wishlist_items").select("*").eq("user_id", userId)
        if (!error && data) {
          return data.map((item) => ({
            ...item,
            userId: item.user_id,
            estimatedCost: item.estimated_cost,
            createdAt: new Date(item.created_at),
          }))
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return wishlistItems.filter((item) => item.userId === userId)
  },

  async createWishlistItem(itemData: Omit<WishlistItem, "id" | "createdAt">): Promise<WishlistItem> {
    const newItem: WishlistItem = {
      ...itemData,
      id: (wishlistItems.length + 1).toString(),
      createdAt: new Date(),
    }

    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("wishlist_items")
          .insert({
            user_id: itemData.userId,
            title: itemData.title,
            description: itemData.description,
            priority: itemData.priority,
            estimated_cost: itemData.estimatedCost,
            category: itemData.category,
            achieved: itemData.achieved,
          })
          .select()
          .single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            estimatedCost: data.estimated_cost,
            createdAt: new Date(data.created_at),
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    wishlistItems.push(newItem)
    return newItem
  },

  async updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const updateData: any = { ...updates }

        // Map field names for Supabase
        if (updates.userId !== undefined) {
          updateData.user_id = updates.userId
          delete updateData.userId
        }
        if (updates.estimatedCost !== undefined) {
          updateData.estimated_cost = updates.estimatedCost
          delete updateData.estimatedCost
        }

        const { data, error } = await supabase.from("wishlist_items").update(updateData).eq("id", id).select().single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            estimatedCost: data.estimated_cost,
            createdAt: new Date(data.created_at),
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const itemIndex = wishlistItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) return null

    wishlistItems[itemIndex] = { ...wishlistItems[itemIndex], ...updates }
    return wishlistItems[itemIndex]
  },

  async deleteWishlistItem(id: string): Promise<boolean> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { error } = await supabase.from("wishlist_items").delete().eq("id", id)
        return !error
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback storage:", error)
    }

    const itemIndex = wishlistItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false

    wishlistItems.splice(itemIndex, 1)
    return true
  },

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase.from("subscriptions").select("*")
        if (!error && data) {
          return data.map((sub) => ({
            ...sub,
            userId: sub.user_id,
            billingCycle: sub.billing_cycle,
            paypalSubscriptionId: sub.paypal_subscription_id,
            createdAt: new Date(sub.created_at),
            expiresAt: new Date(sub.expires_at),
            cancelledAt: sub.cancelled_at ? new Date(sub.cancelled_at) : undefined,
            renewalReminded: sub.renewal_reminded,
          }))
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return subscriptions
  },

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      if (await isSupabaseAvailable()) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "active")
          .single()

        if (!error && data) {
          return {
            ...data,
            userId: data.user_id,
            billingCycle: data.billing_cycle,
            paypalSubscriptionId: data.paypal_subscription_id,
            createdAt: new Date(data.created_at),
            expiresAt: new Date(data.expires_at),
            cancelledAt: data.cancelled_at ? new Date(data.cancelled_at) : undefined,
            renewalReminded: data.renewal_reminded,
          }
        }
      }
    } catch (error) {
      console.warn("Supabase unavailable, using fallback data:", error)
    }
    return subscriptions.find((sub) => sub.userId === userId && sub.status === "active") || null
  },
}

// Subscription management functions
export async function processExpiredSubscriptions(): Promise<void> {
  try {
    const now = new Date()
    const allSubscriptions = await db.getSubscriptions()

    for (const subscription of allSubscriptions) {
      if (subscription.status === "active" && subscription.expiresAt < now) {
        // Mark subscription as expired
        if (await isSupabaseAvailable()) {
          const supabase = createClient()
          await supabase.from("subscriptions").update({ status: "expired" }).eq("id", subscription.id)
        }

        // Downgrade user to free plan
        await db.updateUser(subscription.userId, {
          plan: "free",
          aiCredits: 50, // Reset to free tier credits
        })

        console.log(`Subscription ${subscription.id} expired for user ${subscription.userId}`)
      }
    }
  } catch (error) {
    console.error("Error processing expired subscriptions:", error)
  }
}

export async function sendExpirationWarnings(): Promise<void> {
  try {
    const now = new Date()
    const warningDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    const allSubscriptions = await db.getSubscriptions()

    for (const subscription of allSubscriptions) {
      if (
        subscription.status === "active" &&
        subscription.expiresAt <= warningDate &&
        subscription.expiresAt > now &&
        !subscription.renewalReminded
      ) {
        // Send warning email (in a real app, you'd use an email service)
        console.log(`Sending expiration warning to user ${subscription.userId}`)

        // Mark as reminded
        if (await isSupabaseAvailable()) {
          const supabase = createClient()
          await supabase.from("subscriptions").update({ renewal_reminded: true }).eq("id", subscription.id)
        }
      }
    }
  } catch (error) {
    console.error("Error sending expiration warnings:", error)
  }
}

// Export all functions
export { db as default }
export const getAllUsers = db.getAllUsers
export const updateUser = db.updateUser
