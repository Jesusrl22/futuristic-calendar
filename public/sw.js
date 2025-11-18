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
      const secondsUntilTask = Math.floor((taskTime - nowTime) / 1000)
      
      if (secondsUntilTask >= -30 && secondsUntilTask <= 30) {
        const message = secondsUntilTask <= 0 
          ? 'Your task is due now!'
          : `Task is due in ${Math.ceil(secondsUntilTask / 60)} minute(s)!`
        
      }
    }
  } catch (error) {
    console.error('[SW] Error checking tasks:', error)
  }
}

// Service Worker is now only for caching, not for notifications
// Notifications are handled by the calendar page itself
// To get multi-device notifications, you would need to implement Web Push API with a backend

// Handle notification click (if any notifications are sent)
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/app/calendar')
  )
})
