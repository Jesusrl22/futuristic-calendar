// Web Push configuration and utilities
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BNxN8fVYYYqF3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ_Hq'
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'cqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYq'

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
