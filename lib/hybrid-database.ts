import { createClient } from "./supabase"
import type { Database } from "./database.types"

type Tables = Database["public"]["Tables"]
type Task = Tables["tasks"]["Row"]
type Note = Tables["notes"]["Row"]
type User = Tables["users"]["Row"]

// Hybrid database operations that work with both Supabase and local storage
export class HybridDatabase {
  private supabase = createClient()
  private isOnline = true

  constructor() {
    this.checkConnection()
  }

  private async checkConnection() {
    try {
      const { error } = await this.supabase.from("users").select("id").limit(1)
      this.isOnline = !error
    } catch {
      this.isOnline = false
    }
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    if (this.isOnline) {
      try {
        const { data, error } = await this.supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (!error && data) {
          // Cache in localStorage
          localStorage.setItem(`tasks_${userId}`, JSON.stringify(data))
          return data
        }
      } catch (error) {
        console.error("Error fetching tasks from Supabase:", error)
      }
    }

    // Fallback to localStorage
    const cached = localStorage.getItem(`tasks_${userId}`)
    return cached ? JSON.parse(cached) : []
  }

  async createTask(
    userId: string,
    task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Task | null> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: task.title,
      description: task.description,
      completed: false,
      priority: task.priority || "medium",
      due_date: task.due_date,
      category: task.category,
      tags: task.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (this.isOnline) {
      try {
        const { data, error } = await this.supabase.from("tasks").insert([newTask]).select().single()

        if (!error && data) {
          return data
        }
      } catch (error) {
        console.error("Error creating task in Supabase:", error)
      }
    }

    // Fallback to localStorage
    const tasks = await this.getTasks(userId)
    const updatedTasks = [newTask, ...tasks]
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
    return newTask
  }

  async updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> {
    if (this.isOnline) {
      try {
        const { data, error } = await this.supabase
          .from("tasks")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", taskId)
          .eq("user_id", userId)
          .select()
          .single()

        if (!error && data) {
          return data
        }
      } catch (error) {
        console.error("Error updating task in Supabase:", error)
      }
    }

    // Fallback to localStorage
    const tasks = await this.getTasks(userId)
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task,
    )
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks))
    return updatedTasks.find((t) => t.id === taskId) || null
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    if (this.isOnline) {
      try {
        const { error } = await this.supabase.from("tasks").delete().eq("id", taskId).eq("user_id", userId)

        if (!error) {
          return true
        }
      } catch (error) {
        console.error("Error deleting task in Supabase:", error)
      }
    }

    // Fallback to localStorage
    const tasks = await this.getTasks(userId)
    const filteredTasks = tasks.filter((task) => task.id !== taskId)
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(filteredTasks))
    return true
  }

  // Notes
  async getNotes(userId: string): Promise<Note[]> {
    if (this.isOnline) {
      try {
        const { data, error } = await this.supabase
          .from("notes")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })

        if (!error && data) {
          localStorage.setItem(`notes_${userId}`, JSON.stringify(data))
          return data
        }
      } catch (error) {
        console.error("Error fetching notes from Supabase:", error)
      }
    }

    const cached = localStorage.getItem(`notes_${userId}`)
    return cached ? JSON.parse(cached) : []
  }

  async createNote(
    userId: string,
    note: Omit<Note, "id" | "user_id" | "created_at" | "updated_at">,
  ): Promise<Note | null> {
    const newNote: Note = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      category: note.category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (this.isOnline) {
      try {
        const { data, error } = await this.supabase.from("notes").insert([newNote]).select().single()

        if (!error && data) {
          return data
        }
      } catch (error) {
        console.error("Error creating note in Supabase:", error)
      }
    }

    const notes = await this.getNotes(userId)
    const updatedNotes = [newNote, ...notes]
    localStorage.setItem(`notes_${userId}`, JSON.stringify(updatedNotes))
    return newNote
  }

  // Sync operations
  async syncToServer(userId: string): Promise<void> {
    if (!this.isOnline) return

    try {
      // Sync tasks
      const localTasks = localStorage.getItem(`tasks_${userId}`)
      if (localTasks) {
        const tasks = JSON.parse(localTasks)
        for (const task of tasks) {
          await this.supabase.from("tasks").upsert(task)
        }
      }

      // Sync notes
      const localNotes = localStorage.getItem(`notes_${userId}`)
      if (localNotes) {
        const notes = JSON.parse(localNotes)
        for (const note of notes) {
          await this.supabase.from("notes").upsert(note)
        }
      }
    } catch (error) {
      console.error("Error syncing to server:", error)
    }
  }

  // Connection status
  getConnectionStatus(): boolean {
    return this.isOnline
  }
}

// Export singleton instance
export const db = new HybridDatabase()

// Export individual functions for compatibility
export const getTasks = (userId: string) => db.getTasks(userId)
export const createTask = (userId: string, task: any) => db.createTask(userId, task)
export const updateTask = (userId: string, taskId: string, updates: any) => db.updateTask(userId, taskId, updates)
export const deleteTask = (userId: string, taskId: string) => db.deleteTask(userId, taskId)
export const getNotes = (userId: string) => db.getNotes(userId)
export const createNote = (userId: string, note: any) => db.createNote(userId, note)
export const syncToServer = (userId: string) => db.syncToServer(userId)
