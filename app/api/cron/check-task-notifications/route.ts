import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Cron] Checking task notifications...')

    // Fetch all tasks due in the next 2 minutes
    const now = new Date()
    const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000)

    const tasksResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/tasks?completed=eq.false&due_date=gte.${now.toISOString()}&due_date=lte.${twoMinutesFromNow.toISOString()}&select=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
      }
    )

    if (!tasksResponse.ok) {
      throw new Error('Failed to fetch tasks')
    }

    const tasks = await tasksResponse.json()
    console.log(`[Cron] Found ${tasks.length} task(s) due soon`)

    let notificationsSent = 0

    for (const task of tasks) {
      try {
        // Check if already notified (using notifications table)
        const notifCheck = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/notifications?task_id=eq.${task.id}&type=eq.task_due`,
          {
            headers: {
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            },
          }
        )

        const existingNotifs = await notifCheck.json()
        
        if (existingNotifs && existingNotifs.length > 0) {
          console.log(`[Cron] Already notified for task ${task.id}`)
          continue
        }

        // Send push notification
        const pushResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/push/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: task.user_id,
            title: '📋 Task Due!',
            body: task.title,
            taskId: task.id,
          }),
        })

        if (pushResponse.ok) {
          // Mark as notified
          await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/notifications`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: task.user_id,
                task_id: task.id,
                type: 'task_due',
                title: 'Task Due',
                message: task.title,
                read: false,
              }),
            }
          )
          
          notificationsSent++
          console.log(`[Cron] Sent notification for task: ${task.title}`)
        }
      } catch (error) {
        console.error(`[Cron] Error sending notification for task ${task.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      tasksChecked: tasks.length,
      notificationsSent,
    })
  } catch (error) {
    console.error('[Cron] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
