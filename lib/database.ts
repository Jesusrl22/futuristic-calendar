// In-memory database simulation
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

// In-memory storage
const users: User[] = [
  {
    id: "1",
    email: "admin@futuretask.com",
    password: "admin123",
    name: "Administrador",
    plan: "pro",
    isAdmin: true,
    createdAt: new Date("2024-01-01"),
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
  },
  {
    id: "2",
    email: "demo@futuretask.com",
    password: "demo123",
    name: "Usuario Demo",
    plan: "free",
    isAdmin: false,
    createdAt: new Date("2024-01-15"),
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
    aiCredits: 10,
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

// Database operations
export const db = {
  // Users
  async getUsers(): Promise<User[]> {
    return users
  },

  async getUserById(id: string): Promise<User | null> {
    return users.find((user) => user.id === id) || null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return users.find((user) => user.email === email) || null
  },

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    return users[userIndex]
  },

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return tasks.filter((task) => task.userId === userId)
  },

  async createTask(taskData: Omit<Task, "id" | "createdAt">): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: (tasks.length + 1).toString(),
      createdAt: new Date(),
    }
    tasks.push(newTask)
    return newTask
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
    return tasks[taskIndex]
  },

  async deleteTask(id: string): Promise<boolean> {
    const taskIndex = tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return false

    tasks.splice(taskIndex, 1)
    return true
  },

  // Notes
  async getNotes(userId: string): Promise<Note[]> {
    return notes.filter((note) => note.userId === userId)
  },

  async createNote(noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const newNote: Note = {
      ...noteData,
      id: (notes.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    notes.push(newNote)
    return newNote
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return null

    notes[noteIndex] = { ...notes[noteIndex], ...updates, updatedAt: new Date() }
    return notes[noteIndex]
  },

  async deleteNote(id: string): Promise<boolean> {
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return false

    notes.splice(noteIndex, 1)
    return true
  },

  // Wishlist
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return wishlistItems.filter((item) => item.userId === userId)
  },

  async createWishlistItem(itemData: Omit<WishlistItem, "id" | "createdAt">): Promise<WishlistItem> {
    const newItem: WishlistItem = {
      ...itemData,
      id: (wishlistItems.length + 1).toString(),
      createdAt: new Date(),
    }
    wishlistItems.push(newItem)
    return newItem
  },

  async updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
    const itemIndex = wishlistItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) return null

    wishlistItems[itemIndex] = { ...wishlistItems[itemIndex], ...updates }
    return wishlistItems[itemIndex]
  },

  async deleteWishlistItem(id: string): Promise<boolean> {
    const itemIndex = wishlistItems.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false

    wishlistItems.splice(itemIndex, 1)
    return true
  },
}
