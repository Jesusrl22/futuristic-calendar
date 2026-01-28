# Email Templates Configuration Guide

This guide explains how to set up multilingual email templates for user confirmation and password reset in Supabase.

## Overview

The application includes localized email templates for:
- **Email Confirmation** (signup verification)
- **Password Reset** (forgot password)

Supported languages:
- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)
- 🇩🇪 German (de)
- 🇵🇹 Portuguese (pt)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇨🇳 Chinese (zh)

## Email Template Pages

### 1. Email Confirmation Page
**Location:** `/app/auth/confirm/page.tsx`

- **URL:** `https://yourdomain.com/auth/confirm`
- **Parameters:**
  - `token`: Email verification token from Supabase
  - `lang`: User's language preference (en, es, fr, it, de, pt, ja, ko, zh)
  - `email`: User's email address (optional)

- **Features:**
  - Displays confirmation message in user's language
  - One-click confirmation button
  - Beautiful responsive design
  - Handles expired links gracefully

### 2. Password Reset Page
**Location:** `/app/auth/reset/page.tsx`

- **URL:** `https://yourdomain.com/auth/reset`
- **Parameters:**
  - `token`: Password reset token from Supabase
  - `lang`: User's language preference
  - `email`: User's email address (optional)

- **Features:**
  - Displays reset instructions in user's language
  - Links to password reset form
  - Beautiful responsive design
  - Handles expired links gracefully

## Setup Instructions

### Step 1: Configure Supabase Auth Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Confirm Signup Template

1. Click on the **Confirm Signup** template
2. In the "Redirect URL" field, enter:
   \`\`\`
   https://yourdomain.com/auth/confirm?token={{ .Token }}&lang={{ .UserLanguage }}
   \`\`\`
   
   Or if using custom SMTP:
   \`\`\`
   https://yourdomain.com/auth/confirm?token=[TOKEN]&lang=[USER_LANGUAGE]
   \`\`\`

3. The template will automatically send users to this URL with the token

### Step 3: Configure Reset Password Template

1. Click on the **Reset Password** template
2. In the "Redirect URL" field, enter:
   \`\`\`
   https://yourdomain.com/auth/reset?token={{ .Token }}&lang={{ .UserLanguage }}
   \`\`\`

3. Click **Save**

### Step 4: Pass Language During Signup

In your signup API route (`/app/api/auth/signup/route.ts`), the language is stored in user metadata:

\`\`\`typescript
const { data: authData, error: authError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: false,
  user_metadata: {
    name: name,
    language: userLanguage, // This is sent with the email
  },
})
\`\`\`

The `language` from `user_metadata` will be passed as the `lang` parameter in the email links.

## Implementation Details

### Language Detection

The email template pages automatically detect the language from the URL parameter:

\`\`\`typescript
const lang = (searchParams.lang || "en") as LanguageCode
\`\`\`

### Translation System

Each page includes complete translations for all supported languages. The translations are stored in each component for easy maintenance.

### Design

- **Responsive Design:** Works perfectly on all devices
- **Email-Safe HTML:** Uses inline styles for email client compatibility
- **Accessible:** Proper semantic HTML and color contrast
- **Fast:** Minimal CSS and no external dependencies

## Environment Variables

Make sure these are set in your `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Testing

### Test Email Confirmation

1. Go to your signup page
2. Sign up with a new email
3. Check your email for the confirmation link
4. Click the link - you should see the confirmation page in your language
5. Click "Confirm Email" button

### Test Password Reset

1. Go to your login page
2. Click "Forgot Password?"
3. Enter an email address
4. Check your email for the reset link
5. Click the link - you should see the reset page in your language

## Troubleshooting

### Issue: Email template not appearing in user's language

**Solution:** 
- Verify that `user_metadata.language` is being set during signup
- Check that the language code matches one of the supported codes
- Ensure the `lang` parameter is being passed in the email template redirect URL

### Issue: Token not working on confirmation/reset page

**Solution:**
- Verify the `token` parameter is being passed correctly from the email
- Check that the token hasn't expired
- Ensure you're using the exact token from Supabase without modifications

### Issue: Emails not being sent

**Solution:**
- Check your Supabase email settings in Authentication → Settings → Email
- Verify you're using a confirmed email for testing
- Check the Supabase logs for any errors
- Ensure your app URL is correctly set in environment variables

## Custom SMTP Setup (Optional)

If you want to use custom email templates instead of Supabase's built-in ones:

1. Go to **Authentication** → **Settings**
2. Enable "Custom SMTP"
3. Configure your email service (SendGrid, Mailgun, etc.)
4. Create custom email templates in your provider
5. Include these links in your templates:
   - Confirmation: `https://yourdomain.com/auth/confirm?token=[TOKEN]&lang=[USER_LANGUAGE]`
   - Reset: `https://yourdomain.com/auth/reset?token=[TOKEN]&lang=[USER_LANGUAGE]`

## API Endpoints

### Setup Email Templates (Admin Only)

\`\`\`
POST /api/admin/setup-email-templates
Headers:
  x-admin-secret: [ADMIN_SECRET]

Response:
{
  "message": "Email templates configured",
  "templates": { ... },
  "instructions": { ... }
}
\`\`\`

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email#custom-email-templates)
- [NextJS App Router](https://nextjs.org/docs/app)

## Support

For issues or questions about the email setup:
1. Check the troubleshooting section above
2. Review your Supabase logs
3. Verify all environment variables are correctly set
4. Test with a personal email account first
