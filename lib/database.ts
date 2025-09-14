import {
  supabase,
  isSupabaseAvailable,
  type User,
  type Task,
  type WishlistItem,
  type Note,
  type Achievement,
} from "./supabase"
import bcrypt from "bcryptjs"

// Mock data for when Supabase is not available
const mockUsers: User[] = [
  {
    id: "jesus-mock-id",
    email: "jesusrayaleon1@gmail.com",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // jesus123
    full_name: "Jesus Raya Leon",
    is_admin: false,
    is_pro: true,
    premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    ai_credits: 1000,
    ai_credits_used: 50,
    ai_total_cost_eur: 2.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    pomodoro_work_duration: 25,
    pomodoro_break_duration: 5,
    pomodoro_long_break_duration: 15,
    pomodoro_sessions_until_long_break: 4,
    theme_preference: "dark",
    notification_preferences: { email: true, push: true },
  },
  {
    id: "admin-mock-id",
    email: "admin@futuretask.com",
    password_hash: "$2a$10$535353JrlHashedPasswordExample", // 535353-Jrl
    full_name: "Admin User",
    is_admin: true,
    is_pro: true,
    premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    ai_credits: 1000,
    ai_credits_used: 0,
    ai_total_cost_eur: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    pomodoro_work_duration: 25,
    pomodoro_break_duration: 5,
    pomodoro_long_break_duration: 15,
    pomodoro_sessions_until_long_break: 4,
    theme_preference: "dark",
    notification_preferences: { email: true, push: true },
  },
  {
    id: "demo-mock-id",
    email: "demo@futuretask.com",
    password_hash: "$2a$10$demoHashedPasswordExample", // demo123
    full_name: "Demo User",
    is_admin: false,
    is_pro: false,
    premium_expiry: null,
    ai_credits: 0,
    ai_credits_used: 0,
    ai_total_cost_eur: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    pomodoro_work_duration: 25,
    pomodoro_break_duration: 5,
    pomodoro_long_break_duration: 15,
    pomodoro_sessions_until_long_break: 4,
    theme_preference: "light",
    notification_preferences: { email: false, push: false },
  },
]

const mockTasks: Task[] = []
const mockWishlistItems: WishlistItem[] = []
const mockNotes: Note[] = []
const mockAchievements: Achievement[] = []

// User functions
export async function createUser(userData: Partial<User>): Promise<User | null> {
  console.log("🔧 Creating new user:", userData.email)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock user creation (Supabase not available)")

    const newUser: User = {
      id: `mock-${Date.now()}`,
      email: userData.email || "",
      password_hash: userData.password_hash || "",
      full_name: userData.full_name || "",
      is_admin: userData.is_admin || false,
      is_pro: userData.is_pro || false,
      premium_expiry: userData.premium_expiry || null,
      ai_credits: userData.ai_credits || 0,
      ai_credits_used: 0,
      ai_total_cost_eur: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null,
      pomodoro_work_duration: 25,
      pomodoro_break_duration: 5,
      pomodoro_long_break_duration: 15,
      pomodoro_sessions_until_long_break: 4,
      theme_preference: "dark",
      notification_preferences: { email: true, push: true },
    }

    mockUsers.push(newUser)
    return newUser
  }

  try {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) {
      console.error("❌ Error creating user:", error)
      throw error
    }

    console.log("✅ User created successfully")
    return data
  } catch (error) {
    console.error("❌ Error creating user:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  console.log("🔍 Getting user by email:", email)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock user data (Supabase not available)")
    const user = mockUsers.find((u) => u.email === email)
    return user || null
  }

  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log("👤 User not found")
        return null
      }
      console.error("❌ Error fetching user:", error)
      throw error
    }

    console.log("✅ User found")
    return data
  } catch (error) {
    console.error("❌ Error getting user by email:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock user data")
    const user = mockUsers.find((u) => u.email === email)
    return user || null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  console.log("🔍 Getting user by ID:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock user data (Supabase not available)")
    const user = mockUsers.find((u) => u.id === id)
    return user || null
  }

  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        console.log("👤 User not found")
        return null
      }
      console.error("❌ Error fetching user:", error)
      throw error
    }

    console.log("✅ User found")
    return data
  } catch (error) {
    console.error("❌ Error getting user by ID:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock user data")
    const user = mockUsers.find((u) => u.id === id)
    return user || null
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  console.log("🔧 Updating user:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock user update (Supabase not available)")
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updated_at: new Date().toISOString() }
      return mockUsers[userIndex]
    }
    return null
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error updating user:", error)
      throw error
    }

    console.log("✅ User updated successfully")
    return data
  } catch (error) {
    console.error("❌ Error updating user:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock user update")
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updated_at: new Date().toISOString() }
      return mockUsers[userIndex]
    }
    return null
  }
}

export async function getAllUsers(): Promise<User[]> {
  console.log("🔍 Getting all users")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock users data (Supabase not available)")
    return mockUsers
  }

  try {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching users:", error)
      throw error
    }

    console.log("✅ Users retrieved successfully")
    return data || []
  } catch (error) {
    console.error("❌ Error getting all users:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock users data")
    return mockUsers
  }
}

export async function initializeAdminUser(): Promise<boolean> {
  console.log("🔧 Initializing admin user")

  const adminEmail = "admin@futuretask.com"
  const adminPassword = "535353-Jrl"

  try {
    // Check if admin already exists
    const existingAdmin = await getUserByEmail(adminEmail)
    if (existingAdmin) {
      console.log("✅ Admin user already exists")
      return true
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const adminUser = await createUser({
      email: adminEmail,
      password_hash: hashedPassword,
      full_name: "Admin User",
      is_admin: true,
      is_pro: true,
      premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      ai_credits: 1000,
    })

    if (adminUser) {
      console.log("✅ Admin user created successfully")
      return true
    }

    return false
  } catch (error) {
    console.error("❌ Error initializing admin user:", error)
    return false
  }
}

// Task functions
export async function getUserTasks(userId: string): Promise<Task[]> {
  console.log("🔍 Getting tasks for user:", userId)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock tasks data (Supabase not available)")
    return mockTasks.filter((task) => task.user_id === userId)
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching tasks:", error)
      throw error
    }

    console.log("✅ Tasks retrieved successfully")
    return data || []
  } catch (error) {
    console.error("❌ Error getting user tasks:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock tasks data")
    return mockTasks.filter((task) => task.user_id === userId)
  }
}

export async function createTask(taskData: Partial<Task>): Promise<Task | null> {
  console.log("🔧 Creating new task")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock task creation (Supabase not available)")

    const newTask: Task = {
      id: `task-${Date.now()}`,
      user_id: taskData.user_id || "",
      title: taskData.title || "",
      description: taskData.description || null,
      due_date: taskData.due_date || null,
      priority: taskData.priority || "medium",
      status: taskData.status || "pending",
      category: taskData.category || null,
      tags: taskData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      estimated_duration: taskData.estimated_duration || null,
      actual_duration: null,
    }

    mockTasks.push(newTask)
    return newTask
  }

  try {
    const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

    if (error) {
      console.error("❌ Error creating task:", error)
      throw error
    }

    console.log("✅ Task created successfully")
    return data
  } catch (error) {
    console.error("❌ Error creating task:", error)
    return null
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  console.log("🔧 Updating task:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock task update (Supabase not available)")
    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates, updated_at: new Date().toISOString() }
      return mockTasks[taskIndex]
    }
    return null
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error updating task:", error)
      throw error
    }

    console.log("✅ Task updated successfully")
    return data
  } catch (error) {
    console.error("❌ Error updating task:", error)
    return null
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  console.log("🗑️ Deleting task:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock task deletion (Supabase not available)")
    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1)
      return true
    }
    return false
  }

  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("❌ Error deleting task:", error)
      throw error
    }

    console.log("✅ Task deleted successfully")
    return true
  } catch (error) {
    console.error("❌ Error deleting task:", error)
    return false
  }
}

// Wishlist functions
export async function getUserWishlistItems(userId: string): Promise<WishlistItem[]> {
  console.log("🔍 Getting wishlist items for user:", userId)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock wishlist data (Supabase not available)")
    return mockWishlistItems.filter((item) => item.user_id === userId)
  }

  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching wishlist items:", error)
      throw error
    }

    console.log("✅ Wishlist items retrieved successfully")
    return data || []
  } catch (error) {
    console.error("❌ Error getting user wishlist items:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock wishlist data")
    return mockWishlistItems.filter((item) => item.user_id === userId)
  }
}

export async function createWishlistItem(itemData: Partial<WishlistItem>): Promise<WishlistItem | null> {
  console.log("🔧 Creating new wishlist item")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock wishlist item creation (Supabase not available)")

    const newItem: WishlistItem = {
      id: `wishlist-${Date.now()}`,
      user_id: itemData.user_id || "",
      title: itemData.title || "",
      description: itemData.description || null,
      priority: itemData.priority || "medium",
      category: itemData.category || null,
      target_date: itemData.target_date || null,
      estimated_cost: itemData.estimated_cost || null,
      status: itemData.status || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      achieved_at: null,
    }

    mockWishlistItems.push(newItem)
    return newItem
  }

  try {
    const { data, error } = await supabase.from("wishlist_items").insert([itemData]).select().single()

    if (error) {
      console.error("❌ Error creating wishlist item:", error)
      throw error
    }

    console.log("✅ Wishlist item created successfully")
    return data
  } catch (error) {
    console.error("❌ Error creating wishlist item:", error)
    return null
  }
}

export async function updateWishlistItem(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem | null> {
  console.log("🔧 Updating wishlist item:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock wishlist item update (Supabase not available)")
    const itemIndex = mockWishlistItems.findIndex((i) => i.id === id)
    if (itemIndex !== -1) {
      mockWishlistItems[itemIndex] = {
        ...mockWishlistItems[itemIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockWishlistItems[itemIndex]
    }
    return null
  }

  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error updating wishlist item:", error)
      throw error
    }

    console.log("✅ Wishlist item updated successfully")
    return data
  } catch (error) {
    console.error("❌ Error updating wishlist item:", error)
    return null
  }
}

export async function deleteWishlistItem(id: string): Promise<boolean> {
  console.log("🗑️ Deleting wishlist item:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock wishlist item deletion (Supabase not available)")
    const itemIndex = mockWishlistItems.findIndex((i) => i.id === id)
    if (itemIndex !== -1) {
      mockWishlistItems.splice(itemIndex, 1)
      return true
    }
    return false
  }

  try {
    const { error } = await supabase.from("wishlist_items").delete().eq("id", id)

    if (error) {
      console.error("❌ Error deleting wishlist item:", error)
      throw error
    }

    console.log("✅ Wishlist item deleted successfully")
    return true
  } catch (error) {
    console.error("❌ Error deleting wishlist item:", error)
    return false
  }
}

// Notes functions
export async function getUserNotes(userId: string): Promise<Note[]> {
  console.log("🔍 Getting notes for user:", userId)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock notes data (Supabase not available)")
    return mockNotes.filter((note) => note.user_id === userId)
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching notes:", error)
      throw error
    }

    console.log("✅ Notes retrieved successfully")
    return data || []
  } catch (error) {
    console.error("❌ Error getting user notes:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock notes data")
    return mockNotes.filter((note) => note.user_id === userId)
  }
}

export async function createNote(noteData: Partial<Note>): Promise<Note | null> {
  console.log("🔧 Creating new note")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock note creation (Supabase not available)")

    const newNote: Note = {
      id: `note-${Date.now()}`,
      user_id: noteData.user_id || "",
      title: noteData.title || "",
      content: noteData.content || "",
      category: noteData.category || null,
      tags: noteData.tags || [],
      is_pinned: noteData.is_pinned || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockNotes.push(newNote)
    return newNote
  }

  try {
    const { data, error } = await supabase.from("notes").insert([noteData]).select().single()

    if (error) {
      console.error("❌ Error creating note:", error)
      throw error
    }

    console.log("✅ Note created successfully")
    return data
  } catch (error) {
    console.error("❌ Error creating note:", error)
    return null
  }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
  console.log("🔧 Updating note:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock note update (Supabase not available)")
    const noteIndex = mockNotes.findIndex((n) => n.id === id)
    if (noteIndex !== -1) {
      mockNotes[noteIndex] = { ...mockNotes[noteIndex], ...updates, updated_at: new Date().toISOString() }
      return mockNotes[noteIndex]
    }
    return null
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error updating note:", error)
      throw error
    }

    console.log("✅ Note updated successfully")
    return data
  } catch (error) {
    console.error("❌ Error updating note:", error)
    return null
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  console.log("🗑️ Deleting note:", id)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock note deletion (Supabase not available)")
    const noteIndex = mockNotes.findIndex((n) => n.id === id)
    if (noteIndex !== -1) {
      mockNotes.splice(noteIndex, 1)
      return true
    }
    return false
  }

  try {
    const { error } = await supabase.from("notes").delete().eq("id", id)

    if (error) {
      console.error("❌ Error deleting note:", error)
      throw error
    }

    console.log("✅ Note deleted successfully")
    return true
  } catch (error) {
    console.error("❌ Error deleting note:", error)
    return false
  }
}

// Achievement functions
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  console.log("🔍 Getting achievements for user:", userId)

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Using mock achievements data (Supabase not available)")
    return mockAchievements.filter((achievement) => achievement.user_id === userId)
  }

  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching achievements:", error)
      throw error
    }

    console.log("✅ Achievements retrieved successfully")
    return data || []
  } catch (error) {
    console.error("❌ Error getting user achievements:", error)

    // Fallback to mock data
    console.log("📦 Falling back to mock achievements data")
    return mockAchievements.filter((achievement) => achievement.user_id === userId)
  }
}

export async function createAchievement(achievementData: Partial<Achievement>): Promise<Achievement | null> {
  console.log("🔧 Creating new achievement")

  if (!isSupabaseAvailable || !supabase) {
    console.log("📦 Mock achievement creation (Supabase not available)")

    const newAchievement: Achievement = {
      id: `achievement-${Date.now()}`,
      user_id: achievementData.user_id || "",
      type: achievementData.type || "",
      title: achievementData.title || "",
      description: achievementData.description || "",
      icon: achievementData.icon || "🏆",
      earned_at: new Date().toISOString(),
      metadata: achievementData.metadata || {},
    }

    mockAchievements.push(newAchievement)
    return newAchievement
  }

  try {
    const { data, error } = await supabase.from("achievements").insert([achievementData]).select().single()

    if (error) {
      console.error("❌ Error creating achievement:", error)
      throw error
    }

    console.log("✅ Achievement created successfully")
    return data
  } catch (error) {
    console.error("❌ Error creating achievement:", error)
    return null
  }
}
