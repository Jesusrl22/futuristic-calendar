# Supabase Setup Guide

This guide will help you set up Supabase for the FutureTask application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: futuretask-app (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## Step 3: Get Your API Credentials

1. In your project dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:

### Project URL
\`\`\`
https://your-project-ref.supabase.co
\`\`\`
Copy this to `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local` file

### API Keys
Under "Project API keys", copy the **anon/public** key:
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`
Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local` file

## Step 4: Run Database Scripts

1. In Supabase dashboard, go to **SQL Editor** (in sidebar)
2. Click "New query"
3. Run each script in this order:

### 4.1: Create Tables
Copy and paste the content from `scripts/create-tables-v2.sql`
Click "Run" or press `Ctrl+Enter`

### 4.2: Add Subscription Management
Copy and paste the content from `scripts/add-subscription-management.sql`
Click "Run"

### 4.3: Add Email Verification
Copy and paste the content from `scripts/add-email-verification.sql`
Click "Run"

### 4.4: Add AI Credits System
Copy and paste the content from `scripts/add-ai-credits-system-v3.sql`
Click "Run"

### 4.5: Add Achievements System
Copy and paste the content from `scripts/add-achievements-system.sql`
Click "Run"

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure other providers (Google, GitHub, etc.)

### Email Settings
1. Go to **Authentication** → **Email Templates**
2. Customize confirmation email if desired
3. Set up SMTP for production (optional for development)

## Step 6: Update Your .env.local File

Create or update `.env.local` in your project root:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

## Step 7: Test the Connection

1. Start your development server:
\`\`\`bash
npm run dev
\`\`\`

2. Open http://localhost:3000
3. Check the browser console for:
\`\`\`
✅ Supabase client created successfully
\`\`\`

## Step 8: Create Your First User

1. Go to http://localhost:3000/login
2. Click "Register"
3. Fill in:
   - Name: Your Name
   - Email: your.email@example.com
   - Password: Strong password (min 6 characters)
4. Click "Register"

## Troubleshooting

### "Invalid supabaseUrl" Error
- Make sure the URL starts with `https://`
- Make sure there are no spaces or quotes in the .env.local file
- Restart your dev server after changing .env.local

### "Auth session missing" Error
- This is normal on the landing page
- Try logging in at /login first
- Check that authentication is enabled in Supabase dashboard

### "Failed to fetch" Error
- Check your internet connection
- Verify the Supabase project is active (not paused)
- Check the project URL is correct
- Check the anon key is correct

### Database Errors
- Make sure all SQL scripts were run successfully
- Check the SQL Editor history in Supabase
- Look for error messages in the query results

## Next Steps

Once Supabase is configured:

1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Create your first task
4. ✅ Explore the features

For production deployment, see `DEPLOYMENT_GUIDE.md`

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase dashboard → Logs
3. Review this guide again
4. Check Supabase documentation: https://supabase.com/docs
