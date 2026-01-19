import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Email validation with strict regex
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}

// Strong password validation
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" }
  }
  return { valid: true }
}

// Sanitize HTML to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim()
}

// Validate and sanitize name input
export function isValidName(name: string): boolean {
  if (!name || name.trim().length === 0 || name.length > 100) {
    return false
  }
  // Allow letters, spaces, hyphens, and apostrophes only
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/
  return nameRegex.test(name)
}

// Check if user is admin
export async function isAdmin(request: Request): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) return false

    const accessTokenMatch = cookieHeader.match(/sb-access-token=([^;]+)/)
    if (!accessTokenMatch) return false

    const token = accessTokenMatch[1]
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.sub

    if (!userId) return false

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: user } = await supabase.from("users").select("is_admin").eq("id", userId).single()

    return user?.is_admin === true
  } catch {
    return false
  }
}

// Get authenticated user ID from request
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) return null

    const accessTokenMatch = cookieHeader.match(/sb-access-token=([^;]+)/)
    if (!accessTokenMatch) return null

    const token = accessTokenMatch[1]
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub || null
  } catch {
    return null
  }
}

// Verify user owns resource
export async function verifyResourceOwnership(
  userId: string,
  resourceType: string,
  resourceId: string,
): Promise<boolean> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data } = await supabase.from(resourceType).select("user_id").eq("id", resourceId).single()

    return data?.user_id === userId
  } catch {
    return false
  }
}

// Security headers for responses
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;",
  )

  return response
}

// Validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Prevent SQL injection in search queries
export function sanitizeSearchQuery(query: string): string {
  return query.replace(/[^\w\s-]/gi, "").trim()
}
