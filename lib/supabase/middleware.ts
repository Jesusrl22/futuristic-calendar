import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const accessToken = request.cookies.get("sb-access-token")?.value
  const refreshToken = request.cookies.get("sb-refresh-token")?.value

  console.log("[v0] Middleware checking auth for path:", request.nextUrl.pathname)
  console.log("[v0] Has access token:", !!accessToken)
  console.log("[v0] Has refresh token:", !!refreshToken)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  let user = null

  if (accessToken && refreshToken) {
    const { data } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (data.session) {
      user = data.user
      console.log("[v0] User authenticated:", user?.email)

      if (data.session.access_token !== accessToken) {
        response.cookies.set("sb-access-token", data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        })
      }

      if (data.session.refresh_token !== refreshToken) {
        response.cookies.set("sb-refresh-token", data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        })
      }
    } else {
      console.log("[v0] Session invalid, clearing cookies")
      response.cookies.delete("sb-access-token")
      response.cookies.delete("sb-refresh-token")
    }
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    request.nextUrl.pathname.startsWith("/app")
  ) {
    console.log("[v0] No user found, redirecting to login")
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return response
}
