import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()

  // Get tokens from cookies
  const accessToken = request.cookies.get("sb-access-token")?.value
  const refreshToken = request.cookies.get("sb-refresh-token")?.value

  if (!accessToken || !refreshToken) {
    // No auth tokens - redirect to login if accessing protected routes
    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return response
  }

  // Create Supabase client
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Set the session
  const {
    data: { session },
    error,
  } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (error || !session) {
    // Invalid session - redirect to login
    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return response
  }

  // If session was refreshed, update cookies
  if (session.access_token !== accessToken) {
    response.cookies.set("sb-access-token", session.access_token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    })
  }

  if (session.refresh_token && session.refresh_token !== refreshToken) {
    response.cookies.set("sb-refresh-token", session.refresh_token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    })
  }

  return response
}
