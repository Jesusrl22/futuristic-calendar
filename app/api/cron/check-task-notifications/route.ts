import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if web-push is available
    let webpush
    try {
      webpush = await import('web-push')
    } catch (e) {
      console.log('[v0] web-push not available, skipping cron')
      return NextResponse.json({ message: 'Push notifications not configured' })
    }

    // Check VAPID keys
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const privateKey = process.env.VAPID_PRIVATE_KEY
    const subject = process.env.VAPID_SUBJECT

    if (!publicKey || !privateKey || !subject) {
      console.log('[v0] VAPID keys not configured, skipping cron')
      return NextResponse.json({ message: 'VAPID keys not configured' })
    }

    webpush.default.setVapidDetails(subject, publicKey, privateKey)

    const supabase = await createClient()

    const now = new Date()
    const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000)

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .gte('due_date', now.toISOString())
      .lte('due_date', twoMinutesFromNow.toISOString())

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ message: 'No tasks to notify', count: 0 })
    }

    let notificationsSent = 0
    const usersSent = new Set()

    for (const task of tasks) {
      const userId = task.user_id
      if (!userId || usersSent.has(userId + task.id)) continue

      // Get subscriptions for this user
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)

      if (!subscriptions || subscriptions.length === 0) continue

      const payload = JSON.stringify({
        title: '🔔 Task Due Soon',
        body: `"${task.title}" is due soon`,
        tag: `task-${task.id}`,
        url: '/app/calendar'
      })

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
          notificationsSent++
          usersSent.add(userId + task.id)
        } catch (error: any) {
          console.error('[v0] Error sending notification:', error)
          
          // Remove invalid subscriptions
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id)
          }
        }
      }
    }

    return NextResponse.json({ 
      message: 'Notifications sent', 
      tasksChecked: tasks.length,
      notificationsSent 
    })
  } catch (error) {
    console.error('[v0] Error in cron job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
