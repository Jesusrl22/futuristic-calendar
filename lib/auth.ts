// Browser-compatible UUID generation
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback UUID generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Browser-compatible random token generation
function generateRandomToken(): string {
  const array = new Uint8Array(32)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Simple hash function for browser compatibility
async function simpleHash(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "salt123") // Simple salt
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Fallback simple hash (not secure, for demo only)
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(16)
}

export async function hashPassword(password: string): Promise<string> {
  return await simpleHash(password)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await simpleHash(password)
  return hash === hashedPassword
}

export function generateVerificationToken(): string {
  return generateRandomToken()
}

export function generateResetToken(): string {
  return generateRandomToken()
}

export function isTokenExpired(expiresAt: string): boolean {
  return new Date() > new Date(expiresAt)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export async function createUser(email: string, password: string, fullName: string) {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address")
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(", "))
    }

    const hashedPassword = await hashPassword(password)
    const verificationToken = generateVerificationToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    const userData = {
      id: generateUUID(),
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      email_verification_token: verificationToken,
      email_verification_expires_at: expiresAt.toISOString(),
      email_verification_sent_at: new Date().toISOString(),
      email_verified: false,
      is_admin: false,
      is_pro: false,
      ai_credits: 50, // Free tier credits
      ai_credits_used: 0,
      ai_total_cost_eur: 0,
      pomodoro_work_duration: 25,
      pomodoro_break_duration: 5,
      pomodoro_long_break_duration: 15,
      pomodoro_sessions_until_long_break: 4,
      theme_preference: "system",
      notification_preferences: {},
      subscription_status: "inactive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return { user: userData, verificationToken }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function verifyEmail(token: string) {
  try {
    // This would normally check against database
    // For demo purposes, we'll simulate success
    return { success: true, user: null }
  } catch (error) {
    console.error("Error verifying email:", error)
    return { success: false, error: "Verification failed" }
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    // This would normally resend verification email
    // For demo purposes, we'll simulate success
    const verificationToken = generateVerificationToken()
    return { success: true, verificationToken, user: null }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return { success: false, error: "Failed to resend verification email" }
  }
}

export async function getUserByEmail(email: string) {
  try {
    // This would normally query database
    // For demo purposes, return null
    return null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    // This would normally authenticate against database
    // For demo purposes, we'll simulate success for demo users
    if (email.includes("demo")) {
      return {
        success: true,
        user: {
          id: generateUUID(),
          email,
          full_name: "Demo User",
          email_verified: true,
        },
      }
    }

    return { success: false, error: "Invalid credentials" }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return { success: false, error: "Authentication failed" }
  }
}
