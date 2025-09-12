import {
  supabase,
  isSupabaseAvailable,
  type User,
  type Task,
  type WishlistItem,
  type Note,
  type Achievement,
} from "./supabase"

// Mock data for fallback
const mockUsers: User[] = [
  {
    id: "admin-mock-id",
    name: "Admin User",
    email: "admin@futuretask.com",
    password: "535353-Jrl",
    language: "es",
    theme: "dark",
    is_premium: true,
    is_pro: true,
    onboarding_completed: true,
    pomodoro_sessions: 0,
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ai_credits: 1000,
    ai_credits_used: 0,
    ai_total_cost_eur: 0,
  },
  {
    id: "demo-mock-id",
    name: "Demo User",
    email: "demo@futuretask.com",
    password: "demo123",
    language: "es",
    theme: "light",
    is_premium: false,
    is_pro: false,
    onboarding_completed: true,
    pomodoro_sessions: 5,
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "jesus-mock-id",
    name: "Jesus Rayale",
    email: "jesusrayaleon1@gmail.com",
    password: "jesus123",
    language: "es",
    theme: "dark",
    is_premium: true,
    is_pro: true,
    onboarding_completed: true,
    pomodoro_sessions: 15,
    work_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    sessions_until_long_break: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ai_credits: 1000,
    ai_credits_used: 50,
    ai_total_cost_eur: 2.5,
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    user_id: "demo-mock-id",
    text: "Completar proyecto de calendario",
    description: "Finalizar todas las funcionalidades del calendario futurista",
    completed: false,
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    category: "work",
    priority: "high",
    notification_enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-mock-id",
    text: "Revisar documentación",
    completed: true,
    date: new Date().toISOString().split("T")[0],
    category: "work",
    priority: "medium",
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockWishlist: WishlistItem[] = [
  {
    id: "1",
    user_id: "demo-mock-id",
    text: "Aprender React avanzado",
    description: "Dominar hooks, context y patrones avanzados",
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockNotes: Note[] = [
  {
    id: "1",
    user_id: "demo-mock-id",
    title: "Ideas para el proyecto",
    content: "- Implementar notificaciones push\n- Agregar modo offline\n- Mejorar la UI/UX",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockAchievements: Achievement[] = [
  {
    id: "1",
    user_id: "demo-mock-id",
    type: "task_completion",
    title: "Primera tarea completada",
    description: "Has completado tu primera tarea",
    unlocked_at: new Date().toISOString(),
  },
]

// User operations
export async function getAllUsers(): Promise<User[]> {
  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock users (Supabase not available)")
    return mockUsers
  }

  try {
    const { data, error } = await supabase.from("users").select("*")
    if (error) throw error
    return data || mockUsers
  } catch (error) {
    console.error("Error fetching users:", error)
    return mockUsers
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  // Always check mock data first for development
  const mockUser = mockUsers.find((user) => user.email === email)

  if (!isSupabaseAvailable || !supabase) {
    console.log(`📦 Using mock user for ${email}`)
    return mockUser || null
  }

  try {
    // Use a more defensive approach - get all matching users and take the first one
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }

    // If we have data, return the first user
    if (data && Array.isArray(data) && data.length > 0) {
      console.log(`✅ Found user in database: ${email}`)
      return data[0]
    }

    // No user found in database, return mock if available
    if (mockUser) {
      console.log(`📦 Falling back to mock user for ${email}`)
      return mockUser
    }

    console.log(`❌ No user found for ${email}`)
    return null
  } catch (error) {
    console.error("Error fetching user by email:", error)

    // Fallback to mock data on any error
    if (mockUser) {
      console.log(`📦 Error fallback to mock user for ${email}`)
      return mockUser
    }

    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  // Check mock data first
  const mockUser = mockUsers.find((user) => user.id === id)

  if (!isSupabaseAvailable || !supabase) {
    return mockUser || null
  }

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", id)

    if (error) throw error

    if (data && Array.isArray(data) && data.length > 0) {
      return data[0]
    }

    return mockUser || null
  } catch (error) {
    console.error("Error fetching user by id:", error)
    return mockUser || null
  }
}

export async function createUser(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  if (!isSupabaseAvailable || !supabase) {
    const newUser: User = {
      ...user,
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    console.log(`📦 Created mock user: ${user.email}`)
    return newUser
  }

  try {
    const { data, error } = await supabase.from("users").insert([user]).select()

    if (error) throw error

    if (data && Array.isArray(data) && data.length > 0) {
      console.log(`✅ Created user in database: ${user.email}`)
      return data[0]
    }

    throw new Error("No data returned from insert")
  } catch (error) {
    console.error("Error creating user:", error)

    // Fallback to mock creation
    const newUser: User = {
      ...user,
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    console.log(`📦 Created fallback mock user: ${user.email}`)
    return newUser
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  if (!isSupabaseAvailable || !supabase) {
    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockUsers[userIndex]
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) throw error

    if (data && Array.isArray(data) && data.length > 0) {
      return data[0]
    }

    return null
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Task operations
export async function getTasksByUserId(userId: string): Promise<Task[]> {
  if (!isSupabaseAvailable || !supabase) {
    return mockTasks.filter((task) => task.user_id === userId)
  }

  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("user_id", userId)
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return mockTasks.filter((task) => task.user_id === userId)
  }
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  if (!isSupabaseAvailable || !supabase) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockTasks.push(newTask)
    return newTask
  }

  try {
    const { data, error } = await supabase.from("tasks").insert([task]).select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : (task as Task)
  } catch (error) {
    console.error("Error creating task:", error)
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockTasks.push(newTask)
    return newTask
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  if (!isSupabaseAvailable || !supabase) {
    const taskIndex = mockTasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockTasks[taskIndex]
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Error updating task:", error)
    return null
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  if (!isSupabaseAvailable || !supabase) {
    const taskIndex = mockTasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return false
    mockTasks.splice(taskIndex, 1)
    return true
  }

  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting task:", error)
    return false
  }
}

// Wishlist operations
export async function getWishlistByUserId(userId: string): Promise<WishlistItem[]> {
  if (!isSupabaseAvailable || !supabase) {
    return mockWishlist.filter((item) => item.user_id === userId)
  }

  try {
    const { data, error } = await supabase.from("wishlist").select("*").eq("user_id", userId)
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return mockWishlist.filter((item) => item.user_id === userId)
  }
}

export async function createWishlistItem(
  item: Omit<WishlistItem, "id" | "created_at" | "updated_at">,
): Promise<WishlistItem> {
  if (!isSupabaseAvailable || !supabase) {
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockWishlist.push(newItem)
    return newItem
  }

  try {
    const { data, error } = await supabase.from("wishlist").insert([item]).select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : (item as WishlistItem)
  } catch (error) {
    console.error("Error creating wishlist item:", error)
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockWishlist.push(newItem)
    return newItem
  }
}

export async function updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
  if (!isSupabaseAvailable || !supabase) {
    const itemIndex = mockWishlist.findIndex((item) => item.id === id)
    if (itemIndex === -1) return null

    mockWishlist[itemIndex] = {
      ...mockWishlist[itemIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockWishlist[itemIndex]
  }

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Error updating wishlist item:", error)
    return null
  }
}

export async function deleteWishlistItem(id: string): Promise<boolean> {
  if (!isSupabaseAvailable || !supabase) {
    const itemIndex = mockWishlist.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false
    mockWishlist.splice(itemIndex, 1)
    return true
  }

  try {
    const { error } = await supabase.from("wishlist").delete().eq("id", id)
    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting wishlist item:", error)
    return false
  }
}

// Notes operations
export async function getNotesByUserId(userId: string): Promise<Note[]> {
  if (!isSupabaseAvailable || !supabase) {
    return mockNotes.filter((note) => note.user_id === userId)
  }

  try {
    const { data, error } = await supabase.from("notes").select("*").eq("user_id", userId)
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching notes:", error)
    return mockNotes.filter((note) => note.user_id === userId)
  }
}

export async function createNote(note: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> {
  if (!isSupabaseAvailable || !supabase) {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockNotes.push(newNote)
    return newNote
  }

  try {
    const { data, error } = await supabase.from("notes").insert([note]).select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : (note as Note)
  } catch (error) {
    console.error("Error creating note:", error)
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockNotes.push(newNote)
    return newNote
  }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
  if (!isSupabaseAvailable || !supabase) {
    const noteIndex = mockNotes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return null

    mockNotes[noteIndex] = {
      ...mockNotes[noteIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockNotes[noteIndex]
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error("Error updating note:", error)
    return null
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  if (!isSupabaseAvailable || !supabase) {
    const noteIndex = mockNotes.findIndex((note) => note.id === id)
    if (noteIndex === -1) return false
    mockNotes.splice(noteIndex, 1)
    return true
  }

  try {
    const { error } = await supabase.from("notes").delete().eq("id", id)
    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting note:", error)
    return false
  }
}

// Achievement operations
export async function getAchievementsByUserId(userId: string): Promise<Achievement[]> {
  if (!isSupabaseAvailable || !supabase) {
    return mockAchievements.filter((achievement) => achievement.user_id === userId)
  }

  try {
    const { data, error } = await supabase.from("achievements").select("*").eq("user_id", userId)
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return mockAchievements.filter((achievement) => achievement.user_id === userId)
  }
}

export async function createAchievement(achievement: Omit<Achievement, "id">): Promise<Achievement> {
  if (!isSupabaseAvailable || !supabase) {
    const newAchievement: Achievement = {
      ...achievement,
      id: Date.now().toString(),
    }
    mockAchievements.push(newAchievement)
    return newAchievement
  }

  try {
    const { data, error } = await supabase.from("achievements").insert([achievement]).select()
    if (error) throw error
    return data && data.length > 0 ? data[0] : (achievement as Achievement)
  } catch (error) {
    console.error("Error creating achievement:", error)
    const newAchievement: Achievement = {
      ...achievement,
      id: Date.now().toString(),
    }
    mockAchievements.push(newAchievement)
    return newAchievement
  }
}

// Initialize admin user with comprehensive error handling
export async function initializeAdminUser(): Promise<User> {
  const adminEmail = "admin@futuretask.com"

  console.log("🔧 Initializing admin user...")

  try {
    // Always try to get the user first (this will handle both DB and mock scenarios)
    const existingAdmin = await getUserByEmail(adminEmail)

    if (existingAdmin) {
      console.log("✅ Admin user found:", existingAdmin.email)
      return existingAdmin
    }

    console.log("🔧 Admin user not found, creating new one...")

    // Create admin user
    const adminUser: Omit<User, "id" | "created_at" | "updated_at"> = {
      name: "Admin User",
      email: adminEmail,
      password: "535353-Jrl",
      language: "es",
      theme: "dark",
      is_premium: true,
      is_pro: true,
      onboarding_completed: true,
      pomodoro_sessions: 0,
      work_duration: 25,
      short_break_duration: 5,
      long_break_duration: 15,
      sessions_until_long_break: 4,
      ai_credits: 1000,
      ai_credits_used: 0,
      ai_total_cost_eur: 0,
    }

    const newAdmin = await createUser(adminUser)
    console.log("✅ Admin user created successfully:", newAdmin.email)
    return newAdmin
  } catch (error) {
    console.error("❌ Error in initializeAdminUser:", error)

    // Final fallback - return the mock admin user
    const mockAdmin = mockUsers.find((user) => user.email === adminEmail)
    if (mockAdmin) {
      console.log("📦 Using mock admin user as final fallback")
      return mockAdmin
    }

    // If even mock doesn't exist, create one
    const fallbackAdmin: User = {
      id: "admin-fallback-id",
      name: "Admin User",
      email: adminEmail,
      password: "535353-Jrl",
      language: "es",
      theme: "dark",
      is_premium: true,
      is_pro: true,
      onboarding_completed: true,
      pomodoro_sessions: 0,
      work_duration: 25,
      short_break_duration: 5,
      long_break_duration: 15,
      sessions_until_long_break: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_credits: 1000,
      ai_credits_used: 0,
      ai_total_cost_eur: 0,
    }

    console.log("📦 Created emergency fallback admin user")
    return fallbackAdmin
  }
}
