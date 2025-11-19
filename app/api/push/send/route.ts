import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@future-task.com'

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('[Push Send] VAPID keys are missing. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.')
}

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  )
}

export async function POST(req: NextRequest) {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 })
    }

    const { userId, title, body, taskId } = await req.json()

    if (!userId || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch all push subscriptions for this user
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/push_subscriptions?user_id=eq.${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
    }

    const subscriptions = await response.json()

    console.log(`[Push Send] Sending to ${subscriptions.length} device(s)`)

    // Send push notification to all devices
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        }

        const payload = JSON.stringify({
          title,
          body,
          icon: '/icon-192.jpg',
          badge: '/icon-192.jpg',
          tag: taskId || 'task-notification',
          data: {
            url: `/app/calendar`,
            taskId,
          },
        })

        try {
          await webpush.sendNotification(pushSubscription, payload)
          console.log(`[Push Send] Sent to ${sub.endpoint.substring(0, 50)}...`)
          return { success: true }
        } catch (error: any) {
          console.error(`[Push Send] Failed for ${sub.endpoint.substring(0, 50)}:`, error.message)
          
          // If subscription is invalid, delete it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await fetch(
              `${process.env.SUPABASE_URL}/rest/v1/push_subscriptions?id=eq.${sub.id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                },
              }
            )
          }
          
          throw error
        }
      })
    )

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: subscriptions.length,
    })
  } catch (error) {
    console.error('[Push Send] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
