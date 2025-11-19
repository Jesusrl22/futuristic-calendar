import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!
const vapidSubject = process.env.VAPID_SUBJECT!

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get tasks due in the next 2 minutes
    const now = new Date()
    const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000)

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, user_id, title, due_date')
      .eq('completed', false)
      .gte('due_date', now.toISOString())
      .lte('due_date', twoMinutesFromNow.toISOString())

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      return NextResponse.json({ error: tasksError.message }, { status: 500 })
    }

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ message: 'No tasks due soon', sent: 0 })
    }

    let sentCount = 0

    for (const task of tasks) {
      // Get push subscriptions for this user
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', task.user_id)

      if (!subscriptions || subscriptions.length === 0) continue

      const dueDate = new Date(task.due_date)
      const minutesUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60))

      const payload = JSON.stringify({
        title: '⏰ Task Due Soon',
        body: `${task.title} is due in ${minutesUntilDue} minute${minutesUntilDue !== 1 ? 's' : ''}`,
        data: {
          taskId: task.id,
          url: '/app/calendar'
        }
      })

      for (const sub of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          }

          await webpush.sendNotification(pushSubscription, payload)
          sentCount++

          // Update last_used_at
          await supabase
            .from('push_subscriptions')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', sub.id)
        } catch (error: any) {
          console.error('Error sending notification:', error)

          if (error.statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      tasksChecked: tasks.length,
      notificationsSent: sentCount
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
