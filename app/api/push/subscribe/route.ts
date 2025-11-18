import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await req.json()
    const userAgent = req.headers.get('user-agent') || 'Unknown'

    // Get user ID from token
    const userResponse = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.SUPABASE_ANON_KEY!,
        },
      }
    )

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userData = await userResponse.json()
    const userId = userData.id

    // Save subscription to database
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/push_subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          user_id: userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          user_agent: userAgent,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('[Push Subscribe] Error:', error)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Push Subscribe] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
