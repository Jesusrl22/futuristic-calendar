import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Get session from cookies
  const accessToken = request.cookies.get("sb-access-token")?.value
  const refreshToken = request.cookies.get("sb-refresh-token")?.value

  let user = null

  if (accessToken && refreshToken) {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (!error && session) {
        user = session.user

        // Update cookies with refreshed tokens
        response.cookies.set("sb-access-token", session.access_token, {
          path: "/",
          maxAge: 60 * 60, // 1 hour
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })

        if (session.refresh_token) {
          response.cookies.set("sb-refresh-token", session.refresh_token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          })
        }
      }
    } catch (error) {
      console.error("[v0] Session refresh error:", error)
    }
  }

  // Redirect to login if no user and trying to access protected routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    request.nextUrl.pathname.startsWith("/app")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return response
}
