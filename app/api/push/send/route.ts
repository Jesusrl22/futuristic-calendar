import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BNxN8fVYYYqF3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ_Hq'
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'cqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYq'

webpush.setVapidDetails(
  'mailto:support@futuretask.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

export async function POST(req: NextRequest) {
  try {
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
          icon: '/icon-192.png',
          badge: '/icon-192.png',
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
