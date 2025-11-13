import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()

  const accessToken = request.cookies.get("sb-access-token")?.value
  const refreshToken = request.cookies.get("sb-refresh-token")?.value

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return response
  }

  console.log("[v0][Middleware] Checking auth for:", request.nextUrl.pathname)
  console.log("[v0][Middleware] Has access token:", !!accessToken)
  console.log("[v0][Middleware] Has refresh token:", !!refreshToken)

  if (!accessToken || !refreshToken) {
    if (request.nextUrl.pathname.startsWith("/app")) {
      console.log("[v0][Middleware] No tokens, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return response
  }

  try {
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (userResponse.ok) {
      if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
        console.log("[v0][Middleware] Authenticated user accessing auth page, redirecting to /app")
        return NextResponse.redirect(new URL("/app", request.url))
      }
      return response
    }

    console.log("[v0][Middleware] Access token invalid or expired, attempting refresh...")

    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    )

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json()

      console.log("[v0][Middleware] Session refreshed successfully")

      response.cookies.set("sb-access-token", refreshData.access_token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      if (refreshData.refresh_token) {
        response.cookies.set("sb-refresh-token", refreshData.refresh_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        })
      }

      if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
        console.log("[v0][Middleware] Session refreshed on auth page, redirecting to /app")
        return NextResponse.redirect(new URL("/app", request.url))
      }

      return response
    }

    console.log("[v0][Middleware] Refresh failed, clearing cookies")
    response.cookies.delete("sb-access-token")
    response.cookies.delete("sb-refresh-token")

    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  } catch (error) {
    response.cookies.delete("sb-access-token")
    response.cookies.delete("sb-refresh-token")

    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return response
}
