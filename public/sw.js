const CACHE_NAME = 'futuretask-v1'
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
      const secondsUntilTask = Math.floor((taskTime - nowTime) / 1000)
      
      if (secondsUntilTask >= -30 && secondsUntilTask <= 30) {
        const message = secondsUntilTask <= 0 
          ? 'Your task is due now!'
          : `Task is due in ${Math.ceil(secondsUntilTask / 60)} minute(s)!`
        
        // Send notification
        const options = {
          body: message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: { url: '/app/calendar' },
          vibrate: [200, 100, 200],
          tag: task.id || 'task-notification',
          requireInteraction: true,
        }
        
        self.registration.showNotification(task.title, options)
      }
    }
  } catch (error) {
    console.error('[SW] Error checking tasks:', error)
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  if (!event.data) {
    console.log('[SW] No push data')
    return
  }

  try {
    const data = event.data.json()
    console.log('[SW] Push data:', data)

    const options = {
      body: data.body,
      icon: data.icon || '/icon-192.png',
      badge: data.badge || '/icon-192.png',
      data: data.data || {},
      vibrate: [200, 100, 200],
      tag: data.data?.taskId || 'task-notification',
      requireInteraction: true,
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  } catch (error) {
    console.error('[SW] Error parsing push data:', error)
  }
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked')
  event.notification.close()

  const url = event.notification.data?.url || '/app/calendar'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes('/app') && 'focus' in client) {
          return client.focus().then(() => client.navigate(url))
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
