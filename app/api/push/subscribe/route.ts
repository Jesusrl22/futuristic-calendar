import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await request.json()

    const { endpoint, keys } = subscription
    const { p256dh, auth } = keys

    // Store subscription in database with individual fields
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: endpoint,
        p256dh: p256dh,
        auth: auth,
        user_agent: request.headers.get('user-agent') || 'unknown',
        last_used_at: new Date().toISOString()
      }, {
        onConflict: 'endpoint',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('[v0] Error storing subscription:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error in push subscribe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
