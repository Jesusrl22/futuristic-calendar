import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("sb-access-token")?.value

  if (!accessToken) {
    return NextResponse.json({ hasSession: false, user: null })
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ hasSession: false, user: null })
    }

    const userData = await response.json()

    return NextResponse.json({
      hasSession: true,
      user: userData,
    })
  } catch (error) {
    return NextResponse.json({ hasSession: false, user: null })
  }
}
