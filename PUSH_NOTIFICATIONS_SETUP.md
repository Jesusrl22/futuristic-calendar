# Web Push Notifications Setup Guide

This application uses Web Push API to send notifications to users on all their devices, even when the browser is closed.

## How It Works

1. **Service Worker**: Registers in the background and listens for push notifications
2. **Push Subscriptions**: Each device subscribes and stores a unique token in the database
3. **Cron Job**: Checks every 2 minutes for tasks due soon and sends push notifications
4. **Multi-Device**: Sends notifications to ALL devices where the user is logged in

## Setup Instructions

### 1. Generate VAPID Keys

VAPID keys are required for Web Push authentication. Generate them using the web-push library:

\`\`\`bash
npx web-push generate-vapid-keys
\`\`\`

This will output:
\`\`\`
Public Key: BNxN8fVYYYqF3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYqQzQ7F3dXQYQZJ_Hq
Private Key: cqL8c5Z5xQYqQzQ7F3dXQYQZJ_HqGJJPKqL8c5Z5xQYq
\`\`\`

### 2. Add Environment Variables

Add the generated keys to your Vercel project environment variables:

**In Vercel Dashboard:**
- Go to your project → Settings → Environment Variables
- Add these variables:

\`\`\`
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
\`\`\`

**Important:** 
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` must have the `NEXT_PUBLIC_` prefix (it's used in the browser)
- `VAPID_PRIVATE_KEY` should NOT have the prefix (it's server-side only)

### 3. Run Database Migration

Execute the SQL script to create the push_subscriptions table:

\`\`\`bash
# The script is located at: scripts/008_create_push_subscriptions.sql
\`\`\`

Or run it directly in your Supabase SQL editor.

### 4. Deploy

Deploy your application to Vercel. The cron job will automatically run every 2 minutes to check for tasks and send notifications.

## User Experience

### First Time Setup
1. User opens the calendar page
2. They see a banner: "Enable notifications to get reminders on all your devices"
3. Clicking "Enable" requests browser permission and subscribes the device
4. A green indicator shows: "Push notifications enabled on this device"

### Multi-Device Support
- User can enable notifications on multiple devices (phone, tablet, desktop)
- Each device gets its own subscription stored in the database
- When a task is due, ALL subscribed devices receive a notification
- Works even when the browser/app is completely closed

### Notification Timing
- Notifications are sent when a task is due (within 2 minutes of the due time)
- The cron job runs every 2 minutes: `*/2 * * * *`
- Each task is only notified once (tracked in the notifications table)

## Testing

1. Enable notifications on your device
2. Create a task due in 3-5 minutes
3. Close the browser completely
4. Wait for the notification to arrive

## Troubleshooting

### Notifications not arriving
- Check that VAPID keys are set in environment variables
- Verify the cron job is running in Vercel (check logs)
- Ensure the push_subscriptions table exists
- Check browser console for Service Worker errors

### Service Worker not registering
- Make sure sw.js is in the /public folder
- Check that the app is served over HTTPS (required for Service Workers)
- Clear browser cache and reload

### Multiple notifications
- The system uses the notifications table to prevent duplicates
- If you still get duplicates, check that the cron job isn't running too frequently

## Browser Support

- ✅ Chrome/Edge (Desktop & Android)
- ✅ Firefox (Desktop & Android)
- ✅ Safari (Desktop & iOS 16.4+) - Requires PWA installation
- ❌ Safari (iOS < 16.4)

**Note:** On iOS Safari, users must "Add to Home Screen" for push notifications to work.

## Database Schema

\`\`\`sql
push_subscriptions:
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- endpoint: TEXT (unique push endpoint)
- p256dh: TEXT (encryption key)
- auth: TEXT (authentication secret)
- user_agent: TEXT (device info)
- created_at: TIMESTAMP
- last_used_at: TIMESTAMP
\`\`\`

## API Endpoints

- `POST /api/push/subscribe` - Subscribe a device to push notifications
- `POST /api/push/send` - Send push notification to user's devices (internal)
- `GET /api/cron/check-task-notifications` - Cron job to check and send notifications

## Cost Considerations

- Web Push is free (no cost per notification)
- Vercel Cron jobs are included in all plans
- Database storage for subscriptions is minimal (~200 bytes per device)

## Privacy & Security

- Push subscriptions are encrypted end-to-end
- Each device has a unique endpoint and encryption keys
- Expired/invalid subscriptions are automatically cleaned up
- Users can unsubscribe by revoking browser permissions
