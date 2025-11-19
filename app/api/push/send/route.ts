import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    let webpush
    try {
      webpush = await import('web-push')
    } catch (e) {
      console.error('[v0] web-push not available:', e)
      return NextResponse.json({ error: 'Push notifications not configured' }, { status: 500 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, body, taskId } = await request.json()

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const privateKey = process.env.VAPID_PRIVATE_KEY
    const subject = process.env.VAPID_SUBJECT

    if (!publicKey || !privateKey || !subject) {
      console.error('[v0] VAPID keys not configured')
      return NextResponse.json({ error: 'Push notifications not configured' }, { status: 500 })
    }

    // Configure web-push
    webpush.default.setVapidDetails(subject, publicKey, privateKey)

    // Get all subscriptions for this user
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id)

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 404 })
    }

    const payload = JSON.stringify({ 
      title, 
      body, 
      taskId,
      url: '/app/calendar'
    })
    const results = []

    for (const sub of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }
        
        await webpush.default.sendNotification(pushSubscription, payload)
        results.push({ success: true, endpoint: sub.endpoint })
        
        // Update last_used_at
        await supabase
          .from('push_subscriptions')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', sub.id)
      } catch (error: any) {
        console.error('[v0] Error sending to device:', error)
        
        // Remove invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id)
        }
        
        results.push({ success: false, endpoint: sub.endpoint, error: error.message })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('[v0] Error in push send:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
