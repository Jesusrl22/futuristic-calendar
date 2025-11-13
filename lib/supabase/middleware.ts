import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next()

  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return response
  }

  const accessToken = request.cookies.get("sb-access-token")?.value
  const refreshToken = request.cookies.get("sb-refresh-token")?.value

  if (request.nextUrl.pathname.startsWith("/app")) {
    if (!accessToken && !refreshToken) {
      console.log("[v0][Middleware] No auth tokens, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (!accessToken || !refreshToken) {
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
        return NextResponse.redirect(new URL("/app", request.url))
      }
      return response
    }

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
        return NextResponse.redirect(new URL("/app", request.url))
      }

      return response
    }

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
