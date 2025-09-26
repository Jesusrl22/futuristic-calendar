import { supabase, isSupabaseConfigured } from "./supabase"

// Types
export interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro"
  aiCredits: number
  createdAt: Date
  updatedAt: Date
  isEmailVerified?: boolean
  subscriptionId?: string
  subscriptionStatus?: string
  subscriptionExpiresAt?: Date
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  category?: string
  tags?: string[]
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  category?: string
}

export interface WishlistItem {
  id: string
  userId: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: Date
  updatedAt: Date
  category?: string
  estimatedCost?: number
}

// Memory storage fallback
const memoryStorage = {
  users: new Map<string, User>(),
  tasks: new Map<string, Task>(),
  notes: new Map<string, Note>(),
  wishlist: new Map<string, WishlistItem>(),
}

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function convertToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(convertToSnakeCase)
  if (typeof obj !== "object") return obj

  const converted: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    converted[snakeKey] = convertToSnakeCase(value)
  }
  return converted
}

function convertToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(convertToCamelCase)
  if (typeof obj !== "object") return obj

  const converted: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    converted[camelKey] = convertToCamelCase(value)
  }
  return converted
}

// Database operations
export class HybridDatabase {
  // User operations
  static async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      id: generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("users")
          .insert([convertToSnakeCase(user)])
          .select()
          .single()

        if (error) throw error
        console.log("✅ User created in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to create user in Supabase:", error)
      }
    }

    // Fallback to memory storage
    memoryStorage.users.set(user.id, user)
    console.log("💾 User created in memory storage:", user)
    return user
  }

  static async getUserById(id: string): Promise<User | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

        if (error && error.code !== "PGRST116") throw error
        if (data) {
          console.log("✅ User found in Supabase:", data)
          return convertToCamelCase(data)
        }
      } catch (error) {
        console.error("❌ Failed to get user from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const user = memoryStorage.users.get(id) || null
    console.log("💾 User retrieved from memory storage:", user)
    return user
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("users")
          .update(convertToSnakeCase(updateData))
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        console.log("✅ User updated in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to update user in Supabase:", error)
      }
    }

    // Fallback to memory storage
    const existingUser = memoryStorage.users.get(id)
    if (existingUser) {
      const updatedUser = { ...existingUser, ...updateData }
      memoryStorage.users.set(id, updatedUser)
      console.log("💾 User updated in memory storage:", updatedUser)
      return updatedUser
    }

    return null
  }

  // Task operations
  static async createTask(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
    const task: Task = {
      id: generateId(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert([convertToSnakeCase(task)])
          .select()
          .single()

        if (error) throw error
        console.log("✅ Task created in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to create task in Supabase:", error)
      }
    }

    // Fallback to memory storage
    memoryStorage.tasks.set(task.id, task)
    console.log("💾 Task created in memory storage:", task)
    return task
  }

  static async getTasksByUserId(userId: string): Promise<Task[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        console.log("✅ Tasks retrieved from Supabase:", data?.length || 0)
        return data ? data.map(convertToCamelCase) : []
      } catch (error) {
        console.error("❌ Failed to get tasks from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const tasks = Array.from(memoryStorage.tasks.values())
      .filter((task) => task.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    console.log("💾 Tasks retrieved from memory storage:", tasks.length)
    return tasks
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .update(convertToSnakeCase(updateData))
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        console.log("✅ Task updated in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to update task in Supabase:", error)
      }
    }

    // Fallback to memory storage
    const existingTask = memoryStorage.tasks.get(id)
    if (existingTask) {
      const updatedTask = { ...existingTask, ...updateData }
      memoryStorage.tasks.set(id, updatedTask)
      console.log("💾 Task updated in memory storage:", updatedTask)
      return updatedTask
    }

    return null
  }

  static async deleteTask(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("tasks").delete().eq("id", id)

        if (error) throw error
        console.log("✅ Task deleted from Supabase:", id)
        return true
      } catch (error) {
        console.error("❌ Failed to delete task from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const deleted = memoryStorage.tasks.delete(id)
    console.log("💾 Task deleted from memory storage:", deleted)
    return deleted
  }

  // Note operations
  static async createNote(noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const note: Note = {
      id: generateId(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notes")
          .insert([convertToSnakeCase(note)])
          .select()
          .single()

        if (error) throw error
        console.log("✅ Note created in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to create note in Supabase:", error)
      }
    }

    // Fallback to memory storage
    memoryStorage.notes.set(note.id, note)
    console.log("💾 Note created in memory storage:", note)
    return note
  }

  static async getNotesByUserId(userId: string): Promise<Note[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        console.log("✅ Notes retrieved from Supabase:", data?.length || 0)
        return data ? data.map(convertToCamelCase) : []
      } catch (error) {
        console.error("❌ Failed to get notes from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const notes = Array.from(memoryStorage.notes.values())
      .filter((note) => note.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    console.log("💾 Notes retrieved from memory storage:", notes.length)
    return notes
  }

  static async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notes")
          .update(convertToSnakeCase(updateData))
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        console.log("✅ Note updated in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to update note in Supabase:", error)
      }
    }

    // Fallback to memory storage
    const existingNote = memoryStorage.notes.get(id)
    if (existingNote) {
      const updatedNote = { ...existingNote, ...updateData }
      memoryStorage.notes.set(id, updatedNote)
      console.log("💾 Note updated in memory storage:", updatedNote)
      return updatedNote
    }

    return null
  }

  static async deleteNote(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("notes").delete().eq("id", id)

        if (error) throw error
        console.log("✅ Note deleted from Supabase:", id)
        return true
      } catch (error) {
        console.error("❌ Failed to delete note from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const deleted = memoryStorage.notes.delete(id)
    console.log("💾 Note deleted from memory storage:", deleted)
    return deleted
  }

  // Wishlist operations
  static async createWishlistItem(
    itemData: Omit<WishlistItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<WishlistItem> {
    const item: WishlistItem = {
      id: generateId(),
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("wishlist_items")
          .insert([convertToSnakeCase(item)])
          .select()
          .single()

        if (error) throw error
        console.log("✅ Wishlist item created in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to create wishlist item in Supabase:", error)
      }
    }

    // Fallback to memory storage
    memoryStorage.wishlist.set(item.id, item)
    console.log("💾 Wishlist item created in memory storage:", item)
    return item
  }

  static async getWishlistByUserId(userId: string): Promise<WishlistItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("wishlist_items")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        console.log("✅ Wishlist items retrieved from Supabase:", data?.length || 0)
        return data ? data.map(convertToCamelCase) : []
      } catch (error) {
        console.error("❌ Failed to get wishlist items from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const items = Array.from(memoryStorage.wishlist.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    console.log("💾 Wishlist items retrieved from memory storage:", items.length)
    return items
  }

  static async updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("wishlist_items")
          .update(convertToSnakeCase(updateData))
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        console.log("✅ Wishlist item updated in Supabase:", data)
        return convertToCamelCase(data)
      } catch (error) {
        console.error("❌ Failed to update wishlist item in Supabase:", error)
      }
    }

    // Fallback to memory storage
    const existingItem = memoryStorage.wishlist.get(id)
    if (existingItem) {
      const updatedItem = { ...existingItem, ...updateData }
      memoryStorage.wishlist.set(id, updatedItem)
      console.log("💾 Wishlist item updated in memory storage:", updatedItem)
      return updatedItem
    }

    return null
  }

  static async deleteWishlistItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("wishlist_items").delete().eq("id", id)

        if (error) throw error
        console.log("✅ Wishlist item deleted from Supabase:", id)
        return true
      } catch (error) {
        console.error("❌ Failed to delete wishlist item from Supabase:", error)
      }
    }

    // Fallback to memory storage
    const deleted = memoryStorage.wishlist.delete(id)
    console.log("💾 Wishlist item deleted from memory storage:", deleted)
    return deleted
  }

  // Initialize demo user
  static async initializeDemoUser(): Promise<User> {
    const demoUserId = "demo-user"

    // Check if demo user already exists
    let demoUser = await this.getUserById(demoUserId)

    if (!demoUser) {
      // Create demo user
      demoUser = await this.createUser({
        id: demoUserId,
        email: "demo@futuretask.com",
        name: "Usuario Demo",
        plan: "free",
        aiCredits: 10,
        isEmailVerified: true,
      })

      // Create some demo tasks
      await this.createTask({
        userId: demoUserId,
        title: "Bienvenido a FutureTask",
        description: "Explora todas las funcionalidades de nuestra aplicación",
        completed: false,
        priority: "high",
        category: "Personal",
        tags: ["bienvenida", "tutorial"],
      })

      await this.createTask({
        userId: demoUserId,
        title: "Configurar tu perfil",
        description: "Personaliza tu experiencia en FutureTask",
        completed: false,
        priority: "medium",
        category: "Configuración",
      })

      // Create demo note
      await this.createNote({
        userId: demoUserId,
        title: "Mis primeras notas",
        content:
          "Esta es tu primera nota en FutureTask. Puedes usar este espacio para guardar ideas, recordatorios o cualquier información importante.",
        category: "Personal",
        tags: ["notas", "inicio"],
      })

      // Create demo wishlist item
      await this.createWishlistItem({
        userId: demoUserId,
        title: "Aprender una nueva habilidad",
        description: "Dedicar tiempo a desarrollar una nueva competencia profesional",
        priority: "medium",
        completed: false,
        category: "Desarrollo Personal",
        estimatedCost: 0,
      })

      console.log("✅ Demo user and data initialized successfully")
    }

    return demoUser
  }
}

// Initialize demo user on module load
if (typeof window !== "undefined") {
  HybridDatabase.initializeDemoUser().catch(console.error)
}

export default HybridDatabase

// Export db instance for compatibility
export const db = HybridDatabase

// Export updateUserSubscription function
export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    subscriptionId?: string
    subscriptionStatus?: string
    subscriptionExpiresAt?: Date
    plan?: "free" | "pro"
  },
): Promise<User | null> {
  return await HybridDatabase.updateUser(userId, subscriptionData)
}
