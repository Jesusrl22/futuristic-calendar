import bcrypt from "bcryptjs"
import crypto from "crypto"
import { supabaseAdmin } from "./db"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
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

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
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
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return { user: data, verificationToken }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function verifyEmail(token: string) {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email_verification_token", token)
      .single()

    if (error || !user) {
      return { success: false, error: "Invalid verification token" }
    }

    // Check if token has expired
    if (isTokenExpired(user.email_verification_expires_at)) {
      return { success: false, error: "Verification token has expired" }
    }

    // Check if already verified
    if (user.email_verified) {
      return { success: false, error: "Email already verified" }
    }

    // Update user as verified
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        email_verified: true,
        email_verification_token: null,
        email_verification_expires_at: null,
      })
      .eq("id", user.id)

    if (updateError) {
      throw updateError
    }

    return { success: true, user }
  } catch (error) {
    console.error("Error verifying email:", error)
    return { success: false, error: "Verification failed" }
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return { success: false, error: "User not found" }
    }

    if (user.email_verified) {
      return { success: false, error: "Email already verified" }
    }

    const verificationToken = generateVerificationToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        email_verification_token: verificationToken,
        email_verification_expires_at: expiresAt.toISOString(),
        email_verification_sent_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      throw updateError
    }

    return { success: true, verificationToken, user }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return { success: false, error: "Failed to resend verification email" }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    if (!user.email_verified) {
      return { success: false, error: "Please verify your email before logging in" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Update last login
    await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    return { success: true, user }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return { success: false, error: "Authentication failed" }
  }
}
