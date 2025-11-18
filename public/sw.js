const CACHE_NAME = 'calendar-app-v1'
const API_URL = '/api/tasks'

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated')
  event.waitUntil(clients.claim())
})

// Periodic background sync to check tasks
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-tasks') {
    event.waitUntil(checkTasksAndNotify())
  }
})

// Manual sync trigger
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-tasks') {
    event.waitUntil(checkTasksAndNotify())
  }
})

// Message from client to check tasks immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_TASKS') {
    checkTasksAndNotify()
  }
})

async function checkTasksAndNotify() {
  try {
    console.log('[SW] Checking tasks for notifications...')
    
    // Fetch tasks from API
    const response = await fetch(API_URL, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      console.error('[SW] Failed to fetch tasks:', response.status)
      return
    }
    
    const data = await response.json()
    const tasks = data.tasks || []
    
    const now = new Date()
    const nowTime = now.getTime()
    
    console.log('[SW] Checking', tasks.length, 'tasks')
    
    for (const task of tasks) {
      if (task.completed || !task.due_date) continue
      
      // Parse task date
      const isoMatch = task.due_date.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
      if (!isoMatch) continue
      
      const [, year, month, day, hours, minutes] = isoMatch
      const taskDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        0
      )
      
      const taskTime = taskDate.getTime()
      const minutesUntilTask = Math.floor((taskTime - nowTime) / (1000 * 60))
      
      // Check if we should notify (5 minutes before or at due time)
      if (minutesUntilTask >= 4 && minutesUntilTask <= 6) {
        // 5 minute reminder
        await showNotification(
          `⏰ Reminder: ${task.title}`,
          `Task is due in ${minutesUntilTask} minutes!`,
          task.id,
          '5min'
        )
      } else if (minutesUntilTask >= -1 && minutesUntilTask <= 2) {
        // Due now notification
        const isOverdue = minutesUntilTask < 0
        const message = isOverdue 
          ? `Task is overdue by ${Math.abs(minutesUntilTask)} minute(s)!`
          : minutesUntilTask === 0
          ? 'Your task is due now!'
          : `Task is due in ${minutesUntilTask} minute(s)!`
        
        await showNotification(
          `🔔 ${isOverdue ? 'OVERDUE' : 'Task Due'}: ${task.title}`,
          task.description || message,
          task.id,
          'now'
        )
      } else if (minutesUntilTask < -1 && minutesUntilTask >= -30) {
        // Overdue notification
        await showNotification(
          `⚠️ OVERDUE: ${task.title}`,
          `Task is overdue by ${Math.abs(minutesUntilTask)} minutes!`,
          task.id,
          'overdue'
        )
      }
    }
  } catch (error) {
    console.error('[SW] Error checking tasks:', error)
  }
}

async function showNotification(title, body, taskId, type) {
  const notificationKey = `notified-${type}-${taskId}`
  
  // Check if already notified (use cache API as storage)
  const cache = await caches.open('notifications-cache')
  const existing = await cache.match(notificationKey)
  
  if (existing) {
    const data = await existing.json()
    const notifiedTime = data.time
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    
    if (notifiedTime > oneHourAgo) {
      console.log('[SW] Already notified:', notificationKey)
      return
    }
  }
  
  // Show notification
  await self.registration.showNotification(title, {
    body: body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `${taskId}-${type}`,
    requireInteraction: type === 'now' || type === 'overdue',
    vibrate: [200, 100, 200],
    data: {
      taskId: taskId,
      type: type,
      url: '/app/calendar'
    }
  })
  
  // Store that we've notified
  await cache.put(
    notificationKey,
    new Response(JSON.stringify({ time: Date.now() }))
  )
  
  console.log('[SW] Notification sent:', title)
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/app/calendar')
  )
})
