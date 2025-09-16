import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Database operations
export async function createUser(userData: {
  email: string
  password_hash: string
  full_name: string
  email_verification_token: string
}) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([
      {
        ...userData,
        email_verified: false,
        email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()
  if (error) return null
  return data
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()
  if (error) return null
  return data
}

export async function getAllUsers() {
  const { data, error } = await supabaseAdmin.from("users").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateUserById(id: string, updates: any) {
  const { data, error } = await supabaseAdmin.from("users").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function verifyUserEmail(token: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
    })
    .eq("email_verification_token", token)
    .gt("email_verification_expires", new Date().toISOString())
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserSubscription(
  userId: string,
  updates: {
    subscription_status?: string
    subscription_cancelled_at?: string | null
    subscription_ends_at?: string | null
    is_pro?: boolean
  },
) {
  const { data, error } = await supabaseAdmin.from("users").update(updates).eq("id", userId).select().single()
  if (error) throw error
  return data
}

export async function cancelUserSubscription(userId: string) {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      subscription_status: "cancelled",
      subscription_cancelled_at: new Date().toISOString(),
      subscription_ends_at: nextMonth.toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getExpiredSubscriptions() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("subscription_status", "cancelled")
    .lt("subscription_ends_at", new Date().toISOString())

  if (error) throw error
  return data || []
}

export async function getSubscriptionsExpiringIn(days: number) {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("subscription_status", "cancelled")
    .gte("subscription_ends_at", new Date().toISOString())
    .lt("subscription_ends_at", futureDate.toISOString())

  if (error) throw error
  return data || []
}

// Email functions
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email send failed:", error)
    throw error
  }
}

export async function logEmail(userId: string, type: string, recipient: string, subject: string) {
  await supabaseAdmin.from("email_logs").insert([
    {
      user_id: userId,
      email_type: type,
      recipient,
      subject,
      sent_at: new Date().toISOString(),
    },
  ])
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Database connected successfully" }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, message: "Database connection failed" }
  }
}
