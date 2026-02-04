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
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // The pages themselves will show logout option if session exists
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
    return response
  }

  if (!accessToken && !refreshToken) {
    return response
  }

  try {
    if (!accessToken) {
      if (refreshToken) {
        // Try to refresh with refresh token
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

          return response
        } else {
          // Refresh failed, clear tokens
          response.cookies.delete("sb-access-token")
          response.cookies.delete("sb-refresh-token")

          if (request.nextUrl.pathname.startsWith("/app")) {
            return NextResponse.redirect(new URL("/login", request.url))
          }
        }
      }
      return response
    }

    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (userResponse.ok) {
      return response
    }

    // Access token is invalid/expired, try to refresh
    if (refreshToken) {
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

        return response
      }
    }

    // Both access token and refresh failed, clear cookies and redirect
    response.cookies.delete("sb-access-token")
    response.cookies.delete("sb-refresh-token")

    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  } catch (error) {
    console.error("[v0] Middleware error:", error)
    response.cookies.delete("sb-access-token")
    response.cookies.delete("sb-refresh-token")

    if (request.nextUrl.pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  }

  return response
}
