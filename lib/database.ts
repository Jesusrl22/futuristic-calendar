export interface User {
  id: string
  name: string
  email: string
  password: string
  language: string
  theme: string
  is_premium: boolean
  is_pro: boolean
  premium_expiry?: string
  onboarding_completed: boolean
  pomodoro_sessions: number
  work_duration: number
  short_break_duration: number
  long_break_duration: number
  sessions_until_long_break: number
  ai_credits?: number
  ai_credits_used?: number
  ai_total_cost_eur?: number
  created_at: string
  updated_at: string
}

// In-memory database simulation
const users: User[] = []
let nextId = 1

export async function getUserByEmail(email: string): Promise<User | null> {
  console.log("🔍 Looking for user with email:", email)
  const user = users.find((u) => u.email === email)
  console.log("👤 User found:", user ? "Yes" : "No")
  return user || null
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  console.log("📝 Creating new user:", userData.email)

  const newUser: User = {
    ...userData,
    id: nextId.toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  users.push(newUser)
  nextId++

  console.log("✅ User created successfully:", newUser.id)
  return newUser
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  console.log("🔄 Updating user:", id, updates)

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    console.log("❌ User not found for update")
    return null
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  console.log("✅ User updated successfully")
  return users[userIndex]
}

export async function initializeAdminUser(): Promise<void> {
  console.log("🔧 Initializing admin user...")

  const adminEmail = "admin@futuretask.com"
  const existingAdmin = await getUserByEmail(adminEmail)

  if (!existingAdmin) {
    console.log("👑 Creating admin user...")
    await createUser({
      name: "Administrador",
      email: adminEmail,
      password: "admin123",
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
    })
    console.log("✅ Admin user created")
  } else {
    console.log("👑 Admin user already exists")
  }

  // Also create demo user
  const demoEmail = "demo@futuretask.com"
  const existingDemo = await getUserByEmail(demoEmail)

  if (!existingDemo) {
    console.log("👤 Creating demo user...")
    await createUser({
      name: "Usuario Demo",
      email: demoEmail,
      password: "demo123",
      language: "es",
      theme: "dark",
      is_premium: false,
      is_pro: false,
      onboarding_completed: true,
      pomodoro_sessions: 0,
      work_duration: 25,
      short_break_duration: 5,
      long_break_duration: 15,
      sessions_until_long_break: 4,
      ai_credits: 0,
      ai_credits_used: 0,
      ai_total_cost_eur: 0,
    })
    console.log("✅ Demo user created")
  }
}
